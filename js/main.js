//Generic parent JSONP class with constructor
class JsonP {

  constructor (url = '', { callbackName = 'callback' , onSuccess , onTimeout, timeout = 7 }) {
    this.src = url;
    this.callbackName = callbackName;
    window.onSuccess = onSuccess || this._onSuccess;
    this.onTimeout = onTimeout || this._onTimeout;
    this.timeout = timeout;
    window.timeoutID;
  }

  execute() {
        let script = document.createElement('script');
        script.type = 'text/javascript';
        script.async = true;
        script.src = this.src;
        document.querySelector('head').appendChild(script);
        window.timeoutID = window.setTimeout( () => {
                                            window[this.callbackName] = function() { return false };
                                            this.onTimeout(); },
                                            this.timeout * 1000 );
  }

  _onSuccess() {
    window.clearTimeout(window.timeoutID);
    console.log('JSONP Completed successfully')
  }

  _onTimeout() {
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

    //EXCEPTION HANDLING
    try {
      if (searchTerm === undefined) {throw new ReferenceError("searchTerm is undefined");}
      if (typeof searchTerm !== 'string') {throw new TypeError("searchTerm should be a string");}
      if (typeof settingsObj !== 'object') {throw new TypeError("searchTerm should be an object");}
    }
    catch(e) {
       console.log(e);
       //return e; //use instead of consolelog if risk that typeerror breaks call
    }
    //END EXCEPTION HANDLING

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
    const { srwhat    = 'text',
            srprop    = 'snippet|titlesnippet',
            srlimit   = '10',
            callback  = `callback`  //function name without ()
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
    console.log(`call: ${call}`);
    return call;
  }

};
//End of SearchWiki class

//JSONP CALLBACK - MUST BE IN GLOBAL SCOPE 💩
function displayResults(results){
    const resultsList = document.querySelector('#resultsList');
    if (resultsList.hasChildNodes) resultsList.innerHTML = '';
    onSuccess();
    console.log (results.query.search);
    let fragment = document.createDocumentFragment();
    let totalHits = results.query.searchinfo.totalhits;
    console.log (`Total hits: ${totalHits}`);
    try{
      if (totalHits < 1) {throw new Error("No results")}
    }
    catch(e){
      console.log(e); //TO DO: refactor into prettier message
      let li = document.createElement("li");
      let p = document.createElement("p");
      p.innerHTML = "Sorry; there were no results for that search.";
      li.classList.add('error');
      fragment.appendChild(li).appendChild(p);
      resultsList.appendChild(fragment);
      return;
    }
    let mappedArray = results.query.search.map(( obj, index ) => {
      const   title = obj.title,
              snippet = `${obj.snippet}...`,
              titlesnippet = (obj.titlesnippet === "") ? title : obj.titlesnippet;
    //TO DO: string manip to insert underscore
              href = `https://en.wikipedia.org/wiki/${title}`;
      let a = document.createElement("a")
      let li = document.createElement("li");
      let h3 = document.createElement("h3");
      let p = document.createElement("p");
      h3.innerHTML = titlesnippet;
      p.innerHTML = snippet;
      a.href = href;
      let resultNode = fragment.appendChild(a).appendChild(li);
      resultNode.appendChild(h3);
      resultNode.appendChild(p);
    });
    resultsList.appendChild(fragment);
  }

//FUNCTION TO RUN IN SEARCH CLICK HANDLER
const searchFor = function(event) {
  event.preventDefault();
  const searchError = document.getElementsByClassName('searchError')[0];
  console.log(searchError);
  let searchBox = document.forms['searchbox'];
  let searchTerm = searchBox.elements['searchterm'].value;
  if (searchError.textContent) {
    searchError.classList.remove('showError');
    searchError.textContent = ''; 
  }
  try {
    if (searchTerm.length < 1) {throw new Error("No search phrase entered");}
    if (typeof searchTerm !== 'string') {throw new TypeError("searchTerm should be a string");}
  }
  catch(e) {
    if (e instanceof TypeError) {console.log(e)}
    else {
      console.log(e);
      searchError.textContent = 'Please enter a search phrase';
      searchError.classList.add('showError');
      return false;
    }
  }
  let searchWiki = new SearchWiki( searchTerm , {srlimit: '5', callback: 'displayResults'} );
  searchWiki.execute();
  searchBox.reset();
};


//const spinnerContainer = document.querySelector(); // wherever spinner is to load
//spinnerContainer.classList.add('spinner');
//spinnerContainer.classList.remove('spinner');
