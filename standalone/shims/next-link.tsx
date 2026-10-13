"use client";

import { forwardRef } from "react";

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { href: string | { pathname: string }; prefetch?: boolean };

/** Remplace next/link : liens vers le routeur par hachage. */
const Link = forwardRef<HTMLAnchorElement, Props>(function Link({ href, prefetch: _prefetch, ...rest }, ref) {
  void _prefetch;
  const target = typeof href === "string" ? href : href.pathname;
  const resolved = target.startsWith("/") ? `#${target}` : target;
  return <a ref={ref} href={resolved} {...rest} />;
});

export default Link;
