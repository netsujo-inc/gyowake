/* Kaigyo text-preserving splitter. No network and no automatic semantic classifier. */
(function(root){
  "use strict";
  function splitProtected(text, phrases){
    if(typeof text!=="string"||!Array.isArray(phrases)) throw new TypeError("text must be a string and phrases an array");
    const unique=[...new Set(phrases)];
    for(const phrase of unique){
      if(typeof phrase!=="string"||!phrase.trim()||!text.includes(phrase)) throw new Error("protected phrase must be nonempty and present in source text");
    }
    const out=[]; let cursor=0;
    while(cursor<text.length){
      const matches=unique.map(phrase=>({phrase,start:text.indexOf(phrase,cursor)})).filter(x=>x.start>=0).sort((a,b)=>a.start-b.start||b.phrase.length-a.phrase.length);
      const next=matches[0];
      if(!next){ out.push({text:text.slice(cursor),start:cursor,protected:false}); break; }
      if(next.start>cursor) out.push({text:text.slice(cursor,next.start),start:cursor,protected:false});
      out.push({text:next.phrase,start:next.start,protected:true});
      cursor=next.start+next.phrase.length;
    }
    return out;
  }
  const api={splitProtected};
  if(typeof module!=="undefined"&&module.exports) module.exports=api;
  root.KaigyoCore=api;
})(typeof globalThis!=="undefined"?globalThis:this);
