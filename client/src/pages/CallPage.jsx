import { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import MediaPreview from "../components/MediaPreview";

const CallPage = () => {
  const { roomId } = useParams;
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);

  const initializeSocket = () => {
    socket.current = io(import.meta.env.VITE_REMOTE_URL);
    socket.current.emit("join-room", roomId);
    socket.current.on("signal", handleSignal);
  };
  const handleSignal = async ({ senderId, data }) => {
    if (data.candidate) {
      await peerConnection.current.addIceCandidate(data.candidate);
    }
    if (data.sdp) {
      if (data.sdp.type === "offer") {
        await peerConnection.current.setRemoteDescription(data.sdp);
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        socket.current.emit("signal", { roomId, data: { sdp: answer } });
      } else if (data.sdp.type === "answer") {
        await peerConnection.current.setRemoteDescription(data.sdp);
      }
    }
  };
  const initializeMediaAndPeerConnection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localVideoRef.current.srcObject = stream;

      setupPeerConnection(stream);
      createAndSendOffer();
    } catch (error) {
      console.error("Error accessing media devices:", error);
    }
  };

  // Set Up Peer Connection
  const setupPeerConnection = (stream) => {
    peerConnection.current = new RTCPeerConnection();

    stream
      .getTracks()
      .forEach((track) => peerConnection.current.addTrack(track, stream));

    peerConnection.current.ontrack = (event) => {
      remoteVideoRef.current.srcObject = event.streams[0];
    };

    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current.emit("signal", {
          roomId,
          data: { candidate: event.candidate },
        });
      }
    };
  };

  // Create and Send Offer
  const createAndSendOffer = async () => {
    const offer = await peerConnection.current.createOffer();
    await peerConnection.current.setLocalDescription(offer);
    socket.current.emit("signal", {
      roomId,
      data: { sdp: peerConnection.current.localDescription },
    });
  };

  useEffect(() => {
    initializeSocket();
    initializeMediaAndPeerConnection();

    return () => {
      if (peerConnection.current) peerConnection.current.close();
      if (socket.current) socket.current.disconnect();
    };
  }, [roomId]);

  return (
    <div className="flex flex-col justify-center items-center">
      <h1 className="text-2xl text-gray-400 font-bold mb-6">
        {" "}
        On-Going call:{" "}
      </h1>
      <div className="relative w-full h-auto border  ">
        <div className="w-[500px] h-[300px] border border-white rounded-md">
          <MediaPreview type="remote" />
        </div>
        <div className="w-[200px] h-[120px]  border border-white absolute bottom-1 right-1 rounded-md ">
          <MediaPreview type="local" />
        </div>
      </div>
      <div>
        <button
          className="px-4 py-2 bg-red-200 text-black rounded-md hover:bg-red-400 text-base font-medium active:scale-90 transition-all duration-300 m-4
"
        >
          End Call
        </button>
      </div>
    </div>
  );
};

export default CallPage;
