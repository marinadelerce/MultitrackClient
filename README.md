# Welcome to PolyMix' web application


## Authors

Polytech Nice-Sophia SI - Programmable Web 2015-2016:

* [Mael Audren De Kerdrel](mailto:audrenmael@gmail.com)
* [Marina Delerce-Mauris](mailto:marina.delerce-mauris@etu.unice.fr)
* [Riana Rabehasi](mailto:riana.rabehasi@etu.unice.fr)
* [Sonia Tual](mailto:sonia.tual@etu.unice.fr)


## Setting up the project
### Prerequisites
This project uses **MongoDB**, make sure it is up and running on your computer!
The preferred version is *3.2.1*
Once it is installed, you can run: 
    $ mongod
And leave it there !

You also need **npm** installed. 
You need at least to have the *2.14.12* version installed. 


You also need **bower** installed. 
You can install it with: 
    
    $ npm install -g bower
    
If you already have it, make sure your version is higher than *1.7.2*, which is the smallest the project has been tested with. 
 
You also need **grunt** installed. 
You can install it with: 
    
    $ npm install -g grunt-cli


### Launching the project
To launch the project, after cloning or forking the repository, and placing yourself in the project folder: 
here are the commands you can apply for the backend part: 

	$ cd Multitrack
	$ npm install
	$ node server.js

The backend is now running!
Now place yourself back in the project folder, and for the frontend part you can do: 

	$ cd MultitrackClient
	$ npm install && bower install
	$ grunt serve

The frontend is now running!
The web app will be launch directly on your browser. 

### Testing the project
You can run tests on the backend of the project. They were written using **mocha**.
To run them, place yourself in the *Multitrack* folder :

    $ mocha 

# Role distribution

## Frontend part
Marina and Sonia mainly worked on the frontend part. 

Marina : user log in and log out, comments et notes, signal drawing

Sonia : mixes save and load, user account creation, deletion and listing of the mixes

Riana : refactoring of the initial code that play the songs

We worked together on the points that are not mentioned above.

## Backend part
Mael and Riana mainly worked on the backend part.
 
Mael : users management, songs management, comments management

Riana : json requests checking, mix management


# Retrospective

## Strength
The server is secured thanks to the connection token and reliable thanks to the JSON verification on the client request.
The server side tests avoid regression during the development.
The client side starts pretty fast

## Weakness
Some functionnalities are not available yet.
The track loading is a bit slow and a progress bar could be useful.
The server side doesn't use the HTTPS request for private data.
