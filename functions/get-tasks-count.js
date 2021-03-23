
const mongoose = require('mongoose')
const axios = require('axios')

const Task = require('./models/task')

exports.handler = async (event, request, context) => {

    const searchDate = event.queryStringParameters['date']
    const parsedDate = new Date(searchDate)

    const mongodb_username = process.env.MONGODB_USER
    const mongodb_password = process.env.MONGODB_PASSWORD
    const mongodb_database = process.env.MONGODB_DATABASE

   
    const uri = `mongodb+srv://${mongodb_username}:${mongodb_password}@abhikatlasmumbaiin.16jmi.mongodb.net/${mongodb_database}?retryWrites=true&w=majority`;

    mongoose.connect(uri, { useNewUrlParser: true,  useUnifiedTopology: true, useCreateIndex: true, useFindAndModify:true})
    
    let task = await Task.countDocuments({taskDate: parsedDate})
    let response = {
        count: task
    }
    return{
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Credentials': true
          },
        body: JSON.stringify(response)
        
    }
}