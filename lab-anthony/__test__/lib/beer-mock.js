'use strict';

const faker = require('faker');
const breweryMock = require('./brewery-mock');
const Beer = require('../../model/beer');

const beerMock = module.exports = {};

beerMock.create = () => {
  let mock = {};
  return breweryMock.create()
    .then(brewery => {
      mock.brewery = brewery;
      let newBeer = {
        name: faker.lorem.words(3),
        style: faker.lorem.words(3),
        abv: faker.lorem.words(1),
        brewery: brewery._id,
      };
      return new Beer(newBeer).save();
    }).then(beer => {
      console.log(beer);
      mock.beer = beer;
      return mock;
    });
};

beerMock.createMany = (mockAmount) => {
  let mock = {};
  return breweryMock.create()
    .then(brewery => {
      mock.brewery = brewery;
      return Promise.all(new Array(mockAmount)
        .fill(0)
        .map(() => {
          return new Beer ({
            name: faker.lorem.words(3),
            style: faker.lorem.words(3),
            abv: faker.lorem.words(1),
          }).save;
        }));
    });
};

beerMock.remove = () => {
  return Promise.all([
    Beer.remove({}),
    breweryMock.remove(),
  ]);
};
