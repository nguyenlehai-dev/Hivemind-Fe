function textField(key, label, placeholder, options = {}) {
  return {
    key,
    type: "textarea",
    label,
    placeholder,
    required: true,
    ...options,
  };
}

function assetField(key, label, hint, options = {}) {
  return {
    key,
    type: "assets",
    label,
    hint,
    required: true,
    maxAssets: 1,
    ...options,
  };
}

function videoPreset({
  id,
  name,
  description,
  thumbnail,
  defaults = { settings: { aspect_ratio: "16:9", num_outputs: 1 } },
  fields,
}) {
  return {
    id,
    name,
    description,
    thumbnail,
    defaults,
    fields,
  };
}

export const CUSTOM_PRESETS = {
  image: [
    {
      id: "image-ad-concepter",
      name: "Ad Concepter",
      description: "Explore new concepts with a simple prompt and product shot.",
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=160&h=160&q=80",
      defaults: { settings: { aspect_ratio: "16:9", num_outputs: 3 } },
      fields: [
        textField("ad_concept", "Ad Concept", "Provide a brief description of your ad's concept."),
        assetField("reference_image", "Reference Image", "Add a reference image for the world you want your ad set in."),
        assetField("product_shot", "Product Shot", "Upload the product shot you want to feature in the ad."),
      ],
    },
    {
      id: "image-expand-image",
      name: "Expand Image",
      description: "Change your image's aspect ratio.",
      thumbnail:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=160&h=160&q=80",
      defaults: { settings: { aspect_ratio: "16:9", num_outputs: 1 } },
      fields: [
        assetField("source_image", "Source Image", "Upload the image you want to expand."),
        textField("expansion_goal", "Expansion Goal", "Describe what should appear in the newly expanded space."),
      ],
    },
    {
      id: "image-stylize-image",
      name: "Stylize Image",
      description: "Apply artistic styles to your image.",
      thumbnail:
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=160&h=160&q=80",
      defaults: { settings: { aspect_ratio: "1:1", num_outputs: 1 } },
      fields: [
        assetField("source_image", "Source Image", "Upload the base image you want to stylize."),
        textField("style_direction", "Style Direction", "Describe the artistic style, mood, or visual treatment."),
      ],
    },
    {
      id: "image-product-reshoot",
      name: "Product Reshoot",
      description: "Instantly change the setting, lighting, or the angle of your product.",
      thumbnail:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=160&h=160&q=80",
      defaults: { settings: { aspect_ratio: "4:3", num_outputs: 1 } },
      fields: [
        assetField("product_shot", "Product Shot", "Upload the existing product shot."),
        textField("reshoot_direction", "Reshoot Direction", "Describe the new angle, setting, or lighting you want."),
      ],
    },
    {
      id: "image-vary-image",
      name: "Vary Image",
      description: "Change specific elements of your image.",
      thumbnail:
        "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=160&h=160&q=80",
      defaults: { settings: { aspect_ratio: "1:1", num_outputs: 1 } },
      fields: [
        assetField("base_image", "Base Image", "Upload the image you want to vary."),
        textField("change_request", "Change Request", "Describe exactly what should change and what should stay."),
      ],
    },
    {
      id: "image-mockup",
      name: "Mockup",
      description: "Apply your design to real-world products and environments.",
      thumbnail:
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=160&h=160&q=80",
      defaults: { settings: { aspect_ratio: "4:3", num_outputs: 1 } },
      fields: [
        assetField("design_asset", "Design Asset", "Upload the artwork or design you want to place."),
        assetField("mockup_target", "Mockup Target", "Upload a product or environment reference.", { required: false }),
        textField("placement_notes", "Placement Notes", "Describe the product, scale, and placement.", { required: false }),
      ],
    },
    {
      id: "image-vary-ad",
      name: "Vary Ad",
      description: "Change your headline, swap your product or try a new color palette.",
      thumbnail:
        "https://images.unsplash.com/photo-1541462608143-67571c6738dd?auto=format&fit=crop&w=160&h=160&q=80",
      defaults: { settings: { aspect_ratio: "16:9", num_outputs: 3 } },
      fields: [
        assetField("base_ad", "Base Ad", "Upload the ad you want to vary."),
        textField("variation_goal", "Variation Goal", "Describe the new headline, product swap, or palette change."),
      ],
    },
    {
      id: "image-create-ad",
      name: "Create Ad",
      description: "Create new ads for your brand or product.",
      thumbnail:
        "https://images.unsplash.com/photo-1515169067868-5387ec356754?auto=format&fit=crop&w=160&h=160&q=80",
      defaults: { settings: { aspect_ratio: "16:9", num_outputs: 3 } },
      fields: [
        textField("brand_brief", "Brand Brief", "Describe your product, audience, and campaign objective."),
        assetField("product_shot", "Product Shot", "Upload the product or brand asset to feature.", { required: false }),
      ],
    },
    {
      id: "image-upscale-image",
      name: "Upscale Image",
      description: "Upscale any image to glorious, 4K quality.",
      thumbnail:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=160&h=160&q=80",
      defaults: { settings: { aspect_ratio: "16:9", num_outputs: 1 } },
      fields: [
        assetField("source_image", "Source Image", "Upload the image you want to upscale."),
        textField("finish_notes", "Finish Notes", "Describe any sharpening or finishing notes.", { required: false }),
      ],
    },
    {
      id: "image-cinematic-brainstorm",
      name: "Cinematic Brainstorm",
      description: "Upload one image and get 9 cinematic brainstorming scenes.",
      thumbnail:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=160&h=160&q=80",
      defaults: { settings: { aspect_ratio: "16:9", num_outputs: 4 } },
      fields: [
        assetField("source_image", "Source Image", "Upload the image you want to brainstorm from."),
        textField("scene_direction", "Scene Direction", "Describe the cinematic world, tone, or situation."),
      ],
    },
    {
      id: "image-character-renderer",
      name: "Character Renderer",
      description: "Create stunning 3D renders of character concepts by uploading a sketch or 2D image.",
      thumbnail:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&h=160&q=80",
      defaults: { settings: { aspect_ratio: "3:4", num_outputs: 1 } },
      fields: [
        assetField("character_input", "Character Input", "Upload a sketch or 2D character image."),
        textField("render_direction", "Render Direction", "Describe materials, lighting, and rendering style."),
      ],
    },
    {
      id: "image-story-panels",
      name: "Story Panels",
      description: "Expand the world and story of any given image.",
      thumbnail:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=160&h=160&q=80",
      defaults: { settings: { aspect_ratio: "16:9", num_outputs: 4 } },
      fields: [
        assetField("story_seed", "Story Seed", "Upload the image that starts the story."),
        textField("story_direction", "Story Direction", "Describe the world, plot beat, or emotional arc."),
      ],
    },
    {
      id: "image-panel-upscaler",
      name: "Panel Upscaler",
      description: "Upscale every individual image that is part of a story panel.",
      thumbnail:
        "https://images.unsplash.com/photo-1526378722484-cc5c510f75f8?auto=format&fit=crop&w=160&h=160&q=80",
      defaults: { settings: { aspect_ratio: "16:9", num_outputs: 1 } },
      fields: [
        assetField("panel_sheet", "Panel Sheet", "Upload the panel image you want to upscale."),
        textField("upscale_notes", "Upscale Notes", "Describe any finishing or cleanup request.", { required: false }),
      ],
    },
    {
      id: "image-runway-look",
      name: "Runway Look",
      description: "Give your photo a cinematic look.",
      thumbnail:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=160&h=160&q=80",
      defaults: { settings: { aspect_ratio: "16:9", num_outputs: 1 } },
      fields: [
        assetField("source_image", "Source Image", "Upload the photo you want to regrade."),
        textField("look_direction", "Look Direction", "Describe the cinematic look, lens feel, and grading direction."),
      ],
    },
    {
      id: "image-scene-builder",
      name: "Scene Builder",
      description: "Craft your multi-shot scene step by step — see the look, then bring it to life.",
      thumbnail:
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=160&h=160&q=80",
      defaults: { settings: { aspect_ratio: "16:9", num_outputs: 3 } },
      fields: [
        textField("scene_goal", "Scene Goal", "Describe the scene, subject, and visual objective."),
        assetField("keyframe_reference", "Keyframe Reference", "Upload the key reference that defines the scene look.", {
          required: false,
        }),
        textField("shot_plan", "Shot Plan", "Outline the sequence or shot progression.", { required: false }),
      ],
    },
  ],
  video: [
    videoPreset({
      id: "video-multi-shot-video",
      name: "Multi-Shot Video",
      description: "Generate multi-shot videos from a single prompt.",
      thumbnail:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        textField("scene_brief", "Scene Brief", "Describe the overall scene, camera, and progression."),
        textField("shot_breakdown", "Shot Breakdown", "Outline the key shots or beats in the sequence.", { required: false }),
      ],
    }),
    videoPreset({
      id: "video-scene-builder",
      name: "Scene Builder",
      description: "Craft your multi-shot scene step by step — see the look, then bring it to life.",
      thumbnail:
        "https://images.unsplash.com/photo-1517022812141-23620dba5c23?auto=format&fit=crop&w=160&h=160&q=80",
      defaults: { settings: { aspect_ratio: "16:9", num_outputs: 3 } },
      fields: [
        textField("scene_goal", "Scene Goal", "Describe the scene, subject, and visual objective."),
        assetField("keyframe_reference", "Keyframe Reference", "Upload the key reference that defines the scene look.", {
          required: false,
        }),
        textField("shot_plan", "Shot Plan", "Outline the sequence or shot progression.", { required: false }),
      ],
    }),
    videoPreset({
      id: "video-product-shot-video-builder",
      name: "Product Shot Video Builder",
      description: "Turn a product photo into a polished video ad.",
      thumbnail:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("product_shot", "Product Shot", "Upload the product image you want to animate."),
        textField("ad_direction", "Ad Direction", "Describe motion, camera moves, and ad style."),
      ],
    }),
    videoPreset({
      id: "video-remove-from-video",
      name: "Remove from Video",
      description: "Remove objects without reshooting.",
      thumbnail:
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("source_video", "Source Video", "Upload the video you want to clean up."),
        textField("removal_notes", "Removal Notes", "Describe what should be removed and what must stay."),
      ],
    }),
    videoPreset({
      id: "video-upscale-video",
      name: "Upscale Video",
      description: "Upscale video with Topaz AI.",
      thumbnail:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("source_video", "Source Video", "Upload the video you want to upscale."),
        textField("upscale_notes", "Upscale Notes", "Describe quality goals or finishing notes.", { required: false }),
      ],
    }),
    videoPreset({
      id: "video-edit-video",
      name: "Edit Video",
      description: "Swap backgrounds, lighting, angles - all without reshooting.",
      thumbnail:
        "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("source_video", "Source Video", "Upload the video you want to edit."),
        textField("edit_direction", "Edit Direction", "Describe background, lighting, angle, or style changes."),
      ],
    }),
    videoPreset({
      id: "video-performance-capture-with-act-two",
      name: "Performance Capture with Act-Two",
      description: "Animate characters using driving performance videos.",
      thumbnail:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("character_reference", "Character Reference", "Upload the character reference image."),
        assetField("performance_video", "Performance Video", "Upload the driving performance video."),
      ],
    }),
    videoPreset({
      id: "video-video-backdrop",
      name: "Video Backdrop",
      description: "Swap your video's background.",
      thumbnail:
        "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("source_video", "Source Video", "Upload the source video."),
        assetField("background_reference", "Background Reference", "Upload the new backdrop reference.", {
          required: false,
        }),
        textField("background_direction", "Background Direction", "Describe the new environment or backdrop."),
      ],
    }),
    videoPreset({
      id: "video-animate-keyframes",
      name: "Animate Keyframes",
      description: "Smooth transitions between keyframes.",
      thumbnail:
        "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("start_keyframe", "Start Keyframe", "Upload the starting keyframe."),
        assetField("end_keyframe", "End Keyframe", "Upload the ending keyframe."),
        textField("transition_notes", "Transition Notes", "Describe the motion or camera path between frames.", { required: false }),
      ],
    }),
    videoPreset({
      id: "video-image-to-dialogue",
      name: "Image to Dialogue",
      description: "Turn your image into a scripted video.",
      thumbnail:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("source_image", "Source Image", "Upload the image you want to animate."),
        textField("dialogue_script", "Dialogue Script", "Paste the dialogue or spoken script."),
      ],
    }),
    videoPreset({
      id: "video-references-to-video",
      name: "References to Video",
      description: "Create video from reference images.",
      thumbnail:
        "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("reference_images", "Reference Images", "Upload the primary image reference."),
        textField("motion_prompt", "Motion Prompt", "Describe the video motion, framing, and pacing."),
      ],
    }),
    videoPreset({
      id: "video-stylize-video",
      name: "Stylize Video",
      description: "Transform your video with different artistic styles.",
      thumbnail:
        "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("source_video", "Source Video", "Upload the video you want to stylize."),
        textField("style_direction", "Style Direction", "Describe the style, texture, and visual treatment."),
      ],
    }),
    videoPreset({
      id: "video-color-grade-video",
      name: "Color Grade Video",
      description: "Apply cinematic color grades.",
      thumbnail:
        "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("source_video", "Source Video", "Upload the video to color grade."),
        textField("grade_direction", "Grade Direction", "Describe the palette, contrast, and cinematic feel."),
      ],
    }),
    videoPreset({
      id: "video-video-lighting",
      name: "Video Lighting",
      description: "Change the lighting in your video scene.",
      thumbnail:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("source_video", "Source Video", "Upload the video you want to relight."),
        textField("lighting_direction", "Lighting Direction", "Describe the new lighting setup and mood."),
      ],
    }),
    videoPreset({
      id: "video-video-weather",
      name: "Video Weather",
      description: "Change the weather conditions in your video.",
      thumbnail:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("source_video", "Source Video", "Upload the video you want to weather-shift."),
        textField("weather_direction", "Weather Direction", "Describe the desired weather and atmosphere."),
      ],
    }),
    videoPreset({
      id: "video-video-time-of-day",
      name: "Video Time of Day",
      description: "Change the time of day in your video.",
      thumbnail:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("source_video", "Source Video", "Upload the video you want to retime."),
        textField("time_of_day_direction", "Time of Day Direction", "Describe the new time of day and ambient look."),
      ],
    }),
    videoPreset({
      id: "video-character-script-to-video",
      name: "Character Script to Video",
      description: "Generate talking character videos from a script or audio file.",
      thumbnail:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("character_reference", "Character Reference", "Upload the character image or reference."),
        textField("script_or_audio_notes", "Script or Audio Notes", "Add the script, dialogue, or describe the provided audio."),
      ],
    }),
    videoPreset({
      id: "video-character-swap",
      name: "Character Swap",
      description: "Become the hero of your own movie! With Character Swap you can place any character into any scene.",
      thumbnail:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("source_video", "Source Video", "Upload the destination scene video."),
        assetField("character_reference", "Character Reference", "Upload the character you want to insert."),
      ],
    }),
    videoPreset({
      id: "video-motion-sketch",
      name: "Motion Sketch",
      description: "Use annotations to drive the motion of your videos.",
      thumbnail:
        "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("source_video", "Source Video", "Upload the base video."),
        textField("motion_annotations", "Motion Annotations", "Describe the motion paths or sketch instructions."),
      ],
    }),
    videoPreset({
      id: "video-stitch-videos",
      name: "Stitch Videos",
      description: "Combine multiple videos into one.",
      thumbnail:
        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        assetField("clip_one", "Clip One", "Upload the first video clip."),
        textField("stitch_notes", "Stitch Notes", "Describe sequence, pacing, and transitions.", { required: false }),
      ],
    }),
  ],
  audio: [
    {
      id: "audio-sfx",
      name: "SFX",
      description: "Create sound effects from text descriptions.",
      thumbnail:
        "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        textField("sfx_prompt", "SFX Prompt", "Describe the sound effect you want to generate."),
      ],
    },
    {
      id: "audio-stylize-audio",
      name: "Stylize Audio",
      description: "Transform your voice into another voice style.",
      thumbnail:
        "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=160&h=160&q=80",
      fields: [
        textField("voice_style_prompt", "Voice Style Prompt", "Describe the target voice style, tone, or character."),
      ],
    },
  ],
};

