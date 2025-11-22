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
import D3Graph from './D3Graph';


function buildPlaybackCode(text, song, comboBeat) {
    // 1) force BPM at the very top
    let out = `setcps(${song.bpm}/60/4)\n` + text;
    const raw = song.pitchSemitones ?? 0; // use the pitchSemitones if not working than use 0, raw is the slide value
    const semis = Math.round(Math.sign(raw) * Math.pow(Math.abs(raw) / 5, 1.25) * 12); //formula to create pitch
    const rate = Number((2 ** (semis / 12)).toFixed(4));

    //build two strudel command that runs everyround
    //serves for volume and pitch
    const master = `
all(x => x.gain(${song.volume}))
all(x => x.speed(${rate})) 
`;

//this is block of math for the intrument mix to be in tunes.
    if (comboBeat && comboBeat.trim().length > 0) {
        out += `\n\n${comboBeat}\n`;
    }

    out += master;
    return out; // returns the output of repl
}

export default function Home({ controller }) {
    const { songText, setSongText, settings, isPlaying} = controller; //read from app.js controller prop
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
        const code = buildPlaybackCode(songText, settings, comboBeat);
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
        if (!root || !canvas) return;

        root.innerHTML = '';

      
        const drawContext = canvas.getContext('2d');
        canvas.width = canvas.width * 2;
        canvas.height = canvas.height * 2;
        const drawTime = [-2, 2];

        initAudioOnFirstClick();

        const globalEditor = new StrudelMirror({
            defaultOutput: webaudioOutput,
            getTime: () => getAudioContext().currentTime,
            transpiler,
            root,
            drawTime,
            onDraw: (haps, time) =>
                drawPianoroll({
                    haps,
                    time,
                    ctx: drawContext,
                    drawTime,
                    fold: 0,
                }),
            prebake: async () => {
                const loadModules = evalScope(
                    import('@strudel/core'),
                    import('@strudel/draw'),
                    import('@strudel/mini'),
                    import('@strudel/tonal'),
                    import('@strudel/webaudio'),
                );
                await Promise.all([
                    loadModules,
                    registerSynthSounds(),
                    registerSoundfonts(),
                ]);
            },
        });

        editorRef.current = globalEditor;
        window.globalEditor = globalEditor;

        apply(false);

        return () => {
            editorRef.current?.stop();
            editorRef.current = null;
        };
    }, []); 

 

useEffect(() => {
    apply(isPlaying);
}, [settings, isPlaying, selectedBeatId, songText]);

    return (
        <main className="container pb-5">
            <div className="row g-4">
                <div className="col-12 col-lg-7 mb-4 mb-lg-0">
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

                <div className="col-12 col-lg-5">
                    <div className="card shadow-lg rounded-4">
                        <div className="card-header bg-gradient-primary text-dark fw-semibold">
                            Transport & Controls
                        </div>
                        <div className="card-body">
                            <nav className="mb-3 d-flex flex-wrap align-items-start gap-4">
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

                            <D3Graph />
                        </div>
                    </div>

                </div>
            </div>
        </main>
    );
}
