import type { WebhookEvent } from '@abacatepay/zod/v2';
import type { WebhookOptions } from './types';

export const dispatch = (data: WebhookEvent, options: WebhookOptions) => {
	const { onPayload } = options;

	switch (data.event) {
		case 'payout.completed':
			return (options.onPayoutCompleted ?? onPayload)?.(data);
		case 'payout.failed':
			return (options.onPayoutFailed ?? onPayload)?.(data);
		case 'checkout.completed':
			return (options.onCheckoutCompleted ?? onPayload)?.(data);
		case 'transparent.completed':
			return (options.onTransparentCompleted ?? onPayload)?.(data);
		case 'checkout.refunded':
			return (options.onCheckoutRefunded ?? onPayload)?.(data);
		case 'checkout.disputed':
			return (options.onCheckoutDisputed ?? onPayload)?.(data);
		case 'checkout.lost':
			return (options.onCheckoutLost ?? onPayload)?.(data);
		case 'transparent.refunded':
			return (options.onTransparentRefunded ?? onPayload)?.(data);
		case 'transparent.disputed':
			return (options.onTransparentDisputed ?? onPayload)?.(data);
		case 'transparent.lost':
			return (options.onTransparentLost ?? onPayload)?.(data);
		case 'subscription.completed':
			return (options.onSubscriptionCompleted ?? onPayload)?.(data);
		case 'subscription.cancelled':
			return (options.onSubscriptionCancelled ?? onPayload)?.(data);
		case 'subscription.renewed':
			return (options.onSubscriptionRenewed ?? onPayload)?.(data);
		case 'subscription.trial_started':
			return (options.onSubscriptionTrialStarted ?? onPayload)?.(data);
		case 'transfer.completed':
			return (options.onTransferCompleted ?? onPayload)?.(data);
		case 'transfer.failed':
			return (options.onTransferFailed ?? onPayload)?.(data);
	}
};
