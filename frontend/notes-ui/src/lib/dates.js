export function formatDateTime(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  
  // Format as relative time if it's very recent, else standard date format
  const seconds = Math.floor((Date.now() - date) / 1000);
  
  if (seconds < 60) return "Just now";
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ago`;
  }
  
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  });
}
