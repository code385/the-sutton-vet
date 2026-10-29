# Managing Client Reviews

After the website and Studio updates are deployed:

1. Open the client Sanity Studio and select **Client Review**.
2. Create a document. Enter the reviewer's public display name and review text.
3. Optionally add the original rating (1-5), source and review date. No rating is shown if left blank.
4. Keep **Show On Website** enabled. Select **Prioritise On Homepage** for reviews you want displayed first.
5. Set **Display Order** if needed; lower numbers appear first. Publish.

The bottom of the homepage shows up to three visible reviews, prioritising featured reviews and filling remaining spaces with other reviews. The **Read all reviews** link opens `/reviews`, where all visible published reviews appear. **About > Client Reviews** and **Footer > Resources > Client Reviews** also open this page, including when no reviews are published. Within each priority group, display order comes first, then review date (newest first).

To edit, update the document and publish again. To hide a review, turn off **Show On Website** and publish, or unpublish the document. Drafts are never displayed. Published updates appear on the next page load without a redeploy.

If there are no visible reviews, the entire homepage section and its link are hidden. Direct visits to `/reviews` show a friendly empty message, and the empty page requests no indexing. A temporary CMS fetch failure also hides reviews rather than showing invented fallback content.

Only publish genuine feedback with permission to share the review and display name. Do not add private contact information or medical details. These are manually managed text reviews, not an automatic Google or social-media feed. No sample reviews are added to the live dataset.
