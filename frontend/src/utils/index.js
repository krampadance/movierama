import moment from 'moment';

export const timeAgo = (date) => {
  const now = new Date();
  const nowMoment = moment(now).utc();
  const pastMoment = moment(date).utc();
  const timeAgoString = pastMoment.from(nowMoment); 
  return timeAgoString;
}; 