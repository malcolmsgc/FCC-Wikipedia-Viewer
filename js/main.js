//Generic parent JSONP class with constructor
class JsonP {

  constructor (url = '', { callbackName = 'callback' , callbackScope = window, onSuccess , onTimeout, timeout = 7 }) {
    this.src = url;
    this.callbackName = callbackName;
    this.callbackScope = callbackScope;
    this.onSuccess = onSuccess || this._onSuccess;
    this.onTimeout = onTimeout || this._onTimeout;
    this.timeout = timeout;
    this.timeoutID;
  }

  execute() {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = this.src;
        document.querySelector('head').appendChild(script);
        let timeoutID = window.setTimeout( function() {  //CALLBACK! REVIEW ARROW FUNC SCOPE. ALSO REVIEW BIND METHOD
          callbackScope[this.callbackName] = function() { return false };
          this.onTimeout();
          },
          this.timeout * 1000 );
        callbackScope[this.callbackName](results);
        this.onSuccess();
        }

  _onSuccess(){
    window.clearTimeout(timeoutID);
    console.log('JSONP Completed successfully')
  }

  _onTimeout(){
    try {
      throw new Error('JSONP timeout limit exceeded');
    }
    catch (e) {
  console.log(`${e.name}: ${e.message}`);
    }
  }

}


//Extended JSONP subclass to handle wikipedia JSONP search calls
class SearchWiki extends JsonP {

  constructor( searchTerm , settingsObj ) {
    super(undefined, {callbackName: 'displayResults'}); //url, { callbackName, callbackScope , onSuccess , onTimeout, timeout}
    this.src = this._buildLink( searchTerm , settingsObj );
}

  _buildLink( searchTerm, settingsObj = {} ) {

    //exception handling
    try {
      if (searchTerm === undefined) {throw new ReferenceError("searchTerm is undefined");}
      if (typeof searchTerm !== 'string') {throw new TypeError("searchTerm should be a string");}
      if (typeof settingsObj !== 'object') {throw new TypeError("searchTerm should be an object");}
    }
    catch(e) {
       console.log(e);
       //return e; //use instead of consolelog if risk that typeerror breaks call
    }
    //end exception handling

    //fixed settings object
      //References:
      //https://www.mediawiki.org/wiki/API:Search
      //https://www.mediawiki.org/wiki/API:Cross-site_requests
    const apiUrl = {
      baseUrl:  'https://en.wikipedia.org/w/api.php?',
      action:   'action=query',
      format:   'format=json&formatversion=2',
      list:     'list=search'
    };
    //destructure params from settings object passed in. Take default if no matching key.
    const { srwhat = 'text',
            srprop = 'snippet|titlesnippet',
            srlimit = '10',
            callback =  `displayResults`  //function name without ()
          } = settingsObj;
    let call =  apiUrl.baseUrl +
                `${apiUrl.format}&` +
                `${apiUrl.action}&` +
                `${apiUrl.list}&` +
                `srsearch=${searchTerm}&` +
                `callback=${callback}&` +
                `srwhat=${srwhat}&` +
                `srprop=${srprop}&` +
                `srlimit=${srlimit}`;
    return call;
  }

  displayResults(results){
    console.log (results);
  }
};
//End of SearchWiki class


let test = new SearchWiki( 'elvis', {srlimit: '5'} );






//const spinnerContainer = document.querySelector(); // wherever spinner is to load
//spinnerContainer.classList.add('spinner');
//spinnerContainer.classList.remove('spinner');

/*
STORAGE - KILL WHEN COMPLETE
const apiUrl = {
  baseUrl:    'https://en.wikipedia.org/w/api.php?',
  fixed: {
    action:   'action=query',
    format:   'format=json&formatversion=2',
    list:     'list=search'
  },
  create( searchTerm, settingsObj = {} ) {

    //exception handling
    try {
      if (searchTerm === undefined) {throw new ReferenceError("searchTerm is undefined");}
      if (typeof searchTerm !== 'string') {throw new TypeError("searchTerm should be a string");}
      if (typeof settingsObj !== 'object') {throw new TypeError("searchTerm should be an object");}
    }
    catch(e) {
       console.log(e);
       //return e; //use instead of consolelog if risk that typeerror breaks call
    }
    //end exception handling

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
*/