import {
  ProductDiscountSelectionStrategy,
} from '../generated/api';

/**
  * @typedef {import("../generated/api").CartInput} RunInput
  * @typedef {import("../generated/api").CartLinesDiscountsGenerateRunResult} CartLinesDiscountsGenerateRunResult
  */

/**
  * @param {RunInput} input
  * @returns {CartLinesDiscountsGenerateRunResult}
  */

export function cartLinesDiscountsGenerateRun(input) {
  if (!input.cart.lines.length) {
    return {operations: []};
  }

  const cartTotal = Number(input.cart.cost.subtotalAmount.amount);

  function cartTier(total) {
    if (total >= 1000) return 20;
    if (total >= 500) return 15;
    if (total >= 250) return 10;
    if (total >= 100) return 5;
    return 0;
  }

  function volumeTier(qty) {
    if (qty >= 25) return 15;
    if (qty >= 10) return 10;
    if (qty >= 4) return 5;
    return 0;
  }

  function accountBonus(tags) {
    if (!tags) return 0;
    if (tags.includes("wholesale")) return 5;
    if (tags.includes("student")) return 3;
    return 0;
  }

  const cartDiscount = cartTier(cartTotal);
  const tags = input.cart.buyerIdentity?.customer?.tags || [];
  const bonus = accountBonus(tags);

  const discountCandidates = [];

  for (const line of input.cart.lines) {
    const qty = line.quantity;

    let discount = Math.max(cartDiscount, volumeTier(qty));
    discount += bonus;

    if (discount > 25) discount = 25;

    if (discount > 0) {
      discountCandidates.push({
        message: `${discount}% discount applied`,
        targets: [
          {
            cartLine: {
              id: line.id
            }
          }
        ],
        value: {
          percentage: {
            value: discount
          }
        }
      });
    }
  }

  if (discountCandidates.length === 0) {
    return {operations: []};
  }

  const operations = [];

  operations.push({
    productDiscountsAdd: {
      candidates: discountCandidates,
      selectionStrategy: ProductDiscountSelectionStrategy.First,
    },
  });

  return {
    operations,
  };
}