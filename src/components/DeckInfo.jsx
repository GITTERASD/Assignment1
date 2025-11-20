import React from "react";

export default function DeckInfo({ bpm, volume, pitch, mixName }) {
    // show volume as percentage so it feels more DJ-like
    const volumePercent = Math.round(volume * 100);

    return (
        <div className="mt-3 pt-3 border-top small text-light">
            <div className="d-flex flex-wrap gap-4 align-items-center">
                <div>
                    <div className="text-muted text-uppercase">BPM</div>
                    <div className="fs-4 fw-bold">{bpm}</div>
                </div>

                <div>
                    <div className="text-muted text-uppercase">Pitch (st)</div>
                    <div className="fs-5">{pitch}</div>
                </div>

                <div>
                    <div className="text-muted text-uppercase">Volume</div>
                    <div className="fs-5">{volumePercent}%</div>
                </div>

                <div className="flex-grow-1">
                    <div className="text-muted text-uppercase">Instrument mix</div>
                    <div className="fw-semibold">{mixName}</div>
                </div>
            </div>
        </div>
    );
}
