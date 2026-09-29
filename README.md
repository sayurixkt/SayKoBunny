# SayKo Bunny

Diário privado de bem-estar para organizar marmitas, nutrição e hábitos.

## Desenvolvimento local

1. Copie `.env.example` para `.env` e preencha as variáveis.
2. Instale as dependências com `npm install`.
3. Execute `npx prisma migrate dev` quando o PostgreSQL estiver configurado.
4. Execute `npm run dev`.

## Variáveis de ambiente

- `DATABASE_URL`: URL de conexão do PostgreSQL.
- `APP_PASSWORD_HASH`: hash bcrypt da senha única de acesso.
- `SESSION_SECRET`: segredo aleatório, com pelo menos 32 caracteres.
