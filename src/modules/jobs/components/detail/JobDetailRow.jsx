export default function JobDetailRow({ label, block, children }) {
  return (
    <div className={`job-detail__row ${block ? "job-detail__row--block" : ""}`}>
      <span className="job-detail__label">{label}</span>
      <div className="job-detail__value">{children}</div>
    </div>
  );
}
