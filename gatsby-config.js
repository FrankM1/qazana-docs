const postcssCustomMedia = require(`postcss-custom-media`)
const autoprefixer = require(`autoprefixer`)
const cssVariables = require(`postcss-css-variables`)
const colorModFunction = require(`postcss-color-mod-function`)
const cssNano = require(`cssnano`)
const customProperties = require(`postcss-custom-properties`)
const easyImport = require(`postcss-easy-import`)
const algoliaQueries = require(`./utils/algolia-queries`)
const path = require(`path`)

require(`dotenv`).config({
    path: `.env.${process.env.NODE_ENV}`,
})

const SERVICE_WORKER_KILL_SWITCH = (process.env.SERVICE_WORKER_KILL_SWITCH === `true`) || false

const plugins = [
    /**
     *  Content Plugins
     */
    {
        resolve: `gatsby-source-filesystem`,
        options: {
            path: path.join(__dirname, `content`),
            name: `markdown-pages`,
        },
    },
    {
        resolve: `gatsby-source-filesystem`,
        options: {
            path: path.join(__dirname, `content/elements`),
            name: `markdown-pages`,
        },
    },
    {
        resolve: `gatsby-source-filesystem`,
        options: {
            path: path.join(__dirname, `content/getting-started`),
            name: `markdown-pages`,
        },
    },
    {
        resolve: `gatsby-source-filesystem`,
        options: {
            path: path.join(__dirname, `content/install`),
            name: `markdown-pages`,
        },
    },
    {
        resolve: `gatsby-source-filesystem`,
        options: {
            path: path.join(__dirname, `content/integrations`),
            name: `markdown-pages`,
        },
    },
    {
        resolve: `gatsby-source-filesystem`,
        options: {
            path: path.join(__dirname, `src`, `images`),
            name: `images`,
        },
    },
    `gatsby-plugin-sharp`,
    `gatsby-transformer-sharp`,
    {
        resolve: `gatsby-transformer-remark`,
        options: {
            plugins: [
                {
                    resolve: `gatsby-remark-images`,
                    options: {
                        sizeByPixelDensity: true,
                        withWebp: true,
                    },
                },
                `gatsby-remark-autolink-headers`,
                `gatsby-remark-code-titles`,
                `gatsby-remark-prismjs`,
                `gatsby-remark-external-links`,
            ],
        },
    },
    `gatsby-transformer-yaml`,
    {
        resolve: `gatsby-source-filesystem`,
        options: {
            path: `./src/data/`,
        },
    },
    `gatsby-plugin-catch-links`,
    /**
     *  Utility Plugins
     */
    {
        resolve: `gatsby-plugin-manifest`,
        options: {
            name: `Qazana Documentation`,
            short_name: `Qazana`,
            start_url: `/`,
            background_color: `#343f44`,
            theme_color: `#343f44`,
            display: `minimal-ui`,
            icon: `static/favicon.png`,
        },
    },
    `gatsby-plugin-react-helmet`,
    {
        resolve: `gatsby-plugin-advanced-sitemap`,
        options: {
            query: `
                {
                allMarkdownRemark{
                    edges {
                        node {
                            id
                            frontmatter {
                                published_at: date
                                feature_image: image
                            }
                            fields {
                                slug
                            }
                        }
                    }
                }
            }`,
            mapping: {
                allMarkdownRemark: {
                    sitemap: `pages`,
                },
            },
            exclude: [
                `/dev-404-page`,
                `/404`,
                `/404.html`,
                `/offline-plugin-app-shell-fallback`,
                `/data-schema`,
                `/data-schema-2`,
                `/v0.11/README`,
                `/README`,
            ],
        },
    },
    `gatsby-plugin-force-trailing-slashes`,
    /**
     *  Display Plugins
     */
    {
        resolve: `gatsby-plugin-postcss`,
        options: {
            postCssPlugins: [
                autoprefixer({ browsers: [`last 2 versions`] }),
                easyImport(),
                cssVariables(),
                colorModFunction(),
                customProperties({ preserve: false }),
                postcssCustomMedia(),
                cssNano({ zindex: false }),
            ],
        },
    },
    {
        resolve: `gatsby-plugin-react-svg`,
        options: {
            rule: {
                include: /icons/,
            },
        },
    },
    {
        resolve: "gatsby-source-wordpress",
        options: {
          baseUrl: "api.qazana.net",
          protocol: "https",
          hostingWPCOM: false,
          verboseOutput: true,
          includedRoutes: [
            "**/categories",
            "**/posts",
            "**/pages",
            "**/media",
            "**/menus",
            "**/faq",
            "**/tutorials",
          ],
        },
      }
]

const runAlgoliaBuild = () => (process.env.INCOMING_HOOK_TITLE && process.env.INCOMING_HOOK_TITLE === `Algolia`) || process.env.ALGOLIA
const hasAlgoliaKey = () => process.env.ALGOLIA_ADMIN_KEY && !process.env.ALGOLIA_ADMIN_KEY.match(/<key>/)

if (runAlgoliaBuild() && hasAlgoliaKey()) {
    plugins.push({
        resolve: `gatsby-plugin-algolia`,
        options: {
            appId: `6RCFK5TOI5`,
            apiKey: `${process.env.ALGOLIA_ADMIN_KEY}`,
            queries: algoliaQueries,
            chunkSize: 10000, // default: 1000
        },
    })
}

// Global switch to either use or remove service worker
if (SERVICE_WORKER_KILL_SWITCH) {
    console.log(`Remove service worker plugin`)
    plugins.push(`gatsby-plugin-remove-serviceworker`)
} else {
    console.log(`Install service worker plugin`)
    plugins.push(`gatsby-plugin-offline`)
}

module.exports = {
    siteMetadata: {
        title: `Qazana Documentation`,
        siteUrl: process.env.SITE_URL || `https://docs.qazana.net`,
        description: `Everything you need to know about working with the Qazana professional publishing platform.`,
    },
    plugins: plugins,
}
