<?php
   /*
   Plugin Name: The Feedback Monkey Dashboard
   Plugin URI: https://thefeedbackmonkey.com
   description: Install and setup your widget.
   Version: 1
   Author: Noah I.
   Author URI:
   License: GPL2
   */

require_once 'functions.php';


function fbm_load_css_js() {

  wp_enqueue_script('boot_js', plugins_url('includes/main.js' , __FILE__),  array('jquery') );
  wp_register_script( 'admin-scripts', get_template_directory_uri() . '/includes/main.js', array('jquery'), '1.0', true );

  wp_enqueue_style('boot_css', plugins_url('includes/style.css',__FILE__ ));
}

// load js and css
add_action('admin_print_scripts', 'fbm_load_css_js');

// load admin menu page
add_action('admin_menu', 'fbm_plugin_setup_menu');

 function fbm_plugin_setup_menu(){
     add_menu_page( 'FBM Admin', 'FBM Admin', 'manage_options', 'fbm-plugin', 'fbm_showPage' );
 }

function fbm_showPage(){

  include_once 'content.php';
}


// create shortcode
function fmb_reviewbox_shortcode($atts = [], $content = null, $tag = '') {

  // override default attributes with user attributes
  $wporg_atts = shortcode_atts(
      array(
          'id' => 'id',
          'type' => 'type',
          'title' => '',
          'background_color' => '',
      ),
      $atts, $tag);

  return $wporg_atts['id'] . $wporg_atts['type'] . $wporg_atts['title'] . $wporg_atts['bColor'] . $wporg_atts['sColor'];
}
add_shortcode('fbm', 'fmb_reviewbox_shortcode');
