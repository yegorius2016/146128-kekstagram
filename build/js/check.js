var getMessage = function(a, b) {
  if (typeof a === 'boolean') {
    if (a == true) {
    return('Переданное GIF-изображение анимировано и содержит' + ' ' + b + ' ' + 'кадров');
    }
    else if (a == false) {
    return('Переданное GIF-изображение не анимировано');
    }
  }
  if (typeof a === 'number') {
    return('Переданное SVG-изображение содержит' + ' ' + a + ' ' + 'объектов и' + ' ' + (b * 4) + ' ' + 'аттрибутов');
  }
  if (Array.isArray(a)) {
    var sum = 0;
    for(var i = 0; i < a.length; i++) {
      sum += a[i];
    }
    return('Количество красных точек во всех строчках изображения:' + ' ' + sum);
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    var square = 0;
    for(var i = 0; i < a.length; i++) {
      square += a[i] * b[i];
    }
    return('Общая площадь артефактов сжатия:' + ' ' + square + ' ' + 'пикселей');
  }
  }
}
 



