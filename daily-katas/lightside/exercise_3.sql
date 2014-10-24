DROP TABLE IF EXISTS class_enrollment;
DROP TABLE IF EXISTS student;
DROP TABLE IF EXISTS classroom;

CREATE TABLE student (
  id         INT NOT NULL,
  first_name VARCHAR(75),
  last_name  VARCHAR(75),
  ssn        VARCHAR(15),
  PRIMARY KEY(id)
);

CREATE TABLE classroom (
  id         INT NOT NULL,
  class_name VARCHAR(75), 
  school     VARCHAR(75),
  period     VARCHAR(12),
  PRIMARY KEY(id)
);

CREATE TABLE class_enrollment (
  classroom_id INT NOT NULL references classroom(id),
  student_id   INT NOT NULL references student(id),
  PRIMARY KEY(classroom_id, student_id)
);

INSERT INTO student VALUES (1, 'Clark', 'Kent', '123-45-6789');
INSERT INTO student VALUES (2, 'Diana', 'Prince', '234-56-7890');
INSERT INTO student VALUES (3, 'John', 'Henry', '456-78-9012');
INSERT INTO student VALUES (4, 'John', 'Henry', '567-89-0123');
INSERT INTO student VALUES (5, 'John', 'Henry', '678-90-1234');

INSERT INTO classroom VALUES (1, '6th Grade - Algebra', 'Mellon Middle', '1st');
INSERT INTO classroom VALUES (2, '6th Grade - History', 'Mellon Middle', '2nd');
INSERT INTO classroom VALUES (3, '7th Grade - English', 'Phillips Middle School', '1st');
INSERT INTO classroom VALUES (4, '7th Grade - Geometry', 'Phillips Middle School', '2nd');

INSERT INTO class_enrollment VALUES(1, 1);
INSERT INTO class_enrollment VALUES(2, 1);
INSERT INTO class_enrollment VALUES(1, 2);
INSERT INTO class_enrollment VALUES(2, 2);
INSERT INTO class_enrollment VALUES(3, 3);
INSERT INTO class_enrollment VALUES(4, 3);
INSERT INTO class_enrollment VALUES(3, 4);
INSERT INTO class_enrollment VALUES(4, 4);
INSERT INTO class_enrollment VALUES(1, 5);
INSERT INTO class_enrollment VALUES(2, 5);


SELECT 
  DISTINCT s.ssn
FROM
  student s
  JOIN class_enrollment e ON e.student_id = s.id
  JOIN classroom c ON c.id = e.classroom_id
WHERE
  s.first_name = 'John'
  AND s.last_name = 'Henry'
  AND c.school = 'Phillips Middle School';

