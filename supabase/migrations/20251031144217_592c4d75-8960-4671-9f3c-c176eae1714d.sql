-- Enable required extensions for cron jobs
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Schedule sitemap generation to run daily at 2 AM (UTC)
SELECT cron.schedule(
  'update-sitemap-daily',
  '0 2 * * *', -- Every day at 2 AM UTC
  $$
  SELECT
    net.http_post(
        url:='https://kmjasfuacnwqyershuxa.supabase.co/functions/v1/generate-sitemap',
        headers:='{"Content-Type": "application/json", "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttamFzZnVhY253cXllcnNodXhhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MDEyNjEsImV4cCI6MjA3NDk3NzI2MX0.udCAZvzVkM1cYpsflySFmV1K-SX9o2RqstIoR8qNtI0"}'::jsonb,
        body:='{}'::jsonb
    ) as request_id;
  $$
);