<?php

namespace App\Repositories\Contracts;

interface ListingRepositoryInterface
{
    public function getByUserId(int $userId);
    public function getById(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
}
