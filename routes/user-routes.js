import express from 'express';
import { showCurrentUser, updateUserPassword, updateUser } from '../controllers/user-controller.js'

const router = express.Router();

router.route('/').get(showCurrentUser).patch(updateUser)
router.route('/update-password').patch(updateUserPassword)

export default router