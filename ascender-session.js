window.AscenderSession={
  saveAdvisor(data){
    const advisor={name:(data?.name||'').trim(),phone:(data?.phone||'').trim(),updatedAt:new Date().toISOString()};
    localStorage.setItem('ascenderAdvisor',JSON.stringify(advisor));
    sessionStorage.setItem('ascenderAdvisor',JSON.stringify(advisor));
    return advisor;
  },
  getAdvisor(){
    try{return JSON.parse(localStorage.getItem('ascenderAdvisor')||sessionStorage.getItem('ascenderAdvisor')||'null')}catch(e){return null}
  },
  hasAdvisor(){
    const a=this.getAdvisor();return !!(a&&a.name);
  },
  saveCalculation(data){
    const advisor=this.getAdvisor();
    const payload={...data,advisor:advisor||data?.advisor||null,savedAt:new Date().toISOString()};
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
    const payload={...(data||{}),advisor:this.getAdvisor(),updatedAt:new Date().toISOString()};
    sessionStorage.setItem('ascenderMeetingProfile',JSON.stringify(payload));
    localStorage.setItem('ascenderMeetingProfile',JSON.stringify(payload));
    return payload;
  },
  getMeetingProfile(){
    try{return JSON.parse(localStorage.getItem('ascenderMeetingProfile')||sessionStorage.getItem('ascenderMeetingProfile')||'{}')}catch(e){return {}}
  },
  clearMeeting(){
    sessionStorage.removeItem('ascenderMeetingProfile');
    localStorage.removeItem('ascenderMeetingProfile');
    this.clearCalculation();
  }
};