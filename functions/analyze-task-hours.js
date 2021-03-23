
const mongoose = require('mongoose')
const axios = require('axios')

const Task = require('./models/task')

exports.handler = async (event, request, context) => {

    const searchStartDate = event.queryStringParameters['startDate']
    const parsedStartDate = new Date(searchStartDate)
    const searchEndDate = event.queryStringParameters['endDate']
    const parsedEndDate = new Date(searchEndDate)

    const mongodb_username = process.env.MONGODB_USER
    const mongodb_password = process.env.MONGODB_PASSWORD
    const mongodb_database = process.env.MONGODB_DATABASE

   
    const uri = `mongodb+srv://${mongodb_username}:${mongodb_password}@abhikatlasmumbaiin.16jmi.mongodb.net/${mongodb_database}?retryWrites=true&w=majority`;

    mongoose.connect(uri, { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:true})
    
    let tasks = await Task.find({"taskDate": {"$gte": parsedStartDate, "$lte": parsedEndDate}})

    const groupBy = (key, arr) =>  arr.reduce((cache, task) => 
    ({
        ...cache, [task[key]] : 
        task[key] in cache 
        ? cache[task[key]].concat(task)
        : [task]
    }), {})

    const groupedByCategory = groupBy('taskCategory', tasks)

    const allCategories = Object.keys(groupedByCategory)

    let phours = 0
    let ahours = 0
    let plannedHoursMap = {}
    let actualHoursMap = {}

    allCategories.forEach( cat => {
        phours = 0
        ahours = 0
        // console.log(groupedByCategory[cat])
        groupedByCategory[cat].forEach( item => {
            phours += item.plannedHours
            ahours += item.actualHours
        } )
        plannedHoursMap[cat] = phours
        actualHoursMap[cat] = ahours
    })

    phours = 0
    ahours = 0
    allCategories.forEach( cat => {
        phours += plannedHoursMap[cat]
        ahours += actualHoursMap[cat]
    })
    
    let response = {
        tasksGroupedByCategory: groupedByCategory,
        categories: allCategories,
        plannedHours: plannedHoursMap,
        actualHours: actualHoursMap,
        totalPlannedHours: phours,
        totalActualHours: ahours
    }

    return{
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
          },
        body: JSON.stringify(response)
        
    }
}