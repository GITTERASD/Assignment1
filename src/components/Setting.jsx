
export default function Settings({ controller, onClose }) {
    const { settings, setSettings, saveSettings, loadSettings, exportSettings, importSettings } = controller;
    const update = (patch) => setSettings(s => ({ ...s, ...patch }));

    const setBoyPreset = () => update({ pitchSemitones: -4, backingType: settings.backingType || "boys" });
    const setGirlPreset = () => update({ pitchSemitones: +4, backingType: settings.backingType || "girls" });

    return (
        <main className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card rounded-4 shadow-lg">
                        <div className="card-header d-flex align-items-center">
                            <h2 className="m-0">Settings</h2>
                            <button className="btn btn-outline-secondary ms-auto" onClick={onClose}>Close</button>
                        </div>

                        <div className="card-body">

                            <label className="form-label">BPM</label>
                            <input
                                className="form-control"
                                type="number" min="40" max="220"
                                value={settings.bpm}
                                onChange={(e) => update({ bpm: Number(e.target.value) || 120 })}
                            />

                            <div className="mt-3">
                                <label className="form-label">Master Volume: {settings.volume.toFixed(2)}</label>
                                <input
                                    className="form-range"
                                    type="range" min="0" max="1" step="0.01"
                                    value={settings.volume}
                                    onChange={(e) => update({ volume: Number(e.target.value) })}
                                />
                            </div>

                  

                            <div className="mt-3 d-flex align-items-center gap-3 flex-wrap">
                                <div className="flex-grow-1">
                                    <label className="form-label">
                                        Pitch (semitones): {settings.pitchSemitones}
                                    </label>
                                    <input
                                        className="form-range"
                                        type="range" min="-12" max="12" step="1"
                                        value={settings.pitchSemitones}
                                        onChange={(e) => update({ pitchSemitones: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn btn-outline-light" onClick={setBoyPreset}>Boy pitch</button>
                                    <button className="btn btn-outline-light" onClick={setGirlPreset}>Girl pitch</button>
                                </div>
                            </div>

                            <div className="d-flex gap-2 mt-4">
                                <button className="btn btn-outline-light" onClick={saveSettings}>Save</button>
                                <button className="btn btn-outline-light" onClick={loadSettings}>Load</button>
                                <button className="btn btn-outline-light" onClick={exportSettings}>Export</button>

                                <label className="btn btn-outline-light m-0">
                                    Import
                                    <input
                                        hidden
                                        type="file"
                                        accept="application/json"
                                        onChange={(e) => {
                                            const f = e.target.files?.[0];
                                            if (!f) return;
                                            const r = new FileReader();
                                            r.onload = () => {
                                                try { importSettings(JSON.parse(r.result)); }
                                                catch { alert('Bad JSON'); }
                                            };
                                            r.readAsText(f);
                                        }}
                                    />
                                </label>
                            </div>

                  
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
