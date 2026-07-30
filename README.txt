LEANFIT AUTHENTICATION & SECURITY UPDATE

Replace the included src and server files in your current LeanFit project.

Render environment variables required:
- JWT_SECRET: a long random secret (at least 32 characters)
- RESEND_API_KEY: your active Resend API key
- EMAIL_FROM: verified sender, for example LeanFit <support@yourdomain.com>

Features:
- Strict email and 10-digit mobile validation
- Duplicate email/mobile blocking
- Password requires at least 8 characters with a letter and number
- Passwords hashed with bcrypt (12 rounds)
- 7-day JWT sessions and automatic expired-session cleanup
- Remember Me: localStorage when selected, sessionStorage when not selected
- Protected customer pages
- Forgot Password using a 6-digit email code valid for 10 minutes
- Maximum 5 incorrect reset-code attempts
- Better authentication error messages

Important:
Forgot Password email works only after RESEND_API_KEY and EMAIL_FROM are correctly configured on Render.
