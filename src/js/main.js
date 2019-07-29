(function () {
  var modalOpenBtn = document.querySelector('.button--open');
  var modalCloseBtn = document.querySelector('.button--close');
  var modal = document.querySelector('.modal');

  function closeModal() {
    modal.classList.remove('modal--active');
  }

  modalOpenBtn.addEventListener('click', function () {
    modal.classList.add('modal--active');
  });
  modalCloseBtn.addEventListener('click', closeModal);
})();
