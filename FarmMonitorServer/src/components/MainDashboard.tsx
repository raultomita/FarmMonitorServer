import * as React from "react";
import { HumidityStatus } from "./HumidityStatus";
import { Clock } from "./Clock";
import { Calculator } from "./Calculator/Calculator";

export class MainDashboard extends React.Component<undefined, undefined>{
    render() {
        return <div className="row">
            <div className="col-md-8">
                <div className="row">
                    <div className="col-md-8"><HumidityStatus name="Căpșuni gradiniță" value="scăzută"></HumidityStatus></div>
                    <div className="col-md-4"><Clock version="1.1"></Clock></div>
                </div>
            </div>
            <div className="col-md-4">
                <Calculator></Calculator>
            </div>
        </div>
    }
}