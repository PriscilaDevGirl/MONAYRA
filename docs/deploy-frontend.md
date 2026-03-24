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

Crie um arquivo `.env` em `frontend/` com:

```env
VITE_API_BASE_URL=http://localhost:8000/api
```

Quando publicar, troque pela URL publica da API, por exemplo:

```env
VITE_API_BASE_URL=https://sua-api.onrender.com/api
```

## Publicar no Vercel

1. Entre na pasta `frontend/`.
2. Suba esse diretorio para um repositorio GitHub.
3. Importe o projeto no Vercel.
4. Configure a variavel `VITE_API_BASE_URL`.
5. Clique em deploy.

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

O frontend ja esta preparado para deploy estatico, mas a criacao de contas, login e publicacao de vagas dependem de uma API publicada e acessivel por HTTPS.
