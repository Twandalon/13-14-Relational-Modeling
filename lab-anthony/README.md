#Author: Anthony Robinson

#Dependencies:

"devDependencies": "eslint": "^4.13.1", "faker": "^4.1.0", "jest": "^21.2.1", "superagent": "^3.8.2"

"dependencies": "body-parser": "^1.18.2", "dotenv": "^4.0.0", "express": "^4.16.2", "mongoose": "^4.13.6", "winston": "^2.4.0"

(you must install all dependencies to use testing)

To install mongodb in terminal - 'brew install mongodb'

#Use:

This application utilizes mongodb, a nosql database program. In this app you can currently test GET, POST and DELETE methods on the database. This application is used to store beers.

once you have all dependencies install type 'npm run test' to run tests.

#Model:

Breweries have the following properties:

{ brewery: 'brewery', location: 'location', founded: 'founded', timestamp - automatically assigned id - automatically assigned }

brewery and location are required to create a new brewery.

Beers have the following properties:

{ name: 'name', style: 'beer style', abv: 'abv', timestamp - automatically assigned id - automatically assigned }

name and style are required to create a new beer.
