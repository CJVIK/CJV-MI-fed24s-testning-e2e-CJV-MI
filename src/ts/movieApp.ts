import { movieSort } from "./functions";
import { IMovie } from "./models/Movie";
import { getData } from "./services/movieService";

let movies: IMovie[] = [];
let sortDesc: boolean = false;

export const init = () => {
  let form = document.getElementById("searchForm") as HTMLFormElement;
  form.addEventListener("submit", (e: SubmitEvent) => {
    e.preventDefault();
    handleSubmit();
  });
  const sortButton = document.getElementById("sort-button") as HTMLButtonElement;
  sortButton.addEventListener("click", toggleSort);
};

export const toggleSort = () => {
  sortDesc = !sortDesc;

  const sortButton = document.getElementById("sort-button") as HTMLButtonElement;
  sortButton.textContent = sortDesc ? "Sortera A-Ö" : "Sortera Ö-A";


  const sortedMovies = movieSort(movies, sortDesc);

  const container = document.getElementById("movie-container") as HTMLDivElement;
  container.innerHTML = "";
  createHtml(sortedMovies, container);
};

export async function handleSubmit() {
  let searchText = (document.getElementById("searchText") as HTMLInputElement)
    .value;

  let container: HTMLDivElement = document.getElementById(
    "movie-container"
  ) as HTMLDivElement;
  container.innerHTML = "";

  const sortButton = document.getElementById("sort-button") as HTMLButtonElement;

  try {
    movies = await getData(searchText);

    if (movies.length > 0) {
      sortDesc = false;

      movies = movieSort(movies, sortDesc);
      sortButton.textContent = "Sortera Ö-A";
      sortButton.style.display = "block";
      createHtml(movies, container);
    } else {
      sortButton.style.display = "none";
      displayNoResult(container);
    }
  } catch {
    sortButton.style.display = "none";
    displayNoResult(container);
  }
}


export const createHtml = (movies: IMovie[], container: HTMLDivElement) => {
  for (let i = 0; i < movies.length; i++) {
    let movie = document.createElement("div");
    let title = document.createElement("h3");
    let img = document.createElement("img");

    movie.classList.add("movie");
    title.innerHTML = movies[i].Title;
    img.src = movies[i].Poster;
    img.alt = movies[i].Title;

    movie.appendChild(title);
    movie.appendChild(img);

    container.appendChild(movie);
  }
};

export const displayNoResult = (container: HTMLDivElement) => {
  let noMessage = document.createElement("p");

  noMessage.innerHTML = "Inga sökresultat att visa";

  container.appendChild(noMessage);
};
