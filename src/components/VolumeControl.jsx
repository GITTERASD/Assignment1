export default function VolumeControl({ volume, onChange }) {
    return (
        <div className="mt-3">
            <label className="form-label">
                Master Volume: {volume.toFixed(2)}
            </label>
            <input
                className="form-range"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) =>
                    onChange(Number(e.target.value))
                }
            />
        </div>
    );
}