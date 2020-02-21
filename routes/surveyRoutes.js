const _ = require("lodash");
const { Path } = require("path-parser");
const { URL } = require("url");
const mongoose = require("mongoose");
const requireLogin = require("../middlewares/requireLogin");
const requireCredits = require("../middlewares/requireCredits");
const Mailer = require("../services/Mailer");
const surveyTemplate = require("../services/emailTemplates/surveyTemplate");

const Survey = mongoose.model("surveys");

module.exports = app => {
  app.get("/api/surveys/:surveyId/:choice", (req, res) => {
    res.send("Thank you for your valuable feedback!");
  });

  // Get a list of all surveys for a specific user
  app.get("/api/surveys", requireLogin, async (req, res) => {
    // Find all surveys that contain this user's ID (i.e. created
    // by this user), but DO NOT return the list of recipients within
    // each survey (this prevents a potentially huge nested object from
    // being returned by this query, as there can be potentially
    // thousands of recipients per survey)
    const surveys = await Survey.find({
      _user: req.user.id
    }).select({
      recipients: false
    });

    res.send(surveys);
  });

  // Create a new survey and send out a mass email to all recipients
  app.post("/api/surveys", requireLogin, requireCredits, async (req, res) => {
    const { title, subject, body, recipients } = req.body;
    const survey = new Survey({
      title,
      subject,
      body,
      recipients: recipients.split(",").map(email => ({
        email: email.trim()
      })),
      _user: req.user.id,
      dateSent: Date.now()
    });

    try {
      // Send the survey as an email
      const mailer = new Mailer(survey, surveyTemplate(survey));
      await mailer.send();
      // Save the survey to the database
      await survey.save();
      // Update the user's credits
      req.user.credits -= 1;
      const user = await req.user.save();

      res.send(user);
    } catch (err) {
      // 422 invalid operation
      res.status(422).send(err);
    }
  });

  // SendGrid will periodically call this route when a user
  // submits feedback through an email
  app.post("/api/surveys/webhooks", (req, res) => {
    // Specify a Path object to extract the survey ID
    // and user's choice from the pathname
    const p = new Path("/api/surveys/:surveyId/:choice");

    _.chain(req.body)
      .map(({ email, url }) => {
        // Extract the pathname from the event's URL
        const pathname = new URL(url).pathname;
        // match will be null if the Path above can't be matched
        const match = p.test(pathname);
        if (match) {
          return { email, surveyId: match.surveyId, choice: match.choice };
        }
      })
      // Remove any undefined elements from the events array
      .compact()
      // Remove any duplicate elements from the events array
      // checking if both the email AND surveyId are identical for
      // more than one event
      .uniqBy("email", "surveyId")
      // For each event, update the survey's collection in the remote
      // MongoDB database. Find a survey with the corresponding surveyId,
      // with a recipient with the email that has not responded yet. Then
      // increment the survey's "yes" or "no" field by 1 and set the
      // recipients "responded" field to true
      .each(({ surveyId, email, choice }) => {
        Survey.updateOne(
          {
            _id: surveyId,
            recipients: {
              $elemMatch: { email: email, responded: false }
            }
          },
          {
            $inc: { [choice]: 1 },
            $set: { "recipients.$.responded": true },
            lastResponded: new Date()
          }
        ).exec();
      })
      .value();

    // SendGrid will always resend a request if the server does not
    // respond back
    res.send({});
  });
};
