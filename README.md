# Udacity Cloud Developer Capstone

Serverless API for Users to save their own Coffee Brew Recipes for the Hario V60. Created for my capstone project as part of the Udacity Cloud Developer program.

## For Udacity Reviewers

A Postman collection can be found in the main directory titled `Cloud Developer Capstone.postman_collection.json`. Before running the collection please generate a new access token under the Collection Auth tab. All authorization information is saved to the collection and has been set to open a browser to authenticate with Auth0.

Once an access token has been successfully acquired the collection can be run.

## Installation/deployment instructions

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS