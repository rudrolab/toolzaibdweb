import { defineConfig, Plugin } from 'vite'
import react from '@vitejs/plugin-react'

function resendDevProxy(): Plugin {
  return {
    name: 'resend-dev-proxy',
    configureServer(server) {
      server.middlewares.use('/api/verify-and-deliver', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const resendRes = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${data.resendApiKey}`,
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  from: data.senderEmail || 'ToolzAi BD <onboarding@resend.dev>',
                  to: [data.customerEmail],
                  subject: data.subject || `🎉 Your Digital Credentials (#${data.orderId || 'TEST'})`,
                  html: data.html,
                }),
              });
              const resData = await resendRes.json();
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = resendRes.status;
              res.end(JSON.stringify(resData));
            } catch (err: any) {
              res.setHeader('Content-Type', 'application/json');
              res.statusCode = 500;
              res.end(JSON.stringify({ error: err.message }));
            }
          });
        } else {
          res.statusCode = 405;
          res.end('Method Not Allowed');
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), resendDevProxy()],
  base: './',
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('firebase')) {
              return 'vendor-firebase';
            }
            if (id.includes('@supabase')) {
              return 'vendor-supabase';
            }
            if (id.includes('lucide-react')) {
              return 'vendor-icons';
            }
            if (id.includes('react') || id.includes('scheduler')) {
              return 'vendor-react';
            }
            return 'vendor-utils';
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
