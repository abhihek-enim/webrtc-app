import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import MediaPreview from "../components/MediaPreview";
import {
  generateUserStream,
  stopUserMediaStream,
} from "../utils/streamService";
import { FaCopy } from "react-icons/fa6";

const CallPage = () => {
  const { roomId } = useParams();
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [alertVisible, setAlertVisible] = useState(false);

  const handleGenerateStream = async (videoElement) => {
    await generateUserStream(videoElement, setLocalStream);
  };
  const handleStopStream = async () => {
    await stopUserMediaStream(localStream, setLocalStream);
  };
  const handleCopyCallCode = () => {
    if (!roomId) {
      console.error("No room ID available to copy.");
      return;
    }

    navigator.clipboard
      .writeText(roomId)
      .then(() => {
        setAlertVisible(true);
        setTimeout(() => {
          setAlertVisible(false);
        }, 500);
      })
      .catch((err) => {
        console.error("Failed to copy call code:", err);
      });
  };

  return (
    <div className="flex flex-col justify-center items-center relative">
      <div className="relative w-full h-full">
        <div className=" rounded-md">
          <MediaPreview
            title="Connected User"
            controls={false}
            localStream={remoteStream}
            generateStream={null}
            stopStream={null}
            height="300px"
            width="600px"
          />
        </div>
        <div className=" absolute bottom-1 right-1 rounded-md">
          <MediaPreview
            controls={true}
            localStream={localStream}
            generateStream={handleGenerateStream}
            stopStream={handleStopStream}
            height="120px"
            width="300px"
          />
        </div>
      </div>
      <div className="flex justify-between  items-center">
        <h1 className=" flex gap-3 items-center px-3 py-2 text-2xl bg-white text-gray-600 font-bold rounded-md ">
          {"share call-code: "}
          {roomId}
          <span
            onClick={handleCopyCallCode}
            className="cursor-pointer active:scale-75 transition-all duration-300"
          >
            <FaCopy size={24} />
          </span>
        </h1>
        <button className=" px-4 py-2  bg-red-200 text-black rounded-md hover:bg-red-400 text-2xl font-medium active:scale-90 transition-all duration-300 m-4">
          End Call
        </button>
      </div>
      <p
        className={`text-black text-base bg-yellow-100 px-2 py-2 rounded-md absolute bottom-4 left-[65%] ${
          alertVisible ? "" : "hidden"
        }  `}
      >
        Copied
      </p>
    </div>
  );
};

export default CallPage;
