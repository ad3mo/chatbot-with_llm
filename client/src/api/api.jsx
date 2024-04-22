import axios from "axios";

export const loginUser = async (email, password) => {
  try {
    const res = await axios.post("/login", { email, password });
    if (res.status === 200) {
      return res.data;
    } else {
      throw new Error("Unable to login");
    }
  } catch (error) {
    throw new Error("Unable to login");
  }
};

export const checkAuthStatus = async () => {
  const res = await axios.get("/status");
  if (res.status !== 200) {
    throw new Error("Unable to authenticate");
  }
  const data = await res.data;
  return data;
};

export const signupUser = async (email, username, password) => {
  const res = await axios.post("/register", { email, username, password });
  if (res.status !== 201) {
    throw new Error("Unable to Signup");
  }
  const data = await res.data;
  return data;
};

export const logoutUser = async () => {
  const res = await axios.get("/logout");
  if (res.status !== 200) {
    throw new Error("Unable to logout");
  }
  const data = await res.data;
  return data;
};
