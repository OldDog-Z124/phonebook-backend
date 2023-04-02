const mongoose = require('mongoose')

const url = process.env.MONGODB_URI || 'mongodb+srv://olddogz124:nw3CGgpuTku15gD4@cluster0.2zfeqxk.mongodb.net/phonebookApp?retryWrites=true&w=majority'
console.log('connecting to', url)

mongoose.set('strictQuery', false)
mongoose.connect(url)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: [3, 'phone name min length is 3'],
    unique: true,
    required: [true, 'phone name required'],
  },
  number: {
    type: String,
    minLength: [8, 'phone number min length is 8'],
    validate: {
      validator(v) {
        return /^\d{2,3}-\d{6,}$/.test(v)
      },
      message: (props) => `${props.value} is not a valid phone number!`,
    },
    required: true,
  },
})
personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Person = mongoose.model('Person', personSchema)

module.exports = Person
