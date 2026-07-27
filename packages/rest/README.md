<div align="center">

# AbacatePay REST

Um REST Client para a API da AbacatePay — rápido, seguro e testado.</br>
O [`@abacatepay/rest`](https://www.npmjs.com/package/@abacatepay/rest) é um **cliente REST leve e totalmente tipado** para interagir com a API do AbacatePay.</br>
Projetado para **Node.js, Bun e runtimes modernos**, com retries inteligentes, timeout e tratamento de erros consistente.

<img src="https://res.cloudinary.com/dkok1obj5/image/upload/v1767631413/avo_clhmaf.png" width="100%" alt="AbacatePay Open Source"/>

## Instalação

Use com o seu *package manager* favorito

</div>

```bash
bun add @abacatepay/rest
# Ou
pnpm add @abacatepay/rest
# Ou
npm install @abacatepay/rest
```

<div align="center">

## Uso Básico

Simule um pagamento QRCodePix que tenha o ID `pix_char_123456`
</div>

```ts
import { createREST } from '@abacatepay/rest';

const client = createREST({
	secret: process.env.ABACATEPAY_API_KEY!,
});

const pix = await client.post('/transparents/simulate-payment', {
    query: { id: 'pix_char_123456' },
});

console.log(pix);
```

<div align="center">

## Retry & Backoff

Por padrão, o REST faz **3 retries** automaticamente para erros **retryable** (rate limit, 5xx, erro de rede).

</div>

```ts
const client = createREST({
    retry: {
        max: 5
    },
})
```

<div align="center">

### Backoff customizado
</div>

```ts
const client = createREST({
	retry: {
		max: 7,
		backoff(attempt) {
			// Backoff exponencial
			return Math.min(10_000, 500 * 2 ** attempt);
		},
	},
});
```

<p align="center">Se nenhum backoff for fornecido, o REST usa backoff exponencial com jitter automaticamente.</p>

<div align="center">

## Tratando erros

O REST Client **nunca lança exceções** — toda chamada resolve com o mesmo formato `{ data, error, success }` que a própria API da AbacatePay retorna. Falhas do lado do cliente (rede, timeout, secret ausente) são normalizadas para esse mesmo formato.

</div>

```ts
const { data, error, success } = await client.get('/customers/invalid');

if (!success) {
	console.error('Erro:', error);

	return;
}

console.log(data);
```

<div align="center">

Você pode ver a documentação completa por [aqui](https://docs.abacatepay.com/pages/rest).

Feito com 🥑 pela equipe AbacatePay</br>
Open source, de verdade.

</div>
