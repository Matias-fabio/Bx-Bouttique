import 'server-only';
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),

  // Base de datos (obligatoria en producción, con fallback local)
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL es requerida')
    .default('postgresql://postgres:postgres@localhost:5432/bx_boutique'),

  // Servicios que se completarán en cortes posteriores
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  MP_ACCESS_TOKEN: z.string().optional(),
  MP_WEBHOOK_SECRET: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variables de entorno inválidas o faltantes:');
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error('Configuración de entorno inválida. Revisá tu archivo .env.local');
}

export const env = parsed.data;
