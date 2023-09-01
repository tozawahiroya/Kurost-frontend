import React, { useState } from "react";
import Recording_Recorder from "./Recording_recorder";

const Recording = (props) => {
    const [recordedData, setRecordedData] = useState(null);

    const handleRecordedData = (data) => {
        setRecordedData(data);
    };

    return (
        <div className="box">
            <Recording_Recorder setRecordedData={handleRecordedData} setContents = {props.setContents} contents = {props.contents} />
        </div>
    );
};

export default Recording;