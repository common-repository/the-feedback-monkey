
<?php

// delete_option('fbm_options');

// check if option exists
if(!fbm_option_exists('reviewboxes')) {

  add_option('reviewboxes', []);
}
?>

<div class="container">
  <div class="top-container">
      <img src="<?php echo plugin_dir_url( __FILE__ ) . 'includes/img/thefeedbackmonkey.svg'?>" alt="The Feedback Monkey" class="top-logo-img" />
      <div class="top-container-menu">
        <button class="btn btn-danger show-settings-button" >Settings</button>
        <button class="btn btn-danger show-shortcode-button">Custom reviewboxes</button>
        <button class="btn btn-danger show-add-shortcode-button">Add reviewbox</button>
      </div>
  </div>
  <hr />

  <!-- Settings -->
  <div class="fbm-settings-page">
    <form class="w-100">
      <div class="form-group row">
        <label for="api_key" class="col-4 col-form-label">API Key</label>
        <div class="col-8">
          <input id="fbm_api_key" name="fbm_api_key" value="<?php echo get_option('fbm_options')['api_key']; ?>" class="fbm_api_key w-50" type="text" class="form-control">
        </div>
      </div>
      <div class="form-group row">
        <label for="fbm_title_text_default" class="col-4 col-form-label">Default title</label>
        <div class="col-8">
          <input id="fbm_title_text_default" name="fbm_review" value="<?php echo (get_option('fbm_options')['title'] != "" ? get_option('fbm_options')['title'] : "Review" ); ?>" class="fbm_title_text_default w-50" type="text" class="form-control">
        </div>
      </div>
      <div class="form-group row">
        <label for="fbm_bottom_text_default" class="col-4 col-form-label">Default bottom text</label>
        <div class="col-8">
          <input id="fbm_bottom_text_default" name="fbm_bottom_text_default" value="<?php echo (get_option('fbm_options')['bottom'] != "" ? get_option('fbm_options')['bottom'] : "Reviews" ); ?>" class="fbm_bottom_text_default w-50" type="text" class="form-control">
        </div>
      </div>
      <div class="form-group row">
        <label for="api_key" class="col-4 col-form-label">Default type</label>
        <div class="col-8">
          <select name="fbm_setting_type" placeholder="1" type="text" class="form-control fbm_setting_type" required="required">
            <option value="1">Box 1</option>
            <option value="2">Box 2</option>
          </select>
        </div>
      </div>
      <div class="form-group row">
        <label class="col-4 col-form-label">Enable classes</label>
        <div class="col-8">
          <div class="custom-controls-stacked">
            <div class="custom-control custom-checkbox">
              <div class="row d-flex flex-start flex-column justify-content-center align-items-start">
                <input name="checkbox" id="checkbox_0" type="checkbox"  <?php echo (get_option('fbm_options')['classes'] == 1 ? "checked" : ""); ?> class="form-control fbm_enable_classes" value="">
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="form-group row">
        <div class="offset-4 col-8">
          <button name="submit" type="submit" class="btn btn-primary fbm_options_form">Submit</button>
        </div>
      </div>
    </form>
  </div>
  <!-- Add shortcode page -->
  <div class="fbm-add-shortcode-page">
    <form class="w-50">
      <div class="form-group row">
        <label for="fbm_reviewbox_title" class="col-4 col-form-label">Title</label>
        <div class="col-8">
          <input  name="fbm_reviewbox_title" placeholder="Reviews" id="fbm_reviewbox_title" type="text" class="form-control" required="required">
        </div>
      </div>
      <div class="form-group row">
        <label for="fbm_reviewbox_bottom_text" class="col-4 col-form-label">Bottom text</label>
        <div class="col-8">
          <input  name="fbm_reviewbox_bottom_text" placeholder="Total reviews" id="fbm_reviewbox_bottom_text" type="text" class="form-control" required="required">
        </div>
      </div>
      <div class="form-group row">
        <label for="fbm_reviewbox_type" class="col-4 col-form-label">Type</label>
        <div class="col-8">
          <select name="fbm_reviewbox_type" placeholder="1" type="text" class="form-control fbm_reviewbox_type" required="required">
            <option value="1">Box 1</option>
            <option value="2">Box 2</option>
          </select>
        </div>
      </div>
      <div class="form-group row">
        <label for="fbm_reviewbox_id" class="col-4 col-form-label">ID</label>
        <div class="col-8">
          <input  name="fbm_reviewbox_id" value="review-<?php echo substr(str_shuffle('0123456789'), 1, 5); ?>" readonly placeholder="Review-box-1" type="text" class="form-control fbm_reviewbox_id" required="required">
        </div>
      </div>
      <div class="form-group row">
        <label for="fbm-type-background_color" class="col-4 col-form-label">Background color</label>
        <div class="col-8">
          <input type="color" class="mt-2" name="fbm-type-background_color" id="fbm-type-background_color" class="fbm-type-background_color" value="#ffffff">
        </div>
      </div>
      <div class="form-group row">
        <label for="fbm-type-text_color" class="col-4 col-form-label">Text color</label>
        <div class="col-8">
          <input type="color" class="mt-2" name="fbm-type-text_color" id="fbm-type-text_color" class="fbm-type-textr_color">
        </div>
      </div>
      <div class="form-group row">
        <div class="offset-4 col-8">
          <button name="submit" type="submit" class="btn btn-primary fbm-type-submit">Submit</button>
        </div>
      </div>
    </form>
    <!-- Preview -->
    <div class="fbm-add-preview mx-auto" style="max-width: 400px;">
    </div>
    <!-- / Preview -->
  </div>

  <!-- Shortcodes page -->
  <div class="fbm-shortcode-page">
    <table class="table table-striped w-75 mx-auto">
        <thead>
            <tr>
                <th scope="col">Code</th>
                <th scope="col">Delete</th>
            </tr>
        </thead>
        <tbody class="fbm-preview-tbody"></tbody>
    </table>
  </div>
</div>


<?php
// get all custom review boxes (ids)
$boxes = get_option('reviewboxes');

?>
<script type="text/javascript">
  // load all type shorcodes here from db so we can use it in main.js
  var types = <?php echo json_encode($boxes); ?>;

  addExisting(types);
</script>
