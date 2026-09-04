const repoName = 'explainable-schizophrenia'
const onPages = process.env.GITHUB_ACTIONS === 'true' || process.env.DEPLOY_TARGET === 'gh-pages'
const basePath = onPages ? `/${repoName}` : ''

/** @type {import('next').NextConfig} */
const nextConfig = {
  // When serving on GitHub Pages the site is hosted at /<repo>/
  basePath,
  assetPrefix: basePath,
  env: {
    // Raw <img src="/images/..."> tags do not pick up basePath automatically
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  // Export static HTML with trailing slashes so paths resolve consistently
  trailingSlash: true,
  // Allow using static exported images without Next.js image optimization
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
