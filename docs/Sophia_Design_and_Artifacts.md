# Sophia: Concert Management System — Design & Artifacts

## 1. Project Context

**Project:** MusicNBrain Media Lab — 2026 Spring Intern Program
**Lead:** Annie (Software Engineer, Google AI Team)
**Advisor:** Feng (Lab Director)

### Team Roles

| Member | Role | User Story | Focus Area |
|--------|------|------------|------------|
| **Sophia (Xieming)** | SWE Intern (NEU) | US1: Teacher - Concert Organization, US2: Student - Performance Query | Full Application Workflow, Web App, Program Generation |
| **Zhanchao** | SWE Intern (NYU) | US3: Teacher - Social Media Promotion | Social Media Integration (TikTok / Xiaohongshu MCP) |
| **Chris** | SWE Intern (UCSD) | US4: Student - Live Concert Performance | Zoom Meeting Integration, Meeting Automation |
| **Mena** | Data Scientist Intern (Columbia) | US5: Robot Judge - Automated Performance Evaluation | Live Video Generation, Real-time Avatar |

---

## 2. Sophia's Scope & Responsibility

**Owner:** Sophia (Xieming)
**Role:** Full Application Workflow — Web Applications + Concert Program Generation

### In Scope
- Web Server (Frontend UI + Backend API) — the central hub for all users
- Concert Program Generation (generate printable program PDFs, via MCP)
- Database design & implementation (Supabase)
- Concert CRUD, student/teacher/parent portal, notification system
- Integration interfaces with other team members' modules

### Out of Scope (owned by other team members)
- Social Media MCP (TikTok / Xiaohongshu) → **Zhanchao**
- Zoom Meeting automation, Bot scheduler, WebRTC → **Chris**
- Real-time Avatar Generation, Video Generation → **Mena**

### 待确认
- **AI Agent Backend (LLM)** — Sophia 是调用方还是实现方？需在团队会议中确认
- LLM 解析 program list 的具体分工（Sophia 负责 prompt + 调用，还是仅消费已解析数据？）

### Integration Boundaries
```
              Sophia's Web App (Central Hub)
                    │
         ┌──────────┼──────────────┐
         │          │              │
    Zhanchao      Chris          Mena
    Social Media  Zoom Meeting   Video Gen
    MCP           Bot/WebRTC     Avatar
    (US3)         (US4)          (US5)
```
Sophia provides the web platform and API that other members' modules plug into.

---

## 3. User Stories

### User Story 1: Teacher — Concert Organization

> As a music teacher, I want to organize online/offline concerts by uploading my program list and venue details, so that I can efficiently manage performances and automatically generate meeting links for attendees.

**Acceptance Criteria:**
- [ ] Teacher can upload program list (CSV / Email / free-text format)
- [ ] System processes irregular input using AI (LLM parsing)
- [ ] Teacher can review and edit structured data (Human-in-the-loop)
- [ ] System generates Zoom URL for online concerts
- [ ] Teacher can send notifications to all participants

### User Story 2: Student — Performance Query

> As a student performer, I want to easily query my performance time and venue information, so that I know exactly when and where I need to perform.

**Acceptance Criteria:**
- [ ] Student receives email notification with details
- [ ] Student can log in and view performance schedule
- [ ] Student sees: performance time, song title, venue info
- [ ] Student can access Zoom link for online concerts

---

## 4. System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (UI)                           │
│                                                                 │
│  Teacher Dashboard          Student Portal        Parent View   │
│  ┌──────────────┐          ┌─────────────┐      ┌───────────┐   │
│  │ Upload CSV/  │          │ My Schedule │      │ View Info │   │
│  │ Email Text   │          │ Zoom Links  │      │           │   │
│  │ Review & Edit│          │ Venue Info  │      │           │   │
│  │ Publish      │          │             │      │           │   │
│  │ Send Notify  │          │             │      │           │   │
│  └──────────────┘          └─────────────┘      └───────────┘   │
└─────────────────────┬───────────────────────────────────────────┘
                      │ REST API / WebSocket
