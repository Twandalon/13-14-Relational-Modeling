'use strict';

require('./lib/setup');

const faker = require('faker');
const superagent = require('superagent');
const server = require('../lib/server');
const beerMock = require('./lib/beer-mock');
const breweryMock = require('./lib/brewery-mock');
const apiURL = `http://localhost:${process.env.PORT}/api/beers`;

describe('/api/beers', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(beerMock.remove);

  describe('POST /api/beers', () => {
    test('should respond with a beer and 200 status code if there is no error', () => {
      let tempBreweryMock = null;
      return breweryMock.create()
        .then(mock => {
          tempBreweryMock = mock;

          let beerToPost = {
            name: faker.lorem.words(3),
            style: faker.lorem.words(3),
            abv: faker.lorem.words(1),
            brewery: mock._id,
          };

          return superagent.post(`${apiURL}`)
            .send(beerToPost)
            .then(response => {
              expect(response.status).toEqual(200);
              expect(response.body._id).toBeTruthy();
              expect(response.body.timestamp).toBeTruthy();
              expect(response.body.brewery).toEqual(tempBreweryMock._id.toString());
              expect(response.body.name).toEqual(beerToPost.name);
              expect(response.body.style).toEqual(beerToPost.style);
            });
        });
    });

    test('should respond with a 409 status code if there is a unique parameter conflict', () => {
      return breweryMock.create()
        .then(mock => {
          let beerToPost = {
            name: 'bifrost',
            style: faker.lorem.words(3),
            abv: faker.lorem.words(1),
            brewery: mock._id,
          };
          return superagent.post(`${apiURL}`)
            .send(beerToPost)
            .then(() => {
              return superagent.post(`${apiURL}`)
                .send(beerToPost);
            })
            .catch(response => {
              expect(response.status).toEqual(409);
            });
        });
    });

    test('should respond with a 400 code if we send an incomplete beer', () => {
      let beerToPost = {
        name : faker.lorem.words(100),
      };
      return superagent.post(`${apiURL}`)
        .send(beerToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('should respond with a 404 code if brewery id is not valid', () => {
      return superagent.post(`${apiURL}`)
        .send({
          name: faker.lorem.words(3),
          style: faker.lorem.words(3),
          abv: faker.lorem.words(1),
          brewery: 'bad_id',
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('GET /api/beers', () => {

    test('should respond with 200 status code if there is no error', () => {
      let tempMock = null;

      return beerMock.create()
        .then(mock => {
          tempMock = mock;
          console.log('tempmock', tempMock);
          return superagent.get(`${apiURL}/${mock.beer._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(tempMock.beer._id.toString());
          expect(response.body.timestamp).toBeTruthy();
          expect(response.body.name).toEqual(tempMock.beer.name);
          expect(response.body.style).toEqual(tempMock.beer.style);
        });
    });

    test('should respond with 404 status code if id is not found', () => {
      return superagent.get(`${apiURL}/someid`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/beers/:id', () => {

    test('should respond with 204 status code if the beer was deleted', () => {
      return beerMock.create()
        .then(mock => {
          return superagent.delete(`${apiURL}/${mock.beer._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });

    test('should respond with 404 status code no brewery was entered', () => {
      return superagent.delete(`${apiURL}/somethingstuff`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('PUT /api/beers', () => {

    test('should update beer and respond with 200 if there are no errors', () => {
      let beerToUpdate = null;
      return beerMock.create()
        .then(mock => {
          beerToUpdate = mock.beer;
          return superagent.put(`${apiURL}/${mock.beer._id}`)
            .send({name : 'bifrost'});
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.name).toEqual('bifrost');
          expect(response.body.style).toEqual(beerToUpdate.style);
          expect(response.body._id).toEqual(beerToUpdate._id.toString());
        });
    });

    test('should respond with a 400 if validation fails', () => {
      return beerMock.create()
        .then(mock => {
          return superagent.put(`${apiURL}/${mock.beer._id}`)
            .send({name : ''});
        })
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('should return a 404 if a brewery is not found', () => {
      return beerMock.create()
        .then(() => {
          return superagent.put(`${apiURL}/12345`)
            .send({name : 'Holy Mountain'});
        })
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });
});
