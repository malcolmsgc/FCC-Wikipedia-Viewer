//Generic parent JSONP class with constructor
class JsonP {
  constructor(url){
    this.src = url;
    this.execute = function (src) {
      let script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.src = src;
      document.querySelector('head').appendChild(script);
    }
  }

//OBJECT HOLDING API QUERY COMPONENTS
//https://www.mediawiki.org/wiki/API:Search
//https://www.mediawiki.org/wiki/API:Cross-site_requests


const apiUrl = {
  baseUrl:    'https://en.wikipedia.org/w/api.php?',
  fixed: {
    action:   'action=query',
    format:   'format=json&formatversion=2',
    list:     'list=search'
  },
  create( searchTerm, settingsObj = {} ) {
    try {
      if (typeof searchTerm != 'string') throw 'search term must be a string';
    }
    catch(e) {
       alert(e);
       console.log(e);
    }

    const { srwhat = 'text', 
            srprop = 'snippet|titlesnippet',
            srlimit = '10',
            callback =  'apiUrl.displayResults'  //function name without ()
          } = settingsObj;  //destructure from settings object passed in. Take default if no matching key.
    let call =  this.baseUrl +
                `${this.fixed.action}&` + 
                `${this.fixed.format}&` +
                `${this.fixed.list}&` +
                `srsearch=${searchTerm}&` +
                `callback=${callback}&` +
                `srwhat=${srwhat}&` +
                `srprop=${srprop}&` +
                `srlimit=${srlimit}`;
    return call;
  },
  displayResults(results){
    console.log (results);
  }
};



  

}

// JSONP example
/*
let JSONP = (function(){
  let that = {};

  that.send = function(src, options) {
    let callback_name = options.callbackName || 'callback',
      on_success = options.onSuccess || function(){},
      on_timeout = options.onTimeout || function(){},
      timeout = options.timeout || 10; // sec

    var timeout_trigger = window.setTimeout(function(){
      window[callback_name] = function(){};
      on_timeout();
    }, timeout * 1000);

    window[callback_name] = function(data){
      window.clearTimeout(timeout_trigger);
      on_success(data);
    }

    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = src;

    document.getElementsByTagName('head')[0].appendChild(script);
  }

  return that;
})();*/

//end of JSONP example

//const spinnerContainer = document.querySelector(); // wherever spinner is to load
//spinnerContainer.classList.add('spinner');
//spinnerContainer.classList.remove('spinner');  