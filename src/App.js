import './App.css';
import { useState } from 'react';
import { Routes, Route, Link, useSearchParams } from 'react-router-dom';
import Home from './components/Home';
import Settings from './components/Setting';
import { stranger_tune } from './tunes';
const STORAGE_KEY = 'beatlab-settings-v1'; //local storage that remembers previous settings, if removed all will be back to default

const defaultSettings = { // the defaultsettings when open the webpage. basically gives a starting point to the usestate
    bpm: 120,
    volume: 0.8,
    pitchSemitones: 0,
};

//app
export default function App() {
    const [params, setParams] = useSearchParams(); // used for the routes that opens setting
    const [isSettingsOpen, setIsSettingsOpen] = useState(false); // boolean to track if the settings overlay is open
    const [isPlaying, setIsPlaying] = useState(false); // tracks if Strudel is currently playing (used to control UI state)
    const [songText, setSongText] = useState(stranger_tune); //run the strangertune
    const [settings, setSettings] = useState(() => {
        try { // used by home to pro&play and by settings to change slider,save/load json
            const raw = localStorage.getItem(STORAGE_KEY); //raw gets the previous memory
            return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings; // and than return it either new or default setting
        } catch {
            return defaultSettings;
        }
    });



    // JSON helpers
    const saveSettings = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(settings)); //when pressed saving the setting is stored
    const loadSettings = () => {
        try { //reads the saved setting and applies it
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) setSettings({ ...defaultSettings, ...JSON.parse(raw) }); //having 3 dots means getting the three objects from defaultSetting
        } catch { }
    };

    //download
    const exportSettings = () => {
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'beatlab-settings.json';
        a.click();
        URL.revokeObjectURL(url);
    };

    //can open up a json file from local
    const importSettings = (obj) => setSettings({ ...defaultSettings, ...obj });

    //to replace the bpm and vol placeholder
    const preprocess = (t, s) => {
        let out = t;
     
        out = out.replaceAll('<BPM>', String(s.bpm));
        out = out.replaceAll('<VOL>', String(s.volume));
        return out; // <-- add return
    }; 



    //button actions
    //updates the Repl from the input text and the settings
    const handleProcess = () => {
        const processed = preprocess(songText, settings);
        setSongText(processed);
        //this is used to sent newcode to repl
        window.globalEditor?.setCode?.(processed);
    };
    //having many ? just to make the error undefined instead of crashing
    const handleProcPlay = () => {
        handleProcess();
        window.globalEditor?.evaluate?.();
    };

    const handlePlay = () => { window.globalEditor?.evaluate?.(); setIsPlaying(true); };//updates playing status to true when play
    const handleStop = () => { window.globalEditor?.stop?.(); setIsPlaying(false); }; //make playing false when stop

    //this is created for both setting and home to use it
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

              

                <img //no image yet
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
            this is navigate to home and passes the controller
                <Route path="/" element={<Home controller={controller} />} />
            </Routes>

           
            {/*the settings will be open if the link is clicked and the onclose is true that remove the overlay*/}
            {params.get('settings') === 'open' && (
                      //overlay a small panel window if not it will just show on the default page
                        <div className="overlay">
                    <div className="overlay-card">
                        {/*this navigate to setting only if the setting is open*/}
                                    <Settings controller={controller}
                                      onClose={() => setParams({}, { replace: true })}/>
                                  </div>
                            </div>
                      )}

        </div>
    );
} 