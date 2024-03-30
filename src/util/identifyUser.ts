import crypto from "crypto";

const identifyUser = () => {
  localStorage.setItem("user", crypto.randomBytes(16).toString("hex"));
};

const getUser = () => {
  return localStorage.getItem("user");
};
