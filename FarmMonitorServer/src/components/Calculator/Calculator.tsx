import * as React from "react";
import { CalculatorDisplay } from "./CalculatorDisplay";
import { CalculatorButton } from "./CalculatorButton";

interface CalculatorState {
    result: string;
}

export class Calculator extends React.Component<undefined, CalculatorState>{
    constructor() {
        super();
        this.state = { result: "-" };
    }

    render() {
        return <div style={{width:200}}>
            <CalculatorDisplay value={this.state.result}></CalculatorDisplay>
            <div>
                <CalculatorButton value={7}></CalculatorButton>
                <CalculatorButton value={8}></CalculatorButton>
                <CalculatorButton value={9}></CalculatorButton>
                <CalculatorButton caption="/"></CalculatorButton>
            </div>
            <div>
                <CalculatorButton value={4}></CalculatorButton>
                <CalculatorButton value={5}></CalculatorButton>
                <CalculatorButton value={6}></CalculatorButton>
                <CalculatorButton caption="*"></CalculatorButton>
            </div>
            <div>
                <CalculatorButton value={1}></CalculatorButton>
                <CalculatorButton value={2}></CalculatorButton>
                <CalculatorButton value={3}></CalculatorButton>
                <CalculatorButton caption="-"></CalculatorButton>
            </div>
            <div>
                <CalculatorButton caption="0"></CalculatorButton>
                <CalculatorButton caption="."></CalculatorButton>
                <CalculatorButton caption="="></CalculatorButton>
                <CalculatorButton caption="+"></CalculatorButton>
            </div>
        </div>
    }
}