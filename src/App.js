import './App.css';
import { useEffect, useRef, useState } from "react";
import { StrudelMirror } from '@strudel/codemirror';
import { evalScope } from '@strudel/core';
import { drawPianoroll } from '@strudel/draw';
import { initAudioOnFirstClick } from '@strudel/webaudio';
import { transpiler } from '@strudel/transpiler';
import { getAudioContext, webaudioOutput, registerSynthSounds } from '@strudel/webaudio';
import { registerSoundfonts } from '@strudel/soundfonts';
import { stranger_tune } from './tunes';
import console_monkey_patch, { getD3Data } from './console-monkey-patch';
import DjControls from "./components/Dj_Controls";
import PlayButtons from "./components/PlayButtons";
import PlayProButtons from "./components/PlayProButtons"
import ProcessTextArea from "./components/ProcessTextArea";

let globalEditor = null;

const STORAGE_KEY = 'beatlab-settings-v1';

const defaultSettings = {
    bpm: 120,
    p1: 'on',                
    volume: 0.8,              
    backingType: 'none',      
    backingVol: 0.5,          
    boyPitch: 0,              
    girlPitch: 0              
};

const handleD3Data = (event) => {
    console.log(event.detail);
};

// we've got buttons here for me to click.process,proc,play and stop
//export function SetupButtons() {

//    document.getElementById('play').addEventListener('click', () => globalEditor.evaluate());
//    document.getElementById('stop').addEventListener('click', () => globalEditor.stop());
//    document.getElementById('process').addEventListener('click', () => {
//        Proc()
//    }
//    )
//    document.getElementById('process_play').addEventListener('click', () => {
//        if (globalEditor != null) {
//            Proc()
//            globalEditor.evaluate()
//        }
//    }
//    )
//}


//export function ProcAndPlay() {
//    if (globalEditor != null && globalEditor.repl.state.started == true) {
//        console.log(globalEditor)
//        Proc()
//        globalEditor.evaluate();
//    }
//}

//export function Proc() {

//    let proc_text = document.getElementById('proc').value
//    let proc_text_replaced = proc_text.replaceAll('<p1_Radio>', ProcessText);
//    ProcessText(proc_text);
//    globalEditor.setCode(proc_text_replaced)
//}

//export function ProcessText(match, ...args) {

//    let replace = ""
//    if (document.getElementById('flexRadioDefault2').checked) {
//        replace = "_"
//    }

//    return replace
//}

