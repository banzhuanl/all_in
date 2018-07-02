var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var morgan = require('morgan');
var config = require('config-lite')('config');
var session = require('express-session');
var connectMongo = require('connect-mongo');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var book = require('./routes/book');
var db = require('./mongodb/db.js');
var winston = require('winston');
var expressWinston = require('express-winston');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(morgan('dev'));   //dev日志格式
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.all('*', function(req, res, next){
	//跨域资源共享CORS
	res.header("Access-Control-Allow-Origin", req.headers.origin || '*');       //允许所有域名的脚本访问该资源,req.headers.origin,这个是浏览器自动添加的origin，本次请求来自哪个源（协议 + 域名 + 端口），服务器根据这个值，决定是否同意这次请求。
	res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");    //如果浏览器请求包括Access-Control-Request-Headers字段,那么这个字段就是必须的，表明服务器支持的所有头信息字段，不限于浏览器在"预检"中请求的字段。
	res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");   //必须，表明服务器支持的所有跨域请求的方法
  	res.header("Access-Control-Allow-Credentials", true); //可以带cookies,可选，默认情况下cookie不包括在CORS请求中
  	//Access-Control-Max-Age   可选，用来指定本次预检的有效期
	res.header("X-Powered-By", '3.2.1')    //安全起见，一般不让人看出来用什么框架，都会把这个改掉
	if (req.method == 'OPTIONS') {
	  	res.send(200);               //content-type不是one of the “application/x-www-form-urlencoded,multipart/form-data, or text/plain”
	} else {
	    next();
	    //next('route');         //略过其他路由函数
	    //next(err);             //forward to error handler
	}
});

const MongoStore = connectMongo(session);
app.use(session({
  name: config.session.name,
	secret: config.session.secret,          //用于对sessionID的cookie进行签名
	resave: true,                           //每次请求都设置session cookie
	saveUninitialized: false,               //无论有无session、cookie，都给默认的connect.sid
	cookie: config.session.cookie,               //仅仅sessionid保存在cookie中
	store: new MongoStore({
    url: config.url
  })
}))

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
// 
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/book',book);


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
