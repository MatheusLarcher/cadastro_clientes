const Axios = require('axios');

var clienteId = 2

Axios.delete(`http://localhost:3001/cliente/${clienteId}`);

console.log(1)