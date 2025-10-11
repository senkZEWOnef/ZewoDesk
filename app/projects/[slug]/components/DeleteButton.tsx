"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface DeleteButtonProps {
  projectSlug: string;
  projectName: string;
}

export default function DeleteButton({ projectSlug, projectName }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/projects/${projectSlug}`, {
        method: "DELETE"
      });

      if (response.ok) {
        router.push("/");
      } else {
        alert("Failed to delete project");
      }
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Failed to delete project");
    } finally {
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  if (showConfirm) {
    return (
      <div style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.8)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000
      }}>
        <div style={{
          background: "var(--bg-secondary)",
          padding: "32px",
          borderRadius: "12px",
          border: "1px solid var(--border)",
          maxWidth: "400px",
          width: "90%"
        }}>
          <h3 style={{ 
            marginBottom: "16px", 
            fontSize: "20px",
            color: "var(--text-primary)" 
          }}>
            Delete Project
          </h3>
          <p style={{ 
            marginBottom: "24px", 
            color: "var(--text-secondary)",
            lineHeight: "1.5"
          }}>
            Are you sure you want to delete <strong style={{ color: "var(--text-primary)" }}>"{projectName}"</strong>? 
            This will permanently remove the project and all its data including notes, brainstorms, and activity history.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
            <button
              onClick={() => setShowConfirm(false)}
              style={{
                padding: "8px 16px",
                background: "transparent",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
                borderRadius: "6px",
                cursor: "pointer"
              }}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              style={{
                padding: "8px 16px",
                background: "var(--accent-red)",
                border: "none",
                color: "white",
                borderRadius: "6px",
                cursor: isDeleting ? "not-allowed" : "pointer",
                opacity: isDeleting ? 0.7 : 1
              }}
            >
              {isDeleting ? "Deleting..." : "Delete Project"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={() => setShowConfirm(true)}
      style={{
        padding: "8px 12px",
        background: "transparent",
        border: "1px solid var(--accent-red)",
        color: "var(--accent-red)",
        borderRadius: "6px",
        cursor: "pointer",
        fontSize: "12px",
        fontWeight: "500",
        transition: "all 0.2s ease"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--accent-red)";
        e.currentTarget.style.color = "white";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "transparent";
        e.currentTarget.style.color = "var(--accent-red)";
      }}
    >
      🗑️ Delete
    </button>
  );
}