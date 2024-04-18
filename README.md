# Aws RSS Reader
This project is being designed to pull all news and learning sources into one place.  Additionally, it will allow sites to be grouped by categories and subcategories.  Finally, AI summary will be able to be generated on demand, when available.

## Terms And Concepts
- **User**
    - Username
    - Subscribed Feeds
    - Subscribed Categories
    - Membership Tier
- **RSS Feed**
    -  Type (Site, Reddit, Youtube)
    -  Url
    -  Category
    -  Subcategory
    -  Last Scanned
- **RSS Feed Item**
    -  Title
    -  Last Modified
    -  Link Url
    -  Description
    -  AI Summary

# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `npx cdk deploy`  deploy this stack to your default AWS account/region
* `npx cdk diff`    compare deployed stack with current state
* `npx cdk synth`   emits the synthesized CloudFormation template
