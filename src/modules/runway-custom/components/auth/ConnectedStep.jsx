export default function ConnectedStep({
  email,
  onClose,
  onDisconnect,
  isDisconnecting,
  error,
}) {
  return (
    <div className="auth-form">
      <p className="auth-form__hint">
        Already connected as <strong>{email}</strong>. Disconnect to clear the
        stored session and force a fresh login next time.
      </p>
      <div className="auth-form__actions">
        <button
          type="button"
          className="estate-button estate-button--ghost"
          onClick={onClose}
        >
          Close
        </button>
        <button
          type="button"
          className="estate-button"
          onClick={onDisconnect}
          disabled={isDisconnecting}
        >
          {isDisconnecting ? "Disconnecting…" : "Disconnect"}
        </button>
      </div>
      {error && <div className="auth-form__error">{error}</div>}
    </div>
  );
}
