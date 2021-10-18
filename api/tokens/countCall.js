const express = require('express')
const router = express.Router()
const moment = require('moment')
const mysqlConn = require('../mysqlConn/mysqlconn')
const sha2 = require('sha2')


router.get('/count/:token', async (req, res) => {
	let rawToken = req.params.token
	let selectTokenSQL = `SELECT * from externalAPI where token=?`
	let token = sha2['SHA-256'](process.env.vader + rawToken).toString('hex')
	let sToken = await mysqlConn.query(selectTokenSQL, [token]).then(rs => rs[0][0])
	console.log(sToken)
	if (sToken) {
		let countSQL = `
			UPDATE externalAPI
			SET count = ${sToken.count + 1},
			lastCall = "${moment().format('YYYY-MM-DD HH:mm:ss')}"
			WHERE id=?;
		`
		let format = mysqlConn.format(countSQL, [sToken.id])
		console.log(format)
		let countQuery = mysqlConn.query(countSQL, [sToken.id])

		return res.status(200).json(countQuery)
	}
	else
		return res.status(500)
})

module.exports = router