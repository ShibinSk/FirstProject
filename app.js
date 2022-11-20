const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs=require('express-handlebars')
// const fileUpload=require('express-fileupload')
const db=require('./config/connection')
const session=require('express-session')
const Handlebars=require('handlebars')
const helpers = require('handlebars-helpers')();
const config = require('dotenv').config();
const swal=require('sweetalert2')
const multer=require('multer')




const indexRouter = require('./routes/UserRoutes/homeRoutes');
const menRouter =require('./routes/UserRoutes/menRoutes')
const adminRoutes=require('./routes/AdminRoutes/adminRoutes')
const adminloginRoutes=require('./routes/AdminRoutes/adminloginRoutes')
const addproductsRoutes=require('./routes/AdminRoutes/addproductsRoutes')
const daashbordRoutes=require('./routes/AdminRoutes/dashbordRoutes')
const loginRoutes=require('./routes/UserRoutes/loginRoutes')
const usersRoutes=require('./routes/AdminRoutes/usersRoutes')
const productdetailsRoutes=require('.//routes/UserRoutes/productdetailsRoutes')
const catagoryRoutes=require('./routes/AdminRoutes/catagoryRoutes')
const cartRoutes=require('./routes/UserRoutes/cartRoutes')
const userprofileRoutes=require('./routes/UserRoutes/userprofileRoutes')
const paymanetRoutes=require('./routes/UserRoutes/paymantRoutes')





// const usersRouter = require('./routes/users');

var app = express();




Handlebars.registerHelper("inc", (value)=>
{
    return parseInt(value) + 1;
});
Handlebars.registerHelper( "when",function(operand_1, operator, operand_2, options) {
  var operators = {
   'eq': function(l,r) { return l == r; },
   'noteq': function(l,r) { return l != r; },
   'gt': function(l,r) { return Number(l) > Number(r); },
   'or': function(l,r) { return l || r; },
   'and': function(l,r) { return l && r; },
   '%': function(l,r) { return (l % r) === 0; }
  }
  , result = operators[operator](operand_1,operand_2);

  if (result) return options.fn(this);
  else  return options.inverse(this);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



app.engine('hbs', hbs.engine({
  extname: 'hbs',
  defaultLayout: 'layout',
  layoutsDir: __dirname + '/views/layout/',
  partialsDir: __dirname + '/views/partials'
}))

app.use((req, res, next) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  next();
});
// app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
db.connect((err)=>{
if(err) console.log('Connection err'+err);
else console.log('Database Connected');
})
app.use(session({secret:'key',cookie:{maxAge:600000}}))


app.use('/Admin',adminRoutes);
app.use('/Admin',adminloginRoutes);
app.use('/Admin',addproductsRoutes);
app.use('/Admin',daashbordRoutes);
app.use('/Admin',usersRoutes)
app.use('/Admin',catagoryRoutes)

app.use('/', indexRouter);
// app.use('/users', usersRouter);





app.use('/User',menRouter)
app.use('/User',loginRoutes)
app.use('/User',productdetailsRoutes)
app.use('/User',cartRoutes)
app.use('/User',userprofileRoutes)
app.use('/User',paymanetRoutes)



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
