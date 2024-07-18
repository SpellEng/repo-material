import axios from 'axios';
import React, { useState, useRef } from 'react';
import Loading from '../../Loading/Loading';
import { ErrorAlert, SuccessAlert } from '../../Messages/messages';
import "./ScreenRecorder.css";

const ScreenRecording = ({ roomId }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [downloadUrl, setDownloadUrl] = useState(null);
    const [loading, setLoading] = useState(false);
    const mediaRecorderRef = useRef(null);
    const chunksRef = useRef([]);

    const startRecording = async () => {
        try {
            const videoStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
            const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Combine the video and audio tracks
            videoStream.addTrack(audioStream.getAudioTracks()[0]);
            const mediaRecorder = new MediaRecorder(videoStream);

            mediaRecorderRef.current = mediaRecorder;
            setIsRecording(true);

            mediaRecorder.start();

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    chunksRef.current.push(event.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
                const url = URL.createObjectURL(blob);
                chunksRef.current = [];
                setDownloadUrl(url);
                setIsRecording(false);

                // Convert blob to base64
                // const base64data = await getBase64FromUrl(blob);
                // uploadRecording(base64data);
            };
        } catch (error) {
            console.error('Error accessing screen capture:', error);
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
        }
    };

    const getBase64FromUrl = async (url) => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    const saveRecordingToDb = async (url) => {
        setLoading(true);
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/scheduled-classes/save-recording/${roomId}`, { url }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then(res => {
                setLoading(false);
                if (res.status === 200) {
                    SuccessAlert(res.data.successMessage);
                    setDownloadUrl("");
                } else {
                    ErrorAlert(res.data.errorMessage);
                }
            }).catch(err => {
                setLoading(false);
                console.log(err)
                ErrorAlert(err?.message);
            })
        } catch (error) {
            setLoading(false);
            console.error('Error updating profile:', error);
        }
    }

    const uploadRecording = async () => {
        setLoading(true);
        try {
            const base64data = await getBase64FromUrl(downloadUrl); // Ensure this function returns the correct base64 string
            await axios.post(`${process.env.REACT_APP_BACKEND_URL}/files/base64-upload`, { file: base64data }, {
                headers: {
                    Authorization: "Bearer " + localStorage.getItem("token")
                }
            }).then(res => {
                setLoading(false);
                if (res.status === 200) {
                    if (res.data?.url) {
                        saveRecordingToDb(res.data);
                        setDownloadUrl("");
                    } else {
                        ErrorAlert("Error uploading file. Please try again");
                    }
                } else {
                    ErrorAlert(res.data.errorMessage);
                }
            }).catch(err => {
                setLoading(false);
                console.log(err)
                ErrorAlert(err?.message);
            })
        } catch (error) {
            setLoading(false);
            console.error('Error uploading recording:', error);
        }
    }

    return (
        <div>
            {
                isRecording ? (
                    <button className='btn recordingbtn' onClick={stopRecording}>Stop Recording</button>
                ) :
                    downloadUrl ? (
                        loading ?
                            <div>
                                <Loading /> Uploading recording file. Please do not close browser
                            </div>
                            :
                            <a href={downloadUrl} onClick={uploadRecording} download="recording.mp4">Save and download recording</a>
                    )
                        :
                        (
                            <button className='btn recordingbtn' onClick={startRecording}>Start Recording</button>
                        )
            }
        </div>
    );
};

export default ScreenRecording;
