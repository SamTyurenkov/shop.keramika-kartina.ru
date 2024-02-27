<?php

namespace Woodev\Russian_Post\Interfaces;

interface Orders_Public_Order {

	/**
	 * @return integer
	 */
	public function get_api_order_id();

	/**
	 * @return string
	 */
	public function get_api_order_type();

	/**
	 * @return string
	 */
	public function get_financial_status();

	/**
	 * @return string
	 */
	public function get_fio_plugin();

	/**
	 * @return string
	 */
	public function get_insr_value_plugin();

	/**
	 * @return Orders_Public_Order_Line[]
	 */
	public function get_order_lines();

	/**
	 * @return string
	 */
	public function get_payment_plugin();

	/**
	 * @return string
	 */
	public function get_phone_plugin();

	/**
	 * @return string
	 */
	public function get_shipment_address_plugin();

	/**
	 * @return string
	 */
	public function get_shipment_index_plugin();

	/**
	 * @return string
	 */
	public function get_shipment_type();

	/**
	 * @return integer
	 */
	public function get_shop_delivery_cost();

	/**
	 * @return string
	 */
	public function get_weight();

}