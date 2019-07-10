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
	await mysqlConn.query(deleteTokenQ, [id]).then(rs => {
		console.log(rs)
		if (rs[0].affectedRows > 0)
			res.status(200).json(true)
		else {
			res.status(404).json(false)
		}
	}).catch(err => {
		res.status(500).json(err)
	})

});

module.exports = router