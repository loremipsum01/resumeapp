//API
var express = require('express');
var app = express();
var path = require('path');
var multer = require('multer');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var passport = require('passport');
var passportJWT = require('passport-jwt');
var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

//pre-Route
var user = require('./models/user');
var resumes = require('./models/resume');
var indexRouter = require('./routes/index');
var managerRouter = require('./routes/managerLogin');
var resumeRouter = require('./routes/resumeRouter');
var dbConnectionRouter = require('./routes/dbConnection');

//API use
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.set('superSecret', "secret");
app.use(logger('dev'));

//ROUTES
app.use('/', indexRouter);
app.use('/dashboard', managerRouter);
app.use('/success', resumeRouter);
app.use('/dbConnection', dbConnectionRouter);


// EJS view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//app.engine('html', require('ejs').renderFile);


//Multer Uploading for resume-pdf
var storage = multer.diskStorage({
    destination: './fileUploads/',
    filename: function (req, file, callback){
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({
    storage: storage,
    limits:{fileSize: 99999} //filesize of 99kb
}).single('resumeFile');


//Upload new Applicant to Database
app.post('/submit', (req, res) => {

        //upload file first
    upload(req, res, (err) => {
        if(err){
            res.redirect('/');
            console.log(err);
        } else {
            if(req.file == undefined){
                res.redirect ('/');
                console.log('Error: No file selected!');
            }else {
                //upload info to database
                console.log("Processing... Will store applicants details in database");
                resumes.forge({
                    firstName: req.body.firstName,
                    lastName: req.body.lastName,
                    email: req.body.email,
                    position: req.body.position,
                    resumeLink: req.file.filename
                }).save(null, {method: 'insert'})
                .then(function (savedModel) {})
                .then(
                    //Redirect to Thank you Page
                    //console.log('Stored in database successfully, go back to angularjs').
                    //res.json("Application recieved")
                    res.redirect('/success'));
            }
        }
    });        
});

//Manager Login
app.post('/login', async function (req, res, next) {
    // var loginData = req.body;
    console.log("I got here - Wanna verify password");
    var jwtOptions = {}
    jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
    jwtOptions.secretOrKey = 'galaxyWarp';
    
    //check existence of a user
    var User = await user.where('username', req.body.username).fetch().then(user => {
        return user;
    });

    var strategy = new JwtStrategy(jwtOptions, async function (jwt_payload, next) {
        if (User) {
            next(null, User);
        } else {
            next(null, false);
        }
    });

    passport.use(strategy);

    //console.log("The hash is "+bcrypt.hashSync("manager1", 10));
    
    if (bcrypt.compareSync(req.body.password, User.attributes.password)) {
        var payload = {
            id: User.id
        };
        //if username and password is correct
        //create token
        var token = jwt.sign(payload, jwtOptions.secretOrKey, {
            expiresIn: 86400 //expires in 24hours
        });

        res.json({
            success: true,
            message: 'Enjoy your stay!',
            token: token
        });
        //return correct response to angular
        console.log('Correct password');
        console.log("Going back to Angular");

    } else {
        //return RESPONSE  of incorrect to angular
        res.json({
            success: false, 
            message: 'Authentication failed. Wrong password.'
        });
        console.log('Incorrect Password'); 
    }
});


//Display PDF in Manager Dashboard
app.get('/resumeRender/:link', function (req, res, next) {
    
    console.log("Req DATA: " + req.data);
    console.log("Res DATA: " + res.data);
    /*if (!token) {
        res.redirect('/');
    } */
    var filename = req.params.link;
    res.sendFile(path.join(__dirname + '/fileUploads/' + filename))
})


//Logout
app.get('/logout', function (req, res, next) {
    token = undefined;
    //Logout and redirect to home page
    req.logout()
    res.redirect('/')
});

module.exports = app;

//Open port
app.listen(8000, function(){
    console.log("Server started on port 8000 and running...");
});