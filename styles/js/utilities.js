/* ==================================================================== */
/* Import Charadex
======================================================================= */
import { charadex } from './config.js';


/* ==================================================================== */
/* Tools
=======================================================================  /

  A bunch of tools I made for the dex to ease my woes
    
======================================================================= */
charadex.tools = {

  /**
   * Scrubs strings to alphanumeric, lowercase, no spaces.
   * @param {String} str The string to scrub
   * @return {String} The string, all lowercase, no spaces.
   */
  scrub(str) {
    if (!str) return str;
    if (!isNaN(str)) return Number(str);
    return str.toLowerCase().replace(/[^a-z0-9]/g, "");
  },

  /**
   * Scrubs strings for key format, to lowercase, no spaces.
   * Symbols are allowed.
   * @param {String} str The key to scrub
   * @return {String} The key, all lowercase, no spaces.
   */
  createKey(str) {
    if (!str) return str;
    return String(str).toLowerCase().replaceAll(" ", "");
  },

  /**
   * Takes an array of select options and formats for HTML.
   * @param {Array} optionArray An array of select options.
   * @return {Array} An array of options in HTML format.
   */
  createSelectOptions(optionArray) {
    let options = [];
    for (let value of optionArray) {
      options.push(`<option value="${charadex.tools.scrub(value)}">${value}</option>`);
    };
    return options;
  },

  /**
   * Load other .html files via include.
   * Includes replace the entire div.
   */
  loadIncludedFiles() {
    $(".load-html").each(function () {
      const target = $(this);
      $.get(this.dataset.source, function (data) {
        target.replaceWith(data);
        console.log("Loaded HTML file:", target);
      });
    });
  },

  /**
   * Show/hide elements after page load is complete.
   * @param {String} showClass The class of items to show after load.
   * @param {Number} timeout How long to wait before loading.
   * @param {String} hideClass The class of elements to hide.
   */
  loadPage(showClass = '', timeout = 500, hideClass = '.loading') {
    setTimeout(function () {
      $(hideClass).addClass('inactive');
      $(showClass).addClass('active');
    }, timeout);
    setTimeout(function () {
      $(hideClass).hide();
    }, timeout+100);
  },
  
  /**
   * Update meta information with config.js settings.
   */
  updateMeta() {
    try {
      let title =  $('title');
      let titleStr = title.text();
      if ((titleStr).includes('Charadex')) {
        titleStr = titleStr.replace('Charadex', charadex.site.title);
        title.text(titleStr);
        $('meta[name="title"]').attr("content", titleStr);
        $('meta[name="url"]').attr("content", charadex.site.url);
        $('meta[name="description"]').attr("content", charadex.site.description);
      }
      return;
    } catch (err) {
      return console.error(err);
    }
  },

  /**
   * Check if an array is actually an array,
   * and that it also has occurrences.
   * @param {Array} arr The array to check.
   * @return {Boolean} Whether or not the array is both an array and has occurrences.
   */
  checkArray(arr) {
    return (arr && Array.isArray(arr) && arr.length > 0);
  },

  /**
   * Create list classes for List.JS
   * 
   * All data with the word `image`, `avatar`, or `thumbnail` will be assigned to image src.
   * 
   * All data with the word `link` or `toyhouse` will be assigned to href.
   * 
   * All data with the word `toggle`, `check`, or `active` get true/false on data-cd-bool.
   * 
   * @param {Array} sheetArray The google sheet array of data.
   * @return {Array} Sheet data with adjusted special element rules.
   */
  createListClasses(sheetArray) {

    let classArr = [...new Set(sheetArray.slice(0, 5).flatMap(Object.keys))];
    let newArr = [];
    for (let i in classArr) {
      newArr[i] = classArr[i];
      if (classArr[i].includes('image') || classArr[i].includes('avatar') || classArr[i].includes('thumbnail')) {
        newArr[i] = { name: classArr[i], attr: 'src' };
      }
      if (classArr[i].includes('link') || classArr[i].includes('toyhouse')) {
        newArr[i] = { name: classArr[i], attr: 'href' };
      }
      if (classArr[i].includes('toggle') || classArr[i].includes('check') || classArr[i].includes('active')) {
        newArr[i] = { name: classArr[i], attr: 'data-cd-bool' };
      }
    }

    return newArr;

  },
  
  /**
   * Add a link to the profile page of the related entity.
   * @param {Object} entry An entry of charadex data.
   * @param {String} pageUrl The URL of the related entity type.
   * @param {Key} key The profile ID of the related entity.
   */
  addProfileLinks(entry, pageUrl, key = '1') {
    entry.profileid = entry[key];
    entry.profilelink = charadex.url.addUrlParameters(pageUrl, { profile: entry[key] });
  },

  /**
   * Add to Bootstrap multi-select picker.
   * @param {Object} selectElement Option select elements from the DOM.
   */
  // Try to add the select picker
  addMultiselect (selectElement) {
    try {
      selectElement.selectpicker({
        noneSelectedText : `All`,
        style: '',
        styleBase: 'form-control'
      });
    } catch (err) { 
      console.error('Make sure the Multiselect CDN is in this file.') 
    }
  } 

}



