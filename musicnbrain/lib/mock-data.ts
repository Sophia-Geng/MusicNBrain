import {
  Concert,
  Performance,
  ConcertReviewSummary,
  StudentUpcomingPerformance,
  StudentCompletedPerformance,
} from "@/types";

export const mockConcerts: Concert[] = [
  // In Progress: DRAFT
  {
    id: "2",
    title: "Summer Concert 2026",
    type: "OFFLINE",
    status: "DRAFT",
    start_time: "2026-06-20T19:00:00Z",
    duration: 90,
    venue_name: "Boston Concert Hall",
    venue_address: "123 Main St, Boston",
    raw_input: "",
    raw_input_type: "TEXT",
  },
  // In Progress: REVIEWING
  {
    id: "1",
    title: "Spring Recital 2026",
    type: "ONLINE",
    status: "REVIEWING",
    start_time: "2026-03-15T14:00:00Z",
    duration: 120,
    venue_name: "",
    venue_address: "",
    raw_input:
      "1. Tommy - Fur Elise, 4 min\n2. Emma Chen, piano, Chopin Nocturne Op.9 No.2, about 8 minutes\n3. Liam - violin - Bach Partita No.2, 5 min",
    raw_input_type: "TEXT",
  },
  // Upcoming: Published but not yet performed
  {
    id: "4",
    title: "Easter Recital 2026",
    type: "OFFLINE",
    status: "PUBLISHED",
    start_time: "2026-04-05T15:00:00Z",
    duration: 60,
    venue_name: "Community Center Hall",
    venue_address: "45 Oak Ave, Cambridge",
    raw_input: "",
    raw_input_type: "TEXT",
    zoom_url: "",
  },
  // Past: Published and already performed
  {
    id: "3",
    title: "Winter Concert 2025",
    type: "ONLINE",
    status: "PUBLISHED",
    start_time: "2025-12-20T14:00:00Z",
    duration: 90,
    venue_name: "",
    venue_address: "",
    raw_input: "",
    raw_input_type: "TEXT",
    zoom_url: "https://zoom.us/j/987654321",
    audience_count: 24,
    recording_url: "#",
  },
];

export const mockPerformances: Performance[] = [
  {
    id: "1",
    concert_id: "1",
    order: 1,
    name: "Tommy",
    piece: "Fur Elise",
    instrument: "",
    grade: "",
    email: "",
    slot: "14:05",
    duration: 4,
    confidence: "low",
  },
  {
    id: "2",
    concert_id: "1",
    order: 2,
    name: "Emma Chen",
    piece: "Chopin Nocturne Op.9 No.2",
    instrument: "Piano",
    grade: "8",
    email: "emma@gmail.com",
    slot: "14:10",
    duration: 8,
    confidence: "high",
  },
  {
    id: "3",
    concert_id: "1",
    order: 3,
    name: "Liam Rodriguez",
    piece: "Bach Partita No.2",
    instrument: "Violin",
    grade: "7",
    email: "liam@gmail.com",
    slot: "14:20",
    duration: 5,
    confidence: "high",
  },
];

/* Upcoming published concert performances (concert id=4) */
export const mockUpcomingPerformances: Performance[] = [
  {
    id: "u1",
    concert_id: "4",
    order: 1,
    name: "Olivia Park",
    piece: "Sonatina in G Major",
    instrument: "Piano",
    grade: "5",
    email: "olivia@gmail.com",
    slot: "15:00",
    duration: 4,
    confidence: "high",
  },
  {
    id: "u2",
    concert_id: "4",
    order: 2,
    name: "Noah Zhang",
    piece: "Minuet in G",
    instrument: "Piano",
    grade: "4",
    email: "noah@gmail.com",
    slot: "15:06",
    duration: 3,
    confidence: "high",
  },
  {
    id: "u3",
    concert_id: "4",
    order: 3,
    name: "Mia Johnson",
    piece: "Gavotte",
    instrument: "Violin",
    grade: "6",
    email: "mia@gmail.com",
    slot: "15:10",
    duration: 5,
    confidence: "high",
  },
];

/* Past published concert performances (concert id=3) */
export const mockPublishedPerformances: Performance[] = [
  {
    id: "p1",
    concert_id: "3",
    order: 1,
    name: "Emma Chen",
    piece: "Bach Partita No.2",
    instrument: "Violin",
    grade: "8",
    email: "emma@gmail.com",
    slot: "14:00",
    duration: 6,
    confidence: "high",
  },
  {
    id: "p2",
    concert_id: "3",
    order: 2,
    name: "Tommy Lee",
    piece: "Chopin Waltz in C# Minor",
    instrument: "Piano",
    grade: "6",
    email: "tommy@gmail.com",
    slot: "14:08",
    duration: 5,
    confidence: "high",
  },
  {
    id: "p3",
    concert_id: "3",
    order: 3,
    name: "Sarah Kim",
    piece: "Meditation from Thais",
    instrument: "Violin",
    grade: "9",
    email: "sarah@gmail.com",
    slot: "14:15",
    duration: 7,
    confidence: "high",
  },
];

