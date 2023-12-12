import express from 'express'
const router = express.Router()

import {registerStudent, loginStudent, updateStudent, registerProfessor,loginProfessor} from '../controllers/authController.js'
import { getResults } from '../controllers/resultController.js'

router.route('/registerStudent').post(registerStudent)
router.route('/loginStudent').post(loginStudent) 
router.route('/updateStudent/:email').patch(updateStudent)

router.route('/registerProfessor').post(registerProfessor)
router.route('/loginProfessor').post(loginProfessor)

router.route('/getResults').get(getResults)

export default router