/* eslint-disable max-len */
import React, { useEffect, useCallback, useState } from 'react';
import { NavLink } from 'react-router-dom';
import PropTypes from 'prop-types';

import './messagesList.css';

export const MessagesList = ({ filteredMessagesList }) => {
  const [filtered, setFiltered] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [endIndex, setEndIndex] = useState(49);
  let start = 0;
  let end = 49;

  useEffect(() => {
    if (!filteredMessagesList) {
      return;
    }

    const filteredList = filteredMessagesList
      .filter((item, index) => index <= endIndex);

    setFiltered(filteredList);
    setStartIndex(0);
    setEndIndex(49);
  }, [filteredMessagesList]);

  const nextPage = useCallback(() => {
    if (end === filteredMessagesList.length - 1) {
      return;
    }

    start += 50;
    end += 50;

    if (end > filteredMessagesList.length) {
      end = filteredMessagesList.length - 1;
      setStartIndex(start);
      setEndIndex(end);
    } else {
      setStartIndex(start);
      setEndIndex(end);
    }

    const filteredList = filteredMessagesList
      .filter((item, index) => (index >= start) && (index <= end));

    setFiltered(filteredList);
  }, [filteredMessagesList]);

  const previousPage = useCallback(() => {
    if (start === 0) {
      return;
    }

    if (end === filteredMessagesList.length - 1) {
      end = start;
    } else {
      end -= 50;
    }

    start -= 50;
    setStartIndex(start);
    setEndIndex(end);

    const filteredList = filteredMessagesList
      .filter((item, index) => (index >= start) && (index <= end));

    setFiltered(filteredList);
  }, [filteredMessagesList]);

  if (!filteredMessagesList) {
    return false;
  }

  return (
    <div>
      <div className="messages__header">
        <p className="messages__quantity">
          {`${filtered.length !== 0 ? `${startIndex + 1}` : 0} -
            ${(filteredMessagesList.length > 50) ? `${endIndex + 1}` : `${filteredMessagesList.length}`} of
            ${filteredMessagesList.length}`}
        </p>
        <div className="messages__buttons">
          <button
            type="button"
            className="messages__button"
            disabled={startIndex === 0}
            onClick={previousPage}
          >
            &lt;
          </button>
          <button
            type="button"
            className="messages__button"
            disabled={endIndex + 1 === filteredMessagesList.length}
            onClick={nextPage}
          >
            &gt;
          </button>
        </div>
      </div>
      <div className="messages__list">
        {!!filtered.length && filtered.map(message => (
          <NavLink
            to={`/${message.id}`}
            key={message.id}
            className="messages__item"
            exact
          >
            <p className="messages__heading messages__from">
              {message.payload.headers
                .find(item => item.name === 'From').value
                .match(/(.+(?=<))|(.+)/)[0]}
            </p>
            <div className="subject__wrapper">
              <p className="messages__heading messages__subject">
                {message.payload.headers
                  .find(item => item.name === 'Subject').value}
              </p>
            </div>
            <p className="messages__heading messages__date">
              {message.payload.headers
                .find(item => item.name === 'Date').value
                .match(/\d{2}\s\w{3}\s\d{4}\s\d{2}:\d{2}:\d{2}/)}
            </p>
          </NavLink>
        ))}
      </div>
    </div>
  );
};

MessagesList.propTypes = {
  filteredMessagesList: PropTypes.arrayOf.isRequired,
};
