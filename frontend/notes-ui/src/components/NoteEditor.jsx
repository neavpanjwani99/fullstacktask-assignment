import { useState } from "react";
import { Trash2, Tag, Plus, X, ArrowLeft, Inbox } from "lucide-react";
import { formatDateTime } from "../lib/dates.js";

export default function NoteEditor({
  activeNote,
  onChange,
  onDelete,
  saveStatus,
  onBackToList, // Mobile back navigation callback
}) {
  const [tagInputOpen, setTagInputOpen] = useState(false);
  const [newTagVal, setNewTagVal] = useState("");

  if (!activeNote) {
    return (
      <div className="welcome-view">
        <div className="welcome-icon-container">
          <Inbox size={32} />
        </div>
        <h2>Select or Create a Note</h2>
        <p>Choose an existing note from the list, or create a brand new one to start writing.</p>
      </div>
    );
  }

  // Word count & Character count calculation
  const wordCount = activeNote.content
    ? activeNote.content.split(/\s+/).filter(Boolean).length
    : 0;
  const charCount = activeNote.content ? activeNote.content.length : 0;

  // Add Tag Handler
  const handleAddTag = (e) => {
    e.preventDefault();
    const cleanTag = newTagVal.trim();
    if (cleanTag) {
      const currentTags = activeNote.tags || [];
      if (!currentTags.includes(cleanTag)) {
        onChange("tags", [...currentTags, cleanTag]);
      }
    }
    setNewTagVal("");
    setTagInputOpen(false);
  };

  // Remove Tag Handler
  const handleRemoveTag = (tagToRemove) => {
    const currentTags = activeNote.tags || [];
    onChange("tags", currentTags.filter((t) => t !== tagToRemove));
  };

  return (
    <div className="editor-workspace">
      {/* Editor Top Toolbar */}
      <div className="editor-toolbar">
        <div className="toolbar-left-actions">
          {/* Mobile-only Back Button */}
          <button
            className="toolbar-btn mobile-back-btn"
            onClick={onBackToList}
            title="Back to list"
          >
            <ArrowLeft size={16} />
            <span>Notes</span>
          </button>

          <button
            className="toolbar-btn delete"
            onClick={() => onDelete(activeNote.id)}
            title="Delete note"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>

        {/* Real-time Autosave Indicator */}
        <div className="autosave-indicator">
          <span className={`autosave-dot ${saveStatus === "Saving..." ? "saving" : ""}`} />
          <span>{saveStatus}</span>
        </div>
      </div>

      {/* Editor Inputs */}
      <div className="editor-fields">
        {/* Title Input */}
        <input
          type="text"
          className="editor-title-input"
          value={activeNote.title}
          placeholder="Note Title"
          onChange={(e) => onChange("title", e.target.value)}
        />

        {/* Validation Warning */}
        {!activeNote.title.trim() && (
          <div className="validation-banner">
            Note title cannot be left empty.
          </div>
        )}

        {/* Tags Row */}
        <div className="editor-tags-row">
          <Tag size={13} style={{ color: "var(--text-gray)" }} />
          {activeNote.tags &&
            activeNote.tags.map((tag) => (
              <span key={tag} className="editor-tag-badge">
                {tag}
                <button
                  type="button"
                  className="remove-tag-btn"
                  onClick={() => handleRemoveTag(tag)}
                >
                  <X size={10} />
                </button>
              </span>
            ))}

          <div className="add-tag-container">
            <button
              className="add-tag-trigger-btn"
              onClick={() => setTagInputOpen(!tagInputOpen)}
            >
              <Plus size={11} />
              <span>Add tag</span>
            </button>

            {tagInputOpen && (
              <form onSubmit={handleAddTag} className="tag-input-popup">
                <input
                  type="text"
                  placeholder="Tag name"
                  value={newTagVal}
                  onChange={(e) => setNewTagVal(e.target.value)}
                  autoFocus
                  onBlur={() => setTimeout(() => setTagInputOpen(false), 200)}
                />
                <button type="submit">Add</button>
              </form>
            )}
          </div>
        </div>

        {/* Body Textarea */}
        <textarea
          className="editor-body-textarea"
          value={activeNote.content}
          placeholder="Start typing your thoughts here..."
          onChange={(e) => onChange("content", e.target.value)}
        />
      </div>

      {/* Workspace Footer Statistics */}
      <div className="editor-footer">
        <div className="editor-meta">
          <span>Created: {formatDateTime(activeNote.createdAt)}</span>
          <span className="meta-dot" />
          <span>{wordCount} words</span>
          <span className="meta-dot" />
          <span>{charCount} characters</span>
        </div>
      </div>
    </div>
  );
}
