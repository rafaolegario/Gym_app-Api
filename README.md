# Gym-App-Api

## Descrição
Este é um aplicativo inspirado no GymPass, permitindo que usuários se cadastrem, busquem academias, realizem check-ins e acompanhem seu histórico de atividades. O sistema também inclui funcionalidades administrativas para validação de check-ins e cadastro de academias.

## Requisitos Funcionais (RFs)
- Deve ser possível se cadastrar;
- Deve ser possível se autenticar;
- Deve ser possível obter o perfil de um usuário logado;
- Deve ser possível obter o número de check-ins realizados pelo usuário logado;
- Deve ser possível o usuário obter o seu histórico de check-ins;
- Deve ser possível o usuário buscar academias próximas;
- Deve ser possível o usuário buscar academias pelo nome;
- Deve ser possível o usuário realizar check-in em uma academia;
- Deve ser possível validar o check-in de um usuário;
- Deve ser possível cadastrar uma academia.

## Regras de Negócio (RNs)
- O usuário não deve poder se cadastrar com um e-mail duplicado;
- O usuário não pode fazer 2 check-ins no mesmo dia;
- O usuário não pode fazer check-in se não estiver perto (100m) da academia;
- O check-in só pode ser validado até 20 minutos após ser criado;
- O check-in só pode ser validado por administradores;
- A academia só pode ser cadastrada por administradores.

## Requisitos Não Funcionais (RNFs)
- A senha do usuário precisa estar criptografada;
- Os dados da aplicação precisam estar persistidos em um banco PostgreSQL;
- Todas listas de dados precisam estar paginadas com 20 itens por página;
- O usuário deve ser identificado por um JWT (JSON Web Token).

## Tecnologias Utilizadas
- **Backend:** Node.js, Fastify, Prisma ORM
- **Banco de Dados:** PostgreSQL
- **Autenticação:** JWT
- **Segurança:** Bcrypt para hash de senhas

## Como Executar o Projeto
1. Clone o repositório:
   ```sh
   git clone https://github.com/seu-usuario/gympass-style-app.git
   ```
2. Acesse o diretório do projeto:
   ```sh
   cd gympass-style-app
   ```
3. Instale as dependências:
   ```sh
   npm install
   ```
4. Configure as variáveis de ambiente no arquivo `.env`:
   ```env
   DATABASE_URL=postgresql://usuario:senha@localhost:5432/gympass
   JWT_SECRET=seuSegredoJWT
   ```
5. Execute as migrações do banco de dados:
   ```sh
   npx prisma migrate dev
   ```
6. Inicie o servidor:
   ```sh
   npm run dev
   ```

## Endpoints Principais
- **Autenticação:** `/auth/register`, `/auth/login`
- **Usuário:** `/users/profile`, `/users/checkins`
- **Academias:** `/gyms/nearby`, `/gyms/search`
- **Check-ins:** `/checkins/create`, `/checkins/validate`

## Contribuição
Contribuições são bem-vindas! Sinta-se à vontade para abrir issues e pull requests.

## Licença
Este projeto está sob a licença MIT.

