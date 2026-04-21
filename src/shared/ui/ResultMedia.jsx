const VIDEO_EXT = /\.(mp4|webm|mov|m4v)(\?|#|$)/i;
const AUDIO_EXT = /\.(mp3|wav|m4a|ogg)(\?|#|$)/i;

export default function ResultMedia({
  url,
  mode,
  variant = "default",
  alt = "",
  className = "",
}) {
  if (!url) return null;

  const kind = detectKind(url, mode);

  if (kind === "video") {
    return (
      <video
        className={className}
        src={url}
        controls={variant !== "thumbnail"}
        autoPlay={variant !== "detail"}
        muted={variant === "thumbnail"}
        loop={variant === "thumbnail"}
        playsInline
        preload={variant === "thumbnail" ? "metadata" : "auto"}
      />
    );
  }

  if (kind === "audio") {
    return <audio className={className} src={url} controls />;
  }

  return <img className={className} src={url} alt={alt} />;
}

function detectKind(url, mode) {
  if (mode === "video" || VIDEO_EXT.test(url)) return "video";
  if (mode === "audio" || AUDIO_EXT.test(url)) return "audio";
  return "image";
}
