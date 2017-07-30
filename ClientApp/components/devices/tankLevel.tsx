import * as React from 'react';
import { DeviceProps } from './deviceProps';
import { DeviceTrigger } from './deviceTrigger';

export class TankLevel extends React.Component<DeviceProps, {}> {
    constructor() {
        super();
    }

    public render() {               
        return <div>          
            <div>Level: {this.props["level"]}</div>
            <DeviceTrigger deviceId={this.props.id} state={this.props["inputState"]}/>
        </div>;
    }
}