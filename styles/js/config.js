/* ==================================================================== */
/* Charadex
======================================================================= */
let charadex = {};

/* --------------------------------------------------------------- */
/* Site Config
/* --------------------------------------------------------------- */
/* If you don't want to hard code your site information, you
/* can fill this out instead
/* Any preview links will still show Charadex's information
/* --------------------------------------------------------------- */
charadex.site = {
  title: 'Junijwi - Triangle Agency',
  url: 'https://junijwi.github.io/triangle-agency/',
  description: `Tracking characters and events in junijwi's Triangle Agency campaign.`
}

/* --------------------------------------------------------------- */
/* Sheet Config
/* --------------------------------------------------------------- */
/* Your sheet configuration
/* --------------------------------------------------------------- */
charadex.sheet = {

  id: '1QOs1dk5JD7euJ9KqeZhDV6U2EbjXcbGJY2VWXJz-w-I',

  pages: { // these should match your sheet names, but in lowercase
    masterlist:    'characters',
    masterlistLog: 'character log',
    player:        'players',
    inventoryLog:  'inventory log',
    items:         'items',
    prompts:       'prompts',
    lore:          'mission reports',
    chapters:      'chapters',
  },

  options: { // available options for values in your sheets used in search filters
    roles: ['PC', 'NPC'],
    statuses: ['Active', 'Out of Date', 'Retired', 'Dead', 'WIP'],
    category: ['All', 'Agency', 'Urgency', 'Connection'],
    subcategory: ['All', 'Human', 'Anomaly', 'Resonant', 'Other'],
    itemTypes: ['All', 'Currency', 'Requisition', 'Agency', 'Urgency', 'Ability', 'Misc'],
    emotions: ['Neutral', 'Happy', 'Manic', 'Angry', 'Sad', 'Nervous', 'Stressed', 'Embarrassed', 'Skeptical', 'Signature'],
  }

}

/* ==================================================================== */
/* Page configuration
/* ==================================================================== */
/* Some general notes for each section...
/*
/* sheetPage:       refers to the name of the google sheet, but in lowercase
/* sitePage:        refers to the URL path of the page. Usually, this will
/*                  match the name of the html file for that page
/* dexSelector:     refers to the class prefix of the html elements for
/*                  javascript selection. is 'charadex' by default.
/* profileProperty: column on the sheet that serves as the UNIQUe id key
/*                  used to identify the row and create the URL.
/*
/* sort:
/*  toggle:         true/false to turn sort on or off
/*  sortProperty:   the column used to 'sort' the items. Can use id's,
/*                  a manual sort, names, etc.
/*  order:          'asc' or 'desc'
/*  parameters:     Sorting by specific columns as an option.
/*
/* pagination:
/*  toggle:         true/false to turn pagination on or off
/*  bottomToggle:   whether to have pagination at the bottom in
/*                  addition to the top.
/*  amount:         how many items per page
/*
/* filters:         these are search filters! they filter on user select.
/*  toggle:         true/false to turn filters on or off
/*  parameters:     what a user can filter by, use options defined above.
/*
/* fauxFolder:      these create an array of buttons that filter on click.
/*  toggle:         true/false to turn filters on or off
/*  folderProperty: Name of the folder
/*  parameters:     what a user can filter by, use options defined above.
/*
/* search:          this filters on user input.
/*  toggle:         true/false to turn search on or off
/*  filterToggle:   true/false to expand or collapse filter by default.
/*  parameters:     what a user can filter by, should be column names.
/*
/* prevnex:         whether or not to show the names of previous and next
/*                  entries at the top.
/*  toggle:         true/false to turn prevnext on or off
/*
/* fillBlanks:      columns in which you want to replace any blank
/*                  values with a formatted "--"
/*
/* markdownColumns: columns in which you want to convert markdown text
/*
/* badgeColumns:    columns in which you want values to be turned into badges.
/*                  it will create a '___badge' class of these columns.
/*                  each item should be a dictionary where the name of the
/*                  dict is the column name, and each entry is a key/value
/*                  pair of the column value / column html style class.
/*
/* ==================================================================== */
charadex.page = {};

/* --------------------------------------------------------------- */
/* items.html
/* --------------------------------------------------------------- */
charadex.page.items = {

  sheetPage: charadex.sheet.pages.items,
  sitePage: 'items',
  dexSelector: 'item',
  profileProperty: 'item',

  sort: {
    toggle: true,
    sortProperty: 'sort',
    order: 'asc',
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 24,
  },

  filters: {
    toggle: false,
    parameters: {
      'Type': charadex.sheet.options.itemTypes,
    }
  },

  fauxFolder: {
    toggle: true,
    folderProperty: 'Type',
    parameters: charadex.sheet.options.itemTypes,
  },

  search: {
    toggle: true,
    filterToggle: true,
    parameters: ['All', 'Item', 'Description']
  },

  prevNext: {
    toggle: true,
  },

  fillBlanks: [],
  
  markdownColumns: [],

  badgeColumns: {},

};


