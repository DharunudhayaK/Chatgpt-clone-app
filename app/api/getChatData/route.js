import databaseConnect from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";
import Chathistory from "@/app/models/Chathistory";
import { authenticateRequest } from "@/app/lib/middleware";

export async function GET(req) {
  try {
    await databaseConnect();

    let user;
    try {
      user = await authenticateRequest(req);
    } catch (err) {
      return NextResponse.json(
        { message: err.message },
        { status: err.code || 401 }
      );
    }

    const userChatId = req.nextUrl.searchParams.get("id");

    const getChat = await Chathistory.findOne(
      { "streams.chatId": userChatId },
      { userID: 1, _id: 1, streams: 1 }
    );

    if (!getChat) {
      return NextResponse.json(
        { message: "No chat history found" },
        { status: 404 }
      );
    }

    const filteredStreams = getChat.streams.filter(
      (stream) => stream.chatId === userChatId
    );

    return NextResponse.json(
      {
        message: {
          _id: getChat._id,
          userID: getChat.userID,
          streams: filteredStreams,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}
