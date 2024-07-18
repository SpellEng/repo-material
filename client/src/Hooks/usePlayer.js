import { useState } from 'react'
import { cloneDeep } from 'lodash'
import { useSocketContext } from '../Context/SocketContext'

const usePlayer = (myId, roomId, peer, stream) => {
    const socket = useSocketContext()
    const [players, setPlayers] = useState({})
    const playersCopy = cloneDeep(players);


    const nonHighlightedPlayers = playersCopy

    const leaveRoom = () => {
        socket.emit('user-leave', myId, roomId)
        console.log("leaving room", roomId)
        peer?.disconnect();
    }

    const toggleAudio = () => {
        console.log("I toggled my audio")
        setPlayers((prev) => {
            const copy = cloneDeep(prev)
            copy[myId].muted = !copy[myId].muted
            return { ...copy }
        })
        socket.emit('user-toggle-audio', myId, roomId);
    }


    const toggleVideo = () => {
        console.log("I toggled my video")
        setPlayers((prev) => {
            const copy = cloneDeep(prev);
            copy[myId].playing = !copy[myId].playing;
            return { ...copy }
        })
        socket.emit('user-toggle-video', myId, roomId)
    }


    return { players, setPlayers, nonHighlightedPlayers, toggleAudio, toggleVideo, leaveRoom }
}

export default usePlayer;