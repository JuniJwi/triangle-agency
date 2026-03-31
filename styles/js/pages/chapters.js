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
          characterSprites[character.name] = {};
          const neutral = character['neutral'] ? character['neutral'] : "https://placehold.co/100x100/";

          for (const emotion of charadex.sheet.options.emotions) {
            characterSprites[character.name][emotion] = character[charadex.tools.scrub(emotion)] ? character[charadex.tools.scrub(emotion)] : neutral;
          }
        }

        console.log("CHARACTER SPRITES:", characterSprites);

        // chapter title from url arguments
        let pageParameter = charadex.url.getUrlParameters().get('profile');

        // gather dialogue with the same chapter title
        let dialogueData = await charadex.importSheet('dialogue');
        dialogueData = dialogueData.filter((dialogue) => charadex.tools.scrub(dialogue['chapter']) == pageParameter);
        
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

  let char = 0; // number of characters visible
  let charTimer;


  function updateView() {
    const dialogue = chapterDialogue[scene][order];
    $sprite.attr('src', characterSprites[dialogue.character][dialogue.emotion]);
    $background.css('background-image',`url("${dialogue.background}")`);
    $speaker.text(dialogue.character);
    $speech.html(charadex.manageData.convertMarkdown(chapterDialogue[scene][order].text.slice(0, char)));
    charTimer = setInterval(() => {
      char += 2;
      $speech.html(charadex.manageData.convertMarkdown(chapterDialogue[scene][order].text.slice(0, char)));

      if (char >= chapterDialogue[scene][order].text.length) {
        clearInterval(charTimer);
      }
    }, 50);
  }

  function sceneChange() {
    // fade to black, change scene, then reveal again
  }

  $('#prev-button').on('click', function(e) {
    e.preventDefault();
    char = 0;
    order -= 1;
    if (order < 0) {
      scene -= 1;
      if (scene < 0) {
        scene = 0;
        order = 0;
      } else {
        order = chapterDialogue[scene].length - 1;
      }
    }
    console.log("Prev clicked:", `${char}, ${order}, ${scene}`);
    updateView();
  });
  $('#next-button').on('click', function(e) {
    e.preventDefault();
    if (char < chapterDialogue[scene][order].text.length) {
      char = chapterDialogue[scene][order].text.length;
    } else {
      char = 0;
      order += 1;
      if (order >= chapterDialogue[scene].length) {
        order = 0;
        scene += 1;
        if (scene >= Object.keys(chapterDialogue).length) {
          scene = 0;
        }
      }
    }
    console.log("Next clicked:", `${char}, ${order}, ${scene}`);
    updateView();
  });

  // show page

  updateView(chapterDialogue[scene][order]);

  charadex.tools.loadPage('.softload', 100);
});