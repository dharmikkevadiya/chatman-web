import { createContext, useState } from "react";

export const AppContext = createContext();

const Context = ({ children }) => {
  const [user, setUser] = useState({});
  const [member, setMember] = useState({});
  const [chats, setChats] = useState({});
  const [showSidebar, setShowSidebar] = useState(true);
  const [members, setMembers] = useState([]);

  return (
    <AppContext.Provider
      value={{
        user,
        setUser,
        member,
        setMember,
        chats,
        setChats,
        showSidebar,
        setShowSidebar,
        members,
        setMembers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default Context;
