export default function BulletToast({ toast }) {
  if (!toast) return null;
  return (
    <div className="bullet-toast">
      <span
        key={toast.id}
        className="bullet-toast-text mono"
        style={{ animationDuration: toast.duration + 'ms' }}
      >
        {toast.text}
      </span>
    </div>
  );
}
