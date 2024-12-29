/* eslint-disable react/prop-types */

import { useEffect, useState } from "react";
import { CiVideoOff, CiVideoOn } from "react-icons/ci";

const MediaPreview = ({
  type = "input",
  stream: providedStream,
  onCreateCall,
  width,
  height,
  autoStart = false,
  onStreamReady, // New callback to notify parent of stream
}) => {
  const [videoElement, setVideoElement] = useState(null);
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
        if (videoElement) {
          videoElement.srcObject = stream;
        }
        if (onStreamReady) {
          onStreamReady(stream);
        }
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    } else if (
      (type === "local" || type === "remote") &&
      providedStream &&
      videoElement
    ) {
      videoElement.srcObject = providedStream;
    }
  };

  const stopMedia = () => {
    if (type === "input" && localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (videoElement) {
      videoElement.srcObject = null;
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
      videoElement
    ) {
      videoElement.srcObject = providedStream;
    }
  }, [providedStream, type, videoElement]);

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
            ref={(el) => setVideoElement(el)}
            autoPlay
            playsInline
            muted={type === "local" || type === "input"}
            className="w-full h-full rounded-md object-cover"
          />
        )}
        {type === "input" && (
          <div
            onClick={() => setShowVideo(!showVideo)}
            className="absolute bottom-5 left-[45%] bg-white rounded-md cursor-pointer active:scale-95 p-2"
          >
            {!showVideo ? (
              <CiVideoOn className="text-black" size={24} />
            ) : (
              <CiVideoOff className="text-black" size={24} />
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
