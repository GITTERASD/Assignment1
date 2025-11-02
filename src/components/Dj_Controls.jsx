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
        {/* Checkboxes (s1, d1, d2) */}
        <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="s1" checked={!!settings.s1}
                onChange={(e) => update({ s1: e.target.checked })} />
            <label className="form-check-label" htmlFor="s1">
                s1
            </label>
        </div>

        <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="d1"
                checked={!!settings.d1}
                onChange={(e) => update({ d1: e.target.checked })} />
            <label className="form-check-label" htmlFor="d1">d1</label>
        </div>

        <div className="form-check">
            <input className="form-check-input" type="checkbox" value="" id="d2"
                checked={!!settings.d2}
                onChange={(e) => update({ d2: e.target.checked })} />
            <label className="form-check-label" htmlFor="d2">d2</label>
        </div>
  


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

        {/* Backing Vocal Group */}
        <div className="mb-3">
            <label htmlFor="backingType" className="form-label">Backing Vocal Group</label>
            <select id="backingType" className="form-select"
                value={settings.backingType}
                onChange={(e) => update({ backingType: e.target.value })}>
                <option value="none">None</option>
                <option value="boys">Boys</option>
                <option value="girls">Girls</option>
                <option value="children">Children</option>
                <option value="mixed">Mixed (Boys + Girls)</option>
            </select>
        </div>

        {/* Backing Volume */}
        <div className="mb-3">
            <label htmlFor="backingVol" className="form-label">Backing Volume: {settings.backingVol.toFixed(2)}</label>
            <input id="backingVol" type="range" className="form-range"
                min="0" max="1" step="0.01"
                value={settings.backingVol}
                onChange={(e) => update({ backingVol: Number(e.target.value) })} />
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

        {/* JSON actions */}
        <div className="d-flex gap-2 flex-wrap">
            <button className="btn btn-outline-secondary" onClick={onSave}>Save</button>
            <button className="btn btn-outline-secondary" onClick={onLoad}>Load</button>
            <button className="btn btn-outline-secondary" onClick={onExport}>Export</button>
            <label className="btn btn-outline-secondary m-0">
                Import <input type="file" accept="application/json" hidden onChange={handleImport} />
            </label>
        </div>
    </>
);
}




