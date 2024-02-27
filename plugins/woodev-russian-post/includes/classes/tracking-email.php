<?php

namespace Woodev\Russian_Post\Classes;

if( ! defined( 'ABSPATH' ) ) {
	exit;
}

class Tracking_Email extends \WC_Email {

	/**
	 * Constructor.
	 */
	public function __construct() {

		$this->id             = 'wc_russian_post_tracking_email';
		$this->customer_email = true;

		$this->title       = __( 'Tracking number sending - Russian Post', 'woocommerce-russian-post' );
		$this->description = __( 'The tracking number email is sent to the customer as soon as the order is assigned a tracking number.', 'woocommerce-russian-post' );

		if( is_null( $this->template_base ) ) {
			$this->template_base = trailingslashit( wc_russian_post_shipping()->get_template_path() );
		}

		$this->template_html    = 'emails/tracking-number.php';
		$this->template_plain   = 'emails/plain/tracking-number.php';

		$this->set_placeholder( 'order_number', '' );
		$this->set_placeholder( 'order_date', '' );
		$this->set_placeholder( 'status', '' );
		$this->set_placeholder( 'tracking_number', '' );
		$this->set_placeholder( 'tracking_url', '' );

		parent::__construct();
	}

	public function set_placeholder( $key, $value ) {
		$this->placeholders["{{$key}}"] = $value;
	}

	/**
	 * @param integer       $order_id The Order ID
	 * @param Order|false   $order Instance of Order class of false
	 * @param string        $tracking_number The Order's tracking number (barcode)
	 *
	 * @return void
	 */
	public function trigger( $order_id, $order = false, $tracking_number = null ) {

		if( method_exists( $this, 'setup_locale' ) ) {
			$this->setup_locale();
		}

		if( $order_id && ! is_a( $order, Order::class ) ) {
			$order = new Order( $order_id );
		}

		$this->object = $order;

		if ( $this->customer_email && ! $this->recipient ) {
			$this->recipient = $this->object->get_billing_email();
		}

		$tracking_number = $tracking_number ?: $this->object->get_tracking_number();

		$this->set_placeholder( 'order_number', $this->object->get_order_number() );
		$this->set_placeholder( 'order_date', wc_format_datetime( $this->object->get_date_created() ) );
		$this->set_placeholder( 'status', $this->object->get_order_status_name() );
		$this->set_placeholder( 'tracking_number', $tracking_number );
		$this->set_placeholder( 'tracking_url', $this->object->get_tracking_link() );

		$sent_tracking_number = $order->get_order_meta( 'tracking_number_email_sent' );

		//We send the email only if it is enabled, the recipient's email is provided, the tracking number is available, and the email hasn't been sent previously.
		if ( $this->is_enabled() && $this->get_recipient() && $tracking_number && $tracking_number !== $sent_tracking_number ) {
			if( $this->send( $this->get_recipient(), $this->get_subject(), $this->get_content(), $this->get_headers(), $this->get_attachments() ) ) {
				//If the email was successfully sent, we mark the order as already sending
				$order->update_order_meta( 'tracking_number_email_sent', $tracking_number );
			}
		}

		if( method_exists( $this, 'restore_locale' ) ) {
			$this->restore_locale();
		}
	}

	public function init_form_fields() {
		parent::init_form_fields();

		$placeholder_text   = sprintf( __( 'Available placeholders: %s', 'woocommerce' ), '<code>' . implode( '</code>, <code>', array_keys( $this->placeholders ) ) . '</code>' );

		$fields = \Woodev_Helper::array_insert_after( $this->form_fields, 'heading', array(
			'message_text'  => array(
				'title'       	=> __( 'Message text', 'woocommerce-russian-post' ),
				'type'        	=> 'textarea',
				'css'         	=> 'width:400px; height: 100px;',
				'desc_tip' 		=> sprintf( __( 'Enter message that will be showing on email body. %s', 'woocommerce-russian-post' ), $placeholder_text ),
				'placeholder' 	=> $this->get_default_message_text(),
				'default'     	=> $this->get_default_message_text(),
			)
		) );

		$this->form_fields = $fields;
	}

	public function get_default_subject() {
		return __( '[{site_title}] - Order #{order_number} was exported to Russian Post.', 'woocommerce-russian-post' );
	}

	public function get_default_heading() {
		return __( 'Your order #{order_number} has been assigned a tracking number.', 'woocommerce-russian-post' );
	}

	public function get_default_message_text() {
		return __( 'Your order #{order_number} on web-site <a href="{site_url}" target="_blank">{site_title}</a> has been exported to Russian Post with tracking number {tracking_number}. You can track your order status {tracking_url}.', 'woocommerce-russian-post' );
	}

	public function get_default_additional_content() {
		return __( 'Thanks for shopping with us. If you have any problems with delivery, please let us know.', 'woocommerce-russian-post' );
	}

	/**
	 * Gets the content arguments.
	 *
	 * @param string $type Optional. The content type [html, plain].
	 *
	 * @return array
	 */
	public function get_content_args( $type = 'html' ) {
		return array(
			'order'                 => $this->object,
			'email_heading'         => $this->get_heading(),
			'additional_content'    => $this->get_additional_content(),
			'message_text' 		    => $this->format_string( $this->get_option( 'message_text', $this->get_default_message_text() ) ),
			'sent_to_admin'         => ! $this->customer_email,
			'plain_text'            => ( 'plain' === $type ),
			'email'                 => $this
		);
	}

	/**
	 * Get content html.
	 *
	 * @return string
	 */
	public function get_content_html() {
		return wc_get_template_html(
			$this->template_html,
			$this->get_content_args(),
			'',
			$this->template_base
		);
	}

	/**
	 * Get content plain.
	 *
	 * @return string
	 */
	public function get_content_plain() {
		return wc_get_template_html(
			$this->template_plain,
			$this->get_content_args( 'plain' ),
			'',
			$this->template_base
		);
	}
}