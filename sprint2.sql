/* 
    This is queries for sprint 2.
    Signup page, Login page, Profile page, Course page,
    adding class list, adding friends, friend's course list, etc
*/


/*
	  Signup
    Input: userPassword, unccId, lastName, firstName, email, major, minor, picture, isStudent, isInstructor
*/
INSERT INTO users(userPassword, unccId, lastName, firstName, email, major, minor, picture, isStudent, isInstructor, signupDate) 
     VALUES (userPassword, unccId, lastName, firstName, email, major, minor, picture, isStudent, isInstructor, now());

/*
	Login
    Input: email, userPassword
*/
SELECT count(*)
  FROM users
 WHERE email = 'johndoe@uncc.edu'
   AND userPassword = ''
;

/*
    Class information
*/
SELECT * FROM courses;

/*
	  Save class list for an instructor
    Input: userId, courseId, year, semester
*/
INSERT INTO instructors VALUES(userId, courseId, year, semester);

/*
	  Save class list for a student
    Input: userId, courseId, year, semester
*/
INSERT INTO classesEnrolled VALUES(userId, courseId, year, semester);

/*
	  Assign TA for a class
    Input: userId(ta id), courseId, year, semester, assignedBy(instructor id)
*/
INSERT INTO tas VALUES(userId, courseId, year, semester, assignedBy);

/* 
	  input: userId, year, semester
    output: course list of the current semester for a user
*/
SELECT c.subject, c.courseNumber, c.title
  FROM classesEnrolled e, courses c
 WHERE e.courseId = c.courseId
   AND e.userId = 4
   AND e.year = '2023'
   AND e.semester = 'fall'
;

/*
	  user information
    Input: userId
*/
SELECT * FROM users WHERE userId = 1;

/*
	  input: userId, year, semester
    output: group information that a user is in
*/
SELECT g.groupName, g.description,
	   c.subject, c.courseNumber, c.title
  FROM groups g, groupMembers gm, courses c
 WHERE g.groupId = gm.groupId
   AND g.courseId = c.courseId
   AND gm.userId = 4
   AND g.year = '2023'
   AND g.semester = 'fall'
;

/*
	  Add friend
    Input: userId, friendId
*/
INSERT INTO friends VALUES(userId, friendID);
INSERT INTO friends VALUES(friendID, userId);

/*
	  Input: userId
    Output: a user's friend list
*/
SELECT u2.userId, u2.firstName, u2.lastName
  FROM friends f, users u1, users u2
 WHERE f.userId = u1.userId
   AND f.friendId = u2.userId
   AND f.userID = 4
;

/*
	  Input: userId, year, semester
    Output: overlapping class lists between users and their friends
*/
SELECT f.friendId, u.firstName, u.lastName, c.subject, c.courseNumber, c.title
  FROM friends f, classesEnrolled e, courses c, users u
 WHERE f.friendId = e.userId
   AND e.courseId = c.courseId
   AND f.friendId = u.userId
   AND e.courseId in (SELECT courseId
						FROM classesEnrolled
					   WHERE year = '2023'
						 AND semester = 'fall'
						 AND userID = 4)
   AND f.userId = 4
; 

/*
	  Check if a user is enrolled in the class with what kind of status
    Input: userId, courseId, year, semester
    Output: student/ta/instructor/null
*/
SELECT
	(CASE WHEN (SELECT count(*)
				 FROM classesEnrolled
				WHERE userId = 3
				  AND courseID = 786
				  AND year = '2023'
				  AND semester = 'fall') > 0 THEN 'student'
		 WHEN (SELECT count(*)
				 FROM tas
				WHERE userId = 3
				  AND courseId = 786
				  AND year = '2023'
				  AND semester = 'fall') > 0 THEN 'ta'
		 WHEN (SELECT count(*)
				 FROM instructors
				WHERE userId = 3
				  AND courseId = 786
				  AND year = '2023'
				  AND semester = 'fall') > 0 THEN 'instructor'
		ELSE null
	END) AS status
  FROM dual
;

/*
	student list of a class
	Input: courseId, year, semester
*/
SELECT u.userId, u.lastName, u.firstName
  FROM classesEnrolled e, users u
 WHERE e.userId = u.userId
   AND courseId = 746
   AND year = '2023'
   AND semester = 'fall'
;

/*
	course page 
	Input: courseId, year, semester
*/
SELECT *
  FROM courseActivities
 WHERE courseId = 786
   AND year = '2023'
   AND semester = 'fall'
;
