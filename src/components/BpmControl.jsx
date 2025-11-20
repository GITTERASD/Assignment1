export default function BpmControl({ bpm, onChange }) {
    return (
        <div>
            <label className="form-label">BPM</label>
            <input
                className="form-control"
                type="number"
                min="40"
                max="220"
                value={bpm}
                onChange={(e) =>
                    onChange(Number(e.target.value) || 120)
                }
            />
        </div>
    );
}