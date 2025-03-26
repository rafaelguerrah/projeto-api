const express = require('express');
const router = express.Router();
const job = require('../models/job');


// add job via post
router.post('/add', (req, res) => {
    let {title, salary, company, description, email, new_job } = req.body


//insert
job.create({
    title,
    description,
    salary,
    company,
    email,
    new_job
})

.then(()=> res.redirect('/'))
    
.catch(err => console.log(err));
    
});

module.exports = router;