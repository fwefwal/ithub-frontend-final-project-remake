<script lang="ts" setup>
import { ProductCard } from '@repo/ui';
import { api } from '@repo/convex/api';
import type { DataModel } from '@repo/convex/dataModel'

import Featured from '~/components/Featured.vue';
import { useCartLocal } from '~/stores/cartLocal';

type Product = DataModel["products"]["document"] & { image?: string }

const { data: products, error } = await useConvexQuery(
  api.products.get,
  {}
)

const getProductImage = (product: Product): string | undefined => {
  if (product.image) return product.image
  const imgMatch = product.description?.match(/<img[^>]+src="([^"]+)"/)
  if (imgMatch) return 'https://pitergsm.ru' + imgMatch[1]
  return undefined
}

const cart = useCartLocal()
const favorites = ref<string[]>([])
if (import.meta.client) {
  favorites.value = JSON.parse(localStorage.getItem('favorites') || '[]')
  watch(favorites, (val) => localStorage.setItem('favorites', JSON.stringify(val)), { deep: true })
}

const buyNow = (product: Product) => {
  cart.addProduct({
    sku: product._id,
    price: product.current_price,
    title: product.title,
    quantity: 1
  })
}

const toggleFavorite = (productId: string) => {
  const idx = favorites.value.indexOf(productId)
  if (idx === -1) {
    favorites.value.push(productId)
  } else {
    favorites.value.splice(idx, 1)
  }
}

const isFavorite = (productId: string) => favorites.value.includes(productId)

const goToCart = () => navigateTo('/cart')
</script>

<template>
  <main class="page">
    <Cta />
    <BrowseByCategory />
    <Featured />

    <p v-if="error">
      {{ error?.message }}
    </p>

    <div v-if="!error">
      <section v-if="products && products.length > 0" id="products-section" class="products-grid">
        <ProductCard class="product-item" v-for="product in products" :key="product._id" :title="product.title"
          :current_price="product.current_price" :in_cart="cart.hasProduct(product._id)"
          :favorited="isFavorite(product._id)" :image="getProductImage(product)" :wide="false"
          @buy-now="() => buyNow(product)" @favorite="() => toggleFavorite(product._id)"
          @go-to-cart="goToCart" />
      </section>
      <p v-else class="no-products">No products available</p>
    </div>
  </main>
</template>

<style scoped>
.page {
  flex: 1;
}

.products-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(4, max-content);
  gap: 16px;
  padding: 56px 16px;
}

.no-products {
  text-align: center;
  padding: 40px;
  color: #999;
}
</style>
