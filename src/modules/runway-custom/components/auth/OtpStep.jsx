export default function OtpStep({
  otp,
  onOtpChange,
  onSubmit,
  onBack,
  isPending,
  error,
}) {
  return (
    <form className="auth-form" onSubmit={onSubmit}>
      <p className="auth-form__hint">
        Runway asked for a one-time code. Check your authenticator or email.
      </p>

      <div className="auth-form__field">
        <label htmlFor="auth-otp">OTP code</label>
        <input
          id="auth-otp"
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          required
          minLength={4}
          maxLength={8}
          value={otp}
          onChange={(e) => onOtpChange(e.target.value)}
        />
      </div>

      {error && <div className="auth-form__error">{error}</div>}

      <div className="auth-form__actions">
        <button
          type="button"
          className="estate-button estate-button--ghost"
          onClick={onBack}
          disabled={isPending}
        >
          Back
        </button>
        <button
          type="submit"
          className="estate-button"
          disabled={isPending || otp.length < 4}
        >
          {isPending ? "Verifying…" : "Verify"}
        </button>
      </div>
    </form>
  );
}
