"use client";

/** Remplace next/image : simple <img>, chemins relatifs au fichier HTML. */
export default function Image({
  src,
  alt,
  fill,
  priority: _priority,
  sizes: _sizes,
  className,
  style,
  ...rest
}: React.ImgHTMLAttributes<HTMLImageElement> & { src: string; fill?: boolean; priority?: boolean }) {
  void _priority;
  void _sizes;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src.startsWith("/") ? src.slice(1) : src}
      alt={alt}
      className={className}
      style={fill ? { position: "absolute", inset: 0, width: "100%", height: "100%", ...style } : style}
      {...rest}
    />
  );
}
