import { useLocation } from "react-router-dom";
import { useSocketContext } from "../Context/SocketContext";
// import jsSHA from 'jssha';
import { useState, useEffect, useRef } from "react";
import { isAuthenticated } from "../Components/Auth/auth";

const usePeer = (refreshPeer) => {
    const location = useLocation();
    const socket = useSocketContext();
    const roomId = new URLSearchParams(location.search).get("roomID");
    const [peer, setPeer] = useState(null);
    const [myId, setMyId] = useState('');
    const isPeerSet = useRef(false);


    useEffect(() => {
        if (isPeerSet.current || !roomId || !socket) return;
        isPeerSet.current = true;

        (async function initPeer() {
            try {
                const Peer = (await import('peerjs')).default;
                const myPeer = new Peer({
                    config: {
                        iceServers:
                            [{ urls: 'stun:freestun.net:3478' }, { urls: 'turn:freestun.net:3478', username: 'free', credential: 'free' }]
                    }
                });

                setPeer(myPeer);

                myPeer.on('open', (id) => {
                    console.log(`Your peer id is ${id}`);
                    setMyId(id);
                    let user = {
                        email: isAuthenticated()?.email,
                        fullName: isAuthenticated()?.fullName
                    }
                    socket?.emit('join-room', roomId, id, user);
                });

                myPeer.on('error', (err) => {
                    console.error('PeerJS error:', err);
                });
            } catch (error) {
                console.error('Error initializing PeerJS:', error);
            }
        })();
    }, [roomId, socket, refreshPeer]);

    return {
        peer,
        myId
    };
};

export default usePeer;