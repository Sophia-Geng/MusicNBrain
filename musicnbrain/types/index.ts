// TypeScript types for MusicNBrain

export type ConcertType = "ONLINE" | "OFFLINE";
export type ConcertStatus = "DRAFT" | "PARSING" | "REVIEWING" | "PUBLISHED";
export type Confidence = "high" | "low";
export type RawInputType = "TEXT" | "CSV" | "IMAGE" | "PDF" | "URL" | "EMAIL";

export interface Concert {
  id: string;
  title: string;
  type: ConcertType;
  status: ConcertStatus;
  start_time: string;
  duration: number;
  venue_name: string;
  venue_address: string;
  raw_input: string;
  raw_input_type: RawInputType;
  zoom_url?: string;
  audience_count?: number;
  recording_url?: string;
}

export interface Performance {
  id: string;
  concert_id: string;
  order: number;
  name: string;
  piece: string;
  instrument: string;
  grade: string;
  email: string;
  slot: string;
  duration: number;
  confidence: Confidence;
}

export interface PerformerReview {
  performance_id: string;
  name: string;
  piece: string;
  instrument: string;
  score: number;
  feedback: string;
  video_url?: string;
}

export interface ConcertReviewSummary {
  concert_id: string;
  overall_score: number;
  overall_feedback: string;
  highlights: string[];
  performer_reviews: PerformerReview[];
}

export interface StudentUpcomingPerformance {
  id: string;
  concert_title: string;
  type: ConcertType;
  piece: string;
  slot: string;
  duration: number;
  order: number;
  total_performers: number;
  zoom_url: string;
  venue_name: string;
  venue_address: string;
  start_time: string;
}

export interface StudentMessage {
  id: string;
  concert_id: string;
  student_name: string;
  message: string;
  created_at: string;
  read: boolean;
}

export interface StudentCompletedPerformance {
  id: string;
  concert_title: string;
  type: ConcertType;
  piece: string;
  slot: string;
  duration: number;
  feedback: string;
  video_url: string;
  start_time: string;
}
