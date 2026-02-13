"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConcertStatus } from "@/types";

/* NavBar */
export function NavBar() {
  const pathname = usePathname();
  const isTeacher = pathname.startsWith("/teacher");
  const isStudent = pathname.startsWith("/student");
  const isHome = pathname === "/";

  if (isHome) return null;

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "12px 24px",
        background: "white",
        borderBottom: "1px solid #e5e7eb",
        marginBottom: 24,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Link href="/" style={{ fontSize: 22, textDecoration: "none" }}>
          🎵
        </Link>
        <span style={{ fontWeight: 700, fontSize: 16, color: "#111827" }}>
          MusicNBrain
        </span>
        {isTeacher && (
          <span
            style={{
              background: "#dbeafe",
              color: "#1d4ed8",
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Teacher
          </span>
        )}
        {isStudent && (
          <span
            style={{
              background: "#d1fae5",
              color: "#065f46",
              padding: "2px 8px",
              borderRadius: 4,
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            Student
          </span>
        )}
      </div>
      <Link
        href="/"
        style={{
          background: "none",
          border: "1px solid #d1d5db",
          borderRadius: 6,
          padding: "4px 12px",
          fontSize: 13,
          color: "#6b7280",
          textDecoration: "none",
        }}
      >
        Logout
      </Link>
    </div>
  );
}

/* Status Badge */
export function StatusBadge({ status }: { status: ConcertStatus }) {
  const styles: Record<string, { bg: string; color: string; label: string }> = {
    DRAFT: { bg: "#f3f4f6", color: "#374151", label: "Draft" },
    PARSING: { bg: "#dbeafe", color: "#1d4ed8", label: "AI Parsing..." },
    REVIEWING: { bg: "#fef3c7", color: "#92400e", label: "Reviewing" },
    PUBLISHED: { bg: "#d1fae5", color: "#065f46", label: "Published" },
  };
  const s = styles[status] || styles.DRAFT;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "2px 10px",
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {s.label}
    </span>
  );
}

/* Confidence Cell - editable input with color coding */
export function ConfidenceCell({
  value,
  confidence,
  onChange,
  placeholder,
}: {
  value: string;
  confidence: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  const bg =
    confidence === "low" && !value
      ? "#fee2e2"
      : confidence === "low"
      ? "#fef9c3"
      : "white";
  const icon =
    confidence === "low" && !value
      ? "❌"
      : confidence === "low"
      ? "⚠️"
      : "✅";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder || ""}
        style={{
          background: bg,
          border: "1px solid #d1d5db",
          borderRadius: 4,
          padding: "4px 8px",
          fontSize: 13,
          width: "100%",
          outline: "none",
        }}
      />
      <span style={{ fontSize: 14 }}>{icon}</span>
    </div>
  );
}
