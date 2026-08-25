export default function Sheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet" onClick={(e) => e.stopPropagation()}>
        <span className="sheet-handle" />
        <h2 className="sheet-title serif">{title}</h2>
        {children}
      </div>
    </div>
  );
}
