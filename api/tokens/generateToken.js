// const dotenv = require('dotenv')
const express = require('express');
const router = express.Router();
const sha2 = require('sha2')
const moment = require('moment')
var crypto = require("crypto");
const mysqlConn = require('../mysqlConn/mysqlconn')

/**
 * type - resource type
 * type_id - resource id
 * Example: type 0 is device and type_id will have the uuid of the device
 */
const storeTokenQ = `INSERT INTO externalAPI
	(name, token, \`type\`, type_id, created, createdBy)
	VALUES(?, ?, ?, ?, NOW(), ?);
`


router.get('/validateToken/:rawToken/:type/:typeID', async (req, res) => {
	let rawToken = req.params.rawToken
	let typeID = req.params.typeID
	let type = req.params.type
	console.log(type)
	let selectTokenQ = `SELECT * from externalAPI where token=? and type_id=?`
	let token = sha2['SHA-256'](process.env.vader + rawToken).toString('hex')
	console.log(rawToken)
	console.log(token)
	await mysqlConn.query(selectTokenQ, [token, typeID]).then(async rs => {
		if (rs[0].length > 0) {
			console.log('Valid Token')
			res.status(200).json(true)
		}
		else {
			if (type === 'device') {
				selectTokenQ = `SELECT * from externalAPI where token=? and type=1`
				await mysqlConn.query(selectTokenQ, [token, typeID]).then(async rs => {
					if (rs[0].length > 0) {
						console.log('Vaild Registry token')
						let checkReg = `SELECT * from Device where id=? and reg_id=?`
						await mysqlConn.query(checkReg, [typeID, rs[0][0].type_id]).then(rs => {
							if (rs[0].length > 0) {
								console.log('Valid Registry/Device token')
								return res.status(200).json(true)
							}
							else {
								return res.status(404).json(false)
							}
						})
					}
				})
				selectTokenQ = `SELECT * from externalAPI where token=? and type=2`
				await mysqlConn.query(selectTokenQ, [token, typeID]).then(async rs => {
					if (rs[0].length > 0) {
						console.log('Vaild Device Type token')
						let checkReg = `SELECT * from Device where id=? and type_id=?`
						await mysqlConn.query(checkReg, [typeID, rs[0][0].type_id]).then(rs => {
							if (rs[0].length > 0) {
								console.log('Valid DeviceType/Device token')
								return res.status(200).json(true)
							}
							else {
								return res.status(404).json(false)
							}
						})
					}
				})
			}

			else {
				res.status(404).json(false)
			}
		}
	})
});

router.post('/generateToken', async (req, res) => {
	let userId = req.body.userId
	let type = req.body.resourceType
	let typeId = req.body.resourceUuid
	let name = req.body.name
	let id = crypto.randomBytes(20).toString('hex').toUpperCase()
	let token = sha2['SHA-256'](process.env.vader + id).toString('hex')

	await mysqlConn.query(storeTokenQ, [name, token, type, typeId, userId]).then(rs => {
		if (rs[0].insertId > 0) {
			res.json(id).status(200);
		}
		else {
			res.json(false).status(500)
		}
	}).catch(err => {
		res.status(500).json(err)
	})
});

module.exports = router