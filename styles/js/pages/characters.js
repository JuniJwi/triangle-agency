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

          // old way of doing this. TODO: Remove when everyone's sheets are updated.
          if (profile.relationships.includes(';;;')) {
            // our rels column has a textjoin of all relationships
            // we need to put it back into array form
            let relSplit = profile.relationships.split(';;;');
            
            const numCols = 8; // Name, Hide,	Updated,	Network Lvl,	Relationship,	Bonus,	Bonus Description,	Description
            let relElement = '';

            for (let i = 0; i < relSplit.length; i += numCols) {
              let rel = relSplit.slice(i, i + numCols);

              if (rel[1] === 'FALSE') { // hiding = FALSE
                // Set the character link
                const charLink = charadex.url.addUrlParameters(
                  charadex.url.getPageUrl(charadex.page.masterlist.sitePage),
                  { profile: charadex.tools.scrub(rel[0]) });
                const relTitle = rel[4] ? rel[4] : '--';
                const relText = rel[7] ? charadex.manageData.convertMarkdown(rel[7]) : `<span class="text-muted">--</span>`;
                const bonusTitle = rel[5] ? rel[5] : '--';
                const bonusText = rel[6] ? charadex.manageData.convertMarkdown(rel[6]) : `<span class="text-muted">--</span>`;
                let networked = '';
                if (!isNaN(rel[3])) {
                  const pipfilled = `<i class="fa-solid fa-circle fa-xs"></i>`
                  const pipempty = `<i class="fa-regular fa-circle fa-xs"></i>`
                  networked = pipfilled.repeat(Number(rel[3])) + pipempty.repeat(9 - Number(rel[3]));
                }
                // Create the DOM elements
                relElement += `<div class="col-md-4 col-12 p-2">
                                <div class="card bg-body-tertiary h-100">
                                  <div class="card-header text-center d-flex">
                                    <div class="m-auto z-1">
                                      <a href="${charLink}"><h3 class="card-title mb-0">${rel[0]} (${relTitle})</h3></a>
                                    </div>
                                  </div>
                                  <div class="card-body d-flex flex-column flex-fill">
                                    <div>${relText}</div>
                                    <div class="alert alert-warning mt-2 mb-0 px-3 py-2">
                                      <h3 class="span-header text-center text-warning mb-0">${bonusTitle}</h3>
                                      <div class="text-center text-warning">${networked}</div>
                                      <div>${bonusText}</div>
                                    </div>
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

          } else {
            // -------------------------- //
            // gather bonus info
            // ---------------------------//
            // gather connection bonus data
            // TODO: Make this into a function?
            let connectionData = await charadex.importSheet('connection', charadex.sheet.sysid);
            let connectionInfo = {}
            for (const connection of connectionData) {
              connectionInfo[connection.name] = connection.description
            }

            console.log("CONNECTION DATA:", connectionData);

            let relJSON = JSON.parse(profile.relationships);
            let $relContainer = $('#rel-container');
            const $relTemplate = $('#rel-item');
            
            // Name, Hide,	Updated,	Network Lvl,Relationship,	Bonus,	Bonus Description,	Description
            for (let ix in relJSON['Name']) {
              if (relJSON['Name'][ix] != '' && relJSON['Hide'][ix] === 'FALSE') {
                // Set the character link
                const charLink = charadex.url.addUrlParameters(
                  charadex.url.getPageUrl(charadex.page.masterlist.sitePage),
                  { profile: charadex.tools.scrub(relJSON['Name'][ix]) });
                const relTitle = relJSON['Relationship'][ix] ? relJSON['Relationship'][ix] : '--';
                const relText = relJSON['Description'][ix] ? charadex.manageData.convertMarkdown(relJSON['Description'][ix]) : `<span class="text-muted">--</span>`;
                const bonusTitle = relJSON['Bonus'][ix] ? relJSON['Bonus'][ix] : '--';

                var date = charadex.tools.serialNumberToDate(Number(relJSON['Updated'][ix]));
                date = new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit"
                }).format(date);

                let networked = '';
                if (!isNaN(relJSON['Network Lvl'][ix])) {
                  const pipfilled = `<i class="fa-solid fa-circle fa-xs"></i>`
                  const pipempty = `<i class="fa-regular fa-circle fa-xs"></i>`
                  networked = pipfilled.repeat(Number(relJSON['Network Lvl'][ix])) + pipempty.repeat(9 - Number(relJSON['Network Lvl'][ix]));
                }
                // Create the DOM elements
                let $relCard = $relTemplate.clone(true);
                $relCard.show().attr('display: "flex";');
                $relCard.children('.rel-name').text(relJSON['Name'][ix]);
                $relCard.children('.rel-link').attr('href', charLink);
                $relCard.children('.rel-title').text(relTitle);
                $relCard.children('.rel-date').text(date);
                $relCard.children('.rel-networked').html(networked);
                $relCard.children('.rel-bonus').text(bonusTitle);
                $relCard.children('.rel-text').html(relText);
                $relCard.children('.rel-popover').attr('data-bs-content', connectionInfo[relJSON['Bonus'][ix]])

                $relCard.appendTo($relContainer);

                // -- update rel fields
                //    set rel visible

                // -- create title link

                // relElement += `<div class="col-md-4 col-12 p-2">
                //                 <div class="card bg-body-tertiary h-100">
                //                   <div class="card-header text-center d-flex">
                //                     <div class="m-auto z-1">
                //                       <a href="${charLink}"><h3 class="card-title mb-0">${relJSON['Name'][ix]} (${relTitle})</h3></a>
                //                     </div>
                //                   </div>
                //                   <div class="card-body d-flex flex-column flex-fill">
                //                     <div>${relText}</div>
                //                     <div class="alert alert-warning mt-2 mb-0 px-3 py-2">
                //                       <h3 class="span-header text-center text-warning mb-0">${bonusTitle}</h3>
                //                       <div class="text-center text-warning">${networked}</div>
                //                       <div>${connectionInfo[relJSON['Bonus'][ix]]}</div>
                //                     </div>
                //                   </div>
                //                   <div class="card-footer text-muted small">
                //                     <div class="row">
                //                       <div class="col">Last Updated:</div>
                //                       <div class="col-auto">${dateFormatted}</div>
                //                     </div>
                //                   </div>
                //                 </div>
                //               </div>`
              }
            }
            // $('#rel-container').html(relElement);
          }
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

  // init popovers
  $('[data-bs-toggle="popover"]').popover();
  $('[data-bs-toggle="popover"]').on('keydown', function (e) {
    if (e.code === "Enter") {
      e.preventDefault();
      $(this).popover('toggle');
    }
  });

  charadex.tools.loadPage('.softload', 100);
});