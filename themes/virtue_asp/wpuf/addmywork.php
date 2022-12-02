<?php 
//global $current_user; 
echo '<h2>Добавить прицеп в магазин</h2>';
echo do_shortcode('[wpuf_form id="47"]');

echo '<br><h2>Прицепы которые вы добавили</h2>';
echo do_shortcode('[wpuf_dashboard post_type="product"]');

?>