/* AI Review data for past concert */
export const mockConcertReview: ConcertReviewSummary = {
  concert_id: "3",
  overall_score: 8.6,
  overall_feedback:
    "A well-organized winter concert with strong performances across the board. The students showed excellent preparation and stage presence. Highlights included Sarah Kim's expressive interpretation and Emma Chen's solid technique. Areas for group improvement: transitions between performers could be smoother.",
  highlights: [
    "Sarah Kim received the highest individual score (9.2/10)",
    "All performers stayed within their allocated time",
    "Strong audience engagement with 24 attendees",
  ],
  performer_reviews: [
    {
      performance_id: "p1",
      name: "Emma Chen",
      piece: "Bach Partita No.2",
      instrument: "Violin",
      score: 8.5,
      feedback:
        "Solid technique with good intonation throughout. The phrasing in the Sarabande was particularly musical. Could improve dynamic contrast in the faster movements — the Gigue felt slightly flat dynamically. Overall a mature and well-prepared performance.",
      video_url: "#",
    },
    {
      performance_id: "p2",
      name: "Tommy Lee",
      piece: "Chopin Waltz in C# Minor",
      instrument: "Piano",
      score: 8.1,
      feedback:
        "Nice sense of waltz rhythm and good pedaling choices. The melodic line sang well in the right hand. A few memory slips in the middle section but recovered quickly. Tempo was slightly rushed in the coda — try to maintain the elegance through the ending.",
      video_url: "#",
    },
    {
      performance_id: "p3",
      name: "Sarah Kim",
      piece: "Meditation from Thais",
      instrument: "Violin",
      score: 9.2,
      feedback:
        "Outstanding performance with beautiful tone quality and vibrato control. The emotional arc of the piece was wonderfully shaped — you could feel the audience holding their breath. Excellent bow control in the pianissimo passages. A truly moving interpretation.",
      video_url: "#",
    },
  ],
};

/* Student messages */
import { StudentMessage } from "@/types";

export const mockStudentMessages: StudentMessage[] = [
  {
    id: "m1",
    concert_id: "4",
    student_name: "Olivia Park",
    message: "Hi! My piece name is actually Sonatina in G Major by Clementi, not just Sonatina in G Major. Could you update it?",
    created_at: "2026-03-10T09:15:00Z",
    read: false,
  },
  {
    id: "m2",
    concert_id: "4",
    student_name: "Noah Zhang",
    message: "I need to switch my piece to Minuet in G Minor instead. Is that ok?",
    created_at: "2026-03-11T14:30:00Z",
    read: false,
  },
  {
    id: "m3",
    concert_id: "1",
    student_name: "Emma Chen",
    message: "The duration should be 7 minutes, not 8. Thanks!",
    created_at: "2026-03-09T11:00:00Z",
    read: true,
  },
];

export const mockStudentPerformances: {
  upcoming: StudentUpcomingPerformance[];
  completed: StudentCompletedPerformance[];
} = {
  upcoming: [
    {
      id: "1",
      concert_title: "Spring Recital 2026",
      type: "ONLINE",
      piece: "Chopin Nocturne Op.9 No.2",
      slot: "14:10",
      duration: 8,
      order: 2,
      total_performers: 3,
      zoom_url: "https://zoom.us/j/123456",
      venue_name: "",
      venue_address: "",
      start_time: "2026-03-15T14:00:00Z",
    },
    {
      id: "3",
      concert_title: "Easter Recital 2026",
      type: "OFFLINE",
      piece: "Sonatina in G Major",
      slot: "15:00",
      duration: 4,
      order: 1,
      total_performers: 3,
      zoom_url: "",
      venue_name: "Community Center Hall",
      venue_address: "45 Oak Ave, Cambridge, MA",
      start_time: "2026-04-05T15:00:00Z",
    },
  ],
  completed: [
    {
      id: "2",
      concert_title: "Winter Concert 2025",
      type: "ONLINE",
      piece: "Bach Partita No.2",
      slot: "14:30",
      duration: 5,
      feedback:
        "Great intonation! Rhythm could be more steady in the middle section. Beautiful tone quality throughout.",
      video_url: "#",
      start_time: "2025-12-20T14:00:00Z",
    },
  ],
};
