import { test, expect } from '@playwright/test'

test.describe('Screenshot tests', () => {
  test('home page full page screenshot', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('home-page.png', { fullPage: true })
  })

  test('cart page empty state screenshot', async ({ page }) => {
    await page.goto('/cart')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('cart-empty.png', { fullPage: true })
  })

  test('login page screenshot', async ({ page }) => {
    await page.goto('/login')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('login-page.png', { fullPage: true })
  })

  test('register page screenshot', async ({ page }) => {
    await page.goto('/register')
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('register-page.png', { fullPage: true })
  })
})
