import moment from 'moment';

const EventDate = () => null;

EventDate.OneLine = (props) => {
  const { object: eventDate } = props;

  return moment(eventDate.date).format(eventDate.mask);
};

export { EventDate };
