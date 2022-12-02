<?php
function virtue_author_box() { ?>
<div class="author-box">
	<ul class="nav nav-tabs" id="authorTab">
  <li class="active"><a href="#about">Author</a></li>
  <li><a href="#postspane">Other posts</a></li>
  <li><a href="#contactpane">Contact</a></li>
</ul>
 
<div class="tab-content postclass">
  <div class="tab-pane clearfix active" id="about">
  	<div class="author-profile vcard">
		<?php echo get_avatar( get_the_author_meta('ID'), 80 ); ?>
        <div class="author-name"><?php the_author_posts_link(); ?></div>
        <?php if ( get_the_author_meta( 'occupation' ) ) { ?>
        <p class="author-occupation"><strong><?php the_author_meta( 'occupation' ); ?></strong></p>
        <?php } ?>
		<p class="author-description author-bio">
			<?php the_author_meta( 'description' ); ?>
		</p>
        </div>
   </div><!--pane-->
  <div class="tab-pane clearfix" id="postspane">
  <div class="author-latestposts">
  <?php echo get_avatar( get_the_author_meta('ID'), 80 ); ?>
  <div class="author-name">Other posts:</div>
  			<ul>
			<?php
          global $authordata, $post;
          $temp = null; 
          $wp_query = null; 
          $wp_query = new WP_Query();
          $wp_query->query(array(
          'author' => $authordata->ID,
          'posts_per_page'=>2));
          $count =0;
           if ( $wp_query ) : 
          while ( $wp_query->have_posts() ) : $wp_query->the_post(); ?>

          <li><a href="<?php the_permalink();?>"><?php the_title(); ?></a></li>
       <?php endwhile; 
        endif; 
        $wp_query = null; 
          $wp_query = $temp;  // Reset
        wp_reset_query(); ?>
			</ul>
	</div><!--Latest Post -->
  </div><!--Latest pane -->
  <div class="tab-pane clearfix" id="contactpane">
  <div class="author-latestposts">
<?php echo get_avatar( get_the_author_meta('ID'), 80 ); ?>
  <div class="author-name">Contact me:</div>
<p class="author-follow author-description">E-mail: <a href="<?php the_author_meta( 'email' ); ?>"><?php the_author_meta( 'email' ); ?></a></p>
<p class="author-follow author-description">Phone: <a href="tel:<?php the_author_meta( 'phone-profile' ); ?>"><?php the_author_meta( 'phone-profile' ); ?></a></p>
	</div><!--Latest Post -->
  </div><!--Sad pane -->

</div><!--Tab content -->
</div><!--Author Box -->
 <?php } ?>