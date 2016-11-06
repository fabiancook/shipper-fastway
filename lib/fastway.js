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
const FastwayController = require('./controller');

class Fastway {
  constructor() {

  }

  /**
   * @param {string} name
   * @param {object} definition
   * @returns {object}
   */
  addController(name, definition) {
    return Object.keys(definition)
      .reduce(function(that, version) {
        that.addControllerVersion(version, name, definition[version]);
        return that;
      }, this);
  }

  /**
   * @param {string|number} version
   * @param {string}  name
   * @param {object|null} [definition=null
   * @returns {FastwayController}
   */
  addControllerVersion(version, name, definition = null) {
    version = Fastway.getVersion(version);
    this[version] = this[version] || {};
    if(this[version][name]) {
      throw new Error(`Controller ${version}:${name} already exists`);
    }
    const controller = new FastwayController(
      version,
      name,
      definition
    );
    return this[version][name] = controller;
  }

  /**
   * @param {object} definition
   */
  define(definition) {
    Object.keys(definition)
      .reduce(function(that, name) {
        that.addController(name, definition[name]);
        return that;
      }, this);
  }

  /**
   * @param {FastwayContext|object} context
   * @param {string|FastwayController} controller
   * @param {string|FastwayAction} action
   * @param {*} data
   * @returns {FastwayResponse}
   * @throws Error
   */
  async invoke(context, controller, action, data) {
    controller = this.getController(controller);
    return controller.invoke(context, action, data);
  }

  /**
   * @param {FastwayContext|object} context
   * @param {string|number} version
   * @param {string|FastwayController} controller
   * @param {string|FastwayAction} action
   * @param {*} data
   * @returns {FastwayResponse}
   * @throws Error
   */
  async invokeWithVersion(context, version, controller, action, data) {
    controller = this.getControllerVersioned(version, controller);
    return this.invoke(context, controller, action, data);
  }

  /**
   * @param {string|number} version
   * @returns {string}
   */
  static getVersion(version) {
    if('number' === typeof version || /^\d+$/.test(version)) {
      version = `v${version}`
    } else if('string' !== typeof version || !/^v\d+$/.test(version)) {
      throw new Error('Expected controller version to be in the format v#')
    }
    return version;
  }

  /**
   * @param {FastwayController|string} controller
   * @returns {FastwayController}
   * @throws Error
   */
  getController(controller) {
    if(controller instanceof FastwayController) {
      return controller;
    }
    if('string' !== typeof controller) {
      throw new Error('Expected a FastwayController or string');
    }
    const that = this;
    const version = Object.keys(this)
      .filter(function(version) {
        return /^v\d+$/.test(version);
      })
      .map(function(version) {
        return +version.substr(1);
      })
      .sort()
      .reverse()
      .find(function(version) {
        return !!that['v' + version][controller];
      });
    if(version) {
      return this.getControllerVersioned(version, controller);
    }
    throw new Error('Can not create controller dynamically without a version');
  }

  /**
   * @param {string|number} version
   * @param {FastwayController|string} controller
   * @returns {*}
   * @throws Error
   */
  getControllerVersioned(version, controller) {
    if(controller instanceof FastwayController) {
      return controller;
    }
    if('string' !== typeof controller) {
      throw new Error('Expected a FastwayController or string');
    }
    version = Fastway.getVersion(version);
    return this[version][controller] || (
        this[version][controller] = new FastwayController(
          version,
          controller,
          null
        )
      );
  }
}

module.exports = Fastway;