<?php

/* CUSTOM FUNCTIONS */

// add new type
function fbm_add_type($type, $id, $bColor, $sColor, $title, $bottom_text) {

  $boxes = get_option('reviewboxes');

  $updatedTypes = $boxes;

  array_push($updatedTypes, [
    'id' => $id,
    'type' => $type,
    'title' => $title,
    'bColor' => $bColor,
    'sColor' => $sColor,
    'bottom_text' => $bottom_text
  ]);


  update_option('reviewboxes', $updatedTypes, true);
}

// check if option exists function
function fbm_option_exists($name, $site_wide=false){

  global $wpdb;
  return $wpdb->query("SELECT * FROM ". ($site_wide ? $wpdb->base_prefix : $wpdb->prefix). "options WHERE option_name ='$name' LIMIT 1");
}

// delete type
function fbm_delete_type($value) {

  $boxes = get_option('reviewboxes'); // grab all types currently in array

  foreach($boxes as $key => $box) { // loop through array

    foreach($box as $bo) { // loop through inner array to check value

      if ($bo === $value) { // check if inner array value is the same as chosen value

        unset($boxes[$key]); // remove array val from array
        update_option('reviewboxes', $boxes); // update with removed array value
        break;
        echo "deleted";
      }
    }
  }
}

// update options settings
function fbm_update_settings($apiKey, $classes, $type, $title, $bottom) {

   if(!fbm_option_exists('fbm_options')) {

     add_option('fbm_options', []);
   }
   $updatedOptions = ['api_key' => $apiKey, 'classes' => $classes, 'type' => $type, 'title' => $title, 'bottom' => $bottom];

   update_option('fbm_options', $updatedOptions, true);
}

/* WORDPRESS FUNCTIONS */


// load scripts from plugin to theme
add_action('wp_enqueue_scripts', 'fbm_load_scripts_to_theme');
function fbm_load_scripts_to_theme() {

    wp_enqueue_script('my_custom_script1', plugin_dir_url(__FILE__) . 'includes/kartik/js/star-rating.js', array('jquery'), '', true);
    wp_enqueue_script('my_custom_script2', plugin_dir_url(__FILE__) . 'includes/js/api.js', array('jquery'), '', true);

    wp_enqueue_style('bootstrap_fbm_3', plugin_dir_url(__FILE__) . 'includes/css/font.css' );
    wp_enqueue_style('bootstrap_fbm', plugin_dir_url(__FILE__) . 'includes/css/bootstrap.css' );
    wp_enqueue_style('stars_fbm', plugin_dir_url(__FILE__) . 'includes/kartik/css/star-rating.css' );
    wp_enqueue_style('main_fbm', plugin_dir_url(__FILE__) . 'includes/css/fbm.css' );
}

// load scripts to plugin admin page
function fbm_load_scripts_to_plugin_page() {

  wp_enqueue_script('my_custom_script1', plugin_dir_url(__FILE__) . 'includes/kartik/js/star-rating.js', array('jquery'), '', true);
  wp_enqueue_script('my_custom_script2', plugin_dir_url(__FILE__) . 'includes/js/api.js', array('jquery'), '', true);

  wp_enqueue_style('bootstrap_fbm_3', plugin_dir_url(__FILE__) . 'includes/css/font.css' );
  wp_enqueue_style('bootstrap_fbm', plugin_dir_url(__FILE__) . 'includes/css/bootstrap.css' );
  wp_enqueue_style('stars_fbm', plugin_dir_url(__FILE__) . 'includes/kartik/css/star-rating.css' );
  wp_enqueue_style('main_fbm', plugin_dir_url(__FILE__) . 'includes/css/fbm.css' );
}

add_action('admin_enqueue_scripts', 'fbm_load_scripts_to_plugin_page');

// add code to footer in theme
add_action('wp_footer', 'fbm_add_script_to_footer');
function fbm_add_script_to_footer(){
?>
  <script type='text/javascript'>

      document.addEventListener("DOMContentLoaded", function(event) {
          FBM.init({
              apiKey: "<?php echo get_option('fbm_options')['api_key']; ?>", // your API key
              classesTitle: "<?php echo get_option('fbm_options')['title']; ?>", // title default for classes
              classesType: <?php echo (int) get_option('fbm_options')['type']; ?>, // type default for classes
              classes: <?php echo get_option('fbm_options')['classes']; ?>, // classes enable
              bottomText: "<?php echo get_option('fbm_options')['bottom']?>", // bottom text
              idElements: [
                <?php
                    // load all types
                    $types = get_option('reviewboxes');

                    // loop through each reviewbox ID
                    foreach($types as $type) {

                      $id = $type['id'];
                      $typee = (int)$type['type'];
                      $background_color = $type['bColor'];
                      $text_color = $type['sColor'];
                      $title = $type['title'];
                      $bottom_text = $type['bottom_text'];

                      $code = ["$id", $typee, "$title", "$background_color", "$text_color", "$bottom_text"];
                      echo json_encode($code);
                      echo ",";
                    }
                ?>
              ]
          });
        });
  </script>
<?php
};


/*
  AJAX CALLS FOR UPDATING OPTIONS
  the add actions has to start with add_action(wp_{FUNCTION_NAME_TO_ADD},  {FUNCTION_NAME_TO_ADD})
*/

add_action('wp_ajax_t4a_fbm_ajax_call', 't4a_fbm_ajax_call');  // for admins only
add_action('wp_ajax_nopriv_t4a_fbm_ajax_call', 't4a_fbm_ajax_call'); // for ALL users
add_action('wp_ajax_t4a_fbm_ajax_call_remove', 't4a_fbm_ajax_call_remove');  // for admins only
add_action('wp_ajax_nopriv_t4a_fbm_ajax_call_remove', 't4a_fbm_ajax_call_remove'); // for ALL users
add_action('wp_ajax_t4a_fbm_ajax_call_options', 't4a_fbm_ajax_call_options');  // for admins only
add_action('wp_ajax_nopriv_t4a_fbm_ajax_call_options', 't4a_fbm_ajax_call_options'); // for ALL users

function t4a_fbm_ajax_call(){

  $bColor = sanitize_text_field($_POST['background_color']);
  $sColor = sanitize_text_field($_POST['text_color']);
  $type = sanitize_text_field($_POST['type']);
  $id = sanitize_text_field($_POST['id']);
  $bottom_text = sanitize_text_field($_POST['bottom_text']);
  $title = sanitize_text_field($_POST['title']);

  fbm_add_type($type, $id, $bColor, $sColor, $title, $bottom_text);

  // var_dump(get_option('reviewboxes'));

  wp_die(); // this is required to terminate immediately and return a proper response
}


// remove ID box from option
function t4a_fbm_ajax_call_remove(){

  // echo $_POST[id];

  fbm_delete_type(sanitize_text_field($_POST['id']));

  wp_die(); // this is required to terminate immediately and return a proper response
}


// add options
function t4a_fbm_ajax_call_options() {

  // echo $_POST['apiKey'];

  $bottom = sanitize_text_field($_POST['bottom']);
  $title = sanitize_text_field($_POST['title']);
  $apiKey = sanitize_text_field($_POST['apiKey']);
  $classes = sanitize_text_field($_POST['classes']);
  $type = sanitize_text_field($_POST['type']);

  fbm_update_settings($apiKey, $classes, $type, $title, $bottom);

  // var_dump(get_option('fbm_options'));
  wp_die();// this is required to terminate immediately and return a proper response
}
