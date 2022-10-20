const express = require('express')
const router =express.Router()

const UserModel =require('../Models/User')
const bcrypt =require('bcrypt')
const jwt =require('jsonwebtoken')

router.post('/login',async (req,res)=>{
    const user =await UserModel.findOne({email:req.body.email})
    if(!user)return res.send('Invalid email !!')
    const passwordVerfication =await bcrypt.compare(req.body.password,user.password)
    if(!passwordVerfication)return res.send('Invalid password')
    const token=  jwt.sign({_id:user._id},process.env.SECRET)

    user.password=undefined
    res.json({
        body:{
            user:user,
            token:token
        }
    })
})


module.exports =router
