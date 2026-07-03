<?php 
require __DIR__.'/vendor/autoload.php'; 
$app = require_once __DIR__.'/bootstrap/app.php'; 
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class); 
$kernel->bootstrap(); 
echo "\n---WORKERS---\n"; 
foreach(App\Models\Worker::latest()->take(3)->get() as $w) { 
  echo "User: {$w->user_id}, Skill: {$w->skill}\n"; 
} 
echo "\n---JOBS---\n"; 
foreach(App\Models\WorkerJob::where('status', 'open')->take(5)->get() as $j) { 
  echo "Job: {$j->id}, Title: {$j->title}, Skills: " . json_encode($j->skills_required) . "\n"; 
}
