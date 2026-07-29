<?php

namespace App\Repositories\Eloquent;

use App\Models\Listing;
use App\Repositories\Contracts\ListingRepositoryInterface;

class ListingRepository implements ListingRepositoryInterface
{
    public function getByUserId(int $userId)
    {
        return Listing::where('user_id', $userId)->get();
    }

    public function getById(int $id)
    {
        return Listing::findOrFail($id);
    }

    public function create(array $data)
    {
        return Listing::create($data);
    }

    public function update(int $id, array $data)
    {
        $listing = Listing::findOrFail($id);
        $listing->update($data);
        return $listing;
    }

    public function delete(int $id)
    {
        return Listing::destroy($id);
    }
}
