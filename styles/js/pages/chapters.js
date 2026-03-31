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
    charadex.page.chapters,
    null,
    async (listData) => {

      console.log("LIST DATA:", listData); 
      if (listData.type == 'profile') {
        // we are viewing the content of the chapter chapter

        // chapter title from url arguments
        let pageParameter = charadex.url.getUrlParameters().get('profile');

        // gather dialogue with the same chapter title
        let dialogueData = await charadex.importSheet('dialogue');

        let chapterDialogue = dialogueData.filter((dialogue) => dialogue['chapter'] == pageParameter);
        console.log(chapterDialogue);

      }
  });

  charadex.tools.loadPage('.softload', 100);
});