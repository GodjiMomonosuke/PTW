const router = require('express').Router();
var compiler = require('compilex');
var options = {stats : true}; //prints stats on console 
compiler.init(options);
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb+srv://admin:1234@cluster0.ormtjkb.mongodb.net";
const mydatabase = "Cluster0";

var ADRI = "https://drive.google.com/file/d/17FCfs6NYXTPPYKf4SON56owA51xkkQRO/preview"
var ADRI_Expect = "เขียนโปรแกรมโดยรับค่าตัวเลขจำนวน 2 ตัว จาก Keyboard โดยเลขที่เรียงจะเพิ่มขึ้นเท่าค่าตัวเลขที่ 2 ที่รับมาและหาค่าผลรวม"
var ADRI_Answer = "https://drive.google.com/file/d/1i_f_tXaFK-u5Ni-d3u6Src1AL5RrCx9G/preview"

router.get('/', async (req, res, next) => {
  const person = req.user;
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
          dbo.collection("StudentRecommendation").find(query).toArray(function(err, RecommendaResult) {
            if (err) throw err;

            res.render('student/quiz/5_2_Loop-quiz', { person ,StudentAnswer,RecommendaResult,ADRI,ADRI_Expect});
          });
        });
      }
      db.close();
    });
  });
  // PRETEST Check
});
/** user quiz send  */
router.post('/submit', async (req, res, next) => {
  const person = req.user;
  const choice1  = req.body.choice1
  const choice2  = req.body.choice2
  const choice3  = req.body.choice3
 var code = req.body.code;
  var lang = req.body.lang;
  var expResult = req.body.expResult
  var ImproveResult = ADRI_Expect
  var Improvevariable = req.body.Improvevariable
  var scoreLV1 = 0;
  var scoreLV2 = 0;
  var scoreLV3 = 0;
  var currentQuiz = "Loop-Quiz" //*** */
  var timetodo = 0;

  /** chekc score */
  if(choice1 === 'C'){
    scoreLV1 = 10;
  }
  if(choice2 === 'B'){
    scoreLV2 = 20;
  }
  if(choice3 === 'right'){
    scoreLV3 = 30;
  }
  /** compiler */
  var envData = { OS : "linux" , cmd : "gcc" };
  compiler.compileCPP(envData , code , function (data) {
    //compiler.compileCPP(envData , code , function (data) {
        var dataOut = data.output;
        if(dataOut === undefined || dataOut === null) {console.log("DataOut@undefined!!!! : "+dataOut)}
        else ;

        /** check and insert info,score  */
        MongoClient.connect(url, function(err, db) {
          if (err) throw err;
          var dbo = db.db(mydatabase);
          var query = { email:person.email};
          dbo.collection("StudentAnswer").find(query).toArray(function(err, result) {
            if (err) throw err;
            if(Object.keys(result).length >= 1){
              for (let i = 0; i < Object.keys(result).length; i++) {
                //console.log(result[i].contentName)
                if(result[i].contentName === currentQuiz) timetodo++;
              }
            }
            MongoClient.connect(url, function(err, db) {
              if (err) throw err;
              var dbo = db.db(mydatabase);
              var myobj = { 
                timetodo:timetodo+1,
                times: new Date().toLocaleString(), 
                email: person.email,
                role:person.role,
                contentName:currentQuiz,
                scoreLV1:scoreLV1,
                scoreLV2:scoreLV2,
                scoreLV3:scoreLV3,
                lang:lang,
                code:code,
                output:dataOut,
                ImproveResult:ImproveResult,
                Improvevariable:Improvevariable,
                expResult:expResult,
                ADRI:ADRI,
                ADRI_Answer:ADRI_Answer
              };
              dbo.collection("StudentAnswer").insertOne(myobj, function(err, res) {
                if (err) throw err;
                db.close();
              });
            });
          });
        });

    });/** compiler */

  try {

      res.redirect('/course')    
  } catch (error) {
    next(error);
  }
});

module.exports = router;