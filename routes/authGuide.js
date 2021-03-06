const router = require('express').Router();
const Guides = require('../model/Guides');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {registerValidation, loginValidation} = require('../validation');

//Validation
router.post('/register',async (req, res) =>{

    //Data validation
    const {error} = registerValidation(req.body);
    if(error) return res.status(400).send("Missing fields");

    //Check if user is already in db
    const emailExist = await Guides.findOne({email: req.body.email});    
    if(emailExist) return res.status(400).send('Email already exists');    

    //Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    //Create a new user
    const guide = new Guides({
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashPassword,
        dni: req.body.dni
        // language1: req.body.language1,
        // language2: req.body.language2,
        // language3: req.body.language3, 
        // country: req.body.country,       
        // photo: req.body.photo,
        // description: req.body.description,
        // hearing: req.body.hearing,        
        
    });
    try{
        const savedGuide =  await guide.save();
        res.send(savedGuide);
    }
    catch(err){
        res.status(400).send("New guide couldn't be saved");
    }
});

//login
router.post('/login', async (req, res) => {
    //Validate data
    const {error} = loginValidation(req.body);
    if(error) return res.status(400).send(error.details[0].message);
        //Check if email doesnt exists
        const guide = await Guides.findOne({email: req.body.email});
        if(!guide) return res.status(400).send("Email doesn't exist");
        //Password is correct
        const validPass = await bcrypt.compare(req.body.password, guide.password);
        if(!validPass) return res.status(400).send('Incorrect password');

        

        //Create and assign a token
        const token = jwt.sign({_id: guide._id}, process.env.JWT_KEY);    
            
        res.header('token', token).send(token); 
        
    
          
 
});

module.exports = router;   