// const extensionId = "5e67f66f14d12e25282444b3";

const extensionId = "5eb02a5566b9656f2289eb18";
const errorCode = {
  101: "Client ID not match"
};

const dataKey = {
  user: "user",
  template: "qaTemplate",
  level: "level"
};

const cr = chrome.runtime,
      cs = chrome.storage.local,
      ci = chrome.identity,
      ct = chrome.tabs;
const kyubiApiEndPoint = "https://app.kyubi.io/api/";
const checkEmailURL = kyubiApiEndPoint + "end-user/login";
const footerlinksUrl = "";
