import express from 'express'
const router = express.Router()

import { addProject,updateProject,deleteProject } from '../controllers/projectController.js'

router.route('/addProject').post(addProject)
router.route('/deleteProject/:id').delete(deleteProject) 
router.route('/updateProject/:id').patch(updateProject)

export default router