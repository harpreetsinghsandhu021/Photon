const auth = "563492ad6f917000010000019de2bef887934a00a8ffb077fe87f3fb";
const gallery = document.querySelector(".gallery");
const form = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");
const btnMore = document.querySelector(".more");

let searchValue;
let page = 1;
let fetchLink;
let currentSearch;
let id;

searchInput.addEventListener("input", (e) => {
  searchValue = e.target.value;
  console.log(searchValue);
});

btnMore.addEventListener("click", loadMore);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  currentSearch = searchValue;

  searchPhotos(searchValue);
});

async function fetchApi(url) {
  const fetchData = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  const data = await fetchData.json();
  return data;
}

const generatePictures = (data) => {
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
        <img src="${photo.src.large}"></img>`;
    gallery.appendChild(galleryImg);
  });
};

const generateVideos = (data) => {
  data.videos.forEach((video) => {
    const galleryImg = document.createElement("div");
    galleryImg.classList.add("gallery-img");

    galleryImg.innerHTML = `
     <a href=${video.url} class='video-link'>
     <svg class='download-svg'>
     <use xlink:href='icomoon/sprite.svg#icon-play2'/>
   </svg>
    </a>
        <img src=${video.video_pictures[1].picture}></img>
        `;
    gallery.appendChild(galleryImg);
  });
};
async function curatedPhotos() {
  const fetchLink = "https://api.pexels.com/v1/curated?per_page=15&page=1";

  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

async function searchPhotos(query) {
  clear();
  page = 1;
  fetchLink = `https://api.pexels.com/v1/search?query=${query}+query&per_page=15&page=1`;

  const data = await fetchApi(fetchLink);
  generatePictures(data);
}

async function loadMore() {
  page++;
  if (currentSearch) {
    fetchLink = `https://api.pexels.com/v1/search?query=${currentSearch}+query&per_page=15&page=${page}`;
  } else {
    fetchLink = `https://api.pexels.com/v1/curated?per_page=15&page=${page}`;
  }
  const data = await fetchApi(fetchLink);
  generatePictures(data);
}
function clear() {
  gallery.innerHTML = "";
  searchInput.value = "";
}
function clearGallery() {
  gallery.innerHTML = "";
}

curatedPhotos();
