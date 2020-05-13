import React from 'react';
import { NavLink } from 'react-router-dom';
import cx from 'classnames';
import PropTypes from 'prop-types';

import './labelsList.css';

export const LabelsList = ({ labels, setLabel, labelActive, messages }) => (
  <ul className="labels">
    {labels.map(label => (
      <li key={label.id} className="label__item">
        <NavLink
          to="/"
          className={cx({
            label__link: true,
            'label__link--not-active': label.name !== labelActive,
            'label__link--active': label.name === labelActive,
          })}
          onClick={() => setLabel(label.name)}
          exact
        >
          {label.name}
        </NavLink>
        <span className={cx({
          label__messages: true,
          'label__messages--not-active': label.name !== labelActive,
          'label__messages--active': label.name === labelActive,
        })}
        >
          {messages}
        </span>
      </li>
    ))}
  </ul>
);

LabelsList.propTypes = {
  labels: PropTypes.arrayOf.isRequired,
  setLabel: PropTypes.func.isRequired,
  labelActive: PropTypes.string.isRequired,
  messages: PropTypes.number.isRequired,
};
