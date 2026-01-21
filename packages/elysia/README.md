<div align="center">

# AbacatePay Elysia

Integração oficial da **AbacatePay** com o **Elysia** para receber **Webhooks** de forma simples, segura e totalmente tipada.

O [`@abacatepay/elysia`](https://www.npmjs.com/package/@abacatepay/elysia) é um pacote **framework-first**, projetado para funcionar nativamente com o Elysia, focado em **DX**, **TypeScript first** e **boas práticas de segurança**.

<img src="https://res.cloudinary.com/dkok1obj5/image/upload/v1767631413/avo_clhmaf.png" width="100%" alt="AbacatePay Open Source"/>

Você pode encontrar a documentação completa de Webhooks [aqui](https://docs.abacatepay.com/pages/webhooks).

## Instalação

Use com o seu *package manager* favorito:

</div>

```bash
bun add @abacatepay/elysia
# ou
pnpm add @abacatepay/elysia
# ou
npm install @abacatepay/elysia
```

<div align="center">

Nenhuma dependência extra é necessária. O pacote já vem pronto para uso com o Elysia.

## Uso básico

</div>

```ts
import { Elysia } from 'elysia';
import { Webhooks } from '@abacatepay/elysia';

const app = new Elysia();

app.post(
    '/webhooks/abacatepay',
    Webhooks({
        secret: '...',
        onPayload(payload) {
            console.log('Evento recebido:', payload.event);
        },
    }),
);
```

<div align="center">

O [`@abacatepay/elysia`](https://www.npmjs.com/package/@abacatepay/elysia) busca automáticamente por `ABACATEPAY_WEBHOOK_SECRET` ou `ABACATE_PAY_WEBHOOK_SECRET` nas variáveis de ambiente para usar caso o *secret* não seja fornecido.

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
Webhooks({
    onBillingPaid({ data }) {
        console.log('Cobrança paga:', data.payment.amount);
    },
    onPayoutDone({ data }) {
        console.log('Payout concluído:', data.transaction.id);
    },
    onPayoutFailed({ data }) {
        console.error('Falha no payout:', data.transaction.id);
    },
});
```


<p align="center">Ou tratar tudo de forma genérica:</p>

```ts
Webhooks({
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
