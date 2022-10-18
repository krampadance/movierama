import moment from 'moment';
import { notification } from 'antd';

export const timeAgo = (date) => {
  const now = new Date();
  const nowMoment = moment(now).utc();
  const pastMoment = moment(date).utc();
  const timeAgoString = pastMoment.from(nowMoment);
  return timeAgoString;
};

export const showError = (message, description) => {
  notification.error({
    message,
    description
  });
};

export const showSuccess = (message, description) => {
  notification.success({
    message,
    description
  });
};
