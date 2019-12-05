const User = require('Models/user');

const user = new User({
  firstName: 'Liam',
  lastName: 'Dyer',
  email: 'saghendev@gmail.com',
  password: 'Webdev123'
})

user.save()
