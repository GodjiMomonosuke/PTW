const router = require('express').Router();
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://admin:1234@cluster0.ormtjkb.mongodb.net";
const mydatabase = "Cluster0";

router.get('/', async (req, res, next) => {
  const person = req.user;
  if(person != undefined){

    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db(mydatabase);
      var query = {email:person.email};
      dbo.collection("StudentRecommendation").find(query).toArray(function(err, RecommendaResult) {
        if (err) throw err;
    
        res.render('student/course/4_Operators-course', { person ,RecommendaResult });
      });
    });

     
  }
});



module.exports = router;





