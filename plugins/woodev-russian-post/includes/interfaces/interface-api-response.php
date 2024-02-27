<?php

namespace Woodev\Russian_Post\Interfaces;

interface API_Response {

	public function has_api_error();

	public function get_api_error_code();

	public function get_api_error_message();
}