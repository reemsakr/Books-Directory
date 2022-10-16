const express =require('express')
const Book = require('../Models/Book')
const router=express.Router()
const BookModel =require('../Models/Book')
const Joi =require('@hapi/joi')
const bcrypt =require('bcrypt')
const jwt=require('jsonwebtoken')
const verifyToken =require('./verifyjwt')


// router.get('/token',(req,res)=>{
//     const token=jwt.sign({_id:'123123'},process.env.SECRET)
//     res.send(token)
// })

router.get('/all', verifyToken , async (req,res)=>{
    const books=await BookModel.find()
    try{
        res.send(books)
    }
    catch(err){
        res.send(err)
    }
    
})

router.post('/add',verifyToken,async (req,res)=>{
    
        const schema={
        name :Joi.string().min(3).required(),
        author_id:Joi.string().min(3).required(),
    

    }
    const {error} =  Joi.validate(req.body,schema)

    if(error)return res.send(error.details[0].message)
    
    
    const book=new BookModel({
        name:req.body.name,
        author_id:req.body.author_id
    })
    const save=await book.save()
    try{
        res.send(save)
    }
    catch(err){
        res.send(err)
    }
    
})


router.get('/:id',verifyToken,async(req,res)=>{
            const id=req.params.id

            const book= await BookModel.findById(id)
            try{
                res.send(book)
            }
            catch(err){
                res.send(err)
            }

})


router.delete('/:id',verifyToken,async(req,res)=>{
    const id=req.params.id
    const book=await BookModel.remove({_id:id})

    try{
        res.send(book)
    }
    catch(err){
        res.send(err)
    }
})

router.patch('/:id',verifyToken,async(req,res)=>{
    const id=req.params.id

    const updatedBook=await BookModel.updateOne(
        {_id:id},
        {
            $set: req.body
        }
    )
    try{
        res.send(updatedBook)
    }
    catch(err){
        res.send(err)
    }

})

module.exports= router