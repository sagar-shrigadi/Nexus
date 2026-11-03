import {test, expect} from '@playwright/test';

test('successfully CRUD and like comments', async ({page}) => {
    // login to move to home page
    await page.goto('');
    await page.getByRole('button', {name: /try a guest account/i}).click();

    /* Create and Navigate to the post's page */
    const postTitle = `Post-${ Date.now() }-${ Math.random().toString(36).slice(0, 8) }`;
    const postContent = `Post Content-${ Date.now() }-${Math.random().toString(36) }`;
    await page.getByPlaceholder('Title').fill(postTitle);
    await page.getByPlaceholder("What's Happening?").fill(postContent);
    await page.getByRole('button', { name:'Post', exact: true }).click();
    await page.getByText(postTitle).click();

    /* Create Comment */
    const commentContent = `Comment Content-${ Date.now()}-${Math.random().toString(36) }`;
    await page.getByPlaceholder('Add a comment').fill(commentContent);
    await page.getByRole('button', { name:'Comment', exact: true }).click();
    // Comment appears in feed
    await expect(page.getByText(commentContent)).toBeVisible();

    /* Like Comment */
    // like count isnt visible at first
    await expect(page.getByTestId('commentLikeCount')).not.toBeVisible();
    // like the comment
    await page.getByRole('button', { name:'Like comment' }).click();
    // like count is incremented
    await expect(page.getByTestId('commentLikeCount')).toHaveText('1');
    // unlike comment
    await page.getByRole('button', { name:'Unlike comment' }).click();
    // like count is decremented
    await expect(page.getByTestId('commentLikeCount')).not.toBeVisible();

    /* Edit Comment */
    await page.getByRole('button', { name: 'Open user actions for comments' }).click();
    await page.getByRole('menuitem', { name: 'Edit' }).click();
    await page.getByText(commentContent).fill(commentContent + ' edited');
    await page.getByRole('button', { name: 'Update', exact: true }).click();
    await expect(page.getByText(commentContent + ' edited')).toBeVisible();

    /* Delete Comment */
    await page.getByRole('button', { name: 'Open user actions for comments' }).click();
    await page.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByText(commentContent)).not.toBeVisible();

    // comment counts for the post increases as comments are added to the post
    await expect(page.getByTestId('postCommentCount')).not.toBeVisible();
    // create comment
    await page.getByPlaceholder('Add a comment').fill(`Content-${ Date.now()}-${Math.random().toString(36) }`);
    await page.getByRole('button', { name:'Comment', exact: true }).click();
    // comment count increases
    await expect(page.getByTestId('postCommentCount')).toHaveText('1');
    // create another comment
    await page.getByPlaceholder('Add a comment').fill(`Content-${ Date.now()}-${Math.random().toString(36) }`);
    await page.getByRole('button', { name:'Comment', exact: true }).click();
    // comment count increases to 2
    await expect(page.getByTestId('postCommentCount')).toHaveText('2');
    // delete first comment
    await page.getByRole('button', { name: 'Open user actions for comments' }).first().click();
    await page.getByRole('button', { name: 'Delete' }).click();
    // comment count decrements by 1
    await expect(page.getByTestId('postCommentCount')).toHaveText('1');

    // finally delete the post
    await page.getByRole('button', {name: 'Open user actions for post'}).click();
    await page.getByRole('button', {name: 'Delete'}).click();
    await page.waitForURL('');
})