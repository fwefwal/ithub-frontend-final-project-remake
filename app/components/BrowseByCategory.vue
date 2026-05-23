<script setup lang="ts">
    import { CategoryCard, Icon } from '@repo/ui';

    const categoryNames = [
        "phones", "smart watches", "cameras", "headphones", "computers", "gaming"
    ]

    const handleCategoryClick = (name: string) => {
        const el = document.getElementById('products-section')
        if (el) el.scrollIntoView({ behavior: 'smooth' })
    }
</script>

<template>
    <article class="wrapper">
        <header class="categories-header">
            <h5 class="categories-title">Browse By Category</h5>
            <Icon variant="arrow" class="arrow-left" />
            <Icon variant="arrow" class="arrow-right" />
        </header>
        <section class="categories">
            <CategoryCard v-for="name in categoryNames" :name="name" @click="handleCategoryClick" />
        </section>
    </article>
</template>

<style scoped>
    .wrapper {
        padding: 64px 16px;
    }
    .categories-header {
        display: flex;
        align-items: center;
        gap: 16px;
    }
    .arrow-left, .arrow-right {
        cursor: pointer;
    }
    .arrow-left {
        margin-left: auto;
        transform: rotate(180deg);
    }
    .categories {
        display: flex;
        gap: 16px;
        overflow-x: auto;
        -webkit-overflow-scrolling: touch;
        padding-bottom: 8px;
    }
    .categories::-webkit-scrollbar {
        display: none;
    }
</style>

<style>
    .category-card {
        min-width: 135px;
        width: auto !important;
        flex-shrink: 0;
    }
    .category-title {
        text-transform: capitalize;
    }
</style>