!function(){var e=document.getElementById("visualiser"),n=e.getContext("2d"),t=0,i={init:function(i){t=Math.ceil(window.innerWidth/i.frequencyBinCount),e.width=i.frequencyBinCount,e.height=window.innerHeight/2,e.style.height="50vh",n.clearRect(0,0,e.width,e.height)},process:function(i){var o=new Uint8Array(i.frequencyBinCount);i.getByteFrequencyData(o),n.clearRect(0,0,e.width,e.height);for(var r=0;r<o.length;r++)n.fillRect(r*t,window.innerHeight/2-o[r],t,window.innerHeight/2)}},o=document.getElementById("visualiser"),r=o.getContext("2d"),a=0,c={init:function(e){o.width=e.frequencyBinCount,o.height=window.innerHeight,o.style.height="100vh",r.clearRect(0,0,o.width,o.height)},process:function(e){var n=new Uint8Array(e.frequencyBinCount);e.getByteFrequencyData(n);for(var t=r.getImageData(0,a,o.width,1),i=0;i<n.length;i++)t.data[4*i+0]=n[i],t.data[4*i+1]=n[i],t.data[4*i+2]=n[i],t.data[4*i+3]=255;r.putImageData(t,0,a),a+=1,a%=o.height}},d=document.getElementById("visualiser"),h=d.getContext("2d"),u={init:function(e){var n=new Float32Array(e.frequencyBinCount);d.width=n.length,d.height=window.innerHeight,d.style.height="100vh",h.clearRect(0,0,d.width,d.height)},process:function(e){var n=new Float32Array(e.frequencyBinCount);e.getFloatTimeDomainData(n),h.clearRect(0,0,d.width,d.height),h.beginPath();for(var t=0;t<n.length;t++){var i=(.5+n[t]/2)*d.height;0==t?h.moveTo(t,i):h.lineTo(t,i)}h.stroke()}};!function(e,n){if("undefined"==typeof document)return n;e=e||"";var t=document.head||document.getElementsByTagName("head")[0],i=document.createElement("style");i.type="text/css",t.appendChild(i),i.styleSheet?i.styleSheet.cssText=e:i.appendChild(document.createTextNode(e))}("\nbody {\n    margin: 0;\n    font-family: sans-serif;\n    width: 100%;\n    cursor: pointer;\n}\n\ncanvas {\n    z-index: 0;\n    width: 100%;\n    height: 100vh;\n}\n\ninput {\n    flex: 100%;\n    height: 50px;\n    background: transparent;\n    outline: none;\n    border: none;\n    border-bottom: 1px solid black;\n    font-size: 1rem;\n    color: black;\n}\n\nbutton {\n    width: 90px;\n    height: 50px;\n    border: 1px solid black;\n    background: transparent;\n    font-size: .8rem;\n    color: black;\n    margin-left: 20px;\n    text-transform: uppercase;\n    outline: none;\n    cursor: pointer;\n}\n\nbutton:hover {\n    border: 2px solid white;\n    font-size: .85rem;\n}\n\nbutton:disabled {\n    color: grey;\n}",void 0);var l=/^((?!chrome|android).)*safari/i.test(navigator.userAgent),s=new(window.AudioContext||window.webkitAudioContext),g=(document.getElementById("visualiser"),new Array(u,i,c));l&&g.shift();var f=0,w=s.createScriptProcessor(0,1,1),y=s.createAnalyser();navigator.mediaDevices.getUserMedia({audio:!0,video:!1,echoCancellation:!0}).then(function(e){var n=s.createMediaStreamSource(e);n.connect(w),n.connect(y),w.connect(s.destination),g[f].init(y),w.onaudioprocess=function(e){g[f].process(y),e.outputBuffer.getChannelData(0).forEach(function(e){return 0})}}).catch(function(e){return window.alert(e)}),document.body.onclick=function(){f=(f+1)%g.length,g[f].init(y)}}();
