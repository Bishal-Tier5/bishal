cr.onMessage.addListener((req, sender, sendResponse) => {
  switch (req.cmd) {
    case "getToken":
      getToken().then(token => {
        localStorage.token = token;
      });
      break;
    case "checkUser":
      console.log("call checkUser from back");
      checkUser(sender.tab.id);
      break;
  }
});




if (localStorage.email && localStorage.auth) {
  let email = localStorage.email;
  let password = localStorage.auth;
  checkEmail(email, password).then(info => {
    if (info.isValid) {
      cs.set({"level": {valid: true}});
    } else {
      cs.set({"level": {valid: false}})
    }
  });
}


function checkAuth() {
  getToken();
}

function checkEmail(email, password) {
  var extra = '';
   if(typeof password != undefined && password.trim() != '') {
    extra = '&password='+ password;
   }
  
  return new Promise(resolve => {
    $.ajax({
      url: checkEmailURL,
      dataType: "json",
      type: "POST",
      data: {extensionId: extensionId, email: email, password: password},
      success: (data) => {
        console.log("check email success", data) 
        if (data && data.status) {
          data.isValid = true;
        } else {
          data.isValid = false;          
        }
        resolve(data);
      },
      error: e => {
        resolve({
          status: false,
          isValid: false,
          message: e.responseJSON && e.responseJSON.message ? e.responseJSON.message : ''
        });
      }
    });
   
  });
}
