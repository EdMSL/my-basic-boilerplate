(function iife() {
  var modalOpenBtn = document.querySelector('.button--open');
  var modalCloseBtn = document.querySelector('.button--close');
  var modal = document.querySelector('.modal');

  function closeModal() {
    modal.classList.remove('modal--active');
  }
  function openModal() {
    modal.classList.add('modal--active');
  }

  modalOpenBtn.addEventListener('click', openModal);
  modalCloseBtn.addEventListener('click', closeModal);
}());
