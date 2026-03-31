/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from '../charadex.js';


/* ==================================================================== */
/* Load
======================================================================= */
document.addEventListener("DOMContentLoaded", async () => {
  let chapterDialogue = {};

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
        dialogueData = dialogueData.filter((dialogue) => dialogue['chapter'] == pageParameter);
        
        dialogueData = charadex.manageData.sortArray(dialogueData, 'order');

        for (const dialogue of dialogueData) {
          chapterDialogue[dialogue.chapter].extend(dialogue);
        }

        console.log("DIALOGUE DATA:", chapterDialogue);

      }
  });

  // -------------------------- //
  // game initialization
  // ---------------------------//
  // select game objects
  let $sprite = $('#sprite');;
  let $environment = $('#environment');
  let $speaker = $('#speaker');
  let $speech = $('#speech');

  let scene = 0;
  let order = 0;
  let ix = 0;

  const speed = 4; // speed of text scroll
  let char = 0; // number of characters visible


  $('#prev-button').on('click', () => {
  });
  $('#next-button').on('click', () => {
    if (char < chapterDialogue[ix].text.length) {
      char = chapterDialogue[ix].text.length;
    } else {
      char = 0;
      ix += 1;
    }
  });

  // show page

  charadex.tools.loadPage('.softload', 100);
});