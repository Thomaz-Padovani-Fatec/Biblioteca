# Sistema de Gestão de Biblioteca: Projeto Semestral

Código de referência do projeto semestral de **Desenvolvimento Web II**, cobrindo o
stack completo definido para o semestre: **Laravel** (back-end/API) + **React**
(front-end) + **PostgreSQL** (banco de dados, hospedado no Supabase).

Este repositório existe para uso em sala de aula, mostrando código real de cada
conceito conforme os encontros avançam. Não é um scaffold vazio: os módulos abaixo
já têm migrations, relacionamentos, autenticação e regras de negócio implementados.

> **Aviso sobre o escopo avaliado do projeto semestral**
>
> Layout responsivo e upload de arquivos não fazem parte deste projeto nem da
> avaliação. O front-end de referência não foi construído com layout
> responsivo, e a capa do livro é apenas um link de imagem opcional (`capa_url`).
> Se sua equipe quiser implementar qualquer um dos dois por conta própria,
> ótimo. Só não é obrigatório. Consulte o enunciado do projeto semestral
> vigente em caso de dúvida sobre o que é avaliado.

## Estrutura

```
biblioteca/
├── biblioteca-api/      # Back-end Laravel (API REST)
└── biblioteca-front/    # Front-end React (Vite)
```

## O que já está implementado

| Módulo | Cobre os tópicos de |
|---|---|
| Migrations (`autores`, `livros`, `categorias`, `usuarios`, `emprestimos`, `reservas`) | Encontro 3: Persistência e Migrations |
| Models com `hasMany`, `belongsTo`, `belongsToMany`, scope local | Encontro 3: Eloquent ORM e Relacionamentos |
| `AuthController` com Sanctum (register/login/logout) | Encontro 5: Sessões e Autenticação |
| `LivroController`, `AutorController`, `CategoriaController` (CRUD completo) | Encontro 3 e Encontro 4: CRUD e Controllers |
| `Form Requests` com validação e autorização por perfil | Encontro 4: Validação com Form Request |
| `EmprestimoController` com regra de negócio (não permite emprestar livro já emprestado) | Encontro 4: regras de negócio na Service |
| React com `useState`, eventos, formulários controlados | Encontro 7: State e Eventos |
| React consumindo a API com Axios (`useEffect`, try/catch) | Encontro 8: Conectando o React com a API |
| Prefixo `/v1`, `throttle` e rotas versionadas em `routes/api.php` | Encontro 4: Rotas de API bem organizadas |
| `app/Services/EmprestimoService.php` e `DevolucaoController` (invokable) | Encontro 4: Organizando Controllers |
| `app/Rules/IsbnValido.php` e validação condicional/aninhada em `StoreLivroRequest` | Encontro 4: Validação Avançada |
| `app/Support/helpers.php` (`respostaErro()`) e `bootstrap/app.php` completo (erros de API sempre em JSON) | Encontro 4: Respostas de API Consistentes |
| Migration `sessions` (driver `database`) | Encontro 5: Sessões no Laravel |
| `.gitignore`, histórico de commits | Encontro 9: Git e GitHub |
| `render.yaml`, `vercel.json`, CORS de produção, entrypoint com migrations automáticas | Encontro 13 e 14: Deploy em Produção |
| Consumo de API pública (Google Books/Open Library) | Encontro 15, implementado em CadastroLivro.jsx |

## Como rodar localmente

Veja o guia completo de instalação (`guia_instalacao_stack.docx`, já compartilhado)
para instalar PHP, Composer e Node.

### Back-end

```
git clone <url-do-repositorio>
cd biblioteca/biblioteca-api

composer install

# macOS / Linux:
cp .env.example .env
# Windows (PowerShell):
copy .env.example .env

php artisan key:generate
```

Abra o `.env` e preencha só os dados do banco (`DB_HOST`, `DB_USERNAME` e
`DB_PASSWORD`), usando a conexão **Session pooler** do Supabase. As variáveis
`AUTH_MODEL` e `FRONTEND_URL` já vêm preenchidas no `.env.example`, apenas
confira que estão no seu `.env`.

```
php artisan migrate --seed
php artisan serve
```

### Front-end

Em outro terminal:

```
cd biblioteca/biblioteca-front

# macOS / Linux:
cp .env.example .env
# Windows (PowerShell):
copy .env.example .env

npm install
npm run dev
```

O `VITE_API_URL` do `.env` já vem como `http://127.0.0.1:8000/api/v1`. Se você
mudar esse arquivo, pare e suba o `npm run dev` de novo.

### Usuário de teste (criado pelo seeder)

```
email: bibliotecaria@biblioteca.test
senha: password
perfil: bibliotecario
```

### Se algo der errado

- `could not find driver`: habilite `pdo_pgsql` (e `pgsql`) no `php.ini`
- `could not translate host name`: use o **Session pooler** do Supabase, não a conexão direta
- CORS ou erro 404 no login: o `VITE_API_URL` precisa terminar em `/v1`, e o `FRONTEND_URL` do back-end precisa ter a origem exata do front-end (rode `php artisan config:clear` depois de mudar)
- "Credenciais inválidas" com e-mail e senha certos: confira o `AUTH_MODEL=App\Models\Usuario` no `.env`

## Deploy em produção

O repositório tem as duas pastas (`biblioteca-api` e `biblioteca-front`), então cada
serviço precisa saber em qual pasta trabalhar (campo **Root Directory**).

### Back-end no Render

1. No Render, crie um **New Web Service** a partir deste repositório do GitHub
2. Em **Root Directory**, informe `biblioteca-api`, e escolha **Docker** como runtime (o `Dockerfile` já está nessa pasta)
3. Preencha as variáveis de ambiente listadas no `render.yaml`: `APP_KEY`, `AUTH_MODEL`, os dados do Supabase (`DB_*`) e `FRONTEND_URL` (a URL do front-end na Vercel)
4. O `docker-entrypoint.sh` roda `migrate --force` automaticamente a cada deploy, não precisa rodar migration manualmente em produção

### Front-end na Vercel

1. Importe este mesmo repositório na Vercel e, em **Root Directory**, informe `biblioteca-front`
2. Configure a variável de ambiente `VITE_API_URL` apontando para a URL pública do back-end no Render, terminando em `/api/v1` (ex.: `https://biblioteca-api.onrender.com/api/v1`)
3. O `vercel.json` já inclui o rewrite necessário para o React Router funcionar em qualquer rota, inclusive em recarregamentos de página

## Endpoints principais da API

| Método | Rota | Descrição |
|---|---|---|
| POST | /api/v1/register | Cria um novo usuário |
| POST | /api/v1/login | Autentica e retorna um token Sanctum |
| GET | /api/v1/livros | Lista livros (aceita `?busca=` e `?disponiveis=1`) |
| POST | /api/v1/livros | Cadastra um livro (requer perfil bibliotecário) |
| POST | /api/v1/livros/{id}/emprestimos | Registra um empréstimo |
| PATCH | /api/v1/emprestimos/{id}/devolucao | Registra a devolução |