┌─────────────────────▼───────────────────────────────────────────┐
│                     WEB SERVER (Backend)                        │
│                                                                 │
│  ┌──────────┐    ┌──────────────────────────┐    ┌──────────┐   │
│  │          │    │      Concert CRUD          │    │          │   │
│  │   Auth   │    │  ┌──────────────────┐    │    │ Notify   │   │
│  │  Module  │    │  │  AI Agent Backend │    │    │ Service  │   │
│  │          │    │  │  (LLM Parse)     │    │    │          │   │
│  │          │    │  └──────────────────┘    │    │          │   │
│  └────┬─────┘    └────────┬────────┬────────┘    └─────┬────┘   │
│       │                   │        │                   │        │
└───────┼───────────────────┼────────┼───────────────────┼────────┘
        │                   │        │                   │
   ┌────▼─────┐    ┌────────▼───┐ ┌──▼───────────┐ ┌────▼────────────┐
   │ Supabase │    │ Supabase   │ │  Zoom API    │ │  Email Service  │
   │ Auth     │    │ DB         │ │  (MCP/REST)  │ │  (SendGrid/SES) │
   └──────────┘    └────────────┘ └──────┬───────┘ └─────────────────┘
                                        │
                                 ┌──────▼──────────────┐
                                 │ Meeting Management  │
                                 │ & Bot Scheduler     │
                                 │ 1) creation         │
                                 │ 2) subscription     │
                                 │ 3) distribution     │
                                 └─────────────────────┘
```

---

## 5. Core Workflow — State Machine

```
Teacher uploads CSV/Email/Text
        │
        ▼
  ┌───────────┐     AI parses raw_program_input
  │  PARSING  │───► LLM extracts: student names, pieces, order
  └───────────┘     Writes to Performances table (is_confirmed=false)
        │
        ▼
  ┌───────────┐     Teacher reviews AI results
  │ REVIEWING │───► Yellow highlights = AI guessed (is_confirmed=false)
  └───────────┘     Teacher edits/confirms each row
        │               Teacher clicks "Publish"
        ▼
  ┌───────────┐     System auto-generates:
  │ PUBLISHED │───► 1) Zoom meeting URL (if ONLINE)
  └───────────┘     2) estimated_start_time for each performance
        │           3) Email notifications to all participants
        ▼
   Students receive email → Login → View schedule
```

---

## 6. Database Schema (DBML — for dbdiagram.io)

```dbml
// 1. Users
Table Users {
  id int [pk, increment]
  email varchar(255) [unique, not null]
  password_hash char(64) [not null]
  full_name varchar(100) [not null]
  role varchar(20) [not null, note: 'TEACHER, STUDENT, PARENT']
  zoom_account_id varchar(100) [note: '可选']
  created_at datetime [default: `now()`]
}

// 2. Concerts
Table Concerts {
  id int [pk, increment]
  teacher_id int [not null]
  title varchar(200) [not null]
  type varchar(20) [not null, note: 'ONLINE / OFFLINE']
  raw_program_input text [note: '老师上传的原始文本']
  status varchar(20) [default: 'PARSING', note: 'PARSING → REVIEWING → PUBLISHED']
  venue_address varchar(500)
  zoom_meeting_url varchar(500)
  start_time datetime [not null]
  end_time datetime
  created_at datetime [default: `now()`]
  updated_at datetime [default: `now()`]
}

// 3. Performances
Table Performances {
  id int [pk, increment]
  concert_id int [not null]
  student_user_id int [null, note: '关联用户ID']
  student_name_text varchar(100) [not null, note: 'AI解析出的名字']
  piece_name varchar(200) [not null]
  order_index int [not null]
  estimated_duration int [note: '分钟']
  estimated_start_time datetime [note: '系统自动计算']
  is_confirmed boolean [default: false, note: 'false=AI猜的, true=老师确认']
}

// 4. Notifications
Table Notifications {
  id int [pk, increment]
  concert_id int [not null]
  recipient_user_id int [not null]
  channel varchar(20) [default: 'EMAIL']
  status varchar(20) [default: 'PENDING', note: 'PENDING / SENT / FAILED']
  sent_at datetime
  created_at datetime [default: `now()`]
}

// Relationships
Ref: Users.id < Concerts.teacher_id
Ref: Concerts.id < Performances.concert_id
Ref: Users.id < Performances.student_user_id
Ref: Concerts.id < Notifications.concert_id
Ref: Users.id < Notifications.recipient_user_id
```

---

## 7. API Design

### 7.1 Auth

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register (teacher/student/parent) |
| POST | `/api/auth/login` | Login → returns JWT |
| GET | `/api/auth/me` | Get current user profile |

### 7.2 Concerts (Teacher)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/concerts` | Create concert + upload raw program text |
| GET | `/api/concerts` | List my concerts |
| GET | `/api/concerts/:id` | Get concert detail + performances |
| PUT | `/api/concerts/:id` | Update concert info |
| POST | `/api/concerts/:id/parse` | Trigger AI parsing (PARSING → REVIEWING) |
| PUT | `/api/concerts/:id/publish` | Publish concert (REVIEWING → PUBLISHED) |
| POST | `/api/concerts/:id/notify` | Send notifications to all participants |

