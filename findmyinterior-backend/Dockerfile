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
    supervisor \
    mariadb-client \
    tar \
    gzip

# Install PHP extensions
RUN docker-php-ext-install pdo_mysql pdo_pgsql gd xml

# Increase PHP upload limits & memory
RUN mv "$PHP_INI_DIR/php.ini-production" "$PHP_INI_DIR/php.ini" && \
    sed -i 's/upload_max_filesize = 2M/upload_max_filesize = 20M/g' "$PHP_INI_DIR/php.ini" && \
    sed -i 's/post_max_size = 8M/post_max_size = 25M/g' "$PHP_INI_DIR/php.ini" && \
    sed -i 's/memory_limit = 128M/memory_limit = 512M/g' "$PHP_INI_DIR/php.ini"

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

# Setup cron job
RUN crontab /var/www/html/docker/backup-cron

EXPOSE 80

CMD ["sh", "-c", "php artisan storage:link --force 2>/dev/null || true; php artisan migrate --force || true; /usr/bin/supervisord -c /etc/supervisord.conf"]
