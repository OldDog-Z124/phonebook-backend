const mongoose = require('mongoose')

const url = process.env.MONGODB_URI || 'mongodb+srv://olddogz124:nw3CGgpuTku15gD4@cluster0.2zfeqxk.mongodb.net/phonebookApp?retryWrites=true&w=majority'
console.log('connecting to', url)

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})


const Person = mongoose.model('Person', personSchema)

module.exports = Person