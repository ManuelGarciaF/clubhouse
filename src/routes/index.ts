import express from 'express'
import * as userController from '../controllers/userController'
import type { Request, Response } from 'express'

const router = express.Router()

router.get('/', function (_req: Request, res: Response) {
  res.render('index')
})

// Register
router.get('/register', userController.userCreateGet)
router.post('/register', userController.userCreatePost)

// Login
router.get('/login', userController.userLoginGet)
router.post('/login', userController.userLoginPost)

export default router
