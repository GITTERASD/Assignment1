export default function PlayProButtons({ onProcess, onProcPlay }) {
    return (
        <>
            <div className="pad-wrapper">
                <button
                    className="pad pad-preprocess"
                    onClick={onProcess}
                    aria-label="Preprocess code"
                    title="Preprocess"
                >
                    ⟳
                </button>
                <div className="pad-label">Preprocess</div>
            </div>
            <div className="pad-wrapper">
                <button
                    className="pad pad-procplay"
                    onClick={onProcPlay}
                    aria-label="Process and play"
                    title="Proc & Play"
                >
                    ⟳▶
                </button>
                <div className="pad-label">Proc &amp; Play</div>
            </div>
        </>
    );
}