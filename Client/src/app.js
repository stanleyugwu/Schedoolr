import React from "react";
import ReactDOM from "react-dom";
import 'normalize.css/normalize.css';
import './styles/app.scss';
import AppRouter from './AppRouter/AppRouter';

console.log('App is Running!!')

const appRoot = document.getElementById('app');


//export {IndecisionApp as default}
ReactDOM.render(<AppRouter />, appRoot);