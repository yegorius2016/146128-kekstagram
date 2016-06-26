'use strict';

var photosContainer = document.querySelector('.pictures');
var filters = document.querySelector('.filters');

var responseData = [];
var XHR_TIMEOUT = 10000;

var getGallery = function(source, callback) {
  var xhr = new XMLHttpRequest();

  photosContainer.classList.add('pictures-loading');
  var setClassOnFailure = function() {
    photosContainer.classList.remove('pictures-loading');
    photosContainer.classList.add('pictures-failure');
  };

  xhr.timeout = XHR_TIMEOUT;
  xhr.ontimeout = function() {
    setClassOnFailure();
  };

  xhr.onerror = function() {
    setClassOnFailure();
  };

  xhr.onloadend = function() {
    if (xhr.status !== 200) {
      setClassOnFailure();
    }
  };

  xhr.onload = function(evt) {
    responseData = JSON.parse(evt.target.response);
    callback(responseData);
    filters.classList.remove('hidden');
    photosContainer.classList.remove('pictures-loading');
  };

  xhr.open('GET', source);
  xhr.send();
};

module.exports = getGallery;
