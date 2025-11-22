export default function ProcessTextArea({ defaultValue, onChange }) {
    return (
        <textarea
            id="proc"
            className="form-control"
            style={{ minHeight: 220, fontFamily: 'monospace' }}
            defaultValue={defaultValue}
            onChange={onChange}
        />
    );
}
