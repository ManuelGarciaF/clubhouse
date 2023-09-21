const password = document.querySelector('#password');
const passwordConfirm = document.querySelector('#passwordconfirm');

passwordConfirm.addEventListener('input', () => {
  if (password.value !== passwordConfirm.value) {
    passwordConfirm.setCustomValidity('Passwords do not match');
  } else {
    passwordConfirm.setCustomValidity('');
  }
})
