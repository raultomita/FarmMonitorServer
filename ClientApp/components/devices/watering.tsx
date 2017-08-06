import * as React from 'react';
import { DeviceProps } from './deviceProps';
import { DeviceTrigger } from './deviceTrigger';

export class Watering extends React.Component<DeviceProps, {}> {
    constructor() {
        super();
    }

    public render() {
        return <div className="deviceContent">
            <div>
            </div>
            <div>
                <DeviceTrigger deviceId={this.props.id} state={this.props["state"]} />
            </div>

        </div>;

    }
}