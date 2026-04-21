export default function PromptComposer({ value, onChange }) {
  return (
    <label className="prompt-composer">
      <span className="panel__label">Shot Prompt</span>
      <textarea
        className="prompt-composer__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Describe your shot, add image references, or sketch a scene."
      />
    </label>
  );
}
