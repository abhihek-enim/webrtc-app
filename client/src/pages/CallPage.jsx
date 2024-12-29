import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import MediaPreview from "../components/MediaPreview";

const CallPage = () => {
  const { roomId } = useParams();

  const [peerConnection, setPeerConnection] = useState(null);
  const [socket, setSocket] = useState(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const initializeSocket = () => {
    const newSocket = io(import.meta.env.VITE_REMOTE_URL);
    newSocket.emit("join-room", roomId);
    newSocket.on("signal", handleSignal);
    setSocket(newSocket);
  };

  const handleSignal = async ({ senderId, data }) => {
    if (!peerConnection) return;

    if (data.candidate) {
      try {
        await peerConnection.addIceCandidate(data.candidate);
      } catch (e) {
        console.error("Error adding ICE candidate:", e);
      }
    }
    if (data.sdp) {
      try {
        if (data.sdp.type === "offer") {
          await peerConnection.setRemoteDescription(data.sdp);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit("signal", { roomId, data: { sdp: answer } });
        } else if (data.sdp.type === "answer") {
          await peerConnection.setRemoteDescription(data.sdp);
        }
      } catch (e) {
        console.error("Error handling SDP:", e);
      }
    }
  };

  const setupPeerConnection = (stream) => {
    const configuration = {
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    };

    const newPeerConnection = new RTCPeerConnection(configuration);

    stream.getTracks().forEach((track) => {
      newPeerConnection.addTrack(track, stream);
    });

    newPeerConnection.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
    };

    newPeerConnection.onicecandidate = (event) => {
      if (event.candidate && socket) {
        socket.emit("signal", {
          roomId,
          data: { candidate: event.candidate },
        });
      }
    };

    setPeerConnection(newPeerConnection);
  };

  const createAndSendOffer = async () => {
    if (!peerConnection || !socket) return;

    try {
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      socket.emit("signal", {
        roomId,
        data: { sdp: peerConnection.localDescription },
      });
    } catch (error) {
      console.error("Error creating offer:", error);
    }
  };

  const initializeMediaAndPeerConnection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setLocalStream(stream);
      setupPeerConnection(stream);
      createAndSendOffer();
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  const handleEndCall = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
    if (socket) {
      socket.disconnect();
      setSocket(null);
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
            stream={remoteStream}
            width="500px"
            height="300px"
            autoStart={true}
          />
        </div>
        <div className="w-[200px] h-[120px] absolute bottom-1 right-1 rounded-md">
          <MediaPreview
            type="local"
            stream={localStream}
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
