// app/layout.tsx
import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "Zewo's Desk",
  description: "One pane of glass for all your apps.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          padding: "24px 32px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-secondary)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ 
              width: "32px", 
              height: "32px", 
              background: "linear-gradient(135deg, var(--accent-blue), var(--accent-purple))",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "16px"
            }}>
              Z
            </div>
            <strong style={{ fontSize: "18px", fontWeight: "600" }}>Zewo's Desk</strong>
          </div>
          <nav style={{ display: "flex", gap: "24px" }}>
            <a href="/" style={{ fontSize: "14px", fontWeight: "500" }}>Dashboard</a>
            <a href="/meta" style={{ fontSize: "14px", fontWeight: "500" }}>Meta</a>
          </nav>
        </header>
        <main style={{ padding: "32px" }}>
          {children}
        </main>
      </body>
    </html>
  );
}