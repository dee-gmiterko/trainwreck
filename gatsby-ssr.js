/**
 * Implement Gatsby's SSR (Server Side Rendering) APIs in this file.
 *
 * See: https://www.gatsbyjs.com/docs/ssr-apis/
 **/

if (typeof window === "undefined") {
  global.window = {
    innerWidth: 1920,
    innerHeight: 900,
  }
}
