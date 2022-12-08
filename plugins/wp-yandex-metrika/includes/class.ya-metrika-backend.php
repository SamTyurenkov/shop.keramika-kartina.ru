<?php

class YaMetrikaBackend
{
    protected static $instance;

    const BRAND_TYPE_TAXONOMY = 'taxonomy';
    const BRAND_TYPE_CUSTOM_FIELD = 'custom_field';

    private function __construct()
    {
        add_action('admin_menu', [$this, 'createAdminPage']);
        add_action('admin_init', [$this, 'registerSettings']);
        add_action('admin_enqueue_scripts', [$this, 'registerAssets']);
    }

    public function registerAssets()
    {
        wp_enqueue_style(YAM_SLUG, plugins_url('/assets/admin.min.css', YAM_FILE), false, YAM_VER);
        wp_enqueue_script(YAM_SLUG, plugins_url('/assets/admin.min.js', YAM_FILE), ['jquery'], YAM_VER);
    }

    public function createAdminPage()
    {
		add_options_page(
            __('Yandex.Metrica settings', 'wp-yandex-metrika'),
            __('Yandex.Metrica', 'wp-yandex-metrika'),
            'edit_theme_options',
			YAM_PAGE_SLUG,
            $this->getPageHtmlFunction('index')
        );
    }

    public function registerSettings()
    {
        add_settings_section('default', null, null, YAM_PAGE_SLUG);
        add_settings_section('ec', null /*__('Электронная коммерция', 'wp-yandex-metrika')*/, null, YAM_PAGE_SLUG);

        register_setting(YAM_PAGE_SLUG, YAM_OPTIONS_SLUG, [
                'sanitize_callback' => [$this, 'sanitizeOptions']
        ]);

        add_settings_field(
            'yam_counters',
            __('Tags', 'wp-yandex-metrika'),
            [$this, 'displayRepeaterField'],
			YAM_PAGE_SLUG,
            'default',
            array(
                "name" => 'counters',
                "fields" => [
                    "number" => [
                        'callback' => [$this, 'displayTextField'],
                        'name' => 'number',
                        'default' => '',
                        'attrs' => [
                            'type' => 'text',
                            'data-input-type' => 'number',
                            'placeholder' => __('Tag number', 'wp-yandex-metrika')
                        ]
                    ],
                    "webvisor" => [
                        'callback' => [$this, 'displayCheckboxField'],
                        'name' => 'webvisor',
						'default' => true,
                        'label' => __('Session Replay', 'wp-yandex-metrika'),
                        'attrs' => [
                            'type' => 'checkbox'
                        ]
                    ]
                ]
            )
        );

        add_settings_field(
			'yam_brand_type',
            __('Brand type<sup>*</sup>', 'wp-yandex-metrika'),
            [$this, 'displaySelectField'],
			YAM_PAGE_SLUG,
            'ec',
            array(
                'name' => 'brand_type',
                'options' => [
					self::BRAND_TYPE_TAXONOMY => __('Term', 'wp-yandex-metrika'),
					self::BRAND_TYPE_CUSTOM_FIELD => __('Custom field', 'wp-yandex-metrika')
				]
            )
        );

        add_settings_field(
			'yam_brand_slug',
            __('Taxonomy or custom field of brand<sup>*</sup>', 'wp-yandex-metrika'),
            [$this, 'displayTextField'],
			YAM_PAGE_SLUG,
            'ec',
            array(
                'name' => 'brand_slug',
				'description' => __('<sup>*</sup>To transfer the product\'s trademark to the "brand" field, specify the name of the field that is used on your site.', 'wp-yandex-metrika'),
                'attrs' => [
                    'type' => 'text',
                    'class' => ''
                ]
            )
        );
    }

    public function sanitizeOptions($options){
        if (!isset($options['counters']) || !is_array($options['counters'])) {
			$options['counters'] = [];
        }

        foreach ($options['counters'] as $key => &$row) {
			if (empty($row['number'])) {
				unset($options['counters'][$key]);
			}

            if (!isset($row['webvisor'])) {
				$row['webvisor'] = 0;
            }
        }

		YaMetrika::getInstance()->deactivateMessage('deactivate-other-counters');

        if (!empty($options['counters'])) {
			YaMetrika::getInstance()->deactivateMessage('no-counters');
		}


        return $options;
    }

