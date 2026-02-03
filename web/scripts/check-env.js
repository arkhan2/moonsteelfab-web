// Script to verify NEXT_PUBLIC_API_BASE_URL is available during build
console.log('=== Environment Variable Check ===');
console.log('NEXT_PUBLIC_API_BASE_URL:', process.env.NEXT_PUBLIC_API_BASE_URL || 'NOT SET (will use fallback)');
console.log('All NEXT_PUBLIC_ vars:', Object.keys(process.env).filter(k => k.startsWith('NEXT_PUBLIC_')));
console.log('==================================');
