(function(window) {

  'use strict';

  var TIMEOUT = 500,
    PLAY_TIMEOUT = 500,
    USER_TIMEOUT = 5000;

  var intervalId, globalIntervalId, isLock,
    resetGlobalInterval = function() {
      if (globalIntervalId) {
        window.clearInterval(globalIntervalId);
      }
    };

  /**
   * Takes a model and view and acts as a controller between them
   *
   * @constructor
   * @param {object} model
   * @param {object} view
   */
  function Controller(model, view) {
    var self = this;
    self.model = model;
    self.view = view;

    self.view.bind('switch', function(value) {
      self.switch(value);
    });

    self.view.bind('strict', function() {
      self.strict();
    });

    self.view.bind('start', function() {
      self.start();
    });

    self.view.bind('press', function(value) {
      self.press(value);
    });

  }

  /**
   * Switch the game state to on or off value
   *
   * @param {boolean} switch checked value
   */
  Controller.prototype.switch = function(state) {
    var self = this;
    resetGlobalInterval();
    self.model.switch(state, function() {
      self.view.render('count', 'init', state);
      self.view.render('strict', '', false);
      if (!state && intervalId) {
        window.clearInterval(intervalId);
      }
    });
  };

  /**
   * Switch the strict mode of the game
   */
  Controller.prototype.strict = function() {
    var self = this;
    self.model.setStrict(function(value) {
      self.view.render('strict', '', value);
    });
  };

  /**
   * Starts the game
   */
  Controller.prototype.start = function() {
    var self = this,
      times = 0,
      display = false;

    resetGlobalInterval();
    self.model.start(function() {
      self.view.render('count', 'prepare', display);
      intervalId = window.setInterval(function() {
        display = !display;
        self.view.render('count', 'prepare', display);

        if (++times === 3) {
          window.clearInterval(intervalId);
          self.play();
        }
      }, TIMEOUT);
    });
  };

  /**
   * Play the game and wait for user interaction
   */
  Controller.prototype.play = function() {
    var self = this,
      input;

    isLock = true;
    self.model.get(function(data) {
      input = {
        series: data.series,
        finalStep: data.finalStep,
        step: 0,
        isStrict: data.isStrict
      };

      self.view.render('board', 'cursor', false);

      intervalId = window.setInterval(function() {

        (function(value) {

          self.view.render('board', 'on', value);
          self.view.render('count', 'step', input.finalStep);
          window.setTimeout(function() {
            self.view.render('board', 'off', value);
          }, PLAY_TIMEOUT);
          if (input.step++ === input.finalStep) {
            window.clearInterval(intervalId);
            self.view.render('board', 'cursor', true);
            isLock = false;

            globalIntervalId = window.setInterval(function() {
              self.error(input.isStrict);
            }, USER_TIMEOUT);

          }
        }(input.series[input.step]));


      }, TIMEOUT * 3);
    });
  };

  /**
   * Check user click and determine the render
   *
   * @param {number} value of color
   */
  Controller.prototype.press = function(value) {
    var self = this,
      input, times = 0,
      display = false, finalStep;

    if (isLock) {
      return
    };

    resetGlobalInterval();
    self.model.get(function(data) {
      input = {
        series: data.series,
        finalStep: data.finalStep,
        cursor: data.cursor,
        isStrict: data.isStrict
      }
    });

    if (input.series[input.cursor] === parseInt(value)) {

      self.view.render('board', 'on', value);
      window.setTimeout(function() {
        self.view.render('board', 'off', value);
      }, PLAY_TIMEOUT);

      if (self.model.incrementCursor() > input.finalStep) {
        self.model.resetCursor();
        finalStep = self.model.incrementFinalStep();

        if(finalStep === input.series.length) {
          isLock = true;
          self.view.render('board', 'cursor', false);
          self.view.render('win','show');
          window.setTimeout(function() {
            self.view.render('win','hide');
            self.start();
          }, USER_TIMEOUT);
        }
        else {
          self.play();
        }
      } else {
        globalIntervalId = window.setInterval(function() {
          self.error(input.isStrict);
        }, USER_TIMEOUT);
      }
    } else {
      self.error(input.isStrict);
    }
  };

  Controller.prototype.error = function(isStrict) {
    var self = this,
      times = 0,
      display = false;

    resetGlobalInterval();
    self.view.render('count', 'error', display);
    intervalId = window.setInterval(function() {
      display = !display;
      self.view.render('count', 'error', display);
      if (++times === 3) {
        window.clearInterval(intervalId);
        if (isStrict) {
          self.start();
        } else {
          self.model.resetCursor();
          self.play();
        }
      }
    }, TIMEOUT);

  };

  window.app = window.app || {};
  window.app.Controller = Controller;

}(window));
