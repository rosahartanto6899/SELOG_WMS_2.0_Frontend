/* eslint-disable @typescript-eslint/no-require-imports */
/** @type {import('next').NextConfig} */

const { AES } = require("crypto-js");
const { withSentryConfig } = require("@sentry/nextjs");

function encryptData(data) {
  if (!process.env.SECRET_KEY || !data) return "";
  return AES.encrypt(JSON.stringify(data), process.env.SECRET_KEY).toString();
}

const nextConfig = {
  reactStrictMode: false,
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "selog-logis-staging.s3.ap-southeast-3.amazonaws.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  poweredByHeader: false,
  experimental: {
    instrumentationHook: process.env.STAGE === "production",
  },
  transpilePackages: [
    "antd",
    "@ant-design",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-tree",
    "rc-table",
    "@microsoft/clarity",
  ],
  env: {
    TOGGLE_OTP_LOGIN: encryptData(process.env.TOGGLE_OTP_LOGIN),
    TOGGLE_CAPTCHA_LOGIN: encryptData(process.env.TOGGLE_CAPTCHA_LOGIN),
    AUTO_PICK_TENDER_IN_RADIUS: encryptData(
      process.env.AUTO_PICK_TENDER_IN_RADIUS,
    ),
    AUTO_PICK_WINNER_IN_TENDER: encryptData(
      process.env.AUTO_PICK_WINNER_IN_TENDER,
    ),
    TOGGLE_INPUT_QUANTITY_ASSIGN: encryptData(
      process.env.TOGGLE_INPUT_QUANTITY_ASSIGN,
    ),
    SERVICE_USER: encryptData(process.env.SERVICE_USER),
    SERVICE_MASTER: encryptData(process.env.SERVICE_MASTER),
    SERVICE_VEHICLE: encryptData(process.env.SERVICE_VEHICLE),
    SERVICE_ORDER: encryptData(process.env.SERVICE_ORDER),
    SERVICE_DRIVER: encryptData(process.env.SERVICE_DRIVER),
    SERVICE_JOURNEY: encryptData(process.env.SERVICE_JOURNEY),
    SERVICE_BILLING: encryptData(process.env.SERVICE_BILLING),
    AUTH_URL: encryptData(process.env.AUTH_URL),

    API_BASE_URL: encryptData(process.env.API_BASE_URL),

    COOLDOWN_LOGIN: process.env.COOLDOWN_LOGIN,
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY: encryptData(
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    ),

    FIREBASE_API_KEY: encryptData(process.env.FIREBASE_API_KEY),
    FIREBASE_APP_ID: encryptData(process.env.FIREBASE_APP_ID),
    FIREBASE_AUTH_DOMAIN: encryptData(process.env.FIREBASE_AUTH_DOMAIN),
    FIREBASE_DATABASE_URL: encryptData(process.env.FIREBASE_DATABASE_URL),
    FIREBASE_MESSAGING_SENDER_ID: encryptData(
      process.env.FIREBASE_MESSAGING_SENDER_ID,
    ),
    FIREBASE_PROJECT_ID: encryptData(process.env.FIREBASE_PROJECT_ID),
    FIREBASE_STORAGE_BUCKET: encryptData(process.env.FIREBASE_STORAGE_BUCKET),

    HELPDESK_MAIL: process.env.HELPDESK_MAIL,

    MAX_FAILED_LOGIN_ATTEMPTS: process.env.MAX_FAILED_LOGIN_ATTEMPTS,
    MAX_IDLE_TIME: process.env.MAX_IDLE_TIME,
    MSAL_CLIENT_ID: encryptData(process.env.MSAL_CLIENT_ID),
    MSAL_CLIENT_SECRET: encryptData(process.env.MSAL_CLIENT_SECRET),
    MSAL_LOGIN_URL: encryptData(process.env.MSAL_LOGIN_URL),
    MSAL_TENANT_ID: encryptData(process.env.MSAL_TENANT_ID),

    ROLE_ID_ADMINISTRATOR: encryptData(process.env.ROLE_ID_ADMINISTRATOR),
    ROLE_ID_SUPER_ADMINISTRATOR: encryptData(
      process.env.ROLE_ID_SUPER_ADMINISTRATOR,
    ),

    SECRET_KEY: process.env.SECRET_KEY,
    GLITCHTIP_DSN: encryptData(process.env.GLITCHTIP_DSN),
    GLITCHTIP_ORG: encryptData(process.env.GLITCHTIP_ORG),
    GLITCHTIP_PROJECT: encryptData(process.env.GLITCHTIP_PROJECT),
    STAGE: encryptData(process.env.STAGE),

    WARNING_IDLE_TIME: process.env.WARNING_IDLE_TIME,

    X_API_KEY: encryptData(process.env.X_API_KEY),
    // OCP_APIM_KEY: encryptData(process.env.OCP_APIM_KEY),
    SIGNOZ_OPEN_TELEMETRY_COLLECTOR_URL: encryptData(
      process.env.SIGNOZ_OPEN_TELEMETRY_COLLECTOR_URL,
    ),
    SIGNOZ_SERVICE_NAME: encryptData(process.env.SIGNOZ_SERVICE_NAME),
    CLARITY_PROJECT_ID: encryptData(process.env.CLARITY_PROJECT_ID),

    // Power BI Configuration
    POWER_BI_GRANT_TYPE: encryptData(process.env.POWER_BI_GRANT_TYPE),
    POWER_BI_CLIENT_ID: encryptData(process.env.POWER_BI_CLIENT_ID),
    POWER_BI_CLIENT_SECRET: encryptData(process.env.POWER_BI_CLIENT_SECRET),
    POWER_BI_RESOURCE: encryptData(process.env.POWER_BI_RESOURCE),
    POWER_BI_LOGIN_URL: encryptData(process.env.POWER_BI_LOGIN_URL),
    POWER_BI_TENANT_ID: encryptData(process.env.POWER_BI_TENANT_ID),
    POWER_BI_API_URL: encryptData(process.env.POWER_BI_API_URL),
    POWER_BI_GROUP_ID: encryptData(process.env.POWER_BI_GROUP_ID),
    POWER_BI_REPORT_ID: encryptData(process.env.POWER_BI_REPORT_ID),
    POWER_BI_DATASET_ID: encryptData(process.env.POWER_BI_DATASET_ID),
    POWER_BI_REPORT_ID_INCENTIVE: encryptData(
      process.env.POWER_BI_REPORT_ID_INCENTIVE,
    ),

    // Power BI Page IDs
    POWER_BI_PAGE_ID_UNIT_UTILIZATION: encryptData(
      process.env.POWER_BI_PAGE_ID_UNIT_UTILIZATION,
    ),
    POWER_BI_PAGE_ID_GANTT_CHART: encryptData(
      process.env.POWER_BI_PAGE_ID_GANTT_CHART,
    ),
    POWER_BI_PAGE_ID_PROFITABILITY: encryptData(
      process.env.POWER_BI_PAGE_ID_PROFITABILITY,
    ),
    POWER_BI_PAGE_ID_STOCK_BOX_DRIVER: encryptData(
      process.env.POWER_BI_PAGE_ID_STOCK_BOX_DRIVER,
    ),
    POWER_BI_PAGE_ID_PERFORMANCE: encryptData(
      process.env.POWER_BI_PAGE_ID_PERFORMANCE,
    ),
    POWER_BI_PAGE_ID_DEMANDS_CUSTOMER: encryptData(
      process.env.POWER_BI_PAGE_ID_DEMANDS_CUSTOMER,
    ),
    POWER_BI_PAGE_ID_DAILY_SHIPMENT_MONITORING: encryptData(
      process.env.POWER_BI_PAGE_ID_DAILY_SHIPMENT_MONITORING,
    ),
    POWER_BI_PAGE_ID_REVENUE_RECOGNITION: encryptData(
      process.env.POWER_BI_PAGE_ID_REVENUE_RECOGNITION,
    ),
    POWER_BI_PAGE_ID_INCENTIVE_DRIVER: encryptData(
      process.env.POWER_BI_PAGE_ID_INCENTIVE_DRIVER,
    ),
  },
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
    localeDetection: false,
  },
};

// Injected content via Sentry wizard below
module.exports = nextConfig;

const sentryWebpackPluginOptions = {
  silent: true,
  org: process.env.GLITCHTIP_ORG,
  project: process.env.GLITCHTIP_PROJECT,
};

const sentryOptions = {
  widenClientFileUpload: true,
  transpileClientSDK: true,
  tunnelRoute: "/monitoring",
  hideSourceMaps: true,
  disableLogger: true,
};

const isProd = process.env.STAGE === "production";

module.exports = isProd
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions, sentryOptions)
  : nextConfig;
