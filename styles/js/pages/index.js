/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from '../charadex.js';


/* ==================================================================== */
/* Load
======================================================================= */
document.addEventListener("DOMContentLoaded", async () => {

  /* Prompts
  ===================================================================== */
  let prompts = await charadex.initialize.page(null, charadex.page.index.prompts, (arr) => {

    // Sort the array in configured order
    if (charadex.page.index.prompts.sort?.toggle ?? false) {
      arr = charadex.manageData.sortArray(
        arr, 
        charadex.page.index.prompts.sort.sortProperty, 
        charadex.page.index.prompts.sort.order,
        charadex.page.index.prompts.sort.parametersKey,
        charadex.page.index.prompts.sort.parameters,
      );
    }

      // Splice the silly little array
      let sliceAmount = charadex.page.index.prompts.amount || 4;
      arr.splice(sliceAmount, arr.length);

    }, (data) => {

      // Add the silly little prompt stuff here too
      $('.cd-prompt-background').each(function(i) {
        const element = $(this);
        const image = data.array[i]?.image;
        element.attr('style', `background-image: url(${image})`);
      });
      
    }
    
  );


  /* Designs
  ===================================================================== */
  let designs = await charadex.initialize.page(null, charadex.page.index.designs, (arr) => {
    
    // Sort the array in configured order
    if (charadex.page.index.designs.sort?.toggle ?? false) {
      arr = charadex.manageData.sortArray(
        arr, 
        charadex.page.index.designs.sort.sortProperty, 
        charadex.page.index.designs.sort.order,
        charadex.page.index.designs.sort.parametersKey,
        charadex.page.index.designs.sort.parameters,
      );
    }

    // Splice the silly little array
    let sliceAmount = charadex.page.index.designs.amount || 6;
    arr.splice(sliceAmount, arr.length);

  });


  /* Load Page
  ===================================================================== */
  charadex.tools.loadPage('.softload', 100);

});