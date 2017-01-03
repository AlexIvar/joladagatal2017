var mongojs = require('mongojs');
var db = mongojs('mongodb://alexivar:sisenjor94@ds139288.mlab.com:39288/historymakers_db', ['users']);
var LocalStrategy   = require('passport-local').Strategy;
var bCrypt = require('bcrypt-nodejs');

module.exports = function(passport){

	// Passport needs to be able to serialize and deserialize users to support persistent login sessions
	passport.serializeUser(function(user, done) {
		console.log('serializing user:',user[0].username);
		done(null, user[0]._id);
	});

	passport.deserializeUser(function(id, done) {
    console.log("trying to deserialize");
		db.users.find({_id: mongojs.ObjectId(id)}, function(err, user) {
			console.log('deserializing user:',user.username);
			done(err, user);
		});
	});

	passport.use('login', new LocalStrategy({
			passReqToCallback : true
		},
		function(req, username, password, done) {
			// check in mongo if a user with username exists or not
			db.users.find({"username": username},
				function(err, user) {
          console.log(user[0]);
					// In case of any error, return using the done method
					if (err){
          console.log("error!!!!!!!!");
						return done(err);
          }
					// Username does not exist, log the error and redirect back
					if (!user[0]){
						console.log('User Not Found with username '+username);
						return done(null, false);
					}
					// User exists but wrong password, log the error
					if (!isValidPassword(user[0], password)){
						console.log('Invalid Password');
						return done(null, false); // redirect back to login page
					}
					// User and password both match, return user from done method
					// which will be treated like success
          console.log("doneeee");
					return done(null, user);
				}
			);
		}
	));

  passport.use('signup', new LocalStrategy({
    passReqToCallback : true // allows us to pass back the entire request to the callback
  },
  function(req, username, password, done) {
    var test = [];
    // find a user in mongo with provided username
    db.users.find({ "username" :  username }, function(err, user) {
      // In case of any error, return using the done method
      if (err){
        console.log('Error in SignUp: '+err);
        return done(err);
      }
      // already exists
      if (user.length != 0) {
        console.log('User already exists with username: '+username);
        return done(null, false);
      } else {
        // if there is no user, create the user
        var newUser = {username:'', password:''};

        // set the user's local credentials
        newUser.username = username;
        newUser.password = createHash(password);

        console.log(newUser.username + " " + newUser.password);

        // save the user
        db.users.save(newUser, function(err, docs) {
          if (err){
            console.log('Error in Saving user: '+err);
            throw err;
          }
          console.log(newUser.username + ' Registration succesful');
          test.push(newUser);
          return done(null, test);
        });

      }

    });
  })
);

	var isValidPassword = function(user, password){
		return bCrypt.compareSync(password, user.password);
	};
	// Generates hash using bCrypt
	var createHash = function(password){
		return bCrypt.hashSync(password, bCrypt.genSaltSync(10), null);
	};

};
