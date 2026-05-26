import { useState, useEffect, useMemo } from "react";
import { Search, Plus } from "lucide-react";
import Sidebar from "./components/Sidebar.jsx";
import NoteCard from "./components/NoteCard.jsx";
import NoteEditor from "./components/NoteEditor.jsx";
import ConfirmDialog from "./components/ConfirmDialog.jsx";
import { loadNotes, saveNotes } from "./lib/storage.js";

export default function App() {
  // --- States ---
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all"); // "all", "pinned", or specific tag name
  const [activeNoteId, setActiveNoteId] = useState(null);
  
  // Mobile UI view panel state: "list" or "editor"
  const [mobileView, setMobileView] = useState("list");

  // Autosave status state
  const [saveStatus, setSaveStatus] = useState("Saved");
  const [saveTimeout, setSaveTimeout] = useState(null);

  // Delete Confirm Dialog state
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, noteId: null });

  // --- Load Initial Notes ---
  useEffect(() => {
    const loadedNotes = loadNotes();
    setNotes(loadedNotes);
    if (loadedNotes.length > 0) {
      setActiveNoteId(loadedNotes[0].id);
    }
    setIsLoading(false);
  }, []);

  // --- Save Notes to localStorage ---
  useEffect(() => {
    if (!isLoading) {
      saveNotes(notes);
    }
  }, [notes, isLoading]);

  // --- Find Active Note ---
  const activeNote = useMemo(() => {
    return notes.find((n) => n.id === activeNoteId) || null;
  }, [notes, activeNoteId]);

  // --- Filter and Sort Notes ---
  const filteredNotes = useMemo(() => {
    let result = [...notes];

    // 1. Filter by category selection
    if (selectedCategory === "pinned") {
      result = result.filter((n) => n.isPinned);
    } else if (selectedCategory !== "all") {
      result = result.filter((n) => n.tags && n.tags.includes(selectedCategory));
    }

    // 2. Filter by search query
    const q = searchQuery.toLowerCase().trim();
    if (q) {
      result = result.filter(
        (n) =>
          (n.title || "").toLowerCase().includes(q) ||
          (n.content || "").toLowerCase().includes(q)
      );
    }

    // 3. Sort: Pinned notes at the top, then sort by updatedAt descending
    result.sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt - a.updatedAt;
    });

    return result;
  }, [notes, selectedCategory, searchQuery]);

  // --- Add a New Note ---
  const handleCreateNote = () => {
    const now = Date.now();
    const newNote = {
      id: crypto.randomUUID?.() || String(now),
      title: "Untitled Note",
      content: "",
      isPinned: false,
      tags: [],
      createdAt: now,
      updatedAt: now,
    };

    setNotes((prev) => [newNote, ...prev]);
    setActiveNoteId(newNote.id);
    setSelectedCategory("all"); // Reset category filter to view the new note
    setMobileView("editor"); // Auto-transition to editor on mobile view
  };

  // --- Handle Real-time Editing (with Auto-save simulation) ---
  const handleNoteChange = (field, value) => {
    if (!activeNoteId) return;

    setSaveStatus("Saving...");

    setNotes((prev) =>
      prev.map((n) =>
        n.id === activeNoteId
          ? {
              ...n,
              [field]: value,
              updatedAt: Date.now(),
            }
          : n
      )
    );

    // Debounce the autosave indicator status
    if (saveTimeout) clearTimeout(saveTimeout);
    const timeout = setTimeout(() => {
      setSaveStatus("Saved");
    }, 600);
    setSaveTimeout(timeout);
  };

  // --- Toggle Pin Status ---
  const handleTogglePin = (noteId) => {
    setNotes((prev) =>
      prev.map((n) =>
        n.id === noteId
          ? { ...n, isPinned: !n.isPinned, updatedAt: Date.now() }
          : n
      )
    );
  };

  // --- Delete Handlers ---
  const triggerDelete = (noteId) => {
    setDeleteConfirm({ isOpen: true, noteId });
  };

  const handleConfirmDelete = () => {
    const id = deleteConfirm.noteId;
    if (id) {
      const updatedNotes = notes.filter((n) => n.id !== id);
      setNotes(updatedNotes);
      
      // Auto-focus next active note if we deleted the current active note
      if (activeNoteId === id) {
        setActiveNoteId(updatedNotes.length > 0 ? updatedNotes[0].id : null);
      }
      setMobileView("list"); // Return to list panel on mobile view
    }
    setDeleteConfirm({ isOpen: false, noteId: null });
  };

  const handleSelectNote = (noteId) => {
    setActiveNoteId(noteId);
    setMobileView("editor");
  };

  const noteToDelete = notes.find((n) => n.id === deleteConfirm.noteId);

  return (
    <div className={`workspace-layout mobile-${mobileView}`}>
      {/* Column 1: Sidebar */}
      <Sidebar
        notes={notes}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Column 2: Notes List Panel */}
      <section className="list-panel">
        <div className="list-header">
          <div className="list-title-row">
            <h2>My Notes</h2>
            <button className="btn btn-primary" onClick={handleCreateNote}>
              <Plus size={15} />
              <span>New Note</span>
            </button>
          </div>

          <div className="search-wrapper">
            <Search size={15} className="search-icon" />
            <input
              type="text"
              className="search-input"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Scrolling Note Cards */}
        <div className="notes-scroll-list">
          {isLoading ? (
            <div style={{ padding: "40px", textAlign: "center", opacity: 0.6 }}>
              Loading notes...
            </div>
          ) : filteredNotes.length === 0 ? (
            <div className="empty-state-inline">
              <p>No notes found.</p>
            </div>
          ) : (
            filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                isActive={note.id === activeNoteId}
                onClick={() => handleSelectNote(note.id)}
                onTogglePin={handleTogglePin}
              />
            ))
          )}
        </div>
      </section>

      {/* Column 3: Active Workspace / Note Editor */}
      <main className="editor-panel">
        <NoteEditor
          activeNote={activeNote}
          onChange={handleNoteChange}
          onDelete={triggerDelete}
          saveStatus={saveStatus}
          onBackToList={() => setMobileView("list")}
        />
      </main>

      {/* Delete Confirmation Overlay */}
      <ConfirmDialog
        isOpen={deleteConfirm.isOpen}
        noteTitle={noteToDelete?.title}
        onCancel={() => setDeleteConfirm({ isOpen: false, noteId: null })}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
