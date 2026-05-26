const API_URL = "http://localhost:5000/api/notes";
const STORAGE_KEY = "notes-system-airbnb-data";

// Normalize note response to make MongoDB _id compatible with frontend .id references
function normalizeNote(n) {
  if (!n) return n;
  return {
    ...n,
    id: n._id || n.id,
    createdAt: n.createdAt ? new Date(n.createdAt).getTime() : Date.now(),
    updatedAt: n.updatedAt ? new Date(n.updatedAt).getTime() : Date.now(),
  };
}

export async function fetchNotes() {
  try {
    const res = await fetch(API_URL);
    if (!res.ok) throw new Error("Server returned non-ok status");
    const data = await res.json();
    const normalized = data.map(normalizeNote);
    
    // Update local cache
    localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
    return normalized;
  } catch (e) {
    console.warn("Backend API offline. Falling back to local storage cache.");
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return getInitialMockNotes().map(normalizeNote);
      return JSON.parse(data).map(normalizeNote);
    } catch (err) {
      return getInitialMockNotes().map(normalizeNote);
    }
  }
}

export async function createNoteOnServer(noteData) {
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: noteData.title,
        content: noteData.content,
        isPinned: noteData.isPinned,
        tags: noteData.tags,
      }),
    });
    if (!res.ok) throw new Error("Failed to save note on API");
    const saved = await res.json();
    return normalizeNote(saved);
  } catch (e) {
    console.warn("Backend offline. Generating offline note.");
    return normalizeNote({
      ...noteData,
      id: noteData.id || String(Date.now()),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  }
}

export async function updateNoteOnServer(id, updatedFields) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedFields),
    });
    if (!res.ok) throw new Error("Failed to update note on API");
    const updated = await res.json();
    return normalizeNote(updated);
  } catch (e) {
    console.warn("Backend offline. Cannot sync update to server.");
    return null;
  }
}

export async function deleteNoteOnServer(id) {
  try {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete note on API");
    return true;
  } catch (e) {
    console.warn("Backend offline. Cannot sync deletion to server.");
    return false;
  }
}

function getInitialMockNotes() {
  const now = Date.now();
  return [
    {
      id: "mock-1",
      title: "Welcome to PocketNotes",
      content: "This is a clean, minimal notes management system designed in the Airbnb style. You can create, edit, view, delete, and search notes here. All your notes are saved in localStorage.",
      createdAt: now - 3600000 * 2,
      updatedAt: now - 3600000 * 2,
    },
    {
      id: "mock-2",
      title: "Design Guidelines",
      content: "This design utilizes clean card components, thin borders, soft shadows, and a coral pink color scheme. It is optimized for responsiveness across mobile, tablet, and desktop viewports.",
      createdAt: now - 1800000,
      updatedAt: now - 1800000,
    }
  ];
}