### 7.3 Performances (Teacher edit, Student read)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/concerts/:id/performances` | List performances for a concert |
| PUT | `/api/performances/:id` | Teacher edits a performance row |
| PUT | `/api/performances/:id/confirm` | Teacher confirms AI result |
| PUT | `/api/performances/batch-confirm` | Confirm all at once |

### 7.4 Student Portal

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/my/performances` | Student views their upcoming performances |
| GET | `/api/my/performances/:id` | Single performance detail + Zoom link |

### 7.5 Zoom Integration

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/zoom/create-meeting` | Internal: create Zoom meeting for a concert |
| GET | `/api/zoom/meeting/:id` | Get meeting details / join URL |

---

## 8. AI Agent Backend — LLM Integration

> ⚠️ **待确认：这部分可能不在 Sophia 的 scope 内。先记录设计思路，待团队会议确认 AI Agent Backend 的归属后再调整。**

### 8.1 Purpose

Parse irregular teacher input (CSV, email body, free-text) into structured `Performances` data.

### 8.2 Input/Output Contract

```
INPUT (raw_program_input):
────────────────────────
"Hi, here's the program for next Saturday's recital:

1. Tommy Chen - Für Elise (Beethoven), about 4 min
2. Lisa Wang will play Clair de Lune by Debussy ~6min
3. Jack and Sarah - Piano duet, Hungarian Dance No.5
   probably 5 minutes
"

OUTPUT (structured JSON):
─────────────────────────
{
  "performances": [
    {
      "order_index": 1,
      "student_name_text": "Tommy Chen",
      "piece_name": "Für Elise (Beethoven)",
      "estimated_duration": 4,
      "confidence": 0.95
    },
    {
      "order_index": 2,
      "student_name_text": "Lisa Wang",
      "piece_name": "Clair de Lune (Debussy)",
      "estimated_duration": 6,
      "confidence": 0.92
    },
    {
      "order_index": 3,
      "student_name_text": "Jack & Sarah",
      "piece_name": "Hungarian Dance No.5 (Piano Duet)",
      "estimated_duration": 5,
      "confidence": 0.80
    }
  ]
}
```

### 8.3 Confidence → Human-in-the-loop

| Confidence | UI Treatment | is_confirmed |
|------------|-------------|--------------|
| ≥ 0.9 | Normal display | false (still needs teacher OK) |
| 0.7 - 0.9 | Yellow highlight ⚠️ | false |
| < 0.7 | Red highlight ❌ | false |

All rows start as `is_confirmed = false`. Teacher must review before publishing.

### 8.4 LLM Prompt Strategy

```
System: You are a music program parser. Extract structured data from
        the teacher's input. Return ONLY valid JSON. For each entry,
        provide a confidence score (0-1) for your parsing accuracy.

        Fields to extract:
        - order_index (performance order)
        - student_name_text (performer name)
        - piece_name (song/piece title with composer if mentioned)
        - estimated_duration (in minutes, null if not mentioned)
```

---

## 9. Integration Points

### 9.1 Sophia ↔ Chris (Zoom Meeting Integration)

**Interface:** Sophia's backend calls Chris's Zoom module when a concert is published.

```
Sophia (Web Server)
    │
    │ POST /api/concerts/:id/publish
    │   → status = PUBLISHED
    │   → if type == ONLINE:
    │       call Chris's Zoom module → get meeting URL
    │       save to concerts.zoom_meeting_url
    │
    ├──► [Chris] Meeting Management & Bot Scheduler
    │    1) creation   — create Zoom meeting
    │    2) subscription — register bot to join meeting
    │    3) distribution — share meeting URLs
    │
    └──► [Sophia] Notification Service
         → send emails with Zoom link + schedule to students
```

**Contract to agree with Chris:**
- API/MCP interface for creating Zoom meetings
- Input: concert title, start_time, duration
- Output: zoom_meeting_url, meeting_id

### 9.2 Sophia ↔ Mena (Live Video Generation)

**Interface:** Mena's avatar/video module connects to Zoom meetings via Chris's WebRTC bot.

```
Sophia (Web Server)
    │
    │ Provides concert data + performance schedule
    │
    └──► [Mena] Real-time Avatar Generation
         → Robot Judge evaluates performances (US5)
         → Connects via Chris's WebRTC Browser Bot
         → Audio/video feeds from Zoom
```

**Contract to agree with Mena:**
- Performance metadata API (piece_name, student info)
- Evaluation results write-back endpoint (future)

### 9.3 Sophia ↔ Zhanchao (Social Media Integration)

**Interface:** After concert is published, Zhanchao's social media MCP auto-posts announcements.

