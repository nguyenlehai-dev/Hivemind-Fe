import { useState } from "react";

import AppShell from "../../shared/ui/AppShell";
import ResultMedia from "../../shared/ui/ResultMedia";
import { MODAL_KEYS, useUiStore } from "../../shared/store/useUiStore";
import CreateJobModal from "../runway-custom/components/CreateJobModal";
import { useCancelGeneration } from "../runway-custom/hooks/useCancelGeneration";
import { useRunwayGenerations } from "../runway-custom/hooks/useGenerations";
import JobDetailModal from "./components/JobDetailModal";

const MODULE_SECTIONS = [
  {
    key: "runway",
    label: "Runway",
    description: "Generation jobs created through the Runway custom workflow.",
    useJobs: useRunwayGenerations,
    createModal: CreateJobModal,
  },
];

export default function JobsPage() {
  const [activeCreate, setActiveCreate] = useState(null);

  return (
    <AppShell className="jobs-page" withSidebar>
      <div className="jobs-main">
        <div className="jobs-container">
          <div className="jobs-header">
            <span className="estate-eyebrow jobs-eyebrow">Activity</span>
            <h1>Jobs</h1>
            <p>Danh sách job theo từng module bạn đã đăng ký. Job đang chạy sẽ tự refresh.</p>
          </div>

          {MODULE_SECTIONS.map((section) => (
            <ModuleSection
              key={section.key}
              section={section}
              onCreate={() => setActiveCreate(section.key)}
            />
          ))}
        </div>
      </div>

      {MODULE_SECTIONS.map((section) => {
        const Modal = section.createModal;
        if (!Modal) return null;
        return (
          <Modal
            key={section.key}
            open={activeCreate === section.key}
            onClose={() => setActiveCreate(null)}
          />
        );
      })}

      <JobDetailModal />
    </AppShell>
  );
}

function ModuleSection({ section, onCreate }) {
  const { data: jobs = [], isLoading, isError, error } = section.useJobs();

  return (
    <section className="jobs-section">
      <div className="jobs-section__heading">
        <div>
          <h2>{section.label}</h2>
          <p>{section.description}</p>
        </div>
        <div className="jobs-section__actions">
          <span className="jobs-section__count">{jobs.length}</span>
          {section.createModal && (
            <button
              type="button"
              className="estate-button estate-button--small"
              onClick={onCreate}
            >
              New job
            </button>
          )}
        </div>
      </div>

      {isLoading && <div className="jobs-empty">Đang tải…</div>}

      {isError && (
        <div className="jobs-empty jobs-empty--error">
          Không tải được: {error?.response?.data?.error?.message ?? error?.message ?? "Lỗi không xác định"}
        </div>
      )}

      {!isLoading && !isError && jobs.length === 0 && (
        <div className="jobs-empty">Chưa có job nào trong module này.</div>
      )}

      {!isLoading && !isError && jobs.length > 0 && (
        <div className="jobs-grid">
          {jobs.map((job) => (
            <JobCard key={job.id} job={job} />
          ))}
        </div>
      )}
    </section>
  );
}

function JobCard({ job }) {
  const preview = job.result_urls?.[0];
  const openModal = useUiStore((s) => s.openModal);
  const cancelOrDelete = useCancelGeneration();

  function handleRemove(e) {
    e.stopPropagation();
    const message =
      job.status === "completed" || job.status === "failed"
        ? "Delete this job?"
        : "Cancel this job?";
    if (!window.confirm(message)) return;
    cancelOrDelete.mutate(job.id);
  }

  return (
    <article
      className={`job-card job-card--${job.status} job-card--clickable`}
      onClick={() => openModal(MODAL_KEYS.RESULT_DETAIL, { jobId: job.id })}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openModal(MODAL_KEYS.RESULT_DETAIL, { jobId: job.id });
        }
      }}
    >
      <div className="job-card__media">
        {preview ? (
          <ResultMedia
            url={preview}
            mode={job.mode}
            variant="thumbnail"
            alt={job.prompt || job.id}
          />
        ) : (
          <div className="job-card__placeholder">
            <span>{statusLabel(job.status)}</span>
          </div>
        )}
        <span className={`job-status job-status--${job.status}`}>
          {statusLabel(job.status)}
        </span>
        <button
          type="button"
          className="job-card__remove"
          onClick={handleRemove}
          disabled={cancelOrDelete.isPending}
          aria-label="Remove job"
          title={
            job.status === "queued" || job.status === "running"
              ? "Cancel"
              : "Delete"
          }
        >
          ×
        </button>
      </div>
      <div className="job-card__body">
        <span className="job-card__model">{job.model_id}</span>
        <p className="job-card__prompt">{job.prompt || "(no prompt)"}</p>
        <span className="job-card__meta">{formatTime(job.created_at)}</span>
      </div>
    </article>
  );
}

function statusLabel(status) {
  switch (status) {
    case "queued":
      return "Queued";
    case "running":
      return "Running";
    case "completed":
      return "Completed";
    case "failed":
      return "Failed";
    default:
      return status;
  }
}

function formatTime(iso) {
  if (!iso) return "";
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}
