import { Mic, Video, PhoneOff, MicOff, VideoOff } from "lucide-react";
import ChatBox from "../../../Pages/UpdatedVideo/ChatBox/ChatBox";

const Bottom = (props) => {
  const { myId, playerId, loggedInUser, muted, playing, toggleAudio, toggleVideo, leaveRoom, messagesList, roomId } = props;

  return (
    <div className="bottomMenu">
      {
        myId === playerId ? (
          <>
            <h6 className="text-white">{loggedInUser?.fullName}</h6>
            <div className="inner">
              {muted ? (
                <MicOff
                  size={55}
                  onClick={toggleAudio}
                />
              ) : (
                <Mic size={55} onClick={toggleAudio} />
              )}
              {playing ? (
                <Video size={55} onClick={toggleVideo} />
              ) : (
                <VideoOff
                  size={55}
                  onClick={toggleVideo}
                />
              )}
              <ChatBox messagesList={messagesList} roomId={roomId} />
              <PhoneOff size={55} onClick={leaveRoom} />
            </div>
          </>
        )
          :
          <h6 className="text-white">{loggedInUser?.fullName}</h6>
      }
    </div>
  );
};

export default Bottom;