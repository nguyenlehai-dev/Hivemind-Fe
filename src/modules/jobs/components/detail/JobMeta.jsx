import JobDetailRow from "./JobDetailRow";
import { formatKey, formatTime, formatValue } from "./jobFormat";

export default function JobMeta({ job }) {
  return (
    <div className="job-detail__meta">
      <JobDetailRow label="Status">
        <span className={`job-status job-status--${job.status} job-status--inline`}>
          {job.status}
        </span>
      </JobDetailRow>
      <JobDetailRow label="Mode">{job.mode}</JobDetailRow>
      <JobDetailRow label="Model">{job.model_id}</JobDetailRow>
      <JobDetailRow label="Created">{formatTime(job.created_at)}</JobDetailRow>
      {job.prompt && (
        <JobDetailRow label="Prompt" block>
          {job.prompt}
        </JobDetailRow>
      )}
      {job.settings && Object.keys(job.settings).length > 0 && (
        <JobDetailRow label="Settings" block>
          <ul className="job-detail__settings">
            {Object.entries(job.settings)
              .filter(([, v]) => v !== null && v !== undefined && v !== "")
              .map(([key, value]) => (
                <li key={key}>
                  <span>{formatKey(key)}</span>
                  <strong>{formatValue(value)}</strong>
                </li>
              ))}
          </ul>
        </JobDetailRow>
      )}
      {job.error && (
        <JobDetailRow label="Error" block>
          <span className="job-detail__error">{job.error}</span>
        </JobDetailRow>
      )}
    </div>
  );
}
