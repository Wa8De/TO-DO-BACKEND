const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    BoardId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Board",
      required: true,
    },
    name: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ["to-do", "in-progress", "finished", "on-hold", "canceled"],
      default: "to-do",
      required: true,
    },
    order: {
      type: Number,
      required: false,
    },
    thumbnail: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Task", TaskSchema);
