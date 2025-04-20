import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    chatId: [
      {
        routeId: {
          type: String,
          default: null,
          required: false,
        },
        time_stamp: {
          type: Number,
          required: true,
          default: () => null,
        },
        chatSubTitle: {
          type: String,
          default: "",
          required: false,
        },
        slightSolution: {
          type: String,
          default: "",
          required: false,
        },
      },
    ],
    toggleTheme: {
      type: String,
      default: "System",
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Usermodel ||
  mongoose.model("Usermodel", UserSchema);
