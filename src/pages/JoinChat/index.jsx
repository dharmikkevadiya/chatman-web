import { useContext, useReducer } from "react";
import "./style.css";
import avatars from "../../helper/avatar";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";
import { INITIAL_STATE, joinReducer } from "../../context/joinReducer";
import { AppContext } from "../../context/Context";
import { checkUsernameExist, validateUsername } from "../../utils/helper";

const JoinChat = () => {
  const navigate = useNavigate();
  const [state, dispatch] = useReducer(joinReducer, INITIAL_STATE);
  const { setUser } = useContext(AppContext);

  const handleChange = async (e) => {
    dispatch({
      type: "CHANGE_INPUT",
      payload: {
        name: e.target.name,
        value: e.target.value,
      },
    });

    if (!validateUsername(e.target.value)) {
      dispatch({
        type: "ON_ERROR",
        payload: "Invalid username!",
      });
    }

    const res = await checkUsernameExist(e.target.value);
    if (res.result?.message)
      dispatch({
        type: "ON_ERROR",
        payload: res.result?.message,
      });
  };

  const handleAvatarSelection = (url) => {
    dispatch({
      type: "SELECT_AVATAR",
      payload: url,
    });
  };

  const handleJoin = async (e) => {
    e.preventDefault();
    try {
      dispatch({
        type: "ON_SUBMIT",
      });

      // validation
      if (!state.avatar) {
        dispatch({
          type: "ON_ERROR",
          payload: "Please select a avatar!",
        });
        return;
      }
      if (!state.username) {
        dispatch({
          type: "ON_ERROR",
          payload: "Please enter a username!",
        });
        return;
      }

      //   api call
      const response = await axios.post(`${BASE_URL}/join`, {
        username: state.username,
        avatar: state.avatar,
      });
      const result = response.data;

      if (result.status === 200) {
        const userData = result.result;
        localStorage.setItem("user", JSON.stringify(userData));

        socket.emit("join", {
          userId: userData._id,
        });
        setUser(userData);
        navigate("/app");
      } else {
        dispatch({
          type: "ON_ERROR",
          payload: result.message,
        });
      }
    } catch (e) {
      dispatch({ type: "ON_ERROR" });
      console.error("Err part::", e);
    }
  };

  return (
    <>
      <main className="join_container">
        <div className="left">
          <div className="join_box">
            <div className="heading">
              Welcome To <span>Live Chat</span>
            </div>

            <form onSubmit={handleJoin}>
              <div className="form-group">
                <label htmlFor="avatar">Avatar</label>
                <div className="avatar_list">
                  {avatars.map((elem, index) => {
                    return (
                      <img
                        src={elem}
                        alt=""
                        className={state.avatar === elem ? "selected" : ""}
                        onClick={() => handleAvatarSelection(elem)}
                        key={index}
                      />
                    );
                  })}
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="phone">Name</label>
                <input
                  type="text"
                  name="username"
                  value={state.username}
                  onChange={handleChange}
                  autoComplete="off"
                  disabled={state.loading}
                />
              </div>

              <p className="error">{state.errorMsg}</p>
              <div className="join-btn">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={state.loading}
                >
                  Join
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="right">
          <div className="content">
            <h1>Chatman</h1>
            <p>Ready to connect</p>
            <p>
              Connect & chat in real-time with Chatman. Choose your avatar and
              join the conversation. No storage, no worries - your chats are
              transient, ensuring privacy and a fresh start with each visit.
              Experience the joy of connecting with others in a fun and engaging
              way.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default JoinChat;
