let favoriteMovies = localStorage.getItem('favorites')
  ? JSON.parse(localStorage.getItem('favorites'))
  : [];
const movieSectionEl = document.getElementById('movie-section');

const createBoxElement = (movie) => {
  const box = document.createElement('div');
  const heart = document.createElement('span');
  const boxImage = document.createElement('img');
  heart.classList.add('heart');
  heart.classList.add('heart-blue');
  boxImage.src = `${movie.image.medium}`;
  box.classList.add('box');
  box.setAttribute('id', movie.id);
  box.appendChild(boxImage);
  box.appendChild(heart);
  movieSectionEl.appendChild(box);
};

const addFavEventListener = () => {
  const heartElList = document.querySelectorAll('.heart');
  heartElList.forEach((heart) => {
    heart.addEventListener('click', (e) => {
      e.target.classList.toggle('heart-red');
      e.target.classList.toggle('heart-blue');
      if (e.target.classList.contains('heart-red')) {
        favoriteMovies.push(heart.parentNode.id);
        localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
      } else {
        favoriteMovies = favoriteMovies.filter((movie) => movie !== heart.parentNode.id);
        localStorage.setItem('favorites', JSON.stringify(favoriteMovies));
      }
    });
  });
};

const checkFav = () => {
  const favoriteList = JSON.parse(localStorage.getItem('favorites'));
  const boxElements = document.querySelectorAll('.box');
  boxElements.forEach((box) => {
    if (favoriteList.includes(box.id)) {
      box.lastChild.classList.add('heart-red');
    }
  });
}

export const renderOnScreen = (movieList) => {
  movieSectionEl.textContent = '';
  movieList.forEach((movie) => {
    createBoxElement(movie);
    checkFav();
  });
  addFavEventListener();
};
