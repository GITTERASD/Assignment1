import { useEffect, useRef } from 'react';
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { transpiler } from '@strudel/transpiler';
import { initAudioOnFirstClick, getAudioContext, webaudioOutput, registerSynthSounds} from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import ProcessTextArea from './ProcessTextArea';
import PlayButtons from './PlayButtons';
import PlayProButtons from './PlayProButtons';



function preprocess(text, s) {
    // 1) force BPM at the very top
    let out = `setcps(${s.bpm})\n` + text;


    const master = `\nall(x => x.gain(${s.volume}))\n`;

    out += master;
    return out;
}

export default function Home({ controller }) {
    const { songText, setSongText, settings } = controller;

    const editorHostRef = useRef(null);
    const rollRef = useRef(null);
    const editorRef = useRef(null);   

    const apply = (evaluate = false) => {
        if (!editorRef.current) return;
        const code = preprocess(songText, settings);
        editorRef.current.setCode(code);
        if (evaluate) editorRef.current.evaluate();
    };
    const handlePlay = () => editorRef.current?.evaluate();
    const handleStop = () => editorRef.current?.stop();
    const handleProcess = () => apply(false);
    const handleProcPlay = () => apply(true);

 
    useEffect(() => {
        const root = editorHostRef.current;
        const canvas = rollRef.current;
        if (!root || !canvas) return;

        root.innerHTML = '';

        initAudioOnFirstClick();

        const ctx = canvas.getContext('2d');
        const dpr = Math.max(1, window.devicePixelRatio || 1);
        const PIXEL_HEIGHT = 240;
        const sizeCanvas = () => {
            const rect = canvas.getBoundingClientRect();
            canvas.width = Math.max(1, Math.floor(rect.width * dpr));
            canvas.height = Math.max(1, Math.floor(PIXEL_HEIGHT * dpr));
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };
        sizeCanvas();
        window.addEventListener('resize', sizeCanvas);

        const drawTime = [-2, 2];
        const editor = new StrudelMirror({
            defaultOutput: webaudioOutput,
            getTime: () => getAudioContext().currentTime,
            transpiler,
            root,
            drawTime,
            onDraw: (haps, time) => {
                const W = canvas.width / dpr, H = canvas.height / dpr;
                ctx.clearRect(0, 0, W, H);
                drawPianoroll({ haps, time, ctx, drawTime, fold: 0 });

                // extra "drum pulse" overlay so you see non-pitched hits
                const span = (time[1] - time[0]) || 1;
                let lane = 0;
                for (const h of haps) {
                    const pitched = (h && (h.note != null || h.freq != null));
                    if (pitched) continue;
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
        editorRef.current = editor;

        // show initial code
        apply(false);

        return () => {
            window.removeEventListener('resize', sizeCanvas);
            editorRef.current?.stop();
            editorRef.current = null;
        };
        
    }, []); // mount once


    useEffect(() => {
        const id = setTimeout(() => apply(false), 150);
        return () => clearTimeout(id);
   
    }, [settings]);

    return (
        <main className="container pb-5">
            <div className="row g-4">
                <div className="col-lg-7">
                    <div className="card shadow-lg rounded-4 overflow-hidden">
                        <div className="card-header bg-gradient-primary text-white fw-semibold">Composer</div>
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
                    <div className="card shadow-lg rounded-4">
                        <div className="card-header bg-gradient-primary text-white fw-semibold">
                            Transport & Controls
                        </div>
                        <div className="card-body">
                            <nav className="mb-3 d-flex gap-2">
                                <PlayProButtons onProcess={handleProcess} onProcPlay={handleProcPlay} />
                                <PlayButtons onPlay={handlePlay} onStop={handleStop} />
                            </nav>
            
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
