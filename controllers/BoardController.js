const Board = require("../models/Board");
const path = require("path");
const fs = require("fs");
const User = require("../models/User");
// Create a new contact
const createBoard = async (req, res) => {
  try {
    const OwnerId = res.locals.id;
    const { title, description, background } = req.body;

    // const thumbnail = req.file ? req.file.filename : null;

    const board = new Board({
      OwnerId,
      title,
      description,
      background,
    });
    await board.save();

    res.status(201).json({
      success: true,
      message: "Board created successfully",
      board,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get all contacts
const getUserBoards = async (req, res) => {
  try {
    const OwnerId = res.locals.id;
    console.log(OwnerId);

    const boards = await Board.find({ OwnerId }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      boards,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Get Task by ID
const getBoardById = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }
    res.json({
      success: true,
      board,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

const updateBoard = async (req, res) => {
  const { title, description, background } = req.body;

  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // let newThumbnail = req.file ? req.file.filename : null;

    // // Handle the new thumbnail upload
    // if (newThumbnail) {
    //   const newThumbnailPath = path.resolve(
    //     __dirname,
    //     "../uploads",
    //     newThumbnail
    //   );

    //   // Remove the existing thumbnail if it exists
    //   if (task.thumbnail) {
    //     const oldThumbnailPath = path.resolve(
    //       __dirname,
    //       "../uploads",
    //       task.thumbnail
    //     );
    //     if (fs.existsSync(oldThumbnailPath)) {
    //       fs.unlinkSync(oldThumbnailPath);
    //     }
    //   }

    //   // Update task's thumbnail with the new one
    //   task.thumbnail = newThumbnail;
    // }

    // Update other fields
    board.title = title || board.name;
    board.description = description || board.description;
    board.background = background || board.background;

    await board.save();

    return res.status(200).json({
      message: "Board updated successfully!",
      success: true,
      title,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Server error" });
  }
};

const deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.id);
    if (!board) {
      return res.status(404).json({ error: "Task not found" });
    }
    await Board.findByIdAndDelete(req.params.id);
    return res.status(200).json({
      message: "Board deleted successfully ! ",
      success: true,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createBoard,
  getUserBoards,
  getBoardById,
  updateBoard,
  deleteBoard,
};
