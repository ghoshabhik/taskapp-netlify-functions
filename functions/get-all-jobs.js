
const axios = require('axios')

exports.handler = async (event, request, context) => {


    const airtable_key = process.env.AIRTABLE_API_KEY

    const config = {
        headers: { Authorization: `Bearer ${airtable_key}` }
    }
    const allJobsFromAirtable = await axios.get('https://api.airtable.com/v0/appnJyGDL7ilErfRQ/jobs?view=Grid%20view', config)
    const respData = await allJobsFromAirtable.data
    let jobs = []
    jobs = respData.records
    return{
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
          },
        body: JSON.stringify(jobs)
    }
}