import "./App.css";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import JoinChat from "./pages/JoinChat";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "./socket";
import { AppContext } from "./context/Context";

function App() {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { user, setChats, setMembers } = useContext(AppContext);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
    }

    // Fetch user data from the API
    if (Object.keys(user).length === 0) navigate("/");

    function onReciveMessage({ senderId, message: content, createdAt, type }) {
      setChats((prevChats) => ({
        ...prevChats,
        [senderId]: [
          ...(prevChats[senderId] || []),
          { senderId, content, createdAt, type },
        ],
      }));
    }

    function onUserJoin(newUser) {
      setMembers((prevUsers) => {
        const updatedMembers = [...prevUsers];
        updatedMembers.splice(1, 0, newUser);
        return updatedMembers;
      });
    }

    function onUserLeft(userId) {
      setMembers((prevUsers) => {
        const updatedMembers = prevUsers.filter(
          (member) => member._id !== userId
        );
        return updatedMembers;
      });
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("receive_message", onReciveMessage);
    socket.on("user_join", onUserJoin);
    socket.on("user_left", onUserLeft);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive_message", onReciveMessage);
      socket.off("user_join", onUserJoin);
      socket.off("user_left", onUserLeft);
    };
  }, [navigate, setChats, setMembers, user]);

  return (
    <div className="App">
      <Routes path="/">
        <Route index element={<JoinChat />} />
        <Route path="app" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
