export default function ScreenHeader({ title, sub, action }) {
  return (
    <header className="screen-header">
      <div className="screen-header-row">
        <h1 className="serif">{title}</h1>
        {action}
      </div>
      {sub && <p className="screen-header-sub">{sub}</p>}
    </header>
  );
}
