let restify = require('restify');
let appServer = restify.createServer();
let bodyParser = require('body-parser');
let userservice = require('./controller/UserService');
let config = require('config');
const corsMiddleware = require('restify-cors-middleware')

//Origin, allowHeaders, exposeHeaders values needs tobe changed
const cors = corsMiddleware({
  origins: ['*'],
  allowHeaders: ['API-Token'],
  exposeHeaders: ['API-Token-Expiry']
})

//parse application/json and look for raw text                                        
appServer.use(bodyParser.json());
appServer.use(bodyParser.urlencoded({ extended: true }));
appServer.use(bodyParser.text());
appServer.use(bodyParser.json({ type: 'application/json' }));

appServer.pre(cors.preflight);
appServer.use(cors.actual);

appServer.get("/", (req, res) => res.json({ message: "Welcome to our MyApp!" }));

//FunctionLibrary - user services (user jwt implementation)
appServer.post('/authenticate', userservice.authenticate);
appServer.get('/user', userservice.getuser);
appServer.post('/user', userservice.postuser);
appServer.get('/forgotpassword/:email_address', userservice.getforgotPassword);

//route middleware for jwt
var Router = require('restify-router').Router;
var routerInstance = new  Router();
routerInstance.applyRoutes(appServer);


module.exports = appServer; 
