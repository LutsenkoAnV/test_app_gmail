/* eslint-disable no-undef */
export const getLabelsFromApi = (userId, callback) => {
  const request = gapi.client.gmail.users.labels.list({
    userId,
  });

  request.execute((resp) => {
    const { labels } = resp;

    callback(labels);
  });
};

export const getMessagesListFromApi = (userId, callback) => {
  const getPageOfMessages = (request, result) => {
    request.execute((resp) => {
      const res = [...result, ...resp.messages];
      const { nextPageToken } = resp;

      if (nextPageToken && res.length <= 400) {
        const req = gapi.client.gmail.users.messages.list({
          userId,
          pageToken: nextPageToken,
        });

        getPageOfMessages(req, res);
      } else {
        callback(res);
      }
    });
  };

  const initialRequest = gapi.client.gmail.users.messages.list({
    userId,
  });

  getPageOfMessages(initialRequest, []);
};

export const getMessageFromApi = (userId, messageId, format, callback) => {
  const request = gapi.client.gmail.users.messages.get({
    userId,
    id: messageId,
    format,
  });

  return request.execute(callback);
};