/* ==================================================================== */
/* URL
=======================================================================  /

  We're keeping urls CLEAN this time i s2g
    
======================================================================= */
charadex.url = {

  // Returns the entire URL w/ parameters 
  // https://charadex.com/characters.html?param=value
  getUrl(url) {
    return new URL(url || window.location.href).href;
  },

  // Returns the base site URL
  // https://charadex.com
  getSiteUrl() {
    let host = window.location.protocol + window.location.host;
    if (host.includes('localhost')) {
      let fileName = window.location.pathname.split("/");
      fileName.pop();
      let baseFile = fileName.join("/");
      host += baseFile;
    } else if (!host.includes('localhost')) {
      host = charadex.site.url;
    }
    return charadex.url.getUrl(host);
  },

  // Returns the page URL
  // https://charadex.com/characters.html
  getPageUrl(page, url) {
    let pageUrl = url ?? charadex.url.getSiteUrl();
    return `${pageUrl.replace(/\/$/, '')}/${page}`
  },

  // Returns the parameters in object form
  // If you want a specific parameter, add 
  // { key: value }
  getUrlParameters(url) {
    return new URLSearchParams(url || window.location.search)
  },

  // Returns the parameters in object form
  // If you want a specific parameter, add 
  // { key: value }
  getUrlParametersObject(url, keys = false) {

    let params = charadex.url.getUrlParameters(url);
    if (params.size === 0) return false;

    let newObject = {};
    params.forEach((value, key) => {
      let newValue = !value ? '' : String(value).split(',').filter(function (i) { return i !== 'all' })
      if (charadex.tools.checkArray(newValue)) {
        if (charadex.tools.checkArray(keys)) {
          if (keys.includes(key)) newObject[key] = newValue;
        } else {
          newObject[key] = newValue;
        }
      }
    });

    return newObject;

  },

  // Adds parameters based on an object
  addUrlParameters(url, obj) {
    let params = '';
    for (let k in obj) params += `&${encodeURIComponent(charadex.tools.scrub(k))}=${encodeURIComponent(charadex.tools.createKey(obj[k]))}`;
    if (!url.includes('?')) params = '?' + params.substring(1);
    return url + params;
  },

}



