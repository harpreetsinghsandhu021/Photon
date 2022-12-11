const auth = "563492ad6f917000010000019de2bef887934a00a8ffb077fe87f3fb";
const gallery = document.querySelector(".gallery");
const searchInput = document.querySelector(".search-input");
const form = document.querySelector(".search-form");
const more = document.querySelector(".more");
let searchValue;
let page = 1;
let fetchLink;
let currentSearch;
let id;

// Event Listeners
searchInput.addEventListener("input", updateInput);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;
  searchPhotos(searchValue);
});

more.addEventListener("click", loadMore);

// Functions
function updateInput(e) {
  searchValue = e.target.value;
}

async function fetchApi(url) {
  const dataFetch = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  const data = await dataFetch.json();

  console.log(data);
  return data;
}

function generatePicture(data) {
  data.photos.forEach((photo) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");
    galleryImg.innerHTML = `
        <div class="gallery-info">
          <a target='_blank' href=${photo.photographer_url}><p>${photo.photographer}</p></a>
            <a href=${photo.src.original}>
            <svg class='download-svg'>
            <use xlink:href='icomoon/sprite.svg#icon-arrow-down2'/>
            </svg>
            </a>
        </div>
        <img src="${photo.src.large}"></img>
        `;
    gallery.appendChild(galleryImg);
  });
}

async function curatedPhotos() {
  fetchLink = "https://api.pexels.com/v1/curated?per_page=30&page=1";
  const data = await fetchApi(fetchLink);

  generatePicture(data);
}

async function getPhoto(id) {
  fetchLink = `https://api.pexels.com/v1/photos/${id}`;

  const data = await fetchApi(fetchLink);
  console.log(data);
}

async function searchPhotos(query) {
  clear();
  fetchLink = `https://api.pexels.com/v1/search?query=${query}+query&per_page=15&page=1`;
  const data = await fetchApi(fetchLink);

  generatePicture(data);
}

function clear() {
  gallery.innerHTML = "";
  searchInput.value = "";
  page = 1;
}

async function loadMore() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
  }
  const data = await fetchApi(fetchLink);
  generatePicture(data);
}

curatedPhotos();
