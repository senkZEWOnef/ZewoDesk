// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Developer Command Center",
  description: "One pane of glass for all your apps.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body style={{ fontFamily: "ui-sans-serif, system-ui", padding: 16 }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <strong>Dev Console</strong>
          <nav style={{ display: "flex", gap: 12 }}>
            <a href="/">Dashboard</a>
            <a href="/api/meta">Meta</a>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
