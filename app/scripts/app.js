'use strict';

function App() {
  console.log('app initialized');
}

module.exports = App;

App.prototype.init = function () {
  console.log('boop');
};