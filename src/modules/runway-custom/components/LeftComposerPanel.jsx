import ActionBar from "./ActionBar";
import AssetPanel from "./AssetPanel";
import PromptComposer from "./PromptComposer";
import ReferenceSlots from "./ReferenceSlots";

export default function LeftComposerPanel(props) {
  return (
    <section className="composer-panel">
      <ReferenceSlots
        references={props.references}
        onAddClick={props.onAddClick}
        onRemove={props.onRemoveReference}
      />
      <PromptComposer value={props.prompt} onChange={props.onPromptChange} />
      <AssetPanel references={props.references} />
      <ActionBar
        selectedModelName={props.selectedModelName}
        aspectRatio={props.aspectRatio}
        isGenerating={props.isGenerating}
        canGenerate={props.canGenerate}
        onOpenModelPicker={props.onOpenModelPicker}
        onGenerate={props.onGenerate}
      />
    </section>
  );
}
