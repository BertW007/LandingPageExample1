const logsCreate = (isDev) => {
  const lgs = [];
  return {
    log: (e) => { isDev? console.log('Error Logged!',e): lgs.push(e) },
    getLogs: () => {return lgs},
  }
};

export default logsCreate;
