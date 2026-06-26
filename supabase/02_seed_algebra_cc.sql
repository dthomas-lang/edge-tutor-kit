-- ============================================================
-- EDGE Education Group — Algebra: Concepts & Connections
-- Complete curriculum seed data from GaDOE curriculum map
-- Source: Georgia K-12 Mathematics Standards, May 2023
-- UUID scheme: 00000000-0000-0000-{type}-{sequence}
--   type 0000 = course | 0001 = unit | 0002 = standard | 0003 = objective
-- ============================================================

BEGIN;

-- ------------------------------------------------------------
-- 1. COURSE
-- ------------------------------------------------------------
INSERT INTO courses (
  id, name, short_name, state, grade_band,
  replaces, standards_version, implementation_year, source_url
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Algebra: Concepts & Connections',
  'Algebra: C&C',
  'GA',
  'High School',
  'Algebra 1 / Coordinate Algebra (GSE)',
  'Georgia K-12 Mathematics Standards 2023',
  'Fall 2023',
  'https://lor2.gadoe.org/gadoe/file/15f985b2-aeb1-4fc1-ad01-4656611b3bcb/1/HS-Algebra-Mathematics-Curriculum-Map.pdf'
);

-- ------------------------------------------------------------
-- 2. COURSE UNITS
-- ------------------------------------------------------------
INSERT INTO course_units (
  id, course_id, unit_number, title, semester,
  big_ideas, description,
  pacing_traditional_min, pacing_traditional_max,
  pacing_block_min, pacing_block_max,
  is_embedded, is_capstone, sequence_order
) VALUES

('00000000-0000-0000-0001-000000000000',
 '00000000-0000-0000-0000-000000000001',
 0, 'Mathematical Modeling', 'Both',
 'Mathematical Modeling',
 'When students model with mathematics, they develop a more engaging and deeper understanding of the world around them. Students who engage in mathematical modeling will not only be prepared for their chosen career but will also learn to make informed life decisions based on data and the models they create. The modeling unit is embedded throughout the course.',
 NULL, NULL, NULL, NULL, true, false, 0),

('00000000-0000-0000-0001-000000000001',
 '00000000-0000-0000-0000-000000000001',
 1, 'Modeling Linear Functions', 'S1',
 'Functional & Graphical Reasoning, Mathematical Modeling',
 'Students will construct and interpret arithmetic sequences as functions, algebraically and graphically, to model and explain real-life phenomena. They will use formal notation to represent linear functions and the key characteristics of graphs of linear functions, and informally compare linear and non-linear functions using parent graphs.',
 3, 4, 9, 12, false, false, 1),

('00000000-0000-0000-0001-000000000002',
 '00000000-0000-0000-0000-000000000001',
 2, 'Analyzing Linear Inequalities', 'S1',
 'Patterning & Algebraic Reasoning, Mathematical Modeling',
 'Students will create, analyze, and solve linear inequalities in two variables and systems of linear inequalities to model real-life phenomena.',
 1, 2, 3, 6, false, false, 2),

('00000000-0000-0000-0001-000000000003',
 '00000000-0000-0000-0000-000000000001',
 3, 'Investigating Rational and Irrational Numbers', 'S1',
 'Numerical Reasoning, Mathematical Modeling',
 'Students will investigate rational and irrational numbers and rewrite expressions involving square roots and cube roots. They should be able to use the operations of addition, subtraction, and multiplication, with radicals within expressions limited to square roots and cube roots.',
 1, 2, 3, 6, false, false, 3),

('00000000-0000-0000-0001-000000000004',
 '00000000-0000-0000-0000-000000000001',
 4, 'Modeling and Analyzing Quadratic Functions', 'S1',
 'Patterning & Algebraic Reasoning, Functional & Graphical Reasoning, Mathematical Modeling',
 'Students will analyze quadratic functions. Students will (1) investigate key features of graphs; (2) solve quadratic equations by taking square roots, factoring (x² + bx + c AND ax² + bx + c), completing the square, and using the quadratic formula; (3) compare and contrast graphs in standard, vertex, and intercept forms. Students will only work with real number solutions.',
 6, 7, 18, 21, false, false, 4),

