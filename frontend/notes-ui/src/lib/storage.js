const STORAGE_KEY = "notes-system-airbnb-data";

export function loadNotes() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return getInitialMockNotes();
    return JSON.parse(data);
  } catch (e) {
    console.error("Error loading notes from localStorage", e);
    return getInitialMockNotes();
  }
}

export function saveNotes(notes) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (e) {
    console.error("Error saving notes to localStorage", e);
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
