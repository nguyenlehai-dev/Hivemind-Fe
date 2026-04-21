import { useEffect, useRef } from "react";

import { useGenerationStore } from "../store/useGenerationStore";

const PLACEHOLDER = {
  image: "Describe your shot, add image references, or sketch a scene.",
  video: "Describe the motion, camera, and mood. Reference images optional.",
  audio: "Describe the soundscape, mood, tempo, or instruments.",
};

export default function PromptComposer({ onSubmit }) {
  const mode = useGenerationStore((s) => s.activeMode);
  const prompt = useGenerationStore((s) => s.drafts[s.activeMode].prompt);
  const setPrompt = useGenerationStore((s) => s.setPrompt);
  const textareaRef = useRef(null);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`;
  }, [prompt]);

  function handleKeyDown(event) {
    if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
      event.preventDefault();
      onSubmit?.();
    }
  }

  return (
    <div className="prompt-composer">
      <textarea
        ref={textareaRef}
        className="prompt-composer__textarea"
        placeholder={PLACEHOLDER[mode] ?? PLACEHOLDER.image}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
      />
      <div className="prompt-composer__toolbar">
        <span className="prompt-composer__hint">
          <kbd>⌘</kbd> / <kbd>Ctrl</kbd> + <kbd>Enter</kbd> to generate
        </span>
      </div>
    </div>
  );
}
