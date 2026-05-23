<script lang="ts" setup>
import { Field, Button } from '@repo/ui'

const errorRef = ref<Error | null>(null)

const handleRegister = async (event: SubmitEvent) => {
    const form = event.target as HTMLFormElement
    const formData = new FormData(form)

    const email = formData.get('email')
    const password = formData.get('password')

    try {
        errorRef.value = null

        await $fetch('/api/register', {
            method: "POST",
            body: {
                email,
                password
            }
        })

        await navigateTo('/login')
    } catch (error) {
        errorRef.value = error as Error
    }
}
</script>

<template>
    <main class="page">
        <h2 class="page-title">Sign Up</h2>

        <p v-if="errorRef">{{ (errorRef as any)?.data?.message || (errorRef as any)?.message }}</p>

        <form class="form" method="post" @submit.prevent="handleRegister">
            <Field label="Email" placeholder="user@example.com" name="email" type="email" />
            <Field label="Password" placeholder="********" name="password" type="password" />
            <Button label="Sign Up" type="submit" />
            <NuxtLink href="/login">Login an account</NuxtLink>
        </form>
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

.form {
    display: flex;
    flex-direction: column;
    gap: 40px;
}
</style>
