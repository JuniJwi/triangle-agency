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
    charadex.page.player,
    null, 
    async (listData) => {

      console.log("LIST DATA:", listData); 
      if (listData.type == 'profile') {
        $('#gallery-header').hide();

        let profile = listData.profileArray[0];

        // Characters
        if (charadex.tools.checkArray(profile.characters)) {
          let characters = await charadex.initialize.page(
            profile.characters,
            charadex.page.player.relatedData['characters'],
          );
          console.log('Initialized related characters!');
        }

      }
    });
    
  charadex.tools.loadPage('.softload', 100);  
});