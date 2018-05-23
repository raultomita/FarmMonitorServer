import * as React from 'react';

interface FilterButtonProps {
    type: string;
    onClick: (t:string) => void;     
    symbol: string;
    state: string;
}

export class FilterButton extends React.Component<FilterButtonProps, {}> {
    constructor() {
        super();
        this.filter = this.filter.bind(this);
    }

    filter() {
        this.props.onClick(this.props.type);
    }

    public render() {
        let buttonClassName = "btn btn-outline-dark " + this.props.type;

        if(this.props.state == this.props.type){
            buttonClassName += " active";        
        }
   
        let symbolClassName = "fa " + this.props.symbol;

        return <button className={buttonClassName} onClick={this.filter}><i className={symbolClassName} aria-hidden="true"></i> </button>;
    }
}