('00000000-0000-0000-0001-000000000005',
 '00000000-0000-0000-0000-000000000001',
 5, 'Modeling and Analyzing Exponential Expressions and Equations', 'S2',
 'Patterning & Algebraic Reasoning, Mathematical Modeling',
 'Students will interpret exponential expressions, one variable exponential equations in context, and understand parameters of two variable exponential equations.',
 2, 3, 6, 9, false, false, 5),

('00000000-0000-0000-0001-000000000006',
 '00000000-0000-0000-0000-000000000001',
 6, 'Analyzing Exponential Functions', 'S2',
 'Functional & Graphical Reasoning, Mathematical Modeling',
 'Students will construct and analyze the graph of an exponential function to explain a contextual situation for which the graph serves as a model; compare exponential with linear and quadratic functions.',
 4, 5, 12, 15, false, false, 6),

('00000000-0000-0000-0001-000000000007',
 '00000000-0000-0000-0000-000000000001',
 7, 'Investigating Data', 'S2',
 'Data & Statistical Reasoning, Mathematical Modeling',
 'Students will collect, analyze, and interpret univariate quantitative data to answer statistical investigative questions that compare groups to solve real-life problems. Students will represent bivariate data on a scatter plot and fit a function to the data to answer statistical questions and solve real-life problems.',
 3, 4, 9, 12, false, false, 7),

('00000000-0000-0000-0001-000000000008',
 '00000000-0000-0000-0000-000000000001',
 8, 'Algebraic Connections to Geometric Concepts', 'S2',
 'Geometric & Spatial Reasoning, Mathematical Modeling',
 'Students will solve problems involving distance, midpoint, slope, area, and perimeter to model and explain real-life phenomena.',
 2, 3, 6, 9, false, false, 8),

('00000000-0000-0000-0001-000000000009',
 '00000000-0000-0000-0000-000000000001',
 9, 'Culminating Capstone Unit', 'S2',
 'All Domains',
 'The capstone unit applies content that has already been learned in previous interdisciplinary PBLs and units throughout the school year. The capstone unit is an interdisciplinary unit that allows students to create a presentation, report, or demonstration that could include their models used to answer an overarching driving question.',
 1, 2, 2, 4, false, true, 9);


-- ------------------------------------------------------------
-- 3. STANDARDS
-- ------------------------------------------------------------
INSERT INTO standards (id, course_id, unit_id, code, domain, full_description, is_primary, is_embedded) VALUES

('00000000-0000-0000-0002-000000000001',
 '00000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0001-000000000000',
 'A.MM.1', 'MM',
 'Apply mathematics to real-life situations; model real-life phenomena using mathematics.',
 true, true),

('00000000-0000-0000-0002-000000000002',
 '00000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0001-000000000001',
 'A.FGR.2', 'FGR',
 'Construct and interpret arithmetic sequences as functions, algebraically and graphically, to model and explain real-life phenomena. Use formal notation to represent linear functions and the key characteristics of graphs of linear functions, and informally compare linear and non-linear functions using parent graphs.',
 true, false),

('00000000-0000-0000-0002-000000000003',
 '00000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0001-000000000002',
 'A.PAR.4', 'PAR',
 'Create, analyze, and solve linear inequalities in two variables and systems of linear inequalities to model real-life phenomena.',
 true, false),

('00000000-0000-0000-0002-000000000004',
 '00000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0001-000000000003',
 'A.NR.5', 'NR',
 'Investigate rational and irrational numbers and rewrite expressions involving square roots and cube roots.',
 true, false),

('00000000-0000-0000-0002-000000000005',
 '00000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0001-000000000004',
 'A.PAR.6', 'PAR',
 'Build quadratic expressions and equations to represent and model real-life phenomena; solve quadratic equations in contextual situations.',
 true, false),

