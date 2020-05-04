// To - Do : 
    // Database ismi değiştirilecek


const express = require('express')
require('./db/mongoose')
const User = require('./models/user')
const Room = require('./models/room')
const bodyParser = require('body-parser')

const app = express()
const port = 3000
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended:true}))

// çalıştı
app.get('/users', async (req,res) => {
    User.find({}).then((users) =>{
        users.forEach(user => {
            delete user.password
        });
        res.send(users)
    }).catch((e)=>{
        res.status(500).send()
    }) 
})

// get selected user (VALIDATE)  çalıştı!
app.get('/users/name=:name/password=:password', async (req,res)=>{
    const _name = req.params.name
    console.log(_name)
    await User.find({name:_name, password:req.params.password}).then((user)=>{
        console.log("sa"+user)
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }).catch((e)=>{
        console.log(e)
        res.status(500).send()
    })
})
// çalıştı
app.post('/users', async(req , res) => {

    const user = new User(req.body)
    try {
        await user.save()
        res.status(201).send(user)
    } catch (e) {
        res.status(400).send(e)
    }
})
// çalıştı 
app.patch('/users/id=:id', async (req,res) => {
    try
    {
        const _id = req.params.id
        const user = await User.findByIdAndUpdate(_id, req.body ,{new : true , runValidators:true})
        if(!user){
            return res.status(404).send()
        }
        res.send(user)
    }
    catch(e)
    {
        console.log(e)
        res.status(400).send(e)
    }
} )

// Rooms api handlers 

app.post('/rooms', async (req , res) => {

    try {
        const room = new Room(req.body)
        await room.save()
        res.status(201).send(room)
    } catch (error) {
        res.status(400).send(e)
    }
})

app.get('/rooms', (req,res) => {
    Room.find({}).then((rooms) =>{
        rooms.forEach ((room) =>{
            delete room.password
        })
        res.send(rooms)
    }).catch((e)=>{
        res.status(500).send()
    })
})
app.patch('/rooms/id=:id', async (req,res) => {
    try
    {
        console.log(req.body)
        //const room = Room.findById(req.params.id)
        const room =await Room.findByIdAndUpdate(req.params.id, req.body,{new : true , runValidators:true})
        if(!room){
            return res.status(404).send()
        }
        res.send(room)
    }
    catch(e)
    {
        console.log(e)
        res.status(400).send(e)
    }
} )



app.listen(port, ()=> {
    console.log('Server is up on your port '+ port)
})

