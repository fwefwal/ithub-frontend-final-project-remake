<script setup lang="ts">
import "~/assets/css/global.css"
import { Header, Footer } from '@repo/ui'

import { useCartLocal } from "./stores/cartLocal";

const { loggedIn, clear } = useUserSession()

const cart = useCartLocal()

const route = useRoute()
const { fullPath } = route

const handleLogout = async () => {
    await clear()
    await navigateTo(fullPath)
}

const handleIndexClick = () => {
    if (route.path === '/') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
        navigateTo('/')
    }
}
</script>

<template>
    <Header :cart-quantity="cart.items?.length" :logged-in="loggedIn" @cart-click="navigateTo('/cart')"
        @favorites-click="navigateTo('/favorites')" @index-click="handleIndexClick"
        @logout-click="handleLogout" @login-click="navigateTo('/login')" />
    <NuxtPage />
    <Footer />
</template>