const fetchData = function (url){
    const request = new XMLHttpRequest();
    if (!request) {
      alert('Error: Could not create http request object');
      return false;
    }
    request.onreadystatechange = displayData;
    request.open('GET', url);
    request.send();
  }
}

const spinnerContainer = document.querySelector(); // wherever spinner is to load

function displayData() {
    while (httpRequest.readyState !== XMLHttpRequest.DONE) {
        spinnerContainer.classList.add('spinner');
    }
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        spinnerContainer.classList.remove('spinner');  
        console.log(httpRequest.responseText);
      } else {
        alert('Error: unable to retrieve results');
      }
    }
  }