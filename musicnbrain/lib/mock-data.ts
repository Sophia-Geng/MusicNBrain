import { Concert, Performance, StudentUpcomingPerformance, StudentCompletedPerformance } from "@/types";

export const mockConcerts: Concert[] = [
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
