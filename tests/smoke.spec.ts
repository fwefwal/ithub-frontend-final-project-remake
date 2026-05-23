import { test, expect } from '@playwright/test'

test.describe('Smoke tests', () => {
  test('home page loads successfully', async ({ page }) => {
    const res = await page.goto('/')
    expect(res?.ok()).toBeTruthy()
    await expect(page.locator('body')).toBeAttached()
  })

  test('header is present with key elements', async ({ page }) => {
    await page.goto('/')
    const header = page.getByRole('banner')
    await expect(header).toBeAttached()
    await expect(header.getByPlaceholder('Search')).toBeAttached()
    await expect(header.locator('img[alt="search"]')).toBeAttached()
    await expect(header.locator('img[alt="favorites"]')).toBeAttached()
    await expect(header.locator('img[alt="cart"]')).toBeAttached()
  })

  test('CTA section is visible', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Pro.Beyond.')).toBeAttached()
    await expect(page.getByText('IPhone 14 Pro')).toBeAttached()
    await expect(page.getByText('Shop Now')).toBeAttached()
  })

  test('products section exists', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#products-section')).toBeAttached()
  })

  test('cart page loads and shows empty state', async ({ page }) => {
    await page.goto('/cart')
    await expect(page.getByRole('heading', { name: 'Shopping Cart' })).toBeAttached()
    await expect(page.getByText('Your cart is empty')).toBeAttached()
  })

  test('login page has form elements', async ({ page }) => {
    await page.goto('/login')
    await expect(page.getByRole('heading', { name: 'Login' })).toBeAttached()
    await expect(page.getByPlaceholder('user@example.com')).toBeAttached()
    await expect(page.getByRole('button', { name: 'Log In' })).toBeAttached()
  })

  test('register page has form elements', async ({ page }) => {
    await page.goto('/register')
    await expect(page.getByRole('heading', { name: 'Sign Up' })).toBeAttached()
    await expect(page.getByPlaceholder('user@example.com')).toBeAttached()
    await expect(page.getByRole('button', { name: 'Sign Up' })).toBeAttached()
  })

  test('header cart icon navigates to cart page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.getByRole('banner').locator('button.cart-btn').click()
    await page.waitForTimeout(1500)
    await expect(page).toHaveURL(/\/cart/)
  })

  test('header favorites icon navigates to favorites page', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.getByRole('banner').locator('img[alt="favorites"]').first().click({ force: true })
    await page.waitForTimeout(1500)
    await expect(page).toHaveURL(/\/favorites?/)
  })

  test('burger menu opens and shows categories and actions', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 })
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.locator('.burger-btn').click()
    await expect(page.locator('.mobile-menu')).toBeAttached()
    await expect(page.locator('.mobile-menu').getByText('Cart')).toBeAttached()
    await expect(page.locator('.mobile-menu').getByText('Login')).toBeAttached()
    await expect(page.locator('.mobile-menu').getByText('Favorites')).toBeAttached()
  })

  test('browse by category shows 6 category cards', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('.categories')).toBeAttached()
    const cards = page.locator('.category-card')
    await expect(cards).toHaveCount(6)
  })
})
