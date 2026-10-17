window.AscenderSession={
  saveAdvisor(data){
    const previous=this.getAdvisor()||{};
    const advisor={...previous,name:(data?.name||'').trim(),phone:(data?.phone||'').trim(),updatedAt:new Date().toISOString()};
    for(const key of ['photo','credentialImage','credentialHolder','credentialNumber','credentialRole'])if(data&&Object.hasOwn(data,key))advisor[key]=data[key];
    localStorage.setItem('ascenderAdvisor',JSON.stringify(advisor));
    // A single browser-local copy keeps image storage bounded.
    sessionStorage.removeItem('ascenderAdvisor');
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
    const payload={...data,advisor:advisor?{name:advisor.name,phone:advisor.phone}:(data?.advisor||null),savedAt:new Date().toISOString()};
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
    const payload={...(data||{}),advisor:(()=>{const a=this.getAdvisor();return a?{name:a.name,phone:a.phone}:null})(),updatedAt:new Date().toISOString()};
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