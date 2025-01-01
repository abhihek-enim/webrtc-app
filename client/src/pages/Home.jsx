import { useState } from "react";
import MediaPreview from "../components/MediaPreview";
import {
  generateUserStream,
  stopUserMediaStream,
} from "../utils/streamService";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [localStream, setLocalStream] = useState(null);
  const [isJoin, setIsJoin] = useState(false);
  const [callCode, setCallCode] = useState("");
  const handleStartCall = () => {
    const newRoomId = Math.floor(
      1000000000 + Math.random() * 9000000000
    ).toString();
    navigate(`/call/${newRoomId}`);
  };
  const handleCallCodeChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,10}$/.test(value)) {
      setCallCode(value);
    }
  };
  const handleGenerateStream = async (videoElement) => {
    await generateUserStream(videoElement, setLocalStream);
  };
  const handleStopStream = async () => {
    await stopUserMediaStream(localStream, setLocalStream);
  };
  return (
    <div>
      <div className="border border-gray-400 flex  justify-around items-center px-2 py-4 rounded-md">
        <button
          onClick={() => setIsJoin(!isJoin)}
          className={`px-4 py-2 bg-purple-200 text-black rounded-md hover:bg-purple-400 text-base font-medium active:scale-90 transition-all duration-300 ${
            !isJoin ? "bg-purple-400" : ""
          }`}
        >
          Start a Call
        </button>
        <button
          onClick={() => setIsJoin(!isJoin)}
          className={`px-4 py-2 bg-purple-200 text-black rounded-md hover:bg-purple-400 text-base font-medium active:scale-90 transition-all duration-300 ${
            isJoin ? "bg-purple-400" : ""
          }`}
        >
          Join a Call
        </button>
      </div>
      {isJoin ? (
        <form className="flex flex-col items-center gap-10 mt-6 p-3 border border-gray-300 rounded-md">
          <h2 className="text-2xl font-semibold font-mono">
            Enter call-code to join
          </h2>
          <input
            type="text"
            value={callCode}
            onChange={handleCallCodeChange}
            placeholder="9876543210"
            className="px-6 py-3 rounded-md border border-gray-300 text-black text-xl font-medium focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-300 w-full"
          />

          <button
            disabled={!callCode}
            className="w-full py-3 bg-purple-200 text-black rounded-md hover:bg-purple-400 text-xl font-bold active:scale-90 transition-all duration-300"
          >
            Join
          </button>
        </form>
      ) : (
        <div className="flex flex-col items-center gap-10 mt-6 p-3 border border-gray-300 rounded-md">
          <MediaPreview
            title="Media Preview:"
            controls={true}
            localStream={localStream}
            generateStream={handleGenerateStream}
            stopStream={handleStopStream}
            height="150px"
            width="300px"
          />
          <button
            onClick={handleStartCall}
            className={` w-full  py-3 bg-purple-200 text-black rounded-md hover:bg-purple-400 text-xl  font-bold active:scale-90 transition-all duration-300`}
          >
            Start
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
