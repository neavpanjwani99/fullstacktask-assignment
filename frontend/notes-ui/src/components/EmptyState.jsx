export default function EmptyState({ searchQuery, onCreateNew }) {
  return (
    <div className="empty-state">
      {searchQuery ? (
        <div>
          <h3>No matching notes found</h3>
          <p>Try refining your search terms or clearing the filter.</p>
        </div>
      ) : (
        <div>
          <h3>Your workspace is empty</h3>
          <p>Get started by creating a new note to write your thoughts.</p>
          <button className="btn btn-primary" style={{ marginTop: "16px" }} onClick={onCreateNew}>
            Create First Note
          </button>
        </div>
      )}
    </div>
  );
}
