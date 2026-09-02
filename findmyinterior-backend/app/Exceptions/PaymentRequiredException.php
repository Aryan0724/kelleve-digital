<?php

namespace App\Exceptions;

use Exception;

class PaymentRequiredException extends Exception
{
    public $amount;

    public function __construct($message = "Payment Required", $amount = 0, $code = 402, Exception $previous = null) {
        $this->amount = $amount;
        parent::__construct($message, $code, $previous);
    }
}
