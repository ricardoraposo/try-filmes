import { renderOnScreen } from './renderFunctions';

const sortBtn = document.getElementById('sort-button');
const searchBoxEl = document.getElementById('search-box');
const filterBtn = document.getElementById('filter-button');
const genreSelectEl = document.getElementById('filter-type');

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
  renderMovies(getSearchedMovies)
  searchBoxEl.value = '';
});

searchBoxEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') filterBtn.click();
});
