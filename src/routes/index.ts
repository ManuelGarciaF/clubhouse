import express from 'express'
import * as userController from '../controllers/userController'
import type { Request, Response } from 'express'

const router = express.Router()

router.get('/', function (_req: Request, res: Response) {
  res.render('index')
})

router.get('/register', userController.userCreateGet)
router.post('/register', userController.userCreatePost)

export default router
