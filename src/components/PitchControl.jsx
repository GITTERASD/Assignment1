export default function PitchControl({
    pitch,
    onChangePitch,
    onBoyPreset,
    onGirlPreset,
}) {
    return (
        <div className="mt-3 d-flex align-items-center gap-3 flex-wrap">
            <div className="flex-grow-1">
                <label className="form-label">
                    Pitch (semitones): {pitch}
                </label>
                <input
                    className="form-range"
                    type="range"
                    min="-12"
                    max="12"
                    step="1"
                    value={pitch}
                    onChange={(e) =>
                        onChangePitch(Number(e.target.value))
                    }
                />
            </div>

            <div className="d-flex gap-2">
                <button
                    type="button"
                    className="btn settings-btn-boy"
                    onClick={onBoyPreset}>
                    Boy pitch
                </button>
                <button
                    type="button"
                    className="btn settings-btn-girl"
                    onClick={onGirlPreset} >
                    Girl pitch
                </button>
            </div>
        </div>
    );
}