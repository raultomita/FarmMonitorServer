import React from 'react';

export function Messages({ header, messages }) {
    if (!messages || messages.length === 0) {
        return null;
    }

    return (
        <div className="messagesHeader alert alert-danger">
            {header && <strong>{header}</strong>}
            {messages.map((message, index) => (
                <span key={index}>{message}</span>
            ))}
        </div>
    );
}
