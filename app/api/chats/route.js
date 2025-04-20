import databaseConnect from "@/app/lib/dbConnect";
import { NextResponse } from "next/server";
import axios from "axios";
import Chathistory from "@/app/models/Chathistory";
import Usermodel from "@/app/models/Usermodel";
import { authenticateRequest } from "@/app/lib/middleware";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    try {
      await databaseConnect();
    } catch (dbErr) {
      return NextResponse.json(
        { error: "DB connection failed" },
        { status: 500 }
      );
    }

    let tokenData;
    try {
      tokenData = await authenticateRequest(req);
    } catch (err) {
      return NextResponse.json({ message: err.message }, { status: 401 });
    }

    let body;
    try {
      body = await req.json();
    } catch (jsonErr) {
      console.error("Invalid JSON:", jsonErr.message);
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const { message, chatId } = body;

    if (!message) {
      return NextResponse.json(
        { message: "Ask your question first." },
        { status: 400 }
      );
    }

    let response;
    // try {
    //   response = await axios.post(
    //     "https://api-inference.huggingface.co/models/tiiuae/falcon-7b-instruct",
    //     { inputs: message },
    //     {
    //       headers: {
    //         Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
    //         "Content-Type": "application/json",
    //       },
    //     }
    //   );
    // } catch (err) {
    //   console.error(err.message);
    // }

    // ----------------------->> CHat model to generate answers  <<-----------------------------
    try {
      response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model: "mistralai/mistral-7b-instruct",
          messages: [{ role: "user", content: message }],
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error("Error:", error.message);
    }

    let user;
    try {
      user = await Usermodel.findOne({ email: tokenData?.email });
      if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }
    } catch (userErr) {
      console.error("User fetch error:", userErr.message);
      return NextResponse.json(
        { error: "User lookup failed" },
        { status: 500 }
      );
    }

    let updateChatData;
    try {
      updateChatData = await Chathistory.findOne({ userID: user._id });
      if (!updateChatData) {
        updateChatData = new Chathistory({
          userID: user._id,
          streams: [],
          chatId,
        });
      }
    } catch (chatErr) {
      console.error("Chat history error:", chatErr.message);
    }
    try {
      updateChatData.streams.push({
        input: message,
        modelSolution:
          response.data.choices[0].message.content || "No response",
        chatId: chatId,
        time_stamp: Date.now(),
      });
    } catch (err) {}

    if (chatId) {
      let chatExists;
      try {
        chatExists = await Usermodel.findOne({
          _id: user._id,
          "chatId.routeId": chatId,
        });
      } catch (err) {
        console.log(
          "------------- Error in fetching id ------------",
          err.message
        );
      }
      if (!chatExists) {
        try {
          await Usermodel.updateOne(
            { _id: user._id },
            {
              $push: {
                chatId: {
                  routeId: chatId,
                  time_stamp: Date.now(),
                  chatSubTitle: extractChatSubtitle(
                    response.data.choices[0].message.content
                  ),
                  slightSolution: response.data.choices[0].message.content,
                },
              },
            }
          );
        } catch (err) {
          console.log(
            "------------- Error in updating id ------------",
            err.message
          );
        }
      } else {
        try {
          await Usermodel.updateOne(
            {
              _id: user._id,
              "chatId.routeId": chatId,
            },
            {
              $set: {
                "chatId.$.time_stamp": Date.now(),
              },
            }
          );
        } catch (err) {
          console.log(
            "------------- Error in updating time_stamp ------------",
            err.message
          );
        }
      }
    }

    try {
      await updateChatData.save();
    } catch (saveErr) {
      console.error("Error saving chat data:", saveErr.message);
      return NextResponse.json(
        { error: "Could not save chat history" },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: updateChatData }, { status: 200 });
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}

function extractChatSubtitle(generatedText) {
  if (!generatedText) return "No response";

  const cleanedText = generatedText.replace(/\s+/g, " ").trim();
  const words = cleanedText.split(" ");

  const shortText = words.slice(0, 4).join(" ");
  return shortText.charAt(0).toUpperCase() + shortText.slice(1);
}

export async function PATCH(req) {
  try {
    try {
      await databaseConnect();
    } catch (dbErr) {
      return NextResponse.json(
        { error: "DB connection failed" },
        { status: 500 }
      );
    }

    let tokenData;
    try {
      tokenData = await authenticateRequest(req);
    } catch (err) {
      return NextResponse.json({ message: err.message }, { status: 401 });
    }

    const { toggleTheme } = await req.json();
    const userId = new mongoose.Types.ObjectId(tokenData._id.toString());

    await Usermodel.updateOne({ _id: userId }, { $set: { toggleTheme } });

    return NextResponse.json({ message: toggleTheme }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process your request" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
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

    const userId = new mongoose.Types.ObjectId(tokenWebData._id.toString());

    await Chathistory.deleteMany({ userID: userId });

    await Usermodel.updateOne({ _id: userId }, { $set: { chatId: [] } });

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
