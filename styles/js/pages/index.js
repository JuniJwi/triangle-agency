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
    
    // Sort the array in desc order
    // arr.sort((a,b) => b.dateadded - a.dateadded);

    // Splice the silly little array
    // let sliceAmount = charadex.page.index.designs.amount || 6;
    // arr.splice(sliceAmount, arr.length);

  });

  let sliceAmount = charadex.page.index.designs.amount || 6;
  designs.splice(sliceAmount, designs.length);


  /* Load Page
  ===================================================================== */
  charadex.tools.loadPage('.softload', 100);

});