('00000000-0000-0000-0002-000000000006',
 '00000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0001-000000000004',
 'A.FGR.7', 'FGR',
 'Construct and interpret quadratic functions from data points to model and explain real-life phenomena; describe key characteristics of the graph of a quadratic function to explain a contextual situation for which the graph serves as a model.',
 true, false),

('00000000-0000-0000-0002-000000000007',
 '00000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0001-000000000005',
 'A.PAR.8', 'PAR',
 'Create and analyze exponential expressions and equations to represent and model real-life phenomena; solve exponential equations in mathematically applicable situations.',
 true, false),

('00000000-0000-0000-0002-000000000008',
 '00000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0001-000000000006',
 'A.FGR.9', 'FGR',
 'Construct and analyze the graph of an exponential function to explain a mathematically applicable situation for which the graph serves as a model; compare exponential with linear and quadratic functions.',
 true, false),

('00000000-0000-0000-0002-000000000009',
 '00000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0001-000000000007',
 'A.DSR.10', 'DSR',
 'Collect, analyze, and interpret univariate quantitative data to answer statistical investigative questions that compare groups to solve real-life problems; Represent bivariate data on a scatter plot and fit a function to the data to answer statistical questions and solve real-life problems.',
 true, false),

('00000000-0000-0000-0002-00000000000a',
 '00000000-0000-0000-0000-000000000001',
 '00000000-0000-0000-0001-000000000008',
 'A.GSR.3', 'GSR',
 'Solve problems involving distance, midpoint, slope, area, and perimeter to model and explain real-life phenomena.',
 true, false);


-- ------------------------------------------------------------
-- 4. LEARNING OBJECTIVES (46 total)
-- ------------------------------------------------------------
INSERT INTO learning_objectives (id, standard_id, unit_id, code, description, sequence_order) VALUES

-- A.MM.1 (5 objectives)
('00000000-0000-0000-0003-000000000001','00000000-0000-0000-0002-000000000001','00000000-0000-0000-0001-000000000000',
 'A.MM.1.1','Explain applicable, mathematical problems using a mathematical model.',1),
('00000000-0000-0000-0003-000000000002','00000000-0000-0000-0002-000000000001','00000000-0000-0000-0001-000000000000',
 'A.MM.1.2','Create mathematical models to explain phenomena that exist in the natural sciences, social sciences, liberal arts, fine and performing arts, and/or humanities domains.',2),
('00000000-0000-0000-0003-000000000003','00000000-0000-0000-0002-000000000001','00000000-0000-0000-0001-000000000000',
 'A.MM.1.3','Use units of measure (linear, area, capacity, rates, and time) as a way to make sense of conceptual problems; identify, use, and record appropriate units of measure within context, within data displays, and on graphs; convert units and rates using proportional reasoning given a conversion factor; use units within multi-step problems and formulas; interpret units of input and resulting units of output.',3),
('00000000-0000-0000-0003-000000000004','00000000-0000-0000-0002-000000000001','00000000-0000-0000-0001-000000000000',
 'A.MM.1.4','Use various mathematical representations and structures with this information to represent and solve real-life problems.',4),
('00000000-0000-0000-0003-000000000005','00000000-0000-0000-0002-000000000001','00000000-0000-0000-0001-000000000000',
 'A.MM.1.5','Define appropriate quantities for the purpose of descriptive modeling.',5),

-- A.FGR.2 — Unit 1 (5 objectives)
('00000000-0000-0000-0003-000000000006','00000000-0000-0000-0002-000000000002','00000000-0000-0000-0001-000000000001',
 'A.FGR.2.1','Use mathematically applicable situations algebraically and graphically to build and interpret arithmetic sequences as functions whose domain is a subset of the integers.',1),
('00000000-0000-0000-0003-000000000007','00000000-0000-0000-0002-000000000002','00000000-0000-0000-0001-000000000001',
 'A.FGR.2.2','Construct and interpret the graph of a linear function that models real-life phenomena and represent key characteristics of the graph using formal notation.',2),
