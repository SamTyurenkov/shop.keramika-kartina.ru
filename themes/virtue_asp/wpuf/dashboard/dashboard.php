<?php 
//global $current_user; 
echo '<h2>Мой кабинет</h2>';

echo '<div style="width:100%;display:inline-block"><p>';

    global $current_user;
    printf(
        __( 'Привет, %1$s, - <a href="%2$s">Выйти?</a>', 'wpuf' ),
        '<strong>' . esc_html( $current_user->display_name ) . '</strong>',
        esc_url( wp_logout_url( get_permalink() ) )
    );
echo '</p><p>';

    printf(
        __( 'Из кабинета вы можете <a href="/account/?section=addmypost">писать новости</a>, <a href="/account/?section=addmywork">добавить товар</a> и редактировать информацию о себе.', 'wpuf' ),
        esc_url( add_query_arg( array( 'section' => 'posts' ), get_permalink() ) ),
        esc_url( add_query_arg( array( 'section' => 'subscription' ), get_permalink() ) ),
        esc_url( add_query_arg( array( 'section' => 'edit-profile' ), get_permalink() ) )
    );
echo '</p>
</div>';
echo '<h2>Редактировать профиль</h2>';
echo do_shortcode('[wpuf_profile type="profile" id="73"]');

?>