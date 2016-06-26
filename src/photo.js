'use strict';

var templateElement = document.getElementById('picture-template');
var elementToClone;
var IMAGE_WIDTH = 182;
var IMAGE_HEIGHT = 182;

elementToClone = 'content' in templateElement ? templateElement.content.querySelector('.picture') : templateElement.querySelector('.picture');

var Photo = function(data) {
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
  return element;
};

  module.exports = Photo;
