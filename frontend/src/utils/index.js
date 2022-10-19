import moment from 'moment';
import { notification } from 'antd';

export const timeAgo = (date) => {
  // returns how long ago a date is from now, eg 17 minutes ago
  const now = new Date();
  const nowMoment = moment(now).utc();
  const pastMoment = moment(date).utc();
  const timeAgoString = pastMoment.from(nowMoment);
  return timeAgoString;
};

export const showError = (message, description) => {
  // Shows error notification when called
  notification.error({
    message,
    description
  });
};

export const showSuccess = (message, description) => {
  // Shows success notification when called
  notification.success({
    message,
    description
  });
};
