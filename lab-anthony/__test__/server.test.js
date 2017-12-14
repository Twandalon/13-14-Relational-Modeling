'use strict';

process.env.PORT = 7000;
process.env.MONGODB_URI = 'mongodb://localhost/testing';

const faker = require('faker');
const superagent = require('superagent');
const Brewery = require('../model/brewery');
const server = require('../lib/server');

const apiURL = `http://localhost:${process.env.PORT}/api/brewerys`;

const breweryMockCreate = () => {
  return new Brewery({
    brewery : faker.lorem.words(10),
    location : faker.lorem.words(100),
    founded : faker.lorem.words(20),
  }).save();
};


describe('/api/brewerys', () => {
  beforeAll(server.start);
  afterAll(server.stop);
  afterEach(() => Brewery.remove({}));

  describe('POST /api/brewerys', () => {

    test('should respond with a brewery and 200 status code if there is no error', () => {
      let breweryToPost = {
        brewery : faker.lorem.words(10),
        location : faker.lorem.words(100),
        founded : faker.lorem.words(20),
      };
      return superagent.post(`${apiURL}`).send(breweryToPost)
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toBeTruthy();
          expect(response.body.timestamp).toBeTruthy();

          expect(response.body.brewery).toEqual(breweryToPost.brewery);
          expect(response.body.location).toEqual(breweryToPost.location);
        });
    });
    test('should respond with a 400 code if we send an incomplete brewery', () => {
      let breweryToPost = {
        brewery : faker.lorem.words(100),
      };
      return superagent.post(`${apiURL}`)
        .send(breweryToPost)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

  });

  describe('GET /api/brewerys', () => {

    test('should respond with 200 status code if there is no error', () => {
      let breweryToTest = null;
      return breweryMockCreate()
        .then(brewery => {
          breweryToTest = brewery;
          return superagent.get(`${apiURL}/${brewery._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body._id).toEqual(breweryToTest._id.toString());
          expect(response.body.timestamp).toBeTruthy();
          expect(response.body.brewery).toEqual(breweryToTest.brewery);
          expect(response.body.brewery).toEqual(breweryToTest.brewery);
        });
    });

    test('should respond with 404 status code if there id is incorrect', () => {
      return superagent.get(`${apiURL}/someid`)
        .then(Promise.reject)
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('DELETE /api/brewerys/:id', () => {

    test('should respond with 204 status code if the brewery was deleted', () => {
      return breweryMockCreate()
        .then(brewery => {
          return superagent.delete(`${apiURL}/${brewery._id}`);
        })
        .then(response => {
          expect(response.status).toEqual(204);
        });
    });

    test('should respond with 404 status code no brewery was entered', () => {
      return breweryMockCreate()
        .then(() => {
          return superagent.delete(`${apiURL}/`);
        })
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });
  });

  describe('PUT /api/brewerys', () => {

    test('should update brewery and respond with 200 if there are no errors', () => {
      let breweryToUpdate = null;
      return breweryMockCreate()
        .then(brewery => {
          breweryToUpdate = brewery;
          return superagent.put(`${apiURL}/${brewery._id}`)
            .send({brewery : 'Holy Mountain'});
        })
        .then(response => {
          expect(response.status).toEqual(200);
          expect(response.body.brewery).toEqual('Holy Mountain');
          expect(response.body.location).toEqual(breweryToUpdate.location);
          expect(response.body._id).toEqual(breweryToUpdate._id.toString());
        });
    });

    test('should respond with a 400 if validation fails', () => {
      return breweryMockCreate()
        .then(brewery => {
          return superagent.put(`${apiURL}/${brewery._id}`)
            .send({brewery : ''});
        })
        .catch(response => {
          expect(response.status).toEqual(400);
        });
    });

    test('should return a 404 if a brewery is not found', () => {
      return breweryMockCreate()
        .then(() => {
          return superagent.put(`${apiURL}/12345`)
            .send({brewery : 'Holy Mountain'});
        })
        .catch(response => {
          expect(response.status).toEqual(404);
        });
    });

    test('should return a 404 if a brewery is not found', () => {
      let breweryToCheck = {
        brewery : 'Holy Mountain',
        location : faker.lorem.words(100),
        founded : faker.lorem.words(20),
      };
      return superagent.post(`${apiURL}`).send(breweryToCheck)
        .then(() => {
          return breweryMockCreate()
            .then((brewery) => {
              return superagent.put(`${apiURL}/${brewery._id}`)
                .send({brewery : 'Holy Mountain'});
            });
        })
        .catch(response => {
          expect(response.status).toEqual(409);
        });
    });
  });
});
