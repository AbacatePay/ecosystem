<div align="center">

# AbacatePay Zod

Schemas oficiais da API da AbacatePay usando **Zod** — validação runtime, contratos tipados e base para geração automática de OpenAPI.

O [`@abacatepay/zod`](https://www.npmjs.com/package/@abacatepay/zod) expõe **todos os schemas públicos da API**, refletindo fielmente a documentação oficial, sem abstrações extras ou invenções.

Projetado para **TypeScript-first**, integração direta com **Fastify, Express, Hono** e runtimes modernos como **Node.js e Bun**.

<img src="https://res.cloudinary.com/dkok1obj5/image/upload/v1767631413/avo_clhmaf.png" width="100%" alt="AbacatePay Open Source"/>

## Instalação

Use com o seu *package manager* favorito

</div>

```bash
bun add @abacatepay/zod zod
pnpm add @abacatepay/zod zod
npm install @abacatepay/zod zod
```

<div align="center">

## Estrutura e versionamento

Assim como o [`@abacatepay/types`](https://www.npmjs.com/package/@abacatepay/types), você deve importar os schemas a partir da versão da API desejada:

</div>

```ts
import { APICustomer } from '@abacatepay/zod/v1';
import { APISubscription } from '@abacatepay/zod/v2';
```
<p align="center">Schemas globais (version, utilitários etc) são exportados sem versão</p>

```ts
import { version } from '@abacatepay/zod';
```

<div align="center">

## Integração com Fastify

Recomendamos o uso do `fastify-type-provider-zod` para melhor inferência de tipos.
</div>

```ts
import Fastify from 'fastify';
import { serializerCompiler, validatorCompiler, ZodTypeProvider } from 'fastify-type-provider-zod';
import { APICheckout, RESTPostCreateNewCheckoutBody } from '@abacatepay/zod/v2';

const fastify = Fastify().withTypeProvider<ZodTypeProvider>();

fastify.setValidatorCompiler(validatorCompiler);
fastify.setSerializerCompiler(serializerCompiler);

fastify.post('/checkouts', {
    schema: {
        body: RESTPostCreateNewCheckoutBody,
        response: {
            200: APICheckout,
        },
    },
}, async (req) => {
    // req.body é totalmente tipado aqui!
    const { methods } = req.body;
    
    return { ... };
});
```

<div align="center">

## Integração com Express

Você pode usar o método `.safeParse` ou `.parse` diretamente nos handlers.
</div>

```ts
import express from 'express';
import { RESTPostCreateNewCheckoutBody } from '@abacatepay/zod/v2';

const app = express();
app.use(express.json());

app.post('/checkouts', (req, res) => {
    const result = RESTPostCreateNewCheckoutBody.safeParse(req.body);

    if (!result.success) {
        return res.status(400).json(result.error);
    }

    const data = result.data; // Dados tipados e validados
    // ...
});
```

<div align="center">

## Uso básico

Você pode validar facilmente um payload retornado pela API em runtime

</div>

```ts
import { APICheckout } from '@abacatepay/zod/v2';

const data = await fetchCheckout();

// Lança erro se a validação falhar
const checkout = APICheckout.parse(data);

// Ou validação segura
const safeCheckout = APICheckout.safeParse(data);
if (safeCheckout.success) {
    console.log(safeCheckout.data.id);
}
```

<div align="center">

## OpenAPI

Todos os schemas são compatíveis com o ecossistema Zod (como `zod-to-openapi`).

Isso permite:
</div>

- SDKs tipados.
- Geração automática de documentação.
- Validação de breaking changes entre versões.

<h2 align="center">Convenções</h2>

- Prefixo `API*`
	- Estruturas gerais da API (objetos retornados, modelos internos).

- Prefixo `REST<HTTPMethod>*`
	- Schemas usados em endpoints REST.
		- Body → corpo da requisição
		- QueryParams → parâmetros de query
		- Data → dados retornados
- Prefixo `Webhook*`
	- Payloads de eventos de webhook

<div align="center">

Você pode ver a documentação completa da API por [aqui](https://docs.abacatepay.com/pages/zod).

Feito com 🥑 pela equipe AbacatePay</br>
Open source, de verdade.

</div>
