
import { useState, useRef } from "react";
import { Link } from "react-router-dom"; //link to close the overlay

//patch is the newly updated piece of data
export default function Settings({ controller, onClose }) {
    const { settings, setSettings, saveSettings, loadSettings, exportSettings, importSettings } = controller; //from app
    const update = (patch) => setSettings(s => ({ ...s, ...patch })); // update() merges small changes (patches) into the settings object
    // message shown in the Bootstrap alert
    // { type: "success" | "danger" | "info", text: string }
    const [message, setMessage] = useState(null);

    // hidden file input for Import
    const fileInputRef = useRef(null);
    //quickly apply - 4 or + 4 semitone pitch adjustments for pitch type
    const setBoyPreset = () => update({ pitchSemitones: -4, backingType: settings.backingType || "boys" }); 
    const setGirlPreset = () => update({ pitchSemitones: +4, backingType: settings.backingType || "girls" });


    // --- button handlers that also set alert message ---

    const handleSave = () => {
        saveSettings();
        setMessage({
            type: "success",
            text: "Settings saved in this browser.",
        });
    };

    const handleLoad = () => {
        loadSettings();
        setMessage({
            type: "info",
            text: "Saved settings loaded.",
        });
    };

    const handleExport = () => {
        exportSettings();
        setMessage({
            type: "success",
            text: "Settings file downloaded.",
        });
    };

    const handleImportClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = ""; // allow re-selecting same file
            fileInputRef.current.click();
        }
    };

    const handleImportFile = (evt) => {
        const file = evt.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();

        reader.onload = () => {
            try {
                const obj = JSON.parse(reader.result);
                importSettings(obj);
                setMessage({
                    type: "success",
                    text: "Settings imported successfully.",
                });
            } catch (err) {
                console.error(err);
                setMessage({
                    type: "danger",
                    text: "Import failed. Please choose a valid JSON settings file.",
                });
            }
        };

        reader.onerror = () => {
            setMessage({
                type: "danger",
                text: "Could not read file. Please try again.",
            });
        };

        reader.readAsText(file);
    };


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
                            {message && (
                                <div
                                    className={`alert alert-${message.type} mb-3`}
                                    role="alert"
                                >
                                    {message.text}
                                </div>
                            )}
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
                                <button className="btn settings-btn" onClick={handleSave}>Save</button>
                                <button className="btn settings-btn" onClick={handleLoad}>Load</button>
                                <button className="btn settings-btn" onClick={handleExport}>Export</button>

                                
                                <button
                                    type="button"
                                    className="settings-btn settings-btn-import"
                                    onClick={handleImportClick}
                                >
                                    Import
                                </button>

                                {/* hidden file input for Import */}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="application/json"
                                    className="d-none"
                                    onChange={handleImportFile}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
