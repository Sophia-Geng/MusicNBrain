// Copyright (c) 2025 MusicNBrain Media Lab. All Rights Reserved.
// Unauthorized use, copying, or distribution is prohibited.
// Contact: developer@musicnbrain.org

"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type FormState = {
  title: string;
  type: "ONLINE" | "OFFLINE";
  start_time: string;
  duration: number;
  venue_name: string;
  venue_address: string;
  raw_input: string;
};

const STORAGE_KEY = "musicnbrain_draft";

function loadDraft(): FormState | null {
  if (typeof window === "undefined") return null;
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  return null;
}

function saveDraft(form: FormState, imageData: string | null, imageName: string | null) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(form));
    if (imageData) {
      localStorage.setItem(STORAGE_KEY + "_image", imageData);
      localStorage.setItem(STORAGE_KEY + "_imageName", imageName || "");
    } else {
      localStorage.removeItem(STORAGE_KEY + "_image");
      localStorage.removeItem(STORAGE_KEY + "_imageName");
    }
  } catch {}
}

function clearDraft() {
  try {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY + "_image");
    localStorage.removeItem(STORAGE_KEY + "_imageName");
  } catch {}
}

export default function TeacherCreatePage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    title: "",
    type: "OFFLINE",
    start_time: "2026-03-15T14:00",
    duration: 120,
    venue_name: "",
    venue_address: "",
    raw_input: "",
  });
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">("idle");
  const [loaded, setLoaded] = useState(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  /* Load draft on mount */
  useEffect(() => {
    const draft = loadDraft();
    if (draft) {
      setForm(draft);
    }
    try {
      const img = localStorage.getItem(STORAGE_KEY + "_image");
      const imgName = localStorage.getItem(STORAGE_KEY + "_imageName");
      if (img) {
        setUploadedImage(img);
        setUploadedFileName(imgName || "image");
      }
    } catch {}
    setLoaded(true);
  }, []);

  /* Auto-save with debounce */
  const triggerSave = useCallback(() => {
    if (!loaded) return;
    setSaveStatus("saving");
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveDraft(form, uploadedImage, uploadedFileName);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1000);
  }, [form, uploadedImage, uploadedFileName, loaded]);

  useEffect(() => {
    if (loaded) triggerSave();
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [form, uploadedImage, loaded, triggerSave]);

  const update = (field: string, value: string | number) =>
    setForm((p) => ({ ...p, [field]: value }));

  const endTime = (() => {
    if (!form.start_time || !form.duration) return "";
    const d = new Date(form.start_time);
    d.setMinutes(d.getMinutes() + Number(form.duration));
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  })();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedImage(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setUploadedImage(null);
    setUploadedFileName(null);
  };

  const hasInput = form.raw_input.trim() || uploadedImage;

  const handleSubmit = () => {
    clearDraft();
    router.push("/teacher/review/1");
  };

  return (
    <div style={{ maxWidth: 580, margin: "0 auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <Link
          href="/teacher/concerts"
          style={{
            color: "#2563eb",
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          ← Back to Concerts
        </Link>

        {/* Auto-save indicator */}
        <span
          style={{
            fontSize: 13,
            color: saveStatus === "saved" ? "#16a34a" : saveStatus === "saving" ? "#9ca3af" : "transparent",
            transition: "color 0.3s",
          }}
        >
          {saveStatus === "saving" && "Saving..."}
          {saveStatus === "saved" && "✓ Draft saved"}
        </span>
      </div>

      <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 24 }}>
        Create New Concert
      </h2>

      {/* Title */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "#374151" }}>
          Concert Title
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => update("title", e.target.value)}
          placeholder="e.g., Spring Recital 2026"
          style={{
            width: "100%",
            padding: "10px 14px",
            border: "1px solid #d1d5db",
            borderRadius: 8,
            fontSize: 15,
            boxSizing: "border-box",
          }}
        />
      </div>

      {/* Start Time + Duration */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 8 }}>
        <div>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "#374151" }}>
            Start Time
          </label>
          <input
            type="datetime-local"
            value={form.start_time}
            onChange={(e) => update("start_time", e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              border: "1px solid #d1d5db",
              borderRadius: 8,
              fontSize: 15,
              boxSizing: "border-box",
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "#374151" }}>
            Duration
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="number"
              value={form.duration || ""}
              onChange={(e) => update("duration", parseInt(e.target.value) || 0)}
              placeholder="e.g. 120"
              min={30}
              step={30}
              style={{
                width: "100%",
                padding: "10px 14px",
                paddingRight: 70,
                border: "1px solid #d1d5db",
                borderRadius: 8,
                fontSize: 15,
                boxSizing: "border-box",
              }}
            />
            <span
              style={{
                position: "absolute",
                right: 14,
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: 14,
                color: "#9ca3af",
                pointerEvents: "none",
              }}
            >
              minutes
            </span>
          </div>
        </div>
      </div>
      {endTime && (
        <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 24 }}>
          Expected end: {endTime}
        </div>
      )}

      {/* Venue: Online / Offline */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 10, color: "#374151" }}>
          Venue
        </label>
        <div style={{ display: "flex", gap: 12, marginBottom: 14 }}>
          <button
            onClick={() => update("type", "OFFLINE")}
            style={{
              flex: 1,
              padding: "12px 0",
              border: form.type === "OFFLINE" ? "2px solid #2563eb" : "1px solid #d1d5db",
              borderRadius: 10,
              background: form.type === "OFFLINE" ? "#eff6ff" : "white",
              color: form.type === "OFFLINE" ? "#2563eb" : "#374151",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            📍 In-Person
          </button>
          <button
            onClick={() => update("type", "ONLINE")}
            style={{
              flex: 1,
              padding: "12px 0",
              border: form.type === "ONLINE" ? "2px solid #2563eb" : "1px solid #d1d5db",
              borderRadius: 10,
              background: form.type === "ONLINE" ? "#eff6ff" : "white",
              color: form.type === "ONLINE" ? "#2563eb" : "#374151",
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            🌐 Online (Zoom)
          </button>
        </div>

        {form.type === "OFFLINE" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <input
              type="text"
              value={form.venue_name}
              onChange={(e) => update("venue_name", e.target.value)}
              placeholder="Venue name, e.g., Boston Concert Hall"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                fontSize: 15,
                boxSizing: "border-box",
              }}
            />
            <input
              type="text"
              value={form.venue_address}
              onChange={(e) => update("venue_address", e.target.value)}
              placeholder="Address, e.g., 123 Main St, Boston"
              style={{
                width: "100%",
                padding: "10px 14px",
                border: "1px solid #d1d5db",
                borderRadius: 8,
                fontSize: 15,
                boxSizing: "border-box",
              }}
            />
          </div>
        )}

        {form.type === "ONLINE" && (
          <div
            style={{
              background: "#eff6ff",
              border: "1px solid #bfdbfe",
              borderRadius: 8,
              padding: 14,
              fontSize: 14,
              color: "#1e40af",
            }}
          >
            ℹ️ A Zoom link will be automatically created when you publish.
          </div>
        )}
      </div>

      {/* Program Input */}
      <div style={{ marginBottom: 24 }}>
        <label style={{ display: "block", fontSize: 14, fontWeight: 600, marginBottom: 6, color: "#374151" }}>
          Program List
        </label>
        <div style={{ fontSize: 13, color: "#9ca3af", marginBottom: 12 }}>
          Upload a photo of the program, or paste the text below. AI will organize it for you.
        </div>

        {/* Image upload area */}
        {!uploadedImage ? (
          <label
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "28px 20px",
              border: "2px dashed #93c5fd",
              borderRadius: 12,
              background: "#f8fafc",
              cursor: "pointer",
              marginBottom: 14,
            }}
          >
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
            <div style={{ fontSize: 15, color: "#2563eb", fontWeight: 600 }}>
              Upload a Photo
            </div>
            <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>
              Tap here to choose a photo from your device
            </div>
          </label>
        ) : (
          <div
            style={{
              border: "1px solid #d1d5db",
              borderRadius: 12,
              padding: 12,
              marginBottom: 14,
              background: "white",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 10,
              }}
            >
              <span style={{ fontSize: 14, color: "#374151", fontWeight: 500 }}>
                📷 {uploadedFileName}
              </span>
              <button
                onClick={removeImage}
                style={{
                  background: "none",
                  border: "1px solid #fca5a5",
                  borderRadius: 6,
                  padding: "4px 10px",
                  fontSize: 13,
                  color: "#ef4444",
                  cursor: "pointer",
                }}
              >
                Remove
              </button>
            </div>
            <img
              src={uploadedImage}
              alt="Uploaded program"
              style={{
                width: "100%",
                borderRadius: 8,
                maxHeight: 300,
                objectFit: "contain",
                background: "#f9fafb",
              }}
            />
          </div>
        )}

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
          <span style={{ fontSize: 13, color: "#9ca3af" }}>or paste text</span>
          <div style={{ flex: 1, height: 1, background: "#e5e7eb" }} />
        </div>

        {/* Text input */}
        <textarea
          value={form.raw_input}
          onChange={(e) => update("raw_input", e.target.value)}
          placeholder={"Paste your program list here, e.g.:\n\n1. Tommy - Fur Elise, 4 min\n2. Emma Chen, piano, Chopin Nocturne, 8 min\n3. Liam - violin - Bach Partita, 5 min"}
          rows={6}
          style={{
            width: "100%",
            padding: "12px 14px",
            border: "1px solid #d1d5db",
            borderRadius: 10,
            fontSize: 15,
            resize: "vertical",
            boxSizing: "border-box",
            lineHeight: 1.6,
          }}
        />
      </div>

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!form.title || !hasInput}
        style={{
          width: "100%",
          padding: "14px 0",
          background: form.title && hasInput ? "#2563eb" : "#9ca3af",
          color: "white",
          border: "none",
          borderRadius: 12,
          fontSize: 16,
          fontWeight: 700,
          cursor: form.title && hasInput ? "pointer" : "not-allowed",
          opacity: form.title && hasInput ? 1 : 0.7,
          marginBottom: 40,
        }}
      >
        Submit & Let AI Organize ⚡
      </button>
    </div>
  );
}
