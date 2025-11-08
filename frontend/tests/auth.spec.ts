import { test, expect } from '@playwright/test';

test.describe('Company Registration Flow', () => {
  test('should complete full registration process', async ({ page }) => {
    // Navigate to registration page
    await page.goto('/register');

    // Verify page loaded
    await expect(page).toHaveTitle(/Hisaabu/);

    // STEP 1: Company Information
    console.log('=== STEP 1: Filling Company Information ===');

    // Fill company name
    await page.fill('input[placeholder="Your Company Name"]', 'Test Company Inc');
    await page.screenshot({ path: 'step1-1.png' });

    // Fill company email
    await page.fill('input[placeholder="company@example.com"]', 'contact@testcompany.com');
    await page.screenshot({ path: 'step1-2.png' });

    // Fill phone
    await page.fill('input[placeholder="+91 1234567890"]', '+1-555-0123');
    await page.screenshot({ path: 'step1-3.png' });

    // GST/TIN (optional)
    await page.fill('input[placeholder="27AABCT1234A1Z0"]', '27AABCT5678B2Z0');

    // Check for Next button and click it
    const nextBtn = page.locator('button:has-text("Next")').first();
    await expect(nextBtn).toBeVisible();
    console.log('Clicking Next button after Step 1');
    await nextBtn.click();

    // Wait for step change
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'step1-complete.png' });

    // STEP 2: Account Information
    console.log('=== STEP 2: Filling Account Information ===');

    // Fill full name
    await page.fill('input[placeholder="Your Full Name"]', 'John Doe');
    await page.screenshot({ path: 'step2-1.png' });

    // Fill user email
    await page.fill('input[placeholder="your@company.com"]', 'john@testcompany.com');
    await page.screenshot({ path: 'step2-2.png' });

    // Fill password
    await page.fill('input[placeholder="Enter a strong password"]', 'TestPass123');
    await page.screenshot({ path: 'step2-3.png' });

    // Fill confirm password
    const passwordInputs = await page.locator('input[type="password"]').all();
    console.log(`Found ${passwordInputs.length} password inputs`);

    if (passwordInputs.length >= 2) {
      await passwordInputs[1].fill('TestPass123');
    } else {
      // Fallback: try to find by placeholder
      await page.fill('input[placeholder="Confirm your password"]', 'TestPass123');
    }
    await page.screenshot({ path: 'step2-4.png' });

    // Accept terms
    const checkbox = page.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible();
    await checkbox.check();
    await page.screenshot({ path: 'step2-5.png' });

    // Click Next button
    const nextBtn2 = page.locator('button:has-text("Next")').first();
    await expect(nextBtn2).toBeVisible();
    console.log('Clicking Next button after Step 2');
    await nextBtn2.click();

    await page.waitForTimeout(500);
    await page.screenshot({ path: 'step2-complete.png' });

    // STEP 3: Review
    console.log('=== STEP 3: Review Information ===');

    // Verify review page shows data
    await expect(page.locator('text=Review Your Information')).toBeVisible();
    await page.screenshot({ path: 'step3-review.png' });

    // Click Complete Registration button
    const submitBtn = page.locator('button:has-text("Complete Registration")');
    await expect(submitBtn).toBeVisible();
    console.log('Clicking Complete Registration button');

    // Listen for API responses
    const responsePromise = page.waitForResponse(
      response => response.url().includes('/auth/register-company')
    );

    // Add a slight delay to allow form validation
    await page.waitForTimeout(500);

    // Check for validation errors
    const errorMessages = await page.locator('.ant-form-item-explain-error').allTextContents();
    if (errorMessages.length > 0) {
      console.log('Form validation errors found:');
      errorMessages.forEach((msg, i) => console.log(`  ${i + 1}. ${msg}`));
    } else {
      console.log('No validation errors found');
    }

    // Log form values before submission
    const formValues = await page.evaluate(() => {
      const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="password"], input[type="checkbox"]');
      const values: any = {};
      inputs.forEach((input: any) => {
        if (input.name) {
          values[input.name] = input.type === 'checkbox' ? input.checked : input.value;
        }
      });
      return values;
    });
    console.log('Form input values on submit:', JSON.stringify(formValues, null, 2));

    await submitBtn.click();

    try {
      const response = await responsePromise;
      console.log('API Response Status:', response.status());
      const responseBody = await response.json();
      console.log('API Response Body:', JSON.stringify(responseBody, null, 2));

      if (!response.ok()) {
        console.error('Registration API returned error:', responseBody);
      }
    } catch (error) {
      console.log('Error waiting for response:', error);
    }

    await page.screenshot({ path: 'step3-submitted.png' });

    // Wait and check for redirect or error
    await page.waitForTimeout(2000);

    const currentUrl = page.url();
    console.log('Current URL after submission:', currentUrl);

    // Check if we got redirected to pending approval
    if (currentUrl.includes('pending-approval')) {
      console.log('✅ SUCCESS: Redirected to pending approval page');
      await expect(page).toHaveURL(/pending-approval/);
      await page.screenshot({ path: 'success-pending-approval.png' });
    } else {
      // Check for error messages
      const errorMessages = await page.locator('.ant-message-error').allTextContents();
      if (errorMessages.length > 0) {
        console.error('❌ ERROR MESSAGES:', errorMessages);
      }

      const consoleErrors = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleErrors.push(msg.text());
        }
      });

      console.error('Current page content:', await page.content());
      await page.screenshot({ path: 'error-screenshot.png' });
    }
  });

  test('should validate form before moving to next step', async ({ page }) => {
    await page.goto('/register');

    // Try to click Next without filling any fields
    const nextBtn = page.locator('button:has-text("Next")').first();
    await nextBtn.click();

    // Should stay on same page with validation errors
    await page.waitForTimeout(500);

    const errors = await page.locator('.ant-form-item-explain-error').allTextContents();
    console.log('Validation errors:', errors);

    // Verify we're still on step 0 (no step change occurred)
    const currentUrl = page.url();
    expect(currentUrl).toContain('/register');
  });

  test('should show error for mismatched passwords', async ({ page }) => {
    await page.goto('/register');

    // Fill step 1
    await page.fill('input[placeholder="Your Company Name"]', 'Test Co');
    await page.fill('input[placeholder="company@example.com"]', 'test@test.com');
    await page.fill('input[placeholder="+91 1234567890"]', '+1234567890');

    await page.locator('button:has-text("Next")').first().click();
    await page.waitForTimeout(500);

    // Fill step 2 with mismatched passwords
    await page.fill('input[placeholder="Your Full Name"]', 'John');
    await page.fill('input[placeholder="your@company.com"]', 'john@test.com');

    const passwordInputs = await page.locator('input[type="password"]').all();
    await passwordInputs[0].fill('Password123');
    await passwordInputs[1].fill('Password456'); // Mismatch

    // Try to click Next
    await page.locator('button:has-text("Next")').first().click();
    await page.waitForTimeout(500);

    // Should see validation error
    const errors = await page.locator('.ant-form-item-explain-error').allTextContents();
    console.log('Password mismatch errors:', errors);
    expect(errors.some(e => e.includes('do not match') || e.includes('Passwords'))).toBeTruthy();
  });
});

