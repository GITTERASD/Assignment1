export default function PlayButtons({ onPlay, onStop }) {
    return (
        <>
            <button className="pad pad-play" onClick={onPlay} aria-label="Play">▶</button>
            <button className="pad pad-stop" onClick={onStop} aria-label="Stop"
>■</button>
        </>
    );
}
