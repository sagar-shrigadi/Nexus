import { config } from "dotenv";
config({ path: ".env.local" });
import {test, expect} from '@playwright/test';
import { faker } from "@faker-js/faker";

test.beforeEach(async ({page}) => {
    await page.goto('');
    await page.getByRole('link', {name: 'Sign Up'}).click();
})
test('navigate to login page', async ({page}) => {
    const linkToSignInPage = page.getByRole('link', {name: 'Sign in'});
    await expect(linkToSignInPage).toBeVisible();
    await expect(linkToSignInPage).toHaveAttribute('href', '/login');
    await linkToSignInPage.click();

    await expect(page.getByText('Login to your account', {exact:true})).toBeVisible();
    await expect(page.getByText('Enter your username below to login to your account')).toBeVisible();
    await expect(page).toHaveURL(/login/);
});
test('after successfully signing up, redirects to login page', async ({page}) => {
    const firstname = faker.person.firstName();
    const lastName = faker.person.lastName();
    await page.getByLabel('First Name').fill(firstname);
    await page.getByLabel('Last Name').fill(lastName);
    await page.getByLabel('Username').fill(faker.internet.username({firstName:firstname, lastName:lastName}));
    await page.getByLabel('Password').fill(faker.string.alphanumeric({length: {min:8, max:12}}));

    await page.getByRole('button', {name: 'Sign up'}).click();

    // after signing up, redirect to login page
    await expect(page).toHaveURL(/login/);
});
test.describe('failed sign up attempts', () => {
    test('errors when a username already exists', async ({page}) => {
        await page.getByLabel('First Name').fill(faker.person.firstName());
        await page.getByLabel('Last Name').fill(faker.person.lastName());

        await page.getByLabel('Username').fill(process.env.GUEST_USERNAME!);
        await page.getByLabel('Password').fill(faker.string.alphanumeric({length: {min:8, max:12}}));

        await page.getByRole('button', {name: 'Sign up'}).click();

        // to still be at signup page
        await expect(page).toHaveURL(/signup/);
        await expect(page.getByTestId('signUpError')).toHaveText('Database error: Failed to create your account. Please Try again!');
    })
    test.describe('validation errors', () => {
        test('no firstname and lastname provided', async ({page}) => {
            await page.getByLabel('First Name').fill(' ');
            await page.getByLabel('Last Name').fill(' ');

            await page.getByLabel('Username').fill(process.env.GUEST_USERNAME!);
            await page.getByLabel('Password').fill(faker.string.alphanumeric({length: {min:8, max:12}}));

            await page.getByRole('button', {name: 'Sign up'}).click();

            // still be on signup page
            await expect(page).toHaveURL(/signup/);
            await expect(page.getByTestId('signUpFirstNameError')).toHaveText('First name is required.');
            await expect(page.getByTestId('signUpLastNameError')).toHaveText('Last name is required.');
            await expect(page.getByTestId('signUpError')).toHaveText('Missing or invalid fields. Failed to register.');
        });
        test('errors when firstname, lastname, username, password exceeds max lengths', async ({page}) => {
            await page.getByLabel('First Name').fill('f'.repeat(51));
            await page.getByLabel('Last Name').fill('l'.repeat(51));
            await page.getByLabel('Username').fill('u'.repeat(31));
            await page.getByLabel('Password').fill('p'.repeat(73));

            await page.getByRole('button', {name: 'Sign up'}).click();

            // still be on signup page
            await expect(page).toHaveURL(/signup/);
            await expect(page.getByTestId('signUpFirstNameError')).toHaveText('First name is too long.');
            await expect(page.getByTestId('signUpLastNameError')).toHaveText('Last name is too long.');
            await expect(page.getByTestId('signUpUsernameError')).toHaveText('Username is too long.');
            await expect(page.getByTestId('signUpPasswordError')).toHaveText('Password is too long.');

            await expect(page.getByTestId('signUpError')).toHaveText('Missing or invalid fields. Failed to register.');
        });
    });
});