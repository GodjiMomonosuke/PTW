const router = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://admin:1234@cluster0.ormtjkb.mongodb.net";
const mydatabase = "Cluster0";

router.get('/', async (req, res, next) => {
  const person = req.user;
  if(person != undefined){
    // PRETEST Check
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(mydatabase);
      var query = { email: person.email };
      dbo.collection("StudentAnswer").find(query).toArray(function(err, StudentAnswer) {
        if (err) throw err;
        if(Object.keys(StudentAnswer).length === 0){
          res.redirect('/')
        }
        else{
          MongoClient.connect(url, function(err, db) {
            if (err) throw err;
            var dbo = db.db(mydatabase);
            var query = {email:person.email};
            dbo.collection("StudentProject").find(query).toArray(function(err, StudentProjectResult) {
              if (err) throw err;
              db.close();
              //console.log(RecommendaResult[0].CalculatorPercent)
              var RecommendaResult = StudentProjectResult 
              
              res.render('student/project/project_main', { person,RecommendaResult,StudentAnswer});

            });
            
          });
          

          
        }

      });
    });
    // PRETEST Check
      
  }
});

module.exports = router;