import React, { useState, useRef } from "react";
import './Recording.css';
import Button from '@mui/material/Button';

const Recording_recorder = (props) => {
    const [recording, setRecording] = useState(false);
    const mediaRecorder = useRef(null);
    const audioChunks = useRef([]);

    const startRecording = async () => {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder.current = new MediaRecorder(stream);
        mediaRecorder.current.start();

        const audioChunks = [];
        mediaRecorder.current.addEventListener("dataavailable", event => {
            audioChunks.push(event.data);
        });

        mediaRecorder.current.addEventListener("stop", () => {
            const audioBlob = new Blob(audioChunks);
            const audioUrl = URL.createObjectURL(audioBlob);
            const audio = new Audio(audioUrl);
            props.setContents(audioUrl);  // 保存バイナリデータ
        });

        setRecording(true);
    };

    const stopRecording = () => {
        if (mediaRecorder.current) {
            mediaRecorder.current.stop();

            // Blobデータを生成し、親コンポーネントに渡す
            const audioBlob = new Blob(audioChunks.current, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            // setRecordedData(audioUrl); // 親コンポーネントに録音データを渡す
            setRecording(false);
        }
    };

    return (
        <div>
            <h2 className="title2"> </h2>
            
            <div className="button-container">
                <Button variant="contained"
                    className={`button ${recording ? 'active' : ''}`}
                    onClick={startRecording}
                >
                    Start Recording
                </Button>
                <Button variant="contained"
                    className={`button ${recording ? '' : 'active'}`}
                    onClick={stopRecording}
                    disabled={!recording}
                >
                    Stop Recording
                </Button>
            </div>


        </div>

    );
};

export default Recording_recorder;