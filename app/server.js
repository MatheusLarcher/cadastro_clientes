const express = require('express');
const { Client } = require('pg');
const app = express();
const cors = require('cors');
app.use(cors());
const { vizinhoMaisProximo } = require('./calcularCoordenadas');

app.use(express.json());

const conexaoPostgres = {
  host: 'localhost',
  user: 'postgres',
  password: '1234',
  database: 'postgres',
  port: 5432
};

//obtem todos os clientes e retorna uma lista dos nomes e ordenados pela rota
app.get('/calcular', async (req, res) => {
  try {
    const client = new Client(conexaoPostgres);
    await client.connect();
    const query = "SELECT * FROM clientes";
    const result = await client.query(query);

    const clientes = result.rows.map(cliente => ({
      nome: cliente.nome,
      coordenadas: [cliente.coordenadas[0], cliente.coordenadas[1]]
    }));

    const inicio = 0;
    let caminhoNomes = vizinhoMaisProximo(clientes, inicio);

    res.json(caminhoNomes);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//Criar um novo cadastro de cliente
app.post('/cliente/novo', async (req, res) => {
  const { nome, email, telefone, coordenadas } = req.body;
  const client = new Client(conexaoPostgres);

  try {
    await client.connect();
    const query = 'INSERT INTO clientes (nome, email, telefone, coordenadas) VALUES ($1, $2, $3, $4) RETURNING *';

    var coordenadas_formatada = [];
    if (Array.isArray(coordenadas)) {
      coordenadas_formatada = coordenadas;
    } else {
      coordenadas_formatada = "{" + coordenadas.replace(/\{/g, "").replace(/\}/g, "").replace(/\[/g, "").replace(/\]/g, "") + "}";
    }

    const values = [nome, email, telefone, coordenadas_formatada];
    const result = await client.query(query, values);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erro ao cadastrar o cliente:', error);
    res.status(500).send('Erro ao cadastrar o cliente.');
  } finally {
    await client.end();
  }
});

//edita o cadastro existente
app.put('/cliente/:clienteId', async (req, res) => {
  const { clienteId } = req.params;
  const { nome, email, telefone, coordenadas } = req.body;

  try {
    const client = new Client(conexaoPostgres);
    await client.connect();
    const query = 'UPDATE clientes SET nome = $1, email = $2, telefone = $3, coordenadas = $4 WHERE id = $5 RETURNING *';
    
    var coordenadas_formatada = [];
    if (Array.isArray(coordenadas)) {
      coordenadas_formatada = coordenadas;
    } else {
      coordenadas_formatada = "{" + coordenadas.replace(/\{/g, "").replace(/\}/g, "").replace(/\[/g, "").replace(/\]/g, "") + "}";
    }
    const values = [nome, email, telefone, coordenadas_formatada, clienteId];
    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Cliente não encontrado.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao editar o cliente.');
  }
});

//Buscar cliente pelo ID
app.get('/cliente/:clienteId', async (req, res) => {
  const { clienteId } = req.params;

  try {
    const client = new Client(conexaoPostgres);
    await client.connect();

    const query = 'SELECT * FROM clientes WHERE id = $1';
    const values = [clienteId];

    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).send('Cliente não encontrado.');
    }

    await client.end();
  } catch (err) {
    console.error('Erro ao buscar o cliente:', err);
    res.status(500).send('Erro interno do servidor');
  }
});

//Busca todos os clientes filtrando pelo nome
app.get('/clientes', async (req, res) => {
  try {
    const client = new Client(conexaoPostgres);
    await client.connect();
    let busca = req.query.nome;
    const regexPattern = busca ? busca.toUpperCase() : '';
    const query = "SELECT * FROM clientes WHERE nome ~* $1 ";
    const result = await client.query(query, [regexPattern]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

//deleta o cliente do postgres
app.delete('/cliente/:clienteId', async (req, res) => {
  const { clienteId } = req.params;

  try {
    const client = new Client(conexaoPostgres);
    await client.connect();
    const query = 'DELETE FROM clientes WHERE id = $1 RETURNING *';
    const values = [clienteId];
    const result = await client.query(query, values);

    if (result.rows.length > 0) {
      res.send('Cliente excluído com sucesso.');
    } else {
      res.status(404).send('Cliente não encontrado.');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao excluir o cliente.');
  }
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

