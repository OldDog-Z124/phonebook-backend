const mongoose = require('mongoose')

if (process.argv.length !== 3 && process.argv.length !== 5) {
  console.log(`
    Please provide a command of the following form:
      node mongo.js <password>
      node mongo.js <password> <personName> <personNumber>
  `)
  process.exit(1)
} 

const password = process.argv[2]
const url = 
  `mongodb+srv://OldDog-Z124:${password}@fullstackopen.ygauury.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 3) {
  showPersons()
    .then(() => {
      mongoose.connection.close()
    })
}
else {
  const name = process.argv[3]
  const number = process.argv[4]
  createPerson(name, number)
    .then(() => {
      mongoose.connection.close()
    })
}

function showPersons() {
  return (
    Person.find({})
      .then(persons => {
        console.log('phonebook:')
        persons.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
      })
  )
}

function createPerson(name, number) {
  if (!(name && number)) {
    console.log('Please fill in the complete information')
    return Promise.resolve()
  }

  const person = new Person({
    name,
    number,
  })
  return (
    person.save()
      .then(person => {
        console.log(`added ${person.name} number ${person.number} to phonebook`)
      })
  )
}