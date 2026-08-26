<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$request = Illuminate\Http\Request::create('/api/v1/homepage', 'GET');
$request->headers->set('Origin', 'http://localhost:3000');
$response = $kernel->handle($request);
echo 'STATUS: ' . $response->getStatusCode() . PHP_EOL;
echo 'CONTENT: ' . substr($response->getContent(), 0, 500) . PHP_EOL;
