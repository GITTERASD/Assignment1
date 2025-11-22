export default function PlayButtons({ onPlay, onStop }) {
    return (
        <>

            <div className="pad-wrapper">
                <button
                    className="pad pad-play"
                    onClick={onPlay}
                    aria-label="Play"
                    title="Play"
                >
                    ▶
                </button>
                <div className="pad-label">Play</div>
            </div>

            <div className="pad-wrapper">
                <button
                    className="pad pad-stop"
                    onClick={onStop}
                    aria-label="Stop"
                    title="Stop"
                >
                    ■
                </button>
                <div className="pad-label">Stop</div>
            </div>
        </>
    );
}