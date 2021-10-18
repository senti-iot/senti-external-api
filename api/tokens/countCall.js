const express = require('express')
const router = express.Router()
const moment = require('moment')
const mysqlConn = require('../mysqlConn/mysqlconn')


router.get('/count/:token', async (req, res) => {
	let token = req.params.token
	let selectTokenSQL = `SELECT * from externalAPI where token=?`
	let sToken = mysqlConn.query(selectTokenSQL,[token]).then(rs => rs[0][0])
	if (sToken) {
		let countSQL = `
			UPDATE externalAPI
			SET count = ${sToken.count + 1}
			lastCall = ${moment().format('YYYY-MM-DD HH:mm:ss')}
			WHERE id=?
		`
		let countQuery = mysqlConn.query(count, [sToken.id])
		return res.status(200).json(countQuery)
	}
	else
		return res.status(500)
})