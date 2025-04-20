import databaseConnect from "@/app/lib/dbConnect";
import { authenticateRequest } from "@/app/lib/middleware";
import Chathistory from "@/app/models/Chathistory";
import Usermodel from "@/app/models/Usermodel";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(req) {
  try {
    await databaseConnect();

    let tokenWebData;
    try {
      tokenWebData = await authenticateRequest(req);
    } catch (err) {
      return NextResponse.json({ message: err.message }, { status: 401 });
    }

    if (!tokenWebData?.email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const chatRoute = await Usermodel.aggregate([
      { $match: { email: tokenWebData?.email } },
      {
        $project: {
          _id: 0,
          chatId: {
            $sortArray: {
              input: "$chatId",
              sortBy: { time_stamp: -1 },
            },
          },
        },
      },
    ]);

    if (!chatRoute) {
      return NextResponse.json(
        { message: "Provided email not found" },
        { status: 401 }
      );
    }

    return NextResponse.json({ message: chatRoute }, { status: 200 });
  } catch (err) {
    console.log(
      " --------------- >> Error in Chat ID << ------------------",
      err.message
    );
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    await databaseConnect();

    let tokenWebData;
    try {
      tokenWebData = await authenticateRequest(req);
    } catch (err) {
      return NextResponse.json({ message: err.message }, { status: 401 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Chat ID is required" },
        { status: 400 }
      );
    }

    if (!tokenWebData?.email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    await Chathistory.updateMany(
      { "streams.chatId": id },
      { $pull: { streams: { chatId: id } } }
    );

    await Usermodel.updateMany(
      { "chatId.routeId": id },
      { $pull: { chatId: { routeId: id } } }
    );

    return NextResponse.json(
      { message: "Chat data deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.log(
      " --------------- >> Error in Chat ID DELETE << ------------------",
      err.message
    );
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await databaseConnect();

    let tokenWebData;
    try {
      tokenWebData = await authenticateRequest(req);
    } catch (err) {
      return NextResponse.json({ message: err.message }, { status: 401 });
    }

    const { inputQuery } = await req.json();

    if (!tokenWebData?.email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    // const regex = new RegExp(inputQuery.split("").join(".*"), "i");

    // const partialFilterResponse = await Chathistory.aggregate([
    //   {
    //     $match: {
    //       userID: new mongoose.Types.ObjectId(tokenWebData._id.toString()),
    //       "streams.input": { $regex: regex },
    //     },
    //   },
    //   {
    //     $project: {
    //       streams: {
    //         $filter: {
    //           input: "$streams",
    //           as: "stream",
    //           cond: {
    //             $regexMatch: {
    //               input: "$$stream.input",
    //               regex: regex,
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    //   {
    //     $sort: { "streams.time_stamp": -1 },
    //   },
    // ]);

    // const streamsOnly = partialFilterResponse.flatMap(
    //   (item) => item.streams || []
    // );

    const filteredChats = inputQuery?.length
      ? tokenWebData.chatId
          .filter((chat) => {
            const regex = new RegExp(inputQuery.split("").join(".*"), "i");
            return regex.test(chat.chatSubTitle);
          })
          .sort((a, b) => b.time_stamp - a.time_stamp)
      : [];

    return NextResponse.json({ message: filteredChats }, { status: 200 });
  } catch (err) {
    console.log(
      " --------------- >> Error in Chat ID DELETE << ------------------",
      err.message
    );
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function PATCH(req) {
  try {
    await databaseConnect();

    let tokenWebData;
    try {
      tokenWebData = await authenticateRequest(req);
    } catch (err) {
      return NextResponse.json({ message: err.message }, { status: 401 });
    }

    const { chatSubTitle, routeId } = await req.json();

    if (!tokenWebData?.email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    const userId = new mongoose.Types.ObjectId(tokenWebData._id.toString());

    const updateData = await Usermodel.updateOne(
      {
        _id: userId,
        "chatId.routeId": routeId,
      },
      {
        $set: {
          "chatId.$.chatSubTitle": chatSubTitle,
        },
      }
    );

    if (updateData.modifiedCount === 0) {
      return NextResponse.json(
        { message: "No chat updated. Route ID might not exist." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Chat subtitle updated successfully." },
      { status: 200 }
    );
  } catch (err) {
    console.log(
      " --------------- >> Error in Chat PATCH << ------------------",
      err.message
    );
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
