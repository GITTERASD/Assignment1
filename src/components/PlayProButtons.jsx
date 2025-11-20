export default function PlayProButtons({ onProcess, onProcPlay }) {
    return (
        <>
            <button className="pad pad-preprocess" onClick={onProcess} aria-label="Preprocess">⟳</button>
            <button className="pad pad-procplay" onClick={onProcPlay} aria-label="Process and Play">⟳▶</button>
        </>
    );
}
