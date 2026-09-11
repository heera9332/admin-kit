import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleProxy = createMiddleware(routing);

export function proxy(request: NextRequest) {
  return handleProxy(request);
}

export default proxy;

export const config = {
  matcher: [
    // Enable a redirect to a matching locale at the root
    "/",

    // Set a cookie to remember the previous locale for
    // all requests that have a locale prefix
    "/(en|hi)/:path*",

    // Enable redirects that add missing locales
    // (e.g. `/dashboard` -> `/en/dashboard`)
    "/((?!api|_next|_vercel|.*\\..*).*)",
  ],
};
