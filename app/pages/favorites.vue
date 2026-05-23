<script lang="ts" setup>
import { ProductCard } from '@repo/ui';
import { api } from '@repo/convex/api'
import type { DataModel } from '@repo/convex/dataModel'

import { useCartLocal } from '~/stores/cartLocal';

type Product = DataModel["products"]["document"]

const { data: allProducts } = await useConvexQuery(api.products.get, {})
const cart = useCartLocal()

const favoriteIds = ref<string[]>([])
if (import.meta.client) {
  favoriteIds.value = JSON.parse(localStorage.getItem('favorites') || '[]')
  watch(favoriteIds, (val) => localStorage.setItem('favorites', JSON.stringify(val)), { deep: true })
}

const products = computed(() => {
  if (!allProducts.value) return []
  return allProducts.value.filter((p: Product) => favoriteIds.value.includes(p._id))
})

const toggleFavorite = (productId: string) => {
  const idx = favoriteIds.value.indexOf(productId)
  if (idx === -1) {
    favoriteIds.value.push(productId)
  } else {
    favoriteIds.value.splice(idx, 1)
  }
}

const goToCart = () => navigateTo('/cart')
</script>

<template>
  <main class="page">
    <h2 class="page-title">Favorite</h2>
    <section v-if="products.length === 0" class="empty">
      <p>Здесь пока нет товаров...</p>
    </section>
    <section v-else class="products-grid">
      <article v-for="product in products" :key="product._id" class="favorite-item">
        <button class="remove-btn" @click="toggleFavorite(product._id)">
          ✕
        </button>
        <ProductCard
          :title="product.title"
          :current_price="product.current_price"
          :in_cart="cart.hasProduct(product._id)"
          :sku="product._id"
          wide
          @go-to-cart="goToCart"
        />
      </article>
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

.empty {
  text-align: center;
  padding: 40px;
  color: #999;
}

.products-grid {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.favorite-item {
  position: relative;
}

.remove-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: rgba(0,0,0,0.06);
  cursor: pointer;
  font-size: 14px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
}

.remove-btn:hover {
  background: rgba(0,0,0,0.15);
}
</style>
