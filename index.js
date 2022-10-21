const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

morgan.token('type', (req, res) => { 
  if (req.method === 'POST') {
    return JSON.stringify(req.body)
  }
  return " "
})

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

let phones = [
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
]

app.get('/', (request, response) => {
  response.send('<h3>Hello World</h3>')
})

app.get('/info', (request, response) => {
  const body = `
    <div>
      </p>Phonebook has info for ${phones.length} people</p>
      </p>${new Date()}</p>
    </div>
  `
  response.send(body)
})

app.get('/api/phones', (request, response) => {
  response.json(phones)
})

app.get('/api/phones/:id', (request, response) => {
  const id = +request.params.id
  const phone = phones.find(phone => phone.id === id)

  if (phone) {
    response.json(phone)
  }
  else {
    response.status(404).end()
  }
})

app.delete('/api/phones/:id', (request, response) => {
  const id = +request.params.id
  phones = phones.filter(phone => phone.id !== id)

  response.status(204).end()
  
})

const generateId = () => {
  const maxId = phones.length > 0
    ? Math.max(...phones.map(phone => phone.id))
    : 0
  return maxId + 1
}

app.post('/api/phones', (request, response) => {
  const { name, number } = request.body

  if (!(name && number)) {
    return response.status(400).json({
      error: 'name or number missing'
    })
  }
  
  if (phones.map(phone => phone.name).includes(name)) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }

  const phone = {
    id: generateId(),
    name,
    number
  }

  phones = phones.concat(phone)

  response.json(phone)
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})