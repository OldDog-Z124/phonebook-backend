const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to ', url)


mongoose.connect(url)
  // eslint-disable-next-line
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB: ', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        if (v.replace(/-/g, '').length < 8) return false
        return /^\d{2,3}-\d+$/.test(v) || /^\d+$/.test(v)
      },
      message: props => `${props.value} is not a valid phone number! a number format is [(xx|xxx)-xxxx...] or [xxxx...], length > 8.`
    },
    required: true
  },
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