<div align="center">

# AbacatePay Express

Integração oficial da **AbacatePay** com o **Express** para receber **Webhooks** de forma simples, segura e totalmente tipada.

O [`@abacatepay/express`](https://www.npmjs.com/package/@abacatepay/express) é um pacote **framework-first**, projetado para funcionar nativamente com o Express, focado em **DX**, **TypeScript first** e **boas práticas de segurança**.

<img src="https://res.cloudinary.com/dkok1obj5/image/upload/v1767631413/avo_clhmaf.png" width="100%" alt="AbacatePay Open Source"/>

Você pode encontrar a documentação completa de Webhooks [aqui](https://docs.abacatepay.com/pages/webhooks).

## Instalação

Use com o seu *package manager* favorito:

</div>

```bash
bun add @abacatepay/express
# ou
pnpm add @abacatepay/express
# ou
npm install @abacatepay/express
```

<div align="center">

Nenhuma dependência extra é necessária. O pacote já vem pronto para uso com o Express.

## Uso básico

</div>

```ts
import express from 'express';
import { Webhooks } from '@abacatepay/express';

const app = express();

const { ok, handler, error } = Webhooks({
    secret: '...',
    onPayload(payload) {
        console.log('Evento recebido:', payload.event);
    },
});

if (!ok) throw new Error(error);

app.post('/webhooks/abacatepay', express.raw({ type: '*/*' }), handler);
```

<div align="center">

`Webhooks(...)` nunca lança exceção — se o `secret` estiver ausente, ela retorna `{ ok: false, error }` em vez de `{ ok: true, handler }`.

</div>

<div align="center">

## Segurança por padrão
</div>

- Verificação automática da assinatura do webhook
- Comparação segura do webhook secret
- Payload validado antes de chegar ao seu handler
- Nenhum acesso direto à API key

<p align="center"><strong>Nunca exponha sua API key em webhooks.</strong><br/>
Sempre utilize variáveis de ambiente.</p>

<div align="center">

## Tratamento por evento

Você pode lidar com eventos específicos sem boilerplate:

</div>

```ts
const { handler } = Webhooks({
    secret,
    onCheckoutCompleted({ data }) {
        console.log('Cobrança paga:', data.payment.amount);
    },
    onPayoutCompleted({ data }) {
        console.log('Payout concluído:', data.transaction.id);
    },
    onPayoutFailed({ data }) {
        console.error('Falha no payout:', data.transaction.id);
    },
});
```


<p align="center">Ou tratar tudo de forma genérica:</p>

```ts
const { handler } = Webhooks({
    secret,
    onPayload({ data, event }) {
        console.log(event, data);
    },
});
```

<div align="center">

Feito com 🥑 pela equipe AbacatePay<br/>
Open source, de verdade.

</div>
