import type { z } from "zod";
import type {
  TeachingGuideSchema,
  WorkedExampleSchema,
  PracticeSetSchema,
  MiniLessonSchema,
  ExitTicketSchema,
  HomeworkSchema,
  ParentUpdateSchema,
  ProgressNoteSchema,
  CAPABILITY_SCHEMAS,
  KSGOutput,
} from "@/lib/schemas";
import type { Subject } from "@/lib/taxonomy";

export type TeachingGuide = z.infer<typeof TeachingGuideSchema>;
export type WorkedExample = z.infer<typeof WorkedExampleSchema>;
export type PracticeSet = z.infer<typeof PracticeSetSchema>;
export type MiniLesson = z.infer<typeof MiniLessonSchema>;
export type ExitTicket = z.infer<typeof ExitTicketSchema>;
export type Homework = z.infer<typeof HomeworkSchema>;
export type ParentUpdate = z.infer<typeof ParentUpdateSchema>;
export type ProgressNote = z.infer<typeof ProgressNoteSchema>;

export type Capability = keyof typeof CAPABILITY_SCHEMAS;

export const CAPABILITY_LABELS: Record<Capability, string> = {
  teachingGuide: "Teaching Guide",
  workedExample: "Worked Example",
  practiceSet: "Practice Set",
  miniLesson: "Mini Lesson",
  exitTicket: "Exit Ticket",
  homework: "Homework",
  parentUpdate: "Parent Update",
  progressNote: "Progress Note",
};

export type { Subject };
export type { KSGOutput };

/**
 * A YouTube video a tutor has attached to the current session. A session can
 * cover several topics, so videos accumulate — each one carries the topic it
 * was found for, which becomes its heading in the student's packet.
 */
export type SessionVideo = {
  /** Stable list key. Distinct from videoId so the same video can be added under two topics. */
  id: string;
  videoId: string;
  title: string;
  channelTitle?: string;
  /** The skill or problem type this video was pulled in to support. */
  topic: string;
};

export type GenerateRequest = {
  capability: Capability;
  skillId: string;
  subject: Subject;
  options?: {
    duration?: number;
    difficulty?: "easy" | "medium" | "hard";
    studentStrength?: string;
    studentName?: string;
    homeworkAssigned?: string;
  };
};

export type GenerateResponse<T = unknown> = {
  capability: Capability;
  skillId: string;
  subject: "SAT" | "ACT";
  data: T;
};