```
Sophia (AI Agent Backend)
    │
    │ MCP connection
    │
    └──► [Zhanchao] Social Media MCP
         → auto-post concert announcements
         → TikTok / Xiaohongshu
```

**Contract to agree with Zhanchao:**
- Trigger: concert status → PUBLISHED
- Input: concert title, date, venue, program summary
- Output: social media post URLs

### 9.4 Sophia ↔ Program Generation (PDF)

```
Sophia (Web Server)
    │
    │ MCP connection
    │
    └──► Program Generation Service
         → generate printable concert program PDF
         → email PDF URL to participants
```

---

## 10. Tech Stack

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | React / Next.js | SSR, routing, fast dev |
| Backend | Next.js API Routes / FastAPI | API layer |
| Database | Supabase (PostgreSQL) | Auth, RLS, real-time |
| Auth | Supabase Auth | Built-in, JWT |
| LLM | Claude API / Gemini 3 | Program list parsing |
| Zoom | Zoom API (OAuth) | Meeting creation |
| Email | SendGrid / AWS SES | Notifications |
| Hosting | Vercel + Supabase | Serverless |

---

## 11. Key UI Screens

### Screen 1: Teacher — Upload & Create Concert

```
┌──────────────────────────────────────────────┐
│  🎵 Create New Concert                       │
│                                              │
│  Title: [Summer Recital 2026          ]      │
│  Type:  (●) Online  ( ) Offline              │
│  Date:  [2026-03-15]  Time: [14:00]          │
│  Venue: [123 Music Hall, Boston     ]        │
│                                              │
│  Program List:                               │
│  ┌──────────────────────────────────────┐    │
│  │ Paste CSV, email text, or any format│    │
│  │                                      │    │
│  │ 1. Tommy - Fur Elise, 4min          │    │
│  │ 2. Lisa - Clair de Lune ~6min       │    │
│  │ ...                                  │    │
│  └──────────────────────────────────────┘    │
│  📎 Or upload CSV file                       │
│                                              │
│  [ Submit & Parse with AI ]                  │
└──────────────────────────────────────────────┘
```

### Screen 2: Teacher — Review AI Results (Human-in-the-loop)

```
┌──────────────────────────────────────────────────────────┐
│  🎵 Review: Summer Recital 2026          Status: REVIEWING│
│                                                          │
│  #  │ Student      │ Piece              │ Duration │ ✓   │
│  ───┼──────────────┼────────────────────┼──────────┼──── │
│  1  │ Tommy Chen   │ Für Elise          │ 4 min    │ [✓] │
│  2  │ Lisa Wang    │ Clair de Lune      │ 6 min    │ [✓] │
│  3  │ ⚠️ Jack...   │ ⚠️ Hungarian Dan..│ 5 min    │ [ ] │
│     │ [Edit ✏️]     │ [Edit ✏️]        │ [Edit]   │     │
│                                                          │
│  ⚠️ = AI confidence < 90%, please verify                 │
│                                                          │
│  [ Confirm All ]  [ Publish Concert ]                    │
└──────────────────────────────────────────────────────────┘
```

### Screen 3: Student — My Performances

```
┌──────────────────────────────────────────────┐
│  🎵 My Upcoming Performances                 │
│                                              │
│  ┌────────────────────────────────────────┐  │
│  │ 📅 Summer Recital 2026                 │  │
│  │ 🕐 Mar 15, 2:00 PM — Your slot: 2:10  │  │
│  │ 🎹 Für Elise (Beethoven)               │  │
│  │ 📍 123 Music Hall, Boston              │  │
│  │ 💻 Join Zoom: https://zoom.us/j/xxx   │  │
│  └────────────────────────────────────────┘  │
│                                              │
│  (No more upcoming performances)             │
└──────────────────────────────────────────────┘
```

---

## 12. Artifacts Checklist

| # | Artifact | Format | Status |
|---|----------|--------|--------|
| 1 | Database Schema (DBML) | `.dbml` | ✅ Done |
| 2 | Architecture Diagram | Image / Draw.io | ✅ Done (team) |
| 3 | API Specification | This document §7 | ✅ Done |
| 4 | AI Prompt Template | This document §8 | ⚠️ 待确认是否在 Sophia scope 内 |
| 5 | UI Wireframes | This document §11 | ✅ Done |
| 6 | State Machine Diagram | This document §5 | ✅ Done |
| 7 | Supabase Migration SQL | `.sql` | 🔲 TODO |
| 8 | Frontend Codebase | Next.js project | 🔲 TODO |
| 9 | LLM Integration Code | Python/TS module | ⚠️ 待确认 |
| 10 | Zoom OAuth Setup | Config + code | 🔲 TODO |
| 11 | Email Template | HTML | 🔲 TODO |
