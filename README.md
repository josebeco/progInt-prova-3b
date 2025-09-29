# progInt-prova-3b

## Analise

Análise de Projeto: API CRUD com JWT e JSON
Este documento contém uma análise detalhada da API REST desenvolvida, comparando a implementação com os requisitos propostos e com as boas práticas de mercado para desenvolvimento com Node.js e Express.

Visão Geral do Projeto
O objetivo foi desenvolver uma API Back-End com Node.js e Express para um CRUD de usuários. A persistência de dados foi implementada em um arquivo JSON, e a segurança das rotas foi garantida por autenticação baseada em tokens JWT.

Avaliação Geral
O projeto foi implementado com sucesso e atende aos requisitos funcionais principais. A estrutura do código é limpa, organizada e segue o padrão de separação de responsabilidades (rotas, controladores, middleware), o que é excelente.

A lógica de segurança para senhas com bcrypt está correta, e a implementação de autorização (permitindo que um usuário altere apenas seus próprios dados) é um destaque que vai além do solicitado.

A análise aponta algumas vulnerabilidades de segurança e desvios de padrões de mercado que são críticos para corrigir. Com os ajustes sugeridos, a API se tornará não apenas funcional, mas também segura e profissional.

✅ Pontos Fortes e Boas Práticas
Estrutura de Projeto Sólida: A separação dos arquivos em pastas (controllers, routes, middleware, utils) é clara, escalável e de fácil manutenção.

Segurança de Senhas: O uso correto do bcryptjs para gerar o hash na criação do usuário e para comparar o hash durante o login é o padrão de mercado e foi implementado perfeitamente.

Lógica de Autorização Avançada: A verificação nas rotas PUT e DELETE para garantir que o usuário autenticado só possa modificar seus próprios dados é um grande diferencial de segurança.

Abstração da Lógica de Dados: O arquivo utils/db.js abstrai com eficiência a manipulação do sistema de arquivos, tornando os controladores mais limpos.

Código Limpo e Legível: O código em geral é bem escrito, utilizando corretamente as funcionalidades do Express, como o express.Router().

⚠️ Ações Críticas e Correções Recomendadas
Estes são os pontos que devem ser tratados com prioridade máxima para garantir a segurança e a qualidade da API.

1. Vazamento de Hash de Senha (Prioridade Alta)
Problema: As rotas GET /users e GET /users/:id retornam todos os dados do usuário, incluindo o campo senha, que contém o hash criptográfico. Isso é uma falha de segurança grave.

Local: controllers/usersController.js

Correção: Remova o campo senha de qualquer resposta enviada ao cliente.

```JavaScript

// Exemplo de correção para getUsers
export const getUsers = (req, res) => {
  const data = readData();
  // Mapeia o array, removendo a senha de cada objeto de usuário
  const usersWithoutPassword = data.map(({ senha, ...user }) => user);
  res.json(usersWithoutPassword);
};

// Exemplo de correção para getUserById
export const getUserById = (req, res) => {
  // ...lógica para encontrar o user...
  if (user) {
    const { senha, ...userWithoutPassword } = user; // Desestrutura para remover a senha
    res.json(userWithoutPassword);
  } 
  // ...resto do código...
};
```
2. Segredo do JWT Fixo no Código (Prioridade Alta)
Problema: O segredo do JWT (JWT_SECRET) possui um valor padrão ("bomdia") visível no código. Isso permite que qualquer pessoa com acesso ao código-fonte possa criar tokens de autenticação válidos.

Local: middleware/auth.js

Correção: O segredo deve ser carregado exclusivamente a partir de variáveis de ambiente. Utilize a biblioteca dotenv para desenvolvimento local.

```Bash
# 1. Instale o dotenv
npm install dotenv
```

```JavaScript
// 2. Crie um arquivo .env na raiz do projeto
JWT_SECRET=seu_segredo_super_longo_e_aleatorio_aqui_987654321
```

```JavaScript
// 3. Carregue as variáveis no início do server.js
import 'dotenv/config';
import express from "express";
// ...
```

```JavaScript
// 4. Remova o valor padrão em middleware/auth.js
const JWT_SECRET = process.env.JWT_SECRET;
3. Padrão de Autenticação (Header Authorization)
Problema: A API espera o token no cabeçalho não padrão auth. O padrão universal é Authorization: Bearer <token>. Seguir o padrão garante compatibilidade com clientes HTTP e ferramentas de teste.

Local: middleware/auth.js

Correção: Ajuste o middleware para ler o cabeçalho Authorization e extrair o token.
```

```JavaScript
// Correção em authenticateToken
export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']; // Usar o header 'authorization'
  const token = authHeader && authHeader.split(' ')[1]; // Extrair o token do "Bearer <token>"

  if (!token) return res.status(401).json({ message: 'Token não fornecido' });

  // ...resto da lógica de verificação...
};
```
4. Geração de ID e Lógica de Login
Problema:

Os IDs de usuário são gerados de forma incremental, o que é frágil. O proposto sugeria uuid.

O login é feito por nome, que não é um campo único, podendo causar bugs. O padrão é usar email.

Local: controllers/authController.js

Correção:

Use a biblioteca uuid para gerar IDs no registro.

Altere a lógica de login para buscar o usuário pelo email.

```Bash

# Instale a biblioteca uuid
npm install uuid
```
```JavaScript

// Correção em authController.js
import { v4 as uuidv4 } from 'uuid';

export const register = (req, res) => {
  // ...
  // Adicionar verificação de email existente
  const userExists = data.some(user => user.email === email);
  if (userExists) {
      return res.status(409).json({ message: 'Este email já está em uso.' });
  }

  const newUser = {
    id: uuidv4(), // Usar uuid para gerar o ID
    // ...
  };
  // ...
};

export const login = (req, res) => {
    const { email, senha } = req.body; // Mudar de 'nome' para 'email'
    const data = readData();
    const user = data.find(u => u.email === email); // Buscar pelo email
    // ...
};
```
💡 Sugestões para Evolução e Melhorias
Validação de Dados de Entrada: Implemente uma camada de validação para as requisições (POST /register, PUT /users) para garantir que campos obrigatórios não estão vazios e que o email tem um formato válido. Bibliotecas como joi ou express-validator são excelentes para isso.

Tratamento de Erros Centralizado: Crie um middleware de erro no final do server.js para capturar todos os erros da aplicação de forma centralizada, evitando blocos try...catch repetitivos nos controladores.

Robustez do utils/db.js: Adicione um bloco try...catch na função readData para tratar casos em que o db.json esteja corrompido ou vazio, prevenindo que a aplicação quebre.

Conclusão Final
Este é um projeto muito sólido e um excelente ponto de partida. A base de código está bem organizada e as funcionalidades principais foram implementadas corretamente. Ao aplicar as correções de segurança e alinhar o código com os padrões de mercado sugeridos, esta API se tornará um exemplo robusto e de alta qualidade. Parabéns pelo excelente trabalho!















