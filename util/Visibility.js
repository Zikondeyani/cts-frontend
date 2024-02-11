export class Visibility {
  hide (elements) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = 'none'
    }
  }
  show (elements) {
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.display = 'inline'
    }
  }
}


