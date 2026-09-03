const repoName = 'explainable-schizophrenia'
const onPages = process.env.GITHUB_ACTIONS === 'true' || process.env.NEXT_PUBLIC_BASE_PATH === 'gh-pages'

/** @type {import('next').NextConfig} */
const nextConfig = {
  // When serving on GitHub Pages the site is hosted at /<repo>/
  basePath: onPages ? `/${repoName}` : '',
  assetPrefix: onPages ? `/${repoName}` : '',
  // Export static HTML with trailing slashes so paths resolve consistently
  trailingSlash: true,
  // Allow using static exported images without Next.js image optimization
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
