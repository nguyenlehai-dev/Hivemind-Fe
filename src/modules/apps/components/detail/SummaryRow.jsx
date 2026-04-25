export default function SummaryRow({ label, value }) {
  return (
    <div className="app-run-form__summary-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
