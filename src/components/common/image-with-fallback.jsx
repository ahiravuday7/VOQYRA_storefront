import { ImageOff } from "lucide-react";
import { useState } from "react";

function ImageWithFallback({ src, alt, className = "", fallbackClassName = "", ...props }) {
  const [failedSrc, setFailedSrc] = useState(null);

  const hasError = !src || failedSrc === src;

  if (hasError) {
    return (
      <div
        className={`flex items-center justify-center bg-cloud/40 ${className} ${fallbackClassName}`}
        role="img"
        aria-label={alt || "Image unavailable"}
      >
        <ImageOff className="size-6 text-slate" aria-hidden="true" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setFailedSrc(src)}
      loading="lazy"
      {...props}
    />
  );
}

export { ImageWithFallback };
