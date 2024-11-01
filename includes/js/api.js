/*
 *  TheFeedbackMonkey.com Widget API
 *  Author: Noah I.
 */

// jQuery( document ).ready(function() {
class FeedbackMonkey {
    init(options) {

        var url = `https://review.thefeedbackmonkey.com/api/get/stars/${options.apiKey}`;

         // fetch api
         fetch(url).then(function (response) {

             if (response.ok) {

                 response.json().then(function (data) {


                     if (data.code == 401) {
                         console.error("TheFeedbackMonkey: The API key is incorrect.")
                         return;
                     }

                     // all types code
                     var types = data.types;

                     // ********* fill in classes from array *********

                     // if classes are enabled
                     if (options.classes) {
                         // grab all classes
                         var eleClass = document.querySelectorAll(".monkey-review");

                         // if there are classes with monkey-review
                         if (eleClass) {

                             // loop through each class
                             eleClass.forEach(element => {

                                 // loop through each type in API
                                 types.forEach(apiType => {

                                     // if API type is equal to option type -> fill in type and post on page
                                     if (apiType.title == options.classesType) {

                                         var text = apiType.type // grab type html code

                                         // replace values inside of html to API data
                                          text = text.replaceAll('{{title}}', options.classesTitle);
                                          text = text.replaceAll('{{stars}}', data.average_stars);
                                          text = text.replaceAll('{{amount}}', data.review_amount);
                                          text = text.replaceAll('{{company}}', data.company_link);
                                          text = text.replaceAll('{{perFive}}', data.company_percentages.five);
                                          text = text.replaceAll('{{perFour}}', data.company_percentages.four);
                                          text = text.replaceAll('{{perThree}}', data.company_percentages.three);
                                          text = text.replaceAll('{{perTwo}}', data.company_percentages.two);
                                          text = text.replaceAll('{{perOne}}', data.company_percentages.one);
                                          text = text.replaceAll('{{bottom_text}}', options.bottomText);

                                         // place (updated) html code in chosen element
                                         element.innerHTML += text;
                                     }
                                 });
                             });
                         }
                     }

                     // ********* fill in IDs from array *********
                     if (options.idElements) {

                         // for each array item, add review
                         options.idElements.forEach(element => {

                             let elId = element[0]; // element ID on page
                             let elType = element[1]; // element TYPE wanted
                             let elTitle = element[2] // element title
                             let background_color = element[3];
                             let text_color = element[4];
                             let bottom_text = element[5];
                             let pageEl = document.getElementById(elId); // element to post

                             // validation, check if element exists
                             if (!pageEl) {
                                 console.log(
                                     `There is no ID with the value of '${elId}'`
                                 );
                                 return;
                             }

                             // loop through all types in API

                             types.forEach((type) => {

                                 // if the type in API equals type picked, we apply
                                 if (type.title == elType) {

                                     var text = type.type // grab type html code
                                     // console.log(text)
                                     // replace values inside of html to API data
                                     text = text.replaceAll('{{title}}', elTitle);
                                     text = text.replaceAll('{{stars}}', data.average_stars);
                                     text = text.replaceAll('{{amount}}', data.review_amount);
                                     text = text.replaceAll('{{company}}', data.company_link);
                                     text = text.replaceAll('{{perFive}}', data.company_percentages.five);
                                     text = text.replaceAll('{{perFour}}', data.company_percentages.four);
                                     text = text.replaceAll('{{perThree}}', data.company_percentages.three);
                                     text = text.replaceAll('{{perTwo}}', data.company_percentages.two);
                                     text = text.replaceAll('{{perOne}}', data.company_percentages.one);

                                     if (elTitle) {
                                       text = text.replaceAll('{{title}}', elTitle);
                                     } else {
                                       text = text.replaceAll('{{title}}', "Reviews");
                                     }

                                     if (bottom_text) {
                                       text = text.replaceAll('{{bottom_text}}', bottom_text);
                                     } else {
                                       text = text.replaceAll('{{bottom_text}}', "Reviews");
                                     }


                                     if (background_color) {

                                        text = text.replaceAll('{{background_color}}', background_color);

                                     } else {

                                        text = text.replaceAll('{{background_color}}', '#fff');
                                     }

                                     if (text_color) {

                                        text = text.replaceAll('{{text_color}}', text_color);
                                     } else {

                                        text = text.replaceAll('{{{text_color}}', '#FFD54F');
                                     }


                                     // place (updated) html code in chosen element
                                     document.getElementById(elId).innerHTML += text;
                                 }
                             });

                         });
                     }

                     stars();
                 });
             } else {
                 // response wasn't ok
                 console.error("TheFeedbackMonkey: Failed to load API. Is the API key correct?");
             }
         }).catch((error) => {
             console.log(error)
         });
     }
 }


   // fill in stars
   function stars() {
       jQuery(".review_stars").rating({
           theme: "krajee-fas",
           displayOnly: true,
           step: 0.5,
           language: "nl"
       });
       jQuery(".review_stars_give").rating({
           theme: "krajee-fas",
           displayOnly: false,
           step: 0.5,
           language: "nl"
       });
   }

    var FBM = new FeedbackMonkey();
// });
