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
const Request = require('request-promise-any'),
  JSONSchema = require('jsonschema'),
  Url = require('url'),
  FastwayResponse = require('./response');

class FastwayAction {

  /**
   * @param {FastwayController} controller
   * @param {string} name
   * @param {object|null} [definition=null]
   */
  constructor(controller, name, definition = null) {
    this.controller = controller;
    this.name = name;
    this.definition = definition;
  }

  /**
   * @param {FastwayContext|object} context
   * @param {*} data
   * @returns {FastwayResponse}
   */
  async invoke(context, data) {
    const options = this.getOptions(context, data);
    const response = await Request(options);
    return new FastwayResponse(response);
  }

  /**
   * @param {FastwayContext|object} context
   * @param {*} data
   * @returns {object}
   */
  getOptions(context, data) {
    this.validateThrow(data);
    const url = this.getUrl(context);
    return {
      url: url,
      method: 'POST',
      body: data,
      json: true
    };
  }

  /**
   * @param {FastwayContext|object} context
   * @returns {string}
   * @throws Error
   */
  getUrl(context) {
    const controllerUrl = this.controller.getUrl(context);
    if('string' !== typeof this.name || !/^[A-Z0-9\._\-~\(\)'!*:@,;]+$/i.test(this.name)) {
      throw new Error('Expected action name to be a url-safe path string');
    }
    // controllerUrl will end in "/", so the action name will end up at the end
    // v1/controller/action
    const actionUrl = Url.resolve(controllerUrl, this.name);
    const parsedUrl = Url.parse(actionUrl);
    if(parsedUrl.search) {
      delete parsedUrl.search;
    }
    parsedUrl.query = {
      api_key: context.apiKey
    };
    return Url.format(parsedUrl);
  }

  /**
   * @param {*} data
   * @throws ValidationError
   */
  validateThrow(data) {
    const result = this.validate(data);
    if(result.valid) {
      return;
    }
    throw result.error;
  }
  /**
   * @param {*} data
   * @returns {{valid:boolean,error:ValidationError}}
   */
  validate(data) {
    if(!this.definition) {
      return {
        valid: true
      };
    }
    const result = JSONSchema.validate(data, this.definition);
    if(result.valid) {
      return {
        valid: true
      };
    }
    return {
      valid: false,
      errors: result.errors,
      error: result.errors[0]
    };
  }
}

module.exports = FastwayAction;