const Address = () => null;

Address.OneLine = (props) => {
  const { object: address } = props;

  const parts = [];

  if (address.street != null) {
    parts.push(address.street);
  }

  if (address.town != null) {
    parts.push(address.town);
  }

  if (address.parish != null) {
    parts.push(`${address.parish} församling`);
  }

  if (parts.size === 0 && address.latitude != null && address.longitude != null) {
    parts.push(`${address.latitude},${address.longitude}`);
  }
  if (parts.size === 0) {
    return 'Empty address';
  }

  return parts.join(', ');
};

export { Address };
