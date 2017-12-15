'use strict';

const faker = require('faker');
const Brewery = require('../../model/brewery');
const breweryMock = module.exports = {};

breweryMock.create = () => {
  return new Brewery({
    brewery: faker.lorem.words(4),
    location: faker.lorem.words(2),
    founded: faker.lorem.words(3),
  }).save();
};

breweryMock.createMany = (mockAmount) => {
  return Promise.all(new Array(mockAmount).fill(0))
    .map(() => breweryMock.create());
};

breweryMock.remove = () => Brewery.remove({});
