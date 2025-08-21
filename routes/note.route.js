const express = require("express");
const { noteController } = require("../controllers/note.controller");
const { verifyJWTToken } = require("../middleware/auth.middleware");

const noteRouter = express.Router();

noteRouter.use(verifyJWTToken);

noteRouter.get("/", noteController.getAllNotes);
noteRouter.post("/", noteController.createNote);
noteRouter.get("/:id", noteController.getSingleNote);
noteRouter.patch("/:id", noteController.updateNote);
noteRouter.delete("/:id", noteController.deleteNote);

module.exports = { noteRouter };
