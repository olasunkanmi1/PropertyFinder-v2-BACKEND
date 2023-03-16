import express from 'express';
import { getSavedProperties, saveProperty } from '../controllers/property-controller.js'

const router = express.Router();

router.route('/').post(saveProperty).get(getSavedProperties)

export default router