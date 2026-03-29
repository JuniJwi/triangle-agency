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
    charadex.page.lore, 
    (arr) => {

      let pageUrl = charadex.url.getPageUrl(charadex.page.lore.sitePage);
      for (let lore of arr) {

        // Make the tags pretty and actually work <3
        lore.tags = lore.tags ? lore.tags.split(',') : [];
        let fancyTagArr = [];
        if (lore.tags.length >= 1) {
          for (let tag of lore.tags) {
            fancyTagArr.push(`<a href="${charadex.url.addUrlParameters(pageUrl, {tags: tag.trim()})}">#${tag.trim()}</a>`);
          }
        }
        lore.fancytags = fancyTagArr.join(' ');

      }
  });

  charadex.tools.loadPage('.softload', 100);
});