import * as React from 'react';

interface FilterButtonProps {
    type: string;
    onClick: () => void;     
    symbol: string;
    state: string;
}

export class FilterButton extends React.Component<FilterButtonProps, {}> {
    constructor() {
        super();
    }

    public render() {
        let buttonClassName = "btn btn-outline-dark " + this.props.type;

        if(this.props.state == this.props.type){
            buttonClassName += " active";        
        }
   
        let symbolClassName = "fa " + this.props.symbol;

        return <button className={buttonClassName} onClick={this.props.onClick}><i className={symbolClassName} aria-hidden="true"></i> </button>;
    }
}