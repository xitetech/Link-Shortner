const { response } = require('express');
const express = require('express');
// const mysql = require("mysql");
const mysql = require('mysql2');

const app = express();


app.use(express.static('public'));
app.use(express.json());

const con = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"55522133",
    database:"shorturls"
});

con.connect(function(error){
    if(error){
        console.log(error)
        console.log("Database Connection Failed");
    }
})

app.get("/", function(request, response){
    response.sendFile(__dirname * "/public/index.html" );
});

app.post("/api/create-short-url", function(request, response,){
    let uniqueID = Math.random().toString(36).replace(/[^a-z0-9]/gi,'').substring(2,10);
    let sql = `INSERT INTO Links(longurls,shorturls) VALUES('${request.body.longurl}', '${uniqueID}')`;
    con.query(sql,function(error,result){
        console.log(error);
        if(error){
            response.status(500).json({
                status:"not",
                message:"Something went wrong"
            });
        } else {
            response.status(200).json({
                status:"ok",
                shorturlid:uniqueID
            });
        }
    })
});

app.get("/api/get-all-short-urls",function(request,response){
    let sql = `SELECT * FROM links`;
    con.query(sql, function(error,result){
        if(error){
            response.status(500).json({
                status:'not',
                message:'Somethng Went Wrong'
            });
        } else {
            response.status(200).json(result);
        }
    })
})

app.listen(5000);