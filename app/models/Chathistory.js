import mongoose from "mongoose";

const ChatSchema = new mongoose.Schema(
  {
    userID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usermodel",
      required: true,
    },
    streams: [
      {
        input: { type: String, required: true },
        modelSolution: { type: String, required: true },
        time_stamp: {
          type: Number,
          required: true,
          default: new Date().getTime(),
        },
        chatId: {
          type: String,
          required: false,
          default: null,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Chathistory ||
  mongoose.model("Chathistory", ChatSchema);
