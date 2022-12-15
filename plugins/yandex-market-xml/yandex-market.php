<?
/*
Plugin Name: Yandex FEED
Description: Adds xml-feed for Yandex.Market, /feed/yandex-market/
Author: Sam Tyurenkov
Author URI: https://windowspros.ru
Version: 1.3
*/


// Yandex.Market RSS

add_action('init', 'AddMarketRSS');
function AddMarketRSS()
{
	add_feed('yandex-market', 'ProceedYandexMarketRSS');
	add_feed('google-market', 'ProceedGoogleMarketRSS');
}

function get_meta($field, $id = null)
{
	return get_post_meta($id != '' ? $id : get_the_ID(), $field, true);
}

function print_replaces($name, $value, $replaces)
{
	if (!$value)
		return;

	foreach ($replaces as $from => $to)
		if ($from == $value) {
			echo "<$name>";
			echo $to;
			echo "</$name>\r\n";
			return;
		}
}

function print_meta($name, $field, $format = 'string', $default = false)
{
	if (!$name)
		return;

	if (!($value = get_meta($field) ?: $default))
		return;

	if ($format == 'int')
		$value = intval(str_replace(' ', '', $value));
	elseif ($format == 'float')
		$value = floatval(str_replace(' ', '', $value));

	if (!$value)
		return;

	printf('<%s>%s</%s>', $name, $value, $name);
}


//MARKET FEED
function ProceedYandexMarketRSS()
{
	header('Content-Type: ' . feed_content_type('rss-http') . '; charset=' . get_option('blog_charset'), true);
	echo '<?xml version="1.0" encoding="' . get_option('blog_charset') . '"?>';
?>
	<yml_catalog date="<?php echo date('c'); ?>">
		<?
		echo '<shop>
 <name>Магазин Керамики и Картин</name>
 <company>Тюреньков Олег Юрьевич</company>
 <url>https://shop.keramika-kartina.ru</url>
 <currencies>
      <currency id="RUR" rate="1"/>
 </currencies>

<categories>
    <category id="1">Комплекты женского нижнего белья</category>
	<category id="2">Женские трусы</category>
	<category id="3">Бюстгальтеры</category>
</categories>

<offers>'; ?>

		<?

		$objects = new WP_Query(array(
			'post_type' => 'product_variation',
			'post_status' => 'publish',
			'posts_per_page' => -1,
		));

		while ($objects->have_posts()) : $objects->the_post(); ?>
			<?
			if (has_term(107 /* Обучение Массажу */, 'product-cat'))
				$category = '1';
			?>
			<offer id="<?php echo get_the_ID(); ?>" available="true">
				<name>
					<?php echo get_the_title(); ?></name>
				<url><?php the_permalink(); ?></url>
				<price>
					<?
					$product_id = get_the_ID();
					$product = wc_get_product($product_id);
					?>
					<?php echo $product->get_sale_price(); ?>
				</price>
				<currencyId>RUR</currencyId>
				<categoryId>1</categoryId>
				<picture><?php echo get_the_post_thumbnail_url(); ?></picture>
				<pickup>true</pickup>
				<description>
					<![CDATA[
<?php echo str_replace('<br>', '<p>- - - - - - - - - - -</p>', str_replace(array("'", "\"", "&quot;", "&#8212;", "&nbsp;", "&#171;", "&#187;"), '', $product->get_description())); ?>
]]>
				</description>
				<sales_notes>Цена действительна по 100% предоплате через сайт.</sales_notes>
			</offer>
		<?php endwhile;
		wp_reset_postdata(); ?>
		</offers>
		</shop>
	</yml_catalog>
<?
}

//MARKET FEED
function ProceedGoogleMarketRSS()
{
	header('Content-Type: ' . feed_content_type('rss-http') . '; charset=' . get_option('blog_charset'), true);
	echo '<?xml version="1.0" encoding="' . get_option('blog_charset') . '"?>'; ?>
	<rss version="2.0" xmlns:g="http://base.google.com/ns/1.0">
		<channel>
			<title>Магазин Женского Нижнего Белья - APANTIES</title>
			<link>https://apanties.ru</link>
			<description>
				Магазин самых лучших трусиков и бюстгальтеров! Правильное женское нижнее белье высокого качества. В продаже лифчики от 700 рублей, трусики от 400 рублей и комплекты от 1100 рублей.
			</description>
			<?
			$objects = new WP_Query(array(
				'post_type' => 'product_variation',
				'post_status' => 'publish',
				'posts_per_page' => -1,
			));

			while ($objects->have_posts()) : $objects->the_post(); ?>
				<?
				if (has_term(107 /* Обучение Массажу */, 'product-cat'))
					$category = '1';
				?>
				<item>
					<title><?php echo get_the_title(); ?></title>
					<link><?php the_permalink(); ?></link>
					<g:id><?php echo get_the_ID(); ?></g:id>
					<g:price><?php $product_id = get_the_ID();
								$product = wc_get_product($product_id); ?><?php echo $product->get_sale_price(); ?> RUB</g:price>
					<g:availability>in stock</g:availability>
					<g:image_link><?php echo get_the_post_thumbnail_url(); ?></g:image_link>
					<description>
						<![CDATA[
<?php echo str_replace(array("'", "\"", "&quot;", "&#8212;", "&nbsp;", "&#171;", "&#187;"), '', $product->get_description()); ?>
]]>
					</description>
				</item>
			<?php endwhile;
			wp_reset_postdata(); ?>
		</channel>
	</rss>
<?
}
