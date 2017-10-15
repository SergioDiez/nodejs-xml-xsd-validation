# nodejs-xml-xsd-validation
Example of a Node.js RESTful API that returns users from an xml file. Have a validation method that checks if the xml is strict to the xsd schema

## Steps to follow

##### Clone the repository
Use the following command to clone the repository to your current folder
`git clone https://github.com/SergioDiez/nodejs-xml-xsd-validation`

##### Install the required dependencies
Enter in the nodejs-xml-xsd-validation folder and use the `npm install` command to install the required dependencies.

NOTE: xsd-schema-validator module requires java and javac to be installed.

##### Initialize the server
To initialize the server use `npm start`. This command will start a local server. You can now access using a web browser via URL: http://127.0.0.1:3000

##### Retrieve the users list
To get the users.xml content use:
http://127.0.0.1:3000/users

##### Retrieve an specifig user
To get an specific user from the users.xml file use:
http://127.0.0.1:3000/users/:id (E.g: http://127.0.0.1:3000/users/1 will retrieve the user with id 1)

The default response is using XML, to retrieve the value as JSON you can add the .json extension to the URL. (For example http://127.0.0.1:3000/users/1.json)

##### Validate users.xml with users.xsd schema
To validate the xml file with the xsd use the following URL:
http://127.0.0.1:3000/validate
The output will display if the validation was correct or not.