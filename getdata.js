function getbalanceFromServer(uid, pwd) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    // redirect: "follow",
  };

  fetch("http://localhost:3000/api/getbal?user_id="+uid+"&password="+pwd, requestOptions)
    .then((response) => response.json())
    .then((data) => {
      var text = "<ul>";
      data.forEach(function (item) {
        text += `<li>
        Account Number: ${item.account_number} <br>
        Account Balance: ${item.balance}
        </li>`;
      });
      text += "</ul>";
      $(".mypanel").html(text);
    })
    .catch((error) => $(".mypanel").html(error));
}

function authenUser() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  // Populate this data from e.g. form.
  var raw = JSON.stringify({
    user_id: 2,
    password: "Password321",
  });
  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };
  fetch("http://localhost:3000/api/auth", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      var text = "<ul>";
      text += `<li>First Name: ${result[0].first_name}</li>`;
      text += `<li>Last Name: ${result[0].last_name}</li>`;
      text += `<li>NRIC/FIN: ${result[0].nric_fin}</li>`;
      text += `<li>Email: ${result[0].email}</li>`;
      text += `<li>Mobile Number: ${result[0].mobile_number}</li>`;
      text += `<li>Account Number: ${result[0].account_number}</li>`;
      text += "</ul>";
      $(".mypanel").html(text);
    })
    .catch((error) => $(".mypanel").html(error));
}

function transferAcct() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  // Populate this data from e.g. form.
  var raw = JSON.stringify({
    user_id: "2",
    password: "Password321",
    fromAccount_number: "1013892486",
    toAccount_number: "1081443255",
    amount: 20,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  fetch("http://localhost:3000/api/trfbal", requestOptions)
    .then((response) => response.text())
    .then((result) => $(".mypanel").html(result))
    .catch((error) => $(".mypanel").html(error));
}

function changePwd() {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  // Populate this data from e.g. form.
  var raw = JSON.stringify({
    user_id: "4",
    oldpassword: "YYY012345",
    newpassword: "ZZZ012345",
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
  };

  fetch("http://localhost:3000/api/chgpwd", requestOptions)
    .then((response) => response.text())
    .then((result) => $(".mypanel").html(result))
    .catch((error) => $(".mypanel").html(error));
}