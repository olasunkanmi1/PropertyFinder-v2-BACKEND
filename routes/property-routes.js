import express from 'express';
import { getSavedProperties, saveProperty, unsaveAllProperties, unsaveProperty } from '../controllers/property-controller.js'

const router = express.Router();

router.route('/').post(saveProperty).get(getSavedProperties).delete(unsaveAllProperties)
router.route('/:externalID').delete(unsaveProperty)

export default router