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
        
        // Inventory
        let inventoryData = await charadex.manageData.readInventoryLog(profile.inventorylog);

        charadex.initialize.groupGallery(
          charadex.page.player.playerConfig,
          inventoryData,
          'type',
          charadex.url.getPageUrl('items')
        );
        console.log('Initialized inventory gallery!');

        // Designs
        if (charadex.tools.checkArray(profile.characters)) {
          let designs = await charadex.initialize.page(
            profile.characters,
            charadex.page.player.relatedData['characters'],
          );
          console.log('Initialized related characters!');
        }

        // Logs
        if (charadex.tools.checkArray(profile.inventorylog)) {
          let logs = await charadex.initialize.page(
            profile.inventorylog,
            charadex.page.player.relatedData['inventory log'],
          );
          console.log('Initialized related logs!');
        }

      }
    });
    
  charadex.tools.loadPage('.softload', 100);  
});