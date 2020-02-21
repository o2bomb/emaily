const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export default emails => {
  const invalidEmails = emails
    .split(",")
    .map(value => {
      return value.trim();
    })
    .filter(value => {
      // Returns true if the email IS INVALID
      return regex.test(value) === false;
    });

  if (invalidEmails.length) {
    return `The following emails are invalid: ${invalidEmails}`;
  }

  return;
};
