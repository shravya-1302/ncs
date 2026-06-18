INSERT IGNORE INTO programs 
(id, title, slug, description, domain, level, price, duration_days)
VALUES
(1, 'Python Foundation Program', 'python-foundation', 'Learn Python from basics with a mini project.', 'CSE', 'Beginner', 799, 30),
(2, 'Web Development Foundation', 'web-development-foundation', 'Learn HTML, CSS, JavaScript and React basics.', 'CSE', 'Beginner', 799, 30),
(3, 'Cloud Career Track', 'cloud-career-track', 'AWS, Google Cloud and Azure career preparation program.', 'Cloud', 'Advanced', 30000, 90);

INSERT IGNORE INTO course_modules 
(id, program_id, title, sort_order)
VALUES
(1, 1, 'Python Basics', 1),
(2, 1, 'Control Flow and Functions', 2),
(3, 1, 'Mini Project', 3),
(4, 2, 'HTML and CSS Basics', 1),
(5, 2, 'JavaScript Basics', 2),
(6, 2, 'React Introduction', 3),
(7, 3, 'AWS Basics', 1),
(8, 3, 'Google Cloud Basics', 2),
(9, 3, 'Azure Basics', 3);

INSERT IGNORE INTO lessons 
(id, module_id, title, video_url, notes_url, content, sort_order)
VALUES
(1, 1, 'Introduction to Python', NULL, NULL, 'Learn what Python is and why it is used.', 1),
(2, 1, 'Variables and Data Types', NULL, NULL, 'Learn variables, strings, numbers and booleans.', 2),
(3, 2, 'If Else Conditions', NULL, NULL, 'Learn decision making in Python.', 1),
(4, 2, 'Functions in Python', NULL, NULL, 'Learn how to write reusable functions.', 2),
(5, 3, 'Build a Simple Calculator', NULL, NULL, 'Mini project using Python basics.', 1),

(6, 4, 'HTML Structure', NULL, NULL, 'Learn basic HTML page structure.', 1),
(7, 4, 'CSS Styling', NULL, NULL, 'Learn colors, spacing, and layout.', 2),
(8, 5, 'JavaScript Variables', NULL, NULL, 'Learn JavaScript variables and data types.', 1),
(9, 5, 'JavaScript Functions', NULL, NULL, 'Learn functions in JavaScript.', 2),
(10, 6, 'React Components', NULL, NULL, 'Learn components and props in React.', 1),

(11, 7, 'What is Cloud Computing?', NULL, NULL, 'Understand cloud computing basics.', 1),
(12, 7, 'AWS Core Services', NULL, NULL, 'Intro to EC2, S3, RDS and IAM.', 2),
(13, 8, 'Google Cloud Overview', NULL, NULL, 'Intro to Google Cloud services.', 1),
(14, 9, 'Azure Overview', NULL, NULL, 'Intro to Microsoft Azure services.', 1);