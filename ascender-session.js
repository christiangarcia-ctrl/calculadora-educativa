window.AscenderSession={
  saveCalculation(data){
    const payload={...data,savedAt:new Date().toISOString()};
    localStorage.setItem('ascenderSavedCalculation',JSON.stringify(payload));
    sessionStorage.setItem('ascenderSavedCalculation',JSON.stringify(payload));
    return payload;
  },
  getCalculation(){
    try{return JSON.parse(localStorage.getItem('ascenderSavedCalculation')||sessionStorage.getItem('ascenderSavedCalculation')||'null')}catch(e){return null}
  },
  clearCalculation(){
    localStorage.removeItem('ascenderSavedCalculation');
    sessionStorage.removeItem('ascenderSavedCalculation');
  },
  saveMeetingProfile(data){
    sessionStorage.setItem('ascenderMeetingProfile',JSON.stringify(data||{}));
  },
  getMeetingProfile(){
    try{return JSON.parse(sessionStorage.getItem('ascenderMeetingProfile')||'{}')}catch(e){return {}}
  }
};