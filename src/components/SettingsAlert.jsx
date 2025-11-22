export default function SettingsAlert({ message }) {
    if (!message) return null;

    return (
        <div
            className={`alert alert-${message.type} mb-3`}
            role="alert">
            {message.text}
        </div>
    );
}