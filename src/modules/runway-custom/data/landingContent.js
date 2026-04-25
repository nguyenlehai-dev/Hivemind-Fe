export const PILLARS = [
  {
    eyebrow: "Search Layer",
    title: "Search once and keep every provider tab in the same modal context",
    description:
      "Users type a keyword one time, then keep switching between Featured, Google, Runway, or Black Forest Labs without losing their search intent.",
  },
  {
    eyebrow: "Provider Tabs",
    title: "Each modal view isolates the correct vendor family and model behavior",
    description:
      "Google tabs surface Nano Banana and Gemini variants, Runway tabs show Gen-4 family, while Black Forest Labs keeps FLUX choices grouped cleanly.",
  },
  {
    eyebrow: "Selection Logic",
    title: "Choosing a model updates the composer, primary CTA, and current workflow state",
    description:
      "The selected row should immediately sync back to the active dropdown and keep the Generate action aligned with the chosen provider.",
  },
  {
    eyebrow: "Reusable UX",
    title: "One modal pattern can scale to image, video, and future custom workflow surfaces",
    description:
      "The same shell can support provider chips, search, filtered results, and fallback states so the Hivemind frontend stays modular and reusable.",
  },
];

export const TRUST_STATS = [
  { value: "5+", label: "provider groups" },
  { value: "10+", label: "image models" },
  { value: "1", label: "shared modal system" },
];

export const SHOWCASES = [
  {
    eyebrow: "Model Picker",
    title: "Google Models: searchable image model groups",
    description:
      "A dedicated provider view for Nano Banana and Gemini variants, optimized for fast switching inside the custom image workflow.",
    mediaType: "video",
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&h=700&fit=crop",
    video: "https://cdn.coverr.co/videos/coverr-typing-on-a-laptop-in-close-up-1562693168206?download=1080p",
    primaryAction: "Try now",
    secondaryAction: "Learn more",
  },
  {
    eyebrow: "Runway Models",
    title: "Runway-native generation modes in one filtered view",
    description:
      "This block represents the tab where Gen-4 family models appear without vendor noise, keeping the decision path short and readable.",
    mediaType: "video",
    image:
      "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=900&h=700&fit=crop",
    video: "https://cdn.coverr.co/videos/coverr-robot-working-in-a-modern-factory-5533/1080p.mp4",
    primaryAction: "Open picker",
    secondaryAction: "Learn more",
  },
  {
    eyebrow: "Interactive States",
    title: "Modal navigation that keeps provider chips and row selection predictable",
    description:
      "The active chip, result list, and selected model should stay synchronized so users always understand what the Generate button will use.",
    mediaType: "video",
    image:
      "https://images.unsplash.com/photo-1516321497487-e288fb19713f?w=900&h=700&fit=crop",
    video: "https://cdn.coverr.co/videos/coverr-toys-on-the-floor-1563700887691?download=1080p",
    primaryAction: "Preview states",
    secondaryAction: "Learn more",
  },
  {
    eyebrow: "Workflow Surface",
    title: "A reusable Hivemind card system for future image, video, and audio flows",
    description:
      "Once the shell is stable, the same media-first layout can support additional custom workflow surfaces without rebuilding the interaction model.",
    mediaType: "image",
    image:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&h=700&fit=crop",
    primaryAction: "Use in Hivemind",
    secondaryAction: "Learn more",
  },
];
