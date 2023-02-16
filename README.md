# Development

## Setup

This application was built using node version 16.19.0 (LTS version Gallium). The easiest way to install the correct verison is to use the Node Version Manager (nvm). Please follow the [nvm installation directions](https://github.com/nvm-sh/nvm#installing-and-updating) before continuting.

Install version 16.19.0 of node with the command `nvm install 16.19.0`, then switch to that version using `nvm use 16.19.0`. Finally, run `npm install` to install the required dependencies.

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

# Assumptions

## Legal

I'm not very familiar with employment law in terms of what information could be considered in a descrimination lawsuit (e.g. gender, age), but there's not a ton of data in the random API that would be useful so I used them anyway. In a real application you would likely want other information to display, such as resume and cover letter files, portfolio links, etc.

## Dates

There are two dates returned by the random user generator: birth date and registration date. I used the registration date as if it were the application date. Even though it probably wouldn't make sense for a user to have applied to a job years in the past like the registration date tends to be, it does at least give me a date to work with to provide that functionality.

# Functionality

There is just one page in the application, which shows all of the candidates that are currently in the system. To start with, there are no candidates, but you can "recruit" some by clicking the "Find New Candidates" button. This can also be done at any time in the future to load more candidates, for example after finishing approving or rejecting all existing candidates.

There are 4 filter buttons at the top that can be used to look all candidates or just candidates that are pending, approved, or rejected. The "Find New Candidates" button only shows in the all or pending lists, since otherwise the new candidates would not appear to show up due to being filtered out.

Within the list, an individual candidate can be selected, opening a UI for viewing the candidate details, adding a note, and approving or rejecting the candidate. The note will persist on blur. Once selected, the button can be clicked again to "undo" the selection and return the candidate to the pending state.

Most of the functionality can be found in:
- https://github.com/btgaffor/onsiteiq-ats/tree/master/src/components/CandidateList
- https://github.com/btgaffor/onsiteiq-ats/tree/master/src/util

# Libraries & Tools

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). There are a lot of choices out there now for starting projects like Next, Vite, etc, but I still find CRA to be a good starting point for a standard React app that Just Works and doesn't need the newer fancy features like server-side rendering.

## Typescript

I use typescript exclusively (when possible) due to the safety, maintainability, and design patterns it enables.

## Variant

[Variant](https://github.com/paarthenon/variant) is a utility for creating [discriminated unions](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#discriminated-unions) in typescript. This allows for very tight state management that leverages typescript to ensure that all cases are covered. It also provides convenient state constructors and type narrowing to avoid boilerplate code.

## IDB

I used indexeddb for my data persistence because it provides funcitonality that would most closely mimic a backend API's data structure. To that end, I like to use a library called [IDB](https://github.com/jakearchibald/idb), which wraps the underlying indexeddb API with promises and light utilities without obscuring that original API with heavy logic.

## Emotion

I chose to use [Emotion](https://emotion.sh/docs/introduction) because I really like the API and type safety it provides (with Typescript). Css-in-JS allows easy implementation of things like conditional styles based on props and design systems that are more difficult to do with a static css tool like Sass. I also appreciate that it hooks into the typescript tooling so I can do things like see all references where a style is used, which makes for easy refactoring.

## Date-Fns

[Date-fns](https://date-fns.org/) provide simple utilities for working with dates. I prefer it over the popular library [moment.js](https://momentjs.com/) because date-fns functions treat dates as immutable. For this project I used the distance calcuation function to show the application date of candidates.
