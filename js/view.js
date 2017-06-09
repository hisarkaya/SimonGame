(function(window, $) {
  'use strict';

  var AUDIO_ROOT_URL = 'https://s3.amazonaws.com/freecodecamp/simonSound',
    START_TEXT = '- -',
    ERROR_TEXT = '! !';

  var colors = ['green', 'red', 'yellow', 'blue'];

  function paddZero(str) {
    return ('' + str).length === 1 ? '0' + str : str;
  }

  function View() {
    this.$count = $('.count-panel');
    this.$switch = $('.switch > input');
    this.$start = $('.start > button');
    this.$strict = $('.strict > button');
    this.$strictDisplay = $('.strict-display');
    this.$boardDivs = $('.board > svg > path');
    this.$audio = $('audio');
    this.$colorButtons = $('svg > path');
    this.$winMessage = $('.win-message');
  };


  View.prototype.bind = function(event, handler) {
    var self = this;

    switch (event) {
      case 'switch':
        self.$switch.on('click', function(e) {
          handler(e.target.checked);
        });
        break;
      case 'start':
        self.$start.on('click', function() {
          handler();
        });
        break;
      case 'strict':
        self.$strict.on('click', function() {
          handler();
        });
        break;
      case 'press':
        self.$colorButtons.on('click', function() {
          handler(this.id);
        });
        break;
      default:

    }
  };

  View.prototype.render = function(target, action, value) {
    var self = this,
      div, className;
    switch (target) {
      case 'count':
        if (action === 'init') {
          if (value) {
            self.$count.addClass('game-on');
          } else {
            self.$count.removeClass('game-on');
            self.$count.text(START_TEXT);
          }
        }
        if (action === 'prepare') {
          if (value) {

            self.$count.addClass('game-on');
          } else {
            self.$count.text(START_TEXT);
            self.$count.removeClass('game-on');
          }
        }
        if (action === 'step') {
          self.$count.text(paddZero(value + 1));
        }
        if (action === 'error') {
          if (value) {
            self.$count.addClass('game-on');
            self.$count.text(ERROR_TEXT);
          } else {
            self.$count.removeClass('game-on');
            self.$count.text(ERROR_TEXT);
          }
        }
        break;
      case 'board':
        div = $(self.$boardDivs.get(value));
        className = colors[value] + '-light';
        if (action === 'on') {
          div.addClass(className);
          self.$audio.attr('src', AUDIO_ROOT_URL + (parseInt(value) + 1) + '.mp3');
          self.$audio.get(0).play();
        }
        if (action === 'off') {
          div.removeClass(className);
        }
        if(action === 'cursor') {
          if(value) {
            self.$boardDivs.removeClass('remove-pointer');
          }
          else {
            self.$boardDivs.addClass('remove-pointer');
          }
        }
        break;
      case 'strict':
        if(value) {
          self.$strictDisplay.addClass('strict-on');
        }
        else {
          self.$strictDisplay.removeClass('strict-on');
        }
        break;
      case 'win':
        if(action === 'show') {
          self.$winMessage.show(1000);
        }
        else {
          self.$winMessage.hide(1000);
        }
      break;
      default:

    }
  };

  window.app = window.app || {};
  window.app.View = View;

}(window, jQuery));
