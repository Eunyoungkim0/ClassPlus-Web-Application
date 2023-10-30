const express = require('express');
const mysql = require('mysql');
const path = require('path');

const PORT = process.env.port || 3000;
const app = express();

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
                    VALUES(${userId},'${firstName}','${lastName}','${userPassword}','${unccId}','${email}','${major}','${minor}',${isStudent},${isInstructor},now());`;
    
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

    connection.query(`SELECT userId, userPassword FROM users WHERE email = '${userEmail}'`, function(error, results, fields){
        if (error) throw error;

        console.log(results);

        if(results.length > 0){
            const userId = results[0].userId;
            const password = results[0].userPassword;
            
            if(userPassword == password){
                res.json({
                    success: true,
                    userId: userId,
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

app.post('/api/profile_save', async(req, res) => {
    const { userId, firstName, lastName, major, minor, isStudent, isInstructor } = req.body;

    connection.query(`SELECT my_row_id FROM users WHERE userId = ${userId}`, function(error, results, fields){
        if (error) throw error;
        const my_row_id = results[0].my_row_id;
        console.log(results[0].my_row_id);
        
        const sql = `UPDATE users
                        SET firstName = '${firstName}',
                        lastName = '${lastName}',
                        major = '${major}',
                        minor = '${minor}',
                        isStudent = ${isStudent},
                        isInstructor = ${isInstructor}
                WHERE my_row_id = ${my_row_id}`;
        
        connection.query(sql, function(error, results, fields){
            if (error) throw error;
            res.json({
                success: true,
                myContent: 'Update completed successfully'
            });
        });
    });
});

app.get('/api/profile_ci/:userId', async(req, res) => {
    const userId = req.params.userId;
    connection.query(`SELECT e.courseID, e.year, e.semester, c.subject, c.courseNumber FROM classesEnrolled e, courses c WHERE e.courseId = c.courseId AND e.userId = ${userId};`, function(error, results, fields){
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
    const sql = `SELECT a.friendId, a.firstName, a.lastName, b.subject, b.courseNumber
                   FROM
                        (SELECT f.userId, f.friendId, u.firstName, u.lastName
                           FROM friends f, users u
                          WHERE f.userId = ${userId}
                            AND f.friendId = u.userId) AS a
                   LEFT JOIN (SELECT e.userId, c.subject, c.courseNumber
                                FROM classesEnrolled e, courses c
                               WHERE e.courseId = c.courseId 
                                 AND e.year = '2023'
                                 AND e.semester = 'fall') AS b
                     ON a.friendId = b.userId`;

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


app.post('/api/getClassInfo/', async(req, res) => {
    const { subject, courseNumber } = req.body;
    connection.query(`SELECT title FROM courses WHERE subject = '${subject}' AND courseNumber = '${courseNumber}';`, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
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

        connection.query(`SELECT count(*) as count FROM classesEnrolled WHERE userId = ${userId} AND courseId = ${courseId} AND year = '2023' AND semester = 'fall'`, function(error, results, fields){
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
                const sql = `INSERT INTO classesEnrolled VALUES (${userId}, ${courseId}, '2023', 'fall')`;
        
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

    connection.query(`SELECT courseId FROM courses WHERE subject = '${subject}' AND courseNumber = '${courseNumber}';`, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        const courseId = results[0].courseId;

        connection.query(`SELECT count(*) as count FROM classesEnrolled WHERE userId = ${userId} AND courseId = ${courseId} AND year = '2023' AND semester = 'fall'`, function(error, results, fields){
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
