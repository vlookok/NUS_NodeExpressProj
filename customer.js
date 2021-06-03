// This file will contain the queries to the customer table
const database = require("./database");
const express = require("express");

// Allows us to define a mapping from the URI to a function
router = express.Router();

// Authenticate user 
router.post("/api/auth", (request, response) => {
  database.connection.query(
    `SELECT users.first_name FROM users
      where users.user_id = ${request.body.user_id}`,
    (errors, results) => {
      if (errors) {
        response.status(402).send("User not found");
      } else {      
        database.connection.query(
          `SELECT users.first_name, users.last_name, users.nric_fin, users.email, users.mobile_number,
          account.account_number FROM users join account 
          on account.user_id = users.user_id
          where users.user_id = ${request.body.user_id} and 
          users.password = '${request.body.password}'`,
          (errors, fresults) => {
            if (errors) {
              response.status(401).send("Authentication failed");
            } else {
              response.status(201).send(fresults);
            }
          }
        );
      }
    }
  );  
});

// Get account balance. 
router.get("/api/getbal", (request, response) => {
  database.connection.query(
    `SELECT account.account_number, account.balance FROM batch9group3.account join users 
    on batch9group3.account.user_id = batch9group3.users.user_id
    where users.user_id = ${request.query.user_id} and 
    users.password = '${request.query.password}'`,
    (errors, results) => {
      if (errors) {
        response.status(501).send("System Error, Retry Later");
      } else {
        response.status(201).send(results);
      }
    }
  );
});

//transfer money
router.post("/api/trfbal", (request, response) => {    
  database.connection.query(
    `SELECT account.balance FROM batch9group3.account join users on batch9group3.account.user_id = batch9group3.users.user_id
    where users.user_id = ${request.body.user_id} and users.password = '${request.body.password}' and
    account.account_number = '${request.body.fromAccount_number}'`,
    (errors, results) => {
      if (errors) {
        response.status(501).send("System Error1, Please Retry Later");
      } else {
        if (results[0].balance>=`${request.body.amount}`) {
          database.connection.query(
            `UPDATE account set balance = balance-${request.body.amount} where account_number = '${request.body.fromAccount_number}'`,
            (errors, f1results) => {
              if (errors) {
                response.status(501).send("System Error2, Please Retry Later");
              } else {
                database.connection.query(
                  `UPDATE account set balance = balance+${request.body.amount} where account_number = '${request.body.toAccount_number}'`,
                  (errors, f2results) => {
                    if (errors) {
                      response.status(501).send("System Error3, Please Retry Later");
                    } else {
                      database.connection.query(
                        `insert into transactions (account_number, transact_type, amount_transacted) values ('${request.body.fromAccount_number}','transfer',${request.body.amount})`,
                        (errors, f3results) => {
                          if (errors) {
                            response.status(501).send("System Error4, Please Retry Later");
                          } else {
                            response.status(201).send("Transaction Successful");
                          }
                        }
                      );
                    }
                  }
                );
              }
            }
          );
        } else {
          console.log(results[0].balance);
          console.log(`${request.body.amount}`);
          response.status(401).send("Transfer Failed. Not enough balance");
        }
      }
    }  
  );
});

//to change password
router.post("/api/chgpwd", (request, response) => {
  database.connection.query(
    `UPDATE users set password = '${request.body.newpassword}' where user_id = '${request.body.user_id}' and password = '${request.body.oldpassword}'`,
    (errors, results) => {
      if (errors) {
        response.status(501).send("System Error, Retry Later");
      } else {
        response.status(201).send("Password changed successfully!");
      }
    }
  );

});

module.exports = {
  router,
};
