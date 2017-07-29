import * as React from 'react';

interface HomeState {
    devices: Device[];
    loading: boolean;
}

export class Home extends React.Component<{}, HomeState> {
    constructor() {
        super();
        this.state = { devices: [], loading: true };

        fetch('/api/devices')
            .then(response => response.json() as Promise<Device[]>)
            .then(data => {
                this.setState({ devices: data, loading: false });
            });
    }
    public render() {
        let contents = this.state.loading
            ? <p><em>Loading...</em></p>
            : <div>
                {this.state.devices.map(forecast =>
                    <tr key={forecast.id}>
                        <td>{forecast.type}</td>
                        <td>{forecast.timestamp}</td>
                    </tr>
                )}
            </div>;

        return <div>
            <h1>Devices</h1>            
            {contents}
        </div>;
        
    }
}


export interface Device {
    id: string;
    type: string;
    timestamp: string;
}
