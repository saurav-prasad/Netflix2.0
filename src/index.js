import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { VideoDetailState } from './context/videoDetailContext/VideoDetailContext';
import { UserDataState } from './context/userDataContext/UserDataState';
import UserDataReducer, { userDataInitialState } from './context/userDataContext/UserDataReducer';
import { VideoManagerState } from './context/videoManagerContext/VideoManagerContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <UserDataState initialstate={userDataInitialState} reducer={UserDataReducer}>
      <VideoManagerState>
        <VideoDetailState>
          <App />
        </VideoDetailState>
      </VideoManagerState>
    </UserDataState>
  </>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
