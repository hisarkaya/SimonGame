(function(window) {
  'use strict';

  function SimonGame() {
    this.model = new app.Model();
    this.view = new app.View();
    this.controller = new app.Controller(this.model, this.view);
  };

  var game = new SimonGame();


}(window));
