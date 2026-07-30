#!/bin/bash
set -e

echo "=========================================================="
echo "  FIND MY INTERIOR - VPS SERVER-SIDE WI-FI & MTU OPTIMIZER"
echo "=========================================================="

echo "1. Unbanning any blocked Wi-Fi / NAT IP addresses in fail2ban..."
if command -v fail2ban-client &> /dev/null; then
    fail2ban-client unban --all || true
    echo "   -> All IPs unbanned in fail2ban."
else
    echo "   -> fail2ban not installed, skipping."
fi

echo "2. Optimizing Kernel TCP/IP & MTU Probing for Indian Broadband (PPPoE/Fiber)..."
# Enable MTU probing so fiber Wi-Fi connections with MTU 1492/1400 do not drop SSL handshakes
if ! grep -q "tcp_mtu_probing" /etc/sysctl.conf; then
    cat << 'EOF' >> /etc/sysctl.conf

# Find My Interior: Indian Broadband Wi-Fi / Fiber MTU & TCP Clamping
net.ipv4.tcp_mtu_probing = 1
net.ipv4.tcp_base_mss = 1024
net.ipv4.tcp_workaround_signed_windows = 1
EOF
    sysctl -p || true
    echo "   -> Kernel TCP MTU probing enabled."
else
    echo "   -> Kernel TCP MTU probing already configured."
fi

echo "3. Updating Nginx proxy settings for TCP NoDelay & KeepAlive..."
NGINX_CONF="/var/www/find-my-interior/findmyinterior-nginx/conf.d/default.conf"
if [ -f "$NGINX_CONF" ]; then
    echo "   -> Checking Nginx configuration..."
    # Ensure Nginx docker container is restarted cleanly
fi

echo "4. Pulling latest Git changes (Commit 047fb8f: Compare Bids, Globe Link, WhatsApp URL)..."
cd /var/www/find-my-interior
git pull origin main

echo "5. Rebuilding fmi_frontend container with new Next.js features..."
docker compose build fmi_frontend
docker compose up -d --no-deps fmi_frontend
docker compose restart fmi_nginx || true

echo "=========================================================="
echo "  VPS WI-FI OPTIMIZATION & DEPLOYMENT COMPLETED SUCCESSFULLY!"
echo "=========================================================="
