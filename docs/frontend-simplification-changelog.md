# Frontend Simplification Changelog

**Date:** 2026-02-17  
**Goal:** Simplify the UI for elderly users (grandma-level usability)

---

## Summary of Changes

The entire teacher-side frontend was redesigned with a "preview-first, edit-on-demand" philosophy. Instead of showing editable spreadsheet-style forms, the UI now shows clean, readable cards that users review visually and only edit when something is wrong.

---

## Files Changed

### 1. `types/index.ts` — Type definitions
- Added `StudentMessage` type (id, concert_id, student_name, message, created_at, read)
- Added optional fields to `Concert`: `zoom_url`, `audience_count`, `recording_url`
- Added `PerformerReview` and `ConcertReviewSummary` types for AI review data

### 2. `lib/mock-data.ts` — Mock data
- Added `mockUpcomingPerformances` (concert id=4, Easter Recital — published but not yet performed)
- Added `mockPublishedPerformances` (concert id=3, Winter Concert — already performed)
- Added `mockConcertReview` — full AI review data: overall score (8.6/10), overall feedback, highlights, and per-student reviews with scores and feedback text
- Added `mockStudentMessages` — 3 sample messages from students (2 unread, 1 read)
- Added new concert: "Easter Recital 2026" (id=4, PUBLISHED, upcoming, offline)

### 3. `app/teacher/review/[id]/page.tsx` — Review page (MAJOR REWRITE)

**Before:** 7-column editable table, left-side original input panel, 3-color confidence system, drag-to-reorder, social media modal, save draft / re-analyze buttons.

**After:**
- **Preview-first design:** Each performer is a card showing name, piece, instrument, duration in read-only mode
- **Edit on demand:** Click "✏️ Edit" to expand a card into an editable form, click "✅ Save" to collapse back
- **Concert header:** Styled like a program booklet cover (title, date, venue centered)
- **AI prompt banner:** "🤖 AI organized 3 performers for you — please review"
- **Missing info warnings:** Yellow border + "⚠️ Missing: Instrument, Email" per card
- **Drag + button reorder:** Cards are draggable (HTML5 drag API) with visual feedback (blue border on drop target, opacity on dragged item). ↑↓ buttons kept as fallback
- **Social media share:** Full TikTok / Xiaohongshu flow preserved in modal
- **Simplified publish check:** Single summary bar ("⚠️ 1 performer still missing some info" or "✅ All performer info is complete")

### 4. `app/teacher/create/page.tsx` — Create concert page (SIMPLIFIED)

**Before:** Complex form with multimodal input (PDF/Image/Excel/URL upload, text paste), radio buttons for online/offline, dropdown for duration.

**After:**
- **Duration:** Changed from dropdown (60/90/120/150/180) to number input with step=30, right-aligned "minutes" label. User can type any number or use arrows in 30-min increments
- **Venue selector:** Radio buttons → two large toggle buttons ("📍 In-Person" / "🌐 Online (Zoom)")
- **Program input simplified to 2 methods only:**
  - 📷 Upload a Photo (image file picker with preview + remove)
  - Paste text (textarea with example placeholder)
  - Connected by an "or paste text" divider
- **Removed:** PDF/Excel/CSV upload, URL input, "Multimodal Input" technical label, drag-and-drop file zone
- **Auto-save:** Form auto-saves to localStorage after 1 second of inactivity. Shows "✓ Draft saved" indicator top-right. Restores on page reload. Clears on submit.

### 5. `app/teacher/concerts/page.tsx` — My Concerts list (RESTRUCTURED)

**Before:** Single list, only REVIEWING concerts were clickable.

**After:**
- **3 tabs:** "📝 In Progress" / "📅 Upcoming" / "✅ Past"
  - In Progress = DRAFT + PARSING + REVIEWING (not yet published)
  - Upcoming = PUBLISHED + start_time in the future (editable)
  - Past = PUBLISHED + start_time in the past (read-only)
