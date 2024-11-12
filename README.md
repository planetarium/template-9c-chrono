# Getting Started with NineChronicles Chrono Template

Welcome to the NineChronicles Chrono Template! This guide will help you set up and run your project. Follow the steps below to get started.

## Initial Setup

Before running the project, you need to install dependencies. This can be done by executing the following command in your terminal:

```sh
npm install
# or
yarn
```

And you need to generate the GraphQL client. This can be done by executing the following command in your terminal:

```sh
npm run codegen
# or
yarn codegen
```

This command will generate the necessary GraphQL client for your project.

## Defining Queries

The GraphQL queries required for your application should be defined in ***src/graphql/api.graphql***.

Initially, we have included a sample query to fetch basic avatar information. You can modify this file to add more queries as per your requirements.

## Running the Application

After generating the GraphQL client, you can start the application. Once the application is running, you will see a page where you can enter an Avatar Address and fetch the corresponding name and level.

To start the application, use:

```sh
npm start
# or
yarn start
```

## Build Your Own Website

Now that you have the Headless GraphQL setup, you can extend this template to create your own website. Use the power of GraphQL to fetch and display the data you need. Customize the UI and add more features as you see fit.

Happy coding!
