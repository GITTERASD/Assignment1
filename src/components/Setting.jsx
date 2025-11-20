
import { Link } from "react-router-dom"; //link to close the overlay

//patch is the newly updated piece of data
export default function Settings({ controller, onClose }) {
    const { settings, setSettings, saveSettings, loadSettings, exportSettings, importSettings } = controller; //from app
    const update = (patch) => setSettings(s => ({ ...s, ...patch })); // update() merges small changes (patches) into the settings object

    //quickly apply - 4 or + 4 semitone pitch adjustments for pitch type
    const setBoyPreset = () => update({ pitchSemitones: -4, backingType: settings.backingType || "boys" }); 
    const setGirlPreset = () => update({ pitchSemitones: +4, backingType: settings.backingType || "girls" });

    return (
        <main className="container">
            <div className="row justify-content-center">
                <div className="col-lg-8">
                    <div className="card rounded-4 shadow-lg">
                        <div className="card-header bg-gradient-primary d-flex align-items-center">
                            <h2 className="m-0">Settings</h2>
                            {/*go back to home link that hides the overlay*/}
                            {/*prevent going back to default*/}
                            <Link className="btn btn-accent ms-auto" to="?" onClick={(e) => { e.preventDefault(); onClose(); }}>Close</Link>
                        </div>

                        <div className="card-body">
                        {/*bpm*/}
                            <label className="form-label">BPM</label>
                            <input
                                className="form-control"
                                type="number" min="40" max="220"
                                value={settings.bpm}
                                //updates
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
                                        //target is the input and value is to get the value of the input so it updates on change
                                        onChange={(e) => update({ pitchSemitones: Number(e.target.value) })}
                                    />
                                </div>
                                <div className="d-flex gap-2">
                                    <button className="btn settings-btn-boy" onClick={setBoyPreset}>Boy pitch</button>
                                    <button className="btn settings-btn-girl" onClick={setGirlPreset}>Girl pitch</button>
                                </div>
                            </div>

                            <div className="d-flex gap-2 mt-4 flex-wrap">
                            {/*onclickbutton that saves loads and exports*/}
                                <button className="btn settings-btn" onClick={saveSettings}>Save</button>
                                <button className="btn settings-btn" onClick={loadSettings}>Load</button>
                                <button className="btn settings-btn" onClick={exportSettings}>Export</button>

                                
                                <label className="btn settings-btn settings-btn-import m-0">
                                    Import
                                    {/*the file to import is restricted to the json file*/}
                                    <input
                                        hidden
                                        type="file"
                                        accept="application/json"
                                        // triggered when user selects file; safely target the first file or exit if none
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
