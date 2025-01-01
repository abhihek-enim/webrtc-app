import { io } from "socket.io-client";

export const initializeSocket = (roomId, handleSignal) => {
  const socket = io(import.meta.env.VITE_REMOTE_URL);
  socket.emit("join-room", roomId);
  socket.on("signal", handleSignal);
  return socket;
};

export const setupPeerConnection = (stream, onTrack, onIceCandidate) => {
  const configuration = {
    iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
  };

  const peerConnection = new RTCPeerConnection(configuration);

  stream.getTracks().forEach((track) => {
    peerConnection.addTrack(track, stream);
  });

  peerConnection.ontrack = (event) => {
    if (onTrack) onTrack(event.streams[0]);
  };

  peerConnection.onicecandidate = (event) => {
    if (event.candidate && onIceCandidate) {
      onIceCandidate(event.candidate);
    }
  };

  return peerConnection;
};

export const createAndSendOffer = async (peerConnection, socket, roomId) => {
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

export const stopMediaStream = (stream) => {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
};
