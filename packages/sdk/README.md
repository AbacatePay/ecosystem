<div align="center">

# AbacatePay SDK

SDK oficial da **AbacatePay** para integrar pagamentos via **PIX** de forma simples, segura e totalmente tipada.

O [`@abacatepay/sdk`](https://www.npmjs.com/package/@abacatepay/sdk) é um **wrapper versionado de alto nível** sobre a API da AbacatePay, focado em **DX**, **TypeScript first** e **boas práticas de segurança**.

<img src="https://res.cloudinary.com/dkok1obj5/image/upload/v1767631413/avo_clhmaf.png" width="100%" alt="AbacatePay Open Source"/>

Você pode ver documentação completa do SDK [aqui](https://docs.abacatepay.com/pages/sdk/node).

## Instalação

Use com o seu *package manager* favorito

</div>

```bash
bun add @abacatepay/sdk
# ou
pnpm add @abacatepay/sdk
# ou
npm install @abacatepay/sdk
```

<div align="center">

## Uso básico
</div>

```ts
import { AbacatePay } from '@abacatepay/sdk';

const abacate = AbacatePay({ secret });
```

<div align="center">

Nunca utilize sua API key diretamente no código.
**Sempre use variáveis de ambiente**.

### Criando uma cobrança

</div>

```ts
const checkout = await abacate.checkouts.create({
    items: [
        {
            id: 'prod_123',
            quantity: 1,
        },
    ],
});
```

<div align="center">

### Procure por alguns clientes

</div>

```ts
const customers = await abacate.customers.list({
    limit: 25,
    email: 'maria',
});
```

<div align="center">

## Paginação

Toda listagem da v2 usa **cursor**: os itens vêm do mais novo para o mais antigo e a resposta traz `pagination: { hasMore, next, before }`.
Para ler a próxima página, envie `pagination.next` como `after` até ele ser `null`. Não dependa só de `hasMore`.

</div>

```ts
let after: string | undefined;

do {
    const page = await abacate.checkouts.list({ limit: 100, after });

    if (!page.success) break;

    for (const checkout of page.data) console.log(checkout.id, checkout.status);

    after = page.pagination.next ?? undefined;
} while (after);
```

<p align="center">Todas as listagens também aceitam <code>before</code>, <code>startDate</code> e <code>endDate</code> (<code>YYYY-MM-DD</code>), além dos filtros de cada rota.</p>

<div align="center">

## Checkout transparente de cartão

O cartão é tokenizado no navegador pelo AbacatePay.js, que gera um `token` (`ctok_...`) de uso único, válido por 60 segundos e criado para um valor (`amount`).
No seu backend, cobre com `card.create`. A resposta traz um `cardToken` permanente, que você pode guardar para cobrar o mesmo cartão de novo.

</div>

```ts
import { TransparentMethod } from '@abacatepay/types/v2';

const charge = await abacate.card.create({
    amount: 15000,
    token: 'ctok_...', // ou o cardToken de uma cobrança anterior, nunca os dois
    installmentCount: 3, // opcional, de 1 a 12 (mínimo de R$10 por parcela)
    customer: {
        name: 'Maria Silva',
        email: 'maria@exemplo.com',
        taxId: '529.982.247-25',
        cellphone: '11999999999',
    },
    metadata: { orderId: 'pedido_123' }, // os valores precisam ser strings
});

if (charge.success) {
    console.log(charge.data.id, charge.data.status, charge.data.cardToken);
}

// Consulte ou liste qualquer cobrança transparente (PIX, Boleto ou cartão); reembolse PIX ou cartão
await abacate.transparents.get(charge.data!.id);
await abacate.transparents.list({ method: TransparentMethod.Card });
await abacate.transparents.refund(charge.data!.id, 'Pedido cancelado');
```

<div align="center">

## Retries e timeout

Requisições `GET` são repetidas automaticamente em timeout e em erros temporários (408, 425, 429 e 5xx).
Requisições que criam, enviam ou reembolsam dinheiro (`POST`) **só são repetidas em 429**: se uma cobrança de cartão, saque ou PIX der timeout, ela pode ter sido processada, então consulte antes de tentar de novo.
O timeout padrão é de 30 segundos.

</div>

```ts
const abacate = AbacatePay({
    secret,
    rest: { timeout: 60_000, retry: { max: 5 } },
});
```

<div align="center">

## MRR público (Trust MRR)

As rotas `mrr.*` só aceitam um token `mrr_` (da instalação do app Trust MRR), e esse token não funciona nas outras rotas. Use um cliente separado:

</div>

```ts
const mrr = AbacatePay({ secret: process.env.ABACATEPAY_MRR_TOKEN });

const { data } = await mrr.mrr.byDay({ startDate: '2026-01-01', endDate: '2026-01-31' });
```

<div align="center">

## Versionamento

O pacote é focado 100% na **v2** da API (`import { AbacatePay } from '@abacatepay/sdk'`).

A v1 continua disponível pelo sufixo `/v1`, mas está **descontinuada**: ela é mantida congelada (sem novos recursos) apenas para quem ainda não migrou, e emite um aviso no console ao ser usada.

</div>

```ts
/** @deprecated Migre para a v2 (`@abacatepay/sdk`) */
import { AbacatePay } from '@abacatepay/sdk/v1'

const client = AbacatePay({ secret });
```

```ts
const { data, error, success } = await client.withdraw.create({
    method: 'PIX',
    externalId: 'trx_abc123',
    ...
});
```

<div align="center">

## Tratamento de erros

Nenhuma chamada do SDK lança exceção. Toda chamada resolve com o mesmo formato `{ data, error, success }` que a própria API da AbacatePay retorna — inclusive falhas de rede/timeout são normalizadas para esse formato pelo [`@abacatepay/rest`](https://www.npmjs.com/package/@abacatepay/rest).

</div>

```ts
const { data, error, success } = await abacate.subscriptions.create({ ... });

if (!success) {
    console.error(error);

    return;
}

console.log(data);
```

<div align="center">

Feito com 🥑 pela equipe AbacatePay</br>
Open source, de verdade.

</div>
