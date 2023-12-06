import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux'
import configureStore from './ReduxStore/store';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
// import registerServiceWorker from './registerServiceWorker';
const root = ReactDOM.createRoot(document.getElementById('root')as HTMLInputElement);

root.render(

  <Provider store={configureStore()}>

    <App />

  </Provider>

);
serviceWorker.unregister();
