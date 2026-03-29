/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from '../charadex.js';


/* ==================================================================== */
/* Load
======================================================================= */
document.addEventListener("DOMContentLoaded", async () => {
  let dex = await charadex.initialize.page(
    null,
    charadex.page.masterlist,
    null,
    async (listData) => {

      console.log("LIST DATA:", listData); 
      if (listData.type == 'profile') {
        
        $('#main-container').css('height','auto');
        $('#anchor-nav').show();

        let profile = listData.profileArray[0];

        // Inventory
        let inventoryData = await charadex.manageData.readInventoryLog(profile.characterlog);

        charadex.initialize.groupGallery(
          charadex.page.masterlist.characterConfig,
          inventoryData,
          'type',
          charadex.url.getPageUrl('items')
        );
        console.log('Initialized inventory gallery!');

        // Logs
        if (charadex.tools.checkArray(profile.characterlog)) {
          let logs = await charadex.initialize.page(
            profile.characterlog,
            charadex.page.masterlist.relatedData['character log']
          );
          console.log('Initialized related logs!');
        }

        // Set the player url
        let pageUrl = charadex.url.getPageUrl(charadex.page.player.sitePage);
        $('.playerlink').attr('href', charadex.url.addUrlParameters(pageUrl, { profile: profile.player }));

        // Oh lordt, it's rels time =========================================
        if (profile.relationships && typeof profile.relationships === 'string') {

          // our rels column has a textjoin of all relationships
          // we need to put it back into array form
          let relSplit = profile.relationships.split(';;;');
          
          const numCols = 5;
          let relElement = '';

          for (let i = 0; i < relSplit.length; i += numCols) {
            let rel = relSplit.slice(i, i + numCols);

            if (rel[1] === 'FALSE') { // hiding = FALSE
              // Set the character link
              let charLink = charadex.url.addUrlParameters(
                charadex.url.getPageUrl(charadex.page.masterlist.sitePage),
                { profile: charadex.tools.scrub(rel[0]) });
              let relTitle = rel[3] ? rel[3] : '--';
              let relText = rel[4] ? charadex.manageData.convertMarkdown(rel[4]) : `<span class="text-muted">--</span>`;
              // Create the DOM elements
              relElement += `<div class="col-md-4 col-12 p-2">
                              <div class="card bg-body-tertiary h-100">
                                <div class="card-header text-center d-flex">
                                  <div class="m-auto z-1">
                                    <a class="stretched-link" href="${charLink}">${rel[0]}</a>
                                  </div>
                                </div>
                                <div class="card-body d-flex flex-column flex-fill">
                                  <h3 class="span-header">${relTitle}</h3>
                                  <div>${relText}</div>
                                </div>
                                <div class="card-footer text-muted small">
                                  <div class="row">
                                    <div class="col">Last Updated:</div>
                                    <div class="col-auto">${rel[2]}</div>
                                  </div>
                                </div>
                              </div>
                             </div>`
            }
          }
          $('#rel-container').html(relElement);
        }
      }
  });

  // open collapsed items when clicking on the corresponding link
  var hash = $(location).attr('hash');
  if (hash) {
    var $hash = $(hash);
    var $parents = $hash.parents('.collapse');
    $parents.collapse('show');

    window.location = hash;
  }

  charadex.tools.loadPage('.softload', 100);
});