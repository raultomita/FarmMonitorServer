import * as React from 'react';

interface MessagesProps {
    header: string;
    messages: string[];
}

export class Messages extends React.Component<MessagesProps, {}> {
    constructor() {
        super();
    }

    public render() {
        return this.props.messages.length > 0 ?
            <div className="messagesHeader alert alert-danger">

                {this.props.messages.map(message =>
                    <span>{message}</span>
                )}

            </div> :
            <div></div>;
    }
}