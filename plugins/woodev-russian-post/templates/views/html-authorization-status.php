<?php

defined( 'ABSPATH' ) or exit;

/**
 * Template authorization status
 *
 * @type string $status Text of status connection
 *
 */
?>
<style>
    td.wc-russian-post-status-indicator span {
        color: var(--wc-primary-text);
        padding: 5px 10px;
        border-radius: 5px;
    }
    td.wc-russian-post-status-indicator span.status-successful-connect {
        background-color: var(--wc-green);
        border: #55db82 1px solid;
    }
    td.wc-russian-post-status-indicator span.status-fail-connect {
        background-color: var(--wc-red);
        border: #d75166 1px solid;
    }
</style>
<tr valign="top">
	<th scope="row" class="titledesc">
		<label>Статус подключения: <?php echo wc_help_tip( __( 'Current status connection', 'woocommerce-russian-post' ) );?></label>
</th>
<td class="forminp wc-russian-post-status-indicator">
	<?php echo $status;?>
</td>
</tr>
