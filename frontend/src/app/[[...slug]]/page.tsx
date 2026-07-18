"use client";

import { usePathname } from "next/navigation";
import App from "../../App";

export default function CatchAllPage() {
  const pathname = usePathname() || "/";

  return <App initialPath={pathname} />;
}
