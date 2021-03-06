
const mongoose = require('mongoose')
const axios = require('axios')

const Task = require('./models/task')

exports.handler = async (event, request, context) => {

    const weekDays = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
    const searchDate = event.queryStringParameters['date']
    const parsedDate = new Date(searchDate)
    const day = weekDays[parsedDate.getDay()]

    const mongodb_username = process.env.MONGODB_USER
    const mongodb_password = process.env.MONGODB_PASSWORD
    const mongodb_database = process.env.MONGODB_DATABASE
    const airtable_key = process.env.AIRTABLE_API_KEY

    const uri = `mongodb+srv://${mongodb_username}:${mongodb_password}@abhikatlasmumbaiin.16jmi.mongodb.net/${mongodb_database}?retryWrites=true&w=majority`;

    const config = {
        headers: { Authorization: `Bearer ${airtable_key}` }
    }
    const allDefaultTasksFromAirtable = await axios.get('https://api.airtable.com/v0/appnJyGDL7ilErfRQ/defaulttasks', config)
    const respData = await allDefaultTasksFromAirtable.data
    var taskForDay = []
    taskForDay = respData.records.filter( data => data.fields.DayOfWeek == `${day}`)
    // console.log(taskForDay)
    
    // mongoose.connect(uri, { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:true})
    // const messages = await Message.find().sort({ "timeStamp": 1 })

    return{
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
          },
        body: JSON.stringify(taskForDay)
        
    }
}