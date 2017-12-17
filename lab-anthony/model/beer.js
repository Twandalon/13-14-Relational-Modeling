'use strict';

const mongoose = require('mongoose');
const Brewery = require('./brewery');
const httpErrors = require('http-errors');

const beerSchema = mongoose.Schema({
  name: {type: String, required: true,  unique: true},
  style: {type: String, required: true, minlength: 1},
  abv: {type: String, required: false, minlength: 1},
  timestamp: {type: Date, default: () => new Date()},
  brewery : {
    type : mongoose.Schema.Types.ObjectId,
    required : true,
    ref : 'brewerie',
  },
});

beerSchema.pre('save', function(done){
  console.log('saving beer');
  return Brewery.findById(this.brewery)
    .then(breweryFound => {
      console.log('breweryfound', breweryFound);
      if(!breweryFound)
        throw httpErrors(404, 'brewery not found');

      breweryFound.beers.push(this._id);
      return breweryFound.save();
    })
    .then(() => done())
    .catch(done);
});

beerSchema.post('remove', (document, done) => {
  return Brewery.findById(document.brewery)
    .then(breweryFound => {
      if(!breweryFound)
        throw httpErrors(404,'brewery not found');
      breweryFound.beers = breweryFound.beers.filter(beer => {
        return beer._id.toString() !== document._id.toString();
      });
      return breweryFound.save();
    })
    .then(() => done())
    .catch(done);
});

module.exports = mongoose.model('beer', beerSchema);
