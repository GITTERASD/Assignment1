import React from "react";

export default function BeatSelector({ beats, selectedId, onChange }) {
    return (
        <section className="mt-3">
            <div className="d-flex flex-wrap gap-3">
                {beats.map((beat) => (
                    <label
                        key={beat.id}
                        className="form-check form-check-inline text-light"
                    >
                        <input
                            type="radio"
                            className="form-check-input me-1"
                            name="beatChoice"
                            value={beat.id}
                            checked={selectedId === beat.id}
                            onChange={() => onChange(beat.id)}
                        />
                        <div>
                            <div>{beat.name}</div>
                            {beat.instruments && (
                                <small className="text-muted d-block">
                                    {beat.instruments.join(", ")}
                                </small>
                            )}
                        </div>
                    </label>
                ))}
            </div>
        </section>
    );
}
