/*
 Copyright 2016 Fabian Cook

 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at

 http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
 */
const FastwayAction = require('./action'),
  FastwayContext = require('./context'),
  FastwayController = require('./controller'),
  FastwayResponse = require('./response'),
  Fastway = require('./fastway');

/**
 * @param {object} definition
 * @returns {Fastway}
 */
exports.init = function(definition = require('../definition.json')) {
  const fastway = new Fastway();
  fastway.define(definition);
  return fastway;
};

exports.Fastway = Fastway;
exports.FastwayAction = FastwayAction;
exports.FastwayContext = FastwayContext;
exports.FastwayController = FastwayController;
exports.FastwayResponse = FastwayResponse;