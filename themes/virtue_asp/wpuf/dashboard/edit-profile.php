<?php 
//global $current_user; 

echo '<div style="width: 82px;display: inline-block;float: left;margin-right: 26px;border: 2px solid #deceff">';
		 
        if ( is_user_logged_in() ):
            $current_user = wp_get_current_user();

        if ( ($current_user instanceof WP_User) ) {
            echo get_avatar( $current_user->user_email, 80 );
        }
        endif;

		
echo '</div>';

echo '<div style="width:calc(100% - 110px);display:inline-block"><p>';

    global $current_user;
    printf(
        __( 'Hello %1$s, (not %1$s? <a href="%2$s">Sign out</a>)', 'wpuf' ),
        '<strong>' . esc_html( $current_user->display_name ) . '</strong>',
        esc_url( wp_logout_url( get_permalink() ) )
    );
echo '</p><p>';

    printf(
        __( 'From your account dashboard you can view your dashboard, manage your <a href="%1$s">posts</a>, <a href="%2$s">subscription</a> and <a href="%3$s">edit your password and profile</a>.', 'wpuf' ),
        esc_url( add_query_arg( array( 'section' => 'posts' ), get_permalink() ) ),
        esc_url( add_query_arg( array( 'section' => 'subscription' ), get_permalink() ) ),
        esc_url( add_query_arg( array( 'section' => 'edit-profile' ), get_permalink() ) )
    );
echo '</p>
</div>
<hr>
<h3>Что можно разместить на сайте?</h3>
<li>Пищевой дневник</li>
<p>
Выкладывайте информацию о своем питании, следите за своим прогрессом и получайте комментарии и советы диетолога!
</p>
<li>Посты в блоге</li>
<p>
В блоге вы можете рассказать о посещение одного из проектов каталога, выкладывать свои истории здорового образа жизни и делиться полезными статьями.
</p>
<li>Проекты в каталоге</li>
<p>
Вы работаете в индустрии красоты? Может быть вы фитнесс тренер, или мастер-диетолог? Добавьте свой проект в каталог!
</p>
<h3>Что нельзя размещать на сайте?</h3>
<li>Спам и рекламные посты</li>
<p>
Откровенная реклама не относящихся к теме сайта сторонних проектов будет удалена, за повторные нарушения возможен бан. 
</p>';

echo do_shortcode('[wpuf_profile type="profile" id="1177"]');

?>