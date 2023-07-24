export const INITIAL_STATE = {
  avatar: "",
  username: "",
  errorMsg: "",
  loading: false,
};

export const joinReducer = (state, action) => {
  switch (action.type) {
    case "CHANGE_INPUT":
      return {
        ...state,
        [action.payload.name]: action.payload.value,
        errorMsg: "",
      };

    case "SELECT_AVATAR":
      return {
        ...state,
        errorMsg: "",
        avatar: action.payload,
      };

    case "ON_ERROR":
      return {
        ...state,
        errorMsg: action.payload || "Something went wrong!",
        loading: false,
      };

    case "ON_SUBMIT":
      return {
        ...state,
        loading: true,
      };

    default:
      return state;
  }
};
