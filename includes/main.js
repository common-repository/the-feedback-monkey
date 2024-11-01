
jQuery(document).ready(function() {

  // add new box
  jQuery('.fbm-type-submit').on('click', (e)=> {

    e.preventDefault();

    let type = jQuery('.fbm_reviewbox_type').val();
    let background_color = jQuery('#fbm-type-background_color').val();
    let text_color = jQuery('#fbm-type-text_color').val();
    let id = jQuery('.fbm_reviewbox_id').val();
    let title = jQuery('#fbm_reviewbox_title').val();
    let bottom_text = jQuery('#fbm_reviewbox_bottom_text').val();

    // ajax request to save new box
    jQuery.ajax({
      url: ajaxurl, // this is the object instantiated in wp_localize_script function (dont have to do anything, does this automatically)
      type: 'POST',
      data:{
        action: 't4a_fbm_ajax_call', // name of function to call (ajax)
        type: type,
        background_color: background_color,
        text_color: text_color,
        id: id,
        title: title,
        bottom_text: bottom_text
      },
      success: function( data ){

        console.log( data );
      }
    });

    // remove current value in box
    jQuery('.fbm-type').val('');

    // add div to table
    jQuery('.fbm-preview-tbody').append(`
      <tr>
        <td><input type="text" class="fbm-shortcode" value='<div id="${id}"></div>' style=" height: 20px; background: lightgray; padding: 4px; border-radius: 3px; color: black !important; width: 45%;" readonly></td>
        <td><a class="btn btn-danger delete-type" style="color: white;" id="${id}">Delete</a></td>
      </tr>
    `);
  });

  // add settings / update settings
  jQuery('.fbm_options_form').on('click', (e) => {

    e.preventDefault();

    let apiKey = jQuery('.fbm_api_key').val();
    let optionClass;
    let type = jQuery('.fbm_setting_type').val();
    let title = jQuery('.fbm_title_text_default').val();
    let bottom = jQuery('.fbm_bottom_text_default').val();

    if (jQuery('.fbm_enable_classes').is(":checked")) {
      optionClass = 1;
    } else {
      optionClass = 0;
    }

    // update ajax
    jQuery.ajax({
      url: ajaxurl, // this is the object instantiated in wp_localize_script function (dont have to do anything, does this automatically)
      type: 'POST',
      data:{
        action: 't4a_fbm_ajax_call_options', // name of function to call (ajax)
        apiKey: apiKey,
        classes: optionClass,
        type: type,
        title: title,
        bottom: bottom
      },
      success: function( data ){
        //Do something with the result from server
        console.log( data );
      }
    });
  });

  // delete a type on click
  jQuery('.fbm-type-delete').on('click', (e)=> {

    e.preventDefault();

    let delType = jQuery('.delete-fbm-val').val();

    deleteType(delType);
  });


  // delete a type
  function deleteType(id) {

    jQuery.ajax({
      url: ajaxurl,
      type: 'POST',
      data:{
        action: 't4a_fbm_ajax_call_remove',
        id: id
      },
      success: function( data ){

        console.log( data );
      }
    });

    jQuery('.fbm-delete-type').val('');
  }

  // delete element from table
  jQuery(".delete-type").on("click", (e)=> {

    let valToDelete = jQuery(e.target).attr('id'); // 'this' does not work, event target does
    jQuery(e.target).parent().parent().remove();
    deleteType(valToDelete);

  });

  // copy on selected div
  jQuery('.fbm-shortcode').on('click', (e) => {

    let el = jQuery(e.target);
    el.focus();
    el.select();
    // el.setSelectionRange(0, el.value.length)
    document.execCommand("copy");
});


  // ********** Pages **********

  // hide all
  function hideAllPages() {

    jQuery('.fbm-settings-page').hide();
    jQuery('.fbm-shortcode-page').hide();
    jQuery('.fbm-add-shortcode-page').hide();
  }


  function showShortcodePage() {

    hideAllPages();
    jQuery('.fbm-shortcode-page').show();
  }


  function showSettingsPage() {

    hideAllPages();
    jQuery('.fbm-settings-page').show();
  }

  function showAddShortcodePage() {

    hideAllPages();
    jQuery('.fbm-add-shortcode-page').show();
  }

  jQuery('.show-shortcode-button').on('click', ()=> {

    hideAllPages();
    showShortcodePage();
  });

  jQuery('.show-settings-button').on('click', ()=> {

    hideAllPages();
    showSettingsPage();
  });

  jQuery('.show-add-shortcode-button').on('click', ()=> {

    hideAllPages();
    showAddShortcodePage();
  });

  // show settings page first
  hideAllPages();
  showSettingsPage();


  // update preview every few seconds
  setInterval(function() {
     updatePreview();
   }, 4000); // 5 seconds

// update preview
function updatePreview() {
  let type = jQuery('.fbm_reviewbox_type').val();
  let background_color = jQuery('#fbm-type-background_color').val();
  let text_color = jQuery('#fbm-type-text_color').val();
  let id = jQuery('.fbm_reviewbox_id').val();
  let title = jQuery('#fbm_reviewbox_title').val();
  let bottom_text = jQuery('#fbm_reviewbox_bottom_text').val();

  // show correct reviewbox type
  if (type == 1) {

    let code = getTypeCode(1, title, background_color, text_color, bottom_text);

    jQuery('.fbm-add-preview').html(code);
  } else if (type == 2) {

    let code = getTypeCode(2, title, background_color, text_color, bottom_text);

    jQuery('.fbm-add-preview').html(code);
  }

}
  jQuery('.fbm_reviewbox_type').on('change', ()=> {

    updatePreview();
  });

  // remove preview if no input
  jQuery('.fbm_reviewbox_type').on('keydown', ()=> {

    let val = jQuery('.fbm_reviewbox_type').val();

    jQuery('.fbm-add-preview').text("");

  });
});


