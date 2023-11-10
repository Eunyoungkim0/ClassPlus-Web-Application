const express = require('express');
const mysql = require('mysql');
const path = require('path');

const PORT = process.env.port || 3000;
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

    connection.query(`SELECT userId, userPassword, firstName, lastName FROM users WHERE email = '${userEmail}'`, function(error, results, fields){
        if (error) throw error;

        if(results.length > 0){
            const userId = results[0].userId;
            const password = results[0].userPassword;
            const firstName = results[0].firstName;
            const lastName = results[0].lastName;
            
            if(userPassword == password){
                res.json({
                    success: true,
                    userId: userId,
                    firstName: firstName,
                    lastName: lastName,
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
    connection.query(`SELECT e.courseID, e.year, e.semester, c.subject, c.courseNumber, c.title FROM classesEnrolled e, courses c WHERE e.courseId = c.courseId AND e.userId = ${userId};`, function(error, results, fields){
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
    FROM friends f, classesenrolled e, courses c
   WHERE f.userId = ${userId}
     AND f.friendId = e.userId
     AND e.courseId = c.courseId
     AND e.year = '${currentYear}'
     AND e.semester = 'fall'
     AND e.courseId in (SELECT courseId FROM classesenrolled WHERE userId = ${userId} AND year = '${currentYear}' AND semester = 'fall')
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

app.get('/api/getMyCourse/:userId', async(req, res) => {
    const userId = req.params.userId;
    const sql = `SELECT e.courseId, c.subject, c.courseNumber, c.title FROM classesenrolled e, courses c WHERE e.userId = ${userId} AND e.year = '${currentYear}' AND e.semester = 'fall' AND e.courseId = c.courseId;`;

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
        var sql2 = `SELECT a.activityId, a.subCategory, a.title, a.date, a.views, u.firstName, u.lastName FROM courseactivities a, users u 
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
        var sql2 = `SELECT a.activityId, a.title, a.date, a.views, u.firstName, u.lastName FROM courseactivities a, users u 
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
        var sql2 = `SELECT g.groupId, g.groupName, g.description, c.courseId, c.subject, c.courseNumber, c.title, count(*) as member
        FROM classplus.groups g, courses c, groupmembers gm
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
    const updateSQL = `UPDATE courseactivities SET views = views + 1 WHERE activityId = ${activityId}`;
    connection.query(updateSQL, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        const sql = `SELECT c.*, u.firstName, u.lastName FROM courseactivities c, users u WHERE activityId = ${activityId} AND c.userId = u.userId;`;
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
    const updateSQL = `UPDATE courseactivities SET views = views + 1 WHERE activityId = ${activityId}`;
    connection.query(updateSQL, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        const sql = `SELECT c.*, u.firstName, u.lastName FROM courseactivities c, users u WHERE activityId = ${activityId} AND c.userId = u.userId;`;
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
                    results: results
                });
            });
        });
    });

});

app.post('/api/createPost', async(req, res) => {
    const { subject, courseNumber, category, subCategory, title, content, userId } = req.body;

    var insertSQL = `INSERT INTO courseActivities(activityId, courseId, year, semester, category, subCategory, title, content, userId, date, postUpdate) `;
    insertSQL += ` SELECT COALESCE(MAX(activityId), 0) + 1, ${courseId}, '${currentYear}', 'fall', '${category}', '${subCategory}', '${title}', '${content}', ${userId}, DATE_SUB(NOW(), INTERVAL 5 HOUR), DATE_SUB(NOW(), INTERVAL 5 HOUR)`;
    insertSQL += ` FROM courseActivities;`;
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

app.post('/api/editPost', async(req, res) => {
    const { activityId, subCategory, title, content } = req.body;

    var updateSQL = `UPDATE courseActivities SET subCategory = '${subCategory}', title = '${title}', content = '${content}', postUpdate = DATE_SUB(NOW(), INTERVAL 5 HOUR) WHERE activityId = ${activityId}`;
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
        const activitySQL = `SELECT COALESCE(MAX(activityId), 0) AS max FROM courseActivities;`;
        connection.query(activitySQL, function(error, results, fields){
            if(error) throw error;
            const activityId = results[0].max + 1;

            var insertSQL = `INSERT INTO courseActivities (activityId, courseId, year, semester, category, title, userId, date, postUpdate) `;
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

    const updateActivity = `UPDATE courseActivities SET title = '${title}', postUpdate = DATE_SUB(NOW(), INTERVAL 5 HOUR) WHERE activityId = ${activityId}`;
    connection.query(updateActivity, function(error, results, fields){
        if(error) throw error;
        var count = 1;
        for (const data of studySet) {
            const { term, definition } = data;
          
            var sql = `UPDATE studySets SET term = '${term}', definition = '${definition}' WHERE activityId = ${activityId} AND studySetId = ${count}`;          
            console.log(sql);
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
    const { userId, subject, courseNumber } = req.body;

    connection.query(`SELECT courseId FROM courses WHERE subject = '${subject}' AND courseNumber = '${courseNumber}';`, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        const courseId = results[0].courseId;

        connection.query(`SELECT count(*) as count FROM classesEnrolled WHERE userId = ${userId} AND courseId = ${courseId} AND year = '${currentYear}' AND semester = 'fall'`, function(error, results, fields){
            if(error) {
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
                const sql = `INSERT INTO classesEnrolled VALUES (${userId}, ${courseId}, '${currentYear}', 'fall')`;
        
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
        const secondsql = `SELECT count(*) as count FROM classesEnrolled WHERE userId = ${userId} AND courseId = ${courseId} AND year = '${currentYear}' AND semester = 'fall'`;

        connection.query(secondsql, function(error, results, fields){
            if(error) {
                // Handle the error by sending an error response
                res.status(500).json({ error: 'Internal Server Error' });
                throw error;
            }
            if(results[0].count == 1){
                res.json({
                    enrolled: true
                });
            }else{
                res.json({
                    enrolled: false
                });
            }
        });
    });
});

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