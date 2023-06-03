import { Router } from "express";
import *  as user_controller from './user.controller.js'
import { validation } from './../../middleware/validation.js';
import { loginValidation, resetPasswordvalidation, signupValidation } from "./user.validation.js";
import { errorHandling } from './../../utils/errorhandling.js';
import { auth } from './../../middleware/Authintication.js';
import { multerFunction, multerFunctionCoudinary, validationObject } from "../../services/multer.js";

const router= Router();
router.post('/signup',multerFunction({filevalidation:validationObject.image,customPath:'user/profile'}).single('image'),validation(signupValidation) , errorHandling(user_controller.signup));
router.patch('/cloudinary', auth(),multerFunctionCoudinary({filevalidation:validationObject.image}).single('image'),errorHandling(user_controller.uploadCloudinary))
router.get('/confirmemail/:token',errorHandling( user_controller.confirmemail))
router.post('/login',validation(loginValidation),errorHandling( user_controller.login));
router.post('/forgetpassword',errorHandling(user_controller.forgetPassword) );
router.post ('/resetpass/:userid',validation(resetPasswordvalidation),errorHandling(user_controller.resetPassword))
router.post('/changepass', auth(), errorHandling(user_controller.changePassword))
router.patch('/update',auth(), errorHandling(user_controller.updateprofile))
router.delete('/softdelet',auth(),errorHandling(user_controller.softDelete))
router.delete('/delete',auth(),errorHandling(user_controller.deleteUser))
router.patch('/logout',auth(),errorHandling(user_controller.logout))






export default router