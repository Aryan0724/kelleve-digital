<?php

namespace App\Traits;

trait ParsesBudget
{
    /**
     * Parses a raw budget string like '1.5cr' into a numeric value.
     */
    protected function parseBudget(?string $budgetRaw, &$budgetMin, &$budgetMax): void
    {
        if (!$budgetRaw) {
            return;
        }

        if ($budgetMin !== null || $budgetMax !== null) {
            return;
        }

        // Handle predefined frontend ranges
        $predefined = [
            'under ₹50,000' => [0, 50000],
            '₹50,000 - ₹1 lakh' => [50000, 100000],
            '₹1 lakh - ₹5 lakhs' => [100000, 500000],
            '₹5 lakhs - ₹10 lakhs' => [500000, 1000000],
            '₹10 lakhs - ₹25 lakhs' => [1000000, 2500000],
            '₹25 lakhs - ₹50 lakhs' => [2500000, 5000000],
            '₹50 lakhs - ₹1 crore' => [5000000, 10000000],
            '₹1 crore+' => [10000000, 100000000],
        ];

        $lowerRaw = trim(strtolower($budgetRaw));
        if (isset($predefined[$lowerRaw])) {
            $budgetMin = $predefined[$lowerRaw][0];
            $budgetMax = $predefined[$lowerRaw][1];
            return;
        }

        $parts = preg_split('/\s+(?:-|to)\s+/', $lowerRaw);
        if (count($parts) === 2) {
            $budgetMin = $this->parseSingleValue($parts[0]);
            $budgetMax = $this->parseSingleValue($parts[1]);
            // If min has no unit (e.g. "10 - 25 Lakhs"), apply max's unit to min
            if ($budgetMin < 1000 && $budgetMax >= 1000) {
                $budgetMin = $budgetMin * ($budgetMax / $this->parseSingleValue(preg_replace('/[^0-9.]/', '', $parts[1])));
            }
        } else {
            $val = $this->parseSingleValue($lowerRaw);
            $budgetMin = $budgetMax = $val;
        }

        // Cap to prevent numeric(12,2) overflow in Postgres
        $maxLimit = 9999999999.00;
        if ($budgetMin > $maxLimit) $budgetMin = $maxLimit;
        if ($budgetMax > $maxLimit) $budgetMax = $maxLimit;
    }

    private function parseSingleValue(string $str): float
    {
        $clean = preg_replace('/[^\d.a-z]/', '', $str);
        preg_match('/([\d.]+)([a-z]*)/', $clean, $matches);
        
        if (count($matches) < 2) return 0;
        
        $val = (float) $matches[1];
        $unit = $matches[2] ?? '';
        
        if (str_starts_with($unit, 'l')) {
            $val *= 100000;
        } elseif (str_starts_with($unit, 'c') || str_starts_with($unit, 'cr')) {
            $val *= 10000000;
        } elseif (str_starts_with($unit, 'k')) {
            $val *= 1000;
        }
        
        return $val;
    }
}
