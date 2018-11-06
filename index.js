const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const mongoose = require('mongoose')
const Person = require('./models/person')
require('dotenv').config()

morgan.token('content', function (req, res) { return JSON.stringify(req.body) })
app.use(morgan(':method :url :content :status :res[content-length] - :response-time ms'))
app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))


let date = new Date()

app.get('/', (req, res) => {
    res.send('/index.html')
  })

app.get('/info', (request, response) => {
    Person
    .countDocuments()
    .then(amount =>{
        response.send(`<div><p>Puhelinluettelossa on ${amount} henkilön tiedot</p><p>${date}</p></div>`)
    })
})
  

app.get('/api/persons', (request, response) => {
    console.log('database GET-request sent')
    Person
    .find({})
    .then(people => {
        console.log(people)
        response.json(people.map(Person.format))
//        mongoose.connection.close()
        })
    .catch(error => {
        console.log(error)
        response.status(404).end().send({ error: 'unable to load phonebook' })
    })    
    
})

app.get('/api/persons/:id', (request, response) => {
    console.log(request.params.id)
    Person
    .findById(request.params.id)
    .then(person =>{
        if ( person ) {
            response.json(Person.format(person))
        } else {
            response.status(404).end()
        }
    })
    .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
      })

})

app.delete('/api/persons/:id', (request, response) => {
    console.log(request.params.id)
    Person
    .findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => {
      response.status(400).send({ error: 'malformatted id' })
    })
})

app.post('/api/persons', (request, response) => {
    const body = request.body
    console.log(body)

    if (body.name === undefined) {
        return response.status(400).json({error: 'Name missing'})
    }

    if (body.number === undefined) {
        return response.status(400).json({error: 'Number missing'})
    }

    else{
        Person
        .find({name: body.name})
        .then(result =>{
            if(result.lentgh !==0){
                return response.status(400).json({error: 'Person already exists in database'})
            }
            else{
                const person = new Person ({
                    name: body.name,
                    number: body.number
                })

                person
                .save()
                .then(savedPerson => {
                    response.json(Person.format(person))    
                })

                .catch(error => {
                console.log(error)
                response.status(404).end()
                })                
                
            }
        })
    }
})

  
app.put('/api/persons/:id', (request, response) => {
    const body = request.body

    const person = {
        name: body.name,
        number: body.number,
    }

    Person
    .findOneAndUpdate({_id: request.params.id}, person, { new: true } )
    .then(updatedPerson =>{
        response.json(Person.format(person))
    })
    .catch(error => {
        console.log(error)
        response.status(400).send({ error: 'malformatted id' })
    })    
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
