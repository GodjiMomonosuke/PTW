const express = require('express');
const createHttpError = require('http-errors');
const morgan = require('morgan');
const mongoose = require('mongoose');
require('dotenv').config();
const session = require('express-session');
const connectFlash = require('connect-flash');
const passport = require('passport');
const connectMongo = require('connect-mongo');
const { ensureLoggedIn } = require('connect-ensure-login');
const { roles } = require('./utils/constants');
var path = require('path');
var cookieParser = require('cookie-parser');

// Initialization
const app = express();
app.use(morgan('dev'));
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const MongoStore = connectMongo(session);
// Init Session
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // secure: true,
      httpOnly: true,
    },
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// For Passport JS Authentication
app.use(passport.initialize());
app.use(passport.session());
require('./utils/passport.auth');

app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Connect Flash
app.use(connectFlash());
app.use((req, res, next) => {
  res.locals.messages = req.flash();
  next();
});

// Routes
app.use('/', require('./routes/index.route'));
app.use('/auth', require('./routes/auth.route'));

app.use('/admin',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureAdmin,
  require('./routes/admin.route')
);
// ****** student ******** // 
app.use('/course',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/course/course.route')
);
/** project */
app.use('/project',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/project/project.route')
);
app.use('/project-Tic_Tac_Toe',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/project/1_TicTacToe.route')
);
app.use('/project-Library_System',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/project/2_LibrarySystem.route')
);
app.use('/project-Roshambo',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/project/3_Roshambo.route')
);
app.use('/project-Calendar',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/project/4_Calendar.route')
);
app.use('/project-Calculator',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/project/5_Calculator.route')
);
/** course  */
app.use('/course-Introduction',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/course/1_Introduction-course.route')
);
app.use('/course-String',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/course/2_String-course.route')
);
app.use('/course-Datatype',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/course/3_Datatype-course.route')
);
app.use('/course-Operators',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/course/4_Operators-course.route')
);
app.use('/course-Selection_Statement',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/course/5_1_Selection-course.route')
);
app.use('/course-Loop_Statement',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/course/5_2_Loop-course.route')
);
app.use('/course-Pointers',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/course/6_Pointers-course.route')
);
app.use('/course-Function',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/course/7_Function-course.route')
);
app.use('/course-Structure',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/course/8_Structure-course.route')
);
app.use('/course-Array',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/course/9_Array-course.route')
);
app.use('/course-InputOutput',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/course/10_InputOutput-course.route')
);
/** Quiz  */
app.use('/course-Introduction-quiz',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/quiz/1_Introduction-quiz.route')
);
app.use('/course-String-quiz',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/quiz/2_String-quiz.route')
);
app.use('/course-Datatype-quiz',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/quiz/3_Datatype-quiz.route')
);
app.use('/course-Operators-quiz',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/quiz/4_Operators-quiz.route')
);
app.use('/course-Selection_Statement-quiz',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/quiz/5_1_Selection-quiz.route')
);
app.use('/course-Loop_Statement-quiz',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/quiz/5_2_Loop-course-quiz.route')
);
app.use('/course-Pointers-quiz',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/quiz/6_Pointers-quiz.route')
);
app.use('/course-Function-quiz',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/quiz/7_Function-quiz.route')
);
app.use('/course-Structure-quiz',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/quiz/8_Structure-quiz.route')
);
app.use('/course-Array-quiz',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/quiz/9_Array-quiz.route')
);
app.use('/course-InputOutput-quiz',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureStudent,
  require('./routes/student/quiz/10_InputOutput-quiz.route')
);

// ****** teacher ******** // 
app.use('/class',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureTeacher,
  require('./routes/teacher/class.route')
);
app.use('/check',
  ensureLoggedIn({ redirectTo: '/auth/login' }),
  ensureTeacher,
  require('./routes/teacher/check.route')
);
// *************** // 

// 404 Handler
app.use((req, res, next) => {
  next(createHttpError.NotFound());
});

// Error Handler
app.use((error, req, res, next) => {
  error.status = error.status || 500;
  res.status(error.status);
  res.render('error_40x', { error });
});

// Setting the PORT
const PORT = process.env.PORT || 3000;

// Making a connection to MongoDB
mongoose
  .connect(process.env.MONGODB_URI, {
    dbName: process.env.DB_NAME,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('💾 connected...');
    // Listening for connections on the defined PORT
    app.listen(PORT, () => console.log(`🚀 @ http://localhost:${PORT}`));
  })
  .catch((err) => console.log(err.message));

// function ensureAuthenticated(req, res, next) {
//   if (req.isAuthenticated()) {
//     next();
//   } else {
//     res.redirect('/auth/login');
//   }
// }

function ensureAdmin(req, res, next) {
  if (req.user.role === roles.admin) {
    next();
  } else {
    req.flash('warning', 'you are not Authorized to see this route');
    res.redirect('/');
  }
}


function ensureTeacher(req, res, next) {
  if (req.user.role === roles.teacher) {
    next();
  } else {
    req.flash('warning', 'you are not Authorized to see this route');
    res.redirect('/');
  }
}function ensureStudent(req, res, next) {
  if (req.user.role === roles.student) {
    next();
  } else {
    req.flash('warning', 'you are not Authorized to see this route');
    res.redirect('/');
  }
}
