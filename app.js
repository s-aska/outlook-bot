const fs = require("fs");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");
const request = require("request");

const aud = "https://login.microsoftonline.com/" + process.env.TENANT_ID + "/oauth2/token";
const x5t = fs.readFileSync("x5t.txt", "utf-8").trim();
const cert = fs.readFileSync("server.key");

const header = {
  alg: "RS256",
  x5t: x5t
};
const payload = {
  aud: aud,
  iss: process.env.APPLICATION_ID,
  sub: process.env.APPLICATION_ID,
  jti: randomstring.generate(36),
  nbf: parseInt((new Date()).getTime() / 1000, 10),
  exp: parseInt((new Date()).getTime() / 1000, 10) + 3600
};
const token = jwt.sign(payload, cert, { algorithm: "RS256", header: header });

console.log("TENANT_ID:", process.env.TENANT_ID);
console.log("APPLICATION_ID:", process.env.APPLICATION_ID);

let form = {
  grant_type: "client_credentials",
  resource: "https://outlook.office.com",
  client_id: process.env.APPLICATION_ID,
  client_assertion_type: "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
  client_assertion: token,
};

request.post({url: aud, form: form}, function (error, response, body) {
  if (error || response.statusCode != 200) {
    console.log("TOKEN:", token);
    console.log("error:", error);
    console.log("statusCode:", response && response.statusCode);
    console.log("body:", body);
    return;
  }

  let data = JSON.parse(body);
  let access_token = data.access_token;

  console.log("ACCESS TOKEN:", access_token);

  request.get("https://outlook.office.com/api/v2.0/users/aska@denkeicojp.onmicrosoft.com/events", {
    "auth": {
      "bearer": access_token
    }
  }, function (error, response, body) {
    if (error || response.statusCode != 200) {
      console.log("Azure Active Directory 管理センター のアプリ登録画面、必要なアクセス許可メニューで「アクセス許可の付与」して下さい。");
      console.log("error:", error);
      console.log("statusCode:", response && response.statusCode);
      console.log("body:", body);
      return;
    }
    console.log(JSON.stringify(JSON.parse(body), null, 2));
  });
});
