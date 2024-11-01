<?php

// if uninstall.php is not called by WordPress, die
if (!defined('WP_UNINSTALL_PLUGIN')) {
    die;
}

// remove options on uninstall
delete_option("reviewboxes");
delete_option("fbm_options");
