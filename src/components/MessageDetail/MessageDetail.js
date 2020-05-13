import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import utf8 from 'utf8';

import { getMessageFromApi } from '../../api/api';

import './messageDetail.css';

function getBody(result) {
  if (result.parts) {
    const textHtml = result.parts
      .filter(item => item.mimeType === 'text/html')[0];

    if (!textHtml) {
      return false;
    }

    return atob(textHtml.body.data.replace(/-/g, '+').replace(/_/g, '/'));
  }

  return atob(result.body.data.replace(/-/g, '+').replace(/_/g, '/'));
}

export const MessageDetail = ({ email, match }) => {
  const { messageId } = match.params;
  const [message, setMessage] = useState(null);

  const divElem = useRef(null);

  useEffect(() => {
    if (message) {
      const elem = divElem.current;
      const html = getBody(message.result.payload);

      if (!html) {
        return;
      }

      const text = utf8.decode(html);

      elem.innerHTML = text;
    }
  }, [message]);

  useEffect(() => {
    getMessageFromApi(email, messageId, 'full', setMessage);
  }, []);

  if (!message) {
    return false;
  }

  return (
    <div>
      <h1 className="message__heading">
        {message.payload.headers.find(item => item.name === 'Subject').value}
      </h1>
      <div className="message__info">
        <div className="message__users">
          <p className="message__user">
            {message.payload.headers.find(item => item.name === 'From').value}
          </p>
          <p className="message__user">
            {message.payload.headers.find(item => item.name === 'To').value}
          </p>
        </div>
        <div className="message__date">
          {message.payload.headers.find(item => item.name === 'Date').value}
        </div>
      </div>
      <div className="message__body" ref={divElem} />
    </div>
  );
};

MessageDetail.propTypes = {
  email: PropTypes.string.isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      messageId: PropTypes.string.isRequired,
    }),
  }).isRequired,
};
