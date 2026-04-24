import ModalShell from "../../../shared/ui/ModalShell";
import { MODAL_KEYS, useUiStore } from "../../../shared/store/useUiStore";
import { useCancelGeneration } from "../../runway-custom/hooks/useCancelGeneration";
import { useGenerationJob } from "../../runway-custom/hooks/useGenerationJob";
import { useRemixJob } from "../../runway-custom/hooks/useRemixJob";
import { useRetryGeneration } from "../../runway-custom/hooks/useRetryGeneration";
import JobActions from "./detail/JobActions";
import JobCanvas from "./detail/JobCanvas";
import JobMeta from "./detail/JobMeta";

export default function JobDetailModal() {
  const isOpen = useUiStore((s) => s.activeModal === MODAL_KEYS.RESULT_DETAIL);
  const payload = useUiStore((s) => s.modalPayload);
  const closeModal = useUiStore((s) => s.closeModal);
  const remix = useRemixJob();
  const cancelMutation = useCancelGeneration();
  const retryMutation = useRetryGeneration();

  const jobId = payload?.jobId ?? null;
  const { data: job, isLoading, isError } = useGenerationJob(isOpen ? jobId : null);

  function handleRemix() {
    remix(job);
    closeModal();
  }

  function handleCancel() {
    if (jobId) cancelMutation.mutate(jobId);
  }

  async function handleRetry() {
    if (!jobId) return;
    try {
      await retryMutation.mutateAsync(jobId);
      closeModal();
    } catch {
      /* error visible via mutation */
    }
  }

  function handleDelete() {
    if (!jobId) return;
    if (!window.confirm("Delete this job permanently?")) return;
    cancelMutation.mutate(jobId, { onSuccess: () => closeModal() });
  }

  return (
    <ModalShell
      open={isOpen}
      title="Generation detail"
      onClose={closeModal}
      width="modal--wide"
    >
      <div className="job-detail">
        {isLoading && <div className="job-detail__empty">Loading…</div>}
        {isError && (
          <div className="job-detail__empty job-detail__empty--error">
            Could not load this job.
          </div>
        )}

        {job && (
          <>
            <JobCanvas job={job} />
            <JobMeta job={job} />
            <JobActions
              job={job}
              onClose={closeModal}
              onCancel={handleCancel}
              onRetry={handleRetry}
              onDelete={handleDelete}
              onRemix={handleRemix}
              cancelPending={cancelMutation.isPending}
              retryPending={retryMutation.isPending}
            />
          </>
        )}
      </div>
    </ModalShell>
  );
}