/* --------------------------------------------------------------- */
/* prompts.html
/* --------------------------------------------------------------- */
charadex.page.prompts = {

  sheetPage: charadex.sheet.pages.prompts,
  sitePage: 'prompts',
  dexSelector: 'prompt',
  profileProperty: 'title',

  sort: {
    toggle: true,
    sortProperty: 'enddate',
    order: 'asc',
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 12,
  },

  filters: {
    toggle: true,
    parameters: {
      'Category': charadex.sheet.options.category,
    }
  },

  fauxFolder: {
    toggle: false,
    folderProperty: '',
    parameters: [],
  },

  search: {
    toggle: true,
    filterToggle: false,
    parameters: ['Title']
  },

  prevNext: {
    toggle: true,
  },
  
  fillBlanks: [
    'title',
    'startdate',
    'enddate',
    'summary',
    'description',
  ],
  
  markdownColumns: [
    'summary',
    'description',
  ],

  badgeColumns: {
    category: {                   // name of the column
      agency: 'bg-danger',        // value: 'style'
      urgency: 'bg-info',         // value: 'style'
      connection: 'bg-warning',   // value: 'style'
    },
  },

};


/* --------------------------------------------------------------- */
/* lore.html
/* --------------------------------------------------------------- */
charadex.page.lore = {

  sheetPage: charadex.sheet.pages.lore,
  sitePage: 'missionreports',
  dexSelector: 'charadex',
  profileProperty: 'title',

  sort: {
    toggle: false,
    sortProperty: 'date',
    order: 'asc',
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 12,
  },

  filters: {
    toggle: false,
    parameters: {
      'TBA': [],
    }
  },

  fauxFolder: {
    toggle: false,
    folderProperty: '',
    parameters: [],
  },

  search: {
    toggle: true,
    filterToggle: true,
    parameters: ['All', 'Title', 'Tags']
  },

  prevNext: {
    toggle: true,
  },
  
  fillBlanks: [
    'title',
    'summary',
    'behavior',
    'focus',
    'domain',
    'looseends',
    'optionalobjectives',
    'notes',
    'grade',
  ],

  markdownColumns: [
    'summary',
    'behavior',
    'focus',
    'domain',
    'looseends',
    'optionalobjectives',
    'notes',
  ],

  badgeColumns: {
    status: {
      captured: 'bg-danger',
      escaped: 'bg-info',
      neutralized: 'bg-warning',
      other: 'bg-light',
    },
  },

};


/* --------------------------------------------------------------- */
/* characters.html
/* --------------------------------------------------------------- */
charadex.page.masterlist = {

  sheetPage: charadex.sheet.pages.masterlist,
  sitePage: 'characters',
  dexSelector: 'charadex',
  profileProperty: 'name',

  sort: {
    toggle: true,
    sortProperty: 'name',
    order: 'asc',
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 12,
  },

  filters: {
    toggle: true,
    parameters: {
      'Role': charadex.sheet.options.roles,
      'Status': charadex.sheet.options.statuses,
      'Category': charadex.sheet.options.category,
      'Subcategory': charadex.sheet.options.subcategory,
    }
  },

  fauxFolder: {
    toggle: false,
    folderProperty: 'Role',
    parameters: charadex.sheet.options.roles,
  },

  search: {
    toggle: true,
    filterToggle: true,
    parameters: ['All', 'Name', 'Player', 'Age', 'Gender']
  },

  prevNext: {
    toggle: true,
  },
  
  fillBlanks: [
    'name',
    'alias',
    'age',
    'gender',
    'pronouns',
    'sexuality',
    'birthday',
    'height',
    'build',
    'goodtraits',
    'neutraltraits',
    'badtraits',
    'personality',
    'lore',
  ],

  markdownColumns: [
    'mythosdescription',
    'abilitydescription1',
    'abilitydescription2',
    'abilitydescription3',
    'abilitydescription4',
    'abilitydescription5',
    'personality',
    'lore',
  ],
  
  badgeColumns: {
    category: {                   // name of the column
      agency: 'bg-danger',        // value: 'style'
      urgency: 'bg-info',         // value: 'style'
      connection: 'bg-warning',   // value: 'style'
    },
    pronouns: {
      hehim: 'bg-hehim',
      sheher: 'bg-sheher',
      theythem: 'bg-theythem',
      itits: 'bg-itits',
      other: 'bg-other',
    }
  },

  relatedData: {

    [charadex.sheet.pages.masterlistLog]: {

      sheetPage: charadex.sheet.pages.masterlistLog,
      primaryProperty: 'name', // The key of the field we are SEARCHING BY in primary array
      relatedProperty: 'name', // The name of the field we are SEARCHING IN in secondary array
      dexSelector: 'log',
      profileProperty: 'name', // The ID of the secondary field
      profileToggle: false,

      sort: {
        toggle: true,
        sortProperty: 'timestamp',
        order: 'desc',
        parameters: []
      },

      pagination: {
        toggle: true,
        bottomToggle: true,
        amount: 12,
      },

    }

  },

  // This is a special config for their inventory
  characterConfig: {

    sheetPage: charadex.sheet.pages.items,
    sitePage: 'items',
    dexSelector: 'item',
    profileProperty: 'item',
    profileToggle: false,

    sort: {
      toggle: true,
      sortProperty: 'sort',
      order: 'asc',
      parametersKey: 'type', 
      parameters: [charadex.sheet.options.itemTypes]
    },

    search: {
      toggle: true,
      filterToggle: false,
      parameters: ['Item']
    },

    filters: {
      toggle: false,
      parameters: {
        'Type': charadex.sheet.options.itemTypes,
      }
    },

  }

};

