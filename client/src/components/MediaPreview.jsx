/* eslint-disable react/prop-types */
import { useEffect, useRef } from "react";
import { CiVideoOff, CiVideoOn } from "react-icons/ci";
const MediaPreview = ({
  generateStream,
  stopStream,
  localStream,
  title = "",
  muted = false,
  height,
  width,
  controls,
}) => {
  const videoElement = useRef(null);

  useEffect(() => {
    if (videoElement.current) {
      videoElement.current.srcObject = localStream || null;
    }
  }, [localStream]);

  return (
    <div className="flex flex-col items-center gap-5">
      <h2 className="text-2xl font-semibold font-mono">{title}</h2>
      <div
        style={{ width: width, height: height }}
        className={` bg-slate-300 rounded-md  border border-gray-600 flex justify-center items-center relative`}
      >
        {!localStream ? (
          <h2 className="text-2xl text-black font-bold">No input</h2>
        ) : (
          <video
            ref={videoElement}
            autoPlay
            playsInline
            muted={muted}
            className="w-full h-full rounded-md object-cover"
          />
        )}
        {controls && (
          <div className="absolute bottom-1 left-[45%] bg-white rounded-md cursor-pointer active:scale-75 p-1 transition-all duration-300 hover:bg-gradient-to-r hover:from-purple-200 hover:to-purple-300 hover:shadow-lg ">
            {!localStream ? (
              <CiVideoOn
                onClick={() => generateStream(videoElement.current)}
                className="text-black  transition-all duration-300"
                size={24}
              />
            ) : (
              <CiVideoOff
                onClick={stopStream}
                className="text-black  transition-all duration-300"
                size={24}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MediaPreview;
