
exports.handler = async (event, request, context) => {

    const weekDays = ['Sun','Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat' ]
    const months = ['Jan','Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul','Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const searchDate = event.queryStringParameters['date']
    const parsedDate = new Date(searchDate)
    const day = weekDays[parsedDate.getDay()]
    var diff = parsedDate.getDay()
    var weekStartDate = new Date(parsedDate.valueOf())
    weekStartDate.setDate(weekStartDate.getDate() - diff)
    let weekEndDate = new Date(parsedDate.valueOf())
    weekEndDate.setDate(weekEndDate.getDate() + 6 - diff)

    let response = {
        sentDate: parsedDate,
        dayOfWeek: parsedDate.getDay(),
        day: day,
        month: parsedDate.getMonth()+1,
        monthName: months[parsedDate.getMonth()],
        year: parsedDate.getFullYear(),
        formattedDate1: `${months[parsedDate.getMonth()]} ${parsedDate.getDate()}, ${parsedDate.getFullYear()}`,
        formattedDate2: `${parsedDate.getMonth()+1}/${parsedDate.getDate()}/${parsedDate.getFullYear()}`,
        weekStartDate: weekStartDate,
        weekEndDate: weekEndDate
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