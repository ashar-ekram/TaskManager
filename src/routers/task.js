const express = require('express')
const Task = require('../models/task')
const auth = require('../middleware/auth')
const router = new express.Router()

router.post('/tasks', auth, async (req, res)=>{
    const task = new Task({
        ...req.body,
        author: req.user._id
    })
    // task.author = req.user._id

    try{
        await task.save()
        res.status(201).send(task)
    } catch(error){
        res.status(400).send(error)
    }
})

//GET /tasks?completed=false
router.get('/tasks', auth, async (req,res) => {
    const match = {}
    const sortBy = {}
    if(req.query.completed){
        match.completed = req.query.completed === 'true'
    }
    if(req.query.sortBy){
        const parts = req.query.sortBy.split(':')
        sortBy[parts[0]] = parts[1] === 'desc' ? -1 : 1
    }
    try{
        const temp = "createdAt"
        const tasks = await Task.find({author: req.user._id, completed: match.completed}).sort( sortBy ).limit(Number(req.query.limit)).skip(Number(req.query.skip))
        res.send(tasks)
        // await req.user.populate('tasks').execPopulate()
        // res.send(req.user.tasks)
    } catch(error){
        res.status(500).send(error)
    }
})

router.get('/tasks/:id', auth, async (req,res)=>{
    const _id = req.params.id
    try{
        // const task = await Task.findById(_id)
        const task = await Task.findOne({_id, author: req.user._id})

        if(!task){
            return res.status(400).send()
        }
        res.send(task)
    } catch(error){
        console.log(error.reason)
        res.status(500).send(error)
    }
})

router.patch('/tasks/:id', auth, async (req,res)=>{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'completed']
    const isValidOperation = updates.every((update)=>{
        return allowedUpdates.includes(update)
    })
    if(!isValidOperation){
        return res.status(400).send('Invalid Updates')
    }
    const id = req.params.id
    try{
        const task = await Task.findOne({_id: req.params.id, author: req.user._id})
        // const task = await Task.findById(_id)
        if(!task){
            return res.status(404).send()
        }
        updates.forEach((update)=>{
            task[update] = req.body[update]
        })
        await task.save()
        // const task = await Task.findByIdAndUpdate(_id, req.body, {new: true, runValidators: true})

        res.status(200).send(task)
    }catch(error) {
        res.status(400).send(error)
    }
})

router.delete('/tasks/:id', auth, async(req, res) => {
    try{
        // const task = await Task.findByIdAndDelete(req.params.id)
        const task = await Task.findOne({_id: req.params.id, author: req.user._id})
        if(!task){
            return res.send(404).send()
        }
        res.send(task)
    } catch(error){
        res.status(500).send()
    }
})

module.exports = router