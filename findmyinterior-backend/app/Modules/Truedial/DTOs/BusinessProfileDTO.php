<?php

namespace App\Modules\Truedial\DTOs;

class BusinessProfileDTO implements \JsonSerializable
{
    public array $basicInfo;
    public array $actions;
    public array $metrics;
    public array $catalog;
    public array $media;

    public function __construct(array $data)
    {
        $this->basicInfo = $data['basicInfo'] ?? [];
        $this->actions = $data['actions'] ?? [];
        $this->metrics = $data['metrics'] ?? [];
        $this->catalog = $data['catalog'] ?? [];
        $this->media = $data['media'] ?? [];
    }

    public function jsonSerialize(): mixed
    {
        return [
            'basicInfo' => $this->basicInfo,
            'actions' => $this->actions,
            'metrics' => $this->metrics,
            'catalog' => $this->catalog,
            'media' => $this->media,
        ];
    }
}
