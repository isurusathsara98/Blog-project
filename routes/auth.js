const express=require('express');
const {requireAuth} = require('../middleware/authmiddleware');
const authController=require('../controllers/auth');

const router=express.Router();

router.post('/register', authController.register);

router.post('/login',authController.login);
router.get('/logout',authController.logout);
router.post('/edit',requireAuth ,authController.edit);
router.post('/upload',requireAuth ,authController.upload);
router.post('/editpost',requireAuth ,authController.editpost);
router.post('/delete',requireAuth ,authController.delete);
module.exports= router;