export function getPresetById(mode, presetId) {
  return (CUSTOM_PRESETS[mode] ?? []).find((preset) => preset.id === presetId) ?? null;
}

export function getPresetInitialInputs(preset) {
  return Object.fromEntries(
    (preset?.fields ?? []).map((field) => [
      field.key,
      field.type === "assets" ? [] : (field.defaultValue ?? ""),
    ]),
  );
}

export function collectPresetAssets(preset, inputs) {
  return (preset?.fields ?? []).flatMap((field) =>
    field.type === "assets" ? inputs?.[field.key] ?? [] : [],
  );
}

export function getMissingPresetRequirements(preset, inputs) {
  return (preset?.fields ?? [])
    .filter((field) => field.required)
    .filter((field) => {
      const value = inputs?.[field.key];
      if (field.type === "assets") return (value?.length ?? 0) === 0;
      return !String(value ?? "").trim();
    })
    .map((field) => field.label);
}

export function buildPresetPrompt(preset, inputs, freeformPrompt = "") {
  if (!preset) return String(freeformPrompt ?? "");

  const lines = [
    `${preset.name}: ${preset.description}`,
    ...(preset.fields ?? [])
      .filter((field) => field.type !== "assets")
      .map((field) => [field.label, String(inputs?.[field.key] ?? "").trim()])
      .filter(([, value]) => value)
      .map(([label, value]) => `${label}: ${value}`),
  ];

  const extraPrompt = String(freeformPrompt ?? "").trim();
  if (extraPrompt) {
    lines.push(`Additional Direction: ${extraPrompt}`);
  }

  return lines.join("\n");
}
