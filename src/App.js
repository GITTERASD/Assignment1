import './App.css';
import { useState } from 'react';
import { Routes, Route, Link, useSearchParams } from 'react-router-dom';
import Home from './components/Home';
import Settings from './components/Setting';
import { stranger_tune } from './tunes';
const STORAGE_KEY = 'beatlab-settings-v1'; //local storage that remembers previous settings

const defaultSettings = {
    bpm: 120,
    volume: 0.8,
    pitchSemitones: 0,
};


export default function App() {
    const [params, setParams] = useSearchParams();
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [songText, setSongText] = useState(stranger_tune); //run the strangertune
    const [settings, setSettings] = useState(() => {
        try { // used by home to pro&play and by settings to change slider,save/load json
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
        } catch {
            return defaultSettings;
        }
    });



    // JSON helpers
    const saveSettings = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    const loadSettings = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setSettings({ ...defaultSettings, ...JSON.parse(raw) });
        } catch { }
    };
    const exportSettings = () => {
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'beatlab-settings.json';
        a.click();
        URL.revokeObjectURL(url);
    };
    const importSettings = (obj) => setSettings({ ...defaultSettings, ...obj });

    const preprocess = (t, s) => {
        let out = t;
     
        out = out.replaceAll('<BPM>', String(s.bpm));
        out = out.replaceAll('<VOL>', String(s.volume));
        return out; // <-- add return
    }; 

    const handleProcess = () => {
        const p = preprocess(songText, settings);
        setSongText(p);

        

        window.globalEditor?.setCode?.(p);
    };

    const handleProcPlay = () => {
        handleProcess();
        window.globalEditor?.evaluate?.();
    };

    const handlePlay = () => { window.globalEditor?.evaluate?.(); setIsPlaying(true); };
    const handleStop = () => { window.globalEditor?.stop?.(); setIsPlaying(false); };

    const controller = {
        songText,
        setSongText,
        settings,
        setSettings,
        saveSettings,
        loadSettings,
        exportSettings,
        importSettings,
        preprocess,
        handleProcess,
        handleProcPlay,
        handlePlay,
        handleStop,
        isSettingsOpen,
        setIsSettingsOpen,
        isPlaying,
        setIsPlaying,
   
    };

    return (
        <div className="min-h-screen bg-surface">
            <header className="container py-4 d-flex align-items-center gap-3">

                <img
                    src=""

                <img //no image yer
                    src=""

                    alt="BeatLab"
                    height={36}
                    onError={(e) => {
                        e.currentTarget.style.display = 'none';
                    }}
                />
                <h1 className="m-0 fw-bold">BeatLab Strudel</h1>
                <div className="ms-auto">
                    {/*useSearchParams manage the ?settings=open*/}
                    <Link className="btn btn-primary" to="?settings=open">Settings</Link>
                </div>
            </header>

            <Routes>
            {/*this is navigate to home*/}

                <Route path="/" element={<Home controller={controller} />} />
            </Routes>

                  {params.get('settings') === 'open' && (
                        <div className="overlay">
                              <div className="overlay-card">
                                    <Settings controller={controller}
                                      onClose={() => setParams({}, { replace: true })}/>
                                  </div>
                            </div>
                      )}

        </div>
    );
} 