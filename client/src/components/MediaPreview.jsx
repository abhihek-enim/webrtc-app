/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";

const MediaPreview = ({ onCreateCall }) => {
  const videoRef = useRef(null);
  const [showVideo, setShowVideo] = useState(false);
  const [mediaStream, setMediaStream] = useState(null);

  const startMedia = async () => {
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
  };

  const stopMedia = () => {
    if (mediaStream) {
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
        Local Media Device Check:
      </h2>
      {!showVideo ? (
        <div className="w-[200px] h-[150px] bg-gray-400 rounded-md flex justify-center items-center hover:cursor-not-allowed">
          <h2 className="text-2xl font-bold text-black  ">No Input</h2>
        </div>
      ) : (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="border border-white w-[200px] h-[150px] rounded-md cursor-pointer  "
        />
      )}

      <div className="flex justify-center items-center m-2 gap-4">
        <button
          className="px-4 py-2 bg-teal-200 text-black rounded-md hover:bg-teal-400 text-base font-medium active:scale-90 transition-all duration-300"
          onClick={() => setShowVideo(!showVideo)}
        >
          Toggle Video Input
        </button>
        <button
          onClick={onCreateCall}
          className="px-4 py-2 bg-teal-200 text-black rounded-md hover:bg-teal-400 text-base font-medium active:scale-90 transition-all duration-300"
        >
          Create Call
        </button>
      </div>
    </div>
  );
};

export default MediaPreview;
