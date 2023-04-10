import express from 'express';
import { showCurrentUser, updateUser, updateUserPassword, updateUserImage, deleteUserImage } from '../controllers/user-controller.js'

const router = express.Router();

router.route('/').get(showCurrentUser).patch(updateUser)
router.route('/update-password').patch(updateUserPassword)
router.route('/update-photo').post(updateUserImage)
router.route('/update-photo/:public_id').delete(deleteUserImage)

export default router