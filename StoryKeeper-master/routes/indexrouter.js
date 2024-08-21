const express=require('express');
const Story=require('../model/story')
const indexRouter=express.Router()
const authenticate=require('../middleware/auth')


//Login/Landing Page
// GET/
indexRouter.get('/',authenticate.ensureGuest,(req,res)=>{
    res.render('login',{
        layout:'login'
    })
})

//Dashboard
//GET /dashboard
indexRouter.get('/dashboard',authenticate.ensureAuth,async (req,res)=>{
    try{
        const stories=await Story.find({user:req.user.id}).lean()
        res.render('dashboard',{
            name:req.user.firstName,
            stories
        })
    }
    catch(err){
        console.log(err)
        res.render('error/500')
    }
})

module.exports=indexRouter;