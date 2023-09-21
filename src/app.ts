import createError from 'http-errors'
import express from 'express'
import path from 'path'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import type { Request, Response, NextFunction } from 'express'
import type { HttpError } from 'http-errors'

import indexRouter from './routes/index'

const app = express()

dotenv.config()

// Connect to mongodb
if (process.env.MONGODB_USER === undefined || process.env.MONGODB_PASS === undefined) {
  console.error('MONGODB_USER or MONGODB_PASS is undefined')
  process.exit(1)
}
const MONGO_URI = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASS}@cluster0.e902pw3.mongodb.net/clubhouse?retryWrites=true&w=majority`
const main = async (): Promise<void> => {
  await mongoose.connect(MONGO_URI)
  console.log('Connected to mongodb')
}
main().catch(console.error)

// View engine setup
app.set('views', path.resolve(__dirname, '../views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.resolve(__dirname, '../public')))

app.use('/', indexRouter)

// Catch 404 and forward to error handler
app.use((_req: Request, _res: Response, next: NextFunction): void => {
  next(createError(404))
})

// Error handler
app.use((err: HttpError, req: Request, res: Response, _next: NextFunction): void => {
  // Set locals, only providing errors in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}

  // Render the error page
  res.status((err.status === undefined) ? err.status : 500)
  res.render('error')
})

app.listen(3000)
console.log('Server listening on port 3000')
