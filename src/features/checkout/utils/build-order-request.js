function buildOrderRequest({ cart, checkoutValues }) {
  const cartItems = cart?.items ?? [];

  if (cartItems.length === 0) {
    throw new Error("Your bag is empty.");
  }

  const items = cartItems.map((item) => {
    const productId = item.product?.id;

    const variantId = item.variant?.id;

    if (!productId || !variantId || !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw new Error("Your bag contains an invalid item. Please review your bag.");
    }

    return {
      productId,
      variantId,
      quantity: item.quantity,
    };
  });

  const address = checkoutValues.shippingAddress;

  const shippingAddress = {
    fullName: address.fullName,

    phone: address.phone,

    ...(address.alternatePhone
      ? {
          alternatePhone: address.alternatePhone,
        }
      : {}),

    ...(address.email
      ? {
          email: address.email,
        }
      : {}),

    addressLine1: address.addressLine1,

    ...(address.addressLine2
      ? {
          addressLine2: address.addressLine2,
        }
      : {}),

    ...(address.landmark
      ? {
          landmark: address.landmark,
        }
      : {}),

    city: address.city,

    state: address.state,

    postalCode: address.postalCode,

    country: address.country,
  };

  return {
    items,

    shippingAddress,

    paymentMethod: checkoutValues.paymentMethod,

    ...(checkoutValues.customerNote
      ? {
          customerNote: checkoutValues.customerNote,
        }
      : {}),
  };
}

export { buildOrderRequest };
