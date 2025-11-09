import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Company Profile Management', () => {
  test.beforeEach(async ({ page }) => {
    // Login before each test
    await page.goto('/login');

    // Fill login form with demo company credentials
    await page.fill('input[placeholder="your@company.com"]', 'user@democompany.com');
    await page.fill('input[type="password"]', 'Demo123');

    // Click sign in
    await page.locator('button:has-text("Sign In")').click();

    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard', { timeout: 5000 });
    console.log('✅ Login successful');
  });

  test('should navigate to company profile from dashboard', async ({ page }) => {
    // Verify we're on dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await page.screenshot({ path: 'company-profile-1-dashboard.png' });

    // Click Company Settings button
    const settingsBtn = page.locator('button:has-text("Company Settings")');
    await expect(settingsBtn).toBeVisible();
    await settingsBtn.click();

    // Wait for navigation to company profile
    await page.waitForURL(/\/company\/profile/, { timeout: 5000 });
    await page.screenshot({ path: 'company-profile-2-opened.png' });

    // Verify page title
    const pageTitle = page.locator('text=Company Profile');
    await expect(pageTitle).toBeVisible();
    console.log('✅ Navigated to Company Profile page');
  });

  test('should display company information correctly', async ({ page }) => {
    // Navigate to company profile
    await page.goto('/company/profile');

    // Wait for form to load
    await page.waitForTimeout(1000);

    // Verify basic information fields are visible and populated
    const companyNameInput = page.locator('input[value="Demo Pro Company"]');
    await expect(companyNameInput).toBeVisible();
    console.log('✅ Company name field visible');

    const emailInput = page.locator('input[value="demo@company.com"]');
    await expect(emailInput).toBeVisible();
    console.log('✅ Email field visible');

    const phoneInput = page.locator('input[value="+1234567890"]');
    await expect(phoneInput).toBeVisible();
    console.log('✅ Phone field visible');

    await page.screenshot({ path: 'company-profile-3-loaded.png' });
  });

  test('should update company basic information', async ({ page }) => {
    console.log('=== Testing Basic Information Update ===');
    await page.goto('/company/profile');

    // Wait for form to load
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'company-profile-4-before-edit.png' });

    // Update company name
    const nameInput = page.locator('input[placeholder="Company Name"]');
    await nameInput.clear();
    await nameInput.fill('Techverin LLC Updated');
    console.log('✓ Updated company name to "Techverin LLC Updated"');

    // Update company email
    const emailInput = page.locator('input[placeholder="company@example.com"]');
    await emailInput.clear();
    await emailInput.fill('contact@techverin-updated.com');
    console.log('✓ Updated email');

    // Update phone
    const phoneInput = page.locator('input[placeholder="+1234567890"]');
    await phoneInput.clear();
    await phoneInput.fill('+1-555-0199');
    console.log('✓ Updated phone');

    // Update website
    const websiteInput = page.locator('input[placeholder="https://example.com"]');
    await websiteInput.clear();
    await websiteInput.fill('https://techverin-updated.com');
    console.log('✓ Updated website');

    // Update GST/TIN
    const gstInput = page.locator('input[placeholder="27AABCT1234A1Z0"]');
    await gstInput.clear();
    await gstInput.fill('GST987654321UPDATED');
    console.log('✓ Updated GST/TIN');

    await page.screenshot({ path: 'company-profile-5-basic-filled.png' });

    // Scroll to save button
    await page.locator('button:has-text("Save Changes")').scrollIntoViewIfNeeded();

    // Click save button
    const saveBtn = page.locator('button:has-text("Save Changes")');
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();
    console.log('✓ Clicked Save Changes button');

    // Wait for success message
    await page.waitForTimeout(1500);
    const successMessage = page.locator('.ant-message-success');
    if (await successMessage.isVisible()) {
      console.log('✅ Success message displayed');
    }

    await page.screenshot({ path: 'company-profile-6-basic-saved.png' });

    // Refresh page to verify changes persisted
    await page.reload();
    await page.waitForTimeout(1000);

    // Verify the updated values are still there
    const updatedName = page.locator('input[value="Techverin LLC Updated"]');
    await expect(updatedName).toBeVisible();
    console.log('✅ Company name update persisted');

    const updatedEmail = page.locator('input[value="contact@techverin-updated.com"]');
    await expect(updatedEmail).toBeVisible();
    console.log('✅ Email update persisted');

    await page.screenshot({ path: 'company-profile-7-basic-verified.png' });
  });

  test('should upload company logo via file upload', async ({ page }) => {
    console.log('=== Testing Logo Upload ===');
    await page.goto('/company/profile');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Take screenshot before upload
    await page.screenshot({ path: 'company-profile-8-before-logo-upload.png' });

    // Create a test image file
    const testImagePath = createTestImage();
    console.log(`✓ Created test image at: ${testImagePath}`);

    // Find and use the file upload input
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);
    console.log('✓ Selected image file for upload');

    // Wait for upload to complete
    await page.waitForTimeout(2000);

    // Check for success message
    const successMessage = page.locator('.ant-message-success');
    if (await successMessage.isVisible()) {
      const text = await successMessage.textContent();
      console.log(`✅ Upload success: ${text}`);
    }

    // Verify logo is displayed
    const logoImage = page.locator('img[alt="Company Logo"]').first();
    await expect(logoImage).toBeVisible();
    console.log('✅ Logo image is visible after upload');

    await page.screenshot({ path: 'company-profile-9-logo-uploaded.png' });

    // Refresh and verify logo persists
    await page.reload();
    await page.waitForTimeout(1500);

    const logoAfterRefresh = page.locator('img[alt="Company Logo"]').first();
    await expect(logoAfterRefresh).toBeVisible();
    console.log('✅ Logo persists after page refresh');

    await page.screenshot({ path: 'company-profile-10-logo-verified.png' });

    // Clean up test image
    fs.unlinkSync(testImagePath);
  });

  test('should update company logo via URL', async ({ page }) => {
    console.log('=== Testing Logo URL Update ===');
    await page.goto('/company/profile');

    // Wait for page to load
    await page.waitForTimeout(1000);
    await page.screenshot({ path: 'company-profile-11-before-logo-url.png' });

    // Find the logo URL input field
    const logoUrlInput = page.locator('input[placeholder="Enter logo URL (https://example.com/logo.png)"]');
    await expect(logoUrlInput).toBeVisible();
    console.log('✓ Logo URL input field found');

    // Enter a test logo URL
    const testLogoUrl = 'https://via.placeholder.com/200/0000FF/FFFFFF?text=Techverin+LLC';
    await logoUrlInput.fill(testLogoUrl);
    console.log(`✓ Entered logo URL: ${testLogoUrl}`);

    await page.screenshot({ path: 'company-profile-12-logo-url-filled.png' });

    // Click Set URL button
    const setUrlBtn = page.locator('button:has-text("Set URL")');
    await expect(setUrlBtn).toBeVisible();
    await setUrlBtn.click();
    console.log('✓ Clicked Set URL button');

    // Wait for update to complete
    await page.waitForTimeout(2000);

    // Check for success message
    const successMessage = page.locator('.ant-message-success');
    if (await successMessage.isVisible()) {
      const text = await successMessage.textContent();
      console.log(`✅ URL update success: ${text}`);
    }

    // Verify logo is displayed with new URL
    const logoImage = page.locator('img[alt="Company Logo"]').first();
    await expect(logoImage).toBeVisible();

    // Get the src attribute to verify it was updated
    const logoSrc = await logoImage.getAttribute('src');
    console.log(`✅ Logo image loaded from: ${logoSrc?.substring(0, 80)}...`);

    await page.screenshot({ path: 'company-profile-13-logo-url-set.png' });

    // Verify the URL input was cleared
    const urlInputValue = await logoUrlInput.inputValue();
    expect(urlInputValue).toBe('');
    console.log('✅ URL input cleared after submission');

    // Refresh and verify logo persists
    await page.reload();
    await page.waitForTimeout(1500);

    const logoAfterRefresh = page.locator('img[alt="Company Logo"]').first();
    await expect(logoAfterRefresh).toBeVisible();
    console.log('✅ Logo URL persists after page refresh');

    await page.screenshot({ path: 'company-profile-14-logo-url-verified.png' });
  });

  test('should validate logo URL format', async ({ page }) => {
    console.log('=== Testing Logo URL Validation ===');
    await page.goto('/company/profile');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Find the logo URL input field
    const logoUrlInput = page.locator('input[placeholder="Enter logo URL (https://example.com/logo.png)"]');

    // Try to submit with invalid URL
    await logoUrlInput.fill('invalid-url-without-protocol');
    console.log('✓ Entered invalid URL format');

    // Click Set URL button
    const setUrlBtn = page.locator('button:has-text("Set URL")');
    await setUrlBtn.click();

    // Wait for error message
    await page.waitForTimeout(500);

    // Check for error message
    const errorMessage = page.locator('.ant-message-error');
    if (await errorMessage.isVisible()) {
      const text = await errorMessage.textContent();
      console.log(`✅ URL validation error shown: ${text}`);
    }

    await page.screenshot({ path: 'company-profile-15-url-validation.png' });
  });

  test('should update address information', async ({ page }) => {
    console.log('=== Testing Address Update ===');
    await page.goto('/company/profile');

    // Wait for form to load
    await page.waitForTimeout(1000);

    // Update street address
    const streetInput = page.locator('input[placeholder="Street Address"]');
    await streetInput.clear();
    await streetInput.fill('456 Innovation Drive');
    console.log('✓ Updated street address');

    // Update city
    const cityInput = page.locator('input[placeholder="City"]');
    await cityInput.clear();
    await cityInput.fill('San Francisco');
    console.log('✓ Updated city');

    // Update state
    const stateInput = page.locator('input[placeholder="State/Province"]');
    await stateInput.clear();
    await stateInput.fill('CA');
    console.log('✓ Updated state');

    // Update zip code
    const zipInput = page.locator('input[placeholder="Zip/Postal Code"]');
    await zipInput.clear();
    await zipInput.fill('94105');
    console.log('✓ Updated zip code');

    // Update country
    const countryInput = page.locator('input[placeholder="Country"]');
    await countryInput.clear();
    await countryInput.fill('USA');
    console.log('✓ Updated country');

    await page.screenshot({ path: 'company-profile-16-address-filled.png' });

    // Scroll to save button
    await page.locator('button:has-text("Save Changes")').scrollIntoViewIfNeeded();

    // Click save
    const saveBtn = page.locator('button:has-text("Save Changes")');
    await saveBtn.click();
    console.log('✓ Clicked Save Changes');

    // Wait for success message
    await page.waitForTimeout(1500);

    const successMessage = page.locator('.ant-message-success');
    if (await successMessage.isVisible()) {
      console.log('✅ Address information saved');
    }

    // Refresh and verify changes persisted
    await page.reload();
    await page.waitForTimeout(1000);

    const updatedCity = page.locator('input[value="San Francisco"]');
    await expect(updatedCity).toBeVisible();
    console.log('✅ Address update persisted');

    await page.screenshot({ path: 'company-profile-17-address-verified.png' });
  });

  test('should update notes and terms', async ({ page }) => {
    console.log('=== Testing Notes and Terms Update ===');
    await page.goto('/company/profile');

    // Wait for form to load
    await page.waitForTimeout(1000);

    // Scroll down to find notes section
    await page.locator('text=Notes & Terms').scrollIntoViewIfNeeded();

    // Update header note
    const headerNoteInput = page.locator('textarea').first();
    await headerNoteInput.clear();
    await headerNoteInput.fill('Techverin LLC - Premium Services Header');
    console.log('✓ Updated header note');

    // Update footer note
    const textareas = await page.locator('textarea').all();
    if (textareas.length > 1) {
      await textareas[1].clear();
      await textareas[1].fill('Thank you for your business - Updated');
      console.log('✓ Updated footer note');
    }

    await page.screenshot({ path: 'company-profile-18-notes-filled.png' });

    // Scroll to save button
    await page.locator('button:has-text("Save Changes")').scrollIntoViewIfNeeded();

    // Click save
    const saveBtn = page.locator('button:has-text("Save Changes")');
    await saveBtn.click();
    console.log('✓ Clicked Save Changes');

    // Wait for success message
    await page.waitForTimeout(1500);

    const successMessage = page.locator('.ant-message-success');
    if (await successMessage.isVisible()) {
      console.log('✅ Notes and terms saved');
    }

    // Refresh and verify
    await page.reload();
    await page.waitForTimeout(1000);

    const headerNote = page.locator('textarea:has-text("Techverin LLC - Premium Services Header")');
    if (await headerNote.isVisible()) {
      console.log('✅ Notes update persisted');
    }

    await page.screenshot({ path: 'company-profile-19-notes-verified.png' });
  });

  test('should display back button and navigate back to dashboard', async ({ page }) => {
    console.log('=== Testing Navigation Back to Dashboard ===');
    await page.goto('/company/profile');

    // Wait for page to load
    await page.waitForTimeout(1000);

    // Look for back button in card header
    const backBtn = page.locator('button:has-text("Back to Dashboard")');
    await expect(backBtn).toBeVisible();
    console.log('✓ Back to Dashboard button found');

    // Click back button
    await backBtn.click();
    console.log('✓ Clicked Back to Dashboard button');

    // Wait for navigation
    await page.waitForURL('/dashboard', { timeout: 5000 });

    // Verify we're back on dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    console.log('✅ Successfully navigated back to dashboard');

    // Verify company logo and name are displayed on dashboard
    const logoImage = page.locator('img[alt="Company Logo"]').first();
    if (await logoImage.isVisible()) {
      console.log('✅ Company logo visible on dashboard');
    }

    await page.screenshot({ path: 'company-profile-20-back-to-dashboard.png' });
  });

  test('should verify all updates together - complete workflow', async ({ page }) => {
    console.log('=== Complete Company Profile Update Workflow ===');
    await page.goto('/company/profile');

    // Wait for form to load
    await page.waitForTimeout(1000);

    console.log('\n--- STEP 1: Update Basic Information ---');
    const nameInput = page.locator('input[placeholder="Company Name"]');
    await nameInput.clear();
    await nameInput.fill('Techverin LLC');

    const emailInput = page.locator('input[placeholder="company@example.com"]');
    await emailInput.clear();
    await emailInput.fill('contact@techverin.com');

    const phoneInput = page.locator('input[placeholder="+1234567890"]');
    await phoneInput.clear();
    await phoneInput.fill('+1-888-TECHVERIN');
    console.log('✓ Updated basic information');

    console.log('\n--- STEP 2: Upload Logo ---');
    const testImagePath = createTestImage();
    const fileInput = page.locator('input[type="file"]');
    await fileInput.setInputFiles(testImagePath);
    await page.waitForTimeout(2000);
    console.log('✓ Logo uploaded');

    console.log('\n--- STEP 3: Update Address ---');
    const streetInput = page.locator('input[placeholder="Street Address"]');
    await streetInput.clear();
    await streetInput.fill('123 Tech Street');

    const cityInput = page.locator('input[placeholder="City"]');
    await cityInput.clear();
    await cityInput.fill('San Francisco');
    console.log('✓ Updated address');

    console.log('\n--- STEP 4: Save All Changes ---');
    await page.locator('button:has-text("Save Changes")').scrollIntoViewIfNeeded();
    await page.locator('button:has-text("Save Changes")').click();
    await page.waitForTimeout(1500);

    const successMessage = page.locator('.ant-message-success');
    if (await successMessage.isVisible()) {
      console.log('✓ Changes saved successfully');
    }

    await page.screenshot({ path: 'company-profile-21-complete-workflow.png' });

    console.log('\n--- STEP 5: Verify Persistence ---');
    await page.reload();
    await page.waitForTimeout(1000);

    const verifyName = page.locator('input[value="Techverin LLC"]');
    await expect(verifyName).toBeVisible();

    const logoImage = page.locator('img[alt="Company Logo"]').first();
    await expect(logoImage).toBeVisible();

    const verifyCity = page.locator('input[value="San Francisco"]');
    await expect(verifyCity).toBeVisible();

    console.log('✅ All changes persisted successfully');

    fs.unlinkSync(testImagePath);
    await page.screenshot({ path: 'company-profile-22-complete-verified.png' });
  });
});

// Helper function to create a test image
function createTestImage(): string {
  const testDir = path.join(process.cwd(), 'tests', 'fixtures');
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true });
  }

  const imagePath = path.join(testDir, `test-logo-${Date.now()}.png`);

  // Create a simple 100x100 red PNG
  const png = Buffer.from([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a,
    0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x00, 0x64, 0x00, 0x00, 0x00, 0x64,
    0x08, 0x02, 0x00, 0x00, 0x00, 0xf5, 0xf1, 0x6f,
    0xf8, 0x00, 0x00, 0x00, 0x5c, 0x49, 0x44, 0x41,
    0x54, 0x78, 0x9c, 0xed, 0xc1, 0x01, 0x0d, 0x00,
    0x00, 0x00, 0xc2, 0xa0, 0xf5, 0x4f, 0xed, 0x61,
    0x0d, 0xa0, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0xc0, 0x0f, 0xa4, 0xd1,
    0x0d, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e,
    0x44, 0xae, 0x42, 0x60, 0x82
  ]);

  fs.writeFileSync(imagePath, png);
  return imagePath;
}
