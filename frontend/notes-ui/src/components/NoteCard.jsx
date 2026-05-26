import { Pin } from "lucide-react";
import { formatDateTime } from "../lib/dates.js";

export default function NoteCard({ note, isActive, onClick, onTogglePin }) {
  const handlePinClick = (e) => {
    e.stopPropagation();
    onTogglePin(note.id);
  };

  return (
    <div
      className={`note-card ${isActive ? "active" : ""}`}
      onClick={onClick}
    >
      <div className="card-title-row">
        <h3 className="card-title">{note.title || "Untitled Note"}</h3>
        <button
          className={`card-pin-btn ${note.isPinned ? "pinned" : ""}`}
          onClick={handlePinClick}
          title={note.isPinned ? "Unpin note" : "Pin note"}
        >
          <Pin size={13} fill={note.isPinned ? "currentColor" : "none"} />
        </button>
      </div>

      <p className="card-preview">
        {note.content ? note.content.trim() : "No content in this note."}
      </p>

      <div className="card-footer">
        <span className="card-date">{formatDateTime(note.updatedAt)}</span>
        <div className="card-tags">
          {note.tags &&
            note.tags.slice(0, 2).map((tag) => (
              <span key={tag} className="card-tag-badge">
                {tag}
              </span>
            ))}
          {note.tags && note.tags.length > 2 && (
            <span className="card-tag-badge-more">+{note.tags.length - 2}</span>
          )}
        </div>
      </div>
    </div>
  );
}
