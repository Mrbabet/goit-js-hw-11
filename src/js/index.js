import Notiflix from 'notiflix';
import ApiService from './api';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('.gallery'),
  loadMoreBtn: document.querySelector('.load-more'),
  sort: document.querySelector('.sort-btn'),
};
refs.loadMoreBtn.style.display = 'none';
const apiImages = new ApiService();

const onSubmit = function (e) {
  apiImages.resetPage();
  e.preventDefault();
  lightbox.refresh();

  apiImages.query = e.currentTarget.elements.searchQuery.value;

  if (apiImages.query === '') {
    Notiflix.Notify.info('Please enter your search query!');
    return;
  }
  refs.gallery.innerHTML = '';

  apiImages.getData().then(data => {
    const searchQuerries = data.hits;

    renderCard(searchQuerries);

    if (searchQuerries.length === 0) {
      refs.loadMoreBtn.style.display = 'none';
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }
    if (searchQuerries.length < 40) {
      refs.loadMoreBtn.style.display = 'none';
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
      return Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    } else {
      refs.loadMoreBtn.style.display = 'block';
      return Notiflix.Notify.success(
        `Hooray! We found ${data.totalHits} images.`
      );
    }
  });
};
const onLoadMore = function () {
  apiImages.getData().then(data => {
    const searchQuerries = data.hits;
    renderCard(searchQuerries);
    if (searchQuerries.length < 40) {
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
    }
  });
};

const renderCard = function (dataArr) {
  const searchQuerries = dataArr
    .map(item => {
      return `<div class="photo-card">
      <a href= "${item.largeImageURL}"><img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>${item.likes}Likes</b>
      </p>
      <p class="info-item">
        <b>${item.views}Views</b>
      </p>
      <p class="info-item">
        <b>${item.comments}Comments</b>
      </p>
      <p class="info-item">
        <b>${item.downloads}Downloads</b>
      </p>
    </div>
  </div>`;
    })
    .join('');
  refs.gallery.insertAdjacentHTML('beforeend', searchQuerries);
};

refs.form.addEventListener('submit', onSubmit);
refs.loadMoreBtn.addEventListener('click', onLoadMore);
