import databaseConnect from "@/app/lib/dbConnect";
import User from "@/app/models/Usermodel";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";

export async function POST(req) {
  try {
    await databaseConnect();

    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { message: "User Not found for Provided Credentials" },
        { status: 401 }
      );
    }

    if (password !== user.password) {
      return NextResponse.json(
        { message: "User Not found for Provided Credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, {
      expiresIn: "24h",
    });

    return NextResponse.json(
      {
        message: "Login successful",
        user: { email: user.email },
        token,
        user_id: user._id,
      },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
