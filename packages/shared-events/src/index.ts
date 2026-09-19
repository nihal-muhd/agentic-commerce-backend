export const eventNames = {
  orderCreated: 'order.created',
  paymentCompleted: 'payment.completed',
  paymentFailed: 'payment.failed',
} as const;

export type EventName = (typeof eventNames)[keyof typeof eventNames];

export type OrderCreatedEvent = {
  eventName: typeof eventNames.orderCreated;
  orderId: string;
  userId: string;
  totalCents: number;
  occurredAt: string;
};

export type PaymentCompletedEvent = {
  eventName: typeof eventNames.paymentCompleted;
  paymentId: string;
  orderId: string;
  amountCents: number;
  occurredAt: string;
};

export type PaymentFailedEvent = {
  eventName: typeof eventNames.paymentFailed;
  paymentId: string;
  orderId: string;
  reason: string;
  occurredAt: string;
};

export type DomainEvent =
  | OrderCreatedEvent
  | PaymentCompletedEvent
  | PaymentFailedEvent;
