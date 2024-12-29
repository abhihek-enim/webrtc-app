/* eslint-disable react/prop-types */
// MediaPreview.jsx
import { useEffect, useRef, useState } from "react";
import { CiVideoOff, CiVideoOn } from "react-icons/ci";

const MediaPreview = ({
  type = "input", // "input", "local", or "remote"
  videoRef: providedVideoRef,
  stream: providedStream, // Changed from mediaStream to stream for clarity
  onCreateCall,
  width,
  height,
  autoStart = false,
}) => {
  const internalVideoRef = useRef(null);
  const videoRef = providedVideoRef || internalVideoRef;
  const [showVideo, setShowVideo] = useState(autoStart);
  const [localStream, setLocalStream] = useState(null);

  const startMedia = async () => {
    if (type === "input") {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    } else if ((type === "local" || type === "remote") && providedStream) {
      if (videoRef.current) {
        videoRef.current.srcObject = providedStream;
      }
    }
  };

  const stopMedia = () => {
    if (type === "input" && localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (showVideo) {
      startMedia();
    } else {
      stopMedia();
    }
    return () => stopMedia();
  }, [showVideo, providedStream]);

  // Effect to handle incoming stream changes
  useEffect(() => {
    if (
      (type === "local" || type === "remote") &&
      providedStream &&
      videoRef.current
    ) {
      videoRef.current.srcObject = providedStream;
    }
  }, [providedStream, type]);

  return (
    <div className="flex flex-col justify-center items-center w-full">
      <div
        style={{ width, height }}
        className="relative border border-white rounded-md overflow-hidden"
      >
        {!showVideo && type === "input" ? (
          <div className="w-full h-full bg-gray-400 rounded-md flex justify-center items-center">
            <h2 className="text-2xl font-bold text-black">No Input</h2>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted={type === "local" || type === "input"}
            className="w-full h-full rounded-md object-cover"
          />
        )}
        {type === "input" && (
          <div
            onClick={() => setShowVideo(!showVideo)}
            className="absolute bottom-0 left-[45%] bg-white rounded-md cursor-pointer active:scale-95 p-2"
          >
            {!showVideo ? (
              <CiVideoOn className="text-black" size={20} />
            ) : (
              <CiVideoOff className="text-black" size={20} />
            )}
          </div>
        )}
      </div>
      {type === "input" && showVideo && (
        <button
          onClick={onCreateCall}
          className="px-4 py-2 bg-teal-200 text-black rounded-md hover:bg-teal-400 text-base font-medium active:scale-90 transition-all duration-300 mt-4"
        >
          Create Call
        </button>
      )}
    </div>
  );
};

export default MediaPreview;
