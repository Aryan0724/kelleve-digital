<?php

require __DIR__ . '/vendor/autoload.php';
$app = require_once __DIR__ . '/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\AcademyContent;
use App\Models\PodcastEpisode;

// Truncate
AcademyContent::truncate();
PodcastEpisode::truncate();

// Academy
$academyData = [
    [
        'title' => 'Mastering Client Consultations',
        'category' => 'Sales',
        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'thumbnail' => '/images/academy/consultation.jpg',
        'duration' => '12:45',
        'instructor' => 'Aryan Sharma'
    ],
    [
        'title' => 'Pricing Your Interior Projects',
        'category' => 'Business',
        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'thumbnail' => '/images/academy/pricing.jpg',
        'duration' => '08:30',
        'instructor' => 'Riya Desai'
    ],
    [
        'title' => 'Modern Material Selection',
        'category' => 'Design',
        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'thumbnail' => '/images/academy/materials.jpg',
        'duration' => '15:20',
        'instructor' => 'Kunal Kapoor'
    ],
    [
        'title' => 'Marketing for Architects',
        'category' => 'Marketing',
        'video_url' => 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        'thumbnail' => '/images/academy/marketing.jpg',
        'duration' => '22:10',
        'instructor' => 'Priya Nair'
    ]
];

foreach ($academyData as $data) {
    AcademyContent::create($data);
}

// Podcast
$podcastData = [
    [
        'title' => 'Ep 1: Scaling a $1M Design Firm',
        'host' => 'TrueDial Network',
        'audio_url' => 'https://example.com/podcast/ep1.mp3',
        'cover_image' => '/images/podcast/ep1.jpg',
        'duration' => '45:30',
        'description' => 'We talk with leading architect Rahul about scaling a small firm to a multi-million dollar business.',
        'guest_name' => 'Rahul Verma'
    ],
    [
        'title' => 'Ep 2: The Future of Smart Homes',
        'host' => 'TrueDial Network',
        'audio_url' => 'https://example.com/podcast/ep2.mp3',
        'cover_image' => '/images/podcast/ep2.jpg',
        'duration' => '38:15',
        'description' => 'Exploring the impact of IoT and smart home technologies in interior design.',
        'guest_name' => 'Anita Singh'
    ],
    [
        'title' => 'Ep 3: Client Management Secrets',
        'host' => 'TrueDial Network',
        'audio_url' => 'https://example.com/podcast/ep3.mp3',
        'cover_image' => '/images/podcast/ep3.jpg',
        'duration' => '52:00',
        'description' => 'How to handle difficult clients and build long-lasting relationships in the contracting business.',
        'guest_name' => 'Vikram Seth'
    ]
];

foreach ($podcastData as $data) {
    PodcastEpisode::create($data);
}

echo "Academy and Podcast mock data seeded successfully!\n";
