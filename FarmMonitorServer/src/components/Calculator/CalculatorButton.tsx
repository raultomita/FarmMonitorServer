import * as React from "react";

export interface CalculatorButtonProps {
    caption?: string;
    value?: number;
    handler?: (value?: number) => void;
}

export class CalculatorButton extends React.Component<CalculatorButtonProps, undefined>{   
    render() {
        let buttonCaption = null;
         if(this.props.caption){
            buttonCaption = this.props.caption;
        }else if(this.props.value){
            buttonCaption = this.props.value;
        }
        else{
            buttonCaption = "<NA>";
        }

        return <button style={{ width: "25%" }} onClick={() => this.props.handler(this.props.value)}>{buttonCaption}</button>
    }
}