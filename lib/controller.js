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
const Url = require('url'),
  FastwayAction = require('./action');

class FastwayController {
  /**
   * @param {string|number} version
   * @param {string} name
   * @param {object|null} [definition=null]
   */
  constructor(version, name, definition = null) {
    this.version = version;
    this.name = name;
    this.definiton = definition;
  }
  /**
   * @param {FastwayContext|object} [context={}]
   * @returns {string}
   * @throws Error
   */
  getUrl(context = {}) {
    var version = this.version;
    if('number' === typeof version || /^\d+$/.test(version)) {
      version = `v${version}`
    } else if('string' !== typeof version || !/^v\d+$/.test(version)) {
      throw new Error('Expected controller version to be in the format v#')
    }
    if('string' !== typeof this.name || !/^[A-Z0-9\._\-~\(\)'!*:@,;]+$/i.test(this.name)) {
      throw new Error('Expected controller name to be a url-safe path string');
    }
    const path = `/${version}/${this.name}/`;
    if(context.url && 'string' !== typeof context.url) {
      throw new Error('Expected valid URL for context');
    } else if(!context.url) {
      return path;
    }
    return Url.resolve(context.url, path);
  }

  /**
   * @param {FastwayContext|object} context
   * @param {string} action
   * @param {*} data
   * @returns {FastwayResponse}
   * @throws Error
   */
  async invoke(context, action, data) {
    if(!this[action] && !(action instanceof FastwayAction)) {
      this[action] = new FastwayAction(
        this,
        action,
        (this.definiton && this.definiton[action]) || null
      );
    }
    const actionInstance = action instanceof FastwayAction ? action : this[action];
    if(actionInstance.controller !== this) {
      throw new Error(`Expected controller for ${action} to be ${this.name}`);
    }
    return actionInstance.invoke(context, data);
  }

}

module.exports = FastwayController;
