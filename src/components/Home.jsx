import { useEffect, useRef,useState } from 'react';
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { transpiler } from '@strudel/transpiler';
import { initAudioOnFirstClick, getAudioContext, webaudioOutput, registerSynthSounds} from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import ProcessTextArea from './ProcessTextArea';
import PlayButtons from './PlayButtons';
import PlayProButtons from './PlayProButtons';
import beats from '../beats.json';
import BeatSelector from './BeatSelector';
import DeckInfo from './DeckInfo';

function preprocess(text, song, comboBeat) {
    // 1) force BPM at the very top
    let out = `setcps(${song.bpm}/60/4)\n` + text;
    //const rate = Number(Math.pow(2, (s.pitchSemitones || 0) / 12).toFixed(4));
    const raw = song.pitchSemitones ?? 0; // use the pitchSemitones if not working than use 0
    const semis = Math.round(Math.sign(raw) * Math.pow(Math.abs(raw) / 5, 1.25) * 12); //formula to create pitch
    const rate = Number((2 ** (semis / 12)).toFixed(4));

    //build two strudel command that runs everyround
    const master = `
all(x => x.gain(${song.volume}))
all(x => x.speed(${rate})) 
`;

    if (comboBeat && comboBeat.trim().length > 0) {
        out += `\n\n${comboBeat}\n`;
    }

    out += master;
    return out; // returns the output of repl
}

export default function Home({ controller }) {
    const { songText, setSongText, settings, isPlaying} = controller; //read from app.js controller
    //refs used to acces DOM elements
    const [selectedBeatId, setSelectedBeatId] = useState('original');
    const editorHostRef = useRef(null);
    const rollRef = useRef(null);
    const editorRef = useRef(null);   

    const currentBeat = beats.find(b => b.id === selectedBeatId) || beats[0];

    //preprocess the song with the current setting
    const apply = (evaluate = false) => {
        if (!editorRef.current) return;
        const selectedBeat = beats.find(b => b.id === selectedBeatId);
        const comboBeat = selectedBeat?.code || "";
        const code = preprocess(songText, settings, comboBeat);
        //edit the repl with new code and 
        editorRef.current.setCode(code);
        //if evaluate is true
        if (evaluate) editorRef.current.evaluate();
    };
     const handlePlay = controller.handlePlay;
     const handleStop = controller.handleStop;
    const handleProcess = () => apply(false);
    const handleProcPlay = () => apply(true);


 
    useEffect(() => {
        const root = editorHostRef.current;
        const canvas = rollRef.current;
        if (!root || !canvas) return;// stop if either element is missing


        root.innerHTML = '';

        initAudioOnFirstClick();

        //shapes th effect box
        const ctx = canvas.getContext('2d');
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const PIXEL_HEIGHT = 240;
        const sizeCanvas = () => {
            // function that keeps the canvas size matching the window
            const rect = canvas.getBoundingClientRect();
            canvas.width = Math.max(1, Math.floor(rect.width * dpr));
            canvas.height = Math.max(1, Math.floor(PIXEL_HEIGHT * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        sizeCanvas();
        window.addEventListener('resize', sizeCanvas);

        const drawTime = [-2, 2];
        const globalEditor = new StrudelMirror({
            defaultOutput: webaudioOutput,
            getTime: () => getAudioContext().currentTime,
            transpiler,
            root,
            drawTime,
            onDraw: (haps, time) => {
                const W = canvas.width / dpr, H = canvas.height / dpr;
                ctx.clearRect(0, 0, W, H);
                //shapes the notes to effect
                drawPianoroll({ haps, time, ctx, drawTime, fold: 0 });

                // extra "drum pulse" overlay so you see non-pitched hits
                const span = (time[1] - time[0]) || 1;
                let lane = 0;
                for (const h of haps) {
                    const pitched = (h && (h.note != null || h.freq != null));
                    if (pitched) continue;
                    // extra overlay for unpitched sounds (like drums)
                    const hs = Math.max(0, (h?.start ?? h?.s ?? time[0]) - time[0]) / span;
                    const he = Math.max(hs, (h?.end ?? h?.e ?? time[0]) - time[0]) / span;
                    const x = hs * W, w = Math.max(2, (he - hs) * W), y = H - (lane % 3 + 1) * 16;
                    lane++;
                    ctx.fillStyle = 'rgba(176,133,255,.65)';
                    ctx.fillRect(x, y, w, 10);
                }
            },
            prebake: async () => {
                const loadModules = evalScope(
                    import('@strudel/core'),
                    import('@strudel/draw'),
                    import('@strudel/mini'),
                    import('@strudel/tonal'),
                    import('@strudel/webaudio'),
                );
                await Promise.all([loadModules, registerSynthSounds(), registerSoundfonts()]);
            },
        });
        editorRef.current = globalEditor;
        window.globalEditor = globalEditor;

        // show initial code
        apply(false);

        return () => {
            window.removeEventListener('resize', sizeCanvas);
            editorRef.current?.stop();
            editorRef.current = null;
        };
        globalEditor.setCode(songText);
        
    }, [songText]); // mount once


useEffect(() => {
  apply(isPlaying);
}, [settings, isPlaying, selectedBeatId]);

    return (
        <main className="container pb-5">
            <div className="row g-4">
                <div className="col-lg-7">
                    <div className="card shadow-lg rounded-4 overflow-hidden">
                        <div className="card-header bg-gradient-primary text-dark fw-semibold">Composer</div>
                        <div className="card-body">
                            <ProcessTextArea
                                defaultValue={songText}
                                onChange={(e) => setSongText(e.target.value)}
                            />
                            <div ref={editorHostRef} id="editor" className="mt-3" />
                            <div id="output" />
                            <canvas ref={rollRef} id="roll" className="w-100 mt-3" />
                        </div>
                    </div>
                </div>

                <div className="col-lg-5">
                    <div className="card shadow-lg rounded-4 mb-5">
                        <div className="card-header bg-gradient-primary text-dark fw-semibold">
                            Transport & Controls
                        </div>
                        <div className="card-body">
                            <nav className="mb-3 d-flex gap-2">
                                <PlayProButtons onProcess={handleProcess} onProcPlay={handleProcPlay} />
                                <PlayButtons onPlay={handlePlay} onStop={handleStop} />
                            </nav>
                        </div>
                    </div>

                    <div className="card shadow-lg rounded-4">
                        <div className="card-header bg-gradient-primary text-dark fw-semibold">
                            Instrument mix
                        </div>
                        <div className="card-body">
                            <BeatSelector
                                beats={beats}
                                selectedId={selectedBeatId}
                                onChange={setSelectedBeatId}
                            />
                            <DeckInfo
                                bpm={settings.bpm}
                                volume={settings.volume}
                                pitch={settings.pitchSemitones}
                                mixName={currentBeat.name}
                            />

                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
