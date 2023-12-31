const {UserService} = require('../services')
const passport = require('passport')

module.exports = {
   newUser,
   authenticateUser,
   logout,
}

async function newUser(req, res, next) {
   let messages = []
   try {
      const {name, email, password, confirmPassword, role} = req.body
      if (!(name && email && password && confirmPassword && role )) {
         messages.push({body: 'All fields is required.'})
      }
      if (password != confirmPassword) {
         messages.push({body: 'Password do not match.'})
      }

      if (password.length < 6) {
         messages.push({body: 'Password must be at least 6 characters.'})
      }

      if (messages.length) {
         return res.render('register', {messages})
      }

      const user = await UserService.findBy('email', email)
      if (!user.length) {
         await UserService.insert(req.body)
         req.flash(
            'success_message',
            'You are registered successfully and can now log in.'
         )
         return res.status(200).redirect(303, '/users/login')
      }
      messages.push({body: 'This email is already in use.'})
      return res.render('register', {messages})
   } catch (err) {
      return res.status(500).send(err.message)
   }
}

async function authenticateUser(req, res, next) {
   await passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true,
   })(req, res, next)
}

async function logout(req, res) {
   req.logout()
   req.flash('success_message', 'You are logged out.')
   res.redirect(303, '/users/login')
}
