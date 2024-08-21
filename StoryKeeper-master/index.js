const express=require('express');
const dotenv=require('dotenv');
const session= require('express-session')
const connectDB=require('./config/db')
const exphbs=require('express-handlebars')
const methodOverride=require('method-override')
const morgan=require('morgan');
const indexRouter=require('./routes/indexrouter');
const path=require('path');
const passport=require('passport')
const MongoStore=require('connect-mongo')(session)
const mongoose=require('mongoose')

//Load config
dotenv.config({path:'./config/config.env'})
// Passport Config
require('./config/passport')(passport)



connectDB()

const app=express()
//Body parser

app.use(express.urlencoded({extended:false}))
app.use(express.json())

//Method override
app.use(methodOverride(function(req,res){
    if(req.body && typeof req.body ==='object' && '_method' in req.body){
        //look in urlencoded POST bodies and delete it
        let method =req.body._method
        delete req.body._method
        return method
    }
}))

//Logging
if(process.env.NODE_ENV==='development'){
    app.use(morgan('dev'))
}
//Handlebars helpers
const { formatDate,stripTags,truncate,editIcon,select}=require('./helpers/hbs')


//Handlebars

app.engine('.hbs',exphbs({helpers:{
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select,
    },
    defaultLayout:'main',
    extname:'.hbs'}));
app.set('view engine','.hbs')

//Sessions

app.use(session({
    saveUninitialized:false,
    secret:'Vikash Kumar',
    resave:false,
    store:new MongoStore({mongooseConnection:mongoose.connection})

}))


//Passport Middleware
app.use(passport.initialize())
app.use(passport.session())


//set global var
app.use(function(req,res,next){
    res.locals.user=req.user || null;
    next()
})

//static folder

app.use(express.static(path.join(__dirname,'public')))  

//Routes
app.use('/',indexRouter);
app.use('/auth',require('./routes/auth'))
app.use('/stories',require('./routes/stories'))

const PORT=process.env.PORT||5000

app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV } mode on port ${PORT}`)
);