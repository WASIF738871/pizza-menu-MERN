import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

import { paginate, docList, toJSON } from './plugins/index.js';
import { cryptoUtils } from '../utils/index.js';

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'fist_name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      // match: [/^\S+@\S+\.\S+$/, 'email is invalid'],
      validate: [validator.isEmail, 'email is invalid'],
    },
    password: {
      type: String,
      required: [true, 'Please provide password.'],
      minlength: [8, 'Password length must be greater or equal 8'],
      maxlength: [15, 'Max assword length must be lesser or equal 15'],
      private: true, // used by the toJSON plugin
    },
    confirmPassword: {
      type: String,
      required: [true, 'Please confirm password.'],
      validate: {
        // This only works on SAVE!
        validator: function (value) {
          return value === this.password;
        },
        message: 'Confirm password does not match',
      },
    },
    profileImage: {
      type: String,
      default: 'default.jpg',
    },
    isEmailVerified: {
      type: String,
      default: false,
    },
    role: {
      type: String,
      enum: ['user', 'guide', 'lead-guide', 'admin'],
      default: 'user',
    },
    changedPasswordAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      private: true,
    },
  },
  {
    timestamps: true,
  },
);

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);
userSchema.plugin(docList);

// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (this.isModified('password') || !this.isNew) {
    this.password = await bcrypt.hash(this.password, 10);
    this.confirmPassword = undefined;
  }
  next();
});

userSchema.pre('save', function (next) {
  if (this.isModified('password') || !this.isNew) {
    this.changedPasswordAt = Date.now() - 1000;
  }
  next();
});

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const hashedPassword = this.password;
  return await bcrypt.compare(candidatePassword, hashedPassword);
};

userSchema.methods.changePasswordAfterTokenIssued = function (JwtTimestamp) {
  if (this.changedPasswordAt) {
    const changedTimestamp = parseInt(this.changedPasswordAt.getTime() / 1000, 10);
    return changedTimestamp > JwtTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = async function () {
  const resetToken = cryptoUtils.createRandomString();
  this.passwordResetToken = cryptoUtils.createHash(resetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  await this.save({ validateBeforeSave: false });
  return resetToken;
};

userSchema.statics.isEmailTaken = async function (email) {
  const user = await this.findOne({ email });
  return !!user;
};

const User = mongoose.model('User', userSchema);

export default User;
