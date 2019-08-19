(function iife() {
  var modalOpenBtn = document.querySelector('.button--open');
  var modalCloseBtn = document.querySelector('.button--close');
  var modal = document.querySelector('.modal');

  function closeModal() {
    modal.classList.add('modal--closed');
  }
  function openModal() {
    modal.classList.remove('modal--closed');
  }

  modalOpenBtn.addEventListener('click', openModal);
  modalCloseBtn.addEventListener('click', closeModal);
}());
