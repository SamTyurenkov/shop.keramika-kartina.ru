<tr valign="top">
	<th colspan="2">
	<input type="hidden" name="wc_russian_post_authorization_redirect" id="wc_russian_post_authorization_redirect">
		<?php if ( ! $user_options && $this->is_configured() ) : ?>
			<p class="submit"><a class="button button-primary" onclick="jQuery('#wc_russian_post_authorization_redirect').val('1'); jQuery('#mainform').submit();">Подключиться к Почте РФ</a></p>
			<p class="description">Для работы плагина необходимо подключиться к вашему аккаунту Почты РФ.</p>
		<?php elseif ( $user_options && isset( $user_options['api_enabled'] ) && $user_options['api_enabled'] ) : ?>
			<p style="color: #2b7d26;">Вы успешно подкючились к личному кабинету Почты РФ</p>
			<p class="description">Имейте ввиду, что если вы произвели какие либо изменения в профиле вашего личного кабинета, например изменили пароль, токен или подключили новую услугу, то вам необходимо <a href="#" onclick="jQuery('#wc_russian_post_authorization_redirect').val('refresh'); jQuery('#mainform').submit(); return false;">обновить данные профиля</a>.</p>
		<?php else : ?>
			<p style="color: #e91e63;">Невозможно аутентифицироваться</p>
		<?php endif; ?>
	</th>
	
</tr>