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

export type { Subject };
export type { KSGOutput };

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
