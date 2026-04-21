import ModalShell from "../../../../shared/ui/ModalShell";

export default function AuthModal({
  open,
  form,
  onClose,
  onChange,
  onSubmit,
  isSubmitting,
}) {
  return (
    <ModalShell open={open} title="Connect Runway" onClose={onClose}>
      <p className="modal__copy">
        Authentication is executed by the backend through Playwright and stored as an
        internal session.
      </p>
      <label className="modal__field">
        <span>Email</span>
        <input
          type="email"
          value={form.email}
          onChange={(event) => onChange("email", event.target.value)}
        />
      </label>
      <label className="modal__field">
        <span>Password</span>
        <input
          type="password"
          value={form.password}
          onChange={(event) => onChange("password", event.target.value)}
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
    </ModalShell>
  );
}
