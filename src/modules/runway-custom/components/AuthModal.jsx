import { useEffect, useState } from "react";

import ModalShell from "../../../shared/ui/ModalShell";
import { MODAL_KEYS, useUiStore } from "../../../shared/store/useUiStore";
import {
  useAuthStatus,
  useDisconnect,
  useLogin,
  useVerifyOtp,
} from "../hooks/useAuth";

const STEP = {
  LOGIN: "login",
  OTP: "otp",
  DONE: "done",
};

export default function AuthModal() {
  const isOpen = useUiStore((s) => s.activeModal === MODAL_KEYS.AUTH);
  const closeModal = useUiStore((s) => s.closeModal);

  const [step, setStep] = useState(STEP.LOGIN);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [sessionId, setSessionId] = useState(null);

  const loginMutation = useLogin();
  const verifyMutation = useVerifyOtp();
  const disconnectMutation = useDisconnect();
  const { data: authStatus } = useAuthStatus();
  const isConnected = authStatus?.status === "connected";

  useEffect(() => {
    if (!isOpen) {
      setStep(STEP.LOGIN);
      setEmail("");
      setPassword("");
      setOtp("");
      setSessionId(null);
      loginMutation.reset();
      verifyMutation.reset();
    }
  }, [isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleLogin(event) {
    event.preventDefault();
    try {
      const res = await loginMutation.mutateAsync({ email, password });
      if (res.status === "connected") {
        setStep(STEP.DONE);
        setTimeout(closeModal, 800);
      } else if (res.status === "otp_required") {
        setSessionId(res.session_id);
        setStep(STEP.OTP);
      } else if (res.status === "error") {
        // keep on login step; error shown below via mutation state
      }
    } catch {
      /* error displayed */
    }
  }

  async function handleDisconnect() {
    try {
      await disconnectMutation.mutateAsync();
      closeModal();
    } catch {
      /* error shown below */
    }
  }

  async function handleVerify(event) {
    event.preventDefault();
    if (!sessionId) return;
    try {
      const res = await verifyMutation.mutateAsync({
        session_id: sessionId,
        otp_code: otp,
      });
      if (res.status === "connected") {
        setStep(STEP.DONE);
        setTimeout(closeModal, 800);
      }
    } catch {
      /* error displayed */
    }
  }

  const loginError =
    loginMutation.error?.response?.data?.error?.message ??
    loginMutation.error?.message ??
    (loginMutation.data?.status === "error"
      ? loginMutation.data?.message
      : null);

  const verifyError =
    verifyMutation.error?.response?.data?.error?.message ??
    verifyMutation.error?.message ??
    (verifyMutation.data?.status === "error"
      ? verifyMutation.data?.message
      : null);

  return (
    <ModalShell open={isOpen} title="Connect Runway" onClose={closeModal}>
      {step === STEP.LOGIN && isConnected && (
        <div className="auth-form">
          <p className="auth-form__hint">
            Already connected as <strong>{authStatus?.email}</strong>.
            Disconnect to clear the stored session and force a fresh login
            next time.
          </p>
          <div className="auth-form__actions">
            <button
              type="button"
              className="estate-button estate-button--ghost"
              onClick={closeModal}
            >
              Close
            </button>
            <button
              type="button"
              className="estate-button"
              onClick={handleDisconnect}
              disabled={disconnectMutation.isPending}
            >
              {disconnectMutation.isPending ? "Disconnecting…" : "Disconnect"}
            </button>
          </div>
          {disconnectMutation.isError && (
            <div className="auth-form__error">
              {disconnectMutation.error?.response?.data?.error?.message ??
                disconnectMutation.error?.message}
            </div>
          )}
        </div>
      )}

      {step === STEP.LOGIN && !isConnected && (
        <form className="auth-form" onSubmit={handleLogin}>
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
              onChange={(e) => setEmail(e.target.value)}
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
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {loginError && <div className="auth-form__error">{loginError}</div>}

          <div className="auth-form__actions">
            <button
              type="button"
              className="estate-button estate-button--ghost"
              onClick={closeModal}
              disabled={loginMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="estate-button"
              disabled={loginMutation.isPending || !email || !password}
            >
              {loginMutation.isPending ? "Connecting…" : "Connect"}
            </button>
          </div>

          <p className="auth-form__note">
            Credentials are posted to your local backend and never stored in the
            browser. For Playwright login, make sure{" "}
            <code>HIVEMIND_RUNWAY_MOCK_MODE=false</code> and test account is in{" "}
            <code>.env</code>.
          </p>
        </form>
      )}

      {step === STEP.OTP && (
        <form className="auth-form" onSubmit={handleVerify}>
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
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>

          {verifyError && <div className="auth-form__error">{verifyError}</div>}

          <div className="auth-form__actions">
            <button
              type="button"
              className="estate-button estate-button--ghost"
              onClick={() => setStep(STEP.LOGIN)}
              disabled={verifyMutation.isPending}
            >
              Back
            </button>
            <button
              type="submit"
              className="estate-button"
              disabled={verifyMutation.isPending || otp.length < 4}
            >
              {verifyMutation.isPending ? "Verifying…" : "Verify"}
            </button>
          </div>
        </form>
      )}

      {step === STEP.DONE && (
        <div className="auth-form auth-form--done">
          <div className="auth-form__check" aria-hidden="true">✓</div>
          <p>Runway session ready.</p>
        </div>
      )}
    </ModalShell>
  );
}
