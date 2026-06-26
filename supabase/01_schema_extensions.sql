-- ============================================================
-- EDGE Education Group — SSS Pipeline Schema Extensions
-- Adds course-level and standards-level tables above the
-- existing student-facing pathways/SSS tables.
-- Run this BEFORE 02_seed_algebra_cc.sql
-- ============================================================

-- ------------------------------------------------------------
-- courses
-- Top-level course registry. One row per state-course.
-- Architected for multi-state expansion from day one.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS courses (
  id                  uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name                text NOT NULL,               -- "Algebra: Concepts & Connections"
  short_name          text,                         -- "Algebra: C&C"
  state               text NOT NULL DEFAULT 'GA',  -- ISO state code — expansion-ready
  grade_band          text,                         -- "High School" | "Middle School"
  replaces            text,                         -- "Algebra 1 / Coordinate Algebra (GSE)"
  standards_version   text,                         -- "GA K-12 Math Standards 2023"
  implementation_year text,                         -- "Fall 2023"
  source_url          text,
  active              bool DEFAULT true,
  created_at          timestamptz DEFAULT now()
);

-- ------------------------------------------------------------
-- course_units
-- The 9 units (+ embedded MM) within a course, in sequence.
-- This is the curriculum framework layer — not student-facing.
-- Claude references this table when generating SSS content.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS course_units (
  id                      uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id               uuid REFERENCES courses(id) ON DELETE CASCADE,
  unit_number             int2 NOT NULL,            -- 0 = embedded MM, 1–9 = units
  title                   text NOT NULL,
  semester                text,                     -- "S1" | "S2" | "Both"
  big_ideas               text,                     -- domain labels from GaDOE map
  description             text,                     -- GaDOE unit summary paragraph
  pacing_traditional_min  int2,                     -- weeks
  pacing_traditional_max  int2,
  pacing_block_min        int2,                     -- days
  pacing_block_max        int2,
  is_embedded             bool DEFAULT false,       -- true for MM unit
  is_capstone             bool DEFAULT false,       -- true for Unit 9
  sequence_order          int2 NOT NULL,            -- for ordering queries
  created_at              timestamptz DEFAULT now(),
  UNIQUE (course_id, unit_number)
);

-- ------------------------------------------------------------
-- standards
-- Individual standard codes within a unit.
-- A unit can have multiple primary standards (e.g., Unit 4
-- has both A.PAR.6 and A.FGR.7).
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS standards (
  id                   uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  course_id            uuid REFERENCES courses(id) ON DELETE CASCADE,
  unit_id              uuid REFERENCES course_units(id) ON DELETE CASCADE,
  code                 text NOT NULL,               -- "A.FGR.2"
  domain               text NOT NULL,               -- "FGR" | "PAR" | "NR" | "GSR" | "DSR" | "MM" | "MP"
  full_description     text NOT NULL,
  is_primary           bool DEFAULT true,           -- false for MM/MP which appear in every unit
  is_embedded          bool DEFAULT false,          -- true for A.MM.1 and A.MP.1-8
  created_at           timestamptz DEFAULT now(),
  UNIQUE (course_id, unit_id, code)
);

-- ------------------------------------------------------------
-- learning_objectives
-- Sub-standards (A.FGR.2.1, A.FGR.2.2 …) — the atomic
-- teaching targets Claude builds KSG content around.
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS learning_objectives (
  id             uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  standard_id    uuid REFERENCES standards(id) ON DELETE CASCADE,
  unit_id        uuid REFERENCES course_units(id) ON DELETE CASCADE,
  code           text NOT NULL,                     -- "A.FGR.2.1"
  description    text NOT NULL,
  sequence_order int2 NOT NULL,
  created_at     timestamptz DEFAULT now(),
  UNIQUE (standard_id, code)
);

-- ------------------------------------------------------------
-- Indexes for common query patterns
-- ------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_course_units_course    ON course_units(course_id, sequence_order);
CREATE INDEX IF NOT EXISTS idx_standards_unit         ON standards(unit_id);
CREATE INDEX IF NOT EXISTS idx_standards_course       ON standards(course_id);
CREATE INDEX IF NOT EXISTS idx_learning_obj_standard  ON learning_objectives(standard_id, sequence_order);

-- NOTE: pathways table extensions (course_id, unit_id columns) are in
-- 03_sss_schema.sql — run that after the full SSS schema is created.
