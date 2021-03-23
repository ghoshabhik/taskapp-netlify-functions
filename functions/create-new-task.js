
const mongoose = require('mongoose')
const axios = require('axios')

const Task = require('./models/task')

exports.handler = async (event, request, context) => {
    if (event.httpMethod == "POST") {
        let data = JSON.parse(event.body)
        data.actualHours = 0

        const mongodb_username = process.env.MONGODB_USER
        const mongodb_password = process.env.MONGODB_PASSWORD
        const mongodb_database = process.env.MONGODB_DATABASE


        const uri = `mongodb+srv://${mongodb_username}:${mongodb_password}@abhikatlasmumbaiin.16jmi.mongodb.net/${mongodb_database}?retryWrites=true&w=majority`;

        mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true })

        let dataToSave = new Task({
            taskName: data.taskName,
            taskCategory: data.taskCategory,
            plannedHours: data.plannedHours,
            actualHours: data.actualHours,
            taskDate: data.taskDate
        })

        let task = await dataToSave.save()
        console.log(task)
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
            },
            body: JSON.stringify(task)

        }
    } else {
        return {
            statusCode: 404,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
            },
            body: 'Get method not allowed'
        }
    }
}