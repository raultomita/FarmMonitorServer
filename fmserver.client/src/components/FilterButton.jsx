import React from 'react';

export function FilterButton({ type, label, onClick, symbol, state }) {
    const isActive = state === type;
    const isAll = type === 'All';
    return (
        <button
            className={`filter-btn ${type} ${isActive ? 'active' : ''} ${isAll ? 'filter-btn-all' : 'filter-btn-icon'}`}
            onClick={() => onClick(type)}
            title={label}
        >
            <i className={`fa ${symbol}`} aria-hidden="true" />
            {isAll && <span>{label}</span>}
        </button>
    );
}
