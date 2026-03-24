# Deploy do Frontend

## Link local

Dentro de `frontend/`:

```bash
npm install
npm run dev
```

O link local normalmente sera:

`http://localhost:5173`

## Variavel de ambiente

Use `frontend/.env.example` como base e crie um arquivo `.env` em `frontend/` com:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Quando publicar, troque pela URL publica da API, por exemplo:

```env
VITE_API_BASE_URL=https://sua-api.onrender.com/api
```

## Publicar no Vercel

Se voce importou o repositorio inteiro no Vercel:

1. Abra o projeto no painel da Vercel.
2. Em `Settings > General`, defina `Root Directory` como `frontend`.
3. Confirme que o build command e `npm run build`.
4. Confirme que o output directory e `dist`.
5. Em `Settings > Environment Variables`, configure `VITE_API_BASE_URL`.
6. Clique em novo deploy.

Se voce importou apenas a pasta `frontend/` como projeto separado:

1. Importe o projeto no Vercel.
2. Configure a variavel `VITE_API_BASE_URL`.
3. Clique em deploy.

O Vercel vai gerar um link publico como:

`https://monayra.vercel.app`

## Publicar no Netlify

1. Envie a pasta `frontend/` para um repositorio.
2. Crie um novo site no Netlify.
3. Use:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Configure `VITE_API_BASE_URL`.
5. Publique o site.

## Observacao

O frontend ja esta preparado para deploy estatico, mas a criacao de contas, login e publicacao de vagas dependem de:

- uma API publicada e acessivel por HTTPS
- `VITE_API_BASE_URL` apontando para essa API
- CORS do backend liberando o dominio final da Vercel
