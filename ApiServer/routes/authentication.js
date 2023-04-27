const express = require('express');
const middleware = require('../service/middleware');
const sessions=require('../service/session');
const router = express.Router();

router.post('/Login',(req,res)=>{
    if(req.body.username == "amit@mail.com" && req.body.password == "1234"){
        sessions.setLoggedUser(req, req.body.username);
        res.send('Login sucess');
    }
    else{
        res.send('Invalid username or password');
    }
});
router.get('/Logout',(req,res)=>{
    sessions.clear(req);
    res.send('Sucessfuly logout');
});
router.get('/User', middleware.authorize, (req,res)=>{
    res.send(sessions.getLoggedUser(req));
});

module.exports = router;