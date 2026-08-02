import paramiko, sys

client = paramiko.SSHClient()
client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
client.connect('187.127.164.142', username='root', password='Truedial@1111', timeout=30)

cmd = """
docker exec fmi_backend php artisan tinker --execute="
\$admin = App\\Models\\User::first();
\$catContractor = App\\Models\\Category::where('slug', 'like', '%contractor%')->first() ?? App\\Models\\Category::first();
\$catMaterial = App\\Models\\Category::where('slug', 'like', '%material%')->first() ?? App\\Models\\Category::first();
\$catLabor = App\\Models\\Category::where('slug', 'like', '%labor%')->first() ?? App\\Models\\Category::first();

App\\Models\\Requirement::create(['title' => 'Civil Construction for Villa', 'description' => 'Need full civil construction.', 'category_id' => \$catContractor->id, 'user_id' => \$admin->id, 'budget_min' => 5000000, 'budget_max' => 8000000, 'city' => 'Patna', 'district' => 'Patna', 'status' => 'open', 'project_type' => 'Commercial', 'name' => 'John Doe', 'phone' => '+919999999999']);

App\\Models\\Rfq::create(['title' => 'Bulk Cement and TMT Bars', 'description' => 'Need 500 bags of cement.', 'category_id' => \$catMaterial->id, 'user_id' => \$admin->id, 'budget_min' => 100000, 'budget_max' => 500000, 'city' => 'Patna', 'district' => 'Patna', 'status' => 'open', 'name' => 'John Doe', 'phone' => '+919999999999']);

App\\Models\\WorkerJob::create(['title' => 'Need 10 Masons and 5 Helpers', 'description' => 'Daily wage basis for 30 days.', 'category_id' => \$catLabor->id, 'user_id' => \$admin->id, 'budget_min' => 500, 'budget_max' => 800, 'city' => 'Patna', 'district' => 'Patna', 'status' => 'open', 'name' => 'John Doe', 'phone' => '+919999999999']);
"
"""

stdin, stdout, stderr = client.exec_command(cmd)
print(stdout.read().decode())
print(stderr.read().decode())
client.close()
