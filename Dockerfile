# ========================
# STAGE 1: Build
# ========================
FROM node:20.11-alpine AS build

# Install build dependencies
RUN apk add --no-cache \
    autoconf \
    automake \
    build-base \
    cairo-dev \
    giflib-dev \
    git \
    libjpeg-turbo-dev \
    libpng-dev \
    pango-dev \
    python3 \
    vips-dev \
    zlib-dev

WORKDIR /app

# Copy dependency files and install
COPY package.json ./

# Copy only necessary files/folders explicitly
COPY next.config.js ./
COPY tsconfig.json ./
COPY .env ./
COPY .eslintrc.js ./
COPY .npmrc ./
COPY .stylelintignore ./
COPY .stylelintrc.js ./
COPY generate-build-version.js ./
COPY jest.config.js ./
COPY jest.setup.js ./
COPY lint-staged.config.js ./
COPY sentry.client.config.ts ./
COPY sentry.edge.config.ts ./
COPY sentry.server.config.ts ./
COPY README.md ./

# Copy folders
COPY __mocks__ ./__mocks__
COPY __specs__ ./__specs__
COPY assets ./assets
COPY components ./components
COPY libraries ./libraries
COPY locale ./locale
COPY pages ./pages
COPY public ./public
COPY redux ./redux
COPY types ./types
COPY utils ./utils

RUN npm install --legacy-peer-deps --ignore-scripts

# Build Next.js (standalone mode)
RUN npm run build

# ========================
# STAGE 2: Production
# ========================
FROM node:20.11-alpine

ENV NODE_ENV=production

# Install runtime dependencies
RUN apk add --no-cache \
    cairo \
    giflib \
    libjpeg-turbo \
    pango \
    vips

WORKDIR /app

# Copy only build output (standalone)
COPY --from=build /app/.next/standalone ./
COPY --from=build /app/.next/static ./.next/static
COPY --from=build /app/public ./public
COPY --from=build /app/.env ./.env

# Add non-root user
RUN adduser -D sera && chown -R sera:sera /app
USER sera

EXPOSE 3000
CMD ["node", "server.js"]
