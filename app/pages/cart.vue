<script lang="ts" setup>
import { CartPrice, ProductCard } from '@repo/ui'

import { useCartLocal } from '~/stores/cartLocal';

const cart = useCartLocal()

const handleDelete = (sku: string) => {
  cart.changeQuantity({ sku, quantity: 0, title: '', price: 0 })
}

const handleQuantityChange = (sku: string, quantity: number) => {
  const item = cart.items.find(i => i.sku === sku)
  if (item) cart.changeQuantity({ ...item, quantity })
}
</script>

<template>
  <main class="page">
    <h2 class="page-title">Shopping Cart</h2>

    <section v-if="cart.items.length === 0" class="empty-cart">
      <p>Your cart is empty</p>
    </section>

    <section v-else class="cart-items">
      <article v-for="item in cart.items" :key="item.sku" class="cart-item">
        <ProductCard
          :title="item.title"
          :current_price="item.price"
          :sku="item.sku"
          wide
        />
        <CartPrice
          :quantity="item.quantity"
          :price="item.price"
          @delete="handleDelete(item.sku)"
          @update-quantity="(q: number) => handleQuantityChange(item.sku, q)"
        />
      </article>
    </section>

    <section v-if="cart.items.length > 0" class="cart-summary">
      <div class="summary-row">
        <span>Subtotal</span>
        <span>${{ cart.subTotal }}</span>
      </div>
      <div class="summary-row">
        <span>Shipping</span>
        <span>${{ cart.orderDetails.shipping }}</span>
      </div>
      <div class="summary-row">
        <span>Tax</span>
        <span>${{ cart.orderDetails.tax }}</span>
      </div>
      <div class="summary-row summary-total">
        <span>Total</span>
        <span>${{ cart.total }}</span>
      </div>
    </section>
  </main>
</template>

<style scoped>
.page {
  flex: 1;
  padding: 40px 17px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.page-title {
  font-size: 24px;
  line-height: 32px;
}

.empty-cart {
  text-align: center;
  padding: 40px;
  color: #999;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cart-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 9px;
}

.cart-summary {
  border-top: 1px solid #eee;
  padding-top: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  font-size: 16px;
}

.summary-total {
  font-size: 20px;
  font-weight: 700;
  border-top: 1px solid #eee;
  padding-top: 12px;
}
</style>
