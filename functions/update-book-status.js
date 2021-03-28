
const axios = require('axios')

exports.handler = async (event, request, context) => {

    const id = event.queryStringParameters['id']
    const status = event.queryStringParameters['status']
    const airtable_key = process.env.AIRTABLE_API_KEY

    const config = {
        headers: { Authorization: `Bearer ${airtable_key}` }
    }
    const url = 'https://api.airtable.com/v0/appnJyGDL7ilErfRQ/books';
    const body = {
        records: [
            {
                id: id,
                fields: {
                    Status: status
                }
            }
        ]
    }
    let res = await axios.patch(url, body, config)
    
    const respData = await res.data

    return{
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE'
          },
        body: JSON.stringify(respData)
    }
}