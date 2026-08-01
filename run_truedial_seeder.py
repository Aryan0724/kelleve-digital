import paramiko
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

print("Connecting to VPS 187.127.164.142...")
client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

# Upload updated TruedialSeeder.php to VPS container
sftp = client.open_sftp()
local_seeder_path = r't:\Main projects\kelleve-digital-main\findmyinterior-backend\database\seeders\TruedialSeeder.php'
remote_seeder_path = '/var/www/find-my-interior/findmyinterior-backend/database/seeders/TruedialSeeder.php'

print("Uploading updated TruedialSeeder.php to VPS...")
sftp.put(local_seeder_path, remote_seeder_path)

# Also upload updated ConversationController.php and api.php and BusinessProfileAssembler.php to VPS
local_conv_controller = r't:\Main projects\kelleve-digital-main\findmyinterior-backend\app\Http\Controllers\Api\V1\ConversationController.php'
remote_conv_controller = '/var/www/find-my-interior/findmyinterior-backend/app/Http/Controllers/Api/V1/ConversationController.php'
sftp.put(local_conv_controller, remote_conv_controller)

local_api_routes = r't:\Main projects\kelleve-digital-main\findmyinterior-backend\routes\api.php'
remote_api_routes = '/var/www/find-my-interior/findmyinterior-backend/routes/api.php'
sftp.put(local_api_routes, remote_api_routes)

local_offer = r't:\Main projects\kelleve-digital-main\findmyinterior-backend\app\Models\Offer.php'
remote_offer = '/var/www/find-my-interior/findmyinterior-backend/app/Models/Offer.php'
sftp.put(local_offer, remote_offer)

local_page_service = r't:\Main projects\kelleve-digital-main\findmyinterior-backend\app\Modules\Truedial\Services\BusinessPageService.php'
remote_page_service = '/var/www/find-my-interior/findmyinterior-backend/app/Modules/Truedial/Services/BusinessPageService.php'
sftp.put(local_page_service, remote_page_service)

local_dto = r't:\Main projects\kelleve-digital-main\findmyinterior-backend\app\Modules\Truedial\DTOs\BusinessProfileDTO.php'
remote_dto = '/var/www/find-my-interior/findmyinterior-backend/app/Modules/Truedial/DTOs/BusinessProfileDTO.php'
sftp.put(local_dto, remote_dto)

sftp.close()

print("Clearing backend cache & running TruedialSeeder...")
client.exec_command('docker exec fmi_backend php artisan cache:clear')
cmd = 'cd /var/www/find-my-interior/findmyinterior-backend && docker exec fmi_backend php artisan db:seed --class=TruedialSeeder --force'
stdin, stdout, stderr = client.exec_command(cmd)

out = stdout.read().decode('utf-8', errors='replace')
err = stderr.read().decode('utf-8', errors='replace')

print("Output:")
print(out)
if err:
    print("Error output:")
    print(err)

client.close()
print("Seeding completed successfully.")
