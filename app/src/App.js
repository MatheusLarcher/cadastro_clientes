import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {ListaClientes, Cadastro, EditarCliente } from './pages/ClientesTable';

function App() {
 return (
  
    <Router>
      <Routes>
      <Route path="/clientes" element={<ListaClientes />} />
      <Route path="/cliente/cadastro" element={<Cadastro />} />
      <Route path="/cliente/:clienteId" element={<EditarCliente />} />
      </Routes>
    </Router>
 );
}

export default App;