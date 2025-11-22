import { useState, useRef } from "react";
import { Link } from "react-router-dom"; //link to close the overlay
import SettingsAlert from "./SettingsAlert";
import BpmControl from "./BpmControl";
import VolumeControl from "./VolumeControl";
import PitchControl from "./PitchControl";
import StorageButtons from "./StorageButtons";




//patch is the newly updated piece of data
export default function Settings({ controller, onClose }) {
    const { settings, setSettings, saveSettings, loadSettings, exportSettings, importSettings } = controller; //from app
    const update = (patch) => setSettings(s => ({ ...s, ...patch })); // update() merges small changes (patches) into the settings object, basically updates the default settings.
    // message shown in the Bootstrap alert
    // { type: "success" | "danger" | "info", text: string }
    const [message, setMessage] = useState(null);

    // hidden file input for Import
    const fileInputRef = useRef(null);
    //quickly apply - 4 or + 4 semitone pitch adjustments for pitch type
    const setBoyPreset = () => update({ pitchSemitones: -4, backingType: settings.backingType || "boys" }); 
    const setGirlPreset = () => update({ pitchSemitones: +4, backingType: settings.backingType || "girls" });


    // button handlers that also set alert message

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
                            {/* Bootstrap alert */}
                            <SettingsAlert message={message} />

                            {/* BPM control */}
                            <BpmControl
                                bpm={settings.bpm}
                                onChange={(value) =>
                                    update({ bpm: value })
                                }
                            />

                            {/* Volume slider */}
                            <VolumeControl
                                volume={settings.volume}
                                onChange={(value) =>
                                    update({ volume: value })
                                }
                            />

                            {/* Pitch slider + presets */}
                            <PitchControl
                                pitch={settings.pitchSemitones}
                                onChangePitch={(value) =>
                                    update({
                                        pitchSemitones: value,
                                    })
                                }
                                onBoyPreset={setBoyPreset}
                                onGirlPreset={setGirlPreset}
                            />

                            {/* Save / Load / Export / Import buttons */}
                            <StorageButtons
                                onSave={handleSave}
                                onLoad={handleLoad}
                                onExport={handleExport}
                                onImportClick={handleImportClick}
                                fileInputRef={fileInputRef}
                                onImportFile={handleImportFile}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}