<?php

namespace Woodev\Russian_Post\Interfaces;

interface Orders_Public {

	/**
	 * @return Orders_Public_User
	 */
	public function get_user();

	/**
	 * @return Orders_Public_Order
	 */
	public function get_order();

}