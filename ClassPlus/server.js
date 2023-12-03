const express = require('express');
const mysql = require('mysql');
const path = require('path');

const PORT = process.env.port || 8080;
const app = express();
const currentDate = new Date();
const currentYear = currentDate.getFullYear();

app.use(express.static('public'));
app.use('/js', express.static(path.join(__dirname, 'js')));
app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type,Authorization');
    next();
});

var connection = mysql.createConnection({
    host    : 'classplus.mysql.database.azure.com',
    user    : 'classplus',
    password: 'uncc4155!',
    database: 'classplus'
});


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/api/checkLogin/:currentPagePath', async(req, res) => {
    const currentPage = req.params.currentPagePath;
    connection.query(`SELECT pageType, needsLogin FROM pages WHERE pageName = '${currentPage}';`, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json({
            success: true,
            needsLogin: results[0].needsLogin,
            pageType: results[0].pageType
        });
    });
});

app.post('/api/signup', async(req, res) => {
    const { firstName, lastName, userPassword, unccId, email, major, minor, isStudent, isInstructor } = req.body;

    connection.query("SELECT max(userId) as max FROM users;", function(error, results, fields){

        const userId = results[0].max + 1;

        const sql = `INSERT INTO users (userId, firstName, lastName, userPassword, unccId, email, major, minor, isStudent, isInstructor, signupDate)
                    VALUES(${userId},'${firstName}','${lastName}','${userPassword}','${unccId}','${email}','${major}','${minor}',${isStudent},${isInstructor}, DATE_SUB(NOW(), INTERVAL 5 HOUR));`;
    
        connection.query(sql, function(error, results, fields){
            if (error) throw error;
            res.json({
                success: true,
                userName: firstName,
                myContent: 'Register completed successfully'
            });
        });
    });

});

app.post('/api/login', async(req, res) => {
    const { userEmail, userPassword } = req.body;

    connection.query(`SELECT userId, userPassword, firstName, lastName, isInstructor FROM users WHERE email = '${userEmail}'`, function(error, results, fields){
        if (error) throw error;

        if(results.length > 0){
            const userId = results[0].userId;
            const password = results[0].userPassword;
            const firstName = results[0].firstName;
            const lastName = results[0].lastName;
            const isInstructor = results[0].isInstructor;
            
            if(userPassword == password){
                res.json({
                    success: true,
                    userId: userId,
                    firstName: firstName,
                    lastName: lastName,
                    isInstructor: isInstructor,
                    myContent: 'Found user!'
                });
            }else{
                res.json({
                    success: false,
                    userId: null,
                    myContent: 'Wrong password'
                });
            }
        }else{
            res.json({
                success: false,
                userId: null,
                myContent: 'Wrong email'
            });
        }
    });
});

app.get('/api/profile/:userId', async(req, res) => {
    const userId = req.params.userId;
    connection.query(`SELECT * FROM users WHERE userId = ${userId}`, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});

const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images/');
    },
    filename: (req, file, cb) => {
        const userId = req.body.userId;
        const pictureFileName = `${userId}_profile_picture.jpg`;
        cb(null, pictureFileName);
    },
});

const upload = multer({ storage: storage });

app.post('/api/profile_save', upload.single('profile-picture'), async (req, res) => {
    const { userId, firstName, lastName, major, minor, isStudent, isInstructor } = req.body;

    const pictureFileName = req.file ? req.file.filename : null;

    connection.query(`SELECT my_row_id FROM users WHERE userId = ${userId}`, function(error, results, fields){
        if (error) throw error;

        const my_row_id = results[0].my_row_id;

        const sql = `UPDATE users
                        SET firstName = '${firstName}',
                        lastName = '${lastName}',
                        major = '${major}',
                        minor = '${minor}',
                        picture = ${pictureFileName ? `'${pictureFileName}'` : 'NULL'},
                        isStudent = ${isStudent},
                        isInstructor = ${isInstructor}
                WHERE my_row_id = ${my_row_id}`;

        connection.query(sql, function (error, results, fields) {
            if (error) {
                console.error('Error updating user:', error);
                return res.status(500).json({ success: false, myContent: 'Error updating user' });
            }

            res.json({
                success: true,
                myContent: 'Update completed successfully'
            });
        });
    });
});




