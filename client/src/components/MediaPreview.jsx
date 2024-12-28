import { useEffect, useRef, useState } from "react";

const MediaPreview = () => {
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
    <div>
      <h2>Local Media Device Check:</h2>
      {!showVideo ? (
        <div
          style={{
            width: "400px",
            height: "300px",
            backgroundColor: "gray",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h2>Video off</h2>
        </div>
      ) : (
        <video ref={videoRef} autoPlay playsInline style={{ width: "400px" }} />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "5px",
          marginTop: "10px",
        }}
      >
        <h3>Controls:</h3>
        <button onClick={() => setShowVideo(!showVideo)}>
          Toggle Video Input
        </button>
        <button>Make Call</button>
      </div>
    </div>
  );
};

export default MediaPreview;
