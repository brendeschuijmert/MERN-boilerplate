# Time Management App

This time management project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `npm lint`

Launches the eslint to check to analyse code.<br />

## Front-End Architecture

```
├─ src/components          - Reusable React components are declared here.
├─ src/constants           - Constant variables and form settings including props are declared here.
├─ src/hoc                 - HOC components can go here.
├─ src/pages               - Pages can go here.
├─ src/store               - Redux actions/reducers/saga here.
├─ src/utils               - Reusable utilized functions.
├─ src/routes              - Hosted routes existed in whole time management app.
```

## Back-End Architecture

```
├─ backend/constants	   - Constant variables are declared here.
├─ backend/conrollers      - Conrollers are declared here.
├─ backend/middleware      - Middlewares can go here.
├─ backend/models          - Models can go here.
├─ src/utils               - Reusable utilized functions.
├─ src/routes              - Hosted routes existed in backend app.
```

## Frameworks and libraries used:

- Node - https://nodejs.org
- Lodash - https://lodash.com/docs/
- Express - https://expressjs.com/
- React - https://facebook.github.io/react/
- Redux - https://redux.js.org/
- Redux Saga - https://redux-saga.js.org/
- React Blueprint JS - https://blueprintjs.com/
- Mongo DB - https://docs.mongodb.com/
