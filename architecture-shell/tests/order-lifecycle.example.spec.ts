/**
 * SANITIZED PORTFOLIO ARCHITECTURE SHELL
 *
 * This file is not production source code. It demonstrates structure and patterns only.
 * Real business rules, validation rules, and implementation details are removed.
 */

import { describe, it, expect, beforeEach } from "@playwright/test";

// Example test for order lifecycle - пример теста жизненного цикла заказа

describe("Order Lifecycle", () => {
  beforeEach(async ({ page }) => {
    // Login
    await page.goto("/login");
    await page.fill('input[name="login"]', "demo-user");
    await page.fill('input[name="password"]', "demo-password");
    await page.click('button[type="submit"]');
    await page.waitForURL("/");
  });

  it("should create a new order", async ({ page }) => {
    // Navigate to orders
    await page.click('a[href="/orders"]');
    await page.click('button:has-text("New Order")');

    // Fill client info
    await page.fill('input[name="clientName"]', "Demo Client");
    await page.fill('input[name="clientContact"]', "demo-contact");

    // Fill vehicle info
    await page.fill('input[name="vehicleBrand"]', "Demo Brand");
    await page.fill('input[name="vehicleModel"]', "Demo Model");
    await page.fill('input[name="plateNumber"]', "DEMO-001");

    // Add service
    await page.click('button:has-text("Add Service")');
    await page.click('text=demo-service-1');

    // Save order
    await page.click('button:has-text("Save")');

    // Verify order created
    await expect(page.locator('h1')).toContainText("Order");
    await expect(page.locator('text=Demo Client')).toBeVisible();
  });

  it("should transition order through statuses", async ({ page }) => {
    // Navigate to existing order
    await page.goto("/orders/demo-order-001");

    // Start work
    await page.click('button:has-text("Start Work")');
    await expect(page.locator('text=in_work')).toBeVisible();

    // Complete work
    await page.click('button:has-text("Complete")');
    await expect(page.locator('text=ready')).toBeVisible();

    // Add payment
    await page.click('button:has-text("Add Payment")');
    await page.selectOption('select[name="paymentMethod"]', "cash");
    await page.fill('input[name="amount"]', "2400");
    await page.click('button:has-text("Add")');

    // Verify payment added
    await expect(page.locator('text=2400 ₽')).toBeVisible();
  });

  it("should cancel an order", async ({ page }) => {
    await page.goto("/orders/demo-order-002");

    await page.click('button:has-text("Cancel")');
    await page.click('button:has-text("Confirm")');

    await expect(page.locator('text=cancelled')).toBeVisible();
  });
});
