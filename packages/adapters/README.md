<div align="center">

# AbacatePay Adapters

Utilitários oficiais da **AbacatePay** para construir **adapters de Webhooks** de forma **consistente**, **segura** e **totalmente tipada**, independentemente do framework.

O [`@abacatepay/adapters`](https://www.npmjs.com/package/@abacatepay/adapters) é um pacote **framework-agnostic**, pensado para quem cria integrações (Fastify, Hono, Express, NestJS, Elysia, Supabase, etc.) e quer **eliminar duplicação**, manter **DX alta** e centralizar a lógica de domínio dos webhooks.

<img src="https://res.cloudinary.com/dkok1obj5/image/upload/v1767631413/avo_clhmaf.png" width="100%" alt="AbacatePay Open Source"/>

Este pacote **não lida com HTTP**. Ele cuida apenas do que é comum a todos os adapters:
verificação de assinatura, validação do payload e dispatch de eventos.

Você pode encontrar a documentação completa de Webhooks [aqui](https://docs.abacatepay.com/pages/webhooks).

## Instalação

Use com o seu *package manager* favorito:

</div>

```bash
bun add @abacatepay/adapters
# ou
pnpm add @abacatepay/adapters
# ou
npm install @abacatepay/adapters
```

<div align="center">

Nenhuma dependência de framework é necessária.
O pacote depende apenas dos tipos oficiais da AbacatePay.

## Importação
</div>

```ts
import {
    parse,
	verify,
	dispatch,
} from '@abacatepay/adapters/webhooks';
```
<div align="center">

## Uso básico

O fluxo padrão de um webhook é sempre o mesmo:
</div>

1. Receber o body bruto
2. Verificar a assinatura
3. Validar e parsear o evento
4. Disparar o handler correto

```ts
const { ABACATEPAY_WEBHOOK_SECRET } = process.env;

if (query.webhookSecret !== ABACATEPAY_WEBHOOK_SECRET) {
    throw new Error('Invalid secret');
}

const raw = '...';
const signature = '...';

if (!verify(raw, signature)) {
	throw new Error('Invalid signature');
}

const parsed = parse(raw);

if (!parsed.success) {
    throw parsed.error;
};

await dispatch(parsed, {
	onPayload({ event }) {
		console.log('Evento recebido:', event);
	},
    onPayoutDone({ data }) {
        console.log(data.transaction.id);
    },
});
```

<div align="center">

Nota, caso exista algum handler para o evento específico, ele será usado, caso contrário, o handler `onPayload` será usado.

Feito com 🥑 pela equipe AbacatePay<br/>
Open source, de verdade.
</div>
