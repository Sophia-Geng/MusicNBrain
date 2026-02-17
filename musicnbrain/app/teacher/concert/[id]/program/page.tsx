"use client";

import { useParams } from "next/navigation";
import { useEffect } from "react";
import {
  mockConcerts,
  mockPublishedPerformances,
  mockUpcomingPerformances,
} from "@/lib/mock-data";

export default function ProgramPrintPage() {
  const params = useParams();
  const concertId = params.id as string;

  const concert = mockConcerts.find((c) => c.id === concertId) || mockConcerts[0];
  const performances =
    concert.id === "3"
      ? mockPublishedPerformances
      : concert.id === "4"
      ? mockUpcomingPerformances
      : mockPublishedPerformances;

  const totalMinutes = performances.reduce((s, p) => s + p.duration, 0);

  const dateStr = new Date(concert.start_time).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeStr = new Date(concert.start_time).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Auto-open print dialog
  useEffect(() => {
    const timer = setTimeout(() => window.print(), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          .no-print { display: none !important; }
          .program-page { 
            box-shadow: none !important; 
            border: none !important;
            margin: 0 !important;
          }
        }
        @page {
          size: letter;
          margin: 0.75in;
        }
      `}</style>

      {/* Print hint bar */}
      <div
        className="no-print"
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          background: "#2563eb",
          color: "white",
          padding: "12px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          zIndex: 100,
          fontSize: 14,
        }}
      >
        <span>📄 Concert Program — Ready to print</span>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={() => window.print()}
            style={{
              padding: "8px 20px",
              background: "white",
              color: "#2563eb",
              border: "none",
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🖨 Print / Save as PDF
          </button>
          <button
            onClick={() => window.history.back()}
            style={{
              padding: "8px 20px",
              background: "transparent",
              color: "white",
              border: "1px solid white",
              borderRadius: 8,
              fontSize: 14,
              cursor: "pointer",
            }}
          >
            ← Back
          </button>
        </div>
      </div>

      {/* Program booklet */}
      <div
        className="program-page"
        style={{
          maxWidth: 650,
          margin: "80px auto 40px",
          background: "white",
          padding: "60px 50px",
          fontFamily: "'Georgia', 'Times New Roman', serif",
          color: "#1a1a1a",
          boxShadow: "0 2px 20px rgba(0,0,0,0.08)",
          border: "1px solid #e5e7eb",
        }}
      >
        {/* Decorative top line */}
        <div
          style={{
            width: 60,
            height: 3,
            background: "#1a1a1a",
            margin: "0 auto 40px",
          }}
        />

        {/* Title section */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontSize: 13,
              letterSpacing: 4,
              textTransform: "uppercase",
              color: "#888",
              marginBottom: 16,
            }}
          >
            Concert Program
          </div>
          <h1
            style={{
              fontSize: 32,
              fontWeight: 400,
              margin: "0 0 12px 0",
              lineHeight: 1.3,
              fontStyle: "italic",
            }}
          >
            {concert.title}
          </h1>
          <div
            style={{
              width: 40,
              height: 1,
              background: "#ccc",
              margin: "16px auto",
            }}
          />
          <div style={{ fontSize: 15, color: "#555", lineHeight: 1.8 }}>
            {dateStr}
            <br />
            {timeStr}
            <br />
            {concert.type === "ONLINE"
              ? "Online via Zoom"
              : `${concert.venue_name} — ${concert.venue_address}`}
          </div>
        </div>

        {/* Divider */}
        <div
          style={{
            borderTop: "1px solid #ddd",
            margin: "32px 0",
          }}
        />

        {/* Program heading */}
        <div
          style={{
            textAlign: "center",
            fontSize: 13,
            letterSpacing: 3,
            textTransform: "uppercase",
            color: "#888",
            marginBottom: 32,
          }}
        >
          Program
        </div>

        {/* Performance list */}
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {performances.map((p, i) => (
            <div key={p.id}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  padding: "16px 0",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 17, fontWeight: 600, marginBottom: 4 }}>
                    {p.piece}
                  </div>
                  <div style={{ fontSize: 14, color: "#666" }}>
                    {p.name}
                    {p.instrument && `, ${p.instrument}`}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 13,
                    color: "#999",
                    whiteSpace: "nowrap",
                    marginLeft: 20,
                    paddingTop: 3,
                  }}
                >
                  {p.duration} min
                </div>
              </div>
              {i < performances.length - 1 && (
                <div
                  style={{
                    borderBottom: "1px dotted #ddd",
                  }}
                />
              )}
            </div>
          ))}
        </div>

        {/* Footer divider */}
        <div
          style={{
            borderTop: "1px solid #ddd",
            margin: "32px 0",
          }}
        />

        {/* Footer info */}
        <div
          style={{
            textAlign: "center",
            fontSize: 13,
            color: "#999",
            lineHeight: 1.8,
          }}
        >
          {performances.length} performers · approximately {totalMinutes} minutes
          <br />
          {concert.type === "ONLINE" && concert.zoom_url && (
            <>Zoom: {concert.zoom_url}<br /></>
          )}
          <div style={{ marginTop: 16, fontSize: 12, color: "#bbb" }}>
            Generated by MusicNBrain
          </div>
        </div>

        {/* Decorative bottom line */}
        <div
          style={{
            width: 60,
            height: 3,
            background: "#1a1a1a",
            margin: "40px auto 0",
          }}
        />
      </div>
    </>
  );
}
