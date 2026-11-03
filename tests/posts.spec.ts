import {test, expect} from '@playwright/test';

test('successfully CRUD and like posts', async ({page}) => {
    // login to move to home page
    await page.goto('');
    await page.getByRole('button', {name: /try a guest account/i}).click();

    /* Create Post */
    const postTitle = `Post-${Date.now()}-${Math.random().toString(36).slice(0, 8)}`;
    const postContent = `Post Content-${Date.now()}-${Math.random().toString(36)}`;
    await page.getByPlaceholder('Title').fill(postTitle);
    await page.getByPlaceholder("What's Happening?").fill(postContent);
    await page.getByRole('button', {name:'Post', exact: true}).click();
    // post appears in feed
    await expect(page.getByText(postTitle)).toBeVisible();
    await expect(page.getByText(postContent)).toBeVisible();

    /* Read Post */
    // navigate to post's page
    await page.getByText(postTitle).click();
    await expect(page).toHaveURL(/status/i);
    await expect(page.getByRole('heading', {name: 'Post', exact: true})).toBeVisible();
    await expect(page.getByPlaceholder('Add a comment')).toBeVisible();
    await expect(page.getByRole('heading', {name: 'Comments', exact: true})).toBeVisible();

    /* Like Post */
    // like count isnt visible at first
    await expect(page.getByTestId('postLikeCount')).not.toBeVisible();
    // like the post
    await page.getByRole('button', {name:'Like post'}).click();
    // like count is incremented
    await expect(page.getByTestId('postLikeCount')).toHaveText('1');
    // unlike post
    await page.getByRole('button', {name:'Unlike post'}).click();
    // like count is decremented
    await expect(page.getByTestId('postLikeCount')).not.toBeVisible();

    /* Edit Post */
    // navigate to post's edit page
    await page.getByRole('button', { name: 'Open user actions for post' }).click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
    await expect(page).toHaveURL(/edit/);
    await expect(page.getByRole('heading', {name: 'Edit Post', exact: true})).toBeVisible();
    await page.getByLabel('Title').fill(postTitle + ' edited');
    await page.getByLabel('Content').fill(postContent + ' edited');
    await page.getByRole('button', {name: 'Update', exact: true}).click();
    // after edit form submission, redirect back to post page
    await expect(page).not.toHaveURL(/edit/);
    await expect(page.getByText(postTitle + ' edited')).toBeVisible();
    await expect(page.getByText(postContent + ' edited')).toBeVisible();

    /* Delete Post */
    await page.getByRole('button', {name: 'Open user actions for post'}).click();
    await page.getByRole('button', {name: 'Delete'}).click();
    // redirect to home page
    await page.waitForURL('');
    await expect(page.getByText(postTitle + ' edited')).not.toBeVisible();
})