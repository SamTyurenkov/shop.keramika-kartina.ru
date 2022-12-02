<?php 
//global $current_user; 
echo '<h2>Добавить запись</h2>';
echo do_shortcode('[wpuf_form id="1282"]');

echo '<br><h2>Все записи дневника</h2>';
echo do_shortcode('[wpuf_dashboard post_type="diaries"]');

?>