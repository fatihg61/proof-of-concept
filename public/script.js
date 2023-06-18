const expandButton = document.querySelector('header button')
expandButton.addEventListener('click', expand)

function expand () {
  document.body.classList.toggle('expand')
}

window.addEventListener('DOMContentLoaded', function() {
  const loadingScreen = document.getElementById('loadingScreen');
  const content = document.getElementById('content');

  setTimeout(function() {
    loadingScreen.style.opacity = '0';
    setTimeout(function() {
      loadingScreen.style.display = 'none';
      content.style.display = 'block';
    }, 500);
  }, 3000);
});


