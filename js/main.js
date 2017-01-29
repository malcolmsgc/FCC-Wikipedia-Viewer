//OBJECT HOLDING API QUERY COMPONENTS
//https://www.mediawiki.org/wiki/API:Search
//https://www.mediawiki.org/wiki/API:Cross-site_requests

//OBJECT TO HOLD PARAMS FOR SEARCH QUERY
const apiUrl = {
  baseUrl:    'https://en.wikipedia.org/w/api.php?',
  fixed: {
    action:   'action=query',
    format: 'format=json&formatversion=2',
  },
  canSet: {
    srsearch: "srsearch=",
    searchwhat: 'srwhat=',
    srprop: 'srprop=',
    srlimit:  'srlimit=', //10
    callback: 'callback='
  },
  defaults: {
    searchwhat: 'title|nearmatch',
    srprop: 'snippet|titlesnippet',
    srlimit:  '10',
    callback: 'displayResults'  //function name without ()
  },
  createUrl( searchTerm, callback = this.defaults.callback ) {
    const call =  `${this.baseUrl}
                  ${this.fixed.action}
                  ${this.fixed.format}
                  ${}
                  ${}
                  ${}
                  `;
  }
}


// JSONP example
const JSONP = (function(){
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
})();
//end of JSONP example

const spinnerContainer = document.querySelector(); // wherever spinner is to load
spinnerContainer.classList.add('spinner');
//spinnerContainer.classList.remove('spinner');  