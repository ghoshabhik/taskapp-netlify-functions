
const axios = require('axios')


exports.handler = async (event, request, context) => {

    const weekDays = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
    const searchDate = event.queryStringParameters['date']
    const parsedDate = new Date(searchDate)
    const day = weekDays[parsedDate.getDay()]

    const airtable_key = process.env.AIRTABLE_API_KEY

    const config = {
        headers: { Authorization: `Bearer ${airtable_key}` }
    }
    const allDefaultTasksFromAirtable = await axios.get('https://api.airtable.com/v0/appnJyGDL7ilErfRQ/defaulttasks?view=Grid%20view', config)
    const respData = await allDefaultTasksFromAirtable.data
    let taskForDay = []
    taskForDay = respData.records.filter( data => data.fields.DayOfWeek == `${day}`)
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