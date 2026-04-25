import { useGenerationStore } from "../store/useGenerationStore";

const PLACEHOLDER = {
  image: "Describe your shot, add image references, or sketch a scene.",
  video: "Describe the motion, camera, and mood. Reference images optional.",
  audio: "Describe the soundscape, mood, tempo, or instruments.",
};

export default function PromptComposer({ onSubmit }) {
  const mode = useGenerationStore((s) => s.activeMode);
  const prompt = useGenerationStore((s) => s.drafts[s.activeMode].prompt);
  const selectedPreset = useGenerationStore((s) => s.selectedPresetByMode[s.activeMode]);
  const setPrompt = useGenerationStore((s) => s.setPrompt);
  const setPromptCounter = useGenerationStore((s) => s.setPromtCoumter);

  function handleKeyDown(event) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      onSubmit?.();
    }
  }

  return (
    <div
      className={`prompt-composer${
        selectedPreset ? " prompt-composer--preset" : ""
      }`}
    >
      {selectedPreset && (
        <div className="preset-field__label preset-field__label--inline">
          <span>Additional Direction</span>
          <em>Optional</em>
        </div>
      )}
      <textarea
        className="prompt-composer__textarea"
        placeholder={
          selectedPreset
            ? "Add extra direction, constraints, or output notes."
            : (PLACEHOLDER[mode] ?? PLACEHOLDER.image)
        }
        value={prompt}
        onChange={(e) => {
          setPrompt(e.target.value);
          setPromptCounter(e.target.value.length);
        }}
        onKeyDown={handleKeyDown}
        rows={1}
      />
    </div>
  );
}
