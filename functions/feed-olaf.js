'use strict';

const AWS = require('aws-sdk');
const handlebars = require('handlebars');
const fs = require("fs");
const path = require("path");
const {formatDate} = require("../utils/format-date");

const getEmail = () => {
    const emailTemplate = fs.readFileSync(path.join(__dirname, "/../templates/feed-olaf-email.hbs"), "utf8");
    const compiledEmail = handlebars.compile(emailTemplate);
    const email = compiledEmail({date: formatDate(new Date())});

    return email;
}

const getEmailParameters = () => {
    const email = process.env.VERIFIED_EMAIL;

    const params = {
        Destination: {
            ToAddresses: [email]
        },
        Message: {
            Body: {
                Html: {
                    Charset: "UTF-8",
                    Data: getEmail()
                },
                Text: {
                    Charset: "UTF-8",
                    Data: "Today you need to feed Olaf!"
                }
            },
            Subject: {
                Charset: "UTF-8",
                Data: "Feed Olaf Reminder"
            }
        },
        ReplyToAddresses: [email],
        Source: email,
    };

    return params;
};

module.exports.handler = async (event, context, callback) => {

    AWS.config.update({region: process.env.REGION});

    const ses = new AWS.SES();

    await ses.sendEmail(getEmailParameters()).promise();

    return event;
};