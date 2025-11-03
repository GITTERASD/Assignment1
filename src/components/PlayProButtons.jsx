export default function PlayProButtons({ onProcess, onProcPlay }) {
    return (
        <>
            <button className="btn btn-ghost" onClick={onProcess}>Preprocess</button>
            <button className="btn btn-ghost" onClick={onProcPlay}>Proc &amp; Play</button>
        </>
    );
}
