'use strict';

var photosContainer = document.querySelector('.pictures');

module.exports = {
  isBottomReached: function() {
    return photosContainer.getBoundingClientRect().bottom - window.innerHeight <= 60;
  }
};
