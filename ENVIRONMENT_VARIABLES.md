# Environment Variables

These variables must be added to your `.env` file after generating the fresh Laravel application.

## 1. Database Configuration
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=findmyinterior
DB_USERNAME=root
DB_PASSWORD=
```

## 2. Application Setup
```env
APP_NAME="FindMyInterior"
APP_ENV=local
APP_KEY= # Generate via: php artisan key:generate
APP_DEBUG=true
APP_URL=http://localhost:8000
FRONTEND_URL=http://localhost:3000
QUEUE_CONNECTION=database
```

## 3. JWT/Sanctum Settings
```env
SANCTUM_STATEFUL_DOMAINS=localhost:3000
SESSION_DOMAIN=localhost
```

## 4. Mail/Notification Services (For Inquiries)
```env
MAIL_MAILER=smtp
MAIL_HOST=sandbox.smtp.mailtrap.io # or sendgrid/aws ses
MAIL_PORT=2525
MAIL_USERNAME=your_username
MAIL_PASSWORD=your_password
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="hello@findmyinterior.com"
MAIL_FROM_NAME="${APP_NAME}"
```

## 5. Razorpay Configuration (Payments)
```env
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_HERE
RAZORPAY_KEY_SECRET=YOUR_SECRET_HERE
```

## 6. AWS S3 Configuration (For image uploads)
```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=ap-south-1
AWS_BUCKET=findmyinterior-assets
AWS_USE_PATH_STYLE_ENDPOINT=false
```
