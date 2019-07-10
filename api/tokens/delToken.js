const express = require('express');
const router = express.Router();

router.post('/deletetoken/:id', (req, res) => {
	let id = req.params.id
	let deleteTokenQ = `
	UPDATE externalAPI
	SET deleted=1
	WHERE id=?;
	`
	await mysqlConn.query(deleteTokenQ, [id]).then(rs=> {
		console.log(rs)
		res.status(200).json(true)
	})

});

module.exports = router