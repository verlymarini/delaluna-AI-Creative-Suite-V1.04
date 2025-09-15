@@ .. @@
       console.log('📝 Prompt:', imagePrompt.trim());
       
       // Call Freepik Flux API
       let response;
       try {
-        const apiUrl = 'https://api.freepik.com/v1/ai/text-to-image/flux-dev';
+        const apiUrl = '/api/freepik/v1/ai/text-to-image/flux-dev';
         
         response = await fetch(apiUrl, {
           method: 'POST',
@@ .. @@
     }
     
    // Get user's Freepik API key
    let freepikApiKey = '';
    try {
      const savedKeys = localStorage.getItem('delaluna_freepik_keys');
      if (savedKeys) {
        const keys = JSON.parse(savedKeys);
        const activeKey = keys.find((key: any) => key.status === 'active');
        if (activeKey) {
          freepikApiKey = activeKey.key.trim();
        }
      }
    } catch (error) {
      console.error('Error loading Freepik API key:', error);
    }
    
     try {
-      const apiUrl = `https://api.freepik.com/v1/ai/text-to-image/flux-dev/${freepikTaskId}`;
+      const apiUrl = `/api/freepik/v1/ai/text-to-image/flux-dev/${freepikTaskId}`;
       
       const response = await fetch(apiUrl, {
         method: 'GET',
          'X-Freepik-API-Key': freepikApiKey, // Pass user's Freepik key