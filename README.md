# BullsAffiliater

A high-performance Node.js + Fastify service that processes incoming traffic source parameters, generates a unique internal parameter (`our_param`), stores mappings in PostgreSQL, caches them in Redis, and redirects users to affiliate links.

## 🚀 Features

- Accepts traffic parameters: `keyword`, `src`, `creative`, `version`
- Generates consistent short identifier (`our_param`) using SHA256 + Base62
- Uses Redis for fast lookup and reduced database load
- Stores all mappings and versions in PostgreSQL
- Supports forced regeneration with `forcing=1`
- Secured via HTTPS and rate-limited with `@fastify/rate-limit`
- REST API to retrieve original parameters by `our_param`

## 📦 Tech Stack

- **Backend**: Node.js + Fastify
- **Database**: PostgreSQL
- **Cache**: Redis
- **Rate limiting**: @fastify/rate-limit
- **Env config**: dotenv

## 🔧 Installation

```bash
git clone https://github.com/yuriy170/bullsaffiliater.git
cd bullsaffiliater
npm install

After installing of all node_modules you can run project with command
npm start server.js
```

## 🛠 Environment Variables

Create a `.env` file based on `.env.example`:

```dotenv
PORT=443
SSL_KEY_PATH=./certs/privkey.pem
SSL_CERT_PATH=./certs/fullchain.pem
REDIRECT_BASE_URL=https://example.com
REDIS_URL=redis://localhost:6379
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
REDIS_TTL=600
```

## 📡 API Endpoints

### `GET /generate`

**Params**:
- `keyword`, `src`, `creative`, `version`
- optional: `forcing=1`

**Returns**: Redirects to URL with `our_param`

---

### `GET /retrieve_original?our_param=...`

Returns original parameters from database or Redis.

## 📊 Schema Example

PostgreSQL table: `affiliate_links`  
Contains fields like: `keyword`, `src`, `creative`, `generated_param`, `version`, `fingerprint`, `is_active`

## 🔐 Security

- Input validation and escaping
- Parameter hashing to protect business-sensitive values
- TLS via HTTPS
- Rate limiting to mitigate abuse

## 📎 License

[ISC](https://opensource.org/licenses/ISC)

## ✍️ Author

[Yuriy Gershem](https://github.com/yuriy170)