
import jwt from "jsonwebtoken";
import envconfig from "../configs/env/env.config.js";

export const generateToken = (payload) => {
  return jwt.sign(payload, envconfig.jwtsignature, {
    expiresIn: "7d",
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, envconfig.jwtsignature);
};