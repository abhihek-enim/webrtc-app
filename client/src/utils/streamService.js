export async function generateUserStream(videoElement, setLocalStream) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: true,
    });
    setLocalStream(stream);
    if (videoElement) {
      videoElement.srcObject = stream;
    }
  } catch (error) {
    console.log(error);
  }
}

export const stopUserMediaStream = async (localStream, setLocalStream) => {
  try {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }
  } catch (error) {
    console.log(error);
  }
};
