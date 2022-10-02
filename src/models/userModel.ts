import bcrypt from 'bcrypt'
import mongoose from 'mongoose'

export interface IUser extends mongoose.Document {
  fName: string
  lName: string
  email: string
  password: string
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
    minlength: 10
  }
})

schema.pre('save', async function (next) {
  if (!this.isModified('password')) return next()
  const hash = await bcrypt.hash(this.password, 10)
  this.password = hash
  next()
})

const UserModel = mongoose.model<IUser>('User', schema)

export { UserModel }
