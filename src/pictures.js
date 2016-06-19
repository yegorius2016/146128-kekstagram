'use strict';
var filtersToHide = document.querySelector('.filters');
filtersToHide.classList.add('hidden');

var templateElement = document.getElementById('picture-template');
var photosContainer = document.querySelector('.pictures');
var elementToClone;
var IMAGE_WIDTH = 182;
var IMAGE_HEIGHT = 182;
var XHR_TIMEOUT = 10000;
var FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;
var responseData = [];
var photos;

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
    filtersToHide.classList.remove('hidden');
    photosContainer.classList.remove('pictures-loading');
  };

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
  preview.onload = function() {
    imgElement.src = preview.src;
    imgElement.width = IMAGE_WIDTH;
    imgElement.height = IMAGE_HEIGHT;
  };

  preview.onerror = function() {
    element.classList.add('picture-load-failure');
  };

  preview.src = data.url;
  photosContainer.appendChild(element);
};

var renderGallery = function(loadedPhotos) {
  photosContainer.innerHTML = '';
  loadedPhotos.forEach(function(photo) {
    setPhotoElement(photo);
  });
};

var getGalleryFiltered = function(filter) {
  var galleryToFilter = photos.slice(0);
  switch (filter) {
    case 'popular':
      break;
    case 'new':
      galleryToFilter = galleryToFilter.filter(function(photo) {
        var timeInterval = new Date() - new Date(photo.date);
        if (timeInterval < 0) {
          return false;
        } else {
          return timeInterval < FOUR_DAYS;
        }
      });
      galleryToFilter.sort(function(a, b) {
        return b.date - a.date;
      });
      break;
    case 'discussed':
      galleryToFilter.sort(function(a, b) {
        return b.comments - a.comments;
      });
      break;
  }
  if (galleryToFilter.length) {
    return galleryToFilter;
  } else {
    return photosContainer.classList.add('pictures-none');
  }
};

var setFilterEnabled = function(filter) {
  var galleryFiltered = getGalleryFiltered(filter);
  renderGallery(galleryFiltered);
};

var setFiltrationEnabled = function() {
  var filters = document.querySelectorAll('input[name=filter]');
  for (var i = 0; i < filters.length; i++) {
    filters[i].onclick = function() {
      photosContainer.classList.remove('pictures-none');
      setFilterEnabled(this.value);
    };
  }
};

getGallery('//o0.github.io/assets/json/pictures.json', function(loadedPhotos) {
  photos = loadedPhotos;
  renderGallery(photos);
  setFiltrationEnabled(true);
  setFilterEnabled('popular');
});
