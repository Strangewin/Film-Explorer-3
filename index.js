const apiKey = "58e7f8ea"; 


const randomTitles = [
    "Inception", "Titanic", "The Matrix", "Gladiator", "Pulp Fiction",
    "The Godfather", "Frozen", "Interstellar", "The Dark Knight", "Shrek",
    "Avatar", "Forrest Gump", "Avengers", "Toy Story", "Joker"
  ];
  
  function getRandomTitles(count) {
    const shuffled = randomTitles.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
  function displayMoviesByTitleList(titles) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
  
    titles.forEach(title => {
      const url = `https://www.omdbapi.com/?t=${encodeURIComponent(title)}&apikey=${apiKey}`;
  
      fetch(url)
        .then(res => res.json())
        .then(movie => {
          if (movie.Response === "True") {
            const card = document.createElement("div");
            card.classList.add("movie-box");
  
            const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200x300?text=No+Image";
  
            card.innerHTML = `
              <img src="${poster}" alt="${movie.Title}" />
              <div class="movie-info">
                <h3>${movie.Title}</h3>
                <p>Year: ${movie.Year}</p>
              </div>
            `;
  
            resultsDiv.appendChild(card);
          }
        });
    });
  }

  function showSkeletonLoaders(count = 6) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";
  
    for (let i = 0; i < count; i++) {
      const skeleton = document.createElement("div");
      skeleton.className = "movie-box skeleton";
      skeleton.innerHTML = `
        <div class="skeleton-img"></div>
        <div class="movie-info">
          <div class="skeleton-title"></div>
          <div class="skeleton-year"></div>
        </div>
      `;
      resultsDiv.appendChild(skeleton);
    }
  }
  

  document.addEventListener("DOMContentLoaded", () => {
    const randomSix = getRandomTitles(6);
    displayMoviesByTitleList(randomSix);
  });

document.getElementById("searchBtn").addEventListener("click", searchMovies);
document.getElementById("searchInput").addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
      searchMovies(); 
    }
  });

function searchMovies() {
   
 const query = document.getElementById("searchInput").value.trim();
 const sortOrder = document.getElementById("sortSelect").value;

  if (!query) return;
  showSkeletonLoaders();
  const url = `https://www.omdbapi.com/?s=${encodeURIComponent(query)}&apikey=${apiKey}`;

 
  setTimeout(() => {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const resultsDiv = document.getElementById("results");
      resultsDiv.innerHTML = ""; 

      if (data.Response === "True") {
       let movies = data.Search.slice(0, 6);

        movies.sort((a, b) => {
            const yearA = parseInt(a.Year);
            const yearB = parseInt(b.Year);
  
            if (sortOrder === "newest") {
              return yearB - yearA;
            } else {
              return yearA - yearB;
            }
          });

        movies.forEach(movie => {
          const card = document.createElement("div");
          card.classList.add("movie-box");

          const poster = movie.Poster !== "N/A" ? movie.Poster : "https://via.placeholder.com/200x300?text=No+Image";

          card.innerHTML = `
            <img src="${poster}" alt="${movie.Title}" />
            <div class="movie-info">
              <h3>${movie.Title}</h3>
              <p>Year: ${movie.Year}</p>
            </div>
          `;

          resultsDiv.appendChild(card);
        });
      } else {
        resultsDiv.innerHTML = `<p>No results found for "${query}".</p>`;
      }
    })
    .catch(error => {
      console.error("Error fetching movie data:", error);
    });
}, 10)}