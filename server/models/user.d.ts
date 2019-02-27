import { Document, Model, model, Schema } from 'mongoose'

import * as C from 'Constants';

let UserSchema: Schema = new Schema({
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
  resetPasswordExpires: Date,
  verified: {
    type: Boolean,
    default: false
  },
  verifyToken: {
    type: String,
    default: crypto.randomBytes(16).toString('hex')
  },
  sessionToken: String,
  sessionExpires: Date
});

UserSchema.methods.comparePassword = function (password) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(password, this.password, function (err, isMatch) {
      if (err) reject(err);
      resolve(isMatch);
    });
  });
};

interface IUser extends Document {
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  profileImage: String,
  roles: C.roles,
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  verified: Boolean,
  verifyToken: String,
  sessionToken?: String,
  sessionExpires?: Date,
  comparePassword: (password: string) => Promise;
}

let UserModel: Model<IUser> = model<IUser>('User', UserSchema);

export = UserModel;