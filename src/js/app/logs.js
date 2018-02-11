const logsCreate = (isDev) => {
  const lgs = [];
  return {
    log: (e) => { isDev? console.log('Error Logged!',e): lgs.push(e) },
    get: () => {return lgs},
  }
};

export default logsCreate;
