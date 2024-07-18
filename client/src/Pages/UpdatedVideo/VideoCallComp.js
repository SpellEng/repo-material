import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";
import "./VideoCallComp.css";
import { useSocketContext } from "../../Context/SocketContext";
import usePlayer from "../../Hooks/usePlayer";
import VideoPlayerComp from "../../Components/VideoCall/VideoPlayerComp/VideoPlayerComp";
import CopySection from "../../Components/VideoCall/CopySection/CopySection";
import Bottom from "../../Components/VideoCall/Bottom/BottomVideoCall";
import usePeer from "../../Hooks/usePeer";
import useMediaStream from "../../Hooks/useMediaStream";
import { useLocation, useNavigate } from "react-router-dom";
import { Row, Col } from "antd";
import { Pin, PinOff, ScreenShare, ScreenShareOff } from "lucide-react";
import { CallTimer } from "../../Components/VideoCall/CallTimer/CallTimer";
import ScreenRecording from "../../Components/VideoCall/ScreenRecorder/ScreenRecorder";
import { isAuthenticated } from "../../Components/Auth/auth";
import ChatBox from "./ChatBox/ChatBox";

const VideoCallComp = ({ classObject }) => {
    const router = useNavigate();
    const location = useLocation();
    const socket = useSocketContext();
    const [screenShare, setScreenShare] = useState(false);
    const [pinnedUser, setPinnedUser] = useState("");
    const [refreshPeer, setRefreshPeer] = useState(false);
    const roomId = new URLSearchParams(location.search).get("roomID");
    const { peer, myId } = usePeer(refreshPeer);
    const { stream } = useMediaStream(screenShare);
    const {
        players,
        setPlayers,
        nonHighlightedPlayers,
        toggleAudio,
        toggleVideo,
        leaveRoom
    } = usePlayer(myId, roomId, peer);

    const [users, setUsers] = useState([]);

    // Function to update all streams with the new stream
    const updateAllStreams = (newStream) => {
        if (!newStream || !peer || !myId) return;
        Object.keys(users).forEach(userId => {
            const call = users[userId];
            if (call) {
                call?.peerConnection?.getSenders()?.forEach(sender => {
                    if (sender.track.kind === 'video') {
                        sender.replaceTrack(newStream.getVideoTracks()[0]);
                    } else if (sender.track.kind === 'audio') {
                        sender.replaceTrack(newStream.getAudioTracks()[0]);
                    }
                });
            }
        });
    };



    useEffect(() => {
        if (!socket || !peer || !stream) return;

        const handleUserConnected = (newUser) => {
            console.log(`user connected in room with userId ${newUser}`);
            callUser(newUser?.userId, stream, newUser?.loggedInUser);
        };

        const callUser = (userId, stream, loggedInUser) => {
            const call = peer.call(userId, stream, loggedInUser);

            call.on("stream", (incomingStream) => {
                console.log("incomingStream", incomingStream)
                setPlayers((prev) => ({
                    ...prev,
                    [userId]: {
                        url: incomingStream,
                        loggedInUser,
                        muted: false,
                        playing: true,
                    },
                }));
                console.log("callObject", call);
                setUsers((prev) => ({
                    ...prev,
                    [userId]: call,
                }));
            });
        };

        socket.on("user-connected", handleUserConnected);

        return () => {
            socket.off("user-connected", handleUserConnected);
        };
    }, [peer, setPlayers, socket, stream, users]);

    useEffect(() => {
        if (!socket) return;
        const handleToggleAudio = (userId) => {
            console.log(`user with id ${userId} toggled audio`);
            setPlayers((prev) => {
                const copy = cloneDeep(prev);
                copy[userId].muted = !copy[userId].muted;
                return { ...copy };
            });
        };

        const handleToggleVideo = (userId) => {
            console.log(`user with id ${userId} toggled video`);
            setPlayers((prev) => {
                const copy = cloneDeep(prev);
                copy[userId].playing = !copy[userId].playing;
                // copy[userId].muted = false;
                return { ...copy };
            });
        };

        const handleUserLeave = (userId) => {
            console.log(`user ${userId} is leaving the room`);
            users[userId]?.close();
            const playersCopy = cloneDeep(players);
            delete playersCopy[userId];
            setPlayers(playersCopy);
        };

        socket.on("user-toggle-audio", handleToggleAudio);
        socket.on("user-toggle-video", handleToggleVideo);
        socket.on("user-leave", handleUserLeave);
        return () => {
            socket.off("user-toggle-audio", handleToggleAudio);
            socket.off("user-toggle-video", handleToggleVideo);
            socket.off("user-leave", handleUserLeave);
        };
    }, [players, setPlayers, socket, users]);

    // console.log("coming stream", stream);

    useEffect(() => {
        if (!peer || !stream) return;
        peer.on("call", (call) => {
            const { peer: callerId } = call;
            call.answer(stream);

            call.on("stream", (incomingStream) => {
                console.log("incomingStream", incomingStream)
                console.log(`incoming stream from ${callerId}`);
                setPlayers((prev) => ({
                    ...prev,
                    [callerId]: {
                        url: incomingStream,
                        muted: false,
                        playing: true,
                    },
                }));

                setUsers((prev) => ({
                    ...prev,
                    [callerId]: call,
                }));
            });
        });
    }, [peer, setPlayers, stream]);

    useEffect(() => {
        if (!stream || !myId) return;
        console.log(`setting my stream ${myId}`);
        let loggedInUser = {
            email: isAuthenticated()?.email,
            fullName: isAuthenticated()?.fullName
        }
        setPlayers((prev) => ({
            ...prev,
            [myId]: {
                url: stream,
                loggedInUser,
                muted: false,
                playing: true,
            },
        }));

        updateAllStreams(stream); // Update streams for all peers in real-time
    }, [myId, setPlayers, stream, screenShare]);

    // Set the default pinned user
    useEffect(() => {
        if (!pinnedUser && Object.keys(nonHighlightedPlayers).length > 0) {
            const firstNonHighlightedPlayerId = Object.keys(nonHighlightedPlayers)[0];
            const firstNonHighlightedPlayer = {
                playerId: firstNonHighlightedPlayerId,
                ...nonHighlightedPlayers[firstNonHighlightedPlayerId]
            };
            setPinnedUser(firstNonHighlightedPlayer);
        }
    }, [nonHighlightedPlayers, pinnedUser]);

    const handleBeforeUnload = (event) => {
        event.preventDefault();
        // Included for legacy support, e.g. Chrome/Edge < 119
        event.returnValue = true;
        leaveRoom();
        socket.disconnect();
    };

    const handleUnload = () => {
        if (socket && roomId && myId) {
            leaveRoom();
            socket.disconnect();
            document.location.reload();
        }
    };

    useEffect(() => {
        window.addEventListener("beforeunload", handleBeforeUnload);
        window.addEventListener("unload", handleUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
            window.removeEventListener("unload", handleUnload);
        };
    }, [socket, roomId, myId, players]);

    const handleLeaveRoom = () => {
        leaveRoom();
        router("/class/leave-a-review", { state: { roomId } });
        setTimeout(() => {
            document.location.reload();
        }, 1200);
    }

    const handleToggleVideOnScreenShare = (val) => {
        setScreenShare(val);
        setTimeout(() => {
            toggleVideo();
            toggleVideo();
        }, 1500);
    }

    console.log("classObject", classObject)

    return (
        <div className="videoCallPage">
            <CallTimer />
            {
                isAuthenticated()?.role === 1 &&
                <ScreenRecording roomId={roomId} />
            }
            <Row className="videos mt-3">
                <Col xs={24} md={24} className="inActivePlayerContainer">
                    {Object.keys(nonHighlightedPlayers).map((playerId, index) => {
                        const { url, muted, playing, loggedInUser } = nonHighlightedPlayers[playerId];
                        let makePinnedUser = nonHighlightedPlayers[playerId];
                        makePinnedUser.playerId = playerId;
                        return (
                            url?.active &&
                            <div key={index} className={pinnedUser?.playerId === playerId ? "VideoPlayerSection pinnedVideo" : "VideoPlayerSection otherVideos"}>
                                <div>
                                    {pinnedUser?.playerId === playerId ? (
                                        <PinOff className="text-white pinIcon" onClick={() => setPinnedUser("")} />
                                    ) : (
                                        <Pin className="text-white pinIcon" onClick={() => setPinnedUser(makePinnedUser)} />
                                    )}
                                    <VideoPlayerComp
                                        key={playerId}
                                        url={url}
                                        muted={playerId === myId || muted}
                                        playing={playing}
                                        toggleAudio={toggleAudio}
                                        isActive={false}
                                    />
                                    {
                                        // myId === playerId &&
                                        (
                                            <Bottom
                                                myId={myId}
                                                playerId={playerId}
                                                loggedInUser={loggedInUser}
                                                muted={muted}
                                                playing={playing}
                                                toggleAudio={toggleAudio}
                                                toggleVideo={toggleVideo}
                                                leaveRoom={handleLeaveRoom}
                                                messagesList={classObject?.messages}
                                                roomId={roomId}
                                            />
                                        )}
                                </div>
                            </div>
                        );
                    })}
                </Col>
            </Row>
            {
                // isAuthenticated()?.role === 1 &&
                <button className="screensharebtn btn">
                    {
                        screenShare ?
                            <ScreenShareOff onClick={() => { handleToggleVideOnScreenShare(false) }} />
                            :
                            <ScreenShare onClick={() => { handleToggleVideOnScreenShare(true) }} />
                    }
                </button>
            }
            <CopySection roomId={roomId} />
        </div>
    );
};

export default VideoCallComp;