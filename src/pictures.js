'use strict';
var filters = document.querySelector('.filters');
filters.classList.add('hidden');

var templateElement = document.getElementById('picture-template');
var photosContainer = document.querySelector('.pictures');
var elementToClone;
var IMAGE_WIDTH = 182;
var IMAGE_HEIGHT = 182;
var XHR_TIMEOUT = 10000;
var FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;
var pageNumber = 0;
var PAGE_SIZE = 12;
var responseData = [];
var galleryFiltered = [];
var photos = [];

var getGallery = function(source, callback) {
  var xhr = new XMLHttpRequest();

  photosContainer.classList.add('pictures-loading');
  var setClassOnFailure = function() {
    photosContainer.classList.remove('pictures-loading');
    photosContainer.classList.add('pictures-failure');
  };

  xhr.timeout = XHR_TIMEOUT;
  xhr.addEventListener('timeout', function() {
    setClassOnFailure();
  });

  xhr.addEventListener('error', function() {
    setClassOnFailure();
  });

  xhr.addEventListener('loadend', function() {
    if (xhr.status !== 200) {
      setClassOnFailure();
    }
  });

  xhr.addEventListener('load', function(evt) {
    responseData = JSON.parse(evt.target.response);
    callback(responseData);
    filters.classList.remove('hidden');
    photosContainer.classList.remove('pictures-loading');
  });

  xhr.open('GET', source);
  xhr.send();
};

if ('content' in templateElement) {
  elementToClone = templateElement.content.querySelector('.picture');
} else {
  elementToClone = templateElement.querySelector('.picture');
}

var setPhotoElement = function(data) {
  var element = elementToClone.cloneNode(true);
  var imgElement = element.querySelector('img');
  element.querySelector('.picture-comments').textContent = data.comments;
  element.querySelector('.picture-likes').textContent = data.likes;

  var preview = new Image();
  preview.addEventListener('load', function() {
    imgElement.src = preview.src;
    imgElement.width = IMAGE_WIDTH;
    imgElement.height = IMAGE_HEIGHT;
  });

  preview.addEventListener('error', function() {
    element.classList.add('picture-load-failure');
  });

  preview.src = data.url;
  photosContainer.appendChild(element);
};

var renderGallery = function() {
  var from = pageNumber * PAGE_SIZE;
  var to = from + PAGE_SIZE;
  galleryFiltered.slice(from, to).forEach(function(photo) {
    setPhotoElement(photo);
  });
};

var renderNextPages = function(reset) {
  if (reset) {
    pageNumber = 0;
    photosContainer.innerHTML = '';
  }

  while (isBottomReached() &&
  isNextPageAvailable()) {
    renderGallery();
    pageNumber++;
  }
};

var isBottomReached = function() {
  var foresight = 60;
  var photosContainerPosition = photosContainer.getBoundingClientRect();
  return photosContainerPosition.bottom - window.innerHeight - foresight <= 0;
};

var isNextPageAvailable = function() {
  return pageNumber < Math.ceil(photos.length / PAGE_SIZE);
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
  setFilterEnabled('popular');
  setScrollEnabled();
});
