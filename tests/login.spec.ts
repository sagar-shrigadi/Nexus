import { config } from "dotenv";
config({ path: ".env.local" });
import {test, expect} from '@playwright/test';

test.beforeEach(async ({page}) => {
    // base url configured in playwright config file
    await page.goto('');

    // redirected to login page
    await expect(page.getByText('Login to your account', {exact:true})).toBeVisible();
})

test('via guest account', async ({page}) => {
    // logging in
    await page.getByRole('button', {name: /try a guest account/i}).click()

    // after successful login, be redirected to home page
    await page.waitForURL('http://localhost:3000');
    // with following elements in its navbar with links to appropriate links
    const homeLinkInNavbar = page.getByRole('link', {name: 'Home'});
    await expect(homeLinkInNavbar).toBeVisible();
    await expect(homeLinkInNavbar).toHaveAttribute('href', '/');
    
    const exploreLinkInNavbar = page.getByRole('link', {name: 'Explore'});
    await expect(exploreLinkInNavbar).toBeVisible();
    await expect(exploreLinkInNavbar).toHaveAttribute('href', '/explore');

    /* Log Out */
    await page.getByTestId('userOptions').click();
    await page.getByRole('button', {name: 'Sign Out'}).click();
    // redirected to login page
    await expect(page).toHaveURL(/login/);
});
test('via credentials', async ({page}) => {
    /* logging in */
    await page.getByLabel('Username').fill(process.env.GUEST_USERNAME!);
    await page.getByLabel('Password').fill(process.env.GUEST_PASSWORD!);
    await page.getByRole('button', {name: /login/i}).click();
    
    // after successful login, be redirected to home page
    await page.waitForURL('http://localhost:3000');
    // with following elements in its navbar with links to appropriate links
    const homeLinkInNavbar = page.getByRole('link', {name: 'Home'});
    await expect(homeLinkInNavbar).toBeVisible();
    await expect(homeLinkInNavbar).toHaveAttribute('href', '/');

    const exploreLinkInNavbar = page.getByRole('link', {name: 'Explore'});
    await expect(exploreLinkInNavbar).toBeVisible();
    await expect(exploreLinkInNavbar).toHaveAttribute('href', '/explore');

    /* Log Out */
    await page.getByTestId('userOptions').click();
    await page.getByRole('button', {name: 'Sign Out'}).click();
    // redirected to login page
    await expect(page).toHaveURL(/login/);
})
test('navigate to sign up page', async ({page}) => {
    const signUpLink = page.getByRole('link', {name: 'Sign Up'});
    await expect(signUpLink).toBeVisible();
    await expect(signUpLink).toHaveAttribute('href', '/signup');
    await signUpLink.click();

    await page.waitForURL('http://localhost:3000/signup');
    await expect(page.getByText('Create an account', {exact:true})).toBeVisible();  
    await expect(page.getByText('Enter your information below to create your account')).toBeVisible();
});
test('errors out for invalid credentials', async ({page}) => {
    await page.getByLabel('Username').fill(process.env.GUEST_USERNAME!);
    await page.getByLabel('Password').fill('some_Incorrect_Password8924');

    await page.getByRole('button', {name: /login/i}).click();

    await expect(page.getByTestId('loginError')).toHaveText(/invalid credentials/i);
    // user is still on login page
    await expect(page).toHaveURL(/login/);
})
