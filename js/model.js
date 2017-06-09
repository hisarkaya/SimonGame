(function(window) {
  'use strict';

  var isGameOn = false,
      isStrict = false,
      series,
      finalStep,
      cursor;

  function Model() {};

  Model.prototype.switch = function(state, callback) {
    isGameOn = state;
    isStrict = false;
    callback();
  };

  Model.prototype.start = function(callback) {
    var i;
    if(isGameOn) {
      series = [];
      finalStep = 0;
      cursor = 0;
      for(i = 0; i < 20; i += 1) {
        series.push(Math.floor(Math.random() * 4));
      }
      callback();
    }
  };

  Model.prototype.get = function(callback) {
    callback({
      series: series,
      finalStep: finalStep,
      cursor: cursor,
      isStrict: isStrict
    });
  };

  Model.prototype.incrementCursor = function() {
    return ++cursor;
  };

  Model.prototype.resetCursor = function() {
    cursor = 0;
  };

  Model.prototype.setStrict = function(callback) {
    if(isGameOn) {
      isStrict = !isStrict;
      callback(isStrict);
    }
  };

  Model.prototype.incrementFinalStep = function() {
    return ++finalStep;
  };


  window.app = window.app || {};
  window.app.Model = Model;

}(window));
