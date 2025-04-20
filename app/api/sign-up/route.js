import databaseConnect from "@/app/lib/dbConnect";
import Usermodel from "@/app/models/Usermodel";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    await databaseConnect();

    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const existingUser = await Usermodel.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "User Email already exists" },
        { status: 409 }
      );
    }

    const user = new Usermodel({ email, password });
    await user.save();

    return NextResponse.json({ message: "User registered successfully" });
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
