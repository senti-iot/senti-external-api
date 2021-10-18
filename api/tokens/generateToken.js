// const dotenv = require('dotenv')
const express = require('express')
const router = express.Router()
const sha2 = require('sha2')
const moment = require('moment')
var crypto = require("crypto")
const mysqlConn = require('../mysqlConn/mysqlconn')
const { v4: uuidv4 } = require('uuid')
const { Console } = require('console')

/**
 * type - resource type
 * type_id - resource id
 * Example: type 0 is registry and type_id will have the uuid of the device
 */
const storeTokenQ = `INSERT INTO externalAPI
	(uuid, name, token, \`type\`, type_id, created, createdBy, counter, lastCall)
	VALUES(?, ?, ?, ?, ?, NOW(), ?, 0, NULL);
`

router.get('/validateToken/:rawToken/:resourceType/:resourceId', async (req, res) => {
	let rawToken = req.params.rawToken
	let typeID = req.params.resourceId
	let type = req.params.resourceType
	console.log(type)
	let selectTokenQ = `SELECT * from externalAPI where token=? and type_id=?`
	let token = sha2['SHA-256'](process.env.vader + rawToken).toString('hex')
	console.log(rawToken)
	console.log(token)
	console.log('ResourceType', type)
	console.log('ResourceTypeID', typeID)
	await mysqlConn.query(selectTokenQ, [token, typeID]).then(async rs => {
		if (rs[0].length > 0) {
			console.log('Valid Token')
			res.status(200).json(true)
		}
		else {
			console.log('Invalid Token')
			res.status(404).json(false)
		}
	})
})

/**
 * @param req.body.resourceType - resourceType - 0 - registry, 1 - device, 2 - device type
 * @param req.body.resourceUuid - resource uuid
 */
router.post('/generateToken', async (req, res) => {
	let userId = req.body.userId
	let type = req.body.resourceType
	let typeId = req.body.resourceUuid
	let name = req.body.name
	let id = crypto.randomBytes(20).toString('hex').toUpperCase()
	let token = sha2['SHA-256'](process.env.vader + id).toString('hex')

	let uuid = uuidv4()

	await mysqlConn.query(storeTokenQ, [uuid, name, token, type, typeId, userId]).then(rs => {
		if (rs[0].insertId > 0) {
			res.json(id).status(200)
		}
		else {
			res.json(false).status(500)
		}
	}).catch(err => {
		res.status(500).json(err)
	})
})

module.exports = router