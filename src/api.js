import axios from 'axios';

// Kita bikin settingan default biar nggak usah ngetik localhost:5000 terus-terusan
const api = axios.create({
  baseURL: 'http://127.0.0.1:5000/api', 
});

export default api;