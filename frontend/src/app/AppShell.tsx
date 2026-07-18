"use client";

import App from "../App";

interface AppShellProps {
  initialPath: string;
}

export default function AppShell({ initialPath }: AppShellProps) {
  return <App initialPath={initialPath} />;
}
