/* eslint-disable max-len */
/* eslint-disable no-console */
/* eslint-disable no-undef */
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Route, Switch } from 'react-router-dom';
import Loader from 'react-loader-spinner';

import './App.css';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

import {
  getLabelsFromApi,
  getMessagesListFromApi,
  getMessageFromApi,
} from './api/api';
import { LabelsList } from './components/LabelsList/LabelsList';
import { MessagesList } from './components/MessagesList/MessagesList';
import { MessageDetail } from './components/MessageDetail/MessageDetail';

function App() {
  const [isAuthorize, setIsAuthorize] = useState(false);
  const [email, setEmail] = useState('');
  const [labels, setLabels] = useState([]);
  const [messagesList, SetMessagesList] = useState([]);
  const [messagesFullList, setMessagesFullList] = useState([]);
  const [label, setLabel] = useState('INBOX');

  useEffect(() => {
    gapi.load('client:auth2', () => {
      gapi.auth2.init({
        client_id: '1056376296717-ushbrdqriiptt7h36u8oh4p516mia1ag.apps.googleusercontent.com',
      });
    });
  }, []);

  const authenticate = useCallback(
    () => {
      gapi.auth2.getAuthInstance()
        .signIn({
          scope: 'https://mail.google.com/ https://www.googleapis.com/auth/gmail.labels https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.readonly',
        })
        .then((response) => {
          console.log('Sign-in successful');
          setEmail(response.Pt.yu);
        },
        err => (console.error('Error signing in', err)))
        .then(() => {
          gapi.client.setApiKey('AIzaSyDV2PEUrOVZDcH5ehjUA-7Mmh5X78G_ogY');

          return gapi.client.load(
            'https://content.googleapis.com/discovery/v1/apis/gmail/v1/rest',
          )
            .then(() => {
              console.log('GAPI client loaded for API');
              setIsAuthorize(true);
            },
            err => (console.error('Error loading GAPI client for API', err)));
        });
    }, [],
  );

  useEffect(() => {
    if (isAuthorize) {
      getLabelsFromApi(email, setLabels);
      getMessagesListFromApi(email, SetMessagesList);
    }
  }, [isAuthorize]);

  useEffect(() => {
    if (messagesList.length) {
      const messageListPromise = messagesList.map(message => (
        new Promise((resolve) => {
          getMessageFromApi(email, message.id, 'metadata', resolve);
        })
      ));

      Promise.all(messageListPromise).then(setMessagesFullList);
    }
  }, [messagesList]);

  const filteredMessagesList = useMemo(() => {
    if (messagesFullList.length) {
      return messagesFullList.filter(message => (
        message.labelIds.includes(label)
      ));
    }

    return null;
  }, [messagesFullList, label]);

  return (
    <div className="App">
      <div className="logo">
        <img
          className="logo__image"
          src="https://ssl.gstatic.com/ui/v1/icons/mail/rfr/logo_gmail_lockup_default_1x.png"
          alt="logo_image"
        />
        <h2 className="logo__title">Gmail</h2>
      </div>
      {!isAuthorize
        ? (
          <button
            type="button"
            className="authorize-button"
            onClick={authenticate}
          >
            authorize and load
          </button>
        ) : (
          <>
            <h1 className="heading">Test task</h1>
            {!filteredMessagesList && (
              <Loader
                type="TailSpin"
                color="#d93025"
                height={100}
                width={100}
                className="loader"
              />
            )}
            {filteredMessagesList && (
              <main className="main">
                <LabelsList
                  labels={labels}
                  setLabel={setLabel}
                  labelActive={label}
                  messages={filteredMessagesList.length}
                />
                <section className="messages">
                  <Switch>
                    <Route
                      path="/"
                      render={() => <MessagesList filteredMessagesList={filteredMessagesList} />}
                      exact
                    />
                    <Route
                      path="/:messageId"
                      render={({ match }) => <MessageDetail email={email} match={match} />}
                      exact
                    />
                  </Switch>
                </section>
              </main>
            )}
          </>
        )
      }
    </div>
  );
}

export default App;