// map semitone shift -> playback speed factor
const semitoneToSpeed = (st) => Number(Math.pow(2, st / 12).toFixed(4));
export default function StrudelDemo() {
    //commented out all the javascript for some features and now doing the react way. Here is the react logic of doing play and stop.
    //than pass to the bottom
    const [songText, setSongText] = useState(stranger_tune)
    const [settings, setSettings] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
        } catch {
            return defaultSettings;
        }
    });

    const hasRun = useRef(false);
    const preprocess = (t, s) => {
        let out = t;

        // 1) simple tokens
        out = out.replaceAll('<p1_Radio>', s.p1 === 'hush' ? '_' : '');
        out = out.replaceAll('<BPM>', String(s.bpm));
        out = out.replaceAll('<VOL>', String(s.volume));

        // 2) optional backing vocal block (safe: will just be a synth layer)
        const backingParts = [];
        if (s.backingType !== 'none') {
            const voiceRows = [];
            const boy = `.sound("supersaw").speed(${semitoneToSpeed(s.boyPitch)}).gain(${s.backingVol})`;
            const girl = `.sound("supersaw").speed(${semitoneToSpeed(s.girlPitch)}).gain(${s.backingVol})`;

            // choose rows by type
            if (s.backingType === 'boys') voiceRows.push(`s("~ [c5]*2 ~ [g4]*2")${boy}`);
            if (s.backingType === 'girls') voiceRows.push(`s("[e5]*2 ~ [b4]*2 ~")${girl}`);
            if (s.backingType === 'children') voiceRows.push(`s("[c6 e6 g6]*4")${girl}`);
            if (s.backingType === 'mixed') {
                voiceRows.push(`s("~ [c5]*2 ~ [g4]*2")${boy}`);
                voiceRows.push(`s("[e5]*2 ~ [b4]*2 ~")${girl}`);
            }

            const stack = voiceRows.length ? `backvox:\nstack(\n  ${voiceRows.join(',\n  ')}\n)\n` : '';
            if (stack) backingParts.push(stack);
        }

        // 3) global volume helper (safe, works even if no <VOL> token present)
        const master = `\n// master mix\nall(x => x.gain(${settings.volume}))\n`;

        const backingBlock = `${backingParts.join('\n')}${master}`;

        // If user placed <BACKING_BLOCK>, replace it; otherwise append at end.
        if (out.includes('<BACKING_BLOCK>')) {
            out = out.replaceAll('<BACKING_BLOCK>', backingBlock);
        } else {
            out = `${out}\n${backingBlock}`;
        }

        return out;
    };

    // JSON helpers
    const saveSettings = () => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    };
    const loadSettings = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setSettings({ ...defaultSettings, ...JSON.parse(raw) });
        } catch { /* ignore */ }
    };
    const exportSettings = () => {
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = 'beatlab-settings.json'; a.click();
        URL.revokeObjectURL(url);
    };
    const importSettings = (obj) => {
        setSettings({ ...defaultSettings, ...obj });
    };


    const handleProcess = () => {
        const p = preprocess(songText);
        setSongText(p);
        globalEditor.setCode(p);
    };

    const handleProcPlay = () => {
        const p = preprocess(songText);
        setSongText(p);
        globalEditor.setCode(p);
        globalEditor.evaluate();
    };

    const handlePlay = () => {
        globalEditor.evaluate()
    }

    const handleStop = () => {
        globalEditor.stop()
    }


    useEffect(() => {

        if (!hasRun.current) {
            document.addEventListener("d3Data", handleD3Data );
            console_monkey_patch();
            hasRun.current = true;
            //Code copied from example: https://codeberg.org/uzu/strudel/src/branch/main/examples/codemirror-repl
            //init canvas
            const canvas = document.getElementById('roll');
            canvas.width = canvas.width * 2;
            canvas.height = canvas.height * 2;
            const drawContext = canvas.getContext('2d');
            const drawTime = [-2, 2]; // time window of drawn haps
            globalEditor = new StrudelMirror({
                defaultOutput: webaudioOutput,
                getTime: () => getAudioContext().currentTime,
                transpiler,
                root: document.getElementById('editor'),
                drawTime,
                onDraw: (haps, time) => drawPianoroll({ haps, time, ctx: drawContext, drawTime, fold: 0 }),
                prebake: async () => {
                    initAudioOnFirstClick(); // needed to make the browser happy (don't await this here..)
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

            document.getElementById('proc').value = stranger_tune
            //SetupButtons()
            //Proc()
        }


        globalEditor.setCode(songText)// This sets the Strudel editor content to the current songText state.
    }, [songText]);// (If [songText] were included in useEffect dependencies, this would rerun whenever songText changes.)


    return (
        <div className="min-h-screen bg-surface">
            <header className="container py-4 d-flex align-items-center gap-3">
                <img src="/ui/logo-mark.svg" alt="BeatLab" height="36" />
                <h1 className="m-0 fw-bold">BeatLab ¡¤ Strudel</h1>
            </header>
            <main className="container pb-5">
         
                <div className="row g-4">
            <div className="col-lg-7">
                <div className="card shadow-lg rounded-4 overflow-hidden">
                    <div className="card-header bg-gradient-primary text-white fw-semibold">
                        Composer
                    </div>
                    <div className="card-body">
                        <ProcessTextArea defaultValue={songText} onChange={(e) => setSongText(e.target.value)} />
                        {/* use a lambda where e is the input that takes new text (e.target.value) and updates the state variabl songText */}
                        <div id="editor" className="mt-3" />
                        <div id="output" />
                        <canvas id="roll" className="w-100 mt-3"></canvas>
                    </div>
                </div>
            </div>
            <div className="col-lg-5">
                <div className="card shadow-lg rounded-4">
                    <div className="card-header bg-gradient-primary text-white fw-semibold">
                        Transport & Controls
                    </div>
                    <div className="card-body">
                        <nav className="mb-3">
                            <PlayProButtons onProcess={handleProcess} onProcPlay={handleProcPlay} />
                            <span className="mx-2" />
                            {/*than pass to jsx of Play*/}
                            <PlayButtons onPlay={handlePlay} onStop={handleStop} />
                        </nav>
                        {/*    </div>*/}
                        {/*</div>*/}
                        {/*<div className="row">*/}
                        {/*    <div className="col-md-8" style={{ maxHeight: '50vh', overflowY: 'auto' }}>*/}
                        {/*        <div id="editor" />*/}
                        {/*        <div id="output" />*/}
                        {/*    </div>*/}
                        {/*    <div className="col-md-4">*/}
                        <DjControls
                        settings={settings}
                        onSettingsChange={setSettings}
                        onSave={saveSettings}
                        onLoad={loadSettings}
                        onExport={exportSettings}
                        onImport={importSettings}
                />
                    </div>
                </div>

                <div className="text-muted small mt-2">
                    Tip: add tokens like <code>&lt;VOL&gt;</code>, <code>&lt;BPM&gt;</code>,
                    <code>&lt;p1_Radio&gt;</code>, or <code>&lt;BACKING_BLOCK&gt;</code> in your code to let
                    the preprocessor inject mix and backing voices automatically.
                </div>
            </div>
        </div>
      </main >
    </div >
  );
}