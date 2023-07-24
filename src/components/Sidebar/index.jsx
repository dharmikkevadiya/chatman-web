import "./style.css";
import { VscVerifiedFilled } from "react-icons/vsc";
import { AppContext } from "../../context/Context";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { BASE_URL } from "../../config";
import { fromNow, time } from "../../utils/helper";

const Sidebar = () => {
  const { user, setMember, setShowSidebar, members, setMembers, chats } =
    useContext(AppContext);
  const [searchResults, setSearchResults] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const filteredResults = members.filter((member) =>
      member.username.toLowerCase().includes(search.toLowerCase())
    );
    setSearchResults(filteredResults);
  }, [members, search]);

  useEffect(() => {
    // Fetch user data from the API
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/users`, {
          params: { userId: user._id },
        });
        setMembers(data.result);
        setMember(data.result[0]);
      } catch (err) {
        console.log("Err part:: " + err);
      }
    };
    fetchUsers();
  }, [setMember, setMembers, user._id]);

  const handleSelectMember = (val) => {
    setMember(val);

    if (window.innerWidth <= 650) setShowSidebar(false);
  };

  function getIncomingChatCount(senderId) {
    const userChats = chats[senderId] || []; // Assuming `chats` is your state variable

    const incomingChats = userChats.filter((chat) => chat.type === "incoming");
    const incomingChatCount = incomingChats.length;

    const count = incomingChatCount > 99 ? "99+" : incomingChatCount;
    return count;
  }

  console.count("Sidebar render");

  return (
    <main className="sidebar">
      <div className="top_section">
        <div className="profile">
          <img src={user.avatar} alt="" className="avatar" />
          <p>{user.username}</p>
        </div>
        <div className="total_user">Live users: {members.length}</div>
      </div>

      <div className="search">
        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="chat_list">
        {searchResults.map((member, index) => {
          return (
            <div
              className="item"
              key={member._id}
              onClick={() => handleSelectMember(member)}
            >
              <img src={member.avatar} className="avatar" alt="" />
              <div className="info">
                <p className="name">
                  {member.username}
                  {member.role === "admin" && (
                    <span>
                      <VscVerifiedFilled />
                    </span>
                  )}
                </p>
                <p className="time">{time(member.updatedAt)}</p>
                <p className="message">{fromNow(member.updatedAt)}</p>
                {getIncomingChatCount(member._id) ? (
                  <p className="count">{getIncomingChatCount(member._id)}</p>
                ) : (
                  ""
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

export default Sidebar;
