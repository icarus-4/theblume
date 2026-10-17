#!/usr/bin/env bash
# Upload dist/ to the website S3 bucket and refresh CloudFront.
# Used by .github/workflows/deploy.yml; can also be run locally after
# `npm run build` with AWS credentials for the AWS account that hosts the site.
set -euo pipefail
: "${S3_BUCKET:?set S3_BUCKET}" "${CF_DISTRIBUTION_ID:?set CF_DISTRIBUTION_ID}"

# Fingerprinted assets never change, so cache them for a year. Upload them
# first so new pages never reference a file that isn't there yet. Old
# assets are kept so cached pages from the previous deploy still work.
aws s3 sync dist/assets "s3://${S3_BUCKET}/assets" \
  --cache-control "public, max-age=31536000, immutable"

# Pages, sitemap, robots.txt, llms.txt and images: always revalidate.
aws s3 sync dist "s3://${S3_BUCKET}" --delete --exclude "assets/*" \
  --cache-control "public, max-age=0, must-revalidate"

aws cloudfront create-invalidation --distribution-id "${CF_DISTRIBUTION_ID}" --paths "/*" \
  --query "Invalidation.Id" --output text
