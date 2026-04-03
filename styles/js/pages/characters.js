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

        // -------------------------- //
        // Inventory
        // ---------------------------//
        let inventoryData = await charadex.manageData.readInventoryLog(profile.characterlog);

        // Items
        charadex.initialize.groupGallery(
          charadex.page.masterlist.characterConfig,
          inventoryData,
          'type',
          charadex.url.getPageUrl('items')
        );
        console.log('Initialized inventory gallery!');

        // For each item, we have specific values we need to add.
        // -- first, determine class styles based on category
        for (let ix in charadex.sheet.options.itemType) {
          if (charadex.sheet.options.itemType[ix] === profile.type) {
            profile.class = charadex.sheet.options.itemTypeClass[ix];
          }
        }

        // -- different item types have different popover construction
        if (profile.type === 'Ability') {
          profile.actionpopovertitle = profile.action
          profile.actionpopovercontent = `<div class="row">
                                      <div class="col">
                                        <div class="alert alert-success">
                                          <h6>Success</h6>
                                          ${charadex.tools.convertMarkdown(profile.success)}
                                        </div>
                                      </div>
                                      <div class="col">
                                        <div class="alert alert-danger">
                                          <h6>Failure</h6>
                                          ${charadex.tools.convertMarkdown(profile.failure)}
                                        </div>
                                      </div>
                                      <div class="col-12">
                                        <div class="alert alert-info">
                                          <h6>${profile.bonus}</h6>
                                          ${charadex.tools.convertMarkdown(profile.effect)}
                                        </div>
                                      </div>
                                    </div>`
        } else if (profile.type === '') {
          
        } else {
          
        }

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

        // -------------------------- //
        // Relationships
        // ---------------------------//
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
            let connectionData = await charadex.importSheet('connection', charadex.sheet.sysid);
            let connectionInfo = {}
            for (const connection of connectionData) {
              connectionInfo[connection.name] = connection.description
            }

            console.log("CONNECTION DATA:", connectionData);

            function jsonEscape(str)  {
                return str.replace(/\n/g, "\\\\n").replace(/\r/g, "\\\\r").replace(/\t/g, "\\\\t");
            }

            let relJSON = JSON.parse(jsonEscape(profile.relationships));
            let relContainer = document.getElementById('rel-container');
            const relTemplate = document.querySelector('.rel-item');
            
            // Name, Hide,	Updated,	Network Lvl,Relationship,	Bonus,	Bonus Description,	Description
            for (let ix in relJSON['Name']) {
              if (relJSON['Name'][ix] != '' && relJSON['Hide'][ix] === 'FALSE') {

                // Create the DOM elements
                let relCard = relTemplate.cloneNode(true);

                // Title and profile link
                relCard.querySelector('.rel-link').textContent = relJSON['Name'][ix];
                relCard.querySelector('.rel-link').setAttribute('href', charadex.url.addUrlParameters(
                  charadex.url.getPageUrl(charadex.page.masterlist.sitePage),
                  { profile: charadex.tools.scrub(relJSON['Name'][ix]) }));

                // Rel status and description
                relCard.querySelector('.rel-desc').setAttribute('data-bs-title', relJSON['Relationship'][ix] ? relJSON['Relationship'][ix] : '--');
                const reldescription = relJSON['Description'][ix];
                relCard.querySelector('.rel-desc').setAttribute('data-bs-content', relJSON['Description'][ix] ? charadex.manageData.convertMarkdown(reldescription) : '--');

                // Connection bonus
                relCard.querySelector('.rel-bonus').textContent = relJSON['Bonus'][ix] ? relJSON['Bonus'][ix] : '--';
                relCard.querySelector('.rel-bonus').setAttribute('data-bs-content', relJSON['Bonus'][ix] ? charadex.manageData.convertMarkdown(connectionInfo[relJSON['Bonus'][ix]]) : '--');
                
                // We have to parse the "serial" date from google sheets.
                var date = charadex.tools.serialNumberToDate(Number(relJSON['Updated'][ix]));
                // Then we can take the date object and format it for display.
                date = new Intl.DateTimeFormat("en-US", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit"
                }).format(date);
                relCard.querySelector('.rel-date').textContent = date;
                
                let networked = '';
                if (!isNaN(relJSON['Network Lvl'][ix])) {
                  const pipfilled = `<i class="fa-solid fa-circle fa-xs"></i>`
                  const pipempty = `<i class="fa-regular fa-circle fa-xs"></i>`
                  networked = pipfilled.repeat(Number(relJSON['Network Lvl'][ix])) + pipempty.repeat(9 - Number(relJSON['Network Lvl'][ix]));
                }
                relCard.querySelector('.rel-networked').innerHTML = networked;

                relContainer.append(relCard);

              }
            }
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