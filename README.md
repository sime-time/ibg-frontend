# MMA Gym Management System

## Why  
My boxing coach wanted a payment management system to automate monthly gym subscriptions. 
He disliked "having to chase people down for their payments". 
I heard this and volunteered to build this system for free. 

## What is this? 
The backend is using PocketBase hosted on a Digital Ocean VPS. 
The frontend code (this repo) is using SolidStart and Tailwind to build the web app frontend. 
This web app helps a coach/owner manage any martial arts gym.

In this program, there are 2 types of users, members and coaches. 
Coaches are administrators.
Members are the customers that pay a monthly subscription to attend the gym. 

## Coaches should be able to:  
- view all the current members.
- view all payments and profit made within a chosen timeframe.  

## Members should be able to:   
- signup and login account. 
- pay a monthly subscription for gym access.  
- change their name and password.

## How to run 

Once you've cloned the project and installed dependencies with `npm install` (or `pnpm install` or `yarn`), start a development server:

```bash
npm run dev

# or start the server and open the app in a new browser tab
npm run dev -- --open
```

## How to build

Solid apps are built with _presets_, which optimise your project for deployment to different environments.

By default, `npm run build` will generate a Node app that you can run with `npm start`. To use a different preset, add it to the `devDependencies` in `package.json` and specify in your `app.config.js`.

