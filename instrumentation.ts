import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { OTLPHttpJsonTraceExporter, registerOTel } from "@vercel/otel";
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.ERROR);

export function register() {
  registerOTel({
    serviceName: process.env.SIGNOZ_SERVICE_NAME || "",
    traceExporter: new OTLPHttpJsonTraceExporter({
      url: process.env.SIGNOZ_OPEN_TELEMETRY_COLLECTOR_URL || "",
    }),
  });
}
