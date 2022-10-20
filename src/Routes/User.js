const express = require('express')
//const User = require('../Models/User')
const router = express.Router()
const UserModel = require('../Models/User')
const Joi = require('@hapi/joi')
const bcrypt = require('bcrypt')
//const jwt=require('jsonwebtoken')
const verifyToken = require('./verifyjwt')


// router.get('/token',(req,res)=>{
//     const token=jwt.sign({_id:'123123'},process.env.SECRET)
//     res.send(token)
// })

router.get('/all', verifyToken, async (req, res) => {
    const users = await UserModel.find()
    try {
        res.send(users)
    }
    catch (err) {
        res.send(err)
    }

})

router.post('/add', async (req, res) => {

    const schema = {
        name: Joi.string().min(3).required(),
        email: Joi.string().min(5).email().required(),
        password: Joi.string().min(3).required()

    }
    const { error } = Joi.validate(req.body, schema)

    if (error) return res.send(error.details[0].message)

    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(req.body.password, salt)

    const user = new UserModel({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword
    })
    const save = await user.save()
    try {
        res.send(save)
    }
    catch (err) {
        res.send(err)
    }

})


router.get('/:id', verifyToken, async (req, res) => {
    const id = req.params.id

    const user = await UserModel.findById(id)
    try {
        res.send(user)
    }
    catch (err) {
        res.send(err)
    }

})


router.delete('/:id', verifyToken, async (req, res) => {
    const id = req.params.id
    const user = await UserModel.remove({ _id: id })

    try {
        res.send(user)
    }
    catch (err) {
        res.send(err)
    }
})

router.patch('/:id', verifyToken, async (req, res) => {
    const id = req.params.id

    const updatedUser = await UserModel.updateOne(
        { _id: id },
        {
            $set: req.body
        }
    )
    try {
        res.send(updatedUser)
    }
    catch (err) {
        res.send(err)
    }

})

module.exports = router