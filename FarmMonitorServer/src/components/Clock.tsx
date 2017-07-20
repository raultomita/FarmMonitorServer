import * as React from "react";

export interface ClockState {
    date: Date;
    version: string;
}

export interface ClockProps {
    version: string;
}

export class Clock extends React.Component<ClockProps, ClockState>{
    timerID: number;
    constructor() {
        super();
        this.state = {
            date: new Date(),
            version: "version"
        };
    }

    componentDidMount() {
        this.timerID = setInterval(
            () => this.tick(),
            1000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    tick() {        
        this.setState({
            date: new Date()
        });
    }

    render() {
        return <div>
            <h1>{this.state.date.toLocaleTimeString()}</h1>                                    
        </div>
    }
}