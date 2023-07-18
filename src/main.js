const sortBtn = document.getElementById('sort-button');
const searchBoxEl = document.getElementById('search-box');
const filterBtn = document.getElementById('filter-button');
const genreSelectEl = document.getElementById('filter-type');

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
};

const renderOnScreen = (movieList) => {
  movieSectionEl.textContent = '';
  movieList.forEach((movie) => {
    createBoxElement(movie);
    checkFav();
  });
  addFavEventListener();
};

const filterMovieList = (movieList, genre) => {
  const favoriteList = JSON.parse(localStorage.getItem('favorites'));
  switch (genre) {
  case 'All':
    return movieList;
  case 'Favorites':
    return movieList.filter((movie) => favoriteList.includes(movie.id.toString()));
  default:
    return movieList.filter((movie) => movie.genres.includes(genre));
  }
};

const sortAlpha = () => {
  const movieList = JSON.parse(localStorage.getItem('movies'));
  const sortedList = movieList.sort((a, b) => a.name.localeCompare(b.name));
  renderOnScreen(sortedList);
};

const getAllMovies = async () => {
  const response = await fetch('https://api.tvmaze.com/shows');
  const movies = await response.json();
  const sortedByWeight = movies.sort((a, b) => b.weight - a.weight);
  localStorage.setItem('movies', JSON.stringify(sortedByWeight));
  return sortedByWeight;
};

const getSearchedMovies = async () => {
  const query = searchBoxEl.value.trim().toLowerCase().replace(/ /g, '+');
  if (query) {
    const response = await fetch(`https://api.tvmaze.com/search/shows?q=${query}`);
    const movies = await response.json();
    const shows = movies.map((movie) => movie.show);
    const filteredShows = filterMovieList(shows, genreSelectEl.value);
    localStorage.setItem('movies', JSON.stringify(filteredShows));
    return filteredShows;
  }
  const movies = await getAllMovies();
  const filteredShows = filterMovieList(movies, genreSelectEl.value);
  localStorage.setItem('movies', JSON.stringify(filteredShows));
  return filteredShows;
};

const renderMovies = async (movies) => {
  const movieList = await movies();
  renderOnScreen(movieList);
};

renderMovies(getAllMovies);

sortBtn.addEventListener('click', sortAlpha);
filterBtn.addEventListener('click', () => {
  renderMovies(getSearchedMovies);
  searchBoxEl.value = '';
});

searchBoxEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') filterBtn.click();
});
