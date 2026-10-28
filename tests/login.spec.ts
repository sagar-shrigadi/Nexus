import { config } from "dotenv";
config({ path: ".env.local" });
import {test, expect} from '@playwright/test';

test.describe.configure({ mode: 'default' });
test.beforeEach(async ({page}) => {
    // base url configured in playwright config file
    await page.goto('');

    // redirected to login page
    await expect(page.getByText('Login to your account', {exact:true})).toBeVisible();
})

test('logging in using guest account', async ({page}) => {
await page.getByRole('button', {name: /try a guest account/i}).click()

await expect(page).toHaveURL('')
// with following elements in its navbar with links to appropriate links
await expect(page.getByRole('link', {name: 'Home'})).toBeVisible();
await expect(page.getByRole('link', {name: 'Home'})).toHaveAttribute('href', '/');

await expect(page.getByRole('link', {name: 'Explore'})).toBeVisible();
await expect(page.getByRole('link', {name: 'Explore'})).toHaveAttribute('href', '/explore');
});
test('navigate to sign up page', async ({page}) => {
    const signUpLink = page.getByRole('link', {name: 'Sign Up'});
    await expect(signUpLink).toBeVisible();
    await expect(signUpLink).toHaveAttribute('href', '/signup');
    await signUpLink.click();

    await expect(page.getByText('Create an account', {exact:true})).toBeVisible();
    await expect(page.getByText('Enter your information below to create your account')).toBeVisible();
    await expect(page).toHaveURL(/signup/)
});
test('log out', async ({page}) => {
    await page.getByRole('button', {name: /try a guest account/i}).click();

    await expect(page).toHaveURL('');

    await page.getByTestId('userOptions').click();
    await page.getByRole('button', {name: 'Sign Out'}).click();

    await expect(page).toHaveURL(/login/)
})
test('logging in via credentials', async ({page}) => {
    await page.getByLabel('Username').fill(process.env.GUEST_USERNAME!);
    await page.getByLabel('Password').fill(process.env.GUEST_PASSWORD!);

    await page.getByRole('button', {name: /login/i}).click();
    
    // for successful login, expect to be redirected to home page
    await expect(page).toHaveURL('');

    // with following elements in its navbar with links to appropriate links
    await expect(page.getByRole('link', {name: 'Home'})).toBeVisible();
    await expect(page.getByRole('link', {name: 'Home'})).toHaveAttribute('href', '/');
    
    await expect(page.getByRole('link', {name: 'Explore'})).toBeVisible();
    await expect(page.getByRole('link', {name: 'Explore'})).toHaveAttribute('href', '/explore');
})
test('errors out for invalid credentials', async ({page}) => {
    await page.getByLabel('Username').fill(process.env.GUEST_USERNAME!);
    await page.getByLabel('Password').fill('some_Incorrect_Password8924');

    await page.getByRole('button', {name: /login/i}).click();

    await expect(page.getByTestId('loginError')).toHaveText(/invalid credentials/i)
    // user is still on login page
    await expect(page).toHaveURL(/login/)
})
