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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <header style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          padding: "16px 24px",
          borderBottom: "1px solid var(--border)",
          background: "var(--bg-secondary)"
        }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: "12px", textDecoration: "none", color: "inherit" }}>
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
            <strong style={{ fontSize: "18px", fontWeight: "600" }} className="brand-text">Zewo's Desk</strong>
          </a>
          <nav style={{ display: "flex", gap: "24px" }} className="desktop-nav">
            <a href="/" style={{ fontSize: "14px", fontWeight: "500" }}>Dashboard</a>
            <a href="/meta" style={{ fontSize: "14px", fontWeight: "500" }}>Meta</a>
          </nav>
          <nav style={{ display: "none", gap: "16px" }} className="mobile-nav">
            <a href="/" style={{ fontSize: "12px", fontWeight: "500" }}>Home</a>
            <a href="/meta" style={{ fontSize: "12px", fontWeight: "500" }}>Meta</a>
          </nav>
        </header>
        <main style={{ padding: "32px" }} className="main-content">
          {children}
        </main>
      </body>
    </html>
  );
}