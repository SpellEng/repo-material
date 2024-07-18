import ReactPlayer from "react-player";
import { Mic, MicOff, UserSquare2 } from "lucide-react";

const VideoPlayerComp = (props) => {
  const { url, muted, playing, isActive, toggleAudio } = props;
  return (
    <div>
      {playing && playing ? (
        <ReactPlayer
          url={url}
          muted={muted}
          playing={playing}
          width="100%"
          height="100%"
        />
      ) : (
        <UserSquare2 size={isActive ? 400 : 150} />
      )}
      {/* {!isActive ? (
        muted ? (
          <MicOff className="muteIcon" size={20} />
        ) : (
          <Mic className="muteIcon" size={20} />
        )
      ) : undefined} */}
    </div>
  );
};

export default VideoPlayerComp;
