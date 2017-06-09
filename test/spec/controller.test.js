describe('controller', function() {

  'use strict';

  var subject, view, model;

  var modelSetup = function(data) {

    model.switch.and.callFake(function(state, callback) {
      callback();
    });

    model.setStrict.and.callFake(function(callback) {
      callback(data.strict);
    });

    model.start.and.callFake(function(callback) {
      callback();
    });

    model.get.and.callFake(function(callback) {
      callback(data);
    });

    model.incrementCursor.and.callFake(function(callback) {
      callback(data);
    });

  };

  var createMockView = function() {
    var events = {};
    return {
      render: jasmine.createSpy('render'),
      bind: function(event, handler) {
        events[event] = handler;
      },
      trigger: function(event, parameter) {
        events[event](parameter);
      }
    };
  }

  beforeEach(function() {
    model = jasmine.createSpyObj('model', ['switch', 'setStrict', 'start', 'get', 'incrementCursor']);
    view = createMockView();
    subject = new app.Controller(model, view);
  });

  it('should switch on/off the game', function() {

    modelSetup({});
    view.trigger('switch', true);

    expect(model.switch).toHaveBeenCalledWith(true, jasmine.any(Function));
    expect(view.render).toHaveBeenCalledWith('count', 'init', true);
  });

  it('should switch the strict mode of the game', function() {
    var data = {
      strict: false
    }

    modelSetup(data);
    view.trigger('strict');

    expect(model.setStrict).toHaveBeenCalledWith(jasmine.any(Function));
    expect(view.render).toHaveBeenCalledWith('strict', '', data.strict)
  });

  it('should start the game', function() {
    var data = {};

    modelSetup(data);
    view.trigger('start');

    expect(model.start).toHaveBeenCalledWith(jasmine.any(Function));
    expect(view.render).toHaveBeenCalledWith('count', 'prepare', false);
  });

  it('should play the game', function() {
    var data = {
      finalStep: 0
    };

    modelSetup(data);
    subject.play();

    expect(model.get).toHaveBeenCalledWith(jasmine.any(Function));
  });

});
