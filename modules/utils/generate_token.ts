import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
interface tokenPayload {
  user_id: string;
}

export const generateToken = async (payload: tokenPayload) => {
  const secret_key = process.env.SECRET_KEY as string;
  return jwt.sign(payload, secret_key, { expiresIn: "7d" });
};
