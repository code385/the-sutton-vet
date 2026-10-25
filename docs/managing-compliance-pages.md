# Managing footer policies in Sanity

## Add a compliance page

1. Open Legal Page in the Studio and create a document.
2. Enter its Title and choose Additional Compliance Page as the Page Type.
3. Click Generate beside Slug. For example, `complaints-policy` creates `/legal/complaints-policy`.
4. Add the introduction in Description, then add Sections with a heading and Body Paragraphs.
5. Publish the document and open its website address to check the content.
6. Open Site Settings > Legal Links and add an item with the link label and the address, for example `/legal/complaints-policy`.
7. Drag the link into the desired position and publish Site Settings.
8. Refresh the website to check the footer and follow the new link.

Once this feature is deployed, new pages and footer links do not require a code deployment.
Only published content appears on the website. Keep the slug unchanged after sharing a page,
or update its footer link if you change it.

## Existing policies

Keep the existing Page Type for Privacy Policy, Cookie Policy, Accessibility Statement, and
Terms of Business. Their addresses remain `/privacy-policy`, `/cookie-policy`, `/accessibility`,
and `/terms`. The footer uses one Terms of Business link.

To remove a custom policy, remove its Legal Links entry and publish Site Settings first,
then unpublish the page. An unpublished or unknown custom page returns a 404.

## Deployment

Deploy the updated website and Sanity Studio before using Additional Compliance Page.
Do not run `seed:cms` to apply this feature: the client's migrated content must be preserved.
