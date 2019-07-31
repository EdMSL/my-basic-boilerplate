(function() {
  var input = document.querySelector('.block__input');

  function onInputChange() {
    event.target.classList.toggle('block__input--colored');
  }

  input.addEventListener('change', onInputChange);
})();
