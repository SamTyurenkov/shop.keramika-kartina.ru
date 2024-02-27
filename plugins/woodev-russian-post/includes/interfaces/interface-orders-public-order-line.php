<?php

namespace Woodev\Russian_Post\Interfaces;

interface Orders_Public_Order_Line {

	/**
	 * @return integer
	 */
	public function get_api_order_line_id();

	/**
	 * @return string
	 */
	public function get_api_order_type();

	/**
	 * @return string
	 */
	public function get_code();

	/**
	 * @return integer
	 */
	public function get_country_code();

	/**
	 * @return integer
	 */
	public function get_customs_code();

	/**
	 * @return integer
	 */
	public function get_quantity();

	/**
	 * @return string
	 */
	public function get_title();

	/**
	 * @return string
	 */
	public function get_trade_mark();

	/**
	 * @return integer
	 */
	public function get_tnved_code();

	/**
	 * @return integer
	 */
	public function get_value();

	/**
	 * @return integer
	 */
	public function get_vat_rate();

	/**
	 * @return float
	 */
	public function get_weight();
}