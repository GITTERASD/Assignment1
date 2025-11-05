export default function DjControls({
    settings,
    onSettingsChange,
    onSave,
    onLoad,
    onExport,
    onImport
}) {
    const update = (patch) => onSettingsChange({ ...settings, ...patch });

    const handleImport = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            try {
                onImport(JSON.parse(reader.result));
            } catch {
                console.error("Invalid JSON file");
            }
        };
        reader.readAsText(file);
    };

    

return (
    <>
        {/* BPM */}
        <div className="mb-3">
            <label htmlFor="bpm" className="form-label">BPM</label>
            <input id="bpm" type="number" className="form-control"
                min="40" max="240" step="1"
                value={settings.bpm}
                onChange={(e) => update({ bpm: Number(e.target.value) || 0 })} />
        </div>

        {/* Master Volume */}
        <div className="mb-3">
            <label htmlFor="volume" className="form-label">Master Volume: {settings.volume.toFixed(2)}</label>
            <input id="volume" type="range" className="form-range"
                min="0" max="1" step="0.01"
                value={settings.volume}
                onChange={(e) => update({ volume: Number(e.target.value) })} />
        </div>


       
        {/* Pitch sliders */}
        <div className="mb-3">
            <label className="form-label">Boy Pitch (semitones): {settings.boyPitch}</label>
            <input type="range" className="form-range"
                min="-12" max="12" step="1"
                value={settings.boyPitch}
                onChange={(e) => update({ boyPitch: Number(e.target.value) })} />
        </div>
        <div className="mb-4">
            <label className="form-label">Girl Pitch (semitones): {settings.girlPitch}</label>
            <input type="range" className="form-range"
                min="-12" max="12" step="1"
                value={settings.girlPitch}
                onChange={(e) => update({ girlPitch: Number(e.target.value) })} />
        </div>


  
            <label className="btn btn-outline-secondary m-0">
                Import <input type="file" accept="application/json" hidden onChange={handleImport} />

            </label>
     
    </>
);
}



