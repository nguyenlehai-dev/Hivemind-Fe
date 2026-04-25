import ResultMedia from "../../../../shared/ui/ResultMedia";

export default function JobCanvas({ job }) {
  return (
    <div className="job-detail__canvas">
      {job.result_urls?.[0] ? (
        <ResultMedia
          url={job.result_urls[0]}
          mode={job.mode}
          variant="detail"
          alt={job.prompt || job.id}
        />
      ) : (
        <div className="job-detail__placeholder">
          <span className="preview-stage__spinner" aria-hidden="true" />
          <span>{job.status}</span>
        </div>
      )}
    </div>
  );
}
