-- Reset admin user to force recreation with new password
DELETE FROM sessions WHERE user_id IN (SELECT id FROM users WHERE username = 'admin');
DELETE FROM users WHERE username = 'admin';
