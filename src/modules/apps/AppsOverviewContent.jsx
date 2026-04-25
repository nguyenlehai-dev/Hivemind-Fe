import { useEffect, useMemo, useState } from "react";

import {
  AppsIcon,
  AudioIcon,
  ImageIcon,
  UserBadgeIcon,
  VideoIcon,
  WorkflowIcon,
} from "../../shared/icons";
import SearchInput from "../../shared/ui/SearchInput";
import PreviewStage from "../custom/components/PreviewStage";
import { CUSTOM_PRESETS, getPresetById } from "../custom/customPresets";
import { useGenerationStore } from "../custom/store/useGenerationStore";

const OVERVIEW_TABS = [
  { id: "starter", label: "Starter Kits" },
  { id: "custom", label: "Custom" },
  { id: "image", label: "Image" },
  { id: "video", label: "Video" },
  { id: "audio", label: "Audio" },
];

const STARTER_GROUPS = [
  {
    id: "film",
    label: "Film & story",
    description: "Scenes, sequences, dialogue and visual storytelling",
    icon: WorkflowIcon,
  },
  {
    id: "marketing",
    label: "Product & ads",
    description: "Campaigns, product shots and polished brand assets",
    icon: AppsIcon,
  },
  {
    id: "portrait",
    label: "Portrait & character",
    description: "Faces, characters, swaps and performance-driven edits",
    icon: UserBadgeIcon,
  },
  {
    id: "transform",
    label: "Edit & transform",
    description: "Remove, relight, stylize, upscale and reshape media",
    icon: ImageIcon,
  },
  {
    id: "audio",
    label: "Audio & voice",
    description: "Sound effects and voice style generation",
    icon: AudioIcon,
  },
];

const STARTER_CARDS = [
  {
    id: "multi-shot-video",
    group: "film",
    presetId: "video-multi-shot-video",
    mode: "video",
    title: "Multi-Shot Video",
    description: "Generate multi-shot videos from a single prompt.",
    thumbnail:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&h=900&fit=crop",
  },
  {
    id: "scene-builder",
    group: "film",
    presetId: "video-scene-builder",
    mode: "video",
    title: "Scene Builder",
    description: "Craft your multi-shot scene step by step and bring it to life.",
    thumbnail:
      "https://images.unsplash.com/photo-1517022812141-23620dba5c23?w=900&h=900&fit=crop",
  },
  {
    id: "image-to-dialogue",
    group: "film",
    presetId: "video-image-to-dialogue",
    mode: "video",
    title: "Image to Dialogue",
    description: "Turn your image into a scripted video.",
    thumbnail:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&h=900&fit=crop",
  },
  {
    id: "create-ad",
    group: "marketing",
    presetId: "image-create-ad",
    mode: "image",
    title: "Create Ad",
    description: "Create new ads for your brand or product.",
    thumbnail:
      "https://images.unsplash.com/photo-1515169067868-5387ec356754?w=900&h=900&fit=crop",
  },
  {
    id: "product-shot-video-builder",
    group: "marketing",
    presetId: "video-product-shot-video-builder",
    mode: "video",
    title: "Product Shot Video Builder",
    description: "Turn a product photo into a polished video ad.",
    thumbnail:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=900&h=900&fit=crop",
  },
  {
    id: "ad-concepter",
    group: "marketing",
    presetId: "image-ad-concepter",
    mode: "image",
    title: "Ad Concepter",
    description: "Explore new concepts with a simple prompt and product shot.",
    thumbnail:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&h=900&fit=crop",
  },
  {
    id: "runway-look",
    group: "portrait",
    presetId: "image-runway-look",
    mode: "image",
    title: "Runway Look",
    description: "Give your photo a cinematic look.",
    thumbnail:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&h=900&fit=crop",
  },
  {
    id: "character-swap",
    group: "portrait",
    presetId: "video-character-swap",
    mode: "video",
    title: "Character Swap",
    description: "Place any character into any scene.",
    thumbnail:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&h=900&fit=crop",
  },
  {
    id: "performance-capture",
    group: "portrait",
    presetId: "video-performance-capture-with-act-two",
    mode: "video",
    title: "Performance Capture",
    description: "Animate characters using driving performance videos.",
    thumbnail:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=900&h=900&fit=crop",
  },
  {
    id: "edit-video",
    group: "transform",
    presetId: "video-edit-video",
    mode: "video",
    title: "Edit Video",
    description: "Swap backgrounds, lighting, angles - all without reshooting.",
    thumbnail:
      "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=900&h=900&fit=crop",
  },
  {
    id: "remove-from-video",
    group: "transform",
    presetId: "video-remove-from-video",
    mode: "video",
    title: "Remove from Video",
    description: "Remove objects without reshooting.",
    thumbnail:
      "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=900&h=900&fit=crop",
  },
  {
    id: "stylize-image",
    group: "transform",
    presetId: "image-stylize-image",
    mode: "image",
    title: "Stylize Image",
    description: "Apply artistic styles to your image.",
    thumbnail:
      "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=900&h=900&fit=crop",
  },
  {
    id: "sfx",
    group: "audio",
    presetId: "audio-sfx",
    mode: "audio",
    title: "SFX",
    description: "Create sound effects from text descriptions.",
    thumbnail:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=900&h=900&fit=crop",
  },
  {
    id: "stylize-audio",
    group: "audio",
    presetId: "audio-stylize-audio",
    mode: "audio",
    title: "Stylize Audio",
    description: "Transform your voice into another voice style.",
    thumbnail:
      "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=900&h=900&fit=crop",
  },
];

