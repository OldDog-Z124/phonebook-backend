require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

morgan.token('body', (request, response) => {
  if (!Object.keys(request.body).length) {
    return ' '
  }
  return(
    `\n${JSON.stringify(request.body, null, 2)}\n`
  ) 
})

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/', (request, response) => {
  response.send('<p><em>Welcome PhonebookBackend</em></p>')
})

app.get('/info', (request, response) => {
  Person.find({})
    .then(persons => {
      const content = `
        <p>Phonebook has info for ${persons.length} people</p>
        <p>${new Date()}</p>
      `

      response.send(content)
    })
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name && !body.number) {
    return response.status(400).json({
      error: 'name and number missing'
    })
  }
  if (!body.name) {
    return response.status(400).json({
      error: 'name missing'
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number missing'
    })
  }

  Person.find({ name: body.name })
    .then(persons => persons.length > 0)
    .then(isExistsName => {
      if (isExistsName) {
        return response.status(400).json({
          error: 'name must be unique'
        })
      }
      else {
        const person = new Person({
          name: body.name,
          number: body.number,
        })
        person.save()
          .then(person => {
            response.json(person)
          })
          .catch(error => next(error))
      }
    })
    .catch(error => next(error))
  
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const id = request.params.id
  const { name, number } = request.body
  const person = { name, number }

  Person.findByIdAndUpdate(id, person, { new: true })
    .then(person => {
      response.json(person)
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then(person => {
      console.log(person)
      response.status(204).end()
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.log(`-- error --`)
  console.log(`name: ${error.name}`)
  console.log(`message: ${error.message}`)
  console.log(`-- --- --`)
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, (request, response) => {
  console.log(`Runing In PORT ${PORT}`)
})