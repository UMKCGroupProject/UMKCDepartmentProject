-- Demo data for the GTA Portal.
--
-- Everything here is invented. The original 2022 dump shipped real-looking
-- university emails, student IDs, GPAs and instructor names in a public repo;
-- none of it survives. Names, courses and instructors below are fictional and
-- all addresses use the reserved example.edu domain.
--
-- Every account's password is:  Password123!
-- The hash below is that string bcrypt'd at cost 10, reused for all accounts
-- so the README can document a one-line demo login.

USE gta_portal;

-- ---------------------------------------------------------------------------
-- Users
-- ---------------------------------------------------------------------------

INSERT INTO users (id, umkc_id, email, password_hash, role, first_name, last_name, last_login_at) VALUES
(1, '10000001', 'admin@example.edu',   '$2b$10$NEOTaHQcG2gO2TQwoLJxZOYCDOg5Ovt0vf64go9lqF5hs99v.H9.2', 'admin',   'Dana',   'Whitfield', '2026-02-10 09:15:00'),
(2, '20000001', 'avery@example.edu',   '$2b$10$NEOTaHQcG2gO2TQwoLJxZOYCDOg5Ovt0vf64go9lqF5hs99v.H9.2', 'student', 'Avery',  'Nakamura', '2026-02-09 18:40:00'),
(3, '20000002', 'blake@example.edu',   '$2b$10$NEOTaHQcG2gO2TQwoLJxZOYCDOg5Ovt0vf64go9lqF5hs99v.H9.2', 'student', 'Blake',  'Okonjo',   '2026-02-08 12:05:00'),
(4, '20000003', 'casey@example.edu',   '$2b$10$NEOTaHQcG2gO2TQwoLJxZOYCDOg5Ovt0vf64go9lqF5hs99v.H9.2', 'student', 'Casey',  'Lindqvist', '2026-02-07 20:22:00'),
(5, '20000004', 'devon@example.edu',   '$2b$10$NEOTaHQcG2gO2TQwoLJxZOYCDOg5Ovt0vf64go9lqF5hs99v.H9.2', 'student', 'Devon',  'Marchetti', '2026-02-05 08:30:00'),
(6, '20000005', 'emery@example.edu',   '$2b$10$NEOTaHQcG2gO2TQwoLJxZOYCDOg5Ovt0vf64go9lqF5hs99v.H9.2', 'student', 'Emery',  'Sandoval', '2026-02-04 16:10:00'),
(7, '20000006', 'finley@example.edu',  '$2b$10$NEOTaHQcG2gO2TQwoLJxZOYCDOg5Ovt0vf64go9lqF5hs99v.H9.2', 'student', 'Finley', 'Abara',    '2026-01-30 11:55:00'),
(8, '20000007', 'harper@example.edu',  '$2b$10$NEOTaHQcG2gO2TQwoLJxZOYCDOg5Ovt0vf64go9lqF5hs99v.H9.2', 'student', 'Harper', 'Voss',     '2026-01-28 14:05:00'),
(9, '20000008', 'jordan@example.edu',  '$2b$10$NEOTaHQcG2gO2TQwoLJxZOYCDOg5Ovt0vf64go9lqF5hs99v.H9.2', 'student', 'Jordan', 'Petrakis', NULL);

-- The admin (user 1) deliberately has no students row.
INSERT INTO students (user_id, contact_no, certified) VALUES
(2, '555-0101', TRUE),
(3, '555-0102', FALSE),
(4, '555-0103', TRUE),
(5, '555-0104', FALSE),
(6, '555-0105', TRUE),
(7, '555-0106', FALSE),
(8, '555-0107', TRUE),
(9, '555-0108', FALSE);

-- ---------------------------------------------------------------------------
-- Courses
-- ---------------------------------------------------------------------------

INSERT INTO courses (id, course_no, course_name, section, days, times, modality, room, instructor) VALUES
(1, 'CS101',  'Problem Solving and Programming I',      '0001-LEC', 'MoWeFr',       '1:00PM - 1:50PM',   'In-Person', 'Fairview Hall-Rm 102', 'Dr. Marion Hale'),
(2, 'CS101L', 'Problem Solving and Programming I Lab',  '001L-LAB', 'Tu',           '8:30AM - 11:00AM',  'Online',    NULL,                   'Dr. Marion Hale'),
(3, 'CS191',  'Discrete Structures I',                  '0001-LEC', 'MoWeFr',       '10:00AM - 10:50AM', 'In-Person', 'Fairview Hall-Rm 313', 'Dr. Priya Raghavan'),
(4, 'CS303',  'Data Structures',                        '0002-LEC', 'TuTh',         '4:00PM - 5:15PM',   'In-Person', 'Weston Hall-Rm 118',   'Dr. Ibrahim Oyelaran'),
(5, 'CS404',  'Introduction to Algorithms',             '0001-LEC', 'TuTh',         '11:30AM - 12:45PM', 'In-Person', 'Weston Hall-Rm 119',   'Dr. Priya Raghavan'),
(6, 'CS470',  'Introduction to Database Systems',       '0001-LEC', 'Asynchronous', 'Asynchronous',      'Online',    NULL,                   'Dr. Lena Christoff');

