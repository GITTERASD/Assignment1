import './App.css';
import { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';

import Home from './components/Home';
import Settings from './components/Setting';
import { stranger_tune } from './tunes';

const STORAGE_KEY = 'beatlab-settings-v1';
const defaultSettings = {
    bpm: 120,
    p1: 'on',
    volume: 0.8,
    backingType: 'none',   
    backingVol: 0.5,
    boyPitch: 0,
    girlPitch: 0,
};

export default function App() {
    const [songText, setSongText] = useState(stranger_tune);
    const [settings, setSettings] = useState(() => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? { ...defaultSettings, ...JSON.parse(raw) } : defaultSettings;
        } catch {
            return defaultSettings;
        }
    });

    const navigate = useNavigate();

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
        a.href = url; a.download = 'beatlab-settings.json'; a.click();
        URL.revokeObjectURL(url);
    };
    const importSettings = (obj) => setSettings({ ...defaultSettings, ...obj });

    const controller = {
        songText, setSongText,
        settings, setSettings,
        saveSettings, loadSettings, exportSettings, importSettings,
    };

    return (
        <div className="min-h-screen bg-surface">
            <header className="container py-4 d-flex align-items-center gap-3">
                <img src="/ui/logo-mark.svg" alt="BeatLab" height={36}
                    onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <h1 className="m-0 fw-bold">BeatLab  Strudel</h1>
                <div className="ms-auto">
                    <Link className="btn btn-primary" to="/settings">Settings</Link>
                </div>
            </header>

            <Routes>
                <Route path="/" element={<Home controller={controller} />} />
                <Route path="/settings"
                    element={<Settings controller={controller}
                        onClose={() => navigate(-1)} />} />
            </Routes>
        </div>
    );
}
