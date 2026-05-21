# Rubi Keys API

API RESTful para gerenciamento de usuários com autenticação, desenvolvida com Node.js, Express, SQLite e bcrypt.

## 🚀 Tecnologias

- **Node.js** (v18+)
- **Express** - Framework web
- **SQLite3** - Banco de dados leve
- **bcrypt** - Hash de senhas
- **Jest** - Testes automatizados
- **Supertest** - Testes de API
- **@faker-js/faker** - Geração de dados fictícios

## 📋 Pré-requisitos

- Node.js 18 ou superior
- npm 9 ou superior

## 🔧 Instalação

```bash
# Clone o repositório
git clone https://github.com/LeoAChaves/UsersAPI_RubiKeys.git
cd UsersAPI_RubiKeys

# Instale as dependências
npm install

# Configure o banco de dados com dados de exemplo
npm run setup-db
```

## 🚀 Executando o projeto

### Modo desenvolvimento (com auto-reload)

```bash
npm run dev
```

### Modo produção

```bash
npm start
```

O servidor iniciará em `http://localhost:3030`

## 🧪 Testes

### Executar todos os testes

```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js
```

### Executar testes em modo watch (auto-reload)

```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js --watch
```

### Executar testes com cobertura

```bash
node --experimental-vm-modules node_modules/jest/bin/jest.js --coverage
```

## 📚 Endpoints da API

### Base URL

```
http://localhost:3030
```

### Rotas Públicas

| Método | Endpoint  | Descrição                 |
| ------ | --------- | ------------------------- |
| GET    | `/`       | Página inicial da API     |
| GET    | `/health` | Health check da aplicação |

### Rotas de Usuários

| Método | Endpoint                           | Descrição                          |
| ------ | ---------------------------------- | ---------------------------------- |
| GET    | `/users`                           | Lista todos os emails dos usuários |
| GET    | `/users/names`                     | Lista todos os nomes dos usuários  |
| GET    | `/users/:email`                    | Busca usuário por email            |
| GET    | `/users/paginated?page=1&limit=20` | Lista usuários com paginação       |
| POST   | `/users`                           | Cria um novo usuário               |
| PUT    | `/users/name/:email`               | Atualiza o nome do usuário         |
| PUT    | `/users/password/:email`           | Atualiza a senha do usuário        |
| DELETE | `/users/:email`                    | Remove um usuário                  |

## 📦 Exemplos de Requisições

### Criar usuário

```bash
POST /users
Content-Type: application/json

{
  "email": "usuario@exemplo.com",
  "name": "Nome do Usuário",
  "password": "Senha@123"
}
```

**Resposta (201 Created):**

```json
{
  "success": true,
  "data": {
    "message": "User Nome do Usuário (usuario@exemplo.com) created successfully",
    "id": 1,
    "error": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Listar todos usuários

```bash
GET /users
```

**Resposta (200 OK):**

```json
{
  "success": true,
  "data": {
    "emails": ["usuario1@exemplo.com", "usuario2@exemplo.com"],
    "count": 2,
    "error": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Atualizar nome

```bash
PUT /users/name/usuario@exemplo.com
Content-Type: application/json

{
  "newName": "Novo Nome Atualizado"
}
```

**Resposta (200 OK):**

```json
{
  "success": true,
  "data": {
    "message": "User usuario@exemplo.com's name updated to Novo Nome Atualizado",
    "changes": 1,
    "error": false
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Atualizar senha

```bash
PUT /users/password/usuario@exemplo.com
Content-Type: application/json

{
  "newPassword": "NovaSenha@456"
}
```

### Deletar usuário

```bash
DELETE /users/usuario@exemplo.com
```

## 🔒 Validações

### Senha

- Mínimo de 8 caracteres
- Pelo menos 1 letra
- Pelo menos 1 número
- Pelo menos 1 caractere especial (@$!%\*#?&)

### Email

- Formato válido (usuario@dominio.com)
- Convertido automaticamente para minúsculas

### Nome

- Mínimo de 2 caracteres
- Máximo de 100 caracteres
- Não pode estar vazio

## 📁 Estrutura do Projeto

```
UsersAPI_RubiKeys/
├── controllers/
│   ├── indexController.js      # Rotas públicas
│   └── usersController.js      # Rotas de usuários
├── DAO/
│   └── usersDAO.js             # Operações do banco de dados
├── database/
│   ├── sqlite-db.js            # Conexão com SQLite
│   ├── create-and-populate.js  # Setup e população do banco
│   └── database.db             # Arquivo do banco (gerado)
├── models/
│   └── usersModel.js           # Modelo e validações de usuário
├── tests/
│   └── users.test.js           # Testes automatizados
├── app.js                      # Configuração do Express
├── server.js                   # Entry point da aplicação
├── package.json                # Dependências e scripts
└── README.md                   # Documentação
```

## 🛠️ Scripts Disponíveis

| Script                  | Descrição                                           |
| ----------------------- | --------------------------------------------------- |
| `npm start`             | Inicia o servidor em produção                       |
| `npm run dev`           | Inicia o servidor com auto-reload (nodemon)         |
| `npm run setup-db`      | Cria e popula o banco de dados com dados de exemplo |
| `npm test`              | Executa os testes automatizados                     |
| `npm run test:watch`    | Executa testes em modo watch                        |
| `npm run test:coverage` | Executa testes com relatório de cobertura           |

## 📊 Status Codes

| Código | Descrição                                   |
| ------ | ------------------------------------------- |
| 200    | Sucesso (GET, PUT, DELETE)                  |
| 201    | Criado com sucesso (POST)                   |
| 400    | Erro de validação (dados inválidos)         |
| 404    | Recurso não encontrado                      |
| 409    | Conflito (usuário já existe)                |
| 422    | Entidade não processável (formato inválido) |
| 500    | Erro interno do servidor                    |

## 🔐 Segurança

- Senhas hasheadas com bcrypt (10 rounds)
- Validação de entrada em todas as rotas
- Proteção contra emails duplicados
- Sanitização de dados
- CORS habilitado

## 🧪 Testando no PowerShell

```powershell
# Teste rápido completo
$email = "teste@exemplo.com"
$body = @{email=$email; name="Teste"; password="Senha@123"} | ConvertTo-Json
Invoke-WebRequest -Uri "http://localhost:3030/users" -Method POST -Body $body -ContentType "application/json"
Invoke-WebRequest -Uri "http://localhost:3030/users" -Method GET
Invoke-WebRequest -Uri "http://localhost:3030/users/$email" -Method DELETE
```

## 📝 Licença

MIT

## 👨‍💻 Autor

Desenvolvido como parte do projeto Rubi Keys API

---

**Status do Projeto:** ✅ Concluído e testado

```