/* --------------------------------------------------------------- */
/* players.html
/* --------------------------------------------------------------- */
charadex.page.player = {

  // Dex Set Up
  sheetPage: charadex.sheet.pages.player,
  sitePage: 'players',
  dexSelector: 'player',
  profileProperty: 'username',

  // Dex Options
  sort: {
    toggle: true,
    sortProperty: 'username',
    order: 'asc',
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 24,
  },

  filters: {
    toggle: false,
    parameters: {}
  },

  fauxFolder: {
    toggle: false,
    folderProperty: '',
    parameters: [],
  },

  search: {
    toggle: true,
    filterToggle: true,
    parameters: ['Username']
  },

  prevNext: {
    toggle: true,
  },

  fillBlanks: [],

  markdownColumns: [
    'description',
  ],

  badgeColumns: {
    role: { 
      gm: 'bg-warning',
      player: 'bg-primary',
    },
    pronouns: {
      hehim: 'bg-hehim',
      sheher: 'bg-sheher',
      theythem: 'bg-theythem',
      itits: 'bg-itits',
      other: 'bg-other',
    }
  },


  // Related Data
  relatedData: {

    [charadex.sheet.pages.inventoryLog]: {

      sheetPage: charadex.sheet.pages.inventoryLog,
      primaryProperty: 'username', // The key of the field we are SEARCHING BY in primary array
      relatedProperty: 'username', // The name of the field we are SEARCHING IN in secondary array
      dexSelector: 'log',
      profileProperty: 'username', // The ID of the secondary field
      profileToggle: false,

      sort: {
        toggle: true,
        sortProperty: 'timestamp',
        order: 'desc',
        parameters: []
      },

      pagination: {
        toggle: true,
        bottomToggle: true,
        amount: 12,
      },

    },
    

    [charadex.sheet.pages.masterlist]: {

      // This imports the config from the masterlist
      // So you dont have to repeat yourself
      ...charadex.page.masterlist, 

      sheetPage: charadex.sheet.pages.masterlist,
      sitePage: 'characters',
      primaryProperty: 'username', // name of field of the calling page to search by
      relatedProperty: 'player',   // name of column to search in related page
      dexSelector: 'charadex',
      profileProperty: 'name',     // name of found record of the related page
      profileToggle: false,

    }

  },

  
  // This is a special config for their inventory
  playerConfig: {

    sheetPage: charadex.sheet.pages.items,
    sitePage: 'items',
    dexSelector: 'item',
    profileProperty: 'item',
    profileToggle: false,

    sort: {
      toggle: true,
      sortProperty: 'sort',
      order: 'asc',
      parametersKey: 'type', 
      parameters: [charadex.sheet.options.itemTypes]
    },

    search: {
      toggle: true,
      filterToggle: false,
      parameters: ['Item']
    },

    filters: {
      toggle: false,
      parameters: {
        'Type': charadex.sheet.options.itemTypes,
      }
    },

  }

};



/* --------------------------------------------------------------- */
/* chapters.html
/* --------------------------------------------------------------- */
charadex.page.chapters = {

  // Dex Set Up
  sheetPage: charadex.sheet.pages.chapters,
  sitePage: 'chapters',
  dexSelector: 'charadex',
  profileProperty: 'title',

  // Dex Options
  sort: {
    toggle: true,
    sortProperty: 'title',
    order: 'asc',
    parameters: []
  },

  pagination: {
    toggle: true,
    bottomToggle: true,
    amount: 24,
  },

  filters: {
    toggle: true,
    parameters: {
      'Category': charadex.sheet.options.category,
    }
  },

  fauxFolder: {
    toggle: false,
    folderProperty: '',
    parameters: [],
  },

  search: {
    toggle: true,
    filterToggle: true,
    parameters: ['Title', 'Characters']
  },

  prevNext: {
    toggle: true,
  },

  fillBlanks: [
    'summary',
  ],

  markdownColumns: [
    'summary',
  ],

  badgeColumns: {
    category: {                   // name of the column
      agency: 'bg-danger',        // value: 'style'
      urgency: 'bg-info',         // value: 'style'
      connection: 'bg-warning',   // value: 'style'
    },
  },

};


/* --------------------------------------------------------------- */
/* index.html
/* --------------------------------------------------------------- */
charadex.page.index = {

  prompts: {
    ... charadex.page.prompts,
    dexSelector: 'prompt',
    amount: 2,
  },

  designs: {
    ... charadex.page.masterlist,
    dexSelector: 'charadex',
    amount: 4,

    sort: {
      toggle: true,
      sortProperty: 'dateadded',
      order: 'desc',
      parameters: []
    },
  }

};


export { charadex };