('00000000-0000-0000-0003-000000000008','00000000-0000-0000-0002-000000000002','00000000-0000-0000-0001-000000000001',
 'A.FGR.2.3','Relate the domain and range of a linear function to its graph and, where applicable, to the quantitative relationship it describes. Use formal interval and set notation to describe the domain and range of linear functions.',3),
('00000000-0000-0000-0003-000000000009','00000000-0000-0000-0002-000000000002','00000000-0000-0000-0001-000000000001',
 'A.FGR.2.4','Use function notation to build and evaluate linear functions for inputs in their domains and interpret statements that use function notation in terms of a mathematical framework.',4),
('00000000-0000-0000-0003-00000000000a','00000000-0000-0000-0002-000000000002','00000000-0000-0000-0001-000000000001',
 'A.FGR.2.5','Analyze the difference between linear functions and nonlinear functions by informally analyzing the graphs of various parent functions (linear, quadratic, exponential, absolute value, square root, and cube root parent curves).',5),

-- A.PAR.4 — Unit 2 (3 objectives)
('00000000-0000-0000-0003-00000000000b','00000000-0000-0000-0002-000000000003','00000000-0000-0000-0001-000000000002',
 'A.PAR.4.1','Create and solve linear inequalities in two variables to represent relationships between quantities including mathematically applicable situations; graph inequalities on coordinate axes with labels and scales.',1),
('00000000-0000-0000-0003-00000000000c','00000000-0000-0000-0002-000000000003','00000000-0000-0000-0001-000000000002',
 'A.PAR.4.2','Represent constraints of linear inequalities and interpret data points as possible or not possible.',2),
('00000000-0000-0000-0003-00000000000d','00000000-0000-0000-0002-000000000003','00000000-0000-0000-0001-000000000002',
 'A.PAR.4.3','Solve systems of linear inequalities by graphing, including systems representing a mathematically applicable situation.',3),

-- A.NR.5 — Unit 3 (2 objectives)
('00000000-0000-0000-0003-00000000000e','00000000-0000-0000-0002-000000000004','00000000-0000-0000-0001-000000000003',
 'A.NR.5.1','Rewrite algebraic and numeric expressions involving radicals.',1),
('00000000-0000-0000-0003-00000000000f','00000000-0000-0000-0002-000000000004','00000000-0000-0000-0001-000000000003',
 'A.NR.5.2','Using numerical reasoning, show and explain that the sum or product of rational numbers is rational, the sum of a rational number and an irrational number is irrational, and the product of a nonzero rational number and an irrational number is irrational.',2),

-- A.PAR.6 — Unit 4 (4 objectives)
('00000000-0000-0000-0003-000000000010','00000000-0000-0000-0002-000000000005','00000000-0000-0000-0001-000000000004',
 'A.PAR.6.1','Interpret quadratic expressions and parts of a quadratic expression that represent a quantity in terms of its context.',1),
('00000000-0000-0000-0003-000000000011','00000000-0000-0000-0002-000000000005','00000000-0000-0000-0001-000000000004',
 'A.PAR.6.2','Fluently choose and produce an equivalent form of a quadratic expression to reveal and explain properties of the quantity represented by the expression.',2),
('00000000-0000-0000-0003-000000000012','00000000-0000-0000-0002-000000000005','00000000-0000-0000-0001-000000000004',
 'A.PAR.6.3','Create and solve quadratic equations in one variable and explain the solution in the framework of applicable phenomena.',3),
('00000000-0000-0000-0003-000000000013','00000000-0000-0000-0002-000000000005','00000000-0000-0000-0001-000000000004',
 'A.PAR.6.4','Represent constraints by quadratic equations and interpret data points as possible or not possible in a modeling framework.',4),

-- A.FGR.7 — Unit 4 (9 objectives)
('00000000-0000-0000-0003-000000000014','00000000-0000-0000-0002-000000000006','00000000-0000-0000-0001-000000000004',
 'A.FGR.7.1','Use function notation to build and evaluate quadratic functions for inputs in their domains and interpret statements that use function notation in terms of a given framework.',1),
