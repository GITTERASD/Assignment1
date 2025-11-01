
function PlayProButtons({ onProcess, onProcPlay }) {
    return (<>
        <div className="btn-group" role="group" aria-label="Basic mixed styles example">
            <button id="process" className="btn btn-outline-primary" onClick={onProcess}>Preprocess</button>
            <button id="process_play" className="btn btn-outline-primary" onClick={onProcPlay}>Proc & Play</button>
      </div>
  </>
  );
}

export default PlayProButtons;