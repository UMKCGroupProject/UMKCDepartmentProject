-- GTA Portal schema.
--
-- Mounted into /docker-entrypoint-initdb.d, so MySQL runs it once on a fresh
-- volume. Files in that directory execute in filename order: schema, then seed.

CREATE DATABASE IF NOT EXISTS gta_portal
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE gta_portal;

-- One row per person who can log in. The bcrypt hash lives here and is never
-- selected into an API response; role is set server-side, never by the client.
CREATE TABLE users (
    id             INT UNSIGNED NOT NULL AUTO_INCREMENT,
    umkc_id        CHAR(8)      NOT NULL,
    email          VARCHAR(255) NOT NULL,
    password_hash  CHAR(60)     NOT NULL,
    role           ENUM('student', 'admin') NOT NULL DEFAULT 'student',
    first_name     VARCHAR(50)  NOT NULL,
    last_name      VARCHAR(50)  NOT NULL,
    created_at     DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    last_login_at  DATETIME     NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_users_umkc_id (umkc_id),
    UNIQUE KEY uq_users_email (email)
) ENGINE = InnoDB;

-- Student-only profile fields, split out so admin accounts don't carry unused
-- columns. Shares users.id as its primary key (one-to-one).
CREATE TABLE students (
    user_id     INT UNSIGNED NOT NULL,
    contact_no  VARCHAR(20)  NULL,
    certified   BOOLEAN      NOT NULL DEFAULT FALSE,
    PRIMARY KEY (user_id),
    CONSTRAINT fk_students_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB;

CREATE TABLE courses (
    id           INT UNSIGNED NOT NULL AUTO_INCREMENT,
    course_no    VARCHAR(10)  NOT NULL,
    course_name  VARCHAR(120) NOT NULL,
    section      VARCHAR(30)  NOT NULL,
    days         VARCHAR(20)  NOT NULL,
    times        VARCHAR(20)  NOT NULL,
    modality     VARCHAR(25)  NOT NULL,
    room         VARCHAR(30)  NULL,
    instructor   VARCHAR(80)  NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uq_courses_no_section (course_no, section),
    KEY idx_courses_course_no (course_no)
) ENGINE = InnoDB;

-- A student's application to assist with one course. Name and email are read
-- from users at query time rather than duplicated here.
CREATE TABLE applications (
    id                 INT UNSIGNED  NOT NULL AUTO_INCREMENT,
    user_id            INT UNSIGNED  NOT NULL,
    course_id          INT UNSIGNED  NOT NULL,
    gpa                DECIMAL(3, 2) NOT NULL,
    hrs_completed      SMALLINT UNSIGNED NOT NULL,
    curr_level         ENUM('freshman', 'sophomore', 'junior', 'senior', 'graduate') NOT NULL,
    grad_semester      VARCHAR(15)   NOT NULL,
    degree             VARCHAR(30)   NOT NULL,
    curr_major         VARCHAR(50)   NOT NULL,
    position           ENUM('grader', 'lab instructor', 'both') NOT NULL,
    certification_term VARCHAR(15)   NULL,
    prev_degree        BOOLEAN       NOT NULL DEFAULT FALSE,
    status             ENUM('pending', 'accepted', 'rejected') NOT NULL DEFAULT 'pending',
    applied_at         DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    -- A student applies to a given course at most once.
    UNIQUE KEY uq_applications_user_course (user_id, course_id),
    -- Covers the admin dashboard's "applicants for course X, best GPA first".
    KEY idx_applications_course_gpa (course_id, gpa),
    CONSTRAINT fk_applications_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_applications_course
        FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE = InnoDB;

-- Courses a student has already completed, with the grade earned. Lets an
-- admin see how an applicant did in the course they want to assist with.
CREATE TABLE student_courses (
    user_id    INT UNSIGNED NOT NULL,
    course_id  INT UNSIGNED NOT NULL,
    grade      CHAR(2)      NOT NULL,
    PRIMARY KEY (user_id, course_id),
    KEY idx_student_courses_course (course_id),
    CONSTRAINT fk_student_courses_user
        FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT fk_student_courses_course
        FOREIGN KEY (course_id) REFERENCES courses (id) ON DELETE CASCADE
) ENGINE = InnoDB;
