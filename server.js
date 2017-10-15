//server.js
//Main declarations and dependencies
const validator = require('xsd-schema-validator');
const express = require('express');
const path = require('path');
const xml2js = require('xml2js');
const fs = require('fs');

//Creates a new instance of app using express
const app = express();
//Creates the xml2js parseString class
const parseString = require('xml2js').parseString;

//Sets the root to serve static index.html
app.use('/', express.static(__dirname));

//Creates a new router for users
const userRouter = express.Router();

/**
 * Main getter when the user ask for /users/ URL.
 * It returns the whole list of users (readed from xml/users.xml) in JSON format
 */
userRouter.get('/', (req, res) => {
    fs.readFile(__dirname + '/xml/users.xml', function(err, data) {
        parseString(data, { trim: true, explicitArray : false }, function (err, result) {
            if (result) {
                req.user = JSON.stringify(result);
                res.write(req.user);
            } else {
                res.write('Users file not found');
            }
            res.end();
        });
    });
});

/**
 * Function used to look up for the requested user, if the id is found, the data will be provided.
 * @param {*} req Request, should provide the id parameter to search for an specified user.
 *                Extension is optional, if json is provided as extension the response will be in JSON format instead XML  
 * @param {*} res Response
 * @param {*} next Next
 */
const lookupUser = (req, res, next) => {
    //userId contains the requested id by the user (E.g: url is /users/1, userId will be 1)
    const userId = req.params.id;
    //Read from users.xml file
    fs.readFile(__dirname + '/xml/users.xml', function(err, data) {
        //Parse the data received from the file
        parseString(data, { trim: true, explicitArray : false }, function (err, result) {
            if (result) {
                const users = result.Users;
                let searchUser = null;
                //Look for the user in the users array
                users.User.some(function(user) {
                    if (user.Id.toString() === userId.toString()) {
                        searchUser = user;
                        return true;
                    }
                }, this);

                //If the user was found, the data will be stored in the request object
                if (searchUser) {
                    //Makes the output as JSON or XML
                    if (req.params.ext && req.params.ext === 'json') {
                        req.user = JSON.stringify(searchUser);
                    } else {
                        let builder = new xml2js.Builder();
                        req.user = builder.buildObject(searchUser);
                    }
                }
            }
            next();
        });
    });
};

//Path that will search for and specific user in the XML file and return its information.
userRouter.get('/:id\.:ext?', lookupUser, (req, res) => {
    //Writes the data in the response object
    if (req.user) {
        res.write(req.user);
    } else {
        res.write('User not found :(');
    }
    res.end();
});

//Set the userRouter to act when the url is /users/
app.use('/users', userRouter);

const validateRouter = express.Router();
/**
 * Checks if the users.xml file is valid using the users.xsd schema
 */
validateRouter.get('/', (req, res) => {
    validator.validateXML({file: 'xml/users.xml'}, 'xsd/users.xsd', (error, result) => {
        if (result.valid) {
            res.write('<div>XML Validation was correct</div>');
        } else {
            res.write('<div>');
            res.write('<div>XML validation failed.</div>');
            res.write('<div>Error: ' + error + '</div>');
            res.write('</div>');
        }
        res.end();
    });
});

//Sets the /validate path to use the previous validateRouter
app.use('/validate', validateRouter);

//Initializes the server listening on port 3000
const port = 3000;
app.listen(port, () => { 
    console.log('Listening on port ' + port);
 });