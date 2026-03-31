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

        // -------------------------- //
        // get character portraits
        // ---------------------------//
        let characterData = await charadex.importSheet('characters');
        for (const character of characterData) {
          // make character profile url
          let charLink = charadex.url.addUrlParameters(
            charadex.url.getPageUrl(charadex.page.masterlist.sitePage),
            { profile: charadex.tools.scrub(character.name) });
          
          // characterSprites holds character information for sprites and stuff
          characterSprites[character.name] = {};

          // add the speaker title
          characterSprites[character.name]['speaker'] = `<a data-bs-toggle="popover" data-bs-html="html" `
            + `data-bs-title="<a href="${charLink}">${character.name}</a>"`
            + `data-bs-content="${character.summary}"><h1 class="card-title m-1">${character.name}</h1></a>`
          };

          // default sprite
          const neutral = character['neutral'] ? character['neutral'] : "https://placehold.co/100x100/";

          for (const emotion of charadex.sheet.options.emotions) {
            characterSprites[character.name][emotion] = character[charadex.tools.scrub(emotion)] ? character[charadex.tools.scrub(emotion)] : neutral;
          }
        }

        console.log("CHARACTER SPRITES:", characterSprites);

        // -------------------------- //
        // gather dialogue
        // ---------------------------//
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

        // -------------------------- //
        // game initialization
        // ---------------------------//
        // select game objects
        let $spriteframe = $('#spriteframe');
        let $sprite = $('#sprite');;
        let $background = $('#background');
        let $speaker = $('#speaker');
        let $speech = $('#speech');

        let scene = 0;
        let order = 0;

        let char = 0; // number of characters visible

        // -------------------------- //
        // functions
        // ---------------------------//
        function updateView() {
          const dialogue = chapterDialogue[scene][order];
          $sprite.attr('src', characterSprites[dialogue.character][dialogue.emotion]);
          if (dialogue.rightaligned) {
            $spriteframe.addClass('text-end');
          } else { 
            $spriteframe.removeClass('text-end'); 
          }
          $background.css('background-image',`url("${dialogue.background}")`);
          $speaker.html(characterSprites[dialogue.character]['speaker']);
          $speech.html(charadex.manageData.convertMarkdown(chapterDialogue[scene][order].text.slice(0, char)));
        }

        function sceneChange() {
          // fade to black, change scene, then reveal again
        }
        
        function checkPrevious() {
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
        }
        function checkNext() {
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
        }

        // -------------------------- //
        // controls
        // ---------------------------//
        $('#prev-button').on('click', function(e) {
          e.preventDefault();
          checkPrevious();
          updateView();
        });
        $('#next-button').on('click', function(e) {
          e.preventDefault();
          checkNext();
          updateView();
        });
        document.addEventListener("keydown", (e) => {
          if (e.code === "ArrowLeft") {
            e.preventDefault();
            checkPrevious();
            updateView();
          }
          else if (e.code === "ArrowRight") {
            e.preventDefault();
            checkNext();
            updateView();
          }
        })


        // -------------------------- //
        // step
        // ---------------------------//
        // show game frame 0
        updateView(chapterDialogue[scene][order]);

        // set frame timer
        setInterval(() => {
          char += 2;
          $speech.html(charadex.manageData.convertMarkdown(chapterDialogue[scene][order].text.slice(0, char)));
        }, 50);
      }
  });

  charadex.tools.loadPage('.softload', 100);
});