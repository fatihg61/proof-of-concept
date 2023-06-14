const expandButton = document.querySelector('header button')
expandButton.addEventListener('click', expand)

function expand () {
  document.body.classList.toggle('expand')
}

  const bookNowButton = document.querySelector('.book-now');

  bookNowButton.addEventListener('click', () => {
    if (window.innerWidth < 768) {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    }
  });