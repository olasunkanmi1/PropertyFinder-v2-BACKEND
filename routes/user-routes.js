import express from 'express';
import { showCurrentUser, updateUser, updateUserPassword, updateUserImage } from '../controllers/user-controller.js'

const router = express.Router();

router.route('/').get(showCurrentUser).patch(updateUser)
router.route('/update-password').patch(updateUserPassword)
router.route('/update-photo').post(updateUserImage)

export default router