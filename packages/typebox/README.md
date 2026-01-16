<div align="center">

# AbacatePay TypeBox

Schemas oficiais da API da AbacatePay usando **TypeBox** — validação runtime, contratos tipados e base para geração automática de OpenAPI.

O [`@abacatepay/typebox`](https://www.npmjs.com/package/@abacatepay/typebox) expõe **todos os schemas públicos da API**, refletindo fielmente a documentação oficial, sem abstrações extras ou invenções.

Projetado para **TypeScript-first**, integração direta com **Elysia, Fastify, Hono** e runtimes modernos como **Node.js e Bun**.

<img src="https://res.cloudinary.com/dkok1obj5/image/upload/v1767631413/avo_clhmaf.png" width="100%" alt="AbacatePay Open Source"/>

## Instalação

Use com o seu *package manager* favorito

</div>

```bash
bun add @abacatepay/typebox
pnpm add @abacatepay/typebox
npm install @abacatepay/typebox
```

<div align="center">

## Estrutura e versionamento

Assim como o [`@abacatepay/types`](https://www.npmjs.com/package/@abacatepay/types), você deve importar os schemas a partir da versão da API desejada:

</div>

```ts
import { APICustomer } from '@abacatepay/typebox/v1';
import { APISubscription } from '@abacatepay/typebox/v2';
```
<p align="center">Schemas globais (version, utilitátios etc) são exportados sem versão</p>

```ts
import { version } from '@abacatepay/typebox';
```

<div align="center">

## Integração com Elysia

O TypeBox encaixa aqui perfeitamente e diretamente com o Elysia, sem abstrações
</div>

```ts
import { Elysia } from 'elysia';
import {
    APIResponse,
	APICheckout,
	RESTPostCreateNewCheckoutBody,
} from '@abacatepay/typebox/v2';

new Elysia().post(
	'/checkouts/create',
	() => { ... },
	{
		body: RESTPostCreateNewCheckoutBody,
		response: APIResponse(APICheckout),
		detail: {
            tags: ['Checkouts'],
			summary: 'Create a new checkout',
		},
	},
);
```

<div align="center">

## Uso básico

Você pode validar fácilmente um payload retornado pela API em runtime

</div>

```ts
import { Value } from '@sinclair/typebox/value';
import { APICheckout } from '@abacatepay/typebox/v2';

const data = await fetchCheckout();

if (!Value.Check(APICheckout, data)) {
	throw new Error('Invalid checkout payload');
}
```

<div align="center">

## OpenAPI

Todos os schemas são compatíveis com **OpenAPI 3.1** via JSON Schema.

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

Você pode ver a documentação completa da API por [aqui](https://docs.abacatepay.com/pages/typebox).

Feito com 🥑 pela equipe AbacatePay</br>
Open source, de verdade.

</div>