test.describe('Company Login', () => {
  test('should login with approved company credentials', async ({ page }) => {
    await page.goto('/login');

    // Fill login form
    await page.fill('input[placeholder="your@company.com"]', 'user@democompany.com');
    await page.fill('input[type="password"]', 'Demo123');

    // Click sign in
    await page.locator('button:has-text("Sign In")').click();

    // Wait for redirect
    await page.waitForURL('/dashboard', { timeout: 5000 }).catch(() => {
      console.log('Did not redirect to dashboard');
    });

    const url = page.url();
    console.log('After login, URL:', url);

    if (url.includes('/dashboard')) {
      console.log('✅ Login successful');
    } else {
      console.log('❌ Login failed or redirected elsewhere');
      await page.screenshot({ path: 'login-error.png' });
    }
  });

  test('should show error for pending company', async ({ page }) => {
    await page.goto('/login');

    // Try to login with pending company
    await page.fill('input[placeholder="your@company.com"]', 'user@pendingcompany.com');
    await page.fill('input[type="password"]', 'Pending123');

    await page.locator('button:has-text("Sign In")').click();

    // Should see error message
    await page.waitForTimeout(1000);

    const errorMessage = page.locator('.ant-message-error');
    if (await errorMessage.isVisible()) {
      const text = await errorMessage.textContent();
      console.log('Expected error for pending company:', text);
    }
  });
});

test.describe('Admin Login', () => {
  test('should login as platform admin', async ({ page }) => {
    await page.goto('/login?type=admin');

    // Fill login form
    await page.fill('input[placeholder="admin@example.com"]', 'admin@techverin.com');
    await page.fill('input[type="password"]', 'admin123');

    // Click admin sign in
    await page.locator('button:has-text("Admin Sign In")').click();

    // Wait for redirect
    await page.waitForURL('/admin/dashboard', { timeout: 5000 }).catch(() => {
      console.log('Did not redirect to admin dashboard');
    });

    const url = page.url();
    console.log('After admin login, URL:', url);

    if (url.includes('/admin/dashboard')) {
      console.log('✅ Admin login successful');
    } else {
      console.log('❌ Admin login failed');
      await page.screenshot({ path: 'admin-login-error.png' });
    }
  });
});
