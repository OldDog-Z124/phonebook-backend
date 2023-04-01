require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
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

let persons = [
  { 
    "id": 1,
    "name": "Arto Hellas", 
    "number": "040-123456"
  },
  { 
    "id": 2,
    "name": "Ada Lovelace", 
    "number": "39-44-5323523"
  },
  { 
    "id": 3,
    "name": "Dan Abramov", 
    "number": "12-43-234345"
  },
  { 
    "id": 4,
    "name": "Mary Poppendieck", 
    "number": "39-23-6423122"
  }
  ,
  { 
    "id": 5,
    "name": "Mar Poppendieck", 
    "number": "3-23-6423122"
  }
]

const randomInt = (low, sup) => {
  return Math.floor(Math.random() * (sup - low)) + low
}

const isExistsId = (id) => {
  return persons.find(person => person.id === id) !== undefined
}

const isExistsName = (name) => {
  return persons.find(person => person.name === name) !== undefined
}

const generateId = () => {
  const id = randomInt(0, 10)

  if (!isExistsId(id)) {
    return id
  }

  return generateId()
}

app.get('/', (request, response) => {
  response.send('<p><em>Welcome PhonebookBackend</em></p>')
})

app.get('/info', (request, response) => {
  const content = `
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
  `

  response.send(content)
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.post('/api/persons', (request, response) => {
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
  
  if (isExistsName(body.name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const person = {
    name: body.name,
    number: body.number,
    id: generateId()
  }

  persons = persons.concat(person)

  response.json(person)
})

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  const person = persons.find(person => person.id === id)

  if (!person) {
    response.status(404).end()
  }
  else {
    response.json(person)
  }
})

app.delete('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)

  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})

const PORT = process.env.PORT || 3001
app.listen(PORT, (request, response) => {
  console.log(`Runing In PORT ${PORT}`)
})