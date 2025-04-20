import jwt from "jsonwebtoken";
import Usermodel from "../models/Usermodel";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function authenticateRequest(req) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("Authorization token missing or invalid");
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const user = await Usermodel.findById(decoded.id);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  } catch (err) {
    throw new Error(err.message);
  }
}
