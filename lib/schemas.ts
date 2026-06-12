import { z } from "zod";

const QuestionWithAnswerSchema = z.object({
  question: z.string(),
  answer: z.string(),
  explanation: z.string(),
});

export const TeachingGuideSchema = z.object({
  concept_overview: z.string(),
  simple_explanation: z.string(),
  common_misconceptions: z.array(z.string()),
  tutor_talking_points: z.array(z.string()),
});

export const WorkedExampleSchema = z.object({
  problem: z.string(),
  step_by_step: z.array(z.string()),
  final_answer: z.string(),
  tutor_note: z.string(),
});

export const PracticeSetSchema = z.object({
  easy: z.array(QuestionWithAnswerSchema),
  medium: z.array(QuestionWithAnswerSchema),
  hard: z.array(QuestionWithAnswerSchema),
});

export const MiniLessonSchema = z.object({
  objective: z.string(),
  opening_hook: z.string(),
  instruction_steps: z.array(z.string()),
  check_for_understanding: z.string(),
  closing: z.string(),
});

export const ExitTicketSchema = z.object({
  questions: z.array(
    z.object({ question: z.string(), answer: z.string() })
  ).length(3),
});

export const HomeworkSchema = z.object({
  skill_focus: z.string(),
  instructions: z.string(),
  questions: z.array(QuestionWithAnswerSchema).length(5),
});

export const ParentUpdateSchema = z.object({
  student_strength: z.string(),
  main_gap: z.string(),
  skills_practiced: z.array(z.string()),
  homework_assigned: z.string(),
  encouragement_note: z.string(),
});

export const ProgressNoteSchema = z.object({
  session_summary: z.string(),
  concepts_covered: z.array(z.string()),
  student_performance: z.string(),
  next_steps: z.string(),
});

export const PacketPracticeSchema = z.object({
  problems: z.array(
    z.object({
      question: z.string(),
      answer: z.string(),
      explanation: z.string(),
    })
  ).length(3),
});
export type PacketPracticeOutput = z.infer<typeof PacketPracticeSchema>;

export const KSGSchema = z.object({
  know: z.object({
    prerequisites: z.array(z.string()),
    key_vocabulary: z.array(z.object({ term: z.string(), definition: z.string() })),
    watch_out_for: z.string(),
  }),
  show: z.object({
    problem_type: z.string(),
    steps: z.array(z.object({
      step: z.string(),
      work: z.string(),
      why: z.string(),
    })),
    final_answer: z.string(),
  }),
  grow: z.object({
    key_takeaway: z.string(),
    connections: z.array(z.string()),
    next_challenge: z.string(),
  }),
});

export type KSGOutput = z.infer<typeof KSGSchema>;

export const CAPABILITY_SCHEMAS = {
  teachingGuide: TeachingGuideSchema,
  workedExample: WorkedExampleSchema,
  practiceSet: PracticeSetSchema,
  miniLesson: MiniLessonSchema,
  exitTicket: ExitTicketSchema,
  homework: HomeworkSchema,
  parentUpdate: ParentUpdateSchema,
  progressNote: ProgressNoteSchema,
} as const;

export type Capability = keyof typeof CAPABILITY_SCHEMAS;
