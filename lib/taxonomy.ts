export type Subject =
  | "Algebra 1"
  | "Algebra 2"
  | "Geometry"
  | "Precalculus"
  | "Calculus"
  | "SAT/ACT Math"
  | "ELA";

export const ALL_SUBJECTS: Subject[] = [
  "Algebra 1",
  "Algebra 2",
  "Geometry",
  "Precalculus",
  "Calculus",
  "SAT/ACT Math",
  "ELA",
];

export type Skill = {
  id: string;
  name: string;
  subject: Subject[];
  domain: "Math" | "ELA";
  difficulty: "foundational" | "intermediate" | "advanced";
  tags: string[];
  calculatorAllowed?: boolean; // relevant for SAT/ACT Math only
};

export const SKILLS: Skill[] = [
  // ── Algebra 1 ──────────────────────────────────────────────────────────────
  {
    id: "alg1-linear-equations",
    name: "Linear Equations",
    subject: ["Algebra 1", "SAT/ACT Math"],
    domain: "Math",
    difficulty: "foundational",
    tags: ["solving", "one-variable", "inverse operations"],
  },
  {
    id: "alg1-slope-rate",
    name: "Slope and Rate of Change",
    subject: ["Algebra 1", "SAT/ACT Math"],
    domain: "Math",
    difficulty: "foundational",
    tags: ["rise over run", "rate", "linear graphs", "y-intercept"],
  },
  {
    id: "alg1-inequalities",
    name: "Inequalities",
    subject: ["Algebra 1"],
    domain: "Math",
    difficulty: "foundational",
    tags: ["solving", "graphing on number line", "compound inequalities"],
  },
  {
    id: "alg1-systems",
    name: "Systems of Equations",
    subject: ["Algebra 1", "SAT/ACT Math"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["substitution", "elimination", "graphing", "two variables"],
  },
  {
    id: "alg1-functions-intro",
    name: "Introduction to Functions",
    subject: ["Algebra 1", "SAT/ACT Math"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["domain", "range", "input-output", "vertical line test"],
  },
  {
    id: "alg1-exponent-rules",
    name: "Properties of Exponents",
    subject: ["Algebra 1", "Algebra 2", "SAT/ACT Math"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["product rule", "quotient rule", "power rule", "negative exponents"],
  },

  // ── Algebra 2 ──────────────────────────────────────────────────────────────
  {
    id: "alg2-quadratics",
    name: "Quadratic Functions",
    subject: ["Algebra 2", "SAT/ACT Math"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["parabolas", "factoring", "quadratic formula", "vertex form"],
  },
  {
    id: "alg2-polynomials",
    name: "Polynomial Operations",
    subject: ["Algebra 2"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["adding", "subtracting", "multiplying", "long division", "factoring"],
  },
  {
    id: "alg2-exponential-log",
    name: "Exponential and Logarithmic Functions",
    subject: ["Algebra 2", "Precalculus"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["growth", "decay", "log rules", "natural log", "inverse functions"],
  },
  {
    id: "alg2-rational",
    name: "Rational Expressions",
    subject: ["Algebra 2"],
    domain: "Math",
    difficulty: "advanced",
    tags: ["simplifying", "multiplying", "dividing", "excluded values", "complex fractions"],
  },
  {
    id: "alg2-complex-numbers",
    name: "Complex Numbers",
    subject: ["Algebra 2"],
    domain: "Math",
    difficulty: "advanced",
    tags: ["imaginary unit", "standard form", "arithmetic", "conjugates"],
  },

  // ── Geometry ───────────────────────────────────────────────────────────────
  {
    id: "geo-triangle-congruence",
    name: "Triangle Congruence",
    subject: ["Geometry"],
    domain: "Math",
    difficulty: "foundational",
    tags: ["SSS", "SAS", "ASA", "AAS", "CPCTC"],
  },
  {
    id: "geo-triangle-similarity",
    name: "Triangle Similarity",
    subject: ["Geometry"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["AA", "SAS", "SSS similarity", "scale factor", "proportional sides"],
  },
  {
    id: "geo-circle-theorems",
    name: "Circle Theorems",
    subject: ["Geometry"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["central angle", "inscribed angle", "arc", "chord", "tangent"],
  },
  {
    id: "geo-coordinate",
    name: "Coordinate Geometry",
    subject: ["Geometry", "SAT/ACT Math"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["distance formula", "midpoint", "slope", "parallel", "perpendicular"],
  },
  {
    id: "geo-proofs",
    name: "Geometric Proofs",
    subject: ["Geometry"],
    domain: "Math",
    difficulty: "advanced",
    tags: ["two-column proof", "paragraph proof", "postulates", "theorems"],
  },
  {
    id: "geo-volume-area",
    name: "Surface Area and Volume",
    subject: ["Geometry", "SAT/ACT Math"],
    domain: "Math",
    difficulty: "foundational",
    tags: ["prisms", "cylinders", "pyramids", "cones", "spheres"],
  },

  // ── Precalculus ────────────────────────────────────────────────────────────
  {
    id: "pre-trig-functions",
    name: "Trigonometric Functions",
    subject: ["Precalculus"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["sine", "cosine", "tangent", "unit circle", "graphs", "amplitude"],
  },
  {
    id: "pre-trig-identities",
    name: "Trigonometric Identities",
    subject: ["Precalculus"],
    domain: "Math",
    difficulty: "advanced",
    tags: ["Pythagorean identities", "sum and difference", "double angle", "verifying"],
  },
  {
    id: "pre-conic-sections",
    name: "Conic Sections",
    subject: ["Precalculus"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["circles", "ellipses", "hyperbolas", "parabolas", "standard form"],
  },
  {
    id: "pre-sequences-series",
    name: "Sequences and Series",
    subject: ["Precalculus", "Algebra 2"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["arithmetic", "geometric", "sigma notation", "partial sums"],
  },
  {
    id: "pre-intro-limits",
    name: "Introduction to Limits",
    subject: ["Precalculus", "Calculus"],
    domain: "Math",
    difficulty: "advanced",
    tags: ["limit definition", "one-sided limits", "continuity", "asymptotes"],
  },

  // ── Calculus ───────────────────────────────────────────────────────────────
  {
    id: "calc-limits",
    name: "Limits",
    subject: ["Calculus"],
    domain: "Math",
    difficulty: "foundational",
    tags: ["limit laws", "substitution", "factoring", "L'Hopital", "infinity"],
  },
  {
    id: "calc-derivative-def",
    name: "Definition of the Derivative",
    subject: ["Calculus"],
    domain: "Math",
    difficulty: "foundational",
    tags: ["limit definition", "tangent line", "instantaneous rate of change"],
  },
  {
    id: "calc-diff-rules",
    name: "Differentiation Rules",
    subject: ["Calculus"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["power rule", "product rule", "quotient rule", "chain rule"],
  },
  {
    id: "calc-applications",
    name: "Applications of Derivatives",
    subject: ["Calculus"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["optimization", "related rates", "increasing/decreasing", "concavity"],
  },
  {
    id: "calc-integration",
    name: "Integration",
    subject: ["Calculus"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["antiderivatives", "indefinite integrals", "u-substitution", "definite integrals"],
  },
  {
    id: "calc-ftc",
    name: "Fundamental Theorem of Calculus",
    subject: ["Calculus"],
    domain: "Math",
    difficulty: "advanced",
    tags: ["FTC Part 1", "FTC Part 2", "accumulation", "area under curve"],
  },

  // ── SAT/ACT Math (exclusive to test-prep) ─────────────────────────────────
  {
    id: "sat-percents",
    name: "Percents",
    subject: ["SAT/ACT Math"],
    domain: "Math",
    difficulty: "foundational",
    tags: ["percent change", "markup", "discount", "word problems"],
    calculatorAllowed: true,
  },
  {
    id: "sat-ratios",
    name: "Ratios and Proportions",
    subject: ["SAT/ACT Math"],
    domain: "Math",
    difficulty: "foundational",
    tags: ["unit rates", "proportional reasoning", "unit conversion"],
    calculatorAllowed: true,
  },
  {
    id: "sat-function-notation",
    name: "Function Notation",
    subject: ["SAT/ACT Math"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["f(x)", "composition", "evaluation", "inverse"],
    calculatorAllowed: true,
  },
  {
    id: "sat-statistics",
    name: "Statistics and Data Analysis",
    subject: ["SAT/ACT Math"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["mean", "median", "mode", "standard deviation", "scatterplots", "correlation"],
    calculatorAllowed: true,
  },
  {
    id: "sat-problem-context",
    name: "Problem Solving in Context",
    subject: ["SAT/ACT Math"],
    domain: "Math",
    difficulty: "intermediate",
    tags: ["word problems", "modeling", "units", "interpreting expressions"],
    calculatorAllowed: true,
  },

  // ── ELA ────────────────────────────────────────────────────────────────────
  {
    id: "ela-comma-rules",
    name: "Comma Rules",
    subject: ["ELA"],
    domain: "ELA",
    difficulty: "foundational",
    tags: ["punctuation", "independent clauses", "introductory phrases", "lists"],
  },
  {
    id: "ela-subject-verb",
    name: "Subject-Verb Agreement",
    subject: ["ELA"],
    domain: "ELA",
    difficulty: "foundational",
    tags: ["singular", "plural", "intervening phrases", "indefinite pronouns"],
  },
  {
    id: "ela-transitions",
    name: "Transitions",
    subject: ["ELA"],
    domain: "ELA",
    difficulty: "intermediate",
    tags: ["coherence", "signal words", "contrast", "cause-effect", "sequence"],
  },
  {
    id: "ela-apostrophes",
    name: "Apostrophes",
    subject: ["ELA"],
    domain: "ELA",
    difficulty: "foundational",
    tags: ["possession", "contractions", "its vs it's", "plural possessives"],
  },
  {
    id: "ela-main-idea",
    name: "Main Idea",
    subject: ["ELA"],
    domain: "ELA",
    difficulty: "foundational",
    tags: ["central claim", "theme", "summarizing", "supporting details"],
  },
  {
    id: "ela-inference",
    name: "Inference",
    subject: ["ELA"],
    domain: "ELA",
    difficulty: "intermediate",
    tags: ["implied meaning", "textual evidence", "drawing conclusions", "author intent"],
  },
  {
    id: "ela-vocab-context",
    name: "Vocabulary in Context",
    subject: ["ELA"],
    domain: "ELA",
    difficulty: "foundational",
    tags: ["word meaning", "context clues", "connotation", "denotation"],
  },
  {
    id: "ela-authors-purpose",
    name: "Author's Purpose",
    subject: ["ELA"],
    domain: "ELA",
    difficulty: "intermediate",
    tags: ["rhetorical purpose", "tone", "text structure", "audience"],
  },
  {
    id: "ela-thesis-evidence",
    name: "Thesis and Evidence",
    subject: ["ELA"],
    domain: "ELA",
    difficulty: "intermediate",
    tags: ["claim", "evidence", "reasoning", "counterclaim", "argumentative writing"],
  },
  {
    id: "ela-paragraph-structure",
    name: "Paragraph Structure",
    subject: ["ELA"],
    domain: "ELA",
    difficulty: "intermediate",
    tags: ["topic sentence", "body", "concluding sentence", "unity", "coherence"],
  },
];

export function getSkillById(id: string): Skill | undefined {
  return SKILLS.find((s) => s.id === id);
}

export function getSkillsBySubject(subject: Subject): Skill[] {
  return SKILLS.filter((s) => s.subject.includes(subject));
}

export function getSkillsByDomain(domain: Skill["domain"]): Skill[] {
  return SKILLS.filter((s) => s.domain === domain);
}