('00000000-0000-0000-0003-000000000015','00000000-0000-0000-0002-000000000006','00000000-0000-0000-0001-000000000004',
 'A.FGR.7.2','Identify the effect on the graph generated by a quadratic function when replacing f(x) with f(x) + k, kf(x), f(kx), and f(x + k) for specific values of k (both positive and negative); find the value of k given the graphs.',2),
('00000000-0000-0000-0003-000000000016','00000000-0000-0000-0002-000000000006','00000000-0000-0000-0001-000000000004',
 'A.FGR.7.3','Graph and analyze the key characteristics of quadratic functions including contextual situations.',3),
('00000000-0000-0000-0003-000000000017','00000000-0000-0000-0002-000000000006','00000000-0000-0000-0001-000000000004',
 'A.FGR.7.4','Relate the domain and range of a quadratic function to its graph and, where applicable, to the quantitative relationship it describes.',4),
('00000000-0000-0000-0003-000000000018','00000000-0000-0000-0002-000000000006','00000000-0000-0000-0001-000000000004',
 'A.FGR.7.5','Rewrite a quadratic function representing a mathematically applicable situation to reveal the maximum or minimum value of the function it defines. Explain what the value describes in context.',5),
('00000000-0000-0000-0003-000000000019','00000000-0000-0000-0002-000000000006','00000000-0000-0000-0001-000000000004',
 'A.FGR.7.6','Create quadratic functions in two variables to represent relationships between quantities; graph quadratic functions on the coordinate axes with labels and scales.',6),
('00000000-0000-0000-0003-00000000001a','00000000-0000-0000-0002-000000000006','00000000-0000-0000-0001-000000000004',
 'A.FGR.7.7','Estimate, calculate, and interpret the average rate of change of a quadratic function and make comparisons to the average rate of change of linear functions.',7),
('00000000-0000-0000-0003-00000000001b','00000000-0000-0000-0002-000000000006','00000000-0000-0000-0001-000000000004',
 'A.FGR.7.8','Write a function defined by a quadratic expression in different but equivalent forms to reveal and explain different properties of the function.',8),
('00000000-0000-0000-0003-00000000001c','00000000-0000-0000-0002-000000000006','00000000-0000-0000-0001-000000000004',
 'A.FGR.7.9','Compare characteristics of two functions each represented in a different way.',9),

-- A.PAR.8 — Unit 5 (4 objectives)
('00000000-0000-0000-0003-00000000001d','00000000-0000-0000-0002-000000000007','00000000-0000-0000-0001-000000000005',
 'A.PAR.8.1','Interpret exponential expressions and parts of an exponential expression that represent a quantity in terms of its framework.',1),
('00000000-0000-0000-0003-00000000001e','00000000-0000-0000-0002-000000000007','00000000-0000-0000-0001-000000000005',
 'A.PAR.8.2','Create exponential equations in one variable and use them to solve problems, including mathematically applicable situations.',2),
('00000000-0000-0000-0003-00000000001f','00000000-0000-0000-0002-000000000007','00000000-0000-0000-0001-000000000005',
 'A.PAR.8.3','Create exponential equations in two variables to represent relationships between quantities, including in mathematically applicable situations; graph equations on coordinate axes with labels and scales.',3),
('00000000-0000-0000-0003-000000000020','00000000-0000-0000-0002-000000000007','00000000-0000-0000-0001-000000000005',
 'A.PAR.8.4','Represent constraints by exponential equations and interpret data points as possible or not possible in a modeling environment.',4),

-- A.FGR.9 — Unit 6 (5 objectives)
('00000000-0000-0000-0003-000000000021','00000000-0000-0000-0002-000000000008','00000000-0000-0000-0001-000000000006',
 'A.FGR.9.1','Use function notation to build and evaluate exponential functions for inputs in their domains and interpret statements that use function notation in terms of a context.',1),
