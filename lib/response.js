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
class FastwayResponse {

  /**
   * @param {FastwayInternalResponse|object} response
   */
  constructor(response) {
    this.raw = response;
  }

  /**
   * @throws
   * @returns {*}
   */
  getResult() {
    const error = this.getError();
    if(error) {
      throw error;
    }
    return this.raw && (this.raw.result || this.raw.data) || {};
  }

  /**
   * @returns {number}
   */
  getGeneratedIn() {
    return this.raw && this.raw.generated_in || 0;
  }

  getError() {
    if(this.error) {
      return this.error;
    }
    if(!(this.raw && this.raw.error)) {
      return null;
    }
    return this.error = new Error(this.raw.error);
  }

}

/**
 * @typedef {object} FastwayInternalResponse
 * @property {object} result
 * @property {object|null} data
 * @property {number} generated_in
 * @property {string|null} error
 */

module.exports = FastwayResponse;