import { useState } from "react";
import { useNavigate } from "react-router-dom";
import MediaPreview from "../components/MediaPreview";

const Home = () => {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();
  const [isJoin, setIsJoin] = useState(true);
  const handleCreateCall = () => {
    const newRoomId = Math.random().toString().substr(2, 9);

    navigate(`/call/${newRoomId}`);
  };
  return (
    <div className="">
      <h1 className="text-2xl font-semibold text-gray-300 m-2 text-center">
        Web-RTC Video Call App:
      </h1>
      <div className="border border-gray-400 flex  justify-around items-center p-2 rounded-md">
        <button
          onClick={() => setIsJoin(!isJoin)}
          className={`px-4 py-2 bg-purple-200 text-black rounded-md hover:bg-purple-400 text-base font-medium active:scale-90 transition-all duration-300 ${
            !isJoin ? "bg-purple-400" : ""
          }`}
        >
          Create a Call
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
      {!isJoin && (
        <MediaPreview
          type="input"
          onCreateCall={handleCreateCall}
          width="200px"
          height="120px"
        />
      )}
      {isJoin && (
        <div className="flex flex-col justify-around items-center h-[20vh] border border-gray-400 rounded-md m-2">
          <input
            className="px-6 py-2 rounded-md outline-teal-300 border-none bg-gray-600 placeholder:text-gray-300"
            type="text"
            placeholder="Enter Room ID"
            value={roomId}
            onChange={(e) => setRoomId(e.target.value)}
          />
          <button className="px-4 py-2 bg-teal-200 text-black rounded-md hover:bg-teal-400 text-base font-medium active:scale-90 transition-all duration-300">
            Join Call
          </button>
        </div>
      )}
    </div>
  );
};

export default Home;