const MODE_BADGE_ICON = {
  image: ImageIcon,
  video: VideoIcon,
  audio: AudioIcon,
};

export default function AppsOverviewContent({ onOpenPreset }) {
  const [activeTab, setActiveTab] = useState("starter");
  const [activeStarterGroup, setActiveStarterGroup] = useState("film");
  const [query, setQuery] = useState("");
  const activeMode = useGenerationStore((s) => s.activeMode);
  const setMode = useGenerationStore((s) => s.setMode);
  const selectPreset = useGenerationStore((s) => s.selectPreset);
  const selectedPreset = useGenerationStore((s) => s.selectedPresetByMode[s.activeMode]);

  const presetEntries = useMemo(
    () =>
      Object.entries(CUSTOM_PRESETS).flatMap(([mode, presets]) =>
        presets.map((preset) => ({ ...preset, mode })),
      ),
    [],
  );

  const visiblePresets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return presetEntries.filter((preset) => {
      const matchesTab =
        activeTab === "starter" || activeTab === "custom"
          ? true
          : preset.mode === activeTab;
      const haystack = `${preset.name} ${preset.description}`.toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesTab && matchesQuery;
    });
  }, [activeTab, presetEntries, query]);

  const visibleStarterCards = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return STARTER_CARDS.filter((card) => {
      const matchesGroup = card.group === activeStarterGroup;
      const haystack = `${card.title} ${card.description}`.toLowerCase();
      const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
      return matchesGroup && matchesQuery;
    });
  }, [activeStarterGroup, query]);

  function handleOpenPreset(preset) {
    setMode(preset.mode);
    selectPreset(preset);
    onOpenPreset?.();
  }

  function handleOpenStarterCard(card) {
    const preset =
      getPresetById(card.mode, card.presetId) ??
      (CUSTOM_PRESETS[card.mode] ?? []).find((entry) => entry.id.endsWith(`-${card.presetId}`));
    if (!preset) return;
    handleOpenPreset({ ...preset, mode: card.mode });
  }

  function handleOpenCustomWorkflows() {
    onOpenPreset?.();
  }

  useEffect(() => {
    if (activeTab === "image" || activeTab === "video" || activeTab === "audio") {
      setMode(activeTab);
    }
  }, [activeTab, setMode]);

  useEffect(() => {
    if (!(activeTab === "image" || activeTab === "video" || activeTab === "audio")) return;
    if (!visiblePresets.length) return;
    const currentVisible = visiblePresets.some((preset) => preset.id === selectedPreset?.id);
    if (!currentVisible) {
      const nextPreset = visiblePresets[0];
      setMode(nextPreset.mode);
      selectPreset(nextPreset);
    }
  }, [visiblePresets, selectedPreset?.id, selectPreset, setMode]);

  return (
    <div className="custom-shell custom-shell--compact">
      <div className="custom-shell__body">
        <aside className="composer composer--overview">
          <section className="composer__surface overview-browser">
            <div className="overview-browser__hero">
              <h2>What do you want to create?</h2>
              <SearchInput
                containerClassName="overview-browser__search"
                className="overview-browser__search-input"
                iconClassName="overview-browser__search-icon"
                placeholder="Describe your creation or search apps"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
            </div>

            <div className="overview-browser__tabs" role="tablist" aria-label="Preset groups">
              {OVERVIEW_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  className={`overview-browser__tab${
                    activeTab === tab.id ? " overview-browser__tab--active" : ""
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === "starter" && (
              <div className="overview-browser__list">
                {STARTER_GROUPS.map((group) => {
                  const Icon = group.icon;
                  return (
                    <button
                      key={group.id}
                      type="button"
                      className={`overview-browser__item${
                        activeStarterGroup === group.id ? " overview-browser__item--active" : ""
                      }`}
                      onClick={() => setActiveStarterGroup(group.id)}
                    >
                      <span className="overview-browser__thumb overview-browser__thumb--icon">
                        <Icon />
                      </span>
                      <span className="overview-browser__content">
                        <strong>{group.label}</strong>
                        <span>{group.description}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {activeTab === "custom" && (
              <div className="overview-browser__custom-side">
                <span className="overview-browser__custom-side-icon">
                  <WorkflowIcon />
                </span>
                <p>Create Custom Apps with Workflows, for yourself or your team.</p>
                <button
                  type="button"
                  className="overview-browser__custom-side-button"
                  onClick={handleOpenCustomWorkflows}
                >
                  View workflows
                </button>
              </div>
            )}

            {(activeTab === "image" || activeTab === "video" || activeTab === "audio") && (
              <div className="overview-browser__list">
                {visiblePresets.map((preset) => (
                  <button
                    key={preset.id}
                    type="button"
                    className={`overview-browser__item${
                      selectedPreset?.id === preset.id ? " overview-browser__item--active" : ""
                    }`}
                  onClick={() => {
                    handleOpenPreset(preset);
                  }}
                >
                    <span className="overview-browser__thumb">
                      <img src={preset.thumbnail} alt="" />
                    </span>
                    <span className="overview-browser__content">
                      <strong>{preset.name}</strong>
                      <span>{preset.description}</span>
                    </span>
                  </button>
                ))}

                {visiblePresets.length === 0 && (
                  <div className="overview-browser__empty">No presets match that search.</div>
                )}
              </div>
            )}
          </section>
        </aside>

        <section className="preview">
          {activeTab === "starter" ? (
            <div className="overview-stage">
              <div className="overview-stage__header">
                <h2>{STARTER_GROUPS.find((group) => group.id === activeStarterGroup)?.label}</h2>
                <p>Recommended apps to get you started</p>
              </div>

              <div className="overview-stage__grid">
                {visibleStarterCards.map((card) => (
                  (() => {
                    const BadgeIcon = MODE_BADGE_ICON[card.mode] ?? WorkflowIcon;

                    return (
                      <button
                        key={card.id}
                        type="button"
                        className="overview-stage__card"
                        onClick={() => handleOpenStarterCard(card)}
                      >
                        <div className="overview-stage__media">
                          <img src={card.thumbnail} alt={card.title} />
                          <span className="overview-stage__badge">
                            <BadgeIcon />
                          </span>
                        </div>
                        <div className="overview-stage__copy">
                          <h3>{card.title}</h3>
                          <p>{card.description}</p>
                        </div>
                      </button>
                    );
                  })()
                ))}
              </div>
            </div>
          ) : activeTab === "custom" ? (
            <div className="overview-stage overview-stage--empty">
              <div className="overview-stage__empty">
                <span className="overview-stage__empty-icon">
                  <WorkflowIcon />
                </span>
                <p>Create Custom Apps with Workflows, for yourself or your team.</p>
                <button
                  type="button"
                  className="overview-stage__empty-button"
                  onClick={handleOpenCustomWorkflows}
                >
                  View workflows
                </button>
              </div>
            </div>
          ) : (
            <PreviewStage onPresetOpen={() => onOpenPreset?.()} />
          )}
        </section>
      </div>
    </div>
  );
}
