import React from 'react';

export function FilterButton({ type, label, onClick, emoji, symbol, state, count }) {
    const isActive = state === type;
    const isAll = type === 'All';
    const isOn = type === 'On';
    const isEmpty = isOn && count === 0;

    return (
        <button
            className={`filter-btn ${type} ${isActive ? 'active' : ''} ${isAll || isOn ? 'filter-btn-text' : 'filter-btn-icon'} ${isEmpty ? 'filter-btn-empty' : ''}`}
            onClick={() => !isEmpty && onClick(type)}
            title={label}
            disabled={isEmpty}
        >
            {emoji && <span aria-hidden="true">{emoji}</span>}
            {!emoji && symbol && <i className={`fa ${symbol}`} aria-hidden="true" />}
            {(isAll || isOn) && <span>{label}</span>}
            {isOn && count > 0 && <span className="filter-btn-badge">{count}</span>}
        </button>
    );
}
