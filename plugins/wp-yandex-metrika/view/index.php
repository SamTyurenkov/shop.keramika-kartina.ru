<div class="yam">
    <div class="yam__wrapper">
        <div class="yam__header">
            <img class="yam__logo" src="<?php echo esc_attr(YaMetrikaHelpers::getAssetUrl('logo.svg')); ?>" alt="Yandex.Metrica">
        </div>
        <div class="yam__description">
            <?php
            printf(__('To get started, specify the relevant Yandex.Metrica tag numbers and fill in the company information.
You can find the tag number on the "My tags" page (<a href="%1$s" target="_blank">%1$s</a>) next to the site address in Yandex.Metrica.<br>
You can create a new tag in the Yandex.Metrica interface via the link <a href="%2$s" target="_blank">%2$s</a>', 'wp-yandex-metrika'), 'https://metrika.yandex.ru/list', 'https://metrika.yandex.ru/'); ?>
        </div>
        <div class="yam__settings">
        <form method="POST" action="options.php">
            <?php
            // slug страницы на которой выводится форма,
            // совпадает с названием группы ($option_group) в API опций
            settings_fields( YAM_PAGE_SLUG );

            // slug страницы на которой выводится форма
            do_settings_sections( YAM_PAGE_SLUG );
            submit_button();
            ?>
        </form>
            <div class="yam-spoiler">
                <div class="yam-spoiler__btn"><?php echo __('View logs', 'wp-yandex-metrika'); ?></div>
                <div class="yam-spoiler__content">
                    <div class="yam-logs">
                        <?php YaMetrikaLogs::getInstance()->printLogs(); ?>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
