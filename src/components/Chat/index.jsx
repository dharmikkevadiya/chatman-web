import "./style.css";
import { FiSearch } from "react-icons/fi";
import { IoIosCall, IoMdSend } from "react-icons/io";
import { CgMoreVerticalAlt } from "react-icons/cg";
import { GrEmoji } from "react-icons/gr";
import { socket } from "../../socket";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../context/Context";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { fromNow, time } from "../../utils/helper";

const Chat = () => {
  const ref = useRef();
  const [message, setMessage] = useState("");
  const { user, member } = useContext(AppContext);
  const { chats, setChats, setShowSidebar } = useContext(AppContext);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [chats, member]);

  const handleBackButtonClick = () => {
    setShowSidebar(true);
  };

  const handleSend = () => {
    if (message.trim() === "") return;

    const createdAt = new Date();
    const senderId = user._id;
    const receiverId = member._id;

    socket.emit("send_message", {
      message,
      senderId,
      receiverId,
    });

    setChats((prevChats) => ({
      ...prevChats,
      [receiverId]: [
        ...(prevChats[receiverId] || []),
        { senderId, content: message, type: "outgoing", createdAt },
      ],
    }));
    setMessage("");
  };

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  const renderChatHistory = (user) => {
    const userChats = chats[user] || [];

    return userChats.map((message, i) => (
      <div className={message.type} key={i}>
        <p>{message.content}</p>
        <p className="time">
          {time(message.createdAt)} <span>✔</span>
        </p>
      </div>
    ));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSend();
  };
  console.count("Chat render");

  return (
    <div className="chat_section">
      <div className="top">
        <MdOutlineKeyboardBackspace
          className="icon_back"
          onClick={handleBackButtonClick}
        />

        <img src={member.avatar} className="avatar" alt="" />
        <div className="info">
          <p className="name">{member.username}</p>
          <p className="online_status">{fromNow(member.updatedAt)}</p>
        </div>

        <p className="icon">
          <FiSearch />
        </p>
        <p className="icon">
          <IoIosCall />
        </p>
        <p className="icon">
          <CgMoreVerticalAlt />
        </p>
      </div>
      <main>
        <div className="content">
          <div className="messages">{renderChatHistory(member._id)}</div>
          <div ref={ref}></div>
          <div className="input_bar">
            <GrEmoji className="icon" />
            <input
              type="text"
              placeholder="Type Something..."
              value={message}
              onChange={(e) => handleMessageChange(e)}
              onKeyDown={(e) => handleKeyPress(e)}
              disabled={member.role === "admin" ? true : false}
            />
            <IoMdSend className="icon" onClick={handleSend} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
