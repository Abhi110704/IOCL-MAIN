@@ .. @@
   server: {
-    port: 4173,
+    port: 3000,
     host: true,
     proxy: {
       '/api': {
         target: 'http://localhost:3001',
         changeOrigin: true,
         secure: false,
       },
     },
   },
   preview: {
-    port: 5173,
+    port: 4173,
     host: true,
   },