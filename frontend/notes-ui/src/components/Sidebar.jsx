import { FolderOpen, Pin, Hash } from "lucide-react";
import { useMemo } from "react";
import logoImg from "../images/logo.png";

export default function Sidebar({
  notes,
  selectedCategory,
  setSelectedCategory,
  onAddNote,
}) {
  // Collect all unique tags across notes
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    notes.forEach((note) => {
      if (note.tags && Array.isArray(note.tags)) {
        note.tags.forEach((t) => {
          if (t.trim()) tagsSet.add(t.trim());
        });
      }
    });
    return Array.from(tagsSet);
  }, [notes]);

  const pinnedCount = useMemo(() => notes.filter((n) => n.isPinned).length, [notes]);

  return (
    <aside className="sidebar">
      {/* Brand Logo & Name */}
      <div className="brand-section">
        <div className="brand-logo-container">
          <img src={logoImg} alt="Logo" className="brand-logo-img" />
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="sidebar-nav">
        <button
          className={`nav-item ${selectedCategory === "all" ? "active" : ""}`}
          onClick={() => setSelectedCategory("all")}
        >
          <FolderOpen size={16} />
          <span>All Notes</span>
          <span className="nav-counter">{notes.length}</span>
        </button>

        <button
          className={`nav-item ${selectedCategory === "pinned" ? "active" : ""}`}
          onClick={() => setSelectedCategory("pinned")}
        >
          <Pin size={16} />
          <span>Pinned</span>
          <span className="nav-counter">{pinnedCount}</span>
        </button>
      </nav>

      <div className="sidebar-divider" />

      {/* Tags Filters */}
      <div className="tags-section">
        <h3 className="section-title">Tags</h3>
        {allTags.length === 0 ? (
          <p className="no-tags-text">No tags added yet.</p>
        ) : (
          <div className="tag-list">
            {allTags.map((tag) => (
              <button
                key={tag}
                className={`tag-item ${selectedCategory === tag ? "active" : ""}`}
                onClick={() => setSelectedCategory(tag)}
              >
                <Hash size={14} style={{ opacity: 0.6 }} />
                <span>{tag}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Sidebar Footer with Small Brand Signature */}
      <div className="sidebar-footer">
        <div className="footer-logo-container">
          <img src={logoImg} alt="Logo" className="footer-logo-img" />
        </div>
        <span className="version-label">v1.1</span>
      </div>
    </aside>
  );
}

