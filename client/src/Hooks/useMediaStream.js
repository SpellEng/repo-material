import { useState, useEffect } from "react";

const useMediaStream = (screenShare) => {
    const [stream, setStream] = useState(null);

    useEffect(() => {
        let mediaStream = null;
        let audioStream = null;

        const startStream = async () => {
            try {
                // Stop any active tracks if there's an existing stream
                if (mediaStream) {
                    mediaStream.getTracks().forEach(track => track.stop());
                }
                if (audioStream) {
                    audioStream.getTracks().forEach(track => track.stop());
                }

                const videoConstraints = {
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                };

                if (screenShare) {
                    mediaStream = await navigator.mediaDevices.getDisplayMedia({ video: videoConstraints });
                    // Get the audio separately with additional constraints
                    audioStream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true
                        }
                    });

                    // Combine the video and audio tracks
                    mediaStream.addTrack(audioStream.getAudioTracks()[0]);
                } else {
                    mediaStream = await navigator.mediaDevices.getUserMedia({
                        video: videoConstraints,
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true
                        }
                    });
                    // mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
                    // audioStream = await navigator.mediaDevices.getUserMedia({
                    //     audio: {
                    //         echoCancellation: true,
                    //         noiseSuppression: true,
                    //         autoGainControl: true
                    //     }
                    // });
                    // // Combine the video and audio tracks
                    // mediaStream.addTrack(audioStream.getAudioTracks()[0]);
                }

                setStream(mediaStream);
            } catch (error) {
                console.error("Error accessing media devices.", error);
            }
        };

        startStream();

        return () => {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }
            if (audioStream) {
                audioStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [screenShare]);

    return { stream };
};

export default useMediaStream;

