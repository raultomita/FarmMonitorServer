export interface DeviceProps {
    id: string;
    type: string;
    timeStamp: string;    
    [typeProp: string]: any;
}
