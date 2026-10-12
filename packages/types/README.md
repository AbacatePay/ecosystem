<div align="center">

## AbacatePay API Types

O [`@abacatepay/types`](https://www.npmjs.com/package/@abacatepay/types) fornece **tipagens oficiais** e **helpers modernos** para trabalhar com a API da AbacatePay de forma **segura**, **previsível** e **alinhada** à documentação oficial.

O pacote é **TypeScript-first** e serve como base para integrações diretas via **fetch**, **SDKs** internos, **CLIs** e validações em **aplicações** backend.

<img src="https://res.cloudinary.com/dkok1obj5/image/upload/v1767631413/avo_clhmaf.png" width="100%" alt="AbacatePay Open Source"/>

## Instalação

Use o *package manager* da sua preferência:

</div>

```bash
bun add @abacatepay/types
# ou
pnpm add @abacatepay/types
# ou
npm install @abacatepay/types
```

<div align="center">

## Versionamento dos Tipos

Antes de tudo, você deve especificar a versão da API que deseja usar, adicionando **/v*** na importação:

</div>

```ts
import { APICustomer } from '@abacatepay/types/v2';
```

<p align="center">Tipos e constantes globais não são versionados e devem ser importados diretamente sem a versão:</p>

```ts
import { version, API_BASE_URL, API_VERSION } from '@abacatepay/types';
```

## Como a AbacatePay API Types documenta

- Prefixo `API*`
Representa estruturas gerais da API (Objetos retornados, modelos internos etc.).

- Prefixo `Webhook*`
Representa payloads recebidos pelos eventos de webhook.
Documentação: https://docs.abacatepay.com/pages/webhooks

- Prefixo `REST<HTTPMethod>*`
Tipos usados em requisições diretas à API.
  - Sufixo Body → corpo enviado na requisição
  Ex.: `RESTPostCreateNewChargeBody`

  - Sufixo `QueryParams` → parâmetros de query
  Ex.: `RESTGetCheckQRCodePixStatusQueryParams`

  - Sufixo `Data` → dados retornados pela API
  Ex.: `RESTGetListCouponsData`

- O pacote **NÃO adiciona tipos além do que a API realmente envia e recebe**.
Cada tipo reflete o comportamento da API v2, documentada aqui:
https://docs.abacatepay.com/pages/start/introduction

- Campos marcados com `@unstable`
São campos que não têm definição formal na documentação, mas cujo tipo foi inferido com base nos exemplos oficiais.
(Ex.: `WebhookWithdrawDoneEvent.billing.kind`)

<h2 align="center">Quickstart</h2>

<p align="center"><strong>Crie um novo cupom</strong></p>

```ts
import {
    Routes,
    type RESTPostCreateCouponBody,
    type RESTPostCreateCouponData,
} from '@abacatepay/types/v2';
import { createREST } from '@abacatepay/rest';

const client = createREST({ secret });

async function createCoupon(body: RESTPostCreateCouponBody) {
    const { data, error, success } = await client.post<RESTPostCreateCouponData>(
        Routes.coupons.create,
        { body },
    );

    return success ? data : error;
}
```

<p align="center"><strong>Percorra uma listagem com cursor</strong></p>

<p align="center">Os builders de <code>Routes</code> só enviam os parâmetros informados, já codificados. Envie <code>pagination.next</code> como <code>after</code> até ele ser <code>null</code> (não dependa só de <code>hasMore</code>).</p>

```ts
import { Routes, type RESTGetListCustomersData } from '@abacatepay/types/v2';

let after: string | undefined;

do {
    const page = await client.get<RESTGetListCustomersData>(
        Routes.customers.list({ limit: 100, after }),
    );

    if (!page.success) break;

    after = page.pagination.next ?? undefined;
} while (after);
```

<p align="center"><strong>Crie um servidor com Elysia e escute eventos de Webhooks do Aabacate</strong></p>

```ts
import { WebhookEvent } from '@abacatepay/typebox/v2';
import { WebhookEventType } from '@abacatepay/types/v2';

const app = new Elysia()
	.post('/webhooks/abacatepay', ({ body: { event, data } }) => {
			switch (event) {
				case WebhookEventType.CheckoutCompleted:
					...
				case WebhookEventType.TransparentCompleted:
					...
				case WebhookEventType.PayoutFailed:
					...
			}
	}, {
		body: WebhookEvent,
);
```

<p align="center"><strong>Verifique a assinatura dos webhooks</strong></p>

<p align="center">Endpoints no formato antigo recebem o header <code>X-Webhook-Signature</code> e o seu secret em <code>?webhookSecret=</code>. Endpoints no formato Standard Webhooks recebem os headers <code>webhook-id</code>, <code>webhook-timestamp</code> e <code>webhook-signature</code>, assinados com o secret do endpoint.</p>

```ts
import {
    verifyStandardWebhookSignature,
    verifyWebhookSignature,
} from '@abacatepay/types';

// Formato antigo
const valid = verifyWebhookSignature(rawBody, headers['x-webhook-signature']);

// Standard Webhooks
const validStandard = verifyStandardWebhookSignature(
    rawBody,
    {
        id: headers['webhook-id'],
        timestamp: headers['webhook-timestamp'],
        signature: headers['webhook-signature'],
    },
    process.env.ABACATEPAY_WEBHOOK_SECRET,
);
```

<div align="center">

Nota, você pode fazer isso de uma maneira mais simples com [`@abacatepay/adapters`](https://www.npmjs.com/package/@abacatepay/adapters).

Feito com 🥑 pela equipe AbacatePay</br>
Open source, de verdade.</p>