/* ==================================================================== */
/* Data Processor
/* ====================================================================  /

    A library of functions you can use to manage the data
    received from the sheet
    
======================================================================= */
charadex.manageData = {

  /* Sort Array
  ===================================================================== */
  sortArray(sheetArray, property, order = 'asc', orderArrayKey, orderArray = false) {

    let sorted;

    if (charadex.tools.checkArray(orderArray)) {
      const orderMap = new Map(orderArray.map((item, index) => [item, index]));
      sorted = sheetArray.sort((a, b) => {
        const aIndex = orderMap.get(a[orderArrayKey]);
        const bIndex = orderMap.get(b[orderArrayKey]);
        return aIndex - bIndex;
      });
    } else {
      sorted = sheetArray.slice(0).sort(function (a, b) {
        const valA = String(a[property] || '');
        const valB = String(b[property] || '');
        return valA.localeCompare(valB, undefined, { numeric: true, sensitivity: 'base' });
      });
    }

    return charadex.tools.scrub(order) === 'asc' ? sorted : sorted.reverse();

  },

  /* Filter Array
  ===================================================================== */
  filterArray(sheetArray, criteria) {

    // Profiles have theri own filter so we want to omit them
    if (criteria.hasOwnProperty('profile')) delete criteria.profile;

    let filterArr = sheetArray.filter(function (item) {
      for (let key in criteria) {

        // Make the values into an array no matter what
        if(!charadex.tools.checkArray(criteria[key])) criteria[key] = [criteria[key]];

        // Scrub criteria
        criteria[key] = criteria[key].map(c => charadex.tools.scrub(c)).filter(c => c !== 'all');

        // If the item is an array, loop through it
        if (charadex.tools.checkArray(item[key])) {
          item[key] = item[key].map(i => charadex.tools.scrub(i));
          for (const name of criteria[key]) if (!item[key].includes(name)) return false;
        } 
        
        // Else check the string
        else if (!criteria[key].includes(charadex.tools.scrub(item[key]))) return false;

      }
      return true;
    });

    return filterArr;

  },

  /* Filter sheet by the page parameters
  ===================================================================== */
  filterByPageParameters(sheetArray) {

    let filterParams = charadex.url.getUrlParametersObject();
    if (!filterParams) return sheetArray;

    let filteredArray = charadex.manageData.filterArray(sheetArray, filterParams);

    return filteredArray;

  },

  /**
   * Relates data to a main sheet via a key
   *
   * @param {String} primaryArray       The primary array we are building off of
   * @param {String} primaryKey         The key of the field we are SEARCHING BY in primary array
   * @param {String} secondaryPageName  The name of the secondary array sheet
   * @param {String} secondaryKey       The name of the field we are SEARCHING IN in secondary array
   */
  async relateData (primaryArray, primaryKey, secondaryPageName, secondaryKey) {
    let scrub = charadex.tools.scrub;
    let secondaryArray = await charadex.importSheet(secondaryPageName);

    for (let primaryEntry of primaryArray) {
      primaryEntry[scrub(secondaryPageName)] = [];
      for (let secondaryEntry of secondaryArray) {
        let secondaryDataArray = secondaryEntry[secondaryKey].split(',');
        for (let prop of secondaryDataArray) {
          if (scrub(primaryEntry[primaryKey]) === scrub(prop)) {
            primaryEntry[scrub(secondaryPageName)].push(secondaryEntry);
          }
        }
      }
      primaryEntry[scrub(secondaryPageName) + "count"] = primaryEntry[scrub(secondaryPageName)].length;
    }

  },

  /* Fixes old style of inventories
  ===================================================================== */
  async readInventoryLog(inventoryLog) {
    // Initialize inventory
    let inventory = {};

    // For each item in the log, add/subtract from our inventory's running total
    for (let log in inventoryLog) {
      if(inventoryLog[log].item in inventory) {
        inventory[inventoryLog[log].item] += Number(inventoryLog[log].quantity);
      } else {
        inventory[inventoryLog[log].item] = Number(inventoryLog[log].quantity);
      }
    }
    
    // Import our inventory info for reference
    let itemArr = await charadex.importSheet(charadex.sheet.pages.items);

    let inventoryData = [];
    // Check if we have items in our inventory, and if so, attach data.
    for (let item of itemArr) {
      if (item.item in inventory && inventory[item.item] != 0) {
        inventoryData.push({
          ... item,
          ... {
            quantity: inventory[item.item]
          }
        });
      }
    }
    console.log("Inventory Data:", inventoryData);
    return inventoryData;
  
  },
  
  /* Adds profile links
  ===================================================================== */
  addProfileLinks(pageUrl, key, galleryArray) {
    for (let entry of galleryArray) {
      entry.profileid = entry[key];
      entry.profilelink = charadex.manage.url.addParameters(pageUrl, { profile: entry[key] });
    };
  },

  /* Convert markdown to html
  ===================================================================== */
  convertMarkdown(text) {
    var converter = new showdown.Converter({
      headerLevelStart: 2,
      strikethrough: true,
      tasklists: true,
      simplifiedAutoLink: true,
      parseImgDimensions: true,
      backslashEscapesHTMLTags: true ,
      simpleLineBreaks: true,
    });

    return converter.makeHtml(text);
  },

  /**
   * Converts height to both Imperial and Metric.
   * @param {String} height The height measurement in either unit.
   * @return {{imperial: String, metric: String}} A dict with imperial and metric.
   */
  convertHeight(height) {
    const ratio = 2.54; // 1 inch = 2.54 cm
    let ft, inch, cm = 0;

    // if this has a ' or ", we can assume it's an imperial measurement.
    if (height.includes("'") || height.includes('"')) {
      let imperial = height.split("'"); // split text by the '
      ft = imperial[0].replace(/[^\d.-]/g, "");
      inch = imperial[1].replace(/[^\d.-]/g, "");

      let inches = Number(ft)*12 + Number(inch);
      cm = inches * ratio;
    
    // otherwise, assume this is a metric measurement
    } else {
      cm = Number(height.replace(/[^\d.-]/g, ""));
      let inches = cm / ratio;

      ft = Math.floor(inches / 12);
      inch = Math.floor(inches % 12);
    }

    return {
      imperial: String(ft) + "'" + String(inch) + "&quot;",
      metric: String(Math.floor(cm)) + " cm",
    }
  },

}



