'use strict';

const C = require('Constants');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let validatePassword = function (password) {
  return password && password.length >= 8 && /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/.test(password);
};

let UserSchema = new Schema(
  {
    firstName: {
      type: String,
      trim: true,
      required: 'Please fill in your first name'
    },
    lastName: {
      type: String,
      trim: true,
      required: 'Please fill in your last name'
    },
    email: {
      type: String,
      trim: true,
      unique: true,
      lowercase: true,
      required: 'Please fill in an email',
      match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: 'Please fill in a password',
      validate: [
        validatePassword,
        'Password must contain an uppercase, lowercase, and a digit and be atleast 8 characters.'
      ]
    },
    profileImage: {
      type: String,
      default: 'placeholder.png' // use a folder called imgs/profiles/placeholder.png
    },
    roles: {
      type: [
        {
          type: String,
          enum: C.roles
        }
      ],
      default: [C.roles[1]]
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
  },
  { toJSON: { virtuals: true } }
);

UserSchema.virtual('fullName').get(function () {
  return `${this.firstName} ${this.lastName}`;
})

/**
 * Password hashing
 */
UserSchema.pre('save', function (next) {
  let user = this;
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function (err, salt) {
    bcrypt.hash(user.password, salt, null, function (err, hash) {
      user.password = hash;
      next();
    });
  });
});

/**
 * Password compare
 */
UserSchema.methods.comparePassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function (err, isMatch) {
      if (err) reject(err);
      resolve(isMatch);
    });
  });
};

let User = mongoose.model('User', UserSchema);

module.exports = User;