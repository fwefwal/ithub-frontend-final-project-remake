<script setup lang="ts">
import "~/assets/css/global.css"
import { Header, Footer } from '@repo/ui'
import { useCart } from "./stores/cart";

const cart = useCart()
const { loggedIn, clear } = useUserSession()
const { fullPath } = useRoute()

const handleLogout = async () => {
    await clear()
    await navigateTo(fullPath)
}
</script>

<template>
    <Header 
        :cart-quantity="cart.items.length" 
        :logged-in="loggedIn"
        @cart-click="navigateTo('/cart')"
        @favorites-click="navigateTo('/favorites')" 
        @index-click="navigateTo('/')" 
        @logout-click="handleLogout"
        @login-click="navigateTo('/login')"
    />
    <NuxtPage />
    <Footer />
</template>