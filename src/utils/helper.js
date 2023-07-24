import axios from "axios";
import moment from "moment";
import { BASE_URL } from "../config";

const validateUsername = (username) => {
  // Regular expression pattern for username validation
  var pattern = /^[a-zA-Z0-9._ ]{3,20}$/;

  // Check if the username matches the pattern
  return pattern.test(username);
};

const checkUsernameExist = async (username) => {
  const response = await axios.post(`${BASE_URL}/users/validateUsername`, {
    username,
  });
  const result = response.data;

  return result;
};

const fromNow = (dt) => moment(dt).fromNow();
const time = (dt) => moment(dt).format("HH:mm");

export { validateUsername, checkUsernameExist, fromNow, time };
