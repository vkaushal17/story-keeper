const express=require('express');

const Users=require('../model/Users')
const Story=require('../model/story')
const router=express.Router()
const authenticate=require('../middleware/auth')


// Show add page
// GET/stories/add
router.get('/add',authenticate.ensureAuth,(req,res)=>{
    res.render('stories/add')
})

//Show a particular story
//GET /stories/:id
router.get('/:id',authenticate.ensureAuth,async(req,res)=>{
    try{
        let story=await Story.findById(req.params.id)
            .populate('user')
            .lean()
        if(!story){
            return res.render('error/404')
        }
        res.render('stories/show',{
            story
        })
    }
    catch(err){
        console.log(err)
        res.render('error/500')
    }
})

//process the add forms
//POST /stories

router.post('/',authenticate.ensureAuth,async (req,res)=>{
    try{
      
        
            req.body.user=req.user.id
            await Story.create(req.body)
            res.redirect('/dashboard');
       
    }
    catch(err){
        console.error(err)
        res.render('error/500')
    }
})

//Show all stories
// GET /stories

router.get('/',authenticate.ensureAuth,async (req,res)=>{
    try{
        const Stories=await Story.find({status:'public'})
            .populate('user')
            .sort({createdAt:'desc'})
            .lean()
        
        res.render('stories/index',{Stories})
    }
    catch(err){
        console.error(err)
        res.render('error/500')
    }
    
})

// show edit page
//GET /stories/edit/:id

router.get('/edit/:id',authenticate.ensureAuth,async (req,res)=>{
    
    try{
        const story= await Story.findOne({
            _id:req.params.id
        }).lean()
        if(!story)
        {
            return res.render('error/404')
        }
        if(story.user!=req.user.id){
            res.redirect('/stories');
        }else{
            res.render('stories/edit',{
                story,
            })
        }
    }
    catch(err){
        console.log(err)
        return res.render('error/500')
    }
})

// Update story
//PUT /stories/:id
router.put('/:id',authenticate.ensureAuth,async (req,res)=>{
    let story=await Story.findById(req.params.id).lean()
    
    try{
        if(!story)
        {
            return res.render('error/404')
        }
        if(story.user!=req.user.id)
        {
            res.redirect('/stories')
        }else
        {
            
            story=await Story.findByIdAndUpdate({_id:req.params.id},req.body,{
                new:true,
                runValidators:true
            })
            res.redirect('/dashboard')
        }
    }catch(err){
        console.log(err)
        return res.render('error/500')
    }
})
// delete story
// DELETE/story/:id
router.delete('/:id',authenticate.ensureAuth,async (req,res)=>{
    try{
        await Story.remove({_id:req.params.id})
        res.redirect('/dashboard')
    }catch(err){
        console.log(err)
        return res.render('error/500')
    }

})

// User stories
//GET /stories/user/:userId
router.get('/user/:userId',authenticate.ensureAuth,async (req,res)=>{
    try{
        const Stories= await Story.find({
            user:req.params.userId,
            status:'public'
        })
        .populate('user')
        .lean()
    
        res.render('stories/index',{
            Stories
        })
    }
    catch(err){
        console.log(err)
        res.render('error/500')
    }

})

module.exports=router;