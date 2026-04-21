import { useState } from "react";

export default function AuthModal({ open, onClose, onSubmit, isSubmitting }) {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  if (!open) {
    return null;
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div className="modal__header">
          <h2>Connect Runway</h2>
          <button type="button" className="modal__close" onClick={onClose}>
            x
          </button>
        </div>
        <p className="modal__copy">
          Authentication is executed by the backend through Playwright and stored as an
          internal session.
        </p>
        <label className="modal__field">
          <span>Email</span>
          <input
            type="email"
            value={form.email}
            onChange={(event) => setForm((state) => ({ ...state, email: event.target.value }))}
          />
        </label>
        <label className="modal__field">
          <span>Password</span>
          <input
            type="password"
            value={form.password}
            onChange={(event) =>
              setForm((state) => ({ ...state, password: event.target.value }))
            }
          />
        </label>
        <button
          type="button"
          className="modal__submit"
          disabled={isSubmitting}
          onClick={() => onSubmit(form)}
        >
          {isSubmitting ? "Connecting..." : "Connect"}
        </button>
      </div>
    </div>
  );
}