/* ==================================================================== */
/* Import Sheet
/* ====================================================================  /

  Does what it says on the box.
    
======================================================================= */
charadex.importSheet = async (sheetPage, sheetId = charadex.sheet.id) => {

  if (!sheetId) return console.error('Missing sheetID.');
  if (!sheetPage) return console.error('Missing sheetPage.');

  // Fetch the sheet
  const importUrl = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&headers=1&tq=WHERE A IS NOT NULL&sheet=${sheetPage}`;

  // Attempt to get it
  const sheetJSON = await fetch(importUrl).then(i => i.text()).catch(err => {
    return console.error(`${err} sheet. Please make sure that the sheet is public and that you're only using the ID.`);
  });

  // Parse the text
  const sliceJSON = JSON.parse(sheetJSON.substring(47).slice(0, -2));

  // Grab column headers
  const col = [];
  if (sliceJSON.table.cols[0].label) {
    for (let headers of sliceJSON.table.cols) {
      if (headers.label) col.push(headers.label.toLowerCase().replace(/\s/g, ""));
    };
  }

  // Scrubs columns and puts them in a readable object
  const scrubbedData = [];
  for (let info of sliceJSON.table.rows) {
    const row = {};
    const isBoolean = val => 'boolean' === typeof val;
    col.forEach((ele, ind) => {
        row[ele] = info.c[ind] != null ? 
        info.c[ind].f != null && !isBoolean(info.c[ind].v) ? 
        info.c[ind].f : info.c[ind].v != null ? 
        info.c[ind].v : "" : "";
    });
    scrubbedData.push(row);
  };

  // Filter out everything that says hide
  let publicData = scrubbedData.filter(i => !i['hide']);
  // Filter out anything that does not say show
  // let publicData = scrubbedData.filter(i => i['show']);

  // Return Data
  return publicData;

};


export { charadex };