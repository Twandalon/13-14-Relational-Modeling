'use strict';

const mongoose = require('mongoose');

const brewerySchema = mongoose.Schema({
  brewery: {type: String, required: true,  unique: true},
  location: {type: String, required: true, minlength: 1},
  founded: {type: String, required: false, minlength: 1},
  timestamp: {type: Date, default: () => new Date()},
  beers : [{type : mongoose.Schema.Types.ObjectId,
    ref : 'beer'}],
},{
  usePushEach: true,
});

module.exports = mongoose.model('brewerie', brewerySchema);
