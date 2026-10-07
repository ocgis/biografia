const getPrimaryPosition = (object) => {
  let primaryPosition = null;
  if (object._type_ === 'Address') {
    if ((object.latitude != null)
        && (object.longitude != null)) {
      primaryPosition = object;
    }
  } else if ('related' in object && 'addresses' in object.related) {
    object.related.addresses.forEach((address) => {
      if ((address.latitude != null)
          && (address.longitude != null)) {
        primaryPosition = address;
      }
    });
  }
  return primaryPosition;
};

export { getPrimaryPosition };
