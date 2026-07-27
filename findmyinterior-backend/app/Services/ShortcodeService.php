<?php

namespace App\Services;

use App\Models\User;
use App\Models\City;
use App\Models\Category;

class ShortcodeService
{
    /**
     * Parse and replace shortcodes in the given content.
     * 
     * Supported shortcodes:
     * {{ total_professionals }}
     * {{ total_cities }}
     * {{ total_categories }}
     * {{ current_year }}
     */
    public static function parse(?string $content): ?string
    {
        if (empty($content)) {
            return $content;
        }

        // We can cache these if they are heavy
        $replacements = [
            '{{ total_professionals }}' => number_format(User::whereHas('roles', function($q) { $q->where('slug', '!=', 'customer'); })->orWhereNotNull('professional_type')->count()),
            '{{ total_cities }}' => number_format(City::count()),
            '{{ total_categories }}' => number_format(Category::count()),
            '{{ current_year }}' => date('Y'),
        ];

        return str_replace(array_keys($replacements), array_values($replacements), $content);
    }
}
