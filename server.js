#!/usr/bin/env nodejs
const dotenv = require('dotenv').config()
const express = require('express')
const cors = require('cors')
const helmet = require('helmet')
const app = express()

// API endpoint imports
const generateToken = require('./api/tokens/generateToken')
const getTokens = require('./api/tokens/getTokens')
const delToken = require('./api/tokens/delToken')
//
const port = process.env.NODE_PORT || 3020

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(cors())
//--- Tokens
app.use('/', [generateToken, getTokens, delToken])

//---Start the express server---------------------------------------------------

const startServer = () => {
	app.listen(port, () => {
		console.log('Senti External API Service started on port', port)
	}).on('error', (err) => {
		if (err.errno === 'EADDRINUSE') {
			console.log('Service not started, port ' + port + ' is busy')
		} else {
			console.log(err)
		}
	})
}

startServer()
