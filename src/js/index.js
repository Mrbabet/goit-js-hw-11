import Notiflix from 'notiflix';
import ApiService from './api';

const refs = {
  form: document.querySelector('#search-form'),
  gallery: document.querySelector('div.gallery'),
  loadMoreBtn: document.querySelector('button.load-more'),
};
refs.loadMoreBtn.style.display = 'none';
const apiImages = new ApiService();

const onSubmit = function (e) {
  console.log(apiImages);
  e.preventDefault();

  apiImages.query = e.currentTarget.elements.searchQuery.value;
  apiImages.resetPage();

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
  console.log(apiImages);
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
    <img src="${item.webformatURL}" alt="${item.tags}" loading="lazy" />
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
