const express = require('express');
const router = express.Router();
const mysqlConn = require('../mysqlConn/mysqlconn')

router.get('/tokens/:userId', (req, res) => {
	let id = req.params.userId
	const selectTokensByUserId = `
	SELECT * from externalAPI where createdBy = ? and deleted != 1
	`
	mysqlConn.query(selectTokensByUserId, [id]).then(rs => { 
		if (rs[0].length > 0) {
			res.status(200).json(rs[0]);
		}
		else { 
			res.status(200).json([])
		}
	}).catch(err => { 
		res.status(500)
	})
});

module.exports = router