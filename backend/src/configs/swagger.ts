import swaggerJsdoc from "swagger-jsdoc";
import { env } from "./env";

export const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "ClearCut AI API",
      version: "1.0.0",
      description: "Production-grade API for AI background removal SaaS workflows."
    },
    servers: [{ url: `${env.API_URL}${env.API_PREFIX}` }],
    components: {
      securitySchemes: {
        bearerAuth: { type: "http", scheme: "bearer", bearerFormat: "JWT" },
        apiKeyAuth: { type: "apiKey", in: "header", name: "x-api-key" }
      }
    }
  },
  apis: ["./src/modules/**/*.ts", "./docs/**/*.yaml"]
});
