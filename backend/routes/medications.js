import express from 'express'
import { getMedications, addMedication, deleteMedication, updateMedication } from '../controllers/medsController.js'
import { authenticate } from '../middleware/authMiddleware.js'



const router = express.Router()

router.use(authenticate)

router.get('/', getMedications)
router.post('/', addMedication)
router.delete('/:id', deleteMedication)
router.put('/:id', updateMedication)

export default router
