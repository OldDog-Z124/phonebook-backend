require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

// eslint-disable-next-line
morgan.token('type', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return ' '
})

const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

app.get('/', (request, response) => {
  response.send('<h3>Hello World</h3>')
})

app.get('/info', (request, response) => {
  Person.find({}).then(people => {
    const body = `
      <div>
        </p>Phonebook has info for ${people.length} people</p>
        </p>${new Date()}</p>
      </div>
    `
    response.send(body)
  })
  
})

app.get('/api/people', (request, response) => {
  Person.find({}).then(people => {
    response.json(people)
  })
})

app.post('/api/people', (request, response, next) => {
  const { name, number } = request.body

  if (!(name && number)) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }

  const people = new Person({ name, number })

  people.save()
    .then(savedPeople => {
      response.json(savedPeople)
    })
    .catch(error => {
      next(error)
    })
})

app.get('/api/people/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => {
      next(error)
    })
})

app.put('/api/people/:id', (request, response, next) => {
  const { name, number } = request.body
  
  const person = { name, number }

  Person.findByIdAndUpdate(
    request.params.id,
    person,
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => {
      next(error)
    })
})

app.delete('/api/people/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    // eslint-disable-next-line
    .then(deletedPeople => {
      response.status(204).end()
    })
    .catch(error => {
      next(error)
    })
})


const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CasrError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})