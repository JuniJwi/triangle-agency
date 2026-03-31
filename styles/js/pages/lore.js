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

        // Make character links link to profile pages
        lore["mvplink"] = `<a href="${charadex.url.addUrlParameters(
          charadex.url.getPageUrl(charadex.page.masterlist.sitePage),
          { profile: charadex.tools.scrub(lore.mvp) })}">${lore.mvp}</a>`;

        lore["probationlink"] = `<a href="${charadex.url.addUrlParameters(
          charadex.url.getPageUrl(charadex.page.masterlist.sitePage),
          { profile: charadex.tools.scrub(lore.probation) })}">${lore.probation}</a>`;

        lore.participation = lore.participation ? lore.participation.split(', ') : [];
        let participationArr = [];
        for (let participant of lore.participation) {
          const url = charadex.url.addUrlParameters(
            charadex.url.getPageUrl(charadex.page.masterlist.sitePage),
            { profile: charadex.tools.scrub(participant) }
          );
          participationArr.push(`<a href="${url}">${participant}</a>`);
        }
        lore["participationlinks"] = participationArr.join(' ');
      }
  });

  charadex.tools.loadPage('.softload', 100);
});