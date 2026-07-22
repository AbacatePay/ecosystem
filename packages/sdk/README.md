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
});
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
