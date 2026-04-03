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
    charadex.page.items,
    async (arr) => {
      for (let item of arr) {
        // -- first, determine class styles based on category
        for (let ix in charadex.sheet.options.itemTypes) {
          if (charadex.sheet.options.itemTypes[ix] === item.type) {
            item.profileclass = charadex.sheet.options.itemTypeClass[ix];
            item.infoclass = charadex.sheet.options.itemTypeClass[ix];
            item.actionclass = charadex.sheet.options.itemTypeClass[ix];
          }
        }

        // -- different item types have different popover construction
        if (item.type === 'Ability') {
          item.infopopovertitle = item.question;
          item.infopopovercontent = `<ol>
                                        <li>${item.answer1} <i class="fa-solid fa-arrow-right"></i> ${item.page1}</li>
                                        <li>${item.answer2} <i class="fa-solid fa-arrow-right"></i> ${item.page2}</li>
                                      </ol>`;
          item.actionpopovertitle = item.action;
          item.action = `USE`;
          const success = item.success ? `<div class="col-12">
                                            <div class="alert alert-success">
                                              <h6>Success</h6>
                                              ${charadex.manageData.convertMarkdown(item.success)}
                                            </div>
                                          </div>` : '';
          const bonus = item.bonus ? `<div class="col-12">
                                        <div class="alert alert-info">
                                          <h6>${item.bonus}</h6>
                                          ${charadex.manageData.convertMarkdown(item.effect)}
                                        </div>
                                      </div>` : '';
          const failure = item.failure ? `<div class="col-12">
                                            <div class="alert alert-danger">
                                              <h6>Failure</h6>
                                              ${charadex.manageData.convertMarkdown(item.failure)}
                                            </div>
                                          </div>` : '';
          item.actionpopovercontent = `<div class="row">
                                          ${success}
                                          ${bonus}
                                          ${failure}
                                        </div>`;
        } else if (item.type === 'Requisition') {
          item.infopopovertitle = 'Info';
          item.infopopovercontent = item.question;
          item.actionpopovertitle = item.action;
          const success = item.success ? `<div class="col-12">
                                            <div class="alert alert-success">
                                              <h6>Success</h6>
                                              ${charadex.manageData.convertMarkdown(item.success)}
                                            </div>
                                          </div>` : '';
          const failure = item.failure ? `<div class="col-12">
                                            <div class="alert alert-danger">
                                              <h6>Failure</h6>
                                              ${charadex.manageData.convertMarkdown(item.failure)}
                                            </div>
                                          </div>` : '';
          item.actionpopovercontent = `<div class="row">
                                          ${success}
                                          ${failure}
                                        </div>`;
          
        } else {
          item.infoclass = 'disabled';
          item.actionpopovertitle = item.action;
          item.actionpopovercontent = item.description;
        }
      }
    }
  );

  charadex.tools.loadPage('.softload', 100);
});