import * as React from "react";

export interface HumidityStatusProps{
    name: string,
    value: string
}

export class HumidityStatus extends React.Component<HumidityStatusProps, undefined>{
    render(){
        return <div>{this.props.name}: Umiditate {this.props.value}</div>
    }
}