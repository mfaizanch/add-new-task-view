require('dotenv').config()
const config = {
   dbUrl: process.env.DB_URL || 'mongodb://127.0.0.1/TM-db',
   port: process.env.PORT || 3000,
}

module.exports = config