    public function displayRepeaterField($args)
    {
        $rows = YaMetrika::getInstance()->options[$args['name']];
		$fields = $args['fields'];

        if (!is_array($rows) || empty($rows) || (isset($rows[0]) && !is_array($rows[0]))) {
			$rows = [[]];
            foreach ($fields as $fieldName => $field) {
				$rows[0][$fieldName] = isset($field['default']) ? $field['default'] : '';
            }
        }

        ?>
        <div class="yam-repeater-field">
            <div class="yam-repeater-field__rows">
                <div class="yam-repeater-field__row yam-repeater-field__row_tpl">
					<?php foreach ($fields as $fieldName => $fieldOptions) {
						$field = $fields[$fieldName];
						$field['value'] = $field['default'];
						$field['name'] = $args['name'].'][-1]['.$fieldName;
						if (empty($field['attrs'])) {
							$field['attrs'] = [];
						}

						if (empty($field['attrs']['class'])) {
							$field['attrs']['class'] = '';
						}

						$field['attrs']['class'] .= ' yam-repeater-field__input';
						?>
                        <div class="yam-repeater-field__input-wrap">
							<?php $field['callback']($field);?>
                        </div>
					<?php } ?>
                    <div class="yam-repeater-field__remove-btn button">
                        <?php _e('Delete', 'wp-yandex-metrika'); ?>
                    </div>
                </div>

                <?php
                foreach ($rows as $index => $row) {
                    ?>
                    <div class="yam-repeater-field__row">
                    <?php foreach ($row as $fieldName => $value) {
                            $field = $fields[$fieldName];
						    $field['value'] = $value;
						    $field['name'] = $args['name'].']['.$index.']['.$fieldName;
						    if (empty($field['attrs'])) {
								$field['attrs'] = [];
							}

                            if (empty($field['attrs']['class'])) {
                                $field['attrs']['class'] = '';
                            }

						    $field['attrs']['class'] .= ' yam-repeater-field__input';
                        ?>
                        <div class="yam-repeater-field__input-wrap">
                            <?php $field['callback']($field); ?>
                        </div>
                    <?php } ?>
                        <div class="yam-repeater-field__remove-btn button">
                            <?php _e('Delete', 'wp-yandex-metrika'); ?>
                        </div>
                    </div>
                    <?php
                } ?>
            </div>
            <div class="yam-repeater-field__add-wrap">
                <div class="yam-repeater-field__add-btn button button-primary">
                    <?php _e('Add', 'wp-yandex-metrika'); ?>
                </div>
            </div>
        </div>
        <?php
    }

    public function displaySelectField($args)
    {
		$selectedValue = YaMetrika::getInstance()->options[$args['name']];
		$name = YAM_OPTIONS_SLUG.'['.$args['name'].']';
        $selectOptions = $args['options'];

        ?>
        <select class="" name="<?php echo esc_attr($name); ?>">
        <?php foreach ($selectOptions as $value => $label) { ?>
            <option value="<?php echo esc_attr($value); ?>" <?php selected($value, $selectedValue); ?>><?php echo esc_html($label); ?></option>
        <?php } ?>
        </select>
        <?php if (!empty($args['description'])) { ?>
        <p class="description"><?php echo wp_kses_post($args['description']); ?></p>
        <?php } ?>
        <?php
    }

	public function displayTextField($args)
	{
	    $attrs = $args['attrs'];
		$attrs['name'] = YAM_OPTIONS_SLUG.'['.$args['name'].']';
		$attrs['value']  = isset($args['value']) ? $args['value'] : YaMetrika::getInstance()->options[$args['name']];

		?>
        <input <?php YaMetrikaHelpers::printHtmlAttrs($attrs); ?>>
		<?php if (!empty($args['description'])) { ?>
        <p class="description"><?php echo wp_kses_post($args['description']); ?></p>
	    <?php } ?>
		<?php
	}


	public function displayCheckboxField($args)
	{
	    $attrs = $args['attrs'];
		$attrs['name'] = YAM_OPTIONS_SLUG.'['.$args['name'].']';
		$attrs['value'] = isset($attrs['value']) ? $attrs['value'] : 1;
		$attrs['type'] = 'checkbox';
		$value = isset($args['value']) ? $args['value'] : YaMetrika::getInstance()->options[$args['name']];

		if ($value) {
		    $attrs['checked'] = 'checked';
		}

		?>
        <input <?php YaMetrikaHelpers::printHtmlAttrs($attrs); ?>>&nbsp;<?php echo isset($args['label']) ? wp_kses_post($args['label']) : ''; ?>
		<?php if (!empty($args['description'])) { ?>
        <p class="description"><?php echo wp_kses_post($args['description']); ?></p>
	    <?php } ?>
		<?php
	}


    private function getPageHtmlFunction($slug)
    {
        return function () use ($slug) {
            require YAM_PATH . '/view/' . $slug . '.php';
        };
    }

    public static function getInstance()
    {
        if (empty(self::$instance)) {
            self::$instance = new self;
        }

        return self::$instance;
    }
}
