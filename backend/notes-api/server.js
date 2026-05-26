const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/notesdb";

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("Successfully connected to MongoDB Compass local instance"))
  .catch((err) => console.error("Database connection failure:", err));

// Note Schema & Model
const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Note title is mandatory"],
      trim: true,
    },
    content: {
      type: String,
      default: "",
    },
    isPinned: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt fields
  }
);

const Note = mongoose.model("Note", noteSchema);

// REST API Endpoints

// 1. GET /api/notes - Retrieve all notes (supports optional search and sorts by isPinned + updatedAt)
app.get("/api/notes", async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      // Search matching title or content case-insensitive
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
        ],
      };
    }

    // Sort by isPinned descending, then updatedAt descending
    const notes = await Note.find(query).sort({ isPinned: -1, updatedAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch notes from database" });
  }
});

// 2. GET /api/notes/:id - Retrieve single note details
app.get("/api/notes/:id", async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json(note);
  } catch (error) {
    res.status(500).json({ error: "Error fetching note details" });
  }
});

// 3. POST /api/notes - Create a new note
app.post("/api/notes", async (req, res) => {
  try {
    const { title, content, isPinned, tags } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title is required and cannot be empty" });
    }

    const newNote = new Note({
      title: title.trim(),
      content: content || "",
      isPinned: !!isPinned,
      tags: Array.isArray(tags) ? tags : [],
    });

    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ error: "Failed to create note in database" });
  }
});

// 4. PUT /api/notes/:id - Update an existing note
app.put("/api/notes/:id", async (req, res) => {
  try {
    const { title, content, isPinned, tags } = req.body;

    if (title !== undefined && !title.trim()) {
      return res.status(400).json({ error: "Title cannot be updated to an empty value" });
    }

    const updateFields = {};
    if (title !== undefined) updateFields.title = title.trim();
    if (content !== undefined) updateFields.content = content;
    if (isPinned !== undefined) updateFields.isPinned = !!isPinned;
    if (tags !== undefined) updateFields.tags = Array.isArray(tags) ? tags : [];

    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: updateFields },
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.json(updatedNote);
  } catch (error) {
    res.status(500).json({ error: "Failed to update note details" });
  }
});

// 5. DELETE /api/notes/:id - Delete a note
app.delete("/api/notes/:id", async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ error: "Note not found" });
    }
    res.json({ message: "Note successfully deleted", id: req.params.id });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete note from database" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server running smoothly on port ${PORT}`);
});