app.get('/api/profile_ci/:userId', async(req, res) => {
    const userId = req.params.userId;
    connection.query(`SELECT e.courseID, e.year, e.semester, c.subject, c.courseNumber, c.title FROM courses_enrollment e, courses c WHERE e.courseId = c.courseId AND e.userId = ${userId};`, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});


app.get('/api/profile_fl/:userId', async(req, res) => {
    const userId = req.params.userId;
    const sql = `SELECT f.friendId, u.firstName, u.lastName, u.picture
                   FROM friends f
                   LEFT JOIN users u ON f.friendId = u.userId
                  WHERE f.userId = ${userId}`;

    connection.query(sql, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});

app.get('/api/profile_fl_class/:userId', async(req, res) => {
    const userId = req.params.userId;
    const sql = `SELECT f.friendId, e.courseId, c.subject, c.courseNumber, c.title
    FROM friends f, courses_enrollment e, courses c
   WHERE f.userId = ${userId}
     AND f.friendId = e.userId
     AND e.courseId = c.courseId
     AND e.year = '${currentYear}'
     AND e.semester = 'fall'
     AND e.courseId in (SELECT courseId FROM courses_enrollment WHERE userId = ${userId} AND year = '${currentYear}' AND semester = 'fall')
   ORDER BY f.friendId`;

    connection.query(sql, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});


app.get('/api/profile_at/:userId', async(req, res) => {
    const userId = req.params.userId;
    connection.query(`SELECT * FROM availableTime WHERE userId = ${userId} AND year = '${currentYear}' AND semester = 'fall' ORDER BY day, time;`, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});

app.post('/api/profile_at_save', async (req, res) => {
    const { userId, days } = req.body;
    const deleteSQL = `DELETE FROM availableTime WHERE userId = ${userId} AND year = '${currentYear}' AND semester = 'fall';`;
    connection.query(deleteSQL, function(error, results, fields){
        if (error) throw error;

        for (const dayKey in days) {
            if (days.hasOwnProperty(dayKey)) {
                const times = days[dayKey];
                for (const time of times) {
                const sql = `INSERT INTO availableTime (userId, year, semester, day, time) VALUES (${userId}, ${currentYear}, 'fall', ${dayKey}, ${time})`;
                connection.query(sql, function(error, results, fields){
                    if (error) throw error;
                });
                }
            }
        }
        res.json({
            success: true,
        });
    });
});






app.get('/api/getCourseSubject', async(req, res) => {
    connection.query(`SELECT distinct subject FROM courses ORDER BY subject;`, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});

app.get('/api/getClasses/:selectedValue', async(req, res) => {
    const subject = req.params.selectedValue;
    connection.query(`SELECT courseNumber, title FROM courses WHERE subject = '${subject}' ORDER BY courseNumber;`, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});

app.post('/api/getSearchedCourses/', async(req, res) => {
    const { subject, courseNumber, limit } = req.body;
    
    let whereSQL = ` WHERE 1=1 `;

    if(subject != ""){
        whereSQL += ` AND subject = '${subject}'`;
    }

    if (courseNumber != "") {
        whereSQL += ` AND courseNumber = '${courseNumber}'`;
    }

    let selectSQL = `SELECT * FROM courses `;

    selectSQL += whereSQL;
    selectSQL += ` ORDER BY subject, courseNumber `;

    if(limit > 0){
        selectSQL += ` LIMIT ${limit};`;
    }else{
        selectSQL += `;`;
    }

    connection.query(selectSQL, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});

app.get('/api/getMyCourse/:userId', async(req, res) => {
    const userId = req.params.userId;
    const sql = `SELECT e.courseId, c.subject, c.courseNumber, c.title FROM courses_enrollment e, courses c WHERE e.userId = ${userId} AND e.year = '${currentYear}' AND e.semester = 'fall' AND e.courseId = c.courseId;`;

    connection.query(sql, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});

app.post('/api/getClassInfo/', async(req, res) => {
    const { userId, subject, courseNumber } = req.body;
    connection.query(`SELECT title FROM courses WHERE subject = '${subject}' AND courseNumber = '${courseNumber}';`, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});

app.post('/api/getCoursePosts/', async(req, res) => {
    const { userId, subject, courseNumber, limit } = req.body;
    const sql = `SELECT courseId FROM courses WHERE subject = '${subject}' AND courseNumber = '${courseNumber}'`;
    connection.query(sql, function(error, results, fields){
        if (error) throw error;
        const courseId = results[0].courseId;
        var sql2 = `SELECT a.activityId, a.subCategory, a.title, a.date, a.views, a.blocked, a.blockedby, u.firstName, u.lastName FROM courses_activity a, users u 
        WHERE a.category = 'Post' AND a.userId = u.userId AND a.courseId = ${courseId} AND a.year = '${currentYear}' AND a.semester = 'fall'
        ORDER BY a.date DESC`;
        if(limit > 0){
            sql2 += ` LIMIT ${limit};`;
        }else{
            sql2 += `;`;
        }
        connection.query(sql2, function(error, results, fields){
            if(error) {
                // Handle the error by sending an error response
                res.status(500).json({ error: 'Internal Server Error' });
                throw error;
            }
            res.json(results);
        });     
    });
});


app.post('/api/getCourseStudySets/', async(req, res) => {
    const { userId, subject, courseNumber, limit } = req.body;
    const sql = `SELECT courseId FROM courses WHERE subject = '${subject}' AND courseNumber = '${courseNumber}'`;
    connection.query(sql, function(error, results, fields){
        if (error) throw error;
        const courseId = results[0].courseId;
        var sql2 = `SELECT a.activityId, a.title, a.date, a.views, a.blocked, a.blockedby, u.firstName, u.lastName FROM courses_activity a, users u 
        WHERE a.category = 'Study set' AND a.userId = u.userId AND a.courseId = ${courseId} AND a.year = '${currentYear}' AND a.semester = 'fall'
        ORDER BY a.date DESC`;
        if(limit > 0){
            sql2 += ` LIMIT ${limit};`;
        }else{
            sql2 += `;`;
        }
        connection.query(sql2, function(error, results, fields){
            if(error) {
                // Handle the error by sending an error response
                res.status(500).json({ error: 'Internal Server Error' });
                throw error;
            }
            res.json(results);
        });     
    });
});


app.post('/api/getCourseGroups/', async(req, res) => {
    const { userId, subject, courseNumber, limit } = req.body;
    const sql = `SELECT courseId FROM courses WHERE subject = '${subject}' AND courseNumber = '${courseNumber}'`;
    connection.query(sql, function(error, results, fields){
        if (error) throw error;
        const courseId = results[0].courseId;
        var sql2 = `SELECT g.groupId, g.groupName, g.description, g.blocked, g.blockedby, c.courseId, c.subject, c.courseNumber, c.title, count(*) as member
        FROM studygroups g, courses c, studygroups_member gm
       WHERE g.courseId = c.courseId
         AND g.courseId = ${courseId}
         AND g.courseId = gm.courseId
         AND g.groupId = gm.groupId
         AND g.year = '${currentYear}' AND g.semester = 'fall'
       GROUP BY g.groupId, g.groupName, g.description, c.courseId, c.subject, c.courseNumber, c.title
       ORDER BY member DESC`;
        if(limit > 0){
            sql2 += ` LIMIT ${limit};`;
        }else{
            sql2 += `;`;
        }

        connection.query(sql2, function(error, results, fields){
            if(error) {
                // Handle the error by sending an error response
                res.status(500).json({ error: 'Internal Server Error' });
                throw error;
            }
            res.json(results);
        });     
    });
});

app.post('/api/getPost/:activityId', async(req, res) => {
    const activityId = req.params.activityId;
    const userId = req.params.userId;
    const updateSQL = `UPDATE courses_activity SET views = views + 1 WHERE activityId = ${activityId}`;
    connection.query(updateSQL, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        const sql = `SELECT c.*, u.firstName, u.lastName FROM courses_activity c, users u WHERE activityId = ${activityId} AND c.userId = u.userId;`;
        connection.query(sql, function(error, results, fields){
            if(error) {
                // Handle the error by sending an error response
                res.status(500).json({ error: 'Internal Server Error' });
                throw error;
            }
            res.json(results);
        });
    });

});

app.post('/api/getStudySet/:activityId', async(req, res) => {
    const activityId = req.params.activityId;
    const updateSQL = `UPDATE courses_activity SET views = views + 1 WHERE activityId = ${activityId}`;
    connection.query(updateSQL, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        const sql = `SELECT c.*, u.firstName, u.lastName FROM courses_activity c, users u WHERE activityId = ${activityId} AND c.userId = u.userId;`;
        connection.query(sql, function(error, results, fields){
            if(error) {
                // Handle the error by sending an error response
                res.status(500).json({ error: 'Internal Server Error' });
                throw error;
            }
            const userName = results[0].firstName + " " + results[0].lastName;
            const userId = results[0].userId;
            const views = results[0].views;
            const title = results[0].title;
            const postDate = results[0].date;
            const postUpdate = results[0].postUpdate;
            const blocked = results[0].blocked;
            const blockedby = results[0].blockedby;

            const studysetSQL = `SELECT * FROM studysets WHERE activityId = ${activityId};`;
            connection.query(studysetSQL, function(error, results, fields){
                if(error) {
                    // Handle the error by sending an error response
                    res.status(500).json({ error: 'Internal Server Error' });
                    throw error;
                }
                res.json({
                    title: title,
                    userId: userId,
                    userName: userName,
                    views: views,
                    postDate: postDate,
                    postUpdate: postUpdate,
                    blocked: blocked,
                    blockedby: blockedby,
                    results: results
                });
            });
        });
    });

});

app.post('/api/createPost', async(req, res) => {
    const { subject, courseNumber, category, subCategory, title, content, userId } = req.body;

    var getCourseId = `SELECT courseId FROM courses WHERE subject = '${subject}' AND courseNumber = '${courseNumber}'`;

    connection.query(getCourseId, function(error, results, fields){
        if(error) throw error;

        const courseId = results[0].courseId;

        var insertSQL = `INSERT INTO courses_activity(activityId, courseId, year, semester, category, subCategory, title, content, userId, date, postUpdate) `;
        insertSQL += ` SELECT COALESCE(MAX(activityId), 0) + 1, ${courseId}, '${currentYear}', 'fall', '${category}', '${subCategory}', '${title}', '${content}', ${userId}, DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 5 HOUR)`;
        insertSQL += ` FROM courses_activity;`;
        connection.query(insertSQL, function(error, results, fields){
            if(error) {
                // Handle the error by sending an error response
                res.status(500).json({ error: 'Internal Server Error' });
                throw error;
            }
            res.json({
                success: true,
            });
        });
    });
});

app.post('/api/editPost', async(req, res) => {
    const { activityId, subCategory, title, content } = req.body;

    var updateSQL = `UPDATE courses_activity SET subCategory = '${subCategory}', title = '${title}', content = '${content}', postUpdate = DATE_SUB(NOW(), INTERVAL 5 HOUR) WHERE activityId = ${activityId}`;
    connection.query(updateSQL, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json({
            success: true,
        });
    });
});

app.post('/api/createStudySet', async(req, res) => {
    const { title, subject, courseNumber, userId, studySet } = req.body;

    var getCourseId = `SELECT courseId FROM courses WHERE subject = '${subject}' AND courseNumber = '${courseNumber}'`;

    connection.query(getCourseId, function(error, results, fields){
        if(error) throw error;

        const courseId = results[0].courseId;
        const activitySQL = `SELECT COALESCE(MAX(activityId), 0) AS max FROM courses_activity;`;
        connection.query(activitySQL, function(error, results, fields){
            if(error) throw error;
            const activityId = results[0].max + 1;

            var insertSQL = `INSERT INTO courses_activity (activityId, courseId, year, semester, category, title, userId, date, postUpdate) `;
            insertSQL += ` VALUES(${activityId}, ${courseId}, '${currentYear}', 'fall', 'Study set', '${title}', ${userId}, DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 5 HOUR));`;
            connection.query(insertSQL, function(error, results, fields){
                if(error) throw error;
    
                var count = 1;
                for (const data of studySet) {
                    const { term, definition } = data;
                  
                    var studysetSQL = `INSERT INTO studySets (activityId, studySetId, term, definition)`;
                    studysetSQL +=  ` VALUES(${activityId}, ${count}, '${term}', '${definition}');`;
                    connection.query(studysetSQL, function(error, results, fields){
                        if(error) throw error;
                    });
                    count += 1;
                    if (count > studySet.length) {
                        res.json({
                            success: true,
                        });
                    }
                  }
            });
        });
    });
});

app.post('/api/editStudySet', async(req, res) => {
    const { activityId, title, studySet } = req.body;

    const updateActivity = `UPDATE courses_activity SET title = '${title}', postUpdate = DATE_SUB(NOW(), INTERVAL 5 HOUR) WHERE activityId = ${activityId}`;
    connection.query(updateActivity, function(error, results, fields){
        if(error) throw error;
        var count = 1;
        for (const data of studySet) {
            const { term, definition } = data;
          
            var sql = `UPDATE studySets SET term = '${term}', definition = '${definition}' WHERE activityId = ${activityId} AND studySetId = ${count}`;          
            connection.query(sql, function(error, results, fields){
                if (error) {
                    res.status(500).json({ error: 'Internal Server Error' });
                    throw error;
                }
            });
            count += 1;
            if (count > studySet.length) {
                res.json({
                    success: true,
                });
            }
          }
    });
});

app.post('/api/saveClass/', async(req, res) => {
    const { userId, subject, courseNumber, instructor } = req.body;
    var status = "student";
    if(instructor == 1){
        status = "instructor";
    }
    const selectCourseId = `SELECT courseId FROM courses WHERE subject = '${subject}' AND courseNumber = '${courseNumber}';`;
    connection.query(selectCourseId, function(error, results, fields){
        // console.log(selectCourseId);
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        const courseId = results[0].courseId;

        const countCourseEnrollment = `SELECT count(*) as count FROM courses_enrollment WHERE userId = ${userId} AND courseId = ${courseId} AND year = '${currentYear}' AND semester = 'fall'`;
        connection.query(countCourseEnrollment, function(error, results, fields){
            if(error) {
                // console.log(countCourseEnrollment);
                // Handle the error by sending an error response
                res.status(500).json({ error: 'Internal Server Error' });
                throw error;
            }
            if(results[0].count == 1){
                res.json({
                    success: false,
                    alreadyEnrolled: true
                });
            }else{
                const sql = `INSERT INTO courses_enrollment (userId, courseId, year, semester, status) VALUES (${userId}, ${courseId}, '${currentYear}', 'fall', '${status}')`;
        
                connection.query(sql, function(error, results, fields){
                    // console.log(sql);
                    if(error) {
                        // Handle the error by sending an error response
                        res.status(500).json({ error: 'Internal Server Error' });
                        throw error;
                    }
                    res.json({
                        success: true
                    });
                });
            }
        });

    });
});

app.post('/api/getPermission/', async(req, res) => {
    const { userId, subject, courseNumber } = req.body;
    const sql = `SELECT courseId FROM courses WHERE subject = '${subject}' AND courseNumber = '${courseNumber}';`

    connection.query(sql, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        const courseId = results[0].courseId;
        const secondsql = `SELECT status, blocked FROM courses_enrollment WHERE userId = ${userId} AND courseId = ${courseId} AND year = '${currentYear}' AND semester = 'fall'`;

        connection.query(secondsql, function(error, results, fields){
            if(error) {
                // Handle the error by sending an error response
                res.status(500).json({ error: 'Internal Server Error' });
                throw error;
            }
            if(results.length > 0){
                res.json({
                    enrolled: true,
                    blocked: results[0].blocked,
                    status: results[0].status
                });
            }else{
                res.json({
                    enrolled: false,
                    blocked: null,
                    status: null
                });
            }
        });
    });
});


app.post('/api/getCoursePeople/', async(req, res) => {
    const { subject, courseNumber } = req.body;
    const sql = `SELECT courseId FROM courses WHERE subject = '${subject}' AND courseNumber = '${courseNumber}';`

    connection.query(sql, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        const courseId = results[0].courseId;
        const secondsql = `SELECT e.userId, u.picture, u.lastName, u.firstName, u.email, e.status, e.assignedby, 
        (SELECT count(*) FROM courses_activity a WHERE a.courseId=${courseId} AND a.year='${currentYear}' AND a.semester='fall'AND a.userId=e.userId) AS count_activity,
        (SELECT count(*) FROM studygroups_member gm, studygroups g WHERE gm.userId=e.userId AND g.groupId=gm.groupId AND g.courseId=${courseId} AND g.year='${currentYear}' AND g.semester='fall') AS count_group,
        e.blocked, e.blockedby,
        (SELECT CONCAT(u2.firstName, ' ' , u2.lastName) FROM users u2 WHERE u2.userId=e.blockedby) AS name_blockedby
   FROM courses_enrollment e, users u
  WHERE e.courseId=${courseId} AND e.year='${currentYear}' AND e.semester='fall' AND e.userId=u.userId 
  ORDER BY u.lastName, u.firstName ;`;

        connection.query(secondsql, function(error, results, fields){
            if(error) {
                // Handle the error by sending an error response
                res.status(500).json({ error: 'Internal Server Error' });
                throw error;
            }
            res.json(results);
        });
    });
});


app.post('/api/changeUserStatus', async(req, res) => {
    const { clickedUserId, status, subject, courseNumber, userId } = req.body;

    var selectSQL = `SELECT courseId FROM courses WHERE subject='${subject}' AND courseNumber='${courseNumber}';`;

    connection.query(selectSQL, function(error, results, fields){
        if(error) {
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        const courseId = results[0].courseId;
        const updateSQL = `UPDATE courses_enrollment SET status='${status}', assignedby=${userId} WHERE userId=${clickedUserId} AND courseId=${courseId} AND year='${currentYear}' AND semester='fall' ;`;

        connection.query(updateSQL, function(error, results, fields){
            if(error) {
                res.status(500).json({ error: 'Internal Server Error' });
                throw error;
            }
            res.json(results);
        });
    });
});

app.post('/api/blockPeople', async(req, res) => {
    const { clickedUserId, blocked, subject, courseNumber, userId } = req.body;

    var selectSQL = `SELECT courseId FROM courses WHERE subject='${subject}' AND courseNumber='${courseNumber}';`;

    connection.query(selectSQL, function(error, results, fields){
        if(error) {
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        const courseId = results[0].courseId;
        const updateSQL = `UPDATE courses_enrollment SET blocked=${blocked}, blockedby=${userId} WHERE userId=${clickedUserId} AND courseId=${courseId} AND year='${currentYear}' AND semester='fall' ;`;

        connection.query(updateSQL, function(error, results, fields){
            if(error) {
                res.status(500).json({ error: 'Internal Server Error' });
                throw error;
            }
            res.json(results);
        });
    });
});

app.post('/api/blockActivities', async(req, res) => {
    const { clickedActivityId, blocked, subject, courseNumber, userId } = req.body;

    var selectSQL = `SELECT courseId FROM courses WHERE subject='${subject}' AND courseNumber='${courseNumber}';`;

    connection.query(selectSQL, function(error, results, fields){
        if(error) {
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        const courseId = results[0].courseId;
        const updateSQL = `UPDATE courses_activity SET blocked=${blocked}, blockedby=${userId} WHERE activityId=${clickedActivityId} AND courseId=${courseId} AND year='${currentYear}' AND semester='fall' ;`;

        connection.query(updateSQL, function(error, results, fields){
            if(error) {
                res.status(500).json({ error: 'Internal Server Error' });
                throw error;
            }
            res.json(results);
        });
    });
});

app.post('/api/blockGroups', async(req, res) => {
    const { groupId, blocked, subject, courseNumber, userId } = req.body;

    var selectSQL = `SELECT courseId FROM courses WHERE subject='${subject}' AND courseNumber='${courseNumber}';`;

    connection.query(selectSQL, function(error, results, fields){
        if(error) {
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        const courseId = results[0].courseId;
        const updateSQL = `UPDATE studygroups SET blocked=${blocked}, blockedby=${userId} WHERE groupId=${groupId} AND courseId=${courseId} AND year='${currentYear}' AND semester='fall' ;`;

        connection.query(updateSQL, function(error, results, fields){
            if(error) {
                res.status(500).json({ error: 'Internal Server Error' });
                throw error;
            }
            res.json(results);
        });
    });
});

app.post('/api/checkStatus', async(req, res) => {
    const { subject, courseNumber, userId } = req.body;

    var selectSQL = `SELECT courseId FROM courses WHERE subject='${subject}' AND courseNumber='${courseNumber}';`;

    connection.query(selectSQL, function(error, results, fields){
        if(error) {
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        const courseId = results[0].courseId;
        const selectSQL2 = `SELECT status FROM courses_enrollment WHERE userId=${userId} AND courseId=${courseId} AND year='${currentYear}' AND semester='fall' AND blocked=0 ;`;

        connection.query(selectSQL2, function(error, results, fields){
            if(error) {
                res.status(500).json({ error: 'Internal Server Error' });
                throw error;
            }
            if(results.length > 0){
                res.json({
                    status: results[0].status
                });
            }else{
                res.json({
                    status: null
                });
            }
        });
    });
});




//--------------------------------------------------------------------------------------------------------
// API end points FOR GROUP
app.get('/api/getMyGroup/:userId', async(req, res) => {
    const userId = req.params.userId;
    var sql = `SELECT m.groupId, m.groupName, m.description, m.blocked, m.blockedby, m.courseId, c.subject, c.courseNumber, c.title, count(*) as members `;
    sql += `FROM (SELECT gm.groupId, g.groupName, g.description, g.blocked, g.blockedby, gm.courseId FROM studygroups_member gm, studygroups g WHERE gm.userId = ${userId} AND gm.groupId = g.groupId AND g.year='${currentYear}' AND g.semester='fall') AS m, `;
    sql += `courses c, studygroups_member gm `;
    sql += `WHERE m.courseId = c.courseId AND m.groupId = gm.groupId `;
    sql += `GROUP BY m.groupId, m.groupName, m.description, m.courseId, c.subject, c.courseNumber, c.title `;
    sql += `ORDER BY c.subject, c.courseNumber;`;

    connection.query(sql, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});

app.post('/api/getGroup/:groupId', async(req, res) => {
    const groupId = req.params.groupId;
    const userId = req.query.userId;
    const sql = `SELECT a.*,
    (CASE WHEN gm2.userId IS NOT NULL THEN 1 ELSE 0 END) AS amIJoined,
    (CASE WHEN e.userId IS NOT NULL THEN 1 ELSE 0 END) AS amIEnrolled
FROM (SELECT g.groupId, g.groupName, g.description, g.courseId, g.blocked, g.blockedby, c.subject, c.courseNumber, c.title, count(*) as members
  FROM studygroups_member gm, studygroups g, courses c 
  WHERE g.year = '${currentYear}' AND g.semester = 'fall'
  AND gm.groupId = g.groupId AND g.courseId = c.courseId
  AND g.groupId = ${groupId}
  GROUP BY g.groupId, g.groupName, g.description, g.courseId, c.subject, c.courseNumber, c.title) AS A
LEFT JOIN studygroups_member gm2 ON a.groupId = gm2.groupId AND gm2.userId = ${userId}
LEFT JOIN courses_enrollment e ON a.courseId = e.courseId AND e.userId = ${userId} AND e.year = '${currentYear}' AND e.semester = 'fall'; `;
    connection.query(sql, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});

app.post('/api/getSearchedGroups/', async(req, res) => {
    const { subject, courseNumber, groupName, limit } = req.body;
    
    let whereSQL = `WHERE 1=1 `;

    if(subject != ""){
        whereSQL += ` AND subject = '${subject}'`;
    }

    if (courseNumber != "") {
        whereSQL += ` AND courseNumber = '${courseNumber}'`;
    }

    if (groupName != "") {
        whereSQL += ` AND groupName like '%${groupName}%'`;
    }

    let selectSQL = `
        SELECT * 
            FROM
        (SELECT g.groupId, g.groupName, g.description, g.courseId, g.blocked, g.blockedby, c.subject, c.courseNumber, c.title, count(*) as member
        FROM studygroups g
        JOIN courses c ON g.courseId = c.courseId
        JOIN studygroups_member gm ON g.courseId = gm.courseId AND g.groupId = gm.groupId
        WHERE g.year = '${currentYear}' AND g.semester = 'fall'
        GROUP BY g.groupId, g.groupName, g.description, c.courseId, c.subject, c.courseNumber, c.title
        ORDER BY member DESC) AS a
    `;

    selectSQL += whereSQL;

    if(limit > 0){
        selectSQL += ` LIMIT ${limit};`;
    }else{
        selectSQL += `;`;
    }

    connection.query(selectSQL, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});

app.get('/api/getGroupMembers/:groupId', async(req, res) => {
    const groupId = req.params.groupId;
    const userId = req.query.userId;
    const sql = `SELECT a.groupId, a.userId, a.lastName, a.firstName, a.picture,
    (CASE WHEN f.userId IS NOT NULL THEN 1 ELSE 0 END) AS isFriend,
    (SELECT status FROM courses_enrollment e WHERE e.userId=a.userId AND e.courseId=a.courseId AND e.year='${currentYear}' AND e.semester='fall') AS status,
    a.blocked, a.blockedby
   FROM (SELECT gm.groupId, gm.courseId, u.userId, u.lastName, u.firstName, u.picture, gm.blocked, gm.blockedby FROM studygroups_member gm, users u WHERE gm.groupId = ${groupId} AND gm.userId = u.userId AND gm.blocked!=1) AS a
   LEFT JOIN friends f ON a.userId = f.friendId AND f.userId = ${userId}
    `;
    connection.query(sql, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});


app.post('/api/getGroupInfo/', async(req, res) => {
    const { userId, groupId } = req.body;
    const sql = `SELECT g.groupId, g.groupName, g.description, c.courseId, c.subject, c.courseNumber, c.title FROM studygroups g, courses c WHERE g.groupId = ${groupId} AND g.courseId = c.courseId;`;
    connection.query(sql, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});

app.post('/api/getGroupPermission/', async(req, res) => {
    const { userId, groupId } = req.body;
    var sql = ` SELECT (CASE WHEN e.courseId IS NOT NULL THEN 1 ELSE 0 END) AS enrolled, 
                       (CASE WHEN gm.groupId IS NOT NULL THEN 1 ELSE 0 END) AS joined 
                  FROM studygroups g 
                  LEFT JOIN courses_enrollment e ON g.courseId = e.courseId AND g.year = e.year AND g.semester = e.semester AND e.userId = ${userId} 
                  LEFT JOIN studygroups_member gm ON g.groupId = gm.groupId AND gm.userId = ${userId} 
                 WHERE g.groupId = ${groupId};`;

    connection.query(sql, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        
        if(results[0].enrolled == 1){
            if(results[0].joined == 1){
                res.json({
                    enrolled: true,
                    joined: true
                });
            }else{
                res.json({
                    enrolled: true,
                    joined: false
                });
            }
        }else{
            res.json({
                enrolled: false,
                joined: false
            });
        }
    });
});

app.post('/api/joinGroup/', async(req, res) => {
    const { userId, groupId } = req.body;

    connection.query(`SELECT count(*) as count FROM studygroups_member WHERE userId = ${userId} AND groupId = ${groupId}`, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        if(results[0].count == 1){
            res.json({
                success: false,
                alreadyJoined: true
            });
        }else{
            const sql = `INSERT INTO studygroups_member (groupId, courseId, userId) 
                         SELECT ${groupId}, courseId, ${userId} FROM studygroups g WHERE g.groupId = ${groupId};`;
            connection.query(sql, function(error, results, fields){
                if(error) {
                    // Handle the error by sending an error response
                    res.status(500).json({ error: 'Internal Server Error' });
                    throw error;
                }
                res.json({
                    success: true
                });
            });
        }
    });

});


app.post('/api/followFriend/:userId', async(req, res) => {
    const userId = req.params.userId;
    const friendId = req.query.friendId;
    const sql = `INSERT INTO friends VALUES(${userId}, ${friendId}); `;
    connection.query(sql, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json({
            success: true
        });
    });
});

app.post('/api/createGroup', async(req, res) => {
    const { groupName, groupDescription, subject, courseNumber, userId } = req.body;
    
    const sql = `SELECT courseId FROM courses WHERE subject = '${subject}' AND courseNumber = '${courseNumber}'`;
    connection.query(sql, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        const courseId = results[0].courseId;
        var insertGroup = `INSERT INTO studygroups (groupId, groupName, description, courseId, year, semester, createrId) `;
        insertGroup += `SELECT COALESCE(MAX(groupId), 0) + 1, '${groupName}', '${groupDescription}', ${courseId}, '${currentYear}', 'fall', ${userId} FROM studygroups;`;
        connection.query(insertGroup, function(error, results, fields){
            if(error) {
                // Handle the error by sending an error response
                res.status(500).json({ error: 'Internal Server Error' });
                throw error;
            }
            var insertGroupMember = `INSERT INTO studygroups_member (groupId, courseId, userId) `;
            insertGroupMember += `SELECT COALESCE(MAX(groupId), 0), ${courseId}, ${userId} FROM studygroups; `;
            connection.query(insertGroupMember, function(error, results, fields){
                if(error) {
                    // Handle the error by sending an error response
                    res.status(500).json({ error: 'Internal Server Error' });
                    throw error;
                }            
                res.json({
                    success: true
                });
            });
        });
    });
});

app.get('/api/getGroupAvailableTime/:groupId', async(req, res) => {
    const groupId = req.params.groupId;
    const sql = `SELECT gm.groupId, a.day, a.time, count(*) as count
    FROM availabletime a
    LEFT JOIN studygroups_member gm ON a.userId = gm.userId
   WHERE gm.groupId = ${groupId}
   GROUP BY gm.groupId, a.day, a.time
   HAVING count > 1 ORDER BY count DESC limit 5;`;
    connection.query(sql, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});

app.get('/api/getGroupSavedMeeting/:groupId', async(req, res) => {
    const groupId = req.params.groupId;
    const sql = `SELECT * FROM groupavailable WHERE groupId = ${groupId}; `;
    connection.query(sql, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});

app.get('/api/getGroupNextMeeting/:groupId', async(req, res) => {
    const groupId = req.params.groupId;
    const sql = `SELECT * FROM groupavailable WHERE groupId = ${groupId} AND isSelected = 1; `;
    connection.query(sql, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
    });
});

app.post('/api/group_meeting_save', async (req, res) => {
    const { groupId, days, locations } = req.body;

    for (const dayKey in days) {
        if (days.hasOwnProperty(dayKey)) {
            const times = days[dayKey];

            const selectSQL = `SELECT count(*) AS count FROM groupavailable WHERE groupId = ${groupId} AND type = 'Time' AND value1 = ${times[0]} AND value2 = ${times[1]} AND value3 = ${times[2]}; `;
            connection.query(selectSQL, function (error, results, fields) {
                if (error) throw error;
                const resultExist = results[0].count;
                if(resultExist == 0){
                    const insertSQL = `INSERT INTO groupavailable (groupId, type, value1, value2, value3, isSelected, memCount) VALUES (${groupId}, 'Time', ${times[0]}, ${times[1]}, ${times[2]}, ${times[3]}, ${times[4]});`;
                    connection.query(insertSQL, function (error, results, fields) {
                        if (error) throw error;
                    });
                }else{
                    const updateSQL1 = `UPDATE groupavailable SET isSelected = ${times[3]}, memCount = ${times[4]} WHERE groupId = ${groupId} AND type = 'Time' AND value1 = ${times[0]} AND value2 = ${times[1]} AND value3 = ${times[2]}; `;
                    connection.query(updateSQL1, function (error, results, fields) {
                        if (error) throw error;
                    });
                }
            });
            
        }
    }

    for (const locationKey in locations) {
        if (locations.hasOwnProperty(locationKey)) {
            const locationsData = locations[locationKey];

            const selectSQL = `SELECT count(*) AS count FROM groupavailable WHERE groupId = ${groupId} AND type = 'Location' AND value0 = '${locationsData[0]}'; `;
            connection.query(selectSQL, function (error, results, fields) {
                if (error) throw error;
                const resultExist = results[0].count;
                if(resultExist == 0){
                    const insertSQL = `INSERT INTO groupavailable (groupId, type, value0, isSelected) VALUES (${groupId}, 'Location', '${locationsData[0]}', ${locationsData[1]});`;
                    connection.query(insertSQL, function (error, results, fields) {
                        if (error) throw error;
                    });
                }else{
                    const updateSQL1 = `UPDATE groupavailable SET isSelected = ${locationsData[1]} WHERE groupId = ${groupId} AND type = 'Location' AND value0 = '${locationsData[0]}'; `;
                    connection.query(updateSQL1, function (error, results, fields) {
                        if (error) throw error;
                    });
                }
            });
        }
    }

    res.json({
        success: true
    });
});


app.post('/api/group_meeting_delete', async(req, res) => {
    const { groupId, type, value0, value1, value2, value3 } = req.body;

    var selectSQL = "";
    if(type == "Time"){
        selectSQL = `SELECT count(*) AS count FROM groupavailable WHERE groupId = ${groupId} AND type = '${type}' AND value1 = ${value1} AND value2 = ${value2} AND value3 = ${value3}; `;
    }else if(type == "Location"){
        selectSQL = `SELECT count(*) AS count FROM groupavailable WHERE groupId = ${groupId} AND type = '${type}' AND value0 = '${value0}'`;
    }
    
    connection.query(selectSQL, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        const count = results[0].count;
        if(count > 0){
            var deleteSQL = "";
            if(type == "Time"){
                deleteSQL = `DELETE FROM groupavailable WHERE groupId = ${groupId} AND type = '${type}' AND value1 = ${value1} AND value2 = ${value2} AND value3 = ${value3}; `;
            }else if(type == "Location"){
                deleteSQL = `DELETE FROM groupavailable WHERE groupId = ${groupId} AND type = '${type}' AND value0 = '${value0}'`;
            }
            connection.query(deleteSQL, function(error, results, fields){
                if(error) {
                    // Handle the error by sending an error response
                    res.status(500).json({ error: 'Internal Server Error' });
                    throw error;
                }
            });
        }
        res.json({
            success: true
        });
    });
});
//--------------------------------------------------------------------------------------------------------




app.use(function (err, req, res, next) {
    if(err.name == 'UnauthorizedError'){
        res.status(401).json({
            success: false,
            officialError: err,
            err : 'Username or password is incorrect 2'
        })
    }else{
        next(err);
    }
});

app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);
});