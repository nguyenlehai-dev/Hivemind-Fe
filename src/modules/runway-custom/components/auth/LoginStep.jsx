export default function LoginStep({
  email,
  password,
  onEmailChange,
  onPasswordChange,
  onSubmit,
  onCancel,
  isPending,
  error,
}) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <p className="auth-form__hint">
        Enter your Runway credentials. Backend will attempt login (mock or
        Playwright depending on <code>RUNWAY_MOCK_MODE</code>).
      </p>

      <div className="auth-form__field">
        <label htmlFor="auth-email">Email</label>
        <input
          id="auth-email"
          type="email"
          autoComplete="username"
          required
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </div>

      <div className="auth-form__field">
        <label htmlFor="auth-password">Password</label>
        <input
          id="auth-password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => onPasswordChange(e.target.value)}
        />
      </div>

      {error && <div className="auth-form__error">{error}</div>}

      <div className="auth-form__actions">
        <button
          type="button"
          className="estate-button estate-button--ghost"
          onClick={onCancel}
          disabled={isPending}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="estate-button"
          disabled={isPending || !email || !password}
        >
          {isPending ? "Connecting…" : "Connect"}
        </button>
      </div>

      <p className="auth-form__note">
        Credentials are posted to your local backend and never stored in the
        browser. For Playwright login, make sure{" "}
        <code>HIVEMIND_RUNWAY_MOCK_MODE=false</code> and test account is in{" "}
        <code>.env</code>.
      </p>
    </form>
  );
}
