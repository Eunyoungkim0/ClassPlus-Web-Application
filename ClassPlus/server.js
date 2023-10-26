const express = require('express');
const mysql = require('mysql');
const path = require('path');
//const cors = require('cors');

const PORT = process.env.port || 3000;
const app = express();
//app.use(cors());
app.use(express.static('public'));

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

app.get('/api/profile/:userId', async(req, res) => {
    const userId = req.params.userId;
    connection.query(`SELECT * FROM users WHERE userId = ${userId}`, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
        console.log(results);
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
        console.log(results);
    });
});


app.get('/api/profile_fl/:userId', async(req, res) => {
    const userId = req.params.userId;
    const sql = `
                SELECT f.friendId, u.firstName, u.lastName, c.subject, c.courseNumber, c.title, count(*) as count
                  FROM friends f, classesEnrolled e, courses c, users u
                 WHERE f.friendId = e.userId
                   AND e.courseId = c.courseId
                   AND f.friendId = u.userId
                   AND e.courseId in (SELECT courseId
					                	FROM classesEnrolled
					                   WHERE year = '2023'
						                 AND semester = 'fall'
						                 AND userID = ${userId})
                   AND f.userId = ${userId}
                GROUP BY f.friendId, u.firstName, u.lastName, c.subject, c.courseNumber, c.title`;

    connection.query(sql, function(error, results, fields){
        if(error) {
            // Handle the error by sending an error response
            res.status(500).json({ error: 'Internal Server Error' });
            throw error;
        }
        res.json(results);
        console.log(results);
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