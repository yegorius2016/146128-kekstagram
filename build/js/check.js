function getMessage(a:*, b:*=):string {
  if (typeof(a) === 'boolean') {
    if (a = true) {
    alert('Переданное GIF-изображение анимировано и содержит' + ' ' + b + 'кадров');
    }
    else {
    alert('Переданное GIF-изображение не анимировано');
    }
  if (typeof(a) === 'number') {
    alert ('Переданное SVG-изображение содержит' + a + 'объектов и' + (b * 4) + ' ' + 'атрибутов');
  }
  if Array.isArray([a]) {
    alert ()
  }
  
  
} 

