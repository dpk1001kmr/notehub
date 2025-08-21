const { Note } = require("../models/note.model");
const { asyncHandler } = require("../utils/async-handler");
const { CustomError } = require("../utils/custom-error");

const getAllNotes = asyncHandler(async (req, res, next) => {
  const userID = req.user._id;
  const notes = await Note.find({ userID: userID });
  return res.status(200).json({
    status: "success",
    data: notes,
    message: "data fetched successfully",
  });
});

const createNote = asyncHandler(async (req, res, next) => {
  const { title, content } = req.body;
  const userID = req.user._id;
  const note = await Note.create({ userID, title, content });

  if (!note) next();

  res.status(201).json({
    status: "success",
    data: note,
    message: "note created successfully",
  });
});

const getSingleNote = asyncHandler(async (req, res, next) => {
  const note = await Note.findById(req.params.id);
  if (!note) {
    const customError = new CustomError(404, "fail", "document not found");
    return next(customError);
  }
  return res.status(200).json({
    status: "success",
    data: note,
    message: "data fetched successfully",
  });
});

const updateNote = asyncHandler(async (req, res, next) => {
  const note = await Note.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!note) {
    const customError = new CustomError(404, "fail", "document not found");
    return next(customError);
  }
  return res.status(200).json({
    status: "success",
    data: note,
    message: "data updated successfully",
  });
});

const deleteNote = asyncHandler(async (req, res, next) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  if (!note) {
    const customError = new CustomError(404, "fail", "document not found");
    return next(customError);
  }
  res.status(200).json({
    status: "success",
    data: note,
    message: "data deleted successfully",
  });
});

const noteController = {
  getAllNotes,
  createNote,
  getSingleNote,
  updateNote,
  deleteNote,
};

module.exports = {
  noteController,
};
