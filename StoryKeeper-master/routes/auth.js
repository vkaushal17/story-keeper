const express=require('express');
const router=express.Router()
const passport=require('passport')

//Login/Landing Page
// GET/
router.get('/google',passport.authenticate('google',{scope:['profile']}))

//Dashboard
//GET /dashboard
router.get('/google/callback',passport.authenticate('google',{failureRedirect:'/'}),
(req,res)=>{
    res.redirect('/dashboard')
})



// Logout user
// route /auth/logout

router.get('/logout',(req,res)=>{
    req.logout()

    res.redirect('/')
})
module.exports=router;