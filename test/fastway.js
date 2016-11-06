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
const Module = require('../lib'),
  Expect = require('chai').expect,
  Definition = require('../definition.json');

describe('Fastway', function() {

  describe('getControllerVersioned', function() {

    it('should throw if an invalid name is provided', function() {

      const fastway = new Module.Fastway();

      Expect(function() {
        fastway.getControllerVersioned('v1', 1);
      }).to.throw('Expected a FastwayController or string');

    });

    it('should throw if an invalid version is provided', function() {

      const fastway = new Module.Fastway();

      Expect(function() {
        fastway.getControllerVersioned('staging', 'name');
      }).to.throw('Expected controller version to be in the format v#');
    });

    it('should return a controller', function() {

      const fastway = new Module.Fastway();

      fastway.define({
        Controller: {
          v1: {
            Action: { }
          }
        }
      });

      const originalController = fastway['v1']['Controller'];

      Expect(originalController).to.be.instanceof(Module.FastwayController);

      const controller = fastway.getControllerVersioned('v1', 'Controller');

      Expect(controller).to.equal(originalController);

    });

  });

  describe('getController', function() {

    it('should throw on no version', function() {

      const fastway = new Module.Fastway();

      Expect(function() {
        fastway.getController('Controller');
      }).to.throw('Can not create controller dynamically without a version');

    });

    it('should get the highest version', function() {

      const fastway = new Module.Fastway();

      fastway.define({
        Controller: {
          v1: {
            Action: { }
          },
          v2: {
            Action: { },
            Action2: { }
          }
        }
      });

      const expectedController = fastway['v2']['Controller'];

      Expect(expectedController).to.be.instanceof(Module.FastwayController);

      const controller = fastway.getController('Controller');

      Expect(controller).to.equal(expectedController);

    })

  })

});