const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')


morgan.token('content', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

let persons = [
    { 
        name: 'Arto Hellas', 
        number: '040-123456',
        id: 1 
    },
    { 
        name: 'Martti Tienari', 
        number: '040-123456', 
        id: 2
    },
    { 
        name: 'Arto Järvinen', 
        number: '040-123456', 
        id: 3
    },
    { 
        name: 'Lea Kutvonen', 
        number: '040-123456', 
        id: 4
    }
]

let date = new Date()

app.get('/info', (request, response) => {
    response.send(`<div><p>Puhelinluettelossa on ${persons.length} henkilön tiedot</p><p>${date}</p></div>`)
})
  
app.get('/api/persons', (request, response) => {
    response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)
    if ( person ) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})



app.post('/api/persons', (request, response) => {
    const body = request.body

    if (body.name === undefined) {
        return response.status(400).json({error: 'Name missing'})
    }

    if (body.number === undefined) {
        return response.status(400).json({error: 'Number missing'})
    }

    let nimet = persons.map(i => i.name)
    if (nimet.includes(body.name)) {
        return response.status(400).json({error: 'Name already in list'})        
    }
    
    const person ={
        name: body.name,
        number: body.number,
        id: Math.floor(Math.random() * Math.floor(10000))
    }

    console.log(person)
    persons = persons.concat(person)
    response.json(person)
})
  
const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})