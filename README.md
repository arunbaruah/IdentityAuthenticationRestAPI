Backend REST API Server functionalities:

         ****Developement & Unit Testing *****

1.	Restify is used.   npm install restify --save
2.	Mongoose is used for data model (schema design).  npm install mongoose --save
3.	DB connection information for development and test in config folder.
   npm install config --save
   
There is no view for the restapi. UI code may be in this folder.

This program demonstrate how to implement "Identity Authentication Model" using jwttoken and AES256 bit encryption. This is very basic example program that encrypt the user info i.e. the password encrypted and save in mongoDB and while retrieving it dycript, tally and if matches then return the jwt token.

You have to enhance the program for example in your application if some of the modules are only accessible to a 
particular user then only that portion should be available for that user.

