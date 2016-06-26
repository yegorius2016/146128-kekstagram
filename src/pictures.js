'use strict';

var filters = document.querySelector('.filters');
filters.classList.add('hidden');

var photosContainer = document.querySelector('.pictures');

var FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;
var DEFAULT_FILTER = 'popular';
var pageNumber = 0;
var PAGE_SIZE = 12;
var galleryFiltered = [];
var photos = [];

var getGallery = require('./get_gallery');
var Photo = require('./photo');
var utils = require('./utils.js');

var renderGallery = function() {
  var from = pageNumber * PAGE_SIZE;
  var to = from + PAGE_SIZE;
  galleryFiltered.slice(from, to).forEach(function(photo) {
    photosContainer.appendChild(new Photo(photo));
  });
};

var isNextPageAvailable = function() {
  return pageNumber < Math.ceil(photos.length / PAGE_SIZE);
};

var renderNextPages = function(reset) {
  if (reset) {
    pageNumber = 0;
    photosContainer.innerHTML = '';
  }
  while (utils.isBottomReached() &&
  isNextPageAvailable()) {
    renderGallery();
    pageNumber++;
  }
};

var currentFilterValue;
var getGalleryFiltered = function(filter) {
  currentFilterValue = filter;
  galleryFiltered = photos.slice(0);
  switch (filter) {
    case 'popular':
      break;
    case 'new':
      galleryFiltered = galleryFiltered.filter(function(photo) {
        var timeInterval = new Date() - new Date(photo.date);
        if (timeInterval < 0) {
          return false;
        } else {
          return timeInterval < FOUR_DAYS;
        }
      });
      galleryFiltered.sort(function(a, b) {
        return b.date - a.date;
      });
      break;
    case 'discussed':
      galleryFiltered.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
  }
  if (galleryFiltered.length) {
    return galleryFiltered;
  } else {
    return photosContainer.classList.add('pictures-none');
  }
};

var setFilterEnabled = function(filter) {
  galleryFiltered = getGalleryFiltered(filter);
  renderNextPages(true);
};

var setFiltrationEnabled = function() {
  filters.addEventListener('click', function(evt) {
    if (evt.target.value !== currentFilterValue &&
      evt.target.tagName === 'INPUT') {
      photosContainer.classList.remove('pictures-none');
      setFilterEnabled(evt.target.value);
    }
  });
};

var THROTTLE_DELAY = 100;
var setScrollEnabled = function() {
  var lastCall = Date.now();
  window.addEventListener('scroll', function() {
    if (Date.now() - lastCall >= THROTTLE_DELAY) {
      renderNextPages();
      lastCall = Date.now();
    }
  });
};

getGallery('//o0.github.io/assets/json/pictures.json', function(loadedPhotos) {
  photos = loadedPhotos;
  renderGallery();
  setFiltrationEnabled(true);
  setFilterEnabled(DEFAULT_FILTER);
  setScrollEnabled();
});
