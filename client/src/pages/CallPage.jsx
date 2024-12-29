import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import MediaPreview from "../components/MediaPreview";

const CallPage = () => {
  const { roomId } = useParams();
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);
  const localStream = useRef(null);
  const remoteStream = useRef(null);

  const initializeSocket = () => {
    socket.current = io(import.meta.env.VITE_REMOTE_URL);
    socket.current.emit("join-room", roomId);
    socket.current.on("signal", handleSignal);
  };

  const handleSignal = async ({ senderId, data }) => {
    if (!peerConnection.current) return;

    if (data.candidate) {
      try {
        await peerConnection.current.addIceCandidate(data.candidate);
      } catch (e) {
        console.error("Error adding ICE candidate:", e);
      }
    }
    if (data.sdp) {
      try {
        if (data.sdp.type === "offer") {
          await peerConnection.current.setRemoteDescription(data.sdp);
          const answer = await peerConnection.current.createAnswer();
          await peerConnection.current.setLocalDescription(answer);
          socket.current.emit("signal", { roomId, data: { sdp: answer } });
        } else if (data.sdp.type === "answer") {
          await peerConnection.current.setRemoteDescription(data.sdp);
        }
      } catch (e) {
        console.error("Error handling SDP:", e);
      }
    }
  };

  const initializeMediaAndPeerConnection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStream.current = stream;
      setupPeerConnection(stream);
      createAndSendOffer();
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const setupPeerConnection = (stream) => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    peerConnection.current = new RTCPeerConnection(configuration);

    stream.getTracks().forEach((track) => {
      peerConnection.current.addTrack(track, stream);
    });

    peerConnection.current.ontrack = (event) => {
      remoteStream.current = event.streams[0];
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current?.emit("signal", {
          roomId,
          data: { candidate: event.candidate },
        });
      }
    };
  };

  const createAndSendOffer = async () => {
    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      socket.current.emit("signal", {
        roomId,
        data: { sdp: peerConnection.current.localDescription },
      });
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  const handleEndCall = () => {
    if (localStream.current) {
      localStream.current.getTracks().forEach((track) => track.stop());
      localStream.current = null;
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    if (socket.current) {
      socket.current.disconnect();
      socket.current = null;
    }
  };

  useEffect(() => {
    initializeSocket();
    initializeMediaAndPeerConnection();

    return () => {
      handleEndCall();
    };
  }, [roomId]);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl text-gray-400 font-bold mb-6">On-Going call</h1>
      <div className="relative w-full h-full">
        <div className="w-[500px] h-[300px] rounded-md">
          <MediaPreview
            type="remote"
            videoRef={remoteVideoRef}
            stream={remoteStream.current}
            width="500px"
            height="300px"
            autoStart={true}
          />
        </div>
        <div className="w-[200px] h-[120px] absolute bottom-1 right-1 rounded-md">
          <MediaPreview
            type="local"
            videoRef={localVideoRef}
            stream={localStream.current}
            width="200px"
            height="120px"
            autoStart={true}
          />
        </div>
      </div>
      <div>
        <button
          onClick={handleEndCall}
          className="px-4 py-2 bg-red-200 text-black rounded-md hover:bg-red-400 text-base font-medium active:scale-90 transition-all duration-300 m-4"
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default CallPage;
