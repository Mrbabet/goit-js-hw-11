import axios from 'axios';

const URL = 'https://pixabay.com/api/';
const API_KEY = '40190153-1f7ba2f721d69c0d589a95a2c';

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.currentPage = 1;
  }
  async getData() {
    try {
      const response = await axios.get(URL, {
        params: {
          key: API_KEY,
          q: this.searchQuery,
          image_type: 'photo',
          orientation: 'horizontal',
          safeseatch: true,
          page: this.currentPage,
          per_page: 40,
          endOfResults: false,
        },
      });
      this.currentPage += 1;
      return response.data;
    } catch (error) {
      console.log(error.message);
    }
  }
  resetPage() {
    this.currentPage = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    return (this.searchQuery = newQuery);
  }
}
