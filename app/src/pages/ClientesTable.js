import Axios from 'axios';
const React = require('react');
const useState = React.useState;
const useEffect = React.useEffect;
const useCallback = React.useCallback;
const { useNavigate, useParams } = require('react-router-dom');

//lista de clientes com todos a tabela do postgres
function ListaClientes() {
  const [clientes, setClientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const navigate = useNavigate();

  const fetchClientes = useCallback(async () => {
    try {
      const url = busca ? `http://localhost:3001/clientes?nome=${encodeURIComponent(busca)}` : 'http://localhost:3001/clientes';

      const response = await Axios.get(url);
      setClientes(response.data);

    } catch (error) {
      console.error('Erro ao buscar os clientes:', error);
    }
  }, [busca]);

  useEffect(() => {
    fetchClientes();
  }, [fetchClientes]);

  const handleBuscaSubmit = (e) => {
    e.preventDefault();
    fetchClientes();
  };

  const handleAddClienteClick = () => {
    navigate('/cliente/cadastro');
  };
  const handleLinhaClique = (cliente) => {
    setClienteSelecionado(cliente);
  };

  const handleClienteExcluido = () => {
    fetchClientes();
  };

  const handleEditarClick = (clienteId) => {
    navigate(`/cliente/${clienteId}`);
  };

  return (
    <div>
      <form onSubmit={handleBuscaSubmit}>
        <input
          type="text"
          placeholder="Buscar por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>
      <button onClick={handleAddClienteClick}>Adicionar novo Cliente</button>
      <ModalClientes />
      {clienteSelecionado && (
        <div>
          <button onClick={() => handleEditarClick(clienteSelecionado.id)}>Editar {clienteSelecionado.nome} </button>
          <button onClick={() => ExcluirCliente(clienteSelecionado.id, handleClienteExcluido)}>Excluir {clienteSelecionado.nome}</button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Email</th>
            <th>Telefone</th>
            <th>Coordenadas</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr
              key={cliente.id}
              onClick={() => handleLinhaClique(cliente)}
              style={clienteSelecionado && clienteSelecionado.id === cliente.id ? { backgroundColor: 'lightgray' } : {}}
            >
              <td>{cliente.id}</td>
              <td>{cliente.nome}</td>
              <td>{cliente.email}</td>
              <td>{cliente.telefone}</td>
              <td>{cliente.coordenadas}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

//tela de cadastrar novos clientes
function Cadastro() {
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({ nome: '', email: '', telefone: '' });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cliente.nome.trim()) {
      alert('O campo nome é obrigatório.');
      return;
    }
    try {
      await Axios.post(`http://localhost:3001/cliente/novo`, cliente);
      navigate('/clientes');
    } catch (error) {
      console.error('Erro ao atualizar o cliente:', error);
    }
  };

  return (
    <div>
      <h2>Novo Cliente</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input type="text" name="nome" onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Telefone:
          <input type="tel" name="telefone" onChange={handleInputChange} />
        </label>
        <label>
          Coordenadas:
          <input type="coordenadas" name="coordenadas" onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit">Criar cadastro</button>
      </form>
    </div>
  );
}

async function ExcluirCliente(clienteId, onExcluido) {
  const isConfirmed = window.confirm('Tem certeza de que deseja excluir este cliente?');

  if (!isConfirmed) {
    return;
  }

  try {
    const response = await Axios.delete(`http://localhost:3001/cliente/${clienteId}`);
    console.log('Cliente excluído com sucesso:', response.data);
    onExcluido();
  } catch (error) {
    console.error('Erro ao excluir o cliente:', error);
  }
}

//tela de edção dos clientes
function EditarCliente() {
  const { clienteId } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState({ nome: '', email: '', telefone: '', coordenadas: '' });

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await Axios.get(`http://localhost:3001/cliente/${clienteId}`);
        setCliente(response.data);
      } catch (error) {
        console.error('Erro ao buscar o cliente:', error);
      }
    };

    fetchCliente();
  }, [clienteId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCliente({ ...cliente, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Axios.put(`http://localhost:3001/cliente/${clienteId}`, cliente);
      navigate('/clientes');
    } catch (error) {
      console.error('Erro ao atualizar o cliente:', error);
    }
  };

  return (
    <div>
      <h2>Editar Cliente</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Nome:
          <input type="text" name="nome" value={cliente.nome} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Email:
          <input type="email" name="email" value={cliente.email} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Telefone:
          <input type="tel" name="telefone" value={cliente.telefone} onChange={handleInputChange} />
        </label>
        <label>
          Coordenadas:
          <input type="coordenadas" name="coordenadas" value={cliente.coordenadas} onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit">Salvar Alterações</button>
      </form>
    </div>
  );
}

//botao q abre o Modal de clientes
function ModalClientes() {
  const [ordemClientes, setOrdemClientes] = useState([]);
  const [modalAberta, setModalAberta] = useState(false);

  const abrirModal = async () => {
    try {
      const resposta = await Axios.get('http://localhost:3001/calcular');
      const ordem = resposta.data;
      setOrdemClientes(ordem);
      setModalAberta(true);
    } catch (error) {
      console.error("Erro ao buscar os dados dos clientes:", error);
    }
  };

  const fecharModal = () => {
    setModalAberta(false);
  };

  return (
    <div>
      <button onClick={abrirModal}>Exibir menor rota por cliente</button>
      {modalAberta && (
        <div style={{ position: 'fixed', top: '20%', left: '25%', right: '25%', backgroundColor: 'white', padding: '20px', zIndex: 1000, overflow: 'auto' }}>
          <h2>Clientes ornenados pela menor rota </h2>
          <ul>
            {ordemClientes.map(cliente => (
              <li key={cliente.id}>
                <strong>Nome:</strong> {cliente.nome}<br />
                <strong>Coordenadas:</strong> {cliente.coordenadas ? `(${cliente.coordenadas.join(', ')})` : 'N/A'}
              </li>
            ))}
          </ul>
          <button onClick={fecharModal}>Fechar</button>
        </div>
      )}
    </div>
  );
}


export { ListaClientes, Cadastro, EditarCliente };
