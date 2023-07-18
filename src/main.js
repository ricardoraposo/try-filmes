const movieSectionEl = document.getElementById('movie-section');
const sortBtn = document.getElementById('sort-button');
const searchBoxEl = document.getElementById('search-box');
const filterBtn = document.getElementById('filter-button');
const genreSelectEl = document.getElementById('filter-type');

const changeFavStatus = () => {
  const heartElList = document.querySelectorAll('.heart');
  heartElList.forEach((heart) => {
    heart.addEventListener('click', (e) => {
      e.target.classList.toggle('heart-red')
    })
  })
}
 
const renderOnScreen = (movieList) => {
  movieSectionEl.textContent = '';
  movieList.forEach((movie) => {
    const box = document.createElement('div');
    box.classList.add('box');
    box.setAttribute('id', movie.id);
    const heart = document.createElement('span');
    heart.classList.add('heart')
    heart.classList.add('heart-blue')
    const boxImage = document.createElement('img');
    boxImage.src = `${movie.image.medium}`;
    box.appendChild(boxImage);
    box.appendChild(heart);
    movieSectionEl.appendChild(box);
  });
  changeFavStatus();
};

const renderMovies = async (movies) => {
  const movieList = await movies();
  renderOnScreen(movieList);
};

const filterMovieList = (movieList, genre) => {
  if (genre !== 'all') {
    return movieList.filter((movie) => movie.genres.includes(genre));
  }
  return movieList;
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
    renderOnScreen(filteredShows);
  } else {
    const movies = await getAllMovies();
    const filteredShows = filterMovieList(movies, genreSelectEl.value);
    localStorage.setItem('movies', JSON.stringify(filteredShows));
    renderOnScreen(filteredShows);
  }
};

renderMovies(getAllMovies);

sortBtn.addEventListener('click', sortAlpha);
filterBtn.addEventListener('click', () => {
  getSearchedMovies();
  searchBoxEl.value = '';
});

searchBoxEl.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') filterBtn.click();
});
