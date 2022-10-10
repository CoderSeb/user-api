import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  fName: string
  lName: string
  email: string
  password: string
  comparePassword: Function
}

const schema: mongoose.Schema<IUser> = new mongoose.Schema({
  fName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  lName: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  }
})

schema.pre('save', function (next) {
  let user: IUser = this
  if (!user.isModified('password')) return next()

  bcrypt.genSalt(10, function (err, salt) {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })
})

schema.methods.comparePassword = function (
  pass: string,
  callback: (err: Error | null, isMatch: boolean | null) => void
) {
  bcrypt.compare(pass, this.password, function (err, isMatch) {
    if (err) return callback(err, null)
    callback(null, isMatch)
  })
}

const UserModel = mongoose.model<IUser>('User', schema)

export { UserModel }
