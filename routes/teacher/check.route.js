const router = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId; 
const url = "mongodb+srv://admin:1234@cluster0.ormtjkb.mongodb.net";
const mydatabase = "Cluster0";


router.get('/', async (req, res, next) => {
  const person = req.user;
  if(person != undefined){
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        var dbo = db.db(mydatabase);
        //var query = { code:/.*m.*/};
        var query = { lang:"C"};
        dbo.collection("StudentAnswer").find(query).toArray(function(err, result) {
            if (err) throw err;
            var student = []
            for (let i = 0; i < Object.keys(result).length; i++) {
                if(result[i].scoreTeacher === undefined){
                    student.push(result[i])
                }
            }
            if(Object.keys(student).length === 0){
                student.push("null")
            }
            res.render('teacher/check', { person ,student});
            db.close();
        });
      });
  }
});

/** teacher send student score */
router.post('/submit', async (req, res, next) => {
    const person = req.user;
    var score = req.body.studentScore;
    var idStudent = req.body.idStudent;
    
    if(idStudent === ""){}
    else{
        MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(mydatabase);
            var myquery = {_id:ObjectId(idStudent)};
            var newvalues = { $set: {scoreTeacher: score ,checkedBy:person.email} };
            dbo.collection("StudentAnswer").updateOne(myquery, newvalues, function(err, res) {
            if (err) throw err;
            db.close();
            });
        });
    }
    try {
        res.redirect('back')    
    } catch (error) {
      next(error);
    }
});

module.exports = router;
