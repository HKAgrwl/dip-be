import express from 'express'
const router = express.Router()

import { getResults } from '../controllers/resultController.js'

router.route('/getResults').get(getResults)

export default router