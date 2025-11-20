export default function StorageButtons({
    onSave,
    onLoad,
    onExport,
    onImportClick,
    fileInputRef,
    onImportFile,
}) {
    return (
        <div className="d-flex gap-2 mt-4 flex-wrap">
            <button
                type="button"
                className="btn settings-btn"
                onClick={onSave}
            >
                Save
            </button>

            <button
                type="button"
                className="btn settings-btn"
                onClick={onLoad}
            >
                Load
            </button>

            <button
                type="button"
                className="btn settings-btn"
                onClick={onExport}
            >
                Export
            </button>

            <button
                type="button"
                className="settings-btn settings-btn-import"
                onClick={onImportClick}
            >
                Import
            </button>

            {/* hidden file input for Import */}
            <input
                ref={fileInputRef}
                type="file"
                accept="application/json"
                className="d-none"
                onChange={onImportFile}
            />
        </div>
    );
}