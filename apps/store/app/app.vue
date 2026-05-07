<script setup lang="ts">
    import "~/assets/css/global.css"
    import { Header, Footer } from '@repo/ui'
    import { useCart } from "./stores/cart";

    const cart = useCart()
</script>

<template>
    <Header 
        :cart-quantity="cart.items.length"
        @cart-click="navigateTo('/cart')"
        @favorites-click="navigateTo('/favorites')"
        @index-click="navigateTo('/')"
    />
    <NuxtPage />
    <Footer />
</template>