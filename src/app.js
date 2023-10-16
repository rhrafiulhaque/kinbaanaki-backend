const cors = require('cors')
const express = require('express')
const routes = require('./app/routes');
const globalErrorHandler = require('./app/middlewares/globalErrorHandler');
const app = express();
app.use(cors())

//parser
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/', routes)

app.use(globalErrorHandler)


module.exports = app
