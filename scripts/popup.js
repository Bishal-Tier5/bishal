const server = checkEmailURL;
const saveBtn = $("#save"),
  emailIpt = $("#email"),
  infoBar = $(".infoBar"),
  testModeCB = $("#testMode");
const sl = chrome.storage.local;
const loader = $(".loading");

let currentEmail = localStorage.email;
infoBar.css('display', 'none');

function init() {
  sl.clear();
  localStorage.removeItem("testMode");

}
function checkAndSaveEmail(email, password) {
  loader.show();

  checkEmail(email, password).then(info => {
    console.log("info", info);
    if (info.status) {
      localStorage.auth = password;
      localStorage.email = email;
      cs.set({
        "level": {
          valid: true
        }
      });

      infoBar.attr("class", "infoBar");
      infoBar.text(texts.barMessage).removeClass("t5gc_error").addClass("t5gc_info");
      infoBar.css('display', 'block');
      localStorage.testMode = testModeCB.is(":checked");
      $('.loginErrorBar').hide();
      $('.authorized-one').show();
      $('span.active-email').text(email);
      $('.unauthorized-one').hide();
    } else {
      cs.set({
        "level": {
          valid: false
        }
      });
      console.log('login failed', info);
      $('.loginErrorBar').html(info.message).show();
    }

    loader.hide();
  });
}

emailIpt.val(localStorage.email);

testModeCB.prop("checked", localStorage.testMode === "true");
if (testEmails.includes(localStorage.email)) {
  $(".test").show();
}

if (localStorage.email && localStorage.auth) {
  checkEmail(localStorage.email, localStorage.auth).then(info => {
    if (info.status ) {
      $('.authorized-one').show();
      $('span.active-email').text(localStorage.email);
      $('.unauthorized-one').hide();
      cs.set({
        "level": {
          valid: true
        }
      });
    } else {
      infoBar.text(texts.emailNotValid).removeClass("t5gc_info").addClass("t5gc_error");
      infoBar.css('display', 'block');
      $(".test").hide();
      $('.authorized-one').hide();
      $('.unauthorized-one').show();

      cs.set({
        "level": {
          valid: false
        }
      });

    }
  });
}

function sendResetPassword(email) {
  return new Promise(resolve => {
    $.ajax({
      url: 'forgot-password',
      dataType: "json",
      success: (data) => {
        console.log("check reset password success", data)
        if (data && data.ok) {
          resolve({ success: true });
          $('.login-section').hide();
          $('.forget-section').show();
          localStorage.lostPassword = 1;
        } else {
          infoBar.text(data.error).removeClass("t5gc_info").addClass("t5gc_error");
          infoBar.css('display', 'block');
          resolve({ success: false });
        }

      },
      error: e => {
        resolve({
          success: false
        });
      }
    });
  });
}

function checkEmail(email, password) {
  var extra = '';
  if (typeof password != undefined && password.trim() != '') {
    extra = '&password=' + password;
  }

  return new Promise(resolve => {
    $.ajax({
      url: checkEmailURL,
      dataType: "json",
      type: "POST",
      data: { extensionId: extensionId, email: email, password: password },
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
          message: e.responseJSON && e.responseJSON.message ? e.responseJSON.message : ''
        });
      }
    });

  });
}

$("#cancel").click(function () {
  window.close();
});

/*************** New JS **************/

$('.login-btn').click(function () {
  var email = $('#email').val();
  var password = $('#password').val();
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

  if (!email || !emailReg.test(email)) {
    $('.loginErrorBar').html(texts.emailNotValid).show();
  } else {
    $('.loginErrorBar').hide();
    checkAndSaveEmail(email, password);
  }
})



$('.logout-btn').click(function () {
  localStorage.removeItem("email");
  localStorage.removeItem("auth");
  $('.authorized-one').hide();
  $('.unauthorized-one').show();
})

$('.forget-password-btn').click(function () {
  var email = $('#email').val();
  var emailReg = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;

  if (!email || !emailReg.test(email)) {
    $('.loginErrorBar').html(texts.emailNotValid).show();
  } else {
    $('.loginErrorBar').hide();
    sendResetPassword(email);
  }
})

if (localStorage.lostPassword) {
  $('.login-section').hide();
  $('.forget-section').show();
}

$('.login-btn-section').click(function () {
  $('.login-section').show();
  $('.forget-section').hide();
})
