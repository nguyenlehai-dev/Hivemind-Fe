import ModalShell from "./ModalShell";
import { MODAL_KEYS, useUiStore } from "../store/useUiStore";

export default function AssetPreviewModal() {
  const isOpen = useUiStore((s) => s.activeModal === MODAL_KEYS.ASSET_PREVIEW);
  const payload = useUiStore((s) => s.modalPayload);
  const closeModal = useUiStore((s) => s.closeModal);

  const asset = payload?.asset;
  const title = payload?.title ?? "Asset preview";

  return (
    <ModalShell open={isOpen} title={title} onClose={closeModal} width="modal--wide">
      <div className="asset-preview">
        {asset ? (
          <img
            className="asset-preview__image"
            src={asset.preview_url ?? asset.url}
            alt={asset.name ?? "asset"}
          />
        ) : (
          <div className="asset-preview__empty">No asset</div>
        )}
        {asset?.name && <p className="asset-preview__caption">{asset.name}</p>}
      </div>
    </ModalShell>
  );
}
