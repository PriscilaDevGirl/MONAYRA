# Deploy do Backend

## Provedor recomendado

Para este backend FastAPI, o caminho mais simples e estavel e publicar no Render ou Railway.

## Variaveis de ambiente

Use `backend/.env.example` como referencia e configure:

```env
ENVIRONMENT=production
DATABASE_URL=postgresql+psycopg://USER:PASSWORD@HOST:PORT/DBNAME
ALLOWED_ORIGINS=https://seu-app.vercel.app
JWT_SECRET_KEY=gere-uma-chave-longa-e-segura
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=120
```

Voce tambem pode informar mais de uma origem em `ALLOWED_ORIGINS`, separando por virgula:

```env
ALLOWED_ORIGINS=https://seu-app.vercel.app,https://www.seu-app.vercel.app
```

## Start command

No provedor, use:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

## Root directory

Se o provedor pedir a pasta do servico, use `backend`.

## Teste rapido apos publicar

Depois do deploy, abra:

```text
https://sua-api.onrender.com/
```

Voce deve ver uma resposta com `status: ok`.

Depois abra:

```text
https://sua-api.onrender.com/docs
```

Se isso carregar, volte na Vercel e configure:

```env
VITE_API_BASE_URL=https://sua-api.onrender.com/api
```
