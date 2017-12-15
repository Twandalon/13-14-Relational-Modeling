'use strict';

const {Router} = require('express');
const httpErrors = require('http-errors');
const jsonParser = require('body-parser').json();
const Brewery = require('../model/brewery');
const logger = require('../lib/logger');

const breweryRouter = module.exports = new Router();

breweryRouter.post('/api/breweries', jsonParser, (request, response, next) => {
  if(!request.body.brewery || !request.body.location) {
    return next(httpErrors(400, 'brewery and location are required'));
  }
  return new Brewery(request.body).save()
    .then(brewery => {
      return response.json(brewery);
    })
    .catch(next);
});

breweryRouter.get('/api/breweries/:id', (request, response, next) => {
  return Brewery.findById(request.params.id)
    .then(brewery => {
      if(!brewery) {
        throw httpErrors(404, 'brewery not found');
      }
      logger.log('info', 'GET - Returning a 200 status code');
      return response.json(brewery);
    }).catch(next);
});

breweryRouter.delete('/api/breweries/:id', (request, response, next) => {
  logger.log('info', 'DELETE - processing a request');
  return Brewery.findById(request.params.id)
    .then(brewery => {
      if(!brewery) {
        throw httpErrors(404, 'brewery not found');
      } else {
        return Brewery.deleteOne({_id : brewery._id})
          .then((results) => {
            if(results.deletedCount === 1)
              return response.sendStatus(204);
          });
      }
    }).catch(next);
});

breweryRouter.put('/api/breweries/:id', jsonParser, (request, response, next) => {
  let options = {runValidators: true, new : true};

  return Brewery.findByIdAndUpdate(request.params.id, request.body, options)
    .then(brewery => {
      if(!brewery){
        throw httpErrors(404, 'brewery not found');
      }
      logger.log('info', 'PUT - Returning a 200 status code');
      return response.json(brewery);
    }).catch(next);
});
