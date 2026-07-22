FROM php:8.4-fpm-alpine

# Install system dependencies
RUN apk add --no-cache \
    curl \
    libpng-dev \
    libxml2-dev \
    postgresql-dev \
    zip \
    unzip \
    nginx \
    supervisor

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo_pgsql gd xml

# Get latest Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Install PHP dependencies
RUN composer install --optimize-autoloader --no-dev

# Set permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Configure Nginx
COPY docker/nginx.conf /etc/nginx/http.d/default.conf

# Configure PHP-FPM
COPY docker/www.conf /usr/local/etc/php-fpm.d/www.conf

# Configure Supervisord to run both Nginx and PHP-FPM
COPY docker/supervisord.conf /etc/supervisord.conf

EXPOSE 80

CMD ["sh", "-c", "php artisan storage:link --force 2>/dev/null || true && php artisan migrate --force && /usr/bin/supervisord -c /etc/supervisord.conf"]
