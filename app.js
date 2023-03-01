const request = require("request");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;
const path = require("path");
const https = require("https");

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/signup.html");
});

app.post("/", (req, res) => {
  console.log("Post Request Recived");

  let firstname = req.body.fname;
  let lastname = req.body.lname;
  let email = req.body.email;

  let data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: firstname,
          LNAME: lastname,
        },
      },
    ],
  };

  let JSON_data = JSON.stringify(data);

  const url = "https://us18.api.mailchimp.com/3.0/lists/aeb14e87d9";

  let options = {
    method: "POST",
    auth: "bhavnish1:bd9738a7221595f93bc397143d63e3f1-us18",
  };

  const request = https.request(url, options, (res) => {
    res.on("data", (data) => {
      JSON.parse(data);
    });
  });

  if (res.statusCode === 200) {
    res.sendFile(__dirname + "/success.html");
  } else {
    res.sendFile(__dirname + "/failure.html");
  }

  request.write(JSON_data);
  request.end();
});

// app.post("/", (req, res) => {
//   res.sendFile(__dirname, "success.html");
// });

app.post("/failure", (req, res) => {
  res.redirect("/");
});

app.post("/success", (req, res) => {
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is Running on Port ${port}`);
});
