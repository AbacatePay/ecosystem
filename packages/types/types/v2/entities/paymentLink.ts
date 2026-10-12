import type { APICheckout } from './checkout';

/**
 * A reusable payment link: unlike a one-time checkout, the same link can be paid by
 * multiple customers. It has the same shape as a checkout, with `frequency` set to
 * `MULTIPLE_PAYMENTS` and `status` set to `ACTIVE` while it accepts payments.
 *
 * https://docs.abacatepay.com/pages/payment-links/reference
 */
export type APIPaymentLink = APICheckout;
