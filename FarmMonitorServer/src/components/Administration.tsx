import * as React from "react";

export interface AdministrationState{
    value: number;
}

export class Administration extends React.Component<undefined, AdministrationState>{    
    constructor() {
        super();
        this.state = {value: 0};    
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event: any){
        this.setState({value: event.target.value});
    }

    render(){
        return <div><span>{this.state.value}</span>
            <input type="number" value={this.state.value} onChange={this.handleChange}/></div>
    }
}