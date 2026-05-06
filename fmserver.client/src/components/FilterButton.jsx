import React from 'react';

export function FilterButton({ type, label, onClick, emoji, symbol, state, count }) {
    const isActive = state === type;
    const isOn = type === 'On';
    const isEmpty = isOn && count === 0;

    return (
        <button
            className={`filter-btn ${type} ${isActive ? 'active' : ''} filter-btn-icon filter-btn-round ${isEmpty ? 'filter-btn-empty' : ''}`}
            onClick={() => !isEmpty && onClick(type)}
            title={label}
            disabled={isEmpty}
        >
            {emoji && <span aria-hidden="true">{emoji}</span>}
            {!emoji && symbol && <i className={`fa ${symbol}`} aria-hidden="true" />}
            {isOn && <span className={`filter-btn-badge ${count === 0 ? 'filter-btn-badge-zero' : ''}`}>{count}</span>}
        </button>
    );
}
