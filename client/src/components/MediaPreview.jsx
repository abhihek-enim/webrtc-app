/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import { CiVideoOff, CiVideoOn } from "react-icons/ci";
const MediaPreview = ({
  type = "input", // "input", "local", or "remote"
  videoRef: providedVideoRef,
  mediaStream: providedMediaStream,
  onCreateCall,
  width,
  height,
}) => {
  const internalVideoRef = useRef(null); // Always define this hook
  const videoRef = providedVideoRef || internalVideoRef; // Use either the provided or internal ref
  const [showVideo, setShowVideo] = useState(false);
  const [mediaStream, setMediaStream] = useState(providedMediaStream || null);

  const startMedia = async () => {
    if (type === "input") {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMediaStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    } else if (type === "local" || type === "remote") {
      if (providedMediaStream && videoRef.current) {
        videoRef.current.srcObject = providedMediaStream;
      }
    }
  };

  const stopMedia = () => {
    if (mediaStream && type === "input") {
      mediaStream.getTracks().forEach((track) => track.stop());
      setMediaStream(null);
    }
  };

  useEffect(() => {
    if (showVideo) {
      startMedia();
    } else {
      stopMedia();
    }

    // Cleanup when the component unmounts
    return () => stopMedia();
  }, [showVideo]);

  return (
    <div className="flex flex-col justify-center items-center w-full mt-6">
      <h2 className="text-gray-400 text-xl font-semibold mb-6">
        {type === "input"
          ? "Local Media Device Check:"
          : type === "local"
          ? "Local Video:"
          : "Remote Video:"}
      </h2>
      <div className={`relative w-[${width}] h-[${height}]`}>
        {!showVideo ? (
          <div className="w-full h-full bg-gray-400 rounded-md flex justify-center items-center hover:cursor-not-allowed">
            <h2 className="text-2xl font-bold text-black">No Input</h2>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className=" w-full h-full border border-white  rounded-md cursor-pointer"
          />
        )}
        <div
          onClick={() => setShowVideo(!showVideo)}
          className="absolute bottom-5 left-[45%] bg-white rounded-md cursor-pointer active:scale-95"
        >
          {!showVideo ? (
            <CiVideoOn className=" text-black font-bold  " size={24} />
          ) : (
            <CiVideoOff className=" text-black font-bold  " size={24} />
          )}
        </div>
      </div>

      {type === "input" && (
        <div className="flex justify-center items-center m-2 gap-4">
          <button
            onClick={onCreateCall}
            className="px-4 py-2 bg-teal-200 text-black rounded-md hover:bg-teal-400 text-base font-medium active:scale-90 transition-all duration-300"
          >
            Create Call
          </button>
        </div>
      )}
    </div>
  );
};

export default MediaPreview;