('00000000-0000-0000-0003-000000000022','00000000-0000-0000-0002-000000000008','00000000-0000-0000-0001-000000000006',
 'A.FGR.9.2','Graph and analyze the key characteristics of simple exponential functions based on mathematically applicable situations.',2),
('00000000-0000-0000-0003-000000000023','00000000-0000-0000-0002-000000000008','00000000-0000-0000-0001-000000000006',
 'A.FGR.9.3','Identify the effect on the graph generated by an exponential function when replacing f(x) with f(x) + k, and k f(x), for specific values of k (both positive and negative); find the value of k given the graphs.',3),
('00000000-0000-0000-0003-000000000024','00000000-0000-0000-0002-000000000008','00000000-0000-0000-0001-000000000006',
 'A.FGR.9.4','Use mathematically applicable situations algebraically and graphically to build and interpret geometric sequences as functions whose domain is a subset of the integers.',4),
('00000000-0000-0000-0003-000000000025','00000000-0000-0000-0002-000000000008','00000000-0000-0000-0001-000000000006',
 'A.FGR.9.5','Compare characteristics of two functions each represented in a different way.',5),

-- A.DSR.10 — Unit 7 (7 objectives)
('00000000-0000-0000-0003-000000000026','00000000-0000-0000-0002-000000000009','00000000-0000-0000-0001-000000000007',
 'A.DSR.10.1','Use statistics appropriate to the shape of the data distribution to compare center (median and mean) and variability (interquartile range, standard deviation) of two or more distributions by hand and using technology.',1),
('00000000-0000-0000-0003-000000000027','00000000-0000-0000-0002-000000000009','00000000-0000-0000-0001-000000000007',
 'A.DSR.10.2','Interpret differences in shape, center, and variability of the distributions in the framework, accounting for possible effects of extreme data points (outliers).',2),
('00000000-0000-0000-0003-000000000028','00000000-0000-0000-0002-000000000009','00000000-0000-0000-0001-000000000007',
 'A.DSR.10.3','Represent data on two quantitative variables on a scatter plot and describe how the variables are related.',3),
('00000000-0000-0000-0003-000000000029','00000000-0000-0000-0002-000000000009','00000000-0000-0000-0001-000000000007',
 'A.DSR.10.4','Interpret the slope (predicted rate of change) and the intercept (constant term) of a linear model in the framework of the data.',4),
('00000000-0000-0000-0003-00000000002a','00000000-0000-0000-0002-000000000009','00000000-0000-0000-0001-000000000007',
 'A.DSR.10.5','Calculate the line of best fit and interpret the correlation coefficient, r, of a linear fit using technology. Use r to describe the strength of the goodness of fit of the regression. Use the linear function to make predictions and assess how reasonable the prediction is in context.',5),
('00000000-0000-0000-0003-00000000002b','00000000-0000-0000-0002-000000000009','00000000-0000-0000-0001-000000000007',
 'A.DSR.10.6','Decide which type of function is most appropriate by observing graphed data.',6),
('00000000-0000-0000-0003-00000000002c','00000000-0000-0000-0002-000000000009','00000000-0000-0000-0001-000000000007',
 'A.DSR.10.7','Distinguish between correlation and causation.',7),

-- A.GSR.3 — Unit 8 (2 objectives)
('00000000-0000-0000-0003-00000000002d','00000000-0000-0000-0002-00000000000a','00000000-0000-0000-0001-000000000008',
 'A.GSR.3.1','Solve real-life problems involving slope, parallel lines, perpendicular lines, area, and perimeter.',1),
('00000000-0000-0000-0003-00000000002e','00000000-0000-0000-0002-00000000000a','00000000-0000-0000-0001-000000000008',
 'A.GSR.3.2','Apply the distance formula, midpoint formula, and slope of line segments to solve real-world problems.',2);

COMMIT;

-- Verify:
-- SELECT unit_number, title, semester, pacing_traditional_min, pacing_traditional_max FROM course_units ORDER BY sequence_order;
-- SELECT count(*) FROM learning_objectives;
