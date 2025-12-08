import React from 'react';

export function FilterButton({ type, onClick, symbol, state }) {
    let buttonClassName = "btn btn-outline-dark " + type;

    if (state === type) {
        buttonClassName += " active";
    }

    let symbolClassName = "fa " + symbol;

    return (
        <button className={buttonClassName} onClick={() => onClick(type)}>
            <i className={symbolClassName} aria-hidden="true"></i>
        </button>
    );
}
