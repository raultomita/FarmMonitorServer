import * as React from "react";

export interface CalculatorDisplayProps{
    value:string;
}

export class CalculatorDisplay extends React.Component<CalculatorDisplayProps, undefined>{
    render(){
        return <div>{this.props.value}</div>
    }
}
