var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// var config = require('../config')[process.env.NODE_ENV || 'development'];

var UserSchema = new mongoose.Schema({
    
    
  email: {
      type: String,
      lowercase: true,
      unique: true,
      required: true
  },

  password: {
    type: String,
    required: true
  },

  isActive: {
    type: Boolean,
    default: true
  },

  name: {
   first: {
     type: String,
   },
   last: {
     type: String
   },
  },
  

});

// Save user's hashed password
UserSchema.pre('save', function (next) {
    var user = this;
    if (this.isModified('password') || this.isNew) {
        bcrypt.genSalt(10, function (err, salt) {
            if (err) {
                return next(err);
            }
            bcrypt.hash(user.password, salt, function () {

            }, function (err, hash) {
                if (err) {
                    return next(err);
                }
                // saving actual password as hash
                user.password = hash;
                next();
            });
        });
    } else {
        return next();
    }
});

// compare two passwords

UserSchema.methods.comparePassword = function (pw, cb) {
    bcrypt.compare(pw, this.password, function (err, isMatch) {
        if (err) {
            return cb(err);
        }
        cb(null, isMatch);
    });
};

UserSchema.virtual('name.full').get(function () {
  var last = (this.name.last === undefined || this.name.last === null) ? '' : this.name.last;
  return this.name.first + ' ' + last;
});

UserSchema.set('toJSON', {virtuals: true});
UserSchema.set('toObject', {virtuals: true});


module.exports = mongoose.model('User', UserSchema);

// // ENTER A DUMMY USER for TESTING:
// mongoose.connect('mongodb://127.0.0.1:27017/smartboard', function (err) {
//   if (err) {
//     return console.error(err);
//   } else {
//     User =  mongoose.model('User', UserSchema);
//     var user0 = new User({
//       email: 'test@example.com',
//       password: 'qwerty',
//       name: {
//        first: 'Test',
//        last: 'User'
//       }
//     })
//     user0.save(function (err) {
//       if (err) console.log(err);
//     })
//   }
// });