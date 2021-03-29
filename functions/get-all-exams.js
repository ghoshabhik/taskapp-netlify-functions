
const axios = require('axios')

exports.handler = async (event, request, context) => {


    const airtable_key = process.env.AIRTABLE_API_KEY

    const config = {
        headers: { Authorization: `Bearer ${airtable_key}` }
    }
    const allExamsFromAirtable = await axios.get('https://api.airtable.com/v0/appnJyGDL7ilErfRQ/exams?view=Grid%20view', config)
    const respData = await allExamsFromAirtable.data
    let exams = []
    console.log(respData)
    respData.records.forEach( exam => {
        exams.push({
            name: exam.fields.ExamName,
            remainingDays: exam.fields.RemainingDays,
            noOfTopics: exam.fields.NoOfTopics,
            noOfTopicsCompleted: exam.fields.NoOfTopicsCompleted,
            noOfTopicsNotCompleted: exam.fields.NoOfTopics - exam.fields.NoOfTopicsCompleted,
            totalHoursPlanned: exam.fields.TotalPlannedStudyHours
        })
    })
    return{
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
          },
        body: JSON.stringify(exams)
    }
}