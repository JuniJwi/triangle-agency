/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from '../charadex.js';


/* ==================================================================== */
/* Load
======================================================================= */
document.addEventListener("DOMContentLoaded", async () => {
  let characterSprites = {};
  let chapterDialogue = {};

  let dex = await charadex.initialize.page(
    null,
    charadex.page.chapters,
    null,
    async (listData) => {

      console.log("LIST DATA:", listData); 
      if (listData.type == 'profile') {
        // we are viewing the content of the chapter chapter

        // get character portrait information
        let characterData = await charadex.importSheet('characters');
        for (const character of characterData) {

          const neutral = character['neutral'] ? character['neutral'] : "https://placehold.co/100x100/";

          for (const emotion in charadex.sheet.options.emotions) {
            characterSprites[character.name][emotion] = character[emotion] ? character[emotion] : neutral;
          }
        }

        console.log("CHARACTER SPRITES:", characterSprites);

        // chapter title from url arguments
        let pageParameter = charadex.url.getUrlParameters().get('profile');

        // gather dialogue with the same chapter title
        let dialogueData = await charadex.importSheet('dialogue');
        dialogueData = dialogueData.filter((dialogue) => dialogue['chapter'] == pageParameter);
        
        dialogueData = charadex.manageData.sortArray(dialogueData, 'order');

        for (const dialogue of dialogueData) {
          if (dialogue.scene in chapterDialogue) {
            chapterDialogue[dialogue.scene].push(dialogue);
          } else {
            chapterDialogue[dialogue.scene] = [dialogue];
          }
        }

        console.log("DIALOGUE DATA:", chapterDialogue);

      }
  });

  // -------------------------- //
  // game initialization
  // ---------------------------//
  // select game objects
  let $sprite = $('#sprite');;
  let $background = $('#background');
  let $speaker = $('#speaker');
  let $speech = $('#speech');

  let scene = 0;
  let order = 0;

  const speed = 4; // speed of text scroll
  let char = 0; // number of characters visible

  function updateView(dialogue) {
    $sprite.attr('href', characterSprites[dialogue.character][dialogue.emotion]);
  }
  function sceneChange(url) {
    // fade to black, change scene, then reveal again
    $background.css('background-image',`url("${url}")`);
  }

  $('#prev-button').on('click', () => {
    char = 0;
    order -= 1;
    if (order < 0) {
      scene -= 1;
      order = chapterDialogue[scene].length - 1;
    }
  });
  $('#next-button').on('click', () => {
    if (char < chapterDialogue[scene][order].text.length) {
      char = chapterDialogue[scene][order].text.length;
    } else {
      char = 0;
      order += 1;
      if (order >= chapterDialogue[scene].length) {
        order = 0;
        scene += 1;
      }
    }
  });

  // show page

  charadex.tools.loadPage('.softload', 100);
});