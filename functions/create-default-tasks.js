
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

    const config = {
        headers: { Authorization: `Bearer ${airtable_key}` }
    }
    const allDefaultTasksFromAirtable = await axios.get('https://api.airtable.com/v0/appnJyGDL7ilErfRQ/defaulttasks?view=Grid%20view', config)
    const respData = await allDefaultTasksFromAirtable.data
    let taskForDay = []
    taskForDay = respData.records.filter( data => data.fields.DayOfWeek == `${day}`)
    //console.log('from Airtable ----- ',taskForDay)
    const checkId = taskForDay[0].id
    console.log('check ID: ',taskForDay[0].id)
   
    const uri = `mongodb+srv://${mongodb_username}:${mongodb_password}@abhikatlasmumbaiin.16jmi.mongodb.net/${mongodb_database}?retryWrites=true&w=majority`;

    mongoose.connect(uri, { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:true})
    
    let tasks = [] 
    taskForDay.map(task => {
        tasks.push(
            new Task({
                taskName: task.fields.Name,
                taskCategory: task.fields.Category,
                plannedHours: task.fields.PlannedHours,
                actualHours: 0,
                taskDate: parsedDate,
                taskId: task.id
            })
        )
    })
    //console.log('to MongoDb ----- ',tasks)


    let checkTask = await Task.find({ $and: [{taskId: checkId}, {taskDate: parsedDate}]})
    console.log('Does it Exist? ---- ',checkTask)
    if(checkTask.length === 0 ){
        const addedTasks = await Task.insertMany(tasks)
        return{
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
              },
            body: JSON.stringify(addedTasks)
            //body: JSON.stringify({msg: 'ok'})
            
        }
    } else {
        return{
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
              },
            body: JSON.stringify(tasks)
            //body: JSON.stringify({msg: 'ok'})
            
        }
    }
    
}