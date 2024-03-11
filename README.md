 # Sistema de Gerenciamento de Clientes

Arquivo de demostração é "Apresentação.mp4"

## 🛠 Ferramentas e Versões Utilizadas

- **Node.js**: `v18.18.2`
- **React**: `v18.2.0`
- **Express**: `v4.18.3`
- **Axios**: `v1.6.7`
- **Material-UI (MUI)**: `v5.15.12`
- **Cors**: `v2.8.5`
- **Express-Validator**: `v7.0.1`
- **pg (PostgreSQL client for Node.js)**: `v8.11.3`
- **PostgreSQL**: `16.2`

### Pré-Requisitos

- Node.js instalado.
- PostgreSQL 16 instalado.
- Um banco de dados em branco criado no PostgreSQL para receber a restauração do dump.

### Instalação e Execução

##### #Clone o repositório:
```bash
git clone https://github.com/Rafael-720/Sistema-de-Gerenciamento-de-Clientes.git
```

#### ---- Banco de Dados

### Restaurando o Dump do Banco de Dados

1_ Criar Banco de Dados em Branco**: Se ainda não criou, abra o psql e crie um banco de dados em branco com o comando:
   ```sql
   CREATE DATABASE postgres;
   ```

2_ Navegue até a pasta do Backup_Banco
```bash
cd Backup_Banco
```

3_ Edite o arquivo restaurar_dump.bat com bloco de notas e confira se as configurações de porta -p, host -h, usuario -U e nome do banco -d estao corretas



4_ Executar o Arquivo Restaurar_banco_postgres.bat.bat, dai é só colocar a senha do banco em branco que foi c riado.



#### ---- Banco de Dados

##### #Navegue até a pasta app

##### #Instale as dependências
```bash
npm install
```

##### #Inicie o servidor Express:
```bash
npm start
```

