// const dotenv = require('dotenv')
const express = require('express');
const router = express.Router();
const sha2 = require('sha2')
const moment = require('moment')
var crypto = require("crypto");
const mysqlConn = require('../mysqlConn/mysqlconn')

router.get('/validateToken/:id', async (req, res) => {
	let id = req.params.id
	let selectTokenQ = `SELECT * from externalAPI where token=?`
	let token = sha2['SHA-256'](process.env.vader + id).toString('hex')
	await mysqlConn.query(selectTokenQ, [token]).then(rs => {
		if(rs[0].length > 0){
			res.status(200).json(true)
		}
		else {
			res.status(404).json(false)
		}
	})
});

router.post('/generateToken', async (req, res) => {
	let userId = req.body.userId
	let type = req.body.type
	let typeId = req.body.typeId
	let name = req.body.name
	let id = crypto.randomBytes(20).toString('hex').toUpperCase()//?
	let token = sha2['SHA-256'](process.env.vader + id).toString('hex')
	console.log('Bing')
	let storeTokenQ = `INSERT INTO externalAPI
	(name, token, \`type\`, type_id, created, createdBy)
	VALUES(?, ?, ?, ?, NOW(), ?);
	`
	await mysqlConn.query(storeTokenQ, [name, token, type, typeId, userId]).then(rs => {
		if(rs[0].insertId > 0) {
			 res.json(id).status(200);
		}
		else {
			res.json(false).status(500)
		}
	}).catch(err => {
		res.status(500).json(err)
	})
});

module.exports=router