-- ---------------------------------------------------------------------------
-- Applications
--
-- Spread across courses and statuses so the admin dashboard has something
-- meaningful to sort and filter.
-- ---------------------------------------------------------------------------

INSERT INTO applications
    (user_id, course_id, gpa, hrs_completed, curr_level, grad_semester, degree, curr_major, position, certification_term, prev_degree, status, applied_at) VALUES
(2, 1, 3.90, 120, 'senior',    'Spring 2026', "Associate's", 'Computer Science',    'both',           'Fall 2024', TRUE,  'accepted', '2026-01-12 09:04:00'),
(2, 4, 3.90, 120, 'senior',    'Spring 2026', "Associate's", 'Computer Science',    'grader',         'Fall 2024', TRUE,  'pending',  '2026-01-12 09:11:00'),
(3, 1, 3.42,  98, 'junior',    'Fall 2026',   'None',        'Computer Science',    'grader',         NULL,        FALSE, 'pending',  '2026-01-13 15:30:00'),
(4, 1, 3.75, 132, 'senior',    'Spring 2026', 'None',        'Software Engineering', 'lab instructor', 'Spring 2025', FALSE, 'accepted', '2026-01-13 17:02:00'),
(4, 5, 3.75, 132, 'senior',    'Spring 2026', 'None',        'Software Engineering', 'both',           'Spring 2025', FALSE, 'pending',  '2026-01-14 08:20:00'),
(5, 2, 2.95,  64, 'sophomore', 'Spring 2028', 'None',        'Computer Science',    'grader',         NULL,        FALSE, 'rejected', '2026-01-14 10:47:00'),
(6, 3, 3.60, 105, 'junior',    'Fall 2026',   'None',        'Mathematics',         'lab instructor', 'Fall 2025', FALSE, 'pending',  '2026-01-15 11:15:00'),
(6, 6, 3.60, 105, 'junior',    'Fall 2026',   'None',        'Mathematics',         'grader',         'Fall 2025', FALSE, 'accepted', '2026-01-15 11:22:00'),
(7, 4, 4.00, 141, 'senior',    'Spring 2026', "Bachelor's",  'Computer Science',    'both',           'Fall 2024', TRUE,  'pending',  '2026-01-16 13:38:00'),
(7, 5, 4.00, 141, 'senior',    'Spring 2026', "Bachelor's",  'Computer Science',    'grader',         'Fall 2024', TRUE,  'pending',  '2026-01-16 13:44:00'),
(8, 6, 3.18,  87, 'junior',    'Fall 2027',   'None',        'Information Systems', 'grader',         NULL,        FALSE, 'pending',  '2026-01-18 19:01:00'),
(9, 2, 3.05,  30, 'freshman',  'Spring 2029', 'None',        'Computer Science',    'grader',         NULL,        FALSE, 'rejected', '2026-01-20 07:52:00');

-- ---------------------------------------------------------------------------
-- Completed coursework
-- ---------------------------------------------------------------------------

INSERT INTO student_courses (user_id, course_id, grade) VALUES
(2, 1, 'A'),  (2, 2, 'A'),  (2, 3, 'A'),  (2, 4, 'A-'), (2, 5, 'B+'),
(3, 1, 'B'),  (3, 2, 'B+'), (3, 3, 'B'),
(4, 1, 'A'),  (4, 2, 'A-'), (4, 3, 'A'),  (4, 4, 'B+'), (4, 5, 'A'),
(5, 1, 'C+'), (5, 2, 'B-'),
(6, 1, 'A-'), (6, 3, 'A'),  (6, 6, 'B+'),
(7, 1, 'A'),  (7, 2, 'A'),  (7, 3, 'A'),  (7, 4, 'A'),  (7, 5, 'A'), (7, 6, 'A'),
(8, 1, 'B'),  (8, 3, 'C+'), (8, 6, 'B-'),
(9, 1, 'B+');
