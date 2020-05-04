function getToken() {
  return new Promise(resolve => {
    chrome.identity.getAuthToken({
      'interactive': true
    }, function (token) {
        console.log("token", token);
      if (!token && chrome.runtime.lastError) {
        // Re-Call - Bug Fix on local requests
        if (chrome.runtime.lastError.message === "Authorization page could not be loaded.") {
          getToken();
        } else {
          console.log("lastError: " , chrome.runtime.lastError);
          alert("Error, please contact us, code: 101");
        }
      } else {
        localStorage.token = token;
        resolve(token);
      }
    });
  })

}

function refreshToken() {
  return new Promise(resolve => {
    console.log("Refresh token");
    let token = localStorage.token;
    if (token) {
      ci.removeCachedAuthToken({
        token: token
      }, function () {
        getToken().then(token => {
          localStorage.token = token;
          resolve(token);
        });
      });
    } else {
      getToken().then(token => {
        localStorage.token = token;
        resolve(token);
      });
    }
  });
}

function removeAuth() {
  let googleAccountURL = "https://myaccount.google.com/permissions";
  if (localStorage.token) {
    ci.removeCachedAuthToken({
      token: localStorage.token
    });
  }
  ct.create({
    url: googleAccountURL
  });
}