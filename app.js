/**
  *Module Dependencies
  */
const config = require('./config'),
 restify = require('restify'),
 errors = require('restify-errors'),
 mongoose = require('mongoose'),
 restifyPlugins = require('restify-plugins'),
 fs = require("fs"),
 ObjectId = mongoose.Types.ObjectId,
 jwt = require("jsonwebtoken");
 
 
/**
  * Initialize Server
  */
const server = restify.createServer({
        name: config.name,
        version: config.version,
});

/**
  * Restify Plugins For Middleware 
  */
server.use(restifyPlugins.jsonBodyParser({ mapParams: true }));
server.use(restifyPlugins.acceptParser(server.acceptable));
server.use(restifyPlugins.queryParser({ mapParams: true }));
server.use(restifyPlugins.fullResponse());
server.use(restifyPlugins.throttle({burst:100,rate:50,ip:true}));


/**
  * Start Server, Connect to DB & Require Routes
  */
server.listen(config.port, () => {
        // establish connection to mongodb
        mongoose.Promise = global.Promise;
        mongoose.connect(config.db.uri, { useMongoClient: true });

        const db = mongoose.connection;

        db.on('error', (err) => {
            console.error(err);
            process.exit(1);
        });

        db.once('open', () => {
            console.log(`Server is listening on port ${config.port}`);
        });
});

/**
  * Obtaining Public Key
  */
var cert = fs.readFileSync('./keys/public.pem');

/**
  * Getting users model
  */
var User = require('./models/user');

/**
  * Token Verifier Middleware
  */
function verifyToken(req, res, next) {
  var token = req.headers['x-auth-token'];
  if (!token){
     return next(
				new errors.UnauthorizedError("No token provided.") //403
			); 
  }
  User.findOne({token: token}, function(err, user) {
    if (err){
        return next(
				new errors.InternalServerError("Invalid Token provided") //500
			); 
    }
    if (!user) {
      return next(
				new errors.InvalidContentError("Invalid user")
			);
    }
  jwt.verify(token, cert, function(err, decoded) {
    if (err){
        return next(
				new errors.InternalServerError("Failed to authenticate token.") //500
			); 
    }
    // if everything good, save to request for use in controllers
    req.userId = decoded._id,
    req.username = decoded.user,
    req.Admin = decoded.isAdmin;
    next();
    });
  });
}
 

/**
  * Getting Controllers
  */
var audi = require('./controllers/audi'),
    auth = require('./controllers/auth'),
    chpasswd = require('./controllers/chpasswd'),
    logout = require('./controllers/logout'),
    request = require('./controllers/request'),
    user = require('./controllers/user');
    
    

/**
  * Landing Page
  */
server.get('/', function indexHTML(req, res, next) {
    fs.readFile(__dirname + '/index.html', function (err, data) {
        if (err) {
            next(err);
            return;
        }

        res.setHeader('Content-Type', 'text/html');
        res.writeHead(200);
        res.end(data);
        next();
    });
});

/**
  * User Auth Endpoint
  */
server.post("/auth/login",auth.authUser);

/**
  * User change password
  */
server.put("/changepass",verifyToken, chpasswd.pass);
 
/**
  * Users
  */ 
server.get("/alluser" ,verifyToken , user.allUser);
server.get("/listuser" ,verifyToken , user.listUser);
server.post("/user" ,verifyToken , user.createUser);
//UPDATE server.put("/user/:id",verifyToken, user.updateUser);
server.del("/user/:id" ,verifyToken, user.deleteUser);
server.get({path: "/user/:id"} ,verifyToken , user.viewUser);

/**
  * Audi
  */ 
server.get("/listaudi" , audi.listAudi);
server.post("/audi" ,verifyToken , audi.createAudi);
server.get("/audi/:id/requests" ,verifyToken , audi.viewApproveRequest);
//UPDATE server.put("/audi/:id",verifyToken, audi.viewAudi);
server.del("/audi/:id" ,verifyToken , audi.deleteAudi);
server.get("/audi/:id" ,verifyToken , audi.viewAudi);


/**
  * Requests
  */ 
server.get("/allreq",verifyToken, request.allRequest);  
server.get("/listreq",verifyToken, request.listRequest);
server.post("/request",verifyToken, request.createRequest);
server.put("/request/:id",verifyToken, request.approveRequest);
server.del("/request/:id",verifyToken, request.deleteRequest);
server.get({path: "/request/:id"},verifyToken, request.viewRequest);
//server.get("/request/delold",verifyToken, request.delOldRequests);
 
/**
  * Logout
  */ 
server.get('/logout',verifyToken, logout.logout);
