require('dotenv').config()

const mongoose = require('mongoose')

const password = process.argv?.[2]
const url = `mongodb+srv://olddogz124:${password}@cluster0.2zfeqxk.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const name = process.argv[3]
  const number = process.argv[4]

  const person = new Person({
    name,
    number,
  })

  person.save()
    .then((savedPerson) => {
      console.log(`added ${savedPerson.name} number ${savedPerson.number} to phonebook`)
      console.log('-- --- --')
      mongoose.connection.close()
    })
} else if (process.argv.length === 3) {
  Person.find({})
    .then((persons) => {
      console.log('phonebook:')
      persons.forEach((person) => {
        console.log(`${person.name} ${person.number}`)
      })
      console.log('-- --- --')
      mongoose.connection.close()
    })
} else if (process.argv.length === 4) {
  const name = process.argv[3]
  Person.find({ name })
    .then((person) => {
      console.log(person)
      console.log('-- --- --')
      mongoose.connection.close()
    })
} else {
  mongoose.connection.close()
}
