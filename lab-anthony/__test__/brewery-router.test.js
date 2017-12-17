'use strict';

require('./lib/setup');

const superagent = require('superagent');
const server = require('../lib/server');
const breweryMock = require('./lib/brewery-mock');
const faker = require('faker');

const apiURL = `http://localhost:${process.env.PORT}/api/breweries`;

describe('/api/breweries', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(breweryMock.remove);

  describe('POST /breweries', () => {
    test('should return a 200 and a brewery if there are no errors', () => {
      return superagent.post(`${apiURL}`)
        .send({
          brewery : 'Holy Mountain',
          location : 'seattle',
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.location).toEqual('seattle');
        });
    });

    test('should return a 400 if an incomplete brewery is posted', () => {
      return superagent.post(`${apiURL}`)
        .send({
          brewery : 'Holy Mountain',
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('should return a 409 due to a duplicate title', () => {
      return breweryMock.create()
        .then(breweryDup => {
          return superagent.post(`${apiURL}`)
            .send({
              brewery : breweryDup.brewery,
              location : 'seattle',
            });
        })
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(409);
        });
    });
  });

  describe('GET /breweries/:id', () => {
    test('Should respond with a 200 status and a brewery if there are no error', () => {
      let tempBreweryMock;

      return breweryMock.create()
        .then(brewery => {
          tempBreweryMock = brewery;
          return superagent.get(`${apiURL}/${brewery.id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(JSON.stringify(response.body.brewery))
            .toEqual(JSON.stringify(tempBreweryMock.brewery));
        });
    });

    test('Should respond with a 404 status if a brewery isn\'t found', () => {
      return superagent.get(`${apiURL}/12345`)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /brewery/:id', () => {

    test('should respond with 204 status code if the brewery was deleted', () => {
      return breweryMock.create()
        .then(brewery => {
          return superagent.delete(`${apiURL}/${brewery._id}`);
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

});
