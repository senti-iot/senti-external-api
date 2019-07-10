const express = require('express');
const router = express.Router();
const mysqlConn = require('../mysqlConn/mysqlconn')

router.post('/deletetoken/:id', async (req, res) => {
	let id = req.params.id
	let deleteTokenQ = `
	UPDATE externalAPI
	SET deleted=1
	WHERE id=?;
	`
	await mysqlConn.query(deleteTokenQ, [id]).then(rs=> {
		console.log(rs)
		res.status(200).json(true)
	}).catch(err => {
		res.status(500).json(err)
	})

});

module.exports = router