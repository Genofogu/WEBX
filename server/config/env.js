import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().default('3000'),
  MONGO_URI: z.string().url().default('mongodb://localhost:27017/buildx'),
  JWT_ACCESS_SECRET: z.string().min(10).default('default-access-secret-key-12345'),
  JWT_REFRESH_SECRET: z.string().min(10).default('default-refresh-secret-key-12345'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  ADMIN_SECRET_KEY: z.string().min(10).default('default-admin-secret-key-12345'),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  CLIENT_URL: z.string().url().default('http://localhost:3000'),
});

const validateEnv = () => {
  try {
    envSchema.parse(process.env);
    console.log('Environment variables validated successfully.');
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Environment variable validation failed:');
      error.errors.forEach((err) => {
        console.error(`- ${err.path.join('.')}: ${err.message}`);
      });
      // In production, we might want to exit
      if (process.env.NODE_ENV === 'production') {
        process.exit(1);
      }
    }
  }
};

export default validateEnv;
export { envSchema };
