import { model, Schema } from 'mongoose'

export interface IUser {
  username: string
  password: string
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }
})

export default model<IUser>('user', userSchema)