// don't load after done loading otherwise html js wont be able to see this
// add existing divs to table
function addExisting(types) {

  jQuery.each(types, (key, value) => {

    jQuery('.fbm-preview-tbody').append(`
      <tr>
        <td><input type="text" class="fbm-shortcode" value='<div id="${value.id}"></div>' style=" height: 20px; background: lightgray; padding: 4px; border-radius: 3px; color: black !important; width: 45%;" readonly></td>
        <td><a class="btn btn-danger delete-type" style="color: white;" id="${value.id}">Delete</a></td>
      </tr>
    `);
  });
}


// stored local types for preview
function getTypeCode(type, title, bColor, tColor, bottom_text) {

  var type1 = `
    <a href="#" target="__blank"style="width:250px !important; color: inherit; text-decoration: none; display: flex; justify-content: center; margin-right: auto; margin-left: auto; text-decoration: none; background: inherit;">
    <div class="fm-box" style="width: 250px; display: flex; flex-direction: column;">
      <h4 style="display: flex; justify-content: center; align-items: center; font-weight: bold;">${title}</h4>
      <div class="fm-review-box">
          <div class="fm-review-box-top" style="background-color: ${bColor} !important;">
              <div class="fm-review-box-top-left">
    <div class="rating-container theme-krajee-fas rating-sm rating-animate is-display-only"><div class="rating-stars" title="5 Stars"><span class="empty-stars"><span class="star"><i class="far fa-star"></i></span><span class="star"><i class="far fa-star"></i></span><span class="star"><i class="far fa-star"></i></span><span class="star"><i class="far fa-star"></i></span><span class="star"><i class="far fa-star"></i></span></span><span class="filled-stars" style="width: 100%;"><span class="star"><i class="fas fa-star"></i></span><span class="star"><i class="fas fa-star"></i></span><span class="star"><i class="fas fa-star"></i></span><span class="star"><i class="fas fa-star"></i></span><span class="star"><i class="fas fa-star"></i></span></span><input name="review_stars" value="4.3" class="review_stars w-100 border-0 rating-input" data-show-caption="false" data-size="sm"></div></div>
              </div>
              <div class="fm-review-box-top-right">
                  <span class="fm-review-box-rating" style="color: ${tColor} !important;">5</span><span class="fm-review-box-static-rating" style="color: ${tColor} !important;"> /5</span>
              </div>
          </div>
          <div class="fm-review-box-bottom">
              <p class="fm-review-reviews"><span>5</span> ${bottom_text}</p>
          </div>
      </div>
    </div>
    </a>
`;

  var type2 = `
  <div style="min-width: 400px; font-family: 'Quicksand', sans-serif; color: ${tColor} !important;">
    <div class="d-flex flex-column justify-content-center p2 card w-md-100 shadow-none" style="background-color: ${bColor} !important;">
      <div class="d-flex flex-column justify-content-center align-items-center p-4">
        <h4 class="font-weight-bold">${title}</h4>
            <div class="rounded-lg d-flex p-3 align-items-center font-weight-bold">
                <div class="fm-review-box-top-left">
    <div class="rating-container theme-krajee-fas rating-sm rating-animate is-display-only"><div class="rating-stars" title="5 Stars"><span class="empty-stars"><span class="star"><i class="far fa-star"></i></span><span class="star"><i class="far fa-star"></i></span><span class="star"><i class="far fa-star"></i></span><span class="star"><i class="far fa-star"></i></span><span class="star"><i class="far fa-star"></i></span></span><span class="filled-stars" style="width: 100%;"><span class="star"><i class="fas fa-star"></i></span><span class="star"><i class="fas fa-star"></i></span><span class="star"><i class="fas fa-star"></i></span><span class="star"><i class="fas fa-star"></i></span><span class="star"><i class="fas fa-star"></i></span></span><input name="review_stars" value="4.3" class="review_stars w-100 border-0 rating-input" data-show-caption="false" data-size="sm"></div></div>                </div>
                <div class="fm-review-box-top-right">
                    <span style="font-size: 20px;" class="ml-2">5</span><span style="letter-spacing: 3px;"  style="color: ${tColor} !important;"> /5</span>
                </div>
            </div>
            <div style="margin-top: 10px; display: flex; justify-content: center;">
                <p class="font-weight-bold" style="font-size: 12px; color: ${tColor} !important;"><span>5</span> ${bottom_text}</p>
            </div>
            <!-- second area -->
            <div class="card-body w-100">
              <!-- row -->
              <div class="row my-2 d-flex flex-nowrap">
                <div class="col-3 col-md-2 col-lg-2 text-right d-flex ml-auto d-grid  justify-content-end">
                  <i class="fas fa-star fa-fw percentage_star" style="font-size: 16px; color: #FFD54F;"></i>
                  <span class="pl-2 text-muted" style="font-size: 13px; color: ${tColor} !important;">5</span>
                </div>
                <div class="col-6 col-md-7 col-lg-8 p-0 progress my-auto">
                  <div class="progress-bar bg-warning bg-stars" role="progressbar" aria-valuenow="5" aria-valuemin="0" aria-valuemax="100" style="width: 60%; background: #FFD54F !important;">
                  </div>
                </div>
                <div class="col-3 col-md-3 col-lg-2 text-left text-nowrap">
                  <span style="font-size: 13px; color: ${tColor} !important;" class="text-muted">60%</span>
                </div>
              </div>
              <!-- /row -->
              <!-- row -->
              <div class="row my-2 d-flex flex-nowrap=">
                <div class="col-3 col-md-2 col-lg-2 text-right d-flex ml-auto d-grid  justify-content-end">
                  <i class="fas fa-star fa-fw percentage_star" style="font-size: 16px; color: #FFD54F;"></i>
                  <span class="pl-2 text-muted" style="font-size: 13px; color: ${tColor} !important;">4</span>
                </div>
                <div class="col-6 col-md-7 col-lg-8 p-0 progress my-auto">
                  <div class="progress-bar bg-warning bg-stars" role="progressbar" aria-valuenow="20" aria-valuemin="0" aria-valuemax="100" style="width: 20%; background: #FFD54F !important;">
                  </div>
                </div>
                <div class="col-3 col-md-3 col-lg-2 text-left text-nowrap">
                  <span style="font-size: 13px; color: ${tColor} !important;" class="text-muted">20%</span>
                </div>
              </div>
              <!-- /row -->
              <!-- row -->
              <div class="row my-2 d-flex flex-nowrap=">
                <div class="col-3 col-md-2 col-lg-2 text-right d-flex ml-auto d-grid  justify-content-end">
                  <i class="fas fa-star fa-fw percentage_star" style="font-size: 16px; color: #FFD54F;"></i>
                  <span class="pl-2 text-muted" style="font-size: 13px; color: ${tColor} !important;">3</span>
                </div>
                <div class="col-6 col-md-7 col-lg-8 p-0 progress my-auto">
                  <div class="progress-bar bg-warning bg-stars" role="progressbar" aria-valuenow="10" aria-valuemin="0" aria-valuemax="100" style="width: 10%; background: #FFD54F !important;">
                  </div>
                </div>
                <div class="col-3 col-md-3 col-lg-2 text-left text-nowrap">
                  <span style="font-size: 13px; color: ${tColor} !important;" class="text-muted">10%</span>
                </div>
              </div>
              <!-- /row -->
              <!-- row -->
              <div class="row my-2 d-flex flex-nowrap=">
                <div class="col-3 col-md-2 col-lg-2 text-right d-flex ml-auto d-grid  justify-content-end">
                  <i class="fas fa-star fa-fw percentage_star" style="font-size: 16px; color: #FFD54F;"></i>
                  <span class="pl-2 text-muted" style="font-size: 13px; color: ${tColor} !important;">2</span>
                </div>
                <div class="col-6 col-md-7 col-lg-8 p-0 progress my-auto">
                  <div class="progress-bar bg-warning bg-stars" role="progressbar" aria-valuenow="5" aria-valuemin="0" aria-valuemax="100" style="width: 5%; background: #FFD54F !important;">
                  </div>
                </div>
                <div class="col-3 col-md-3 col-lg-2 text-left text-nowrap">
                  <span style="font-size: 13px; color: ${tColor} !important;" class="text-muted">5%</span>
                </div>
              </div>
              <!-- /row -->
              <!-- row -->
              <div class="row my-2 d-flex flex-nowrap=">
                <div class="col-3 col-md-2 col-lg-2 text-right d-flex ml-auto d-grid  justify-content-end">
                  <i class="fas fa-star fa-fw percentage_star" style="font-size: 16px; color: #FFD54F;"></i>
                  <span class="pl-2 text-muted" style="font-size: 13px; color: ${tColor} !important;">1</span>
                </div>
                <div class="col-6 col-md-7 col-lg-8 p-0 progress my-auto">
                  <div class="progress-bar bg-warning bg-stars" role="progressbar" aria-valuenow="5" aria-valuemin="0" aria-valuemax="100" style="width: 5%; background: #FFD54F !important;">
                  </div>
                </div>
                <div class="col-3 col-md-3 col-lg-2 text-left text-nowrap">
                  <span style="font-size: 13px; color: ${tColor} !important;" class="text-muted">5%</span>
                </div>
              </div>
              <!-- /row -->
            </div>
      </div>
    </div>
  </div>
`;

  // return code to display on preview
  if (type == 1) {

    return type1;
  } else if (type == 2) {

    return type2;
  }
}
