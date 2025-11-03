export default function PlayButtons({ onPlay, onStop }) {
    return (
        <>
            <button className="btn btn-accent" onClick={onPlay}>Play</button>
            <button className="btn btn-danger-ghost" onClick={onStop}>Stop</button>
        </>
    );
}