- **Grandma-friendly labels:**
  - DRAFT → "Draft" / "Continue editing →"
  - REVIEWING → "Ready to Review" / "Review AI results →"
  - PUBLISHED upcoming → "Published" / "View & Edit →"
  - PUBLISHED past → "Completed" / "View results →"
- **Tab descriptions:** Small gray text under tabs ("Not yet published", "Published, not yet performed", "Already performed")
- **Upcoming extras:** Green hint "📬 Students notified · You can still make changes" + red badge "💬 2 new messages" if unread student messages exist
- **Past extras:** "👥 24 attendees · 🎥 Recording available"
- **Hover effect:** Cards highlight blue border on hover

### 6. `app/teacher/concert/[id]/page.tsx` — Published concert detail (NEW PAGE)

**Two completely different views based on time:**

**Upcoming view (editable):**
- Header with "📅 Upcoming" badge + "✏️ Edit" button for concert info
- Green banner: "📬 Students have been notified · You can still make changes"
- Quick stats (performers count, total minutes)
- Editable performer cards (same edit-in-place pattern as review page)
- "+ Add" performer button
- 💬 Student Messages section with unread count badge, per-message "✓ Read" button, "Mark all as read"
- Concert info edit modal (title, time, duration, venue — all editable)
- After any edit → "📬 Changes Saved! Would you like to notify students?" modal (Yes/No)

**Past view (read-only + AI reviews):**
- Header with "✅ Completed" badge (no edit button)
- Concert Summary: 3 stat cards (performers, attendees, minutes)
- Overall AI Score (⭐ 8.6/10) with full text review
- 🌟 Highlights list
- Individual performer cards: name, piece, instrument, AI score badge, expandable AI review text, "▶ Watch Recording" button
- Links section (Zoom URL, full recording)
- No edit buttons anywhere

**Shared features (both views):**
- 📱 Share button → TikTok / Xiaohongshu social media modal (platform select → caption preview/edit → copy & open)
- 📄 Export Program button → opens printable program page

### 7. `app/teacher/concert/[id]/program/page.tsx` — Printable program (NEW PAGE)

- Serif font (Georgia) styled like a real concert program booklet
- Centered layout: "CONCERT PROGRAM" header, concert title (italic), date, time, venue
- Program list: piece name (bold) + performer name + instrument + duration
- Dotted dividers between entries
- Footer: performer count, total duration, Zoom link if online, "Generated by MusicNBrain"
- Auto-opens browser print dialog on page load
- Blue toolbar at top: "🖨 Print / Save as PDF" + "← Back" (hidden when printing)
- @media print CSS: hides toolbar, removes shadows/borders

### 8. `app/student/schedule/page.tsx` — Student schedule (ENHANCED)

- **New: messaging feature** — each upcoming performance card has a "💬 Something wrong? Message your teacher" button
- Click to expand a text area, type message, click "Send 📨"
- Sent messages shown as green confirmation: "✅ You sent: ..."
- Can send multiple messages per performance
- Slightly increased font sizes and padding for better readability

### 9. `components/shared.tsx` — Shared components (UNCHANGED)
- NavBar and StatusBadge kept as-is
- ConfidenceCell still exported but no longer used by the new review page (can be cleaned up later)

---

## New Routes

| Route | Description |
|-------|-------------|
| `/teacher/concert/[id]` | Published concert detail (upcoming=editable, past=read-only+AI) |
| `/teacher/concert/[id]/program` | Printable PDF program booklet |

## Design Principles Applied

1. **Preview-first:** Show finished-looking content by default, edit only on demand
2. **Card > Table:** Vertical card layout instead of dense horizontal tables
3. **Two states only:** "needs attention" (yellow) vs "complete" (green) — no 3-color system
4. **Big touch targets:** Buttons are 48px+ height, generous padding
5. **Progressive disclosure:** Edit forms hidden until needed, details collapsible
6. **Auto-save:** No manual save button needed, works via localStorage
7. **Time-aware UI:** Same data model, but completely different views for upcoming vs past concerts
8. **Student voice:** Students can flag issues directly to teacher via simple messaging
