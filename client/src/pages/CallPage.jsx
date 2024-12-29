import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_REMOTE_URL);
const CallPage = () => {
  const { roomId } = useParams;
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);

  useEffect(() => {
    // socket.emit("join-room", roomId);
  }, []);

  return <div></div>;
};

export default CallPage;
