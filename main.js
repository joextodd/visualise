!function(){var n=document.getElementById("visualiser"),e=n.getContext("2d"),t=0,i={init:function(i){t=Math.ceil(window.innerWidth/i.frequencyBinCount),n.width=i.frequencyBinCount,n.height=window.innerHeight/2,n.style.height="50vh",e.clearRect(0,0,n.width,n.height)},process:function(i){var o=new Uint8Array(i.frequencyBinCount);i.getByteFrequencyData(o),e.clearRect(0,0,n.width,n.height);for(var r=0;r<o.length;r++)e.fillRect(r*t,window.innerHeight/2-o[r],t,window.innerHeight/2)}},o=document.getElementById("visualiser"),r=o.getContext("2d"),a=0,c={init:function(n){o.width=window.innerWidth,o.height=n.frequencyBinCount,o.style.height="100vh",r.clearRect(0,0,o.width,o.height),a=o.width},process:function(n){var e=new Uint8Array(n.frequencyBinCount);n.getByteFrequencyData(e);for(var t=r.getImageData(a,0,1,o.height),i=0;i<e.length;i++)t.data[4*i+0]=e[e.length-i],t.data[4*i+1]=e[e.length-i],t.data[4*i+2]=e[e.length-i],t.data[4*i+3]=255;r.putImageData(t,a,0),a+=1,a%=o.width}},d=document.getElementById("visualiser"),h=d.getContext("2d"),u={init:function(n){var e=new Float32Array(n.frequencyBinCount);d.width=e.length,d.height=window.innerHeight,d.style.height="100vh",h.clearRect(0,0,d.width,d.height)},process:function(n){var e=new Float32Array(n.frequencyBinCount);n.getFloatTimeDomainData(e),h.clearRect(0,0,d.width,d.height),h.beginPath();for(var t=0;t<e.length;t++){var i=(.5+e[t]/2)*d.height;0==t?h.moveTo(t,i):h.lineTo(t,i)}h.stroke()}};!function(n,e){if("undefined"==typeof document)return e;n=n||"";var t=document.head||document.getElementsByTagName("head")[0],i=document.createElement("style");i.type="text/css",t.appendChild(i),i.styleSheet?i.styleSheet.cssText=n:i.appendChild(document.createTextNode(n))}("\nbody {\n    margin: 0;\n    font-family: sans-serif;\n    width: 100%;\n    cursor: pointer;\n    background: #DBD5C9;\n}\n\ncanvas {\n    z-index: 0;\n    width: 100%;\n    height: 100vh;\n}\n\ninput {\n    flex: 100%;\n    height: 50px;\n    background: transparent;\n    outline: none;\n    border: none;\n    border-bottom: 1px solid black;\n    font-size: 1rem;\n    color: black;\n}\n\nbutton {\n    position: absolute;\n    top: calc(50% - 25px);\n    left: calc(50% - 60px);\n    width: 120px;\n    height: 50px;\n    border: 1px solid black;\n    background: transparent;\n    font-size: .8rem;\n    color: black;\n    text-transform: uppercase;\n    outline: none;\n    cursor: pointer;\n}\n\nbutton:hover {\n    border: 2px solid white;\n    color: white;\n    font-size: .85rem;\n}\n\nbutton:disabled {\n    color: grey;\n}",void 0);var l=/^((?!chrome|android).)*safari/i.test(navigator.userAgent),s=(document.getElementById("visualiser"),new Array(u,i,c));l&&s.shift();var g=0,f=void 0;navigator.mediaDevices.getUserMedia({audio:!0,video:!1,echoCancellation:!0}).then(function(n){var e=new(window.AudioContext||window.webkitAudioContext),t=e.createScriptProcessor(0,1,1),i=e.createMediaStreamSource(n);f=e.createAnalyser(),i.connect(t),i.connect(f),t.connect(e.destination),s[g].init(f),t.onaudioprocess=function(n){s[g].process(f),n.outputBuffer.getChannelData(0).forEach(function(n){return 0})}}).catch(function(n){return window.alert(n)});var w=function(){g=(g+1)%s.length,s[g].init(f)};document.body.onclick=function(n){return w()}}();
