import{z as Np,B as If,s as Ip,h as Bo,j as Up,o as Ee,c as Ae,a as Ie,F as Ai,r as fr,t as zn,b as zo,C as Qn,D as Op,k as Fu,G as Fp,l as fa,f as Bu,n as zu,T as Bp,q as dr,E as ku,H as zp,g as gs,J as kp}from"./index-Cxw6SUrE.js";/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Oc="187",Bs={ROTATE:0,DOLLY:1,PAN:2},Is={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Gp=0,Gu=1,Hp=2,Va=1,Vp=2,Er=3,cs=0,fn=1,Xn=2,ss=0,Cr=1,Al=2,Hu=3,Vu=4,Wp=5,Ns=100,Xp=101,qp=102,Yp=103,Zp=104,Kp=200,Jp=201,$p=202,Qp=203,Uf=204,Of=205,jp=206,tm=207,em=208,nm=209,im=210,sm=211,rm=212,am=213,om=214,Rl=0,Cl=1,Pl=2,Fr=3,Dl=4,Ll=5,Nl=6,Il=7,Ff=0,lm=1,cm=2,yi=0,Fc=1,Bc=2,zc=3,wo=4,kc=5,Gc=6,Hc=7,Bf=300,Ws=301,Br=302,ko=303,Go=304,Ul=1e3,vi=1001,Ol=1002,$e=1003,um=1004,da=1005,on=1006,Ho=1007,Mi=1008,En=1009,zf=1010,kf=1011,zr=1012,Vc=1013,ai=1014,Yn=1015,dn=1016,Wc=1017,Xc=1018,Xs=1020,Gf=35902,Hf=35899,Vf=1021,Wf=1022,si=1023,Hi=1026,Ii=1027,qc=1028,Yc=1029,us=1030,Zc=1031,Kc=1033,Wa=33776,Xa=33777,qa=33778,Ya=33779,Fl=35840,Bl=35841,zl=35842,kl=35843,Gl=36196,Hl=37492,Vl=37496,Wl=37488,Xl=37489,no=37490,ql=37491,Yl=37808,Zl=37809,Kl=37810,Jl=37811,$l=37812,Ql=37813,jl=37814,tc=37815,ec=37816,nc=37817,ic=37818,sc=37819,rc=37820,ac=37821,oc=36492,lc=36494,cc=36495,uc=36283,hc=36284,io=36285,fc=36286,hm=3200,dc=0,fm=1,Ni="",cn="srgb",so="srgb-linear",ro="linear",pe="srgb",Vo=7680,dm=519,pm=512,mm=513,_m=514,Xf=515,gm=516,xm=517,qf=518,Yf=519,vm=35044,Wu="300 es",Zn=2e3,kr=2001;function Mm(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function ao(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Sm(){const s=ao("canvas");return s.style.display="block",s}const Xu={};function qu(...s){const t="THREE."+s.shift();console.log(t,...s)}function Zf(s){const t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function Yt(...s){s=Zf(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function he(...s){s=Zf(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function zs(...s){const t=s.join(" ");t in Xu||(Xu[t]=!0,Yt(...s))}function ym(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const bm={[Rl]:Rl,[Pl]:Nl,[Dl]:Dl,[Fr]:Ll,[Cl]:Cl,[Nl]:Pl,[Il]:Il,[Ll]:Fr};class qi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const i=n[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,t);t.target=null}}}const je=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Yu=1234567;const Pr=Math.PI/180,Gr=180/Math.PI;function fs(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(je[s&255]+je[s>>8&255]+je[s>>16&255]+je[s>>24&255]+"-"+je[t&255]+je[t>>8&255]+"-"+je[t>>16&15|64]+je[t>>24&255]+"-"+je[e&63|128]+je[e>>8&255]+"-"+je[e>>16&255]+je[e>>24&255]+je[n&255]+je[n>>8&255]+je[n>>16&255]+je[n>>24&255]).toLowerCase()}function re(s,t,e){return Math.max(t,Math.min(e,s))}function Jc(s,t){return(s%t+t)%t}function Em(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function Tm(s,t,e){return s!==t?(e-s)/(t-s):0}function Dr(s,t,e){return(1-e)*s+e*t}function wm(s,t,e,n){return Dr(s,t,1-Math.exp(-e*n))}function Am(s,t=1){return t-Math.abs(Jc(s,t*2)-t)}function Rm(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function Cm(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Pm(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Dm(s,t){return s+Math.random()*(t-s)}function Lm(s){return s*(.5-Math.random())}function Nm(s){s!==void 0&&(Yu=s);let t=Yu+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Im(s){return s*Pr}function Um(s){return s*Gr}function Om(s){return s>0&&Number.isInteger(s)&&2**Math.round(Math.log2(s))===s}function Fm(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Kf(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function Bm(s,t,e,n,i){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),u=a((t+n)/2),f=r((t-n)/2),h=a((t-n)/2),d=r((n-t)/2),g=a((n-t)/2);switch(i){case"XYX":s.set(o*u,l*f,l*h,o*c);break;case"YZY":s.set(l*h,o*u,l*f,o*c);break;case"ZXZ":s.set(l*f,l*h,o*u,o*c);break;case"XZX":s.set(o*u,l*g,l*d,o*c);break;case"YXY":s.set(l*d,o*u,l*g,o*c);break;case"ZYZ":s.set(l*g,l*d,o*u,o*c);break;default:Yt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function $c(s){switch(s.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function Jf(s,t){if(t.constructor===Float32Array)return s;const e=$c(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(s/e,-1)}function $f(s,t){if(t.constructor===Float32Array)return s;const e=$c(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(s*e)}const pc={DEG2RAD:Pr,RAD2DEG:Gr,generateUUID:fs,clamp:re,euclideanModulo:Jc,mapLinear:Em,inverseLerp:Tm,lerp:Dr,damp:wm,pingpong:Am,smoothstep:Rm,smootherstep:Cm,randInt:Pm,randFloat:Dm,randFloatSpread:Lm,seededRandom:Nm,degToRad:Im,radToDeg:Um,isPowerOfTwo:Om,ceilPowerOfTwo:Fm,floorPowerOfTwo:Kf,setQuaternionFromProperEuler:Bm,normalize:$f,denormalize:Jf},Lu=class Lu{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=re(this.x,t.x,e.x),this.y=re(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=re(this.x,t,e),this.y=re(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(re(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(re(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*i+t.x,this.y=r*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Lu.prototype.isVector2=!0;let ct=Lu;class Jn{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,a,o){let l=n[i+0],c=n[i+1],u=n[i+2],f=n[i+3],h=r[a+0],d=r[a+1],g=r[a+2],_=r[a+3];if(f!==_||l!==h||c!==d||u!==g){let p=l*h+c*d+u*g+f*_;p<0&&(h=-h,d=-d,g=-g,_=-_,p=-p);let m=1-o;if(p<.9995){const x=Math.acos(p),M=Math.sin(x);m=Math.sin(m*x)/M,o=Math.sin(o*x)/M,l=l*m+h*o,c=c*m+d*o,u=u*m+g*o,f=f*m+_*o}else{l=l*m+h*o,c=c*m+d*o,u=u*m+g*o,f=f*m+_*o;const x=1/Math.sqrt(l*l+c*c+u*u+f*f);l*=x,c*=x,u*=x,f*=x}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],u=n[i+3],f=r[a],h=r[a+1],d=r[a+2],g=r[a+3];return t[e]=o*g+u*f+l*d-c*h,t[e+1]=l*g+u*h+c*f-o*d,t[e+2]=c*g+u*d+o*h-l*f,t[e+3]=u*g-o*f-l*h-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(i/2),f=o(r/2),h=l(n/2),d=l(i/2),g=l(r/2);switch(a){case"XYZ":this._x=h*u*f+c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f-h*d*g;break;case"YXZ":this._x=h*u*f+c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f+h*d*g;break;case"ZXY":this._x=h*u*f-c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f-h*d*g;break;case"ZYX":this._x=h*u*f-c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f+h*d*g;break;case"YZX":this._x=h*u*f+c*d*g,this._y=c*d*f+h*u*g,this._z=c*u*g-h*d*f,this._w=c*u*f-h*d*g;break;case"XZY":this._x=h*u*f-c*d*g,this._y=c*d*f-h*u*g,this._z=c*u*g+h*d*f,this._w=c*u*f+h*d*g;break;default:Yt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],u=e[6],f=e[10],h=n+o+f;if(h>0){const d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(u-l)*d,this._y=(r-c)*d,this._z=(a-i)*d}else if(n>o&&n>f){const d=2*Math.sqrt(1+n-o-f);this._w=(u-l)/d,this._x=.25*d,this._y=(i+a)/d,this._z=(r+c)/d}else if(o>f){const d=2*Math.sqrt(1+o-n-f);this._w=(r-c)/d,this._x=(i+a)/d,this._y=.25*d,this._z=(l+u)/d}else{const d=2*Math.sqrt(1+f-n-o);this._w=(a-i)/d,this._x=(r+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(re(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+a*o+i*c-r*l,this._y=i*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-i*o,this._w=a*u-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,e=Math.sin(e*c)/u,this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Nu=class Nu{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Zu.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Zu.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*i-o*n),u=2*(o*e-r*i),f=2*(r*n-a*e);return this.x=e+l*c+a*f-o*u,this.y=n+l*u+o*c-r*f,this.z=i+l*f+r*u-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=re(this.x,t.x,e.x),this.y=re(this.y,t.y,e.y),this.z=re(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=re(this.x,t,e),this.y=re(this.y,t,e),this.z=re(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(re(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Wo.copy(this).projectOnVector(t),this.sub(Wo)}reflect(t){return this.sub(Wo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(re(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Nu.prototype.isVector3=!0;let N=Nu;const Wo=new N,Zu=new Jn,Iu=class Iu{constructor(t,e,n,i,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c)}set(t,e,n,i,r,a,o,l,c){const u=this.elements;return u[0]=t,u[1]=i,u[2]=o,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],f=n[7],h=n[2],d=n[5],g=n[8],_=i[0],p=i[3],m=i[6],x=i[1],M=i[4],S=i[7],b=i[2],E=i[5],v=i[8];return r[0]=a*_+o*x+l*b,r[3]=a*p+o*M+l*E,r[6]=a*m+o*S+l*v,r[1]=c*_+u*x+f*b,r[4]=c*p+u*M+f*E,r[7]=c*m+u*S+f*v,r[2]=h*_+d*x+g*b,r[5]=h*p+d*M+g*E,r[8]=h*m+d*S+g*v,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8];return e*a*u-e*o*c-n*r*u+n*o*l+i*r*c-i*a*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],f=u*a-o*c,h=o*l-u*r,d=c*r-a*l,g=e*f+n*h+i*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/g;return t[0]=f*_,t[1]=(i*c-u*n)*_,t[2]=(o*n-i*a)*_,t[3]=h*_,t[4]=(u*e-i*l)*_,t[5]=(i*r-o*e)*_,t[6]=d*_,t[7]=(n*l-c*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-i*c,i*l,-i*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return zs("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Xo.makeScale(t,e)),this}rotate(t){return zs("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Xo.makeRotation(-t)),this}translate(t,e){return zs("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Xo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Iu.prototype.isMatrix3=!0;let Kt=Iu;const Xo=new Kt,Ku=new Kt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ju=new Kt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function zm(){const s={enabled:!0,workingColorSpace:so,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===pe&&(i.r=bi(i.r),i.g=bi(i.g),i.b=bi(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===pe&&(i.r=ks(i.r),i.g=ks(i.g),i.b=ks(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Ni?ro:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[so]:{primaries:t,whitePoint:n,transfer:ro,toXYZ:Ku,fromXYZ:Ju,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:cn},outputColorSpaceConfig:{drawingBufferColorSpace:cn}},[cn]:{primaries:t,whitePoint:n,transfer:pe,toXYZ:Ku,fromXYZ:Ju,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:cn}}}),s}const oe=zm();function bi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function ks(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let xs;class km{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{xs===void 0&&(xs=ao("canvas")),xs.width=t.width,xs.height=t.height;const i=xs.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=xs}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=ao("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=bi(r[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(bi(e[n]/255)*255):e[n]=bi(e[n]);return{data:e,width:t.width,height:t.height}}else return Yt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Gm=0;class Qc{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Gm++}),this.uuid=fs(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width||0,e.height||0,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(qo(i[a].image)):r.push(qo(i[a]))}else r=qo(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function qo(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?km.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(Yt("Texture: Unable to serialize Texture."),{})}let Hm=0;const Yo=new N;class nn extends qi{constructor(t=nn.DEFAULT_IMAGE,e=nn.DEFAULT_MAPPING,n=vi,i=vi,r=on,a=Mi,o=si,l=En,c=nn.DEFAULT_ANISOTROPY,u=Ni){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Hm++}),this.uuid=fs(),this.name="",this.source=new Qc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new ct(0,0),this.repeat=new ct(1,1),this.center=new ct(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Kt,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Yo).x}get height(){return this.source.getSize(Yo).y}get depth(){return this.source.getSize(Yo).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.mipmapsAutoUpdate=t.mipmapsAutoUpdate,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isPMREMTexture=t.isPMREMTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){Yt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){Yt(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Bf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Ul:t.x=t.x-Math.floor(t.x);break;case vi:t.x=t.x<0?0:1;break;case Ol:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Ul:t.y=t.y-Math.floor(t.y);break;case vi:t.y=t.y<0?0:1;break;case Ol:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}nn.DEFAULT_IMAGE=null;nn.DEFAULT_MAPPING=Bf;nn.DEFAULT_ANISOTROPY=1;const Uu=class Uu{constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],u=l[4],f=l[8],h=l[1],d=l[5],g=l[9],_=l[2],p=l[6],m=l[10];if(Math.abs(u-h)<.01&&Math.abs(f-_)<.01&&Math.abs(g-p)<.01){if(Math.abs(u+h)<.1&&Math.abs(f+_)<.1&&Math.abs(g+p)<.1&&Math.abs(c+d+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(c+1)/2,S=(d+1)/2,b=(m+1)/2,E=(u+h)/4,v=(f+_)/4,y=(g+p)/4;return M>S&&M>b?M<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(M),i=E/n,r=v/n):S>b?S<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(S),n=E/i,r=y/i):b<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(b),n=v/r,i=y/r),this.set(n,i,r,e),this}let x=Math.sqrt((p-g)*(p-g)+(f-_)*(f-_)+(h-u)*(h-u));return Math.abs(x)<.001&&(x=1),this.x=(p-g)/x,this.y=(f-_)/x,this.z=(h-u)/x,this.w=Math.acos((c+d+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=re(this.x,t.x,e.x),this.y=re(this.y,t.y,e.y),this.z=re(this.z,t.z,e.z),this.w=re(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=re(this.x,t,e),this.y=re(this.y,t,e),this.z=re(this.z,t,e),this.w=re(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(re(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Uu.prototype.isVector4=!0;let Pe=Uu;class Vm extends qi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:on,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Pe(0,0,t,e),this.scissorTest=!1,this.viewport=new Pe(0,0,t,e),this.textures=[];const i=n.count;for(let r=0;r<i;r++)this.textures[r]=new nn({width:t,height:e,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:on,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.mipmapsAutoUpdate!==void 0&&(e.mipmapsAutoUpdate=t.mipmapsAutoUpdate),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const i=Object.assign({},t.textures[e].image);this.textures[e].source=new Qc(i)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){const e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;else this.depthTexture=null;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class pn extends Vm{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Qf extends nn{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=$e,this.minFilter=$e,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Wm extends nn{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=$e,this.minFilter=$e,this.wrapR=vi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}}const To=class To{constructor(t,e,n,i,r,a,o,l,c,u,f,h,d,g,_,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c,u,f,h,d,g,_,p)}set(t,e,n,i,r,a,o,l,c,u,f,h,d,g,_,p){const m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=i,m[1]=r,m[5]=a,m[9]=o,m[13]=l,m[2]=c,m[6]=u,m[10]=f,m[14]=h,m[3]=d,m[7]=g,m[11]=_,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new To().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,n=t.elements,i=1/vs.setFromMatrixColumn(t,0).length(),r=1/vs.setFromMatrixColumn(t,1).length(),a=1/vs.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){const h=a*u,d=a*f,g=o*u,_=o*f;e[0]=l*u,e[4]=-l*f,e[8]=c,e[1]=d+g*c,e[5]=h-_*c,e[9]=-o*l,e[2]=_-h*c,e[6]=g+d*c,e[10]=a*l}else if(t.order==="YXZ"){const h=l*u,d=l*f,g=c*u,_=c*f;e[0]=h+_*o,e[4]=g*o-d,e[8]=a*c,e[1]=a*f,e[5]=a*u,e[9]=-o,e[2]=d*o-g,e[6]=_+h*o,e[10]=a*l}else if(t.order==="ZXY"){const h=l*u,d=l*f,g=c*u,_=c*f;e[0]=h-_*o,e[4]=-a*f,e[8]=g+d*o,e[1]=d+g*o,e[5]=a*u,e[9]=_-h*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const h=a*u,d=a*f,g=o*u,_=o*f;e[0]=l*u,e[4]=g*c-d,e[8]=h*c+_,e[1]=l*f,e[5]=_*c+h,e[9]=d*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const h=a*l,d=a*c,g=o*l,_=o*c;e[0]=l*u,e[4]=_-h*f,e[8]=g*f+d,e[1]=f,e[5]=a*u,e[9]=-o*u,e[2]=-c*u,e[6]=d*f+g,e[10]=h-_*f}else if(t.order==="XZY"){const h=a*l,d=a*c,g=o*l,_=o*c;e[0]=l*u,e[4]=-f,e[8]=c*u,e[1]=h*f+_,e[5]=a*u,e[9]=d*f-g,e[2]=g*f-d,e[6]=o*u,e[10]=_*f+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Xm,t,qm)}lookAt(t,e,n){const i=this.elements;return Sn.subVectors(t,e),Sn.lengthSq()===0&&(Sn.z=1),Sn.normalize(),Ri.crossVectors(n,Sn),Ri.lengthSq()===0&&(Math.abs(n.z)===1?Sn.x+=1e-4:Sn.z+=1e-4,Sn.normalize(),Ri.crossVectors(n,Sn)),Ri.normalize(),pa.crossVectors(Sn,Ri),i[0]=Ri.x,i[4]=pa.x,i[8]=Sn.x,i[1]=Ri.y,i[5]=pa.y,i[9]=Sn.y,i[2]=Ri.z,i[6]=pa.z,i[10]=Sn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],f=n[5],h=n[9],d=n[13],g=n[2],_=n[6],p=n[10],m=n[14],x=n[3],M=n[7],S=n[11],b=n[15],E=i[0],v=i[4],y=i[8],C=i[12],R=i[1],L=i[5],U=i[9],B=i[13],w=i[2],I=i[6],D=i[10],O=i[14],H=i[3],z=i[7],V=i[11],Y=i[15];return r[0]=a*E+o*R+l*w+c*H,r[4]=a*v+o*L+l*I+c*z,r[8]=a*y+o*U+l*D+c*V,r[12]=a*C+o*B+l*O+c*Y,r[1]=u*E+f*R+h*w+d*H,r[5]=u*v+f*L+h*I+d*z,r[9]=u*y+f*U+h*D+d*V,r[13]=u*C+f*B+h*O+d*Y,r[2]=g*E+_*R+p*w+m*H,r[6]=g*v+_*L+p*I+m*z,r[10]=g*y+_*U+p*D+m*V,r[14]=g*C+_*B+p*O+m*Y,r[3]=x*E+M*R+S*w+b*H,r[7]=x*v+M*L+S*I+b*z,r[11]=x*y+M*U+S*D+b*V,r[15]=x*C+M*B+S*O+b*Y,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],u=t[2],f=t[6],h=t[10],d=t[14],g=t[3],_=t[7],p=t[11],m=t[15],x=l*d-c*h,M=o*d-c*f,S=o*h-l*f,b=a*d-c*u,E=a*h-l*u,v=a*f-o*u;return e*(_*x-p*M+m*S)-n*(g*x-p*b+m*E)+i*(g*M-_*b+m*v)-r*(g*S-_*E+p*v)}determinantAffine(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],u=t[10];return e*(a*u-o*c)-n*(r*u-o*l)+i*(r*c-a*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],f=t[9],h=t[10],d=t[11],g=t[12],_=t[13],p=t[14],m=t[15],x=e*o-n*a,M=e*l-i*a,S=e*c-r*a,b=n*l-i*o,E=n*c-r*o,v=i*c-r*l,y=u*_-f*g,C=u*p-h*g,R=u*m-d*g,L=f*p-h*_,U=f*m-d*_,B=h*m-d*p,w=x*B-M*U+S*L+b*R-E*C+v*y;if(w===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const I=1/w;return t[0]=(o*B-l*U+c*L)*I,t[1]=(i*U-n*B-r*L)*I,t[2]=(_*v-p*E+m*b)*I,t[3]=(h*E-f*v-d*b)*I,t[4]=(l*R-a*B-c*C)*I,t[5]=(e*B-i*R+r*C)*I,t[6]=(p*S-g*v-m*M)*I,t[7]=(u*v-h*S+d*M)*I,t[8]=(a*U-o*R+c*y)*I,t[9]=(n*R-e*U-r*y)*I,t[10]=(g*E-_*S+m*x)*I,t[11]=(f*S-u*E-d*x)*I,t[12]=(o*C-a*L-l*y)*I,t[13]=(e*L-n*C+i*y)*I,t[14]=(_*M-g*b-p*x)*I,t[15]=(u*b-f*M+h*x)*I,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,u*o+n,u*l-i*a,0,c*l-i*o,u*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,a){return this.set(1,n,r,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,u=a+a,f=o+o,h=r*c,d=r*u,g=r*f,_=a*u,p=a*f,m=o*f,x=l*c,M=l*u,S=l*f,b=n.x,E=n.y,v=n.z;return i[0]=(1-(_+m))*b,i[1]=(d+S)*b,i[2]=(g-M)*b,i[3]=0,i[4]=(d-S)*E,i[5]=(1-(h+m))*E,i[6]=(p+x)*E,i[7]=0,i[8]=(g+M)*v,i[9]=(p-x)*v,i[10]=(1-(h+_))*v,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=vs.set(i[0],i[1],i[2]).length();const o=vs.set(i[4],i[5],i[6]).length(),l=vs.set(i[8],i[9],i[10]).length();r<0&&(a=-a),kn.copy(this);const c=1/a,u=1/o,f=1/l;return kn.elements[0]*=c,kn.elements[1]*=c,kn.elements[2]*=c,kn.elements[4]*=u,kn.elements[5]*=u,kn.elements[6]*=u,kn.elements[8]*=f,kn.elements[9]*=f,kn.elements[10]*=f,e.setFromRotationMatrix(kn),n.x=a,n.y=o,n.z=l,this}makePerspective(t,e,n,i,r,a,o=Zn,l=!1){const c=this.elements,u=2*r/(e-t),f=2*r/(n-i),h=(e+t)/(e-t),d=(n+i)/(n-i);let g,_;if(l)g=r/(a-r),_=a*r/(a-r);else if(o===Zn)g=-(a+r)/(a-r),_=-2*a*r/(a-r);else if(o===kr)g=-a/(a-r),_=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=f,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,a,o=Zn,l=!1){const c=this.elements,u=2/(e-t),f=2/(n-i),h=-(e+t)/(e-t),d=-(n+i)/(n-i);let g,_;if(l)g=1/(a-r),_=a/(a-r);else if(o===Zn)g=-2/(a-r),_=-(a+r)/(a-r);else if(o===kr)g=-1/(a-r),_=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=f,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};To.prototype.isMatrix4=!0;let le=To;const vs=new N,kn=new le,Xm=new N(0,0,0),qm=new N(1,1,1),Ri=new N,pa=new N,Sn=new N,$u=new le,Qu=new Jn;class $n{constructor(t=0,e=0,n=0,i=$n.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],u=i[9],f=i[2],h=i[6],d=i[10];switch(e){case"XYZ":this._y=Math.asin(re(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-re(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(re(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-re(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(re(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-re(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:Yt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return $u.makeRotationFromQuaternion(t),this.setFromRotationMatrix($u,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Qu.setFromEuler(this),this.setFromQuaternion(Qu,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}$n.DEFAULT_ORDER="XYZ";class jc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Ym=0;const ju=new N,Ms=new Jn,hi=new le,ma=new N,pr=new N,Zm=new N,Km=new Jn,th=new N(1,0,0),eh=new N(0,1,0),nh=new N(0,0,1),ih={type:"added"},Jm={type:"removed"},Ss={type:"childadded",child:null},Zo={type:"childremoved",child:null};class Ve extends qi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Ym++}),this.uuid=fs(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Ve.DEFAULT_UP.clone();const t=new N,e=new $n,n=new Jn,i=new N(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new le},normalMatrix:{value:new Kt}}),this.matrix=new le,this.matrixWorld=new le,this.matrixAutoUpdate=Ve.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new jc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return Ms.setFromAxisAngle(t,e),this.quaternion.multiply(Ms),this}rotateOnWorldAxis(t,e){return Ms.setFromAxisAngle(t,e),this.quaternion.premultiply(Ms),this}rotateX(t){return this.rotateOnAxis(th,t)}rotateY(t){return this.rotateOnAxis(eh,t)}rotateZ(t){return this.rotateOnAxis(nh,t)}translateOnAxis(t,e){return ju.copy(t).applyQuaternion(this.quaternion),this.position.add(ju.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(th,t)}translateY(t){return this.translateOnAxis(eh,t)}translateZ(t){return this.translateOnAxis(nh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(hi.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?ma.copy(t):ma.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),pr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?hi.lookAt(pr,ma,this.up):hi.lookAt(ma,pr,this.up),this.quaternion.setFromRotationMatrix(hi),i&&(hi.extractRotation(i.matrixWorld),Ms.setFromRotationMatrix(hi),this.quaternion.premultiply(Ms.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(he("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(ih),Ss.child=t,this.dispatchEvent(Ss),Ss.child=null):he("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Jm),Zo.child=t,this.dispatchEvent(Zo),Zo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),hi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),hi.multiply(t.parent.matrixWorld)),t.applyMatrix4(hi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(ih),Ss.child=t,this.dispatchEvent(Ss),Ss.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pr,t,Zm),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(pr,Km,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,i=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*i,r[13]+=n-r[1]*e-r[5]*n-r[9]*i,r[14]+=i-r[2]*e-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const f=l[c];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));i.material=o}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),u=a(t.images),f=a(t.shapes),h=a(t.skeletons),d=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),h.length>0&&(n.skeletons=h),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}Ve.DEFAULT_UP=new N(0,1,0);Ve.DEFAULT_MATRIX_AUTO_UPDATE=!0;Ve.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Si extends Ve{constructor(){super(),this.isGroup=!0,this.type="Group"}}const $m={type:"move"};class Ko{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Si,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Si,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new N,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new N),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Si,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new N,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new N,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const _ of t.hand.values()){const p=e.getJointPose(_,n),m=this._getHandJoint(c,_);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.quaternion,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const u=c.joints["index-finger-tip"],f=c.joints["thumb-tip"],h=u.position.distanceTo(f.position),d=.02,g=.005;c.inputState.pinching&&h>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&h<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent($m)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Si;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const jf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Ci={h:0,s:0,l:0},_a={h:0,s:0,l:0};function Jo(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Wt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=cn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,oe.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=oe.workingColorSpace){return this.r=t,this.g=e,this.b=n,oe.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=oe.workingColorSpace){if(t=Jc(t,1),e=re(e,0,1),n=re(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=Jo(a,r,t+1/3),this.g=Jo(a,r,t),this.b=Jo(a,r,t-1/3)}return oe.colorSpaceToWorking(this,i),this}setStyle(t,e=cn){function n(r){r!==void 0&&parseFloat(r)<1&&Yt("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,e);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:Yt("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);Yt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=cn){const n=jf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Yt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=bi(t.r),this.g=bi(t.g),this.b=bi(t.b),this}copyLinearToSRGB(t){return this.r=ks(t.r),this.g=ks(t.g),this.b=ks(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=cn){return oe.workingToColorSpace(tn.copy(this),t),Math.round(re(tn.r*255,0,255))*65536+Math.round(re(tn.g*255,0,255))*256+Math.round(re(tn.b*255,0,255))}getHexString(t=cn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=oe.workingColorSpace){oe.workingToColorSpace(tn.copy(this),e);const n=tn.r,i=tn.g,r=tn.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const f=a-o;switch(c=u<=.5?f/(a+o):f/(2-a-o),a){case n:l=(i-r)/f+(i<r?6:0);break;case i:l=(r-n)/f+2;break;case r:l=(n-i)/f+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=oe.workingColorSpace){return oe.workingToColorSpace(tn.copy(this),e),t.r=tn.r,t.g=tn.g,t.b=tn.b,t}getStyle(t=cn){oe.workingToColorSpace(tn.copy(this),t);const e=tn.r,n=tn.g,i=tn.b;return t!==cn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Ci),this.setHSL(Ci.h+t,Ci.s+e,Ci.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Ci),t.getHSL(_a);const n=Dr(Ci.h,_a.h,e),i=Dr(Ci.s,_a.s,e),r=Dr(Ci.l,_a.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const tn=new Wt;Wt.NAMES=jf;class Qm extends Ve{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new $n,this.environmentIntensity=1,this.environmentRotation=new $n,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),this.background=t.background!==null?t.background.clone():null,this.environment=t.environment!==null?t.environment.clone():null,this.fog=t.fog!==null?t.fog.clone():null,this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),this.overrideMaterial=t.overrideMaterial!==null?t.overrideMaterial.clone():null,this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}}const Gn=new N,fi=new N,$o=new N,di=new N,ys=new N,bs=new N,sh=new N,Qo=new N,jo=new N,tl=new N,el=new Pe,nl=new Pe,il=new Pe;class qn{constructor(t=new N,e=new N,n=new N){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),Gn.subVectors(t,e),i.cross(Gn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){Gn.subVectors(i,e),fi.subVectors(n,e),$o.subVectors(t,e);const a=Gn.dot(Gn),o=Gn.dot(fi),l=Gn.dot($o),c=fi.dot(fi),u=fi.dot($o),f=a*c-o*o;if(f===0)return r.set(0,0,0),null;const h=1/f,d=(c*l-o*u)*h,g=(a*u-o*l)*h;return r.set(1-d-g,g,d)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,di)===null?!1:di.x>=0&&di.y>=0&&di.x+di.y<=1}static getInterpolation(t,e,n,i,r,a,o,l){return this.getBarycoord(t,e,n,i,di)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,di.x),l.addScaledVector(a,di.y),l.addScaledVector(o,di.z),l)}static getInterpolatedAttribute(t,e,n,i,r,a){return el.setScalar(0),nl.setScalar(0),il.setScalar(0),el.fromBufferAttribute(t,e),nl.fromBufferAttribute(t,n),il.fromBufferAttribute(t,i),a.setScalar(0),a.addScaledVector(el,r.x),a.addScaledVector(nl,r.y),a.addScaledVector(il,r.z),a}static isFrontFacing(t,e,n,i){return Gn.subVectors(n,e),fi.subVectors(t,e),Gn.cross(fi).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Gn.subVectors(this.c,this.b),fi.subVectors(this.a,this.b),Gn.cross(fi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return qn.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return qn.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return qn.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return qn.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return qn.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let a,o;ys.subVectors(i,n),bs.subVectors(r,n),Qo.subVectors(t,n);const l=ys.dot(Qo),c=bs.dot(Qo);if(l<=0&&c<=0)return e.copy(n);jo.subVectors(t,i);const u=ys.dot(jo),f=bs.dot(jo);if(u>=0&&f<=u)return e.copy(i);const h=l*f-u*c;if(h<=0&&l>=0&&u<=0&&l-u>0)return a=l/(l-u),e.copy(n).addScaledVector(ys,a);tl.subVectors(t,r);const d=ys.dot(tl),g=bs.dot(tl);if(g>=0&&d<=g)return e.copy(r);const _=d*c-l*g;if(_<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(bs,o);const p=u*g-d*f;if(p<=0&&f-u>=0&&d-g>=0)return sh.subVectors(r,i),o=(f-u)/(f-u+(d-g)),e.copy(i).addScaledVector(sh,o);const m=1/(p+_+h);return a=_*m,o=h*m,e.copy(n).addScaledVector(ys,a).addScaledVector(bs,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class Ei{constructor(t=new N(1/0,1/0,1/0),e=new N(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Hn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Hn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Hn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0&&t.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Hn):Hn.fromBufferAttribute(r,a),Hn.applyMatrix4(t.matrixWorld),this.expandByPoint(Hn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ga.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ga.copy(n.boundingBox)),ga.applyMatrix4(t.matrixWorld),this.union(ga)}const i=t.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Hn),Hn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(mr),xa.subVectors(this.max,mr),Es.subVectors(t.a,mr),Ts.subVectors(t.b,mr),ws.subVectors(t.c,mr),Pi.subVectors(Ts,Es),Di.subVectors(ws,Ts),Zi.subVectors(Es,ws);let e=[0,-Pi.z,Pi.y,0,-Di.z,Di.y,0,-Zi.z,Zi.y,Pi.z,0,-Pi.x,Di.z,0,-Di.x,Zi.z,0,-Zi.x,-Pi.y,Pi.x,0,-Di.y,Di.x,0,-Zi.y,Zi.x,0];return!sl(e,Es,Ts,ws,xa)||(e=[1,0,0,0,1,0,0,0,1],!sl(e,Es,Ts,ws,xa))?!1:(va.crossVectors(Pi,Di),e=[va.x,va.y,va.z],sl(e,Es,Ts,ws,xa))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Hn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Hn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(pi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),pi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),pi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),pi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),pi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),pi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),pi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),pi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(pi),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const pi=[new N,new N,new N,new N,new N,new N,new N,new N],Hn=new N,ga=new Ei,Es=new N,Ts=new N,ws=new N,Pi=new N,Di=new N,Zi=new N,mr=new N,xa=new N,va=new N,Ki=new N;function sl(s,t,e,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){Ki.fromArray(s,r);const o=i.x*Math.abs(Ki.x)+i.y*Math.abs(Ki.y)+i.z*Math.abs(Ki.z),l=t.dot(Ki),c=e.dot(Ki),u=n.dot(Ki);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const ze=new N,Ma=new ct;let jm=0;class zi extends qi{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:jm++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=vm,this.updateRanges=[],this.gpuType=Yn,this.version=0,this._normalizationScale=t!==void 0?$c(t):void 0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this._normalizationScale=t._normalizationScale,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Ma.fromBufferAttribute(this,e),Ma.applyMatrix3(t),this.setXY(e,Ma.x,Ma.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyMatrix3(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyMatrix4(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.applyNormalMatrix(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ze.fromBufferAttribute(this,e),ze.transformDirection(t),this.setXYZ(e,ze.x,ze.y,ze.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=this._denormalize(n)),n}setComponent(t,e,n){return this.normalized&&(n=this._normalize(n)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=this._denormalize(e)),e}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=this._denormalize(e)),e}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=this._denormalize(e)),e}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=this._denormalize(e)),e}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),i=this._normalize(i)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),i=this._normalize(i),r=this._normalize(r)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(t){const e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):Jf(t,this.array)}_normalize(t){const e=this._normalizationScale;return e!==void 0?Math.round(t*e):$f(t,this.array)}}class td extends zi{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class ed extends zi{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class me extends zi{constructor(t,e,n){super(new Float32Array(t),e,n)}}const t_=new Ei,_r=new N,rl=new N;class er{constructor(t=new N,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):t_.setFromPoints(t).getCenter(n);let i=0;for(let r=0,a=t.length;r<a;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;_r.subVectors(t,this.center);const e=_r.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(_r,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(rl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(_r.copy(t.center).add(rl)),this.expandByPoint(_r.copy(t.center).sub(rl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let e_=0;const Dn=new le,al=new Ve,As=new N,yn=new Ei,gr=new Ei,Ye=new N;class Ze extends qi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:e_++}),this.uuid=fs(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Mm(t)?ed:td)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Kt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Dn.makeRotationFromQuaternion(t),this.applyMatrix4(Dn),this}rotateX(t){return Dn.makeRotationX(t),this.applyMatrix4(Dn),this}rotateY(t){return Dn.makeRotationY(t),this.applyMatrix4(Dn),this}rotateZ(t){return Dn.makeRotationZ(t),this.applyMatrix4(Dn),this}translate(t,e,n){return Dn.makeTranslation(t,e,n),this.applyMatrix4(Dn),this}scale(t,e,n){return Dn.makeScale(t,e,n),this.applyMatrix4(Dn),this}lookAt(t){return al.lookAt(t),al.updateMatrix(),this.applyMatrix4(al.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(As).negate(),this.translate(As.x,As.y,As.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,r=t.length;i<r;i++){const a=t[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new me(n,3))}else{const n=Math.min(t.length,e.count);for(let i=0;i<n;i++){const r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&Yt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Ei);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){he("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new N(-1/0,-1/0,-1/0),new N(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];yn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ye.addVectors(this.boundingBox.min,yn.min),this.boundingBox.expandByPoint(Ye),Ye.addVectors(this.boundingBox.max,yn.max),this.boundingBox.expandByPoint(Ye)):(this.boundingBox.expandByPoint(yn.min),this.boundingBox.expandByPoint(yn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&he('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new er);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){he("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new N,1/0);return}if(t){const n=this.boundingSphere.center;if(yn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];gr.setFromBufferAttribute(o),this.morphTargetsRelative?(Ye.addVectors(yn.min,gr.min),yn.expandByPoint(Ye),Ye.addVectors(yn.max,gr.max),yn.expandByPoint(Ye)):(yn.expandByPoint(gr.min),yn.expandByPoint(gr.max))}yn.getCenter(n);let i=0;for(let r=0,a=t.count;r<a;r++)Ye.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(Ye));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)Ye.fromBufferAttribute(o,c),l&&(As.fromBufferAttribute(t,c),Ye.add(As)),i=Math.max(i,n.distanceToSquared(Ye))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&he('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){he("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new zi(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[],c=new Uint8Array(n.count);for(let C=0;C<n.count;C++)o[C]=new N,l[C]=new N;const u=new N,f=new N,h=new N,d=new ct,g=new ct,_=new ct,p=new N,m=new N;function x(C,R,L){c[C]=c[R]=c[L]=1,u.fromBufferAttribute(n,C),f.fromBufferAttribute(n,R),h.fromBufferAttribute(n,L),d.fromBufferAttribute(r,C),g.fromBufferAttribute(r,R),_.fromBufferAttribute(r,L),f.sub(u),h.sub(u),g.sub(d),_.sub(d);const U=1/(g.x*_.y-_.x*g.y);isFinite(U)&&(p.copy(f).multiplyScalar(_.y).addScaledVector(h,-g.y).multiplyScalar(U),m.copy(h).multiplyScalar(g.x).addScaledVector(f,-_.x).multiplyScalar(U),o[C].add(p),o[R].add(p),o[L].add(p),l[C].add(m),l[R].add(m),l[L].add(m))}let M=this.groups;M.length===0&&(M=[{start:0,count:t.count}]);for(let C=0,R=M.length;C<R;++C){const L=M[C],U=L.start,B=L.count;for(let w=U,I=U+B;w<I;w+=3)x(t.getX(w+0),t.getX(w+1),t.getX(w+2))}const S=new N,b=new N,E=new N,v=new N;function y(C){E.fromBufferAttribute(i,C),v.copy(E);const R=o[C];S.copy(R),S.sub(E.multiplyScalar(E.dot(R))).normalize(),b.crossVectors(v,R);const U=b.dot(l[C])<0?-1:1;a.setXYZW(C,S.x,S.y,S.z,U)}for(let C=0,R=n.count;C<R;++C)c[C]&&y(C);this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new zi(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let h=0,d=n.count;h<d;h++)n.setXYZ(h,0,0,0);const i=new N,r=new N,a=new N,o=new N,l=new N,c=new N,u=new N,f=new N;if(t)for(let h=0,d=t.count;h<d;h+=3){const g=t.getX(h+0),_=t.getX(h+1),p=t.getX(h+2);i.fromBufferAttribute(e,g),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,p),u.subVectors(a,r),f.subVectors(i,r),u.cross(f),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,p),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let h=0,d=e.count;h<d;h+=3)i.fromBufferAttribute(e,h+0),r.fromBufferAttribute(e,h+1),a.fromBufferAttribute(e,h+2),u.subVectors(a,r),f.subVectors(i,r),u.cross(f),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ye.fromBufferAttribute(t,e),Ye.normalize(),t.setXYZ(e,Ye.x,Ye.y,Ye.z)}toNonIndexed(){function t(o,l){const c=o.array,u=o.itemSize,f=o.normalized,h=new c.constructor(l.length*u);let d=0,g=0;for(let _=0,p=l.length;_<p;_++){o.isInterleavedBufferAttribute?d=l[_]*o.data.stride+o.offset:d=l[_]*u;for(let m=0;m<u;m++)h[g++]=c[d++]}return new zi(h,u,f)}if(this.index===null)return Yt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ze,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,f=c.length;u<f;u++){const h=c[u],d=t(h,n);l.push(d)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let f=0,h=c.length;f<h;f++){const d=c[f];u.push(d.toJSON(t.data))}u.length>0&&(i[l]=u,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const i=t.attributes;for(const c in i){const u=i[c];this.setAttribute(c,u.clone(e))}const r=t.morphAttributes;for(const c in r){const u=[],f=r[c];for(let h=0,d=f.length;h<d;h++)u.push(f[h].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,u=a.length;c<u;c++){const f=a[c];this.addGroup(f.start,f.count,f.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ol=new N,n_=new N,i_=new Kt;class gi{constructor(t=new N(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=ol.subVectors(n,e).cross(n_.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const i=t.delta(ol),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||i_.getNormalMatrix(t),i=this.coplanarPoint(ol).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}}let s_=0;class nr extends qi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:s_++}),this.uuid=fs(),this.name="",this.type="Material",this.blending=Cr,this.side=cs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Uf,this.blendDst=Of,this.blendEquation=Ns,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Wt(0,0,0),this.blendAlpha=0,this.depthFunc=Fr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=dm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Vo,this.stencilZFail=Vo,this.stencilZPass=Vo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){Yt(`Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){Yt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(t).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=i(t.textures),a=i(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Wt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.diffuseRoughness!==void 0&&(this.diffuseRoughness=t.diffuseRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum),t.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=t.iridescenceThicknessRange[1]),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new gi().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new ct().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new ct().fromArray(t.clearcoatNormalScale)),t.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=e[t.diffuseRoughnessMap]||null),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const mi=new N,ll=new N,Sa=new N,ya=new N;class Ao{constructor(t=new N,e=new N(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,mi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=mi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(mi.copy(this.origin).addScaledVector(this.direction,e),mi.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){ll.copy(t).add(e).multiplyScalar(.5),Sa.copy(e).sub(t).normalize(),ya.copy(this.origin).sub(ll);const r=t.distanceTo(e)*.5,a=-this.direction.dot(Sa),o=ya.dot(this.direction),l=-ya.dot(Sa),c=ya.lengthSq(),u=Math.abs(1-a*a);let f,h,d,g;if(u>0)if(f=a*l-o,h=a*o-l,g=r*u,f>=0)if(h>=-g)if(h<=g){const _=1/u;f*=_,h*=_,d=f*(f+a*h+2*o)+h*(a*f+h+2*l)+c}else h=r,f=Math.max(0,-(a*h+o)),d=-f*f+h*(h+2*l)+c;else h=-r,f=Math.max(0,-(a*h+o)),d=-f*f+h*(h+2*l)+c;else h<=-g?(f=Math.max(0,-(-a*r+o)),h=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+h*(h+2*l)+c):h<=g?(f=0,h=Math.min(Math.max(-r,-l),r),d=h*(h+2*l)+c):(f=Math.max(0,-(a*r+o)),h=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+h*(h+2*l)+c);else h=a>0?-r:r,f=Math.max(0,-(a*h+o)),d=-f*f+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,f),i&&i.copy(ll).addScaledVector(Sa,h),d}intersectSphere(t,e){if(t.radius<0)return null;mi.subVectors(t.center,this.origin);const n=mi.dot(this.direction),i=mi.dot(mi)-n*n,r=t.radius*t.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,h=this.origin;return c>=0?(n=(t.min.x-h.x)*c,i=(t.max.x-h.x)*c):(n=(t.max.x-h.x)*c,i=(t.min.x-h.x)*c),u>=0?(r=(t.min.y-h.y)*u,a=(t.max.y-h.y)*u):(r=(t.max.y-h.y)*u,a=(t.min.y-h.y)*u),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),f>=0?(o=(t.min.z-h.z)*f,l=(t.max.z-h.z)*f):(o=(t.max.z-h.z)*f,l=(t.min.z-h.z)*f),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,mi)!==null}intersectTriangle(t,e,n,i,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,u=o.z,f=t.x-a.x,h=t.y-a.y,d=t.z-a.z,g=e.x-a.x,_=e.y-a.y,p=e.z-a.z,m=n.x-a.x,x=n.y-a.y,M=n.z-a.z,S=Math.abs(l),b=Math.abs(c),E=Math.abs(u);let v,y,C,R,L,U,B,w,I,D,O,H;if(S>=b&&S>=E?(C=l,U=f,I=g,H=m,l>=0?(v=c,y=u,R=h,L=d,B=_,w=p,D=x,O=M):(v=u,y=c,R=d,L=h,B=p,w=_,D=M,O=x)):b>=E?(C=c,U=h,I=_,H=x,c>=0?(v=u,y=l,R=d,L=f,B=p,w=g,D=M,O=m):(v=l,y=u,R=f,L=d,B=g,w=p,D=m,O=M)):(C=u,U=d,I=p,H=M,u>=0?(v=l,y=c,R=f,L=h,B=g,w=_,D=m,O=x):(v=c,y=l,R=h,L=f,B=_,w=g,D=x,O=m)),C===0)return null;const z=v/C,V=y/C,Y=1/C,ut=R-z*U,At=L-V*U,K=B-z*I,lt=w-V*I,wt=D-z*H,Nt=O-V*H,st=wt*lt-Nt*K,bt=ut*Nt-At*wt,Ht=K*At-lt*ut;if(i){if(st<0||bt<0||Ht<0)return null}else if((st<0||bt<0||Ht<0)&&(st>0||bt>0||Ht>0))return null;const Lt=st+bt+Ht;if(Lt===0)return null;const Vt=Y*(st*U+bt*I+Ht*H);return(Lt>0?Vt<0:Vt>0)?null:this.at(Vt/Lt,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Kn extends nr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Wt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $n,this.combine=Ff,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const rh=new le,Ji=new Ao,ba=new er,ah=new N,Ea=new N,Ta=new N,wa=new N,cl=new N,Aa=new N,oh=new N,Ra=new N;class vn extends Ve{constructor(t=new Ze,e=new Kn){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const o=this.morphTargetInfluences;if(r&&o){Aa.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],f=r[l];u!==0&&(cl.fromBufferAttribute(f,t),a?Aa.addScaledVector(cl,u):Aa.addScaledVector(cl.sub(e),u))}e.add(Aa)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),ba.copy(n.boundingSphere),ba.applyMatrix4(r),Ji.copy(t.ray).recast(t.near),!(ba.containsPoint(Ji.origin)===!1&&(Ji.intersectSphere(ba,ah)===null||Ji.origin.distanceToSquared(ah)>(t.far-t.near)**2))&&(rh.copy(r).invert(),Ji.copy(t.ray).applyMatrix4(rh),!(n.boundingBox!==null&&Ji.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Ji)))}_computeIntersections(t,e,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,h=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,_=h.length;g<_;g++){const p=h[g],m=a[p.materialIndex],x=Math.max(p.start,d.start),M=Math.min(o.count,Math.min(p.start+p.count,d.start+d.count));for(let S=x,b=M;S<b;S+=3){const E=o.getX(S),v=o.getX(S+1),y=o.getX(S+2);i=Ca(this,m,t,n,c,u,f,E,v,y),i&&(i.faceIndex=Math.floor(S/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const g=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let p=g,m=_;p<m;p+=3){const x=o.getX(p),M=o.getX(p+1),S=o.getX(p+2);i=Ca(this,a,t,n,c,u,f,x,M,S),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,_=h.length;g<_;g++){const p=h[g],m=a[p.materialIndex],x=Math.max(p.start,d.start),M=Math.min(l.count,Math.min(p.start+p.count,d.start+d.count));for(let S=x,b=M;S<b;S+=3){const E=S,v=S+1,y=S+2;i=Ca(this,m,t,n,c,u,f,E,v,y),i&&(i.faceIndex=Math.floor(S/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const g=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let p=g,m=_;p<m;p+=3){const x=p,M=p+1,S=p+2;i=Ca(this,a,t,n,c,u,f,x,M,S),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}}}function r_(s,t,e,n,i,r,a,o){let l;if(t.side===fn?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,t.side===cs,o),l===null)return null;Ra.copy(o),Ra.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(Ra);return c<e.near||c>e.far?null:{distance:c,point:Ra.clone(),object:s}}function Ca(s,t,e,n,i,r,a,o,l,c){s.getVertexPosition(o,Ea),s.getVertexPosition(l,Ta),s.getVertexPosition(c,wa);const u=r_(s,t,e,n,Ea,Ta,wa,oh);if(u){const f=new N;qn.getBarycoord(oh,Ea,Ta,wa,f),i&&(u.uv=qn.getInterpolatedAttribute(i,o,l,c,f,new ct)),r&&(u.uv1=qn.getInterpolatedAttribute(r,o,l,c,f,new ct)),a&&(u.normal=qn.getInterpolatedAttribute(a,o,l,c,f,new N),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new N,materialIndex:0};qn.getNormal(Ea,Ta,wa,h.normal),u.face=h,u.barycoord=f}return u}class tu extends nn{constructor(t=null,e=1,n=1,i,r,a,o,l,c=$e,u=$e,f,h){super(null,a,o,l,c,u,i,r,f,h),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class lh extends zi{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const Rs=new le,ch=new le,Pa=[],uh=new Ei,a_=new le,xr=new vn,vr=new er;class $i extends vn{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new lh(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,a_)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Ei),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Rs),uh.copy(t.boundingBox).applyMatrix4(Rs),this.boundingBox.union(uh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new er),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,Rs),vr.copy(t.boundingSphere).applyMatrix4(Rs),this.boundingSphere.union(vr)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),this.morphTexture=t.morphTexture!==null?t.morphTexture.clone():null,this.instanceColor=t.instanceColor!==null?t.instanceColor.clone():null,this.count=t.count,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(t,e){const n=this.matrixWorld,i=this.count;if(xr.geometry=this.geometry,xr.material=this.material,xr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),vr.copy(this.boundingSphere),vr.applyMatrix4(n),t.ray.intersectsSphere(vr)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,Rs),ch.multiplyMatrices(n,Rs),xr.matrixWorld=ch,xr.raycast(t,Pa);for(let a=0,o=Pa.length;a<o;a++){const l=Pa[a];l.instanceId=r,l.object=this,e.push(l)}Pa.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new lh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new tu(new Float32Array(i*this.count),i,this.count,qc,Yn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*t;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Qi=new er,o_=new ct(.5,.5),Da=new N;class Hr{constructor(t=new gi,e=new gi,n=new gi,i=new gi,r=new gi,a=new gi){this.planes=[t,e,n,i,r,a]}set(t,e,n,i,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Zn,n=!1){const i=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],f=r[5],h=r[6],d=r[7],g=r[8],_=r[9],p=r[10],m=r[11],x=r[12],M=r[13],S=r[14],b=r[15];if(i[0].setComponents(c-a,d-u,m-g,b-x).normalize(),i[1].setComponents(c+a,d+u,m+g,b+x).normalize(),i[2].setComponents(c+o,d+f,m+_,b+M).normalize(),i[3].setComponents(c-o,d-f,m-_,b-M).normalize(),n)i[4].setComponents(l,h,p,S).normalize(),i[5].setComponents(c-l,d-h,m-p,b-S).normalize();else if(i[4].setComponents(c-l,d-h,m-p,b-S).normalize(),e===Zn)i[5].setComponents(c+l,d+h,m+p,b+S).normalize();else if(e===kr)i[5].setComponents(l,h,p,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Qi.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Qi.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Qi)}intersectsSprite(t){Qi.center.set(0,0,0);const e=o_.distanceTo(t.center);return Qi.radius=.7071067811865476+e,Qi.applyMatrix4(t.matrixWorld),this.intersectsSphere(Qi)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Da.x=i.normal.x>0?t.max.x:t.min.x,Da.y=i.normal.y>0?t.max.y:t.min.y,Da.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Da)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const hh=new le;class eu{constructor(){this.coordinateSystem=Zn,this._frustums=[],this._count=0}setFromArrayCamera(t){const e=t.cameras,n=this._frustums;for(let i=0;i<e.length;i++){const r=e[i];hh.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[i]===void 0&&(n[i]=new Hr),n[i].setFromProjectionMatrix(hh,r.coordinateSystem,r.reversedDepth)}return this._count=e.length,this}getFrustum(t){return this._frustums[t]}intersectsObject(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsObject(t))return!0;return!1}intersectsSprite(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSprite(t))return!0;return!1}intersectsSphere(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSphere(t))return!0;return!1}intersectsBox(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsBox(t))return!0;return!1}containsPoint(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;const e=this._frustums,n=t._frustums;for(let i=0;i<t._count;i++)e[i]===void 0&&(e[i]=new Hr),e[i].copy(n[i]);return this._count=t._count,this}clone(){return new eu().copy(this)}}class oo extends nr{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Wt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const lo=new N,co=new N,fh=new le,Mr=new Ao,La=new er,ul=new N,dh=new N;class nu extends Ve{constructor(t=new Ze,e=new oo){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)lo.fromBufferAttribute(e,i-1),co.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=lo.distanceTo(co);t.setAttribute("lineDistance",new me(n,1))}else Yt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),La.copy(n.boundingSphere),La.applyMatrix4(i),La.radius+=r,t.ray.intersectsSphere(La)===!1)return;fh.copy(i).invert(),Mr.copy(t.ray).applyMatrix4(fh);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){const d=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let _=d,p=g-1;_<p;_+=c){const m=u.getX(_),x=u.getX(_+1),M=Na(this,t,Mr,l,m,x,_);M&&e.push(M)}if(this.isLineLoop){const _=u.getX(g-1),p=u.getX(d),m=Na(this,t,Mr,l,_,p,g-1);m&&e.push(m)}}else{const d=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let _=d,p=g-1;_<p;_+=c){const m=Na(this,t,Mr,l,_,_+1,_);m&&e.push(m)}if(this.isLineLoop){const _=Na(this,t,Mr,l,g-1,d,g-1);_&&e.push(_)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Na(s,t,e,n,i,r,a){const o=s.geometry.attributes.position;if(lo.fromBufferAttribute(o,i),co.fromBufferAttribute(o,r),e.distanceSqToSegment(lo,co,ul,dh)>n)return;ul.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(ul);if(!(c<t.near||c>t.far))return{distance:c,point:dh.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}const ph=new N,mh=new N;class l_ extends nu{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let i=0,r=e.count;i<r;i+=2)ph.fromBufferAttribute(e,i),mh.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+ph.distanceTo(mh);t.setAttribute("lineDistance",new me(n,1))}else Yt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class nd extends nn{constructor(t=[],e=Ws,n,i,r,a,o,l,c,u){super(t,e,n,i,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class c_ extends nn{constructor(t,e,n,i,r,a,o,l,c){super(t,e,n,i,r,a,o,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class qs extends nn{constructor(t,e,n=ai,i,r,a,o=$e,l=$e,c,u=Hi,f=1){if(u!==Hi&&u!==Ii)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:t,height:e,depth:f};super(h,i,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new Qc(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}}class id extends qs{constructor(t,e=ai,n=Ws,i,r,a=$e,o=$e,l,c=Hi){const u={width:t,height:t,depth:1},f=[u,u,u,u,u,u];super(t,t,e,n,i,r,a,o,l,c),this.image=f,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class sd extends nn{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class ds extends Ze{constructor(t=1,e=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],f=[];let h=0,d=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,i,a,2),g("x","z","y",1,-1,t,n,-e,i,a,3),g("x","y","z",1,-1,t,e,n,i,r,4),g("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new me(c,3)),this.setAttribute("normal",new me(u,3)),this.setAttribute("uv",new me(f,2));function g(_,p,m,x,M,S,b,E,v,y,C){const R=S/v,L=b/y,U=S/2,B=b/2,w=E/2,I=v+1,D=y+1;let O=0,H=0;const z=new N;for(let V=0;V<D;V++){const Y=V*L-B;for(let ut=0;ut<I;ut++){const At=ut*R-U;z[_]=At*x,z[p]=Y*M,z[m]=w,c.push(z.x,z.y,z.z),z[_]=0,z[p]=0,z[m]=E>0?1:-1,u.push(z.x,z.y,z.z),f.push(ut/v),f.push(1-V/y),O+=1}}for(let V=0;V<y;V++)for(let Y=0;Y<v;Y++){const ut=h+Y+I*V,At=h+Y+I*(V+1),K=h+(Y+1)+I*(V+1),lt=h+(Y+1)+I*V;l.push(ut,At,lt),l.push(At,K,lt),H+=6}o.addGroup(d,H,C),d+=H,h+=O}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ds(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class iu extends Ze{constructor(t=1,e=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:i,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],u=e/2,f=Math.PI/2*t,h=e,d=2*f+h,g=n*2+r,_=i+1,p=new N,m=new N;for(let x=0;x<=g;x++){let M=0,S=0,b=0,E=0;if(x<=n){const C=x/n,R=C*Math.PI/2;S=-u-t*Math.cos(R),b=t*Math.sin(R),E=-t*Math.cos(R),M=C*f}else if(x<=n+r){const C=(x-n)/r;S=-u+C*e,b=t,E=0,M=f+C*h}else{const C=(x-n-r)/n,R=C*Math.PI/2;S=u+t*Math.sin(R),b=t*Math.cos(R),E=t*Math.sin(R),M=f+h+C*f}const v=Math.max(0,Math.min(1,M/d));let y=0;x===0?y=.5/i:x===g&&(y=-.5/i);for(let C=0;C<=i;C++){const R=C/i,L=R*Math.PI*2,U=Math.sin(L),B=Math.cos(L);m.x=-b*B,m.y=S,m.z=b*U,o.push(m.x,m.y,m.z),p.set(-b*B,E,b*U),p.normalize(),l.push(p.x,p.y,p.z),c.push(R+y,v)}if(x>0){const C=(x-1)*_;for(let R=0;R<i;R++){const L=C+R,U=C+R+1,B=x*_+R,w=x*_+R+1;a.push(L,U,B),a.push(U,w,B)}}}this.setIndex(a),this.setAttribute("position",new me(o,3)),this.setAttribute("normal",new me(l,3)),this.setAttribute("uv",new me(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new iu(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class su extends Ze{constructor(t=1,e=1,n=1,i=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};const c=this;i=Math.floor(i),r=Math.floor(r);const u=[],f=[],h=[],d=[];let g=0;const _=[],p=n/2;let m=0;x(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(u),this.setAttribute("position",new me(f,3)),this.setAttribute("normal",new me(h,3)),this.setAttribute("uv",new me(d,2));function x(){const S=new N,b=new N;let E=0;const v=(e-t)/n;for(let y=0;y<=r;y++){const C=[],R=y/r,L=R*(e-t)+t;for(let U=0;U<=i;U++){const B=U/i,w=B*l+o,I=Math.sin(w),D=Math.cos(w);b.x=L*I,b.y=-R*n+p,b.z=L*D,f.push(b.x,b.y,b.z),S.set(I,v,D).normalize(),h.push(S.x,S.y,S.z),d.push(B,1-R),C.push(g++)}_.push(C)}for(let y=0;y<i;y++)for(let C=0;C<r;C++){const R=_[C][y],L=_[C+1][y],U=_[C+1][y+1],B=_[C][y+1];(t>0||C!==0)&&(u.push(R,L,B),E+=3),(e>0||C!==r-1)&&(u.push(L,U,B),E+=3)}c.addGroup(m,E,0),m+=E}function M(S){const b=g,E=new ct,v=new N;let y=0;const C=S===!0?t:e,R=S===!0?1:-1;for(let U=1;U<=i;U++)f.push(0,p*R,0),h.push(0,R,0),d.push(.5,.5),g++;const L=g;for(let U=0;U<=i;U++){const w=U/i*l+o,I=Math.cos(w),D=Math.sin(w);v.x=C*D,v.y=p*R,v.z=C*I,f.push(v.x,v.y,v.z),h.push(0,R,0),E.x=I*.5+.5,E.y=D*.5*R+.5,d.push(E.x,E.y),g++}for(let U=0;U<i;U++){const B=b+U,w=L+U;S===!0?u.push(w,w+1,B):u.push(w+1,w,B),y+=3}c.addGroup(m,y,S===!0?1:2),m+=y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new su(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class Ro extends Ze{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const r=[],a=[];o(i),c(n),u(),this.setAttribute("position",new me(r,3)),this.setAttribute("normal",new me(r.slice(),3)),this.setAttribute("uv",new me(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(x){const M=new N,S=new N,b=new N;for(let E=0;E<e.length;E+=3)d(e[E+0],M),d(e[E+1],S),d(e[E+2],b),l(M,S,b,x)}function l(x,M,S,b){const E=b+1,v=[];for(let y=0;y<=E;y++){v[y]=[];const C=x.clone().lerp(S,y/E),R=M.clone().lerp(S,y/E),L=E-y;for(let U=0;U<=L;U++)U===0&&y===E?v[y][U]=C:v[y][U]=C.clone().lerp(R,U/L)}for(let y=0;y<E;y++)for(let C=0;C<2*(E-y)-1;C++){const R=Math.floor(C/2);C%2===0?(h(v[y][R+1]),h(v[y+1][R]),h(v[y][R])):(h(v[y][R+1]),h(v[y+1][R+1]),h(v[y+1][R]))}}function c(x){const M=new N;for(let S=0;S<r.length;S+=3)M.x=r[S+0],M.y=r[S+1],M.z=r[S+2],M.normalize().multiplyScalar(x),r[S+0]=M.x,r[S+1]=M.y,r[S+2]=M.z}function u(){const x=new N;for(let M=0;M<r.length;M+=3){x.x=r[M+0],x.y=r[M+1],x.z=r[M+2];const S=p(x)/2/Math.PI+.5,b=m(x)/Math.PI+.5;a.push(S,1-b)}g(),f()}function f(){for(let x=0;x<a.length;x+=6){const M=a[x+0],S=a[x+2],b=a[x+4],E=Math.max(M,S,b),v=Math.min(M,S,b);E>.9&&v<.1&&(M<.2&&(a[x+0]+=1),S<.2&&(a[x+2]+=1),b<.2&&(a[x+4]+=1))}}function h(x){r.push(x.x,x.y,x.z)}function d(x,M){const S=x*3;M.x=t[S+0],M.y=t[S+1],M.z=t[S+2]}function g(){const x=new N,M=new N,S=new N,b=new N,E=new ct,v=new ct,y=new ct;for(let C=0,R=0;C<r.length;C+=9,R+=6){x.set(r[C+0],r[C+1],r[C+2]),M.set(r[C+3],r[C+4],r[C+5]),S.set(r[C+6],r[C+7],r[C+8]),E.set(a[R+0],a[R+1]),v.set(a[R+2],a[R+3]),y.set(a[R+4],a[R+5]),b.copy(x).add(M).add(S).divideScalar(3);const L=p(b);_(E,R+0,x,L),_(v,R+2,M,L),_(y,R+4,S,L)}}function _(x,M,S,b){b<0&&x.x===1&&(a[M]=x.x-1),S.x===0&&S.z===0&&(a[M]=b/2/Math.PI+.5)}function p(x){return Math.atan2(x.z,-x.x)}function m(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ro(t.vertices,t.indices,t.radius,t.detail)}}class li{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Yt("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let i=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);const u=n[i],h=n[i+1]-u,d=(a-u)/h;return(i+d)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),l=e||(a.isVector2?new ct:new N);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new N,i=[],r=[],a=[],o=new N,l=new le;for(let d=0;d<=t;d++){const g=d/t;i[d]=this.getTangentAt(g,new N)}r[0]=new N,a[0]=new N;let c=Number.MAX_VALUE;const u=Math.abs(i[0].x),f=Math.abs(i[0].y),h=Math.abs(i[0].z);u<=c&&(c=u,n.set(1,0,0)),f<=c&&(c=f,n.set(0,1,0)),h<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(i[d-1],i[d]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(re(i[d-1].dot(i[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,g))}a[d].crossVectors(i[d],r[d])}if(e===!0){let d=Math.acos(re(r[0].dot(r[t]),-1,1));d/=t,i[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(i[g],d*g)),a[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this.cacheArcLengths=null,this}}class ru extends li{constructor(t=0,e=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new ct){const n=e,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),h=l-this.aX,d=c-this.aY;l=h*u-d*f+this.aX,c=h*f+d*u+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class u_ extends ru{constructor(t,e,n,i,r,a){super(t,e,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function au(){let s=0,t=0,e=0,n=0;function i(r,a,o,l){s=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,f){let h=(a-r)/c-(o-r)/(c+u)+(o-a)/u,d=(o-a)/u-(l-a)/(u+f)+(l-o)/f;h*=u,d*=u,i(a,o,h,d)},calc:function(r){const a=r*r,o=a*r;return s+t*r+e*a+n*o}}}const _h=new N,gh=new N,hl=new au,fl=new au,dl=new au;class h_ extends li{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new N){const n=e,i=this.points,r=i.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=i[(o-1)%r]:(gh.subVectors(i[0],i[1]).add(i[0]),c=gh);const f=i[o%r],h=i[(o+1)%r];if(this.closed||o+2<r?u=i[(o+2)%r]:(_h.subVectors(i[r-1],i[r-2]).add(i[r-1]),u=_h),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(f),d),_=Math.pow(f.distanceToSquared(h),d),p=Math.pow(h.distanceToSquared(u),d);_<1e-4&&(_=1),g<1e-4&&(g=_),p<1e-4&&(p=_),hl.initNonuniformCatmullRom(c.x,f.x,h.x,u.x,g,_,p),fl.initNonuniformCatmullRom(c.y,f.y,h.y,u.y,g,_,p),dl.initNonuniformCatmullRom(c.z,f.z,h.z,u.z,g,_,p)}else this.curveType==="catmullrom"&&(hl.initCatmullRom(c.x,f.x,h.x,u.x,this.tension),fl.initCatmullRom(c.y,f.y,h.y,u.y,this.tension),dl.initCatmullRom(c.z,f.z,h.z,u.z,this.tension));return n.set(hl.calc(l),fl.calc(l),dl.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new N().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function xh(s,t,e,n,i){const r=(n-t)*.5,a=(i-e)*.5,o=s*s,l=s*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*s+e}function f_(s,t){const e=1-s;return e*e*t}function d_(s,t){return 2*(1-s)*s*t}function p_(s,t){return s*s*t}function Lr(s,t,e,n){return f_(s,t)+d_(s,e)+p_(s,n)}function m_(s,t){const e=1-s;return e*e*e*t}function __(s,t){const e=1-s;return 3*e*e*s*t}function g_(s,t){return 3*(1-s)*s*s*t}function x_(s,t){return s*s*s*t}function Nr(s,t,e,n,i){return m_(s,t)+__(s,e)+g_(s,n)+x_(s,i)}class rd extends li{constructor(t=new ct,e=new ct,n=new ct,i=new ct){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new ct){const n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Nr(t,i.x,r.x,a.x,o.x),Nr(t,i.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class ad extends li{constructor(t=new N,e=new N,n=new N,i=new N){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new N){const n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Nr(t,i.x,r.x,a.x,o.x),Nr(t,i.y,r.y,a.y,o.y),Nr(t,i.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class od extends li{constructor(t=new ct,e=new ct){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ct){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ct){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class v_ extends li{constructor(t=new N,e=new N){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new N){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new N){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ld extends li{constructor(t=new ct,e=new ct,n=new ct){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ct){const n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Lr(t,i.x,r.x,a.x),Lr(t,i.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class cd extends li{constructor(t=new N,e=new N,n=new N){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new N){const n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Lr(t,i.x,r.x,a.x),Lr(t,i.y,r.y,a.y),Lr(t,i.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ud extends li{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ct){const n=e,i=this.points,r=(i.length-1)*t,a=Math.floor(r),o=r-a,l=i[a===0?a:a-1],c=i[a],u=i[a>i.length-2?i.length-1:a+1],f=i[a>i.length-3?i.length-1:a+2];return n.set(xh(o,l.x,c.x,u.x,f.x),xh(o,l.y,c.y,u.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new ct().fromArray(i))}return this}}var uo=Object.freeze({__proto__:null,ArcCurve:u_,CatmullRomCurve3:h_,CubicBezierCurve:rd,CubicBezierCurve3:ad,EllipseCurve:ru,LineCurve:od,LineCurve3:v_,QuadraticBezierCurve:ld,QuadraticBezierCurve3:cd,SplineCurve:ud});class M_ extends li{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new uo[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const a=i[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this.cacheLengths=null,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(new uo[i.type]().fromJSON(i))}return this.cacheLengths=null,this}}class vh extends M_{constructor(t){super(),this.type="Path",this.currentPoint=new ct,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new od(this.currentPoint.clone(),new ct(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){const r=new ld(this.currentPoint.clone(),new ct(t,e),new ct(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,a){const o=new rd(this.currentPoint.clone(),new ct(t,e),new ct(n,i),new ct(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new ud(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,i,r,a),this}absarc(t,e,n,i,r,a){return this.absellipse(t,e,n,n,i,r,a),this}ellipse(t,e,n,i,r,a,o,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+c,e+u,n,i,r,a,o,l),this}absellipse(t,e,n,i,r,a,o,l){const c=new ru(t,e,n,i,r,a,o,l);if(this.curves.length>0){const f=c.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class hd extends vh{constructor(t){super(t),this.uuid=fs(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(new vh().fromJSON(i))}return this}}function S_(s,t,e=2){const n=t&&t.length,i=n?t[0]*e:s.length;let r=fd(s,0,i,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=w_(s,t,r,e)),s.length>80*e){o=s[0],l=s[1];let u=o,f=l;for(let h=e;h<i;h+=e){const d=s[h],g=s[h+1];d<o&&(o=d),g<l&&(l=g),d>u&&(u=d),g>f&&(f=g)}c=Math.max(u-o,f-l),c=c!==0?32767/c:0}return Vr(r,a,e,o,l,c,0),a}function fd(s,t,e,n,i){let r;if(i===F_(s,t,e,n)>0)for(let a=t;a<e;a+=n)r=Mh(a/n|0,s[a],s[a+1],r);else for(let a=e-n;a>=t;a-=n)r=Mh(a/n|0,s[a],s[a+1],r);return r&&Ys(r,r.next)&&(Xr(r),r=r.next),r}function hs(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(Ys(e,e.next)||De(e.prev,e,e.next)===0)){if(Xr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Vr(s,t,e,n,i,r,a){if(!s)return;!a&&r&&D_(s,n,i,r);let o=s;for(;s.prev!==s.next;){const l=s.prev,c=s.next;if(r?b_(s,n,i,r):y_(s)){t.push(l.i,s.i,c.i),Xr(s),s=c.next,o=c.next;continue}if(s=c,s===o){a?a===1?(s=E_(hs(s),t),Vr(s,t,e,n,i,r,2)):a===2&&T_(s,t,e,n,i,r):Vr(hs(s),t,e,n,i,r,1);break}}}function y_(s){const t=s.prev,e=s,n=s.next;if(De(t,e,n)>=0)return!1;const i=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,u=Math.min(i,r,a),f=Math.min(o,l,c),h=Math.max(i,r,a),d=Math.max(o,l,c);let g=n.next;for(;g!==t;){if(g.x>=u&&g.x<=h&&g.y>=f&&g.y<=d&&Tr(i,o,r,l,a,c,g.x,g.y)&&De(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function b_(s,t,e,n){const i=s.prev,r=s,a=s.next;if(De(i,r,a)>=0)return!1;const o=i.x,l=r.x,c=a.x,u=i.y,f=r.y,h=a.y,d=Math.min(o,l,c),g=Math.min(u,f,h),_=Math.max(o,l,c),p=Math.max(u,f,h),m=mc(d,g,t,e,n),x=mc(_,p,t,e,n);let M=s.prevZ,S=s.nextZ;for(;M&&M.z>=m&&S&&S.z<=x;){if(M.x>=d&&M.x<=_&&M.y>=g&&M.y<=p&&M!==i&&M!==a&&Tr(o,u,l,f,c,h,M.x,M.y)&&De(M.prev,M,M.next)>=0||(M=M.prevZ,S.x>=d&&S.x<=_&&S.y>=g&&S.y<=p&&S!==i&&S!==a&&Tr(o,u,l,f,c,h,S.x,S.y)&&De(S.prev,S,S.next)>=0))return!1;S=S.nextZ}for(;M&&M.z>=m;){if(M.x>=d&&M.x<=_&&M.y>=g&&M.y<=p&&M!==i&&M!==a&&Tr(o,u,l,f,c,h,M.x,M.y)&&De(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;S&&S.z<=x;){if(S.x>=d&&S.x<=_&&S.y>=g&&S.y<=p&&S!==i&&S!==a&&Tr(o,u,l,f,c,h,S.x,S.y)&&De(S.prev,S,S.next)>=0)return!1;S=S.nextZ}return!0}function E_(s,t){let e=s;do{const n=e.prev,i=e.next.next;!Ys(n,i)&&pd(n,e,e.next,i)&&Wr(n,i)&&Wr(i,n)&&(t.push(n.i,e.i,i.i),Xr(e),Xr(e.next),e=s=i),e=e.next}while(e!==s);return hs(e)}function T_(s,t,e,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&I_(a,o)){let l=md(a,o);a=hs(a,a.next),l=hs(l,l.next),Vr(a,t,e,n,i,r,0),Vr(l,t,e,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function w_(s,t,e,n){const i=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,l=r<a-1?t[r+1]*n:s.length,c=fd(s,o,l,n,!1);c===c.next&&(c.steiner=!0),i.push(N_(c))}i.sort(A_);for(let r=0;r<i.length;r++)e=R_(i[r],e);return e}function A_(s,t){let e=s.x-t.x;if(e===0&&(e=s.y-t.y,e===0)){const n=(s.next.y-s.y)/(s.next.x-s.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function R_(s,t){const e=C_(s,t);if(!e)return t;const n=md(e,s);return hs(n,n.next),hs(e,e.next)}function C_(s,t){let e=t;const n=s.x,i=s.y;let r=-1/0,a;if(Ys(s,e))return e;do{if(Ys(s,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){const f=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(f<=n&&f>r&&(r=f,a=e.x<e.next.x?e:e.next,f===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let u=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&dd(i<c?n:r,i,l,c,i<c?r:n,i,e.x,e.y)){const f=Math.abs(i-e.y)/(n-e.x);Wr(e,s)&&(f<u||f===u&&(e.x>a.x||e.x===a.x&&P_(a,e)))&&(a=e,u=f)}e=e.next}while(e!==o);return a}function P_(s,t){return De(s.prev,s,t.prev)<0&&De(t.next,s,s.next)<0}function D_(s,t,e,n){let i=s;do i.z===0&&(i.z=mc(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,L_(i)}function L_(s){let t,e=1;do{let n=s,i;s=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=a}r.nextZ=null,e*=2}while(t>1);return s}function mc(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function N_(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function dd(s,t,e,n,i,r,a,o){return(i-a)*(t-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(i-a)*(n-o)}function Tr(s,t,e,n,i,r,a,o){return!(s===a&&t===o)&&dd(s,t,e,n,i,r,a,o)}function I_(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!U_(s,t)&&(Wr(s,t)&&Wr(t,s)&&O_(s,t)&&(De(s.prev,s,t.prev)||De(s,t.prev,t))||Ys(s,t)&&De(s.prev,s,s.next)>0&&De(t.prev,t,t.next)>0)}function De(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function Ys(s,t){return s.x===t.x&&s.y===t.y}function pd(s,t,e,n){const i=Ua(De(s,t,e)),r=Ua(De(s,t,n)),a=Ua(De(e,n,s)),o=Ua(De(e,n,t));return!!(i!==r&&a!==o||i===0&&Ia(s,e,t)||r===0&&Ia(s,n,t)||a===0&&Ia(e,s,n)||o===0&&Ia(e,t,n))}function Ia(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function Ua(s){return s>0?1:s<0?-1:0}function U_(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&pd(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function Wr(s,t){return De(s.prev,s,s.next)<0?De(s,t,s.next)>=0&&De(s,s.prev,t)>=0:De(s,t,s.prev)<0||De(s,s.next,t)<0}function O_(s,t){let e=s,n=!1;const i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function md(s,t){const e=_c(s.i,s.x,s.y),n=_c(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function Mh(s,t,e,n){const i=_c(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Xr(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function _c(s,t,e){return{i:s,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function F_(s,t,e,n){let i=0;for(let r=t,a=e-n;r<e;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}class B_{static triangulate(t,e,n=2){return S_(t,e,n)}}class Us{static area(t){const e=t.length;let n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return Us.area(t)<0}static triangulateShape(t,e){const n=[],i=[],r=[];Sh(t),yh(n,t);let a=t.length;e.forEach(Sh);for(let l=0;l<e.length;l++)i.push(a),a+=e[l].length,yh(n,e[l]);const o=B_.triangulate(n,i);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function Sh(s){const t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function yh(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}class ou extends Ze{constructor(t=new hd([new ct(.5,.5),new ct(-.5,.5),new ct(-.5,-.5),new ct(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,i=[],r=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new me(i,3)),this.setAttribute("uv",new me(r,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1;let h=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:d-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3;const m=e.extrudePath,x=e.UVGenerator!==void 0?e.UVGenerator:z_;let M,S=!1,b,E,v,y;if(m){M=m.getSpacedPoints(u),S=!0,h=!1;const it=m.isCatmullRomCurve3?m.closed:!1;b=m.computeFrenetFrames(u,it),E=new N,v=new N,y=new N}h||(p=0,d=0,g=0,_=0);const C=o.extractPoints(c);let R=C.shape;const L=C.holes;if(!Us.isClockWise(R)){R=R.reverse();for(let it=0,dt=L.length;it<dt;it++){const at=L[it];Us.isClockWise(at)&&(L[it]=at.reverse())}}function B(it){const at=10000000000000001e-36;let Rt=it[0];for(let xt=1;xt<=it.length;xt++){const kt=xt%it.length,Pt=it[kt],Jt=Pt.x-Rt.x,Zt=Pt.y-Rt.y,$t=Jt*Jt+Zt*Zt,G=Math.max(Math.abs(Pt.x),Math.abs(Pt.y),Math.abs(Rt.x),Math.abs(Rt.y)),ye=at*G*G;if($t<=ye){it.splice(kt,1),xt--;continue}Rt=Pt}}B(R),L.forEach(B);const w=L.length,I=R;for(let it=0;it<w;it++){const dt=L[it];R=R.concat(dt)}function D(it,dt,at){return dt||he("ExtrudeGeometry: vec does not exist"),it.clone().addScaledVector(dt,at)}const O=R.length;function H(it,dt,at){let Rt,xt,kt;const Pt=it.x-dt.x,Jt=it.y-dt.y,Zt=at.x-it.x,$t=at.y-it.y,G=Pt*Pt+Jt*Jt,ye=Pt*$t-Jt*Zt;if(Math.abs(ye)>Number.EPSILON){const se=Math.sqrt(G),_e=Math.sqrt(Zt*Zt+$t*$t),Et=dt.x-Jt/se,fe=dt.y+Pt/se,zt=at.x-$t/_e,qt=at.y+Zt/_e,P=((zt-Et)*$t-(qt-fe)*Zt)/(Pt*$t-Jt*Zt);Rt=Et+Pt*P-it.x,xt=fe+Jt*P-it.y;const T=Rt*Rt+xt*xt;if(T<=2)return new ct(Rt,xt);kt=Math.sqrt(T/2)}else{let se=!1;Pt>Number.EPSILON?Zt>Number.EPSILON&&(se=!0):Pt<-Number.EPSILON?Zt<-Number.EPSILON&&(se=!0):Math.sign(Jt)===Math.sign($t)&&(se=!0),se?(Rt=-Jt,xt=Pt,kt=Math.sqrt(G)):(Rt=Pt,xt=Jt,kt=Math.sqrt(G/2))}return new ct(Rt/kt,xt/kt)}const z=[];for(let it=0,dt=I.length,at=dt-1,Rt=it+1;it<dt;it++,at++,Rt++)at===dt&&(at=0),Rt===dt&&(Rt=0),z[it]=H(I[it],I[at],I[Rt]);const V=[];let Y,ut=z.concat();for(let it=0,dt=w;it<dt;it++){const at=L[it];Y=[];for(let Rt=0,xt=at.length,kt=xt-1,Pt=Rt+1;Rt<xt;Rt++,kt++,Pt++)kt===xt&&(kt=0),Pt===xt&&(Pt=0),Y[Rt]=H(at[Rt],at[kt],at[Pt]);V.push(Y),ut=ut.concat(Y)}let At;if(p===0)At=Us.triangulateShape(I,L);else{const it=[],dt=[];for(let at=0;at<p;at++){const Rt=at/p,xt=d*Math.cos(Rt*Math.PI/2),kt=g*Math.sin(Rt*Math.PI/2)+_;for(let Pt=0,Jt=I.length;Pt<Jt;Pt++){const Zt=D(I[Pt],z[Pt],kt);bt(Zt.x,Zt.y,-xt),Rt===0&&it.push(Zt)}for(let Pt=0,Jt=w;Pt<Jt;Pt++){const Zt=L[Pt];Y=V[Pt];const $t=[];for(let G=0,ye=Zt.length;G<ye;G++){const se=D(Zt[G],Y[G],kt);bt(se.x,se.y,-xt),Rt===0&&$t.push(se)}Rt===0&&dt.push($t)}}At=Us.triangulateShape(it,dt)}const K=At.length,lt=g+_;for(let it=0;it<O;it++){const dt=h?D(R[it],ut[it],lt):R[it];S?(v.copy(b.normals[0]).multiplyScalar(dt.x),E.copy(b.binormals[0]).multiplyScalar(dt.y),y.copy(M[0]).add(v).add(E),bt(y.x,y.y,y.z)):bt(dt.x,dt.y,0)}for(let it=1;it<=u;it++)for(let dt=0;dt<O;dt++){const at=h?D(R[dt],ut[dt],lt):R[dt];S?(v.copy(b.normals[it]).multiplyScalar(at.x),E.copy(b.binormals[it]).multiplyScalar(at.y),y.copy(M[it]).add(v).add(E),bt(y.x,y.y,y.z)):bt(at.x,at.y,f/u*it)}for(let it=p-1;it>=0;it--){const dt=it/p,at=d*Math.cos(dt*Math.PI/2),Rt=g*Math.sin(dt*Math.PI/2)+_;for(let xt=0,kt=I.length;xt<kt;xt++){const Pt=D(I[xt],z[xt],Rt);bt(Pt.x,Pt.y,f+at)}for(let xt=0,kt=L.length;xt<kt;xt++){const Pt=L[xt];Y=V[xt];for(let Jt=0,Zt=Pt.length;Jt<Zt;Jt++){const $t=D(Pt[Jt],Y[Jt],Rt);S?bt($t.x,$t.y+M[u-1].y,M[u-1].x+at):bt($t.x,$t.y,f+at)}}}wt(),Nt();function wt(){const it=i.length/3;if(h){let dt=0,at=O*dt;for(let Rt=0;Rt<K;Rt++){const xt=At[Rt];Ht(xt[2]+at,xt[1]+at,xt[0]+at)}dt=u+p*2,at=O*dt;for(let Rt=0;Rt<K;Rt++){const xt=At[Rt];Ht(xt[0]+at,xt[1]+at,xt[2]+at)}}else{for(let dt=0;dt<K;dt++){const at=At[dt];Ht(at[2],at[1],at[0])}for(let dt=0;dt<K;dt++){const at=At[dt];Ht(at[0]+O*u,at[1]+O*u,at[2]+O*u)}}n.addGroup(it,i.length/3-it,0)}function Nt(){const it=i.length/3;let dt=0;st(I,dt),dt+=I.length;for(let at=0,Rt=L.length;at<Rt;at++){const xt=L[at];st(xt,dt),dt+=xt.length}n.addGroup(it,i.length/3-it,1)}function st(it,dt){let at=it.length;for(;--at>=0;){const Rt=at;let xt=at-1;xt<0&&(xt=it.length-1);for(let kt=0,Pt=u+p*2;kt<Pt;kt++){const Jt=O*kt,Zt=O*(kt+1),$t=dt+Rt+Jt,G=dt+xt+Jt,ye=dt+xt+Zt,se=dt+Rt+Zt;Lt($t,G,ye,se)}}}function bt(it,dt,at){l.push(it),l.push(dt),l.push(at)}function Ht(it,dt,at){Vt(it),Vt(dt),Vt(at);const Rt=i.length/3,xt=x.generateTopUV(n,i,Rt-3,Rt-2,Rt-1);Ft(xt[0]),Ft(xt[1]),Ft(xt[2])}function Lt(it,dt,at,Rt){Vt(it),Vt(dt),Vt(Rt),Vt(dt),Vt(at),Vt(Rt);const xt=i.length/3,kt=x.generateSideWallUV(n,i,xt-6,xt-3,xt-2,xt-1);Ft(kt[0]),Ft(kt[1]),Ft(kt[3]),Ft(kt[1]),Ft(kt[2]),Ft(kt[3])}function Vt(it){i.push(l[it*3+0]),i.push(l[it*3+1]),i.push(l[it*3+2])}function Ft(it){r.push(it.x),r.push(it.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return k_(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];n.push(o)}const i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new uo[i.type]().fromJSON(i)),new ou(n,t.options)}}const z_={generateTopUV:function(s,t,e,n,i){const r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[i*3],u=t[i*3+1];return[new ct(r,a),new ct(o,l),new ct(c,u)]},generateSideWallUV:function(s,t,e,n,i,r){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],u=t[n*3+1],f=t[n*3+2],h=t[i*3],d=t[i*3+1],g=t[i*3+2],_=t[r*3],p=t[r*3+1],m=t[r*3+2];return Math.abs(o-u)<Math.abs(a-c)?[new ct(a,1-l),new ct(c,1-f),new ct(h,1-g),new ct(_,1-m)]:[new ct(o,1-l),new ct(u,1-f),new ct(d,1-g),new ct(p,1-m)]}};function k_(s,t,e){if(e.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){const r=s[n];e.shapes.push(r.uuid)}else e.shapes.push(s.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Co extends Ro{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Co(t.radius,t.detail)}}class lu extends Ro{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new lu(t.radius,t.detail)}}class ir extends Ze{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(i),c=o+1,u=l+1,f=t/o,h=e/l,d=[],g=[],_=[],p=[];for(let m=0;m<u;m++){const x=m*h-a;for(let M=0;M<c;M++){const S=M*f-r;g.push(S,-x,0),_.push(0,0,1),p.push(M/o),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let x=0;x<o;x++){const M=x+c*m,S=x+c*(m+1),b=x+1+c*(m+1),E=x+1+c*m;d.push(M,S,E),d.push(S,b,E)}this.setIndex(d),this.setAttribute("position",new me(g,3)),this.setAttribute("normal",new me(_,3)),this.setAttribute("uv",new me(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ir(t.width,t.height,t.widthSegments,t.heightSegments)}}class cu extends Ze{constructor(t=1,e=32,n=16,i=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(a+o,Math.PI);let c=0;const u=[],f=new N,h=new N,d=[],g=[],_=[],p=[];for(let m=0;m<=n;m++){const x=[],M=m/n,S=a+M*o,b=t*Math.cos(S),E=Math.sqrt(t*t-b*b);let v=0;m===0&&a===0?v=.5/e:m===n&&l===Math.PI&&(v=-.5/e);for(let y=0;y<=e;y++){const C=y/e,R=i+C*r;f.x=-E*Math.cos(R),f.y=b,f.z=E*Math.sin(R),g.push(f.x,f.y,f.z),h.copy(f).normalize(),_.push(h.x,h.y,h.z),p.push(C+v,1-M),x.push(c++)}u.push(x)}for(let m=0;m<n;m++)for(let x=0;x<e;x++){const M=u[m][x+1],S=u[m][x],b=u[m+1][x],E=u[m+1][x+1];(m!==0||a>0)&&d.push(M,S,E),(m!==n-1||l<Math.PI)&&d.push(S,b,E)}this.setIndex(d),this.setAttribute("position",new me(g,3)),this.setAttribute("normal",new me(_,3)),this.setAttribute("uv",new me(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new cu(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}class uu extends Ze{constructor(t=new cd(new N(-1,-1,0),new N(-1,1,0),new N(1,1,0)),e=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:i,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new N,l=new N,c=new ct;let u=new N;const f=[],h=[],d=[],g=[];_(),this.setIndex(g),this.setAttribute("position",new me(f,3)),this.setAttribute("normal",new me(h,3)),this.setAttribute("uv",new me(d,2));function _(){for(let M=0;M<e;M++)p(M);p(r===!1?e:0),x(),m()}function p(M){u=t.getPointAt(M/e,u);const S=a.normals[M],b=a.binormals[M];for(let E=0;E<=i;E++){const v=E/i*Math.PI*2,y=Math.sin(v),C=-Math.cos(v);l.x=C*S.x+y*b.x,l.y=C*S.y+y*b.y,l.z=C*S.z+y*b.z,l.normalize(),h.push(l.x,l.y,l.z),o.x=u.x+n*l.x,o.y=u.y+n*l.y,o.z=u.z+n*l.z,f.push(o.x,o.y,o.z)}}function m(){for(let M=1;M<=e;M++)for(let S=1;S<=i;S++){const b=(i+1)*(M-1)+(S-1),E=(i+1)*M+(S-1),v=(i+1)*M+S,y=(i+1)*(M-1)+S;g.push(b,E,y),g.push(E,v,y)}}function x(){for(let M=0;M<=e;M++)for(let S=0;S<=i;S++)c.x=M/e,c.y=S/i,d.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new uu(new uo[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}function Zs(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];if(bh(i))i.isRenderTargetTexture?(Yt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(bh(i[0])){const r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();t[e][n]=r}else t[e][n]=i.slice();else t[e][n]=i}}return t}function an(s){const t={};for(let e=0;e<s.length;e++){const n=Zs(s[e]);for(const i in n)t[i]=n[i]}return t}function bh(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function G_(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function _d(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:oe.workingColorSpace}const qr={clone:Zs,merge:an};var H_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,V_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class hn extends nr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=H_,this.fragmentShader=V_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Zs(t.uniforms),this.uniformsGroups=G_(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const n in t.uniforms){const i=t.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=e[i.value]||null;break;case"c":this.uniforms[n].value=new Wt().setHex(i.value);break;case"v2":this.uniforms[n].value=new ct().fromArray(i.value);break;case"v3":this.uniforms[n].value=new N().fromArray(i.value);break;case"v4":this.uniforms[n].value=new Pe().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Kt().fromArray(i.value);break;case"m4":this.uniforms[n].value=new le().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class gd extends hn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Za extends nr{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Wt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Wt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=dc,this.normalScale=new ct(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new $n,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class W_ extends Za{constructor(t){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new ct(1,1),this.clearcoatNormalMap=null,this.diffuseRoughnessMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return re(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(e){this.ior=(1+.4*e)/(1-.4*e)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessMinimum=100,this.iridescenceThicknessMaximum=400,this.iridescenceThicknessMap=null,this.sheenColor=new Wt(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new Wt(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new Wt(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._diffuseRoughness=0,this._dispersion=0,this._iridescence=0,this._retroreflectivity=0,this._sheen=0,this._transmission=0,this.setValues(t)}get anisotropy(){return this._anisotropy}set anisotropy(t){this._anisotropy>0!=t>0&&this.version++,this._anisotropy=t}get clearcoat(){return this._clearcoat}set clearcoat(t){this._clearcoat>0!=t>0&&this.version++,this._clearcoat=t}get diffuseRoughness(){return this._diffuseRoughness}set diffuseRoughness(t){this._diffuseRoughness>0!=t>0&&this.version++,this._diffuseRoughness=t}get iridescence(){return this._iridescence}set iridescence(t){this._iridescence>0!=t>0&&this.version++,this._iridescence=t}get dispersion(){return this._dispersion}set dispersion(t){this._dispersion>0!=t>0&&this.version++,this._dispersion=t}get retroreflectivity(){return this._retroreflectivity}set retroreflectivity(t){this._retroreflectivity>0!=t>0&&this.version++,this._retroreflectivity=t}get sheen(){return this._sheen}set sheen(t){this._sheen>0!=t>0&&this.version++,this._sheen=t}get transmission(){return this._transmission}set transmission(t){this._transmission>0!=t>0&&this.version++,this._transmission=t}get iridescenceThicknessRange(){return zs('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),[this.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum]}set iridescenceThicknessRange(t){zs('MeshPhysicalMaterial: The "iridescenceThicknessRange" property has been replaced by "iridescenceThicknessMinimum" and "iridescenceThicknessMaximum".'),this.iridescenceThicknessMinimum=t[0],this.iridescenceThicknessMaximum=t[1]}copy(t){return super.copy(t),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=t.anisotropy,this.anisotropyRotation=t.anisotropyRotation,this.anisotropyMap=t.anisotropyMap,this.clearcoat=t.clearcoat,this.clearcoatMap=t.clearcoatMap,this.clearcoatRoughness=t.clearcoatRoughness,this.clearcoatRoughnessMap=t.clearcoatRoughnessMap,this.clearcoatNormalMap=t.clearcoatNormalMap,this.clearcoatNormalScale.copy(t.clearcoatNormalScale),this.diffuseRoughness=t.diffuseRoughness,this.diffuseRoughnessMap=t.diffuseRoughnessMap,this.dispersion=t.dispersion,this.ior=t.ior,this.iridescence=t.iridescence,this.iridescenceMap=t.iridescenceMap,this.iridescenceIOR=t.iridescenceIOR,this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum,this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum,this.iridescenceThicknessMap=t.iridescenceThicknessMap,this.retroreflectivity=t.retroreflectivity,this.sheen=t.sheen,this.sheenColor.copy(t.sheenColor),this.sheenColorMap=t.sheenColorMap,this.sheenRoughness=t.sheenRoughness,this.sheenRoughnessMap=t.sheenRoughnessMap,this.transmission=t.transmission,this.transmissionMap=t.transmissionMap,this.thickness=t.thickness,this.thicknessMap=t.thicknessMap,this.attenuationDistance=t.attenuationDistance,this.attenuationColor.copy(t.attenuationColor),this.specularIntensity=t.specularIntensity,this.specularIntensityMap=t.specularIntensityMap,this.specularColor.copy(t.specularColor),this.specularColorMap=t.specularColorMap,this}}class X_ extends nr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=hm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class q_ extends nr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class Y_ extends oo{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}class xd extends Ve{static registerNode(t){this.prototype._lightNode=t}constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Wt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}const pl=new le,Eh=new N,Th=new N;class Z_{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ct(512,512),this.mapType=En,this.map=null,this.mapPass=null,this.matrix=new le,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Hr,this._frameExtents=new ct(1,1),this._viewportCount=1,this._viewports=[new Pe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera;Eh.setFromMatrixPosition(t.matrixWorld),e.position.copy(Eh),Th.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Th),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,i){pl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(pl,t.coordinateSystem,t.reversedDepth);const r=this._frameExtents,a=i?i.z/r.x:1,o=i?i.w/r.y:1,l=i?i.x/r.x:0,c=i?i.y/r.y:0;t.coordinateSystem===kr||t.reversedDepth?e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),e.multiply(pl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.mapType=t.mapType,this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.mapType=this.mapType,t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Oa=new N,Fa=new Jn,jn=new N;class vd extends Ve{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new le,this.projectionMatrix=new le,this.projectionMatrixInverse=new le,this.coordinateSystem=Zn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Oa,Fa,jn),jn.x===1&&jn.y===1&&jn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Oa,Fa,jn.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(Oa,Fa,jn),jn.x===1&&jn.y===1&&jn.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Oa,Fa,jn.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Li=new N,wh=new ct,Ah=new ct;class Wn extends vd{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Gr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Pr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Gr*2*Math.atan(Math.tan(Pr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Li.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Li.x,Li.y).multiplyScalar(-t/Li.z),Li.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Li.x,Li.y).multiplyScalar(-t/Li.z)}getViewSize(t,e){return this.getViewBounds(t,wh,Ah),e.subVectors(Ah,wh)}setViewOffset(t,e,n,i,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Pr*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,e-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class Po extends vd{constructor(t=-1,e=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class K_ extends Z_{constructor(){super(new Po(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class J_ extends xd{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Ve.DEFAULT_UP),this.updateMatrix(),this.target=new Ve,this.shadow=new K_}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}class $_ extends xd{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}const Cs=-90,Ps=1;class gc extends Ve{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Wn(Cs,Ps,t,e);i.layers=this.layers,this.add(i);const r=new Wn(Cs,Ps,t,e);r.layers=this.layers,this.add(r);const a=new Wn(Cs,Ps,t,e);a.layers=this.layers,this.add(a);const o=new Wn(Cs,Ps,t,e);o.layers=this.layers,this.add(o);const l=new Wn(Cs,Ps,t,e);l.layers=this.layers,this.add(l);const c=new Wn(Cs,Ps,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===Zn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===kr)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,f=t.getRenderTarget(),h=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const _=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let p=!1;t.isWebGLRenderer===!0?p=t.state.buffers.depth.getReversed():p=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.mipmapsAutoUpdate=_,t.setRenderTarget(n,5,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,u),t.setRenderTarget(f,h,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class Q_ extends Wn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t,this.perCameraFrustumCulled=!1}}class j_{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=tg.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function tg(){this._document.hidden===!1&&this.reset()}const Rh=new le;class eg{constructor(t,e,n=0,i=1/0){this.ray=new Ao(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new jc,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):he("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Rh.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Rh),this}intersectObject(t,e=!0,n=[]){return xc(t,this,n,e),n.sort(Ch),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)xc(t[i],this,n,e);return n.sort(Ch),n}}function Ch(s,t){return s.distance-t.distance}function xc(s,t,e,n){let i=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let a=0,o=r.length;a<o;a++)xc(r[a],t,e,!0)}}class vc{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=re(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(re(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class ng extends qi{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function Ph(s,t,e,n){const i=ig(n);switch(e){case Vf:return s*t;case qc:return s*t/i.components*i.byteLength;case Yc:return s*t/i.components*i.byteLength;case us:return s*t*2/i.components*i.byteLength;case Zc:return s*t*2/i.components*i.byteLength;case Wf:return s*t*3/i.components*i.byteLength;case si:return s*t*4/i.components*i.byteLength;case Kc:return s*t*4/i.components*i.byteLength;case Wa:case Xa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case qa:case Ya:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Bl:case kl:return Math.max(s,16)*Math.max(t,8)/4;case Fl:case zl:return Math.max(s,8)*Math.max(t,8)/2;case Gl:case Hl:case Wl:case Xl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Vl:case no:case ql:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Yl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Zl:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Kl:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case Jl:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case $l:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case Ql:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case jl:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case tc:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case ec:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case nc:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case ic:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case sc:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case rc:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case ac:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case oc:case lc:case cc:return Math.ceil(s/4)*Math.ceil(t/4)*16;case uc:case hc:return Math.ceil(s/4)*Math.ceil(t/4)*8;case io:case fc:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ig(s){switch(s){case En:case zf:return{byteLength:1,components:1};case zr:case kf:case dn:return{byteLength:2,components:1};case Wc:case Xc:return{byteLength:2,components:4};case ai:case Vc:case Yn:return{byteLength:4,components:1};case Gf:case Hf:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Oc}}));typeof window<"u"&&(window.__THREE__?Yt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Oc);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Md(){let s=null,t=!1,e=null,n=null;function i(r,a){n=s.requestAnimationFrame(i),e(r,a)}return{start:function(){t!==!0&&e!==null&&s!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function sg(s){const t=new WeakMap;function e(o,l){const c=o.array,u=o.usage,f=c.byteLength,h=s.createBuffer();s.bindBuffer(l,h),s.bufferData(l,c,u),o.onUploadCallback();let d;if(c instanceof Float32Array)d=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=s.HALF_FLOAT:d=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=s.SHORT;else if(c instanceof Uint32Array)d=s.UNSIGNED_INT;else if(c instanceof Int32Array)d=s.INT;else if(c instanceof Int8Array)d=s.BYTE;else if(c instanceof Uint8Array)d=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:f}}function n(o,l,c){const u=l.array,f=l.updateRanges;if(s.bindBuffer(c,o),f.length===0)s.bufferSubData(c,0,u);else{f.sort((d,g)=>d.start-g.start);let h=0;for(let d=1;d<f.length;d++){const g=f[h],_=f[d];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++h,f[h]=_)}f.length=h+1;for(let d=0,g=f.length;d<g;d++){const _=f[d];s.bufferSubData(c,_.start*u.BYTES_PER_ELEMENT,u,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(s.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var rg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,ag=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,og=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,lg=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,cg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,ug=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,hg=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,fg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,dg=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,pg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,mg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,_g=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,gg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,xg=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,vg=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Mg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Sg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,yg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,bg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Eg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Tg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,wg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Ag=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Rg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
#define inverseTransformDirection transformDirectionByInverseViewMatrix
vec3 transformNormalByInverseViewMatrix( in vec3 normal, in mat4 viewMatrix ) {
	return normalize( ( vec4( normal, 0.0 ) * viewMatrix ).xyz );
}
vec3 transformDirectionByInverseViewMatrix( in vec3 dir, in mat4 viewMatrix ) {
	return normalize( ( vec4( dir, 0.0 ) * viewMatrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Cg=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
#endif`,Pg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Dg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Lg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Ng=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ig="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ug=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Og=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,Fg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Bg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,zg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,kg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Gg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Hg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Vg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Wg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Xg=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,qg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Yg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Zg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Kg=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_SUN_LIGHTS > 0
	struct SunLight {
		vec3 direction;
		vec3 color;
	};
	uniform SunLight sunLights[ NUM_SUN_LIGHTS ];
	void getSunLightInfo( const in SunLight sunLight, out IncidentLight light ) {
		light.color = sunLight.color;
		light.direction = sunLight.direction;
		light.visible = true;
	}
#endif
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,Jg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 worldNormal = transformNormalByInverseViewMatrix( normal, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * worldNormal, ENVMAP_MAX_LOD );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_PMREM
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = transformDirectionByInverseViewMatrix( reflectVec, viewMatrix );
			vec4 envMapColor = textureLod( envMap, envMapRotation * reflectVec, roughnessToMip( roughness ) );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_RETROREFLECTION
		vec3 getIBLRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 retroVec = normalize( mix( viewDir, normal, pow4( roughness ) ) );
				retroVec = transformDirectionByInverseViewMatrix( retroVec, viewMatrix );
				vec4 envMapColor = textureLod( envMap, envMapRotation * retroVec, roughnessToMip( roughness ) );
				return envMapColor.rgb * envMapIntensity;
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_PMREM
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
		#ifdef USE_RETROREFLECTION
			vec3 getIBLAnisotropyRetroRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
				#ifdef ENVMAP_TYPE_PMREM
					vec3 bentNormal = cross( bitangent, viewDir );
					bentNormal = normalize( cross( bentNormal, bitangent ) );
					bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
					return getIBLRetroRadiance( viewDir, bentNormal, roughness );
				#else
					return vec3( 0.0 );
				#endif
			}
		#endif
	#endif
#endif`,$g=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Qg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,jg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,t0=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,e0=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.045 );
material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef USE_DIFFUSE_ROUGHNESS
	float diffuseRoughnessFactor = diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		diffuseRoughnessFactor *= texture2D( diffuseRoughnessMap, vDiffuseRoughnessMapUv ).r;
	#endif
	material.diffuseRoughness = saturate( diffuseRoughnessFactor );
#endif
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.045 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_RETROREFLECTION
	material.retroreflectivity = retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,n0=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	vec2 dfg;
	vec3 multiScatteringCompensation;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float diffuseRoughness;
	#endif
	#ifdef USE_RETROREFLECTION
		float retroreflectivity;
	#endif
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0Dielectric;
		vec3 iridescenceF0Metallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
#ifdef USE_DIFFUSE_ROUGHNESS
	const float EON_EPSILON = 1e-7;
	float FON_DirectionalAlbedo( const in float mu, const in float roughness, const in float A ) {
		float muComp = 1.0 - mu;
		float gOverPi = muComp * ( 0.0571085289 + muComp * ( 0.491881867 + muComp * ( - 0.332181442 + muComp * 0.0714429953 ) ) );
		return A * ( 1.0 + roughness * gOverPi );
	}
	vec3 BRDF_EON( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 diffuseColor, const in float roughness ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return BRDF_Lambert( rho );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float s = dot( lightDir, viewDir ) - dotNL * dotNV;
		float sOverT = ( s > 0.0 ) ? s / max( max( dotNL, dotNV ), EON_EPSILON ) : s;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		vec3 singleScatter = rho * RECIPROCAL_PI * A * ( 1.0 + roughness * sOverT );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		float albedoV = FON_DirectionalAlbedo( dotNV, roughness, A );
		float albedoL = FON_DirectionalAlbedo( dotNL, roughness, A );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		vec3 multiScatter = rhoMultiScatter * RECIPROCAL_PI
			* max( EON_EPSILON, 1.0 - albedoV )
			* max( EON_EPSILON, 1.0 - albedoL )
			/ max( EON_EPSILON, 1.0 - averageAlbedo );
		return singleScatter + multiScatter;
	}
	vec3 EON_DirectionalAlbedo( const in vec3 diffuseColor, const in float roughness, const in float dotNV ) {
		vec3 rho = saturate( diffuseColor );
		if ( roughness <= EON_EPSILON ) return rho;
		float A = 1.0 / ( 1.0 + ( 0.5 - 2.0 / ( 3.0 * PI ) ) * roughness );
		float directionalAlbedo = FON_DirectionalAlbedo( dotNV, roughness, A );
		float averageAlbedo = A * ( 1.0 + ( 2.0 / 3.0 - 28.0 / ( 15.0 * PI ) ) * roughness );
		vec3 rhoMultiScatter = rho * rho * averageAlbedo / max( vec3( EON_EPSILON ), vec3( 1.0 ) - rho * ( 1.0 - averageAlbedo ) );
		return rho * directionalAlbedo + rhoMultiScatter * ( 1.0 - directionalAlbedo );
	}
#endif
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = max( material.clearcoatRoughness, 0.045 );
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = max( material.roughness, 0.045 );
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float alphaT = max( material.alphaT, alpha );
		float V = V_GGX_SmithCorrelated_Anisotropic( alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec2 fab, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec2 fab, const in vec3 specularColor, const in float specularF90, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	vec3 specularBRDF = BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	#ifdef USE_RETROREFLECTION
		vec3 retroViewDir = reflect( - geometryViewDir, geometryNormal );
		vec3 retroSpecularBRDF = BRDF_GGX( directLight.direction, retroViewDir, geometryNormal, material );
		specularBRDF = mix( specularBRDF, retroSpecularBRDF, saturate( material.retroreflectivity ) );
	#endif
	reflectedLight.directSpecular += irradiance * specularBRDF * material.multiScatteringCompensation;
	vec3 halfDir = normalize( directLight.direction + geometryViewDir );
	float dotVH = saturate( dot( geometryViewDir, halfDir ) );
	vec3 F = F_Schlick( material.specularColor, material.specularF90, dotVH );
	#ifdef USE_RETROREFLECTION
		vec3 retroHalfDir = normalize( directLight.direction + retroViewDir );
		float dotRetroVH = saturate( dot( retroViewDir, retroHalfDir ) );
		vec3 retroF = F_Schlick( material.specularColor, material.specularF90, dotRetroVH );
		F = mix( F, retroF, saturate( material.retroreflectivity ) );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		vec3 diffuseBRDF = BRDF_EON( directLight.direction, geometryViewDir, geometryNormal, material.diffuseColor, material.diffuseRoughness ) * ( 1.0 - material.metalness );
	#else
		vec3 diffuseBRDF = BRDF_Lambert( material.diffuseContribution );
	#endif
	reflectedLight.directDiffuse += irradiance * diffuseBRDF * ( 1.0 - F );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScattering, multiScattering );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScattering, multiScattering );
	#endif
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuseAlbedo = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness );
		vec3 diffuse = irradiance * RECIPROCAL_PI * diffuseAlbedo * ( 1.0 - singleScattering - multiScattering );
	#else
		vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution ) * ( 1.0 - singleScattering - multiScattering );
	#endif
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		sheenSpecularIndirect += irradiance * material.sheenColor * sheenAlbedo * RECIPROCAL_PI;
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( material.dfg, material.specularColor, material.specularF90, material.iridescence, material.iridescenceF0Dielectric, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( material.dfg, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceF0Metallic, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( material.dfg, material.specularColor, material.specularF90, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( material.dfg, material.diffuseColor, material.specularF90, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	#ifdef USE_DIFFUSE_ROUGHNESS
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		vec3 diffuse = EON_DirectionalAlbedo( material.diffuseColor, material.diffuseRoughness, dotNV ) * ( 1.0 - material.metalness ) * ( 1.0 - totalScatteringDielectric );
	#else
		vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	#endif
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,i0=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		vec3 iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		vec3 iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( iridescenceFresnelDielectric, iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0Dielectric = Schlick_to_F0( iridescenceFresnelDielectric, 1.0, dotNVi );
		material.iridescenceF0Metallic = Schlick_to_F0( iridescenceFresnelMetallic, 1.0, dotNVi );
	}
#endif
#ifdef STANDARD
	float dotNVms = saturate( dot( geometryNormal, geometryViewDir ) );
	material.dfg = texture2D( dfgLUT, vec2( material.roughness, dotNVms ) ).rg;
	#if ( NUM_SUN_LIGHTS > 0 || NUM_DIR_LIGHTS > 0 || NUM_POINT_LIGHTS > 0 || NUM_SPOT_LIGHTS > 0 )
		float EssMs = material.dfg.x + material.dfg.y;
		material.multiScatteringCompensation = 1.0 + material.specularColorBlended * ( 1.0 / EssMs - 1.0 );
	#endif
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SUN_LIGHTS > 0 ) && defined( RE_Direct )
	SunLight sunLight;
	#if defined( USE_SHADOWMAP ) && NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHTS; i ++ ) {
		sunLight = sunLights[ i ];
		getSunLightInfo( sunLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SUN_LIGHT_SHADOWS )
		sunLightShadow = sunLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getSunShadow( sunShadowMap[ i ], sunLightShadow, UNROLLED_LOOP_INDEX ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_LIGHT_PROBE_GRIDS > 0
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = transformNormalByInverseViewMatrix( geometryNormal, viewMatrix );
		int probeGrid = - 1;
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( isInsideLightProbeGrid( probeWorldPos, probeWorldNormal, probesMin[ i ], probesMax[ i ], probesResolution[ i ] ) ) probeGrid = UNROLLED_LOOP_INDEX;
		}
		#pragma unroll_loop_end
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_LIGHT_PROBE_GRIDS; i ++ ) {
			if ( probeGrid == UNROLLED_LOOP_INDEX ) irradiance += getLightProbeGridIrradiance( probesSH[ i ], probesMin[ i ], probesMax[ i ], probesResolution[ i ], probeWorldPos, probeWorldNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,s0=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_PMREM )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		vec3 iblRadiance = getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		vec3 iblRadiance = getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_RETROREFLECTION
		#ifdef USE_ANISOTROPY
			vec3 retroIBLRadiance = getIBLAnisotropyRetroRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
		#else
			vec3 retroIBLRadiance = getIBLRetroRadiance( geometryViewDir, geometryNormal, material.roughness );
		#endif
		iblRadiance = mix( iblRadiance, retroIBLRadiance, saturate( material.retroreflectivity ) );
	#endif
	radiance += iblRadiance;
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,r0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,a0=`#if NUM_LIGHT_PROBE_GRIDS > 0
uniform highp sampler3D probesSH[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMin[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesMax[ NUM_LIGHT_PROBE_GRIDS ];
uniform vec3 probesResolution[ NUM_LIGHT_PROBE_GRIDS ];
bool isInsideLightProbeGrid( vec3 worldPos, vec3 worldNormal, vec3 probesMin, vec3 probesMax, vec3 probesResolution ) {
	vec3 spacing = ( probesMax - probesMin ) / probesResolution;
	vec3 samplePos = worldPos + worldNormal * spacing * 0.5;
	vec3 margin = spacing * 0.01;
	return all( greaterThanEqual( samplePos, probesMin - margin ) ) && all( lessThanEqual( samplePos, probesMax + margin ) );
}
vec3 getLightProbeGridIrradiance( highp sampler3D probesSH, vec3 probesMin, vec3 probesMax, vec3 probesResolution, vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 probeSpacing = gridRange / res;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.5 / res, 1.0 - 0.5 / res );
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,o0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,l0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,c0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,u0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,h0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,f0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,d0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,p0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,m0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,_0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,g0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,x0=`#if defined( USE_MORPHCOLORS )
	#if defined( USE_COLOR_ALPHA )
		vColor *= morphTargetBaseInfluence;
	#elif defined( USE_COLOR )
		vColor.rgb *= morphTargetBaseInfluence;
	#endif
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor.rgb += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,v0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,M0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,S0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,y0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#ifdef DOUBLE_SIDED
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#ifdef DOUBLE_SIDED
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,b0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,E0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,T0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,w0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,A0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,R0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,C0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,P0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,D0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,L0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,N0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,I0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,U0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,O0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,F0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,B0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,z0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,k0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		#define SUN_LIGHT_CASCADES 2
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#else
			uniform sampler2D sunShadowMap[ NUM_SUN_LIGHT_SHADOWS ];
		#endif
		uniform mat4 sunShadowMatrix[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		uniform vec4 sunShadowCascade[ NUM_SUN_LIGHT_SHADOWS * SUN_LIGHT_CASCADES ];
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
		struct SunLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SunLightShadow sunLightShadows[ NUM_SUN_LIGHT_SHADOWS ];
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				vec2 radius = shadowRadius * texelSize;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_SUN_LIGHT_SHADOWS > 0
		float getSunShadow(
			#if defined( SHADOWMAP_TYPE_PCF )
				sampler2DShadow shadowMap,
			#else
				sampler2D shadowMap,
			#endif
			SunLightShadow sunLightShadow,
			int shadowIndex
		) {
			vec4 shadowWorldPosition = vec4( vSunShadowWorldPosition.xyz + vSunShadowWorldNormal * sunLightShadow.shadowNormalBias, 1.0 );
			float viewDepth = vSunShadowWorldPosition.w;
			int cascadeOffset = shadowIndex * SUN_LIGHT_CASCADES;
			float shadow = 1.0;
			for ( int i = SUN_LIGHT_CASCADES - 1; i >= 0; i -- ) {
				vec4 cascade = sunShadowCascade[ cascadeOffset + i ];
				if ( viewDepth >= cascade.x && viewDepth < cascade.y ) {
					float cascadeShadow = getShadow(
						shadowMap,
						sunLightShadow.shadowMapSize,
						sunLightShadow.shadowIntensity,
						sunLightShadow.shadowBias,
						sunLightShadow.shadowRadius,
						sunShadowMatrix[ cascadeOffset + i ] * shadowWorldPosition
					);
					shadow = mix( cascadeShadow, shadow, smoothstep( cascade.z, cascade.y, viewDepth ) );
				}
			}
			return shadow;
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float lightDistance = length( lightToPosition );
			float depthRange = shadowCameraFar - shadowCameraNear;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float depthA = - shadowCameraNear / depthRange - shadowBias;
				float depthB = shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#else
				float depthA = shadowCameraFar / depthRange + shadowBias;
				float depthB = - shadowCameraNear * shadowCameraFar / ( depthRange * lightDistance );
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			shadow = 0.0;
			for ( int i = 0; i < 5; i ++ ) {
				vec2 offset = vogelDiskSample( i, 5, phi );
				vec3 direction = bd3D + ( tangent * offset.x + bitangent * offset.y ) * texelSize;
				vec3 absDirection = abs( direction );
				float dp = depthA + depthB / max( max( absDirection.x, absDirection.y ), absDirection.z );
				shadow += texture( shadowMap, vec4( direction, dp ) );
			}
			shadow *= 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,G0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
		varying vec4 vSunShadowWorldPosition;
		varying vec3 vSunShadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,H0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = transformNormalByInverseViewMatrix( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_SUN_LIGHT_SHADOWS > 0
		vSunShadowWorldPosition = vec4( worldPosition.xyz, - mvPosition.z );
		vSunShadowWorldNormal = shadowWorldNormal;
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,V0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_SUN_LIGHT_SHADOWS > 0
	SunLightShadow sunLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SUN_LIGHT_SHADOWS; i ++ ) {
		sunLight = sunLightShadows[ i ];
		shadow *= receiveShadow ? getSunShadow( sunShadowMap[ i ], sunLight, UNROLLED_LOOP_INDEX ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,W0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,X0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,q0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Y0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Z0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,K0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,J0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,$0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Q0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = transformNormalByInverseViewMatrix( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,j0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,tx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,ex=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	uniform mat3 diffuseRoughnessMapTransform;
	varying vec2 vDiffuseRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,nx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DIFFUSE_ROUGHNESSMAP
	vDiffuseRoughnessMapUv = ( diffuseRoughnessMapTransform * vec3( DIFFUSE_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,ix=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const sx=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,rx=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ax=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ox=`uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <envmap_common_pars_fragment>
void main() {
	#ifdef ENVMAP_TYPE_PMREM
		vec4 texColor = textureLod( envMap, backgroundRotation * vWorldDirection, roughnessToMip( backgroundBlurriness ) );
	#else
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,lx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,cx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,ux=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,hx=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,fx=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,dx=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,px=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,mx=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,_x=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,gx=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,xx=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,vx=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Mx=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Sx=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,yx=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,bx=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ex=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Tx=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,wx=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ax=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Rx=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Cx=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DIFFUSE_ROUGHNESS
	uniform float diffuseRoughness;
	#ifdef USE_DIFFUSE_ROUGHNESSMAP
		uniform sampler2D diffuseRoughnessMap;
	#endif
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_RETROREFLECTION
	uniform float retroreflectivity;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Px=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Dx=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lx=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Nx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ix=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ux=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Ox=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Fx=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,ae={alphahash_fragment:rg,alphahash_pars_fragment:ag,alphamap_fragment:og,alphamap_pars_fragment:lg,alphatest_fragment:cg,alphatest_pars_fragment:ug,aomap_fragment:hg,aomap_pars_fragment:fg,batching_pars_vertex:dg,batching_vertex:pg,begin_vertex:mg,beginnormal_vertex:_g,bsdfs:gg,iridescence_fragment:xg,bumpmap_pars_fragment:vg,clipping_planes_fragment:Mg,clipping_planes_pars_fragment:Sg,clipping_planes_pars_vertex:yg,clipping_planes_vertex:bg,color_fragment:Eg,color_pars_fragment:Tg,color_pars_vertex:wg,color_vertex:Ag,common:Rg,defaultnormal_vertex:Cg,displacementmap_pars_vertex:Pg,displacementmap_vertex:Dg,emissivemap_fragment:Lg,emissivemap_pars_fragment:Ng,colorspace_fragment:Ig,colorspace_pars_fragment:Ug,envmap_fragment:Og,envmap_common_pars_fragment:Fg,envmap_pars_fragment:Bg,envmap_pars_vertex:zg,envmap_physical_pars_fragment:Jg,envmap_vertex:kg,fog_vertex:Gg,fog_pars_vertex:Hg,fog_fragment:Vg,fog_pars_fragment:Wg,gradientmap_pars_fragment:Xg,lightmap_pars_fragment:qg,lights_lambert_fragment:Yg,lights_lambert_pars_fragment:Zg,lights_pars_begin:Kg,lights_toon_fragment:$g,lights_toon_pars_fragment:Qg,lights_phong_fragment:jg,lights_phong_pars_fragment:t0,lights_physical_fragment:e0,lights_physical_pars_fragment:n0,lights_fragment_begin:i0,lights_fragment_maps:s0,lights_fragment_end:r0,lightprobes_pars_fragment:a0,logdepthbuf_fragment:o0,logdepthbuf_pars_fragment:l0,logdepthbuf_pars_vertex:c0,logdepthbuf_vertex:u0,map_fragment:h0,map_pars_fragment:f0,map_particle_fragment:d0,map_particle_pars_fragment:p0,metalnessmap_fragment:m0,metalnessmap_pars_fragment:_0,morphinstance_vertex:g0,morphcolor_vertex:x0,morphnormal_vertex:v0,morphtarget_pars_vertex:M0,morphtarget_vertex:S0,normal_fragment_begin:y0,normal_fragment_maps:b0,normal_pars_fragment:E0,normal_pars_vertex:T0,normal_vertex:w0,normalmap_pars_fragment:A0,clearcoat_normal_fragment_begin:R0,clearcoat_normal_fragment_maps:C0,clearcoat_pars_fragment:P0,iridescence_pars_fragment:D0,opaque_fragment:L0,packing:N0,premultiplied_alpha_fragment:I0,project_vertex:U0,dithering_fragment:O0,dithering_pars_fragment:F0,roughnessmap_fragment:B0,roughnessmap_pars_fragment:z0,shadowmap_pars_fragment:k0,shadowmap_pars_vertex:G0,shadowmap_vertex:H0,shadowmask_pars_fragment:V0,skinbase_vertex:W0,skinning_pars_vertex:X0,skinning_vertex:q0,skinnormal_vertex:Y0,specularmap_fragment:Z0,specularmap_pars_fragment:K0,tonemapping_fragment:J0,tonemapping_pars_fragment:$0,transmission_fragment:Q0,transmission_pars_fragment:j0,uv_pars_fragment:tx,uv_pars_vertex:ex,uv_vertex:nx,worldpos_vertex:ix,background_vert:sx,background_frag:rx,backgroundCube_vert:ax,backgroundCube_frag:ox,cube_vert:lx,cube_frag:cx,depth_vert:ux,depth_frag:hx,distance_vert:fx,distance_frag:dx,equirect_vert:px,equirect_frag:mx,linedashed_vert:_x,linedashed_frag:gx,meshbasic_vert:xx,meshbasic_frag:vx,meshlambert_vert:Mx,meshlambert_frag:Sx,meshmatcap_vert:yx,meshmatcap_frag:bx,meshnormal_vert:Ex,meshnormal_frag:Tx,meshphong_vert:wx,meshphong_frag:Ax,meshphysical_vert:Rx,meshphysical_frag:Cx,meshtoon_vert:Px,meshtoon_frag:Dx,points_vert:Lx,points_frag:Nx,shadow_vert:Ix,shadow_frag:Ux,sprite_vert:Ox,sprite_frag:Fx},Ct={common:{diffuse:{value:new Wt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Kt}},envmap:{envMap:{value:null},envMapRotation:{value:new Kt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Kt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Kt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Kt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Kt},normalScale:{value:new ct(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Kt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Kt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Kt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Kt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Wt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Wt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0},uvTransform:{value:new Kt}},sprite:{diffuse:{value:new Wt(16777215)},opacity:{value:1},center:{value:new ct(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Kt},alphaMap:{value:null},alphaMapTransform:{value:new Kt},alphaTest:{value:0}}},ni={basic:{uniforms:an([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.fog]),vertexShader:ae.meshbasic_vert,fragmentShader:ae.meshbasic_frag},lambert:{uniforms:an([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,Ct.lights,{emissive:{value:new Wt(0)},envMapIntensity:{value:1}}]),vertexShader:ae.meshlambert_vert,fragmentShader:ae.meshlambert_frag},phong:{uniforms:an([Ct.common,Ct.specularmap,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,Ct.lights,{emissive:{value:new Wt(0)},specular:{value:new Wt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ae.meshphong_vert,fragmentShader:ae.meshphong_frag},standard:{uniforms:an([Ct.common,Ct.envmap,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.roughnessmap,Ct.metalnessmap,Ct.fog,Ct.lights,{emissive:{value:new Wt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ae.meshphysical_vert,fragmentShader:ae.meshphysical_frag},toon:{uniforms:an([Ct.common,Ct.aomap,Ct.lightmap,Ct.emissivemap,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.gradientmap,Ct.fog,Ct.lights,{emissive:{value:new Wt(0)}}]),vertexShader:ae.meshtoon_vert,fragmentShader:ae.meshtoon_frag},matcap:{uniforms:an([Ct.common,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,Ct.fog,{matcap:{value:null}}]),vertexShader:ae.meshmatcap_vert,fragmentShader:ae.meshmatcap_frag},points:{uniforms:an([Ct.points,Ct.fog]),vertexShader:ae.points_vert,fragmentShader:ae.points_frag},dashed:{uniforms:an([Ct.common,Ct.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ae.linedashed_vert,fragmentShader:ae.linedashed_frag},depth:{uniforms:an([Ct.common,Ct.displacementmap]),vertexShader:ae.depth_vert,fragmentShader:ae.depth_frag},normal:{uniforms:an([Ct.common,Ct.bumpmap,Ct.normalmap,Ct.displacementmap,{opacity:{value:1}}]),vertexShader:ae.meshnormal_vert,fragmentShader:ae.meshnormal_frag},sprite:{uniforms:an([Ct.sprite,Ct.fog]),vertexShader:ae.sprite_vert,fragmentShader:ae.sprite_frag},background:{uniforms:{uvTransform:{value:new Kt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ae.background_vert,fragmentShader:ae.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Kt}},vertexShader:ae.backgroundCube_vert,fragmentShader:ae.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ae.cube_vert,fragmentShader:ae.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ae.equirect_vert,fragmentShader:ae.equirect_frag},distance:{uniforms:an([Ct.common,Ct.displacementmap,{referencePosition:{value:new N},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ae.distance_vert,fragmentShader:ae.distance_frag},shadow:{uniforms:an([Ct.lights,Ct.fog,{color:{value:new Wt(0)},opacity:{value:1}}]),vertexShader:ae.shadow_vert,fragmentShader:ae.shadow_frag}};ni.physical={uniforms:an([ni.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Kt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Kt},clearcoatNormalScale:{value:new ct(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Kt},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Kt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Kt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Kt},sheen:{value:0},sheenColor:{value:new Wt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Kt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Kt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Kt},transmissionSamplerSize:{value:new ct},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Kt},attenuationDistance:{value:0},attenuationColor:{value:new Wt(0)},specularColor:{value:new Wt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Kt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Kt},anisotropyVector:{value:new ct},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Kt}}]),vertexShader:ae.meshphysical_vert,fragmentShader:ae.meshphysical_frag};const Ba={r:0,b:0,g:0},Bx=new le,Sd=new Kt;Sd.set(-1,0,0,0,1,0,0,0,1);function zx(s,t,e,n,i,r){const a=new Wt(0);let o=i===!0?0:1,l,c,u=null,f=0,h=null;function d(x){let M=x.isScene===!0?x.background:null;if(M&&M.isTexture){const S=x.backgroundBlurriness>0;M=t.get(M,S)}return M}function g(x){let M=!1;const S=d(x);S===null?p(a,o):S&&S.isColor&&(p(S,1),M=!0);const b=s.xr.getEnvironmentBlendMode();b==="additive"?e.buffers.color.setClear(0,0,0,1,r):b==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||M)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function _(x,M){const S=d(M);S&&S.isCubeTexture?(c===void 0&&(c=new vn(new ds(1,1,1),new hn({name:"BackgroundCubeMaterial",uniforms:Zs(ni.backgroundCube.uniforms),vertexShader:ni.backgroundCube.vertexShader,fragmentShader:ni.backgroundCube.fragmentShader,side:fn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(b,E,v){this.matrixWorld.copyPosition(v.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=S,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Bx.makeRotationFromEuler(M.backgroundRotation)).transpose(),S.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Sd),c.material.toneMapped=oe.getTransfer(S.colorSpace)!==pe,(u!==S||f!==S.version||h!==s.toneMapping)&&(c.material.needsUpdate=!0,u=S,f=S.version,h=s.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new vn(new ir(2,2),new hn({name:"BackgroundMaterial",uniforms:Zs(ni.background.uniforms),vertexShader:ni.background.vertexShader,fragmentShader:ni.background.fragmentShader,side:cs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=oe.getTransfer(S.colorSpace)!==pe,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(u!==S||f!==S.version||h!==s.toneMapping)&&(l.material.needsUpdate=!0,u=S,f=S.version,h=s.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,M){x.getRGB(Ba,_d(s)),e.buffers.color.setClear(Ba.r,Ba.g,Ba.b,M,r)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(x,M=1){a.set(x),o=M,p(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(x){o=x,p(a,o)},render:g,addToRenderList:_,dispose:m}}function kx(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=h(null);let r=i,a=!1;function o(L,U,B,w,I){let D=!1;const O=f(L,w,B,U);r!==O&&(r=O,c(r.object)),D=d(L,w,B,I),D&&g(L,w,B,I),I!==null&&t.update(I,s.ELEMENT_ARRAY_BUFFER),(D||a)&&(a=!1,S(L,U,B,w),I!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(I).buffer))}function l(){return s.createVertexArray()}function c(L){return s.bindVertexArray(L)}function u(L){return s.deleteVertexArray(L)}function f(L,U,B,w){const I=w.wireframe===!0;let D=n[U.id];D===void 0&&(D={},n[U.id]=D);const O=L.isInstancedMesh===!0?L.id:0;let H=D[O];H===void 0&&(H={},D[O]=H);let z=H[B.id];z===void 0&&(z={},H[B.id]=z);let V=z[I];return V===void 0&&(V=h(l()),z[I]=V),V}function h(L){const U=[],B=[],w=[];for(let I=0;I<e;I++)U[I]=0,B[I]=0,w[I]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:U,enabledAttributes:B,attributeDivisors:w,object:L,attributes:{},index:null}}function d(L,U,B,w){const I=r.attributes,D=U.attributes;let O=0;const H=B.getAttributes();for(const z in H)if(H[z].location>=0){const Y=I[z];let ut=D[z];if(ut===void 0&&(z==="instanceMatrix"&&L.instanceMatrix&&(ut=L.instanceMatrix),z==="instanceColor"&&L.instanceColor&&(ut=L.instanceColor)),Y===void 0||Y.attribute!==ut||ut&&Y.data!==ut.data)return!0;O++}return r.attributesNum!==O||r.index!==w}function g(L,U,B,w){const I={},D=U.attributes;let O=0;const H=B.getAttributes();for(const z in H)if(H[z].location>=0){let Y=D[z];Y===void 0&&(z==="instanceMatrix"&&L.instanceMatrix&&(Y=L.instanceMatrix),z==="instanceColor"&&L.instanceColor&&(Y=L.instanceColor));const ut={};ut.attribute=Y,Y&&Y.data&&(ut.data=Y.data),I[z]=ut,O++}r.attributes=I,r.attributesNum=O,r.index=w}function _(){const L=r.newAttributes;for(let U=0,B=L.length;U<B;U++)L[U]=0}function p(L){m(L,0)}function m(L,U){const B=r.newAttributes,w=r.enabledAttributes,I=r.attributeDivisors;B[L]=1,w[L]===0&&(s.enableVertexAttribArray(L),w[L]=1),I[L]!==U&&(s.vertexAttribDivisor(L,U),I[L]=U)}function x(){const L=r.newAttributes,U=r.enabledAttributes;for(let B=0,w=U.length;B<w;B++)U[B]!==L[B]&&(s.disableVertexAttribArray(B),U[B]=0)}function M(L,U,B,w,I,D,O){O===!0?s.vertexAttribIPointer(L,U,B,I,D):s.vertexAttribPointer(L,U,B,w,I,D)}function S(L,U,B,w){_();const I=w.attributes,D=B.getAttributes(),O=U.defaultAttributeValues;for(const H in D){const z=D[H];if(z.location>=0){let V=I[H];if(V===void 0&&(H==="instanceMatrix"&&L.instanceMatrix&&(V=L.instanceMatrix),H==="instanceColor"&&L.instanceColor&&(V=L.instanceColor)),V!==void 0){const Y=V.normalized,ut=V.itemSize,At=t.get(V);if(At===void 0)continue;const K=At.buffer,lt=At.type,wt=At.bytesPerElement,Nt=lt===s.INT||lt===s.UNSIGNED_INT||V.gpuType===Vc;if(V.isInterleavedBufferAttribute){const st=V.data,bt=st.isInterleavedBuffer===!0?st.stride:st.itemSize,Ht=V.offset;if(st.isInstancedInterleavedBuffer||st.isInstancedBufferAttribute){for(let Lt=0;Lt<z.locationSize;Lt++)m(z.location+Lt,st.meshPerAttribute);L.isInstancedMesh!==!0&&w._maxInstanceCount===void 0&&(w._maxInstanceCount=st.meshPerAttribute*st.count)}else for(let Lt=0;Lt<z.locationSize;Lt++)p(z.location+Lt);s.bindBuffer(s.ARRAY_BUFFER,K);for(let Lt=0;Lt<z.locationSize;Lt++)M(z.location+Lt,ut/z.locationSize,lt,Y,bt*wt,(Ht+ut/z.locationSize*Lt)*wt,Nt)}else{if(V.isInstancedBufferAttribute){for(let st=0;st<z.locationSize;st++)m(z.location+st,V.meshPerAttribute);L.isInstancedMesh!==!0&&w._maxInstanceCount===void 0&&(w._maxInstanceCount=V.meshPerAttribute*V.count)}else for(let st=0;st<z.locationSize;st++)p(z.location+st);s.bindBuffer(s.ARRAY_BUFFER,K);for(let st=0;st<z.locationSize;st++)M(z.location+st,ut/z.locationSize,lt,Y,ut*wt,ut/z.locationSize*st*wt,Nt)}}else if(O!==void 0){const Y=O[H];if(Y!==void 0)switch(Y.length){case 2:s.vertexAttrib2fv(z.location,Y);break;case 3:s.vertexAttrib3fv(z.location,Y);break;case 4:s.vertexAttrib4fv(z.location,Y);break;default:s.vertexAttrib1fv(z.location,Y)}}}}x()}function b(){C();for(const L in n){const U=n[L];for(const B in U){const w=U[B];for(const I in w){const D=w[I];for(const O in D)u(D[O].object),delete D[O];delete w[I]}}delete n[L]}}function E(L){if(n[L.id]===void 0)return;const U=n[L.id];for(const B in U){const w=U[B];for(const I in w){const D=w[I];for(const O in D)u(D[O].object),delete D[O];delete w[I]}}delete n[L.id]}function v(L){for(const U in n){const B=n[U];for(const w in B){const I=B[w];if(I[L.id]===void 0)continue;const D=I[L.id];for(const O in D)u(D[O].object),delete D[O];delete I[L.id]}}}function y(L){for(const U in n){const B=n[U],w=L.isInstancedMesh===!0?L.id:0,I=B[w];if(I!==void 0){for(const D in I){const O=I[D];for(const H in O)u(O[H].object),delete O[H];delete I[D]}delete B[w],Object.keys(B).length===0&&delete n[U]}}}function C(){R(),a=!0,r!==i&&(r=i,c(r.object))}function R(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:C,resetDefaultState:R,dispose:b,releaseStatesOfGeometry:E,releaseStatesOfObject:y,releaseStatesOfProgram:v,initAttributes:_,enableAttribute:p,disableUnusedAttributes:x}}function Gx(s,t,e){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),e.update(c,n,1)}function a(l,c,u){u!==0&&(s.drawArraysInstanced(n,l,c,u),e.update(c,n,u))}function o(l,c,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let h=0;for(let d=0;d<u;d++)h+=c[d];e.update(h,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Hx(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const v=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(v.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(v){return!(v!==si&&n.convert(v)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(v){const y=v===dn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(v!==En&&v!==Yn&&!y&&n.convert(v)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(v){if(v==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";v="mediump"}return v==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(Yt("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const f=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),h=e.logarithmicDepthBuffer===!0&&f===!1;e.reversedDepthBuffer===!0&&f===!1&&Yt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),e.logarithmicDepthBuffer===!0&&f===!0&&Yt("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),p=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),m=s.getParameter(s.MAX_VERTEX_ATTRIBS),x=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),M=s.getParameter(s.MAX_VARYING_VECTORS),S=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),b=s.getParameter(s.MAX_SAMPLES),E=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:f,maxTextures:d,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:x,maxVaryings:M,maxFragmentUniforms:S,maxSamples:b,samples:E}}function Vx(s){const t=this;let e=null,n=0,i=!1,r=!1;const a=new gi,o=new Kt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,h){const d=f.length!==0||h||n!==0||i;return i=h,n=f.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,h){e=u(f,h,0)},this.setState=function(f,h,d){const g=f.clippingPlanes,_=f.clipIntersection,p=f.clipShadows,m=s.get(f);if(!i||g===null||g.length===0||r&&!p)r?u(null):c();else{const x=r?0:n,M=x*4;let S=m.clippingState||null;l.value=S,S=u(g,h,M,d);for(let b=0;b!==M;++b)S[b]=e[b];m.clippingState=S,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(f,h,d,g){const _=f!==null?f.length:0;let p=null;if(_!==0){if(p=l.value,g!==!0||p===null){const m=d+_*4,x=h.matrixWorldInverse;o.getNormalMatrix(x),(p===null||p.length<m)&&(p=new Float32Array(m));for(let M=0,S=d;M!==_;++M,S+=4)a.copy(f[M]).applyMatrix4(x,o),a.normal.toArray(p,S),p[S+3]=a.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,p}}class hu extends pn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new nd(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new ds(5,5,5),r=new hn({name:"CubemapFromEquirect",uniforms:Zs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:fn,blending:ss});r.uniforms.tEquirect.value=e;const a=new vn(i,r),o=e.minFilter;return e.minFilter===Mi&&(e.minFilter=on),new gc(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(r)}}const Dh=256,Wx=3,Xx=20,yd=256,bd=16,qx=3,Yx=new N,Zx=new Wt;class ho{constructor(t){this._renderer=t,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new gc(1,10,null),this._boxMesh=new vn(new ds(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(t,e=0,n=.1,i=100,r={}){const{size:a=256,position:o=Yx}=r,l=this._renderer;this._setSize(a);const c=this._allocateTarget(),u=this._getSourceTarget(!0);e>0&&(u.texture.mipmapsAutoUpdate=!1);const f=l.autoClear,h=l.autoClearColor,d=l.autoClearDepth,g=l.autoClearStencil,_=t.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,_===null&&(t.background=l.getClearColor(Zx));const p=new gc(n,i,u);return p.position.copy(o),p.update(l,t),l.autoClear=f,l.autoClearColor=h,l.autoClearDepth=d,l.autoClearStencil=g,t.background=_,e>0&&(u.texture.mipmapsAutoUpdate=!0,this._blur(c,e)),this._applyPMREM(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Ih(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Nh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(t,e){return e>0?1-Math.sqrt(1-t/e):0}_setSize(t){this._cubeSize=Math.max(Dh,Kf(t))}_fromTexture(t,e){t.mapping===Ws||t.mapping===Br?this._setSize(t.image.length===0?Dh:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4);const n=e||this._allocateTarget();return this._textureToCubemap(t),this._applyPMREM(n),n}_allocateTarget(){const t=this._cubeSize,e=Lh(t,!1,!1),n=Math.log2(t)-Wx;for(let i=0;i<=n;i++)e.texture.mipmaps.push({width:t>>i,height:t>>i});return e.texture.name="PMREM",e.texture.isPMREMTexture=!0,e}_getSourceTarget(t=!1){const e=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==e||t&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=Lh(e,!0,t)),this._sourceTarget}_compileMaterial(t){this._boxMesh.material=t,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(t,e,n){const i=this._boxMesh,r=this._cubeCamera;i.material=n,r.renderTarget=t,r.activeMipmapLevel=e;const a=t.width>>e;t.viewport.set(0,0,a,a),r.update(this._renderer,i),t.viewport.set(0,0,t.width,t.height)}_textureToCubemap(t){let e;t.mapping===Ws||t.mapping===Br?(this._cubemapMaterial===null&&(this._cubemapMaterial=Ih()),e=this._cubemapMaterial,e.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Nh()),e=this._equirectMaterial),e.uniforms.envMap.value=t,this._renderCube(this._getSourceTarget(),0,e)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=Kx(),this._integrationMaterial=Jx());const e=this._cubeSize,n=t.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(e/bd);for(let a=0;a<=n;a++){const o=ho.lodToRoughness(a,n);if(a>n-qx)r.roughness.value=o,this._renderCube(t,a,this._integrationMaterial);else{const l=o>0?Math.log2(e)+.5*Math.log2(6/(yd*Math.pow(o,4)))+.5:0;i.roughness.value=o,i.lodBias.value=l,this._renderCube(t,a,this._ggxMaterial)}}}_blur(t,e){this._blurMaterial===null&&(this._blurMaterial=$x());const n=this._blurMaterial,i=n.uniforms,r=this._sourceTarget;i.sigma.value=Math.min(e,Math.PI)/Math.SQRT2,i.envMap.value=r.texture,this._renderCube(t,0,n),i.envMap.value=t.texture,this._renderCube(r,0,n)}}function Lh(s,t,e){return new hu(s,{minFilter:Mi,generateMipmaps:t,type:dn,colorSpace:so,depthBuffer:e})}function na(s,t,e){return new hn({name:s,uniforms:t,vertexShader:ae.cube_vert,fragmentShader:e,side:fn,blending:ss,depthTest:!1,depthWrite:!1})}function Kx(){return na("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${yd}u

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float lodBias;

		#include <common>

		// Van der Corput radical inverse
		float radicalInverse_VdC( uint bits ) {

			bits = ( bits << 16u ) | ( bits >> 16u );
			bits = ( ( bits & 0x55555555u ) << 1u ) | ( ( bits & 0xAAAAAAAAu ) >> 1u );
			bits = ( ( bits & 0x33333333u ) << 2u ) | ( ( bits & 0xCCCCCCCCu ) >> 2u );
			bits = ( ( bits & 0x0F0F0F0Fu ) << 4u ) | ( ( bits & 0xF0F0F0F0u ) >> 4u );
			bits = ( ( bits & 0x00FF00FFu ) << 8u ) | ( ( bits & 0xFF00FF00u ) >> 8u );
			return float( bits ) * 2.3283064365386963e-10; // / 0x100000000

		}

		// Hammersley sequence
		vec2 hammersley( uint i, uint N ) {

			return vec2( float( i ) / float( N ), radicalInverse_VdC( i ) );

		}

		void main() {

			vec3 N = normalize( vWorldDirection );

			// For very low roughness, just sample the environment directly
			if ( roughness < 0.001 ) {

				gl_FragColor = vec4( textureLod( envMap, N, 0.0 ).rgb, 1.0 );
				return;

			}

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			// Tangent space basis for VNDF sampling
			vec3 up = abs( N.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, N ) );
			vec3 bitangent = cross( N, tangent );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			for ( uint i = 0u; i < GGX_SAMPLES; i ++ ) {

				vec2 Xi = hammersley( i, GGX_SAMPLES );

				// With V = N, sample the reflected direction directly.
				float invQ = 1.0 / ( 1.0 - Xi.x + alpha2 * Xi.x );
				float NdotL = ( 1.0 - Xi.x - alpha2 * Xi.x ) * invQ;

				if ( NdotL > 0.0 ) {

					float phi = 2.0 * PI * Xi.y;
					float sinTheta = 2.0 * alpha * sqrt( Xi.x * ( 1.0 - Xi.x ) ) * invQ;
					vec3 L = N * NdotL + ( tangent * cos( phi ) + bitangent * sin( phi ) ) * sinTheta;

					// Match the source mip to the sample's solid angle. The terms
					// independent of the sample are precomputed in lodBias.
					float d = alpha2 * invQ;
					float lod = max( log2( d ) + lodBias, 0.0 );

					// Weight by NdotL for the split-sum approximation
					prefilteredColor += textureLod( envMap, L, lod ).rgb * NdotL;
					totalWeight += NdotL;

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function Jx(){return na("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:bd}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float roughness;
		uniform float sourceLod;
		uniform int sourceSize;

		void main() {

			vec3 N = normalize( vWorldDirection );

			float alpha = roughness * roughness;
			float alpha2 = alpha * alpha;

			float texelSize = 2.0 / float( sourceSize );

			vec3 prefilteredColor = vec3( 0.0 );
			float totalWeight = 0.0;

			// Pair opposite texels: only the one in N's hemisphere contributes.
			for ( int face = 0; face < 3; face ++ ) {

				for ( int y = 0; y < sourceSize; y ++ ) {

					for ( int x = 0; x < sourceSize; x ++ ) {

						vec2 uv = ( vec2( x, y ) + 0.5 ) * texelSize - 1.0;
						vec3 texelDirection = face == 0 ? vec3( 1.0, uv ) : ( face == 1 ? vec3( uv.x, 1.0, uv.y ) : vec3( uv, 1.0 ) );

						float invDistance = inversesqrt( 1.0 + dot( uv, uv ) );
						float NdotL = dot( N, texelDirection );
						texelDirection *= NdotL < 0.0 ? - 1.0 : 1.0;
						NdotL = abs( NdotL ) * invDistance;

						// With V = N, NdotH squared is ( 1 + NdotL ) / 2. Common factors
						// in the GGX distribution and texel solid angle cancel when normalized.
						float d = 1.0 + alpha2 + ( alpha2 - 1.0 ) * NdotL;
						float weight = NdotL * invDistance * invDistance * invDistance / ( d * d );

						prefilteredColor += textureLod( envMap, texelDirection, sourceLod ).rgb * weight;
						totalWeight += weight;

					}

				}

			}

			gl_FragColor = vec4( prefilteredColor / totalWeight, 1.0 );

		}
	`)}function $x(){return na("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Xx}
		#define GOLDEN_ANGLE 2.39996322973

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float sigma;

		#include <common>

		void main() {

			vec3 outputDirection = normalize( vWorldDirection );

			vec3 up = abs( outputDirection.z ) < 0.999 ? vec3( 0.0, 0.0, 1.0 ) : vec3( 1.0, 0.0, 0.0 );
			vec3 tangent = normalize( cross( up, outputDirection ) );
			vec3 bitangent = cross( outputDirection, tangent );

			// Truncate the kernel at three standard deviations or at the antipode.
			float thetaMax = min( 3.0 * sigma, PI );
			float truncation = 1.0 - exp( - 0.5 * thetaMax * thetaMax / ( sigma * sigma ) );

			vec3 accumColor = vec3( 0.0 );
			float accumWeight = 0.0;

			for ( int i = 0; i < SAMPLES; i ++ ) {

				// Stratified inverse-CDF sampling of the Gaussian, placed on a golden-angle spiral.
				float stratum = ( float( i ) + 0.5 ) / float( SAMPLES );
				float theta = sigma * sqrt( - 2.0 * log( 1.0 - stratum * truncation ) );
				float phi = float( i ) * GOLDEN_ANGLE;

				vec3 offset = cos( phi ) * tangent + sin( phi ) * bitangent;
				vec3 sampleDirection = cos( theta ) * outputDirection + sin( theta ) * offset;

				// Correct the planar sample density to solid angle.
				float weight = sin( theta ) / theta;

				accumColor += weight * textureLod( envMap, sampleDirection, 0.0 ).rgb;
				accumWeight += weight;

			}

			gl_FragColor = vec4( accumColor / accumWeight, 1.0 );

		}
	`)}function Nh(){return na("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

		varying vec3 vWorldDirection;

		uniform sampler2D envMap;

		#include <common>

		void main() {

			// Average four subpixel samples to preserve small, bright features.
			vec3 direction = normalize( vWorldDirection );
			vec3 dx = dFdx( direction ) * 0.25;
			vec3 dy = dFdy( direction ) * 0.25;

			vec3 color = textureLod( envMap, equirectUv( normalize( direction - dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx - dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction - dx + dy ) ), 0.0 ).rgb;
			color += textureLod( envMap, equirectUv( normalize( direction + dx + dy ) ), 0.0 ).rgb;
			gl_FragColor = vec4( color * 0.25, 1.0 );

		}
	`)}function Ih(){return na("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Qx(s){let t=new WeakMap,e=new WeakMap,n=null;function i(h,d=!1){return h==null?null:d?a(h):r(h)}function r(h){if(h&&h.isTexture){const d=h.mapping;if(d===ko||d===Go)if(t.has(h)){const g=t.get(h).texture;return o(g,h.mapping)}else{const g=h.image;if(g&&g.height>0){const _=new hu(g.height);return _.fromEquirectangularTexture(s,h),t.set(h,_),h.addEventListener("dispose",c),o(_.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture&&h.isPMREMTexture!==!0){const d=h.mapping,g=d===ko||d===Go,_=d===Ws||d===Br;if(g||_){let p=e.get(h);const m=p!==void 0?p.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==m)return n===null&&(n=new ho(s)),p=g?n.fromEquirectangular(h,p):n.fromCubemap(h,p),p.texture.pmremVersion=h.pmremVersion,e.set(h,p),p.texture;if(p!==void 0)return p.texture;{const x=h.image;return g&&x&&x.height>0||_&&x&&l(x)?(n===null&&(n=new ho(s)),p=g?n.fromEquirectangular(h):n.fromCubemap(h),p.texture.pmremVersion=h.pmremVersion,e.set(h,p),h.addEventListener("dispose",u),p.texture):null}}}return h}function o(h,d){return d===ko?h.mapping=Ws:d===Go&&(h.mapping=Br),h}function l(h){let d=0;const g=6;for(let _=0;_<g;_++)h[_]!==void 0&&d++;return d===g}function c(h){const d=h.target;d.removeEventListener("dispose",c);const g=t.get(d);g!==void 0&&(t.delete(d),g.dispose())}function u(h){const d=h.target;d.removeEventListener("dispose",u);const g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function f(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:f}}function jx(s){const t={};function e(n){if(t[n]!==void 0)return t[n];const i=s.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&zs("WebGLRenderer: "+n+" extension not supported."),i}}}function tv(s,t,e,n){const i={},r=new WeakMap,a=new FinalizationRegistry(g=>delete i[g]);function o(g){l(g.target)}function l(g){g.index!==null&&t.remove(g.index);for(const p in g.attributes)t.remove(g.attributes[p]);g.removeEventListener("dispose",o),delete i[g.id],a.unregister(g);const _=r.get(g);_&&(t.remove(_),r.delete(g)),n.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,e.memory.geometries--}function c(g,_){return i[_.id]!==void 0||(_.addEventListener("dispose",o),i[_.id]=new WeakRef(_),a.register(_,_.id,_),e.memory.geometries++),_}function u(g){const _=g.attributes;for(const p in _)t.update(_[p],s.ARRAY_BUFFER)}function f(g){const _=g.index,p=g.attributes.position;let m=0;if(p===void 0)return;const x=_!==null?_.array.length:p.array.length/3-1,M=p.count>=65535?ed:td,S=new M(Math.ceil(x/3)*6,1),b=S.array;if(_!==null){const v=_.array;m=_.version;for(let y=0,C=0;y<x;y+=3){const R=v[y+0],L=v[y+1],U=v[y+2];b[C++]=R,b[C++]=L,b[C++]=L,b[C++]=U,b[C++]=U,b[C++]=R}}else{m=p.version;for(let v=0,y=0;v<x;v+=3){const C=v+0,R=v+1,L=v+2;b[y++]=C,b[y++]=R,b[y++]=R,b[y++]=L,b[y++]=L,b[y++]=C}}S.version=m;const E=r.get(g);E&&t.remove(E),r.set(g,S)}function h(g){const _=r.get(g);if(_){const p=g.index;p!==null&&_.version<p.version&&f(g)}else f(g);return r.get(g)}function d(){for(const g in i){const _=i[g].deref();_!==void 0&&l(_)}}return{get:c,update:u,getWireframeAttribute:h,dispose:d}}function ev(s,t,e){let n;function i(f){n=f}let r,a;function o(f){r=f.type,a=f.bytesPerElement}function l(f,h){s.drawElements(n,h,r,f*a),e.update(h,n,1)}function c(f,h,d){d!==0&&(s.drawElementsInstanced(n,h,r,f*a,d),e.update(h,n,d))}function u(f,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,f,0,d);let _=0;for(let p=0;p<d;p++)_+=h[p];e.update(_,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function nv(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:he("WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function iv(s,t,e){const n=new WeakMap,i=new Pe;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,f=u!==void 0?u.length:0;let h=n.get(o);if(h===void 0||h.count!==f){let C=function(){v.dispose(),n.delete(o),o.removeEventListener("dispose",C)};h!==void 0&&h.texture.dispose();const d=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,_=o.morphAttributes.color!==void 0,p=o.morphAttributes.position||[],m=o.morphAttributes.normal||[],x=o.morphAttributes.color||[];let M=0;d===!0&&(M=1),g===!0&&(M=2),_===!0&&(M=3);let S=o.attributes.position.count*M,b=1;S>t.maxTextureSize&&(b=Math.ceil(S/t.maxTextureSize),S=t.maxTextureSize);const E=new Float32Array(S*b*4*f),v=new Qf(E,S,b,f);v.type=Yn,v.needsUpdate=!0;const y=M*4;for(let R=0;R<f;R++){const L=p[R],U=m[R],B=x[R],w=S*b*4*R;for(let I=0;I<L.count;I++){const D=I*y;d===!0&&(i.fromBufferAttribute(L,I),E[w+D+0]=i.x,E[w+D+1]=i.y,E[w+D+2]=i.z,E[w+D+3]=0),g===!0&&(i.fromBufferAttribute(U,I),E[w+D+4]=i.x,E[w+D+5]=i.y,E[w+D+6]=i.z,E[w+D+7]=0),_===!0&&(i.fromBufferAttribute(B,I),E[w+D+8]=i.x,E[w+D+9]=i.y,E[w+D+10]=i.z,E[w+D+11]=B.itemSize===4?i.w:1)}}h={count:f,texture:v,size:new ct(S,b)},n.set(o,h),o.addEventListener("dispose",C)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let d=0;for(let _=0;_<c.length;_++)d+=c[_];const g=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(s,"morphTargetBaseInfluence",g),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",h.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",h.size)}return{update:r}}function sv(s,t,e,n,i){let r=new WeakMap;function a(c){const u=i.render.frame,f=c.geometry,h=t.get(c,f);if(r.get(h)!==u&&(t.update(h),r.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==u&&(d.update(),r.set(d,u))}return h}function o(){r=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),e.remove(u.instanceMatrix),u.instanceColor!==null&&e.remove(u.instanceColor)}return{update:a,dispose:o}}const rv={[Fc]:"LINEAR_TONE_MAPPING",[Bc]:"REINHARD_TONE_MAPPING",[zc]:"CINEON_TONE_MAPPING",[wo]:"ACES_FILMIC_TONE_MAPPING",[Gc]:"AGX_TONE_MAPPING",[Hc]:"NEUTRAL_TONE_MAPPING",[kc]:"CUSTOM_TONE_MAPPING"};function av(s,t,e,n,i,r){const a=new pn(t,e,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,c=null;const u=new Ze;u.setAttribute("position",new me([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute("uv",new me([0,2,0,0,2,0],2));const f=new gd({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),h=new vn(u,f),d=new Po(-1,1,1,-1,0,1);let g=null,_=null,p=!1,m,x=null,M=[],S=!1;this.setSize=function(b,E){a.setSize(b,E),o!==null&&o.setSize(b,E),l!==null&&l.setSize(b,E);for(let v=0;v<M.length;v++){const y=M[v];y.setSize&&y.setSize(b,E)}},this.setEffects=function(b){M=b,S=M.length>0&&M[0].isRenderPass===!0;const E=a.width,v=a.height;M.length>0&&o===null&&(o=new pn(E,v,{type:dn,depthBuffer:!1,stencilBuffer:!1}),l=new pn(E,v,{type:dn,depthBuffer:!1,stencilBuffer:!1}));const y=i===!0&&M.some(C=>C.needsDepthTexture===!0);y!==(a.depthTexture!==null)&&(y===!0&&c===null&&(c=new qs(E,v),r===!0&&(c.format=Ii,c.type=Xs)),a.dispose(),a.depthTexture=y?c:null,a.resolveDepthBuffer=y,a.storeMultisampledDepthBuffer=y);for(let C=0;C<M.length;C++){const R=M[C];R.setSize&&R.setSize(E,v),y&&R.needsDepthTexture===!0&&R.setDepthTexture&&R.setDepthTexture(c)}},this.begin=function(b,E){if(p||b.toneMapping===yi&&M.length===0)return!1;if(x=E,E!==null){const v=E.width,y=E.height;(a.width!==v||a.height!==y)&&this.setSize(v,y)}return S===!1&&b.setRenderTarget(a),m=b.toneMapping,b.toneMapping=yi,!0},this.hasRenderPass=function(){return S},this.end=function(b,E){b.toneMapping=m,p=!0;let v=a,y=o;for(let C=0;C<M.length;C++){const R=M[C];R.enabled!==!1&&(R.render(b,y,v,E),R.needsSwap!==!1&&(v=y,y=y===o?l:o))}if(g!==b.outputColorSpace||_!==b.toneMapping){g=b.outputColorSpace,_=b.toneMapping,f.defines={},oe.getTransfer(g)===pe&&(f.defines.SRGB_TRANSFER="");const C=rv[_];C&&(f.defines[C]=""),f.needsUpdate=!0}f.uniforms.tDiffuse.value=v.texture,b.setRenderTarget(x),b.render(h,d),x=null,p=!1},this.isCompositing=function(){return p},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),u.dispose(),f.dispose()}}const Ed=new nn,Td=new qs(1,1),wd=new id(1),Ad=new Qf,Rd=new Wm,Cd=new nd,Uh=[],Oh=[],Fh=new Float32Array(16),Bh=new Float32Array(9),zh=new Float32Array(4);function sr(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=Uh[i];if(r===void 0&&(r=new Float32Array(i),Uh[i]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function We(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function Xe(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Do(s,t){let e=Oh[t];e===void 0&&(e=new Int32Array(t),Oh[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function ov(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function lv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;s.uniform2fv(this.addr,t),Xe(e,t)}}function cv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(We(e,t))return;s.uniform3fv(this.addr,t),Xe(e,t)}}function uv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;s.uniform4fv(this.addr,t),Xe(e,t)}}function hv(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(We(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,n))return;zh.set(n),s.uniformMatrix2fv(this.addr,!1,zh),Xe(e,n)}}function fv(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(We(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,n))return;Bh.set(n),s.uniformMatrix3fv(this.addr,!1,Bh),Xe(e,n)}}function dv(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(We(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),Xe(e,t)}else{if(We(e,n))return;Fh.set(n),s.uniformMatrix4fv(this.addr,!1,Fh),Xe(e,n)}}function pv(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function mv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;s.uniform2iv(this.addr,t),Xe(e,t)}}function _v(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(We(e,t))return;s.uniform3iv(this.addr,t),Xe(e,t)}}function gv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;s.uniform4iv(this.addr,t),Xe(e,t)}}function xv(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function vv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(We(e,t))return;s.uniform2uiv(this.addr,t),Xe(e,t)}}function Mv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(We(e,t))return;s.uniform3uiv(this.addr,t),Xe(e,t)}}function Sv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(We(e,t))return;s.uniform4uiv(this.addr,t),Xe(e,t)}}function Lo(s){return s.version===0&&(s.compareFunction=Yf,s.needsUpdate=!0),s}function yv(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?r=Lo(Td):r=Ed,e.setTexture2D(t||r,i)}function bv(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Rd,i)}function Ev(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_CUBE_SHADOW?r=Lo(wd):r=Cd,e.setTextureCube(t||r,i)}function Tv(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Ad,i)}function wv(s){switch(s){case 5126:return ov;case 35664:return lv;case 35665:return cv;case 35666:return uv;case 35674:return hv;case 35675:return fv;case 35676:return dv;case 5124:case 35670:return pv;case 35667:case 35671:return mv;case 35668:case 35672:return _v;case 35669:case 35673:return gv;case 5125:return xv;case 36294:return vv;case 36295:return Mv;case 36296:return Sv;case 35678:case 36198:case 36298:case 36306:case 35682:return yv;case 35679:case 36299:case 36307:return bv;case 35680:case 36300:case 36308:case 36293:return Ev;case 36289:case 36303:case 36311:case 36292:return Tv}}function Av(s,t){s.uniform1fv(this.addr,t)}function Rv(s,t){const e=sr(t,this.size,2);s.uniform2fv(this.addr,e)}function Cv(s,t){const e=sr(t,this.size,3);s.uniform3fv(this.addr,e)}function Pv(s,t){const e=sr(t,this.size,4);s.uniform4fv(this.addr,e)}function Dv(s,t){const e=sr(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Lv(s,t){const e=sr(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Nv(s,t){const e=sr(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Iv(s,t){s.uniform1iv(this.addr,t)}function Uv(s,t){s.uniform2iv(this.addr,t)}function Ov(s,t){s.uniform3iv(this.addr,t)}function Fv(s,t){s.uniform4iv(this.addr,t)}function Bv(s,t){s.uniform1uiv(this.addr,t)}function zv(s,t){s.uniform2uiv(this.addr,t)}function kv(s,t){s.uniform3uiv(this.addr,t)}function Gv(s,t){s.uniform4uiv(this.addr,t)}function Hv(s,t,e){const n=this.cache,i=t.length,r=Do(e,i);We(n,r)||(s.uniform1iv(this.addr,r),Xe(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=Lo(Td):a=Ed;for(let o=0;o!==i;++o)e.setTexture2D(t[o]||a,r[o])}function Vv(s,t,e){const n=this.cache,i=t.length,r=Do(e,i);We(n,r)||(s.uniform1iv(this.addr,r),Xe(n,r));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||Rd,r[a])}function Wv(s,t,e){const n=this.cache,i=t.length,r=Do(e,i);We(n,r)||(s.uniform1iv(this.addr,r),Xe(n,r));let a;this.type===s.SAMPLER_CUBE_SHADOW?a=Lo(wd):a=Cd;for(let o=0;o!==i;++o)e.setTextureCube(t[o]||a,r[o])}function Xv(s,t,e){const n=this.cache,i=t.length,r=Do(e,i);We(n,r)||(s.uniform1iv(this.addr,r),Xe(n,r));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||Ad,r[a])}function qv(s){switch(s){case 5126:return Av;case 35664:return Rv;case 35665:return Cv;case 35666:return Pv;case 35674:return Dv;case 35675:return Lv;case 35676:return Nv;case 5124:case 35670:return Iv;case 35667:case 35671:return Uv;case 35668:case 35672:return Ov;case 35669:case 35673:return Fv;case 5125:return Bv;case 36294:return zv;case 36295:return kv;case 36296:return Gv;case 35678:case 36198:case 36298:case 36306:case 35682:return Hv;case 35679:case 36299:case 36307:return Vv;case 35680:case 36300:case 36308:case 36293:return Wv;case 36289:case 36303:case 36311:case 36292:return Xv}}class Yv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=wv(e.type)}}class Zv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=qv(e.type)}}class Kv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(t,e[o.id],n)}}}const ml=/(\w+)(\])?(\[|\.)?/g;function kh(s,t){s.seq.push(t),s.map[t.id]=t}function Jv(s,t,e){const n=s.name,i=n.length;for(ml.lastIndex=0;;){const r=ml.exec(n),a=ml.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){kh(e,c===void 0?new Yv(o,s,t):new Zv(o,s,t));break}else{let f=e.map[o];f===void 0&&(f=new Kv(o),kh(e,f)),e=f}}}class Ka{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);Jv(o,l,this)}const i=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const a=t[i];a.id in e&&n.push(a)}return n}}function Gh(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const $v=37297;let Qv=0;function jv(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Hh=new Kt;function tM(s){oe._getMatrix(Hh,oe.workingColorSpace,s);const t=`mat3( ${Hh.elements.map(e=>e.toFixed(4))} )`;switch(oe.getTransfer(s)){case ro:return[t,"LinearTransferOETF"];case pe:return[t,"sRGBTransferOETF"];default:return Yt("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Vh(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+jv(s.getShaderSource(t),o)}else return r}function eM(s,t){const e=tM(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( ${e[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const nM={[Fc]:"Linear",[Bc]:"Reinhard",[zc]:"Cineon",[wo]:"ACESFilmic",[Gc]:"AgX",[Hc]:"Neutral",[kc]:"Custom"};function iM(s,t){const e=nM[t];return e===void 0?(Yt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const za=new N;function sM(){oe.getLuminanceCoefficients(za);const s=za.x.toFixed(4),t=za.y.toFixed(4),e=za.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function rM(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(wr).join(`
`)}function aM(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function oM(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function wr(s){return s!==""}function Wh(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function Xh(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const lM=/^[ \t]*#include +<([\w\d./]+)>/gm;function Mc(s){return s.replace(lM,cM)}function cM(s,t){const e=ae[t];if(e===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return Mc(e)}const uM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function qh(s){return s.replace(uM,hM)}function hM(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Yh(s){let t=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?t+=`
#define HIGH_PRECISION`:s.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const fM={[Va]:"SHADOWMAP_TYPE_PCF",[Er]:"SHADOWMAP_TYPE_VSM"};function dM(s){return fM[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const pM={[Br]:"ENVMAP_MODE_REFRACTION"};function mM(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":pM[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const _M={[Ff]:"ENVMAP_BLENDING_MULTIPLY",[lm]:"ENVMAP_BLENDING_MIX",[cm]:"ENVMAP_BLENDING_ADD"};function gM(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":_M[s.combine]||"ENVMAP_BLENDING_NONE"}function xM(s,t,e,n){const i=s.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=dM(e),c=e.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",u=mM(e),f=gM(e),h=rM(e),d=aM(r),g=i.createProgram();let _,p,m=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(_=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,d].filter(wr).join(`
`),_.length>0&&(_+=`
`),p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,d].filter(wr).join(`
`),p.length>0&&(p+=`
`)):(_=[Yh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,d,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+e.diffuseRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(wr).join(`
`),p=[Yh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,d,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+f:"",e.envMapPMREM?"#define ENVMAP_MAX_LOD "+e.envMapMaxLod+".0":"",e.envMapPMREM?"#define ENVMAP_SIZE "+e.envMapSize+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==yi?"#define TONE_MAPPING":"",e.toneMapping!==yi?ae.tonemapping_pars_fragment:"",e.toneMapping!==yi?iM("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ae.colorspace_pars_fragment,eM("linearToOutputTexel",e.outputColorSpace),sM(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(wr).join(`
`)),a=Mc(a),a=Wh(a,e),a=Xh(a,e),o=Mc(o),o=Wh(o,e),o=Xh(o,e),a=qh(a),o=qh(o),e.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,_=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+_,p=["#define varying in",e.glslVersion===Wu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Wu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);const x=m+_+a,M=m+p+o,S=Gh(i,i.VERTEX_SHADER,x),b=Gh(i,i.FRAGMENT_SHADER,M);i.attachShader(g,S),i.attachShader(g,b),e.index0AttributeName!==void 0?i.bindAttribLocation(g,0,e.index0AttributeName):e.hasPositionAttribute===!0&&i.bindAttribLocation(g,0,"position"),i.linkProgram(g);function E(R){if(s.debug.checkShaderErrors){const L=i.getProgramInfoLog(g)||"",U=i.getShaderInfoLog(S)||"",B=i.getShaderInfoLog(b)||"",w=L.trim(),I=U.trim(),D=B.trim();let O=!0,H=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1)if(O=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,g,S,b);else{const z=Vh(i,S,"vertex"),V=Vh(i,b,"fragment");he("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+w+`
`+z+`
`+V)}else w!==""?Yt("WebGLProgram: Program Info Log:",w):(I===""||D==="")&&(H=!1);H&&(R.diagnostics={runnable:O,programLog:w,vertexShader:{log:I,prefix:_},fragmentShader:{log:D,prefix:p}})}i.deleteShader(S),i.deleteShader(b),v=new Ka(i,g),y=oM(i,g)}let v;this.getUniforms=function(){return v===void 0&&E(this),v};let y;this.getAttributes=function(){return y===void 0&&E(this),y};let C=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return C===!1&&(C=i.getProgramParameter(g,$v)),C},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Qv++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=S,this.fragmentShader=b,this}let vM=0;class MM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){const i=this._getShaderCacheForMaterial(t);return i.has(e)===!1&&(i.add(e),e.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new SM(t),e.set(t,n)),n}}class SM{constructor(t){this.id=vM++,this.code=t,this.usedTimes=0}}function yM(s){return s===us||s===no||s===io}function bM(s,t,e,n,i,r){const a=new jc,o=new MM,l=new Set,c=[],u=new Map,f=n.logarithmicDepthBuffer,h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(v){return l.add(v),v===0?"uv":`uv${v}`}function g(v,y,C,R,L,U){const B=R.fog,w=L.geometry,I=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?R.environment:null,D=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,O=t.get(v.envMap||I,D),H=h[v.type];let z=n.precision;v.precision!==null&&(z=n.getMaxPrecision(v.precision),z!==v.precision&&Yt("WebGLProgram.getParameters:",v.precision,"not supported, using",z,"instead."));const V=w.morphAttributes.position||w.morphAttributes.normal||w.morphAttributes.color,Y=V!==void 0?V.length:0;let ut=0;w.morphAttributes.position!==void 0&&(ut=1),w.morphAttributes.normal!==void 0&&(ut=2),w.morphAttributes.color!==void 0&&(ut=3);let At,K,lt,wt;if(H){const gt=ni[H];At=gt.vertexShader,K=gt.fragmentShader}else{At=v.vertexShader,K=v.fragmentShader;const gt=o.getVertexShaderStage(v),ue=o.getFragmentShaderStage(v);o.update(v,gt,ue),lt=gt.id,wt=ue.id}const Nt=s.getRenderTarget(),st=s.state.buffers.depth.getReversed(),bt=L.isInstancedMesh===!0,Ht=L.isBatchedMesh===!0,Lt=!!v.map,Vt=!!v.matcap,Ft=!!O,it=Ft&&O.isPMREMTexture===!0,dt=!!v.aoMap,at=!!v.lightMap,Rt=!!v.bumpMap&&v.wireframe===!1,xt=!!v.normalMap,kt=!!v.displacementMap,Pt=!!v.emissiveMap,Jt=!!v.metalnessMap,Zt=!!v.roughnessMap,$t=v.anisotropy>0,G=v.clearcoat>0,ye=v.diffuseRoughness>0,se=v.dispersion>0,_e=v.retroreflectivity>0,Et=v.iridescence>0,fe=v.sheen>0,zt=v.transmission>0,qt=$t&&!!v.anisotropyMap,P=G&&!!v.clearcoatMap,T=G&&!!v.clearcoatNormalMap,X=G&&!!v.clearcoatRoughnessMap,pt=ye&&!!v.diffuseRoughnessMap,rt=Et&&!!v.iridescenceMap,Mt=Et&&!!v.iridescenceThicknessMap,Tt=fe&&!!v.sheenColorMap,j=fe&&!!v.sheenRoughnessMap,tt=!!v.specularMap,St=!!v.specularColorMap,F=!!v.specularIntensityMap,nt=zt&&!!v.transmissionMap,Q=zt&&!!v.thicknessMap,yt=!!v.gradientMap,_t=!!v.alphaMap,vt=v.alphaTest>0,Bt=!!v.alphaHash,Qt=!!v.extensions;let ht=yi;v.toneMapped&&(Nt===null||Nt.isXRRenderTarget===!0)&&(ht=s.toneMapping);const Gt=it?O.isCompressedCubeTexture?O.image[0].mipmaps:O.mipmaps:null,jt={shaderID:H,shaderType:v.type,shaderName:v.name,vertexShader:At,fragmentShader:K,defines:v.defines,customVertexShaderID:lt,customFragmentShaderID:wt,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:z,batching:Ht,batchingColor:Ht&&L._colorsTexture!==null,instancing:bt,instancingColor:bt&&L.instanceColor!==null,instancingMorph:bt&&L.morphTexture!==null,outputColorSpace:Nt===null?s.outputColorSpace:Nt.isXRRenderTarget===!0?Nt.texture.colorSpace:oe.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:Lt,matcap:Vt,envMap:Ft,envMapMode:Ft&&O.mapping,envMapPMREM:it,envMapMaxLod:it?Gt.length-1:null,envMapSize:it?Gt[0].width:null,aoMap:dt,lightMap:at,bumpMap:Rt,normalMap:xt,displacementMap:kt,emissiveMap:Pt,normalMapObjectSpace:xt&&v.normalMapType===fm,normalMapTangentSpace:xt&&v.normalMapType===dc,packedNormalMap:xt&&v.normalMapType===dc&&yM(v.normalMap.format),metalnessMap:Jt,roughnessMap:Zt,anisotropy:$t,anisotropyMap:qt,clearcoat:G,clearcoatMap:P,clearcoatNormalMap:T,clearcoatRoughnessMap:X,diffuseRoughness:ye,diffuseRoughnessMap:pt,dispersion:se,retroreflection:_e,iridescence:Et,iridescenceMap:rt,iridescenceThicknessMap:Mt,sheen:fe,sheenColorMap:Tt,sheenRoughnessMap:j,specularMap:tt,specularColorMap:St,specularIntensityMap:F,transmission:zt,transmissionMap:nt,thicknessMap:Q,gradientMap:yt,opaque:v.transparent===!1&&v.blending===Cr&&v.alphaToCoverage===!1,alphaMap:_t,alphaTest:vt,alphaHash:Bt,combine:v.combine,mapUv:Lt&&d(v.map.channel),aoMapUv:dt&&d(v.aoMap.channel),lightMapUv:at&&d(v.lightMap.channel),bumpMapUv:Rt&&d(v.bumpMap.channel),normalMapUv:xt&&d(v.normalMap.channel),displacementMapUv:kt&&d(v.displacementMap.channel),emissiveMapUv:Pt&&d(v.emissiveMap.channel),metalnessMapUv:Jt&&d(v.metalnessMap.channel),roughnessMapUv:Zt&&d(v.roughnessMap.channel),anisotropyMapUv:qt&&d(v.anisotropyMap.channel),clearcoatMapUv:P&&d(v.clearcoatMap.channel),clearcoatNormalMapUv:T&&d(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:X&&d(v.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:pt&&d(v.diffuseRoughnessMap.channel),iridescenceMapUv:rt&&d(v.iridescenceMap.channel),iridescenceThicknessMapUv:Mt&&d(v.iridescenceThicknessMap.channel),sheenColorMapUv:Tt&&d(v.sheenColorMap.channel),sheenRoughnessMapUv:j&&d(v.sheenRoughnessMap.channel),specularMapUv:tt&&d(v.specularMap.channel),specularColorMapUv:St&&d(v.specularColorMap.channel),specularIntensityMapUv:F&&d(v.specularIntensityMap.channel),transmissionMapUv:nt&&d(v.transmissionMap.channel),thicknessMapUv:Q&&d(v.thicknessMap.channel),alphaMapUv:_t&&d(v.alphaMap.channel),vertexTangents:!!w.attributes.tangent&&(xt||$t),vertexNormals:!!w.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!w.attributes.color&&w.attributes.color.itemSize===4,pointsUvs:L.isPoints===!0&&!!w.attributes.uv&&(Lt||_t),fog:!!B,useFog:v.fog===!0,fogExp2:!!B&&B.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||w.attributes.normal===void 0&&xt===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:f,reversedDepthBuffer:st,skinning:L.isSkinnedMesh===!0,hasPositionAttribute:w.attributes.position!==void 0,morphTargets:w.morphAttributes.position!==void 0,morphNormals:w.morphAttributes.normal!==void 0,morphColors:w.morphAttributes.color!==void 0,morphTargetsCount:Y,morphTextureStride:ut,numSunLights:y.sun.length,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numSunLightShadows:y.sunShadowMap.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numLightProbeGrids:U.filter(gt=>gt.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:v.dithering,shadowMapEnabled:s.shadowMap.enabled&&C.length>0,shadowMapType:s.shadowMap.type,toneMapping:ht,decodeVideoTexture:Lt&&v.map.isVideoTexture===!0&&oe.getTransfer(v.map.colorSpace)===pe,decodeVideoTextureEmissive:Pt&&v.emissiveMap.isVideoTexture===!0&&oe.getTransfer(v.emissiveMap.colorSpace)===pe,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===Xn,flipSided:v.side===fn,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:Qt&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(Qt&&v.extensions.multiDraw===!0||Ht)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return jt.vertexUv1s=l.has(1),jt.vertexUv2s=l.has(2),jt.vertexUv3s=l.has(3),l.clear(),jt}function _(v){const y=[];if(v.shaderID?y.push(v.shaderID):(y.push(v.customVertexShaderID),y.push(v.customFragmentShaderID)),v.defines!==void 0)for(const C in v.defines)y.push(C),y.push(v.defines[C]);return v.isRawShaderMaterial===!1&&(p(y,v),m(y,v),y.push(s.outputColorSpace)),y.push(v.customProgramCacheKey),y.join()}function p(v,y){v.push(y.precision),v.push(y.outputColorSpace),v.push(y.envMapMode),v.push(y.envMapPMREM),v.push(y.envMapMaxLod),v.push(y.envMapSize),v.push(y.mapUv),v.push(y.alphaMapUv),v.push(y.lightMapUv),v.push(y.aoMapUv),v.push(y.bumpMapUv),v.push(y.normalMapUv),v.push(y.displacementMapUv),v.push(y.emissiveMapUv),v.push(y.metalnessMapUv),v.push(y.roughnessMapUv),v.push(y.anisotropyMapUv),v.push(y.clearcoatMapUv),v.push(y.clearcoatNormalMapUv),v.push(y.clearcoatRoughnessMapUv),v.push(y.diffuseRoughnessMapUv),v.push(y.iridescenceMapUv),v.push(y.iridescenceThicknessMapUv),v.push(y.sheenColorMapUv),v.push(y.sheenRoughnessMapUv),v.push(y.specularMapUv),v.push(y.specularColorMapUv),v.push(y.specularIntensityMapUv),v.push(y.transmissionMapUv),v.push(y.thicknessMapUv),v.push(y.combine),v.push(y.fogExp2),v.push(y.sizeAttenuation),v.push(y.morphTargetsCount),v.push(y.numSunLights),v.push(y.numDirLights),v.push(y.numPointLights),v.push(y.numSpotLights),v.push(y.numSpotLightMaps),v.push(y.numHemiLights),v.push(y.numRectAreaLights),v.push(y.numSunLightShadows),v.push(y.numDirLightShadows),v.push(y.numPointLightShadows),v.push(y.numSpotLightShadows),v.push(y.numSpotLightShadowsWithMaps),v.push(y.numLightProbes),v.push(y.numLightProbeGrids),v.push(y.shadowMapType),v.push(y.toneMapping),v.push(y.numClippingPlanes),v.push(y.numClipIntersection),v.push(y.depthPacking)}function m(v,y){a.disableAll(),y.instancing&&a.enable(0),y.instancingColor&&a.enable(1),y.instancingMorph&&a.enable(2),y.matcap&&a.enable(3),y.envMap&&a.enable(4),y.normalMapObjectSpace&&a.enable(5),y.normalMapTangentSpace&&a.enable(6),y.clearcoat&&a.enable(7),y.iridescence&&a.enable(8),y.alphaTest&&a.enable(9),y.vertexColors&&a.enable(10),y.vertexAlphas&&a.enable(11),y.vertexUv1s&&a.enable(12),y.vertexUv2s&&a.enable(13),y.vertexUv3s&&a.enable(14),y.vertexTangents&&a.enable(15),y.anisotropy&&a.enable(16),y.alphaHash&&a.enable(17),y.batching&&a.enable(18),y.dispersion&&a.enable(19),y.retroreflection&&a.enable(24),y.diffuseRoughness&&a.enable(25),y.batchingColor&&a.enable(20),y.gradientMap&&a.enable(21),y.packedNormalMap&&a.enable(22),y.vertexNormals&&a.enable(23),v.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),y.numLightProbeGrids>0&&a.enable(22),y.hasPositionAttribute&&a.enable(23),v.push(a.mask)}function x(v){const y=h[v.type];let C;if(y){const R=ni[y];C=qr.clone(R.uniforms)}else C=v.uniforms;return C}function M(v,y){let C=u.get(y);return C!==void 0?++C.usedTimes:(C=new xM(s,y,v,i),c.push(C),u.set(y,C)),C}function S(v){if(--v.usedTimes===0){const y=c.indexOf(v);c[y]=c[c.length-1],c.pop(),u.delete(v.cacheKey),v.destroy()}}function b(v){o.remove(v)}function E(){o.dispose()}return{getParameters:g,getProgramCacheKey:_,getUniforms:x,acquireProgram:M,releaseProgram:S,releaseShaderCache:b,programs:c,dispose:E}}function EM(){let s=new WeakMap;function t(a){return s.has(a)}function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function TM(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function Zh(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Kh(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function a(h){let d=0;return h.isInstancedMesh&&(d+=2),h.isSkinnedMesh&&(d+=1),d}function o(h,d,g,_,p,m){let x=s[t];return x===void 0?(x={id:h.id,object:h,geometry:d,material:g,materialVariant:a(h),groupOrder:_,renderOrder:h.renderOrder,z:p,group:m},s[t]=x):(x.id=h.id,x.object=h,x.geometry=d,x.material=g,x.materialVariant=a(h),x.groupOrder=_,x.renderOrder=h.renderOrder,x.z=p,x.group=m),t++,x}function l(h,d,g,_,p,m,x){x.reversedDepth===!0&&(p=-p);const M=o(h,d,g,_,p,m);g.transmission>0?n.push(M):g.transparent===!0?i.push(M):e.push(M)}function c(h,d,g,_,p,m){const x=o(h,d,g,_,p,m);g.transmission>0?n.unshift(x):g.transparent===!0?i.unshift(x):e.unshift(x)}function u(h,d){e.length>1&&e.sort(h||TM),n.length>1&&n.sort(d||Zh),i.length>1&&i.sort(d||Zh)}function f(){for(let h=t,d=s.length;h<d;h++){const g=s[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:f,sort:u}}function wM(){let s=new WeakMap;function t(n,i){const r=s.get(n);let a;return r===void 0?(a=new Kh,s.set(n,[a])):i>=r.length?(a=new Kh,r.push(a)):a=r[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function AM(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new N,color:new Wt};break;case"SpotLight":e={position:new N,direction:new N,color:new Wt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new N,color:new Wt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new N,skyColor:new Wt,groundColor:new Wt};break;case"RectAreaLight":e={color:new Wt,position:new N,halfWidth:new N,halfHeight:new N};break}return s[t.id]=e,e}}}function RM(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ct};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ct};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ct,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let CM=0;function PM(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function DM(s){const t=new AM,e=RM(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new N);const i=new N,r=new le,a=new le;function o(c){let u=0,f=0,h=0;for(let U=0;U<9;U++)n.probe[U].set(0,0,0);let d=0,g=0,_=0,p=0,m=0,x=0,M=0,S=0,b=0,E=0,v=0,y=0,C=0,R=0;c.sort(PM);for(let U=0,B=c.length;U<B;U++){const w=c[U],I=w.color,D=w.intensity,O=w.distance;let H=null;if(w.shadow&&w.shadow.map&&(w.shadow.map.texture.format===us?H=w.shadow.map.texture:H=w.shadow.map.depthTexture||w.shadow.map.texture),w.isAmbientLight)u+=I.r*D,f+=I.g*D,h+=I.b*D;else if(w.isLightProbe){for(let z=0;z<9;z++)n.probe[z].addScaledVector(w.sh.coefficients[z],D);R++}else if(w.isSunLight){const z=t.get(w);if(z.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const V=w.shadow,Y=e.get(w);Y.shadowIntensity=V.intensity,Y.shadowBias=V.bias,Y.shadowNormalBias=V.normalBias,Y.shadowRadius=V.radius,Y.shadowMapSize.copy(V.mapSize).multiply(V.getFrameExtents()),n.sunShadow[g]=Y,n.sunShadowMap[g]=H;const ut=V.getViewportCount();for(let At=0;At<ut;At++)n.sunShadowMatrix[_+At]=V.getMatrix(At),n.sunShadowCascade[_+At]=V._cascadeData[At];_+=ut,g++}n.sun[d]=z,d++}else if(w.isDirectionalLight){const z=t.get(w);if(z.color.copy(w.color).multiplyScalar(w.intensity),w.castShadow){const V=w.shadow,Y=e.get(w);Y.shadowIntensity=V.intensity,Y.shadowBias=V.bias,Y.shadowNormalBias=V.normalBias,Y.shadowRadius=V.radius,Y.shadowMapSize=V.mapSize,n.directionalShadow[p]=Y,n.directionalShadowMap[p]=H,n.directionalShadowMatrix[p]=w.shadow.matrix,b++}n.directional[p]=z,p++}else if(w.isSpotLight){const z=t.get(w);z.position.setFromMatrixPosition(w.matrixWorld),z.color.copy(I).multiplyScalar(D),z.distance=O,z.coneCos=Math.cos(w.angle),z.penumbraCos=Math.cos(w.angle*(1-w.penumbra)),z.decay=w.decay,n.spot[x]=z;const V=w.shadow;if(w.map&&(n.spotLightMap[y]=w.map,y++,V.updateMatrices(w),w.castShadow&&C++),n.spotLightMatrix[x]=V.matrix,w.castShadow){const Y=e.get(w);Y.shadowIntensity=V.intensity,Y.shadowBias=V.bias,Y.shadowNormalBias=V.normalBias,Y.shadowRadius=V.radius,Y.shadowMapSize=V.mapSize,n.spotShadow[x]=Y,n.spotShadowMap[x]=H,v++}x++}else if(w.isRectAreaLight){const z=t.get(w);z.color.copy(I).multiplyScalar(D),z.halfWidth.set(w.width*.5,0,0),z.halfHeight.set(0,w.height*.5,0),n.rectArea[M]=z,M++}else if(w.isPointLight){const z=t.get(w);if(z.color.copy(w.color).multiplyScalar(w.intensity),z.distance=w.distance,z.decay=w.decay,w.castShadow){const V=w.shadow,Y=e.get(w);Y.shadowIntensity=V.intensity,Y.shadowBias=V.bias,Y.shadowNormalBias=V.normalBias,Y.shadowRadius=V.radius,Y.shadowMapSize=V.mapSize,Y.shadowCameraNear=V.camera.near,Y.shadowCameraFar=V.camera.far,n.pointShadow[m]=Y,n.pointShadowMap[m]=H,n.pointShadowMatrix[m]=w.shadow.matrix,E++}n.point[m]=z,m++}else if(w.isHemisphereLight){const z=t.get(w);z.skyColor.copy(w.color).multiplyScalar(D),z.groundColor.copy(w.groundColor).multiplyScalar(D),n.hemi[S]=z,S++}}M>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=Ct.LTC_FLOAT_1,n.rectAreaLTC2=Ct.LTC_FLOAT_2):(n.rectAreaLTC1=Ct.LTC_HALF_1,n.rectAreaLTC2=Ct.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=f,n.ambient[2]=h;const L=n.hash;(L.sunLength!==d||L.directionalLength!==p||L.pointLength!==m||L.spotLength!==x||L.rectAreaLength!==M||L.hemiLength!==S||L.numSunShadows!==g||L.numDirectionalShadows!==b||L.numPointShadows!==E||L.numSpotShadows!==v||L.numSpotMaps!==y||L.numLightProbes!==R)&&(n.sun.length=d,n.directional.length=p,n.spot.length=x,n.rectArea.length=M,n.point.length=m,n.hemi.length=S,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=_,n.sunShadowCascade.length=_,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.directionalShadowMatrix.length=b,n.pointShadow.length=E,n.pointShadowMap.length=E,n.pointShadowMatrix.length=E,n.spotShadow.length=v,n.spotShadowMap.length=v,n.spotLightMatrix.length=v+y-C,n.spotLightMap.length=y,n.numSpotLightShadowsWithMaps=C,n.numLightProbes=R,L.sunLength=d,L.directionalLength=p,L.pointLength=m,L.spotLength=x,L.rectAreaLength=M,L.hemiLength=S,L.numSunShadows=g,L.numDirectionalShadows=b,L.numPointShadows=E,L.numSpotShadows=v,L.numSpotMaps=y,L.numLightProbes=R,n.version=CM++)}function l(c,u){let f=0,h=0,d=0,g=0,_=0,p=0;const m=u.matrixWorldInverse;for(let x=0,M=c.length;x<M;x++){const S=c[x];if(S.isSunLight){const b=n.sun[f];b.direction.setFromMatrixPosition(S.matrixWorld),b.direction.transformDirection(m),f++}else if(S.isDirectionalLight){const b=n.directional[h];b.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(m),h++}else if(S.isSpotLight){const b=n.spot[g];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(m),b.direction.setFromMatrixPosition(S.matrixWorld),i.setFromMatrixPosition(S.target.matrixWorld),b.direction.sub(i),b.direction.transformDirection(m),g++}else if(S.isRectAreaLight){const b=n.rectArea[_];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(m),a.identity(),r.copy(S.matrixWorld),r.premultiply(m),a.extractRotation(r),b.halfWidth.set(S.width*.5,0,0),b.halfHeight.set(0,S.height*.5,0),b.halfWidth.applyMatrix4(a),b.halfHeight.applyMatrix4(a),_++}else if(S.isPointLight){const b=n.point[d];b.position.setFromMatrixPosition(S.matrixWorld),b.position.applyMatrix4(m),d++}else if(S.isHemisphereLight){const b=n.hemi[p];b.direction.setFromMatrixPosition(S.matrixWorld),b.direction.transformDirection(m),p++}}}return{setup:o,setupView:l,state:n}}function Jh(s){const t=new DM(s),e=[],n=[],i=[];function r(f){u.camera=f,e.length=0,n.length=0,i.length=0}function a(f){f.isLightProbeGrid?i.push(f):e.push(f)}function o(f){n.push(f)}function l(){t.setup(e),i.sort((f,h)=>f.priority-h.priority||f.id-h.id)}function c(f){t.setupView(e,f)}const u={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function LM(s){let t=new WeakMap;function e(i,r=0){const a=t.get(i);let o;return a===void 0?(o=new Jh(s),t.set(i,[o])):r>=a.length?(o=new Jh(s),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const NM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,IM=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,UM=[new N(1,0,0),new N(-1,0,0),new N(0,1,0),new N(0,-1,0),new N(0,0,1),new N(0,0,-1)],OM=[new N(0,-1,0),new N(0,-1,0),new N(0,0,1),new N(0,0,-1),new N(0,-1,0),new N(0,-1,0)],$h=new le,Sr=new N,_l=new N;function FM(s,t,e){let n=new Hr;const i=new ct,r=new ct,a=new Pe,o=new X_,l=new q_,c={},u=e.maxTextureSize,f={[cs]:fn,[fn]:cs,[Xn]:Xn},h=new hn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ct},radius:{value:4}},vertexShader:NM,fragmentShader:IM}),d=h.clone();d.defines.HORIZONTAL_PASS=1;const g=new Ze;g.setAttribute("position",new zi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new vn(g,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Va;let m=this.type;this.render=function(E,v,y){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||E.length===0)return;this.type===Vp&&(Yt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Va);const C=s.getRenderTarget(),R=s.getActiveCubeFace(),L=s.getActiveMipmapLevel(),U=s.state;U.setBlending(ss),U.buffers.depth.getReversed()===!0?U.buffers.color.setClear(0,0,0,0):U.buffers.color.setClear(1,1,1,1),U.buffers.depth.setTest(!0),U.setScissorTest(!1);const B=m!==this.type;B&&v.traverse(function(w){w.material&&(Array.isArray(w.material)?w.material.forEach(I=>I.needsUpdate=!0):w.material.needsUpdate=!0)});for(let w=0,I=E.length;w<I;w++){const D=E[w],O=D.shadow;if(O===void 0){Yt("WebGLShadowMap:",D,"has no shadow.");continue}if(O.autoUpdate===!1&&O.needsUpdate===!1)continue;i.copy(O.mapSize);const H=O.getFrameExtents();i.multiply(H),r.copy(O.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(r.x=Math.floor(u/H.x),i.x=r.x*H.x,O.mapSize.x=r.x),i.y>u&&(r.y=Math.floor(u/H.y),i.y=r.y*H.y,O.mapSize.y=r.y));const z=s.state.buffers.depth.getReversed();if(O.camera._reversedDepth=z,O.map===null||B===!0){if(O.map!==null&&(O.map.depthTexture!==null&&(O.map.depthTexture.dispose(),O.map.depthTexture=null),O.map.dispose()),this.type===Er){if(D.isPointLight){Yt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}O.map=new pn(i.x,i.y,{format:us,type:dn,minFilter:on,magFilter:on,generateMipmaps:!1}),O.map.texture.name=D.name+".shadowMap",O.map.depthTexture=new qs(i.x,i.y,Yn),O.map.depthTexture.name=D.name+".shadowMapDepth",O.map.depthTexture.format=Hi,O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=$e,O.map.depthTexture.magFilter=$e}else D.isPointLight?(O.map=new hu(i.x),O.map.depthTexture=new id(i.x,ai)):(O.map=new pn(i.x,i.y),O.map.depthTexture=new qs(i.x,i.y,ai)),O.map.depthTexture.name=D.name+".shadowMap",O.map.depthTexture.format=Hi,this.type===Va?(O.map.depthTexture.compareFunction=z?qf:Xf,O.map.depthTexture.minFilter=on,O.map.depthTexture.magFilter=on):(O.map.depthTexture.compareFunction=null,O.map.depthTexture.minFilter=$e,O.map.depthTexture.magFilter=$e);O.camera.updateProjectionMatrix()}O.map.isWebGLCubeRenderTarget!==!0&&(O.map.width!==i.x||O.map.height!==i.y)&&O.map.setSize(i.x,i.y);const V=O.map.isWebGLCubeRenderTarget?6:O.getViewportCount();D.isPointLight!==!0&&O.updateMatrices(D,y);const Y=(O.camera.layers.mask&4294967294)!==0?O.camera.layers:y.layers;for(let ut=0;ut<V;ut++){const At=O.getCamera(ut);if(D.isPointLight){const K=O.camera,lt=O.matrix,wt=D.distance||K.far;wt!==K.far&&(K.far=wt,K.updateProjectionMatrix()),Sr.setFromMatrixPosition(D.matrixWorld),K.position.copy(Sr),_l.copy(K.position),_l.add(UM[ut]),K.up.copy(OM[ut]),K.lookAt(_l),K.updateMatrixWorld(),lt.makeTranslation(-Sr.x,-Sr.y,-Sr.z),$h.multiplyMatrices(K.projectionMatrix,K.matrixWorldInverse),O._frustum.setFromProjectionMatrix($h,K.coordinateSystem,K.reversedDepth)}if(O.map.isWebGLCubeRenderTarget)s.setRenderTarget(O.map,ut),s.clear();else{ut===0&&(s.setRenderTarget(O.map),s.clear());const K=O.getViewport(ut);a.set(r.x*K.x,r.y*K.y,r.x*K.z,r.y*K.w),U.viewport(a)}n=O.getFrustum(ut),S(v,y,At,D,Y,this.type)}O.isPointLightShadow!==!0&&this.type===Er&&x(O,y),O.needsUpdate=!1}m=this.type,p.needsUpdate=!1,s.setRenderTarget(C,R,L)};function x(E,v){const y=t.update(_);h.defines.VSM_SAMPLES!==E.blurSamples&&(h.defines.VSM_SAMPLES=E.blurSamples,d.defines.VSM_SAMPLES=E.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),E.mapPass===null?E.mapPass=new pn(i.x,i.y,{format:us,type:dn}):(E.mapPass.width!==E.map.width||E.mapPass.height!==E.map.height)&&E.mapPass.setSize(E.map.width,E.map.height),h.uniforms.shadow_pass.value=E.map.depthTexture,h.uniforms.resolution.value.set(E.map.width,E.map.height),h.uniforms.radius.value=E.radius,s.setRenderTarget(E.mapPass),s.clear(),s.renderBufferDirect(v,null,y,h,_,null),d.uniforms.shadow_pass.value=E.mapPass.texture,d.uniforms.resolution.value.set(E.map.width,E.map.height),d.uniforms.radius.value=E.radius,s.setRenderTarget(E.map),s.clear(),s.renderBufferDirect(v,null,y,d,_,null)}function M(E,v,y,C){let R=null;const L=y.isPointLight===!0?E.customDistanceMaterial:E.customDepthMaterial;if(L!==void 0)R=L;else if(R=y.isPointLight===!0?l:o,s.localClippingEnabled&&v.clipShadows===!0&&Array.isArray(v.clippingPlanes)&&v.clippingPlanes.length!==0||v.displacementMap&&v.displacementScale!==0||v.alphaMap&&v.alphaTest>0||v.map&&v.alphaTest>0||v.alphaToCoverage===!0){const U=R.uuid,B=v.uuid;let w=c[U];w===void 0&&(w={},c[U]=w);let I=w[B];I===void 0&&(I=R.clone(),w[B]=I,v.addEventListener("dispose",b)),R=I}if(R.visible=v.visible,R.wireframe=v.wireframe,C===Er?R.side=v.shadowSide!==null?v.shadowSide:v.side:R.side=v.shadowSide!==null?v.shadowSide:f[v.side],R.alphaMap=v.alphaMap,R.alphaTest=v.alphaToCoverage===!0?.5:v.alphaTest,R.map=v.map,R.clipShadows=v.clipShadows,R.clippingPlanes=v.clippingPlanes,R.clipIntersection=v.clipIntersection,R.displacementMap=v.displacementMap,R.displacementScale=v.displacementScale,R.displacementBias=v.displacementBias,R.wireframeLinewidth=v.wireframeLinewidth,R.linewidth=v.linewidth,y.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const U=s.properties.get(R);U.light=y}return R}function S(E,v,y,C,R,L){if(E.visible===!1)return;if(E.layers.test(R)&&(E.isMesh||E.isLine||E.isPoints)&&(E.castShadow||E.receiveShadow&&L===Er)&&(!E.frustumCulled||E.intersectsFrustum(n))){E.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,E.matrixWorld);const w=t.update(E),I=E.material;if(Array.isArray(I)){const D=w.groups;for(let O=0,H=D.length;O<H;O++){const z=D[O],V=I[z.materialIndex];if(V&&V.visible){const Y=M(E,V,C,L);E.onBeforeShadow(s,E,v,y,w,Y,z),s.renderBufferDirect(y,null,w,Y,E,z),E.onAfterShadow(s,E,v,y,w,Y,z)}}}else if(I.visible){const D=M(E,I,C,L);E.onBeforeShadow(s,E,v,y,w,D,null),s.renderBufferDirect(y,null,w,D,E,null),E.onAfterShadow(s,E,v,y,w,D,null)}}const B=E.children;for(let w=0,I=B.length;w<I;w++)S(B[w],v,y,C,R,L)}function b(E){E.target.removeEventListener("dispose",b);for(const y in c){const C=c[y],R=E.target.uuid;R in C&&(C[R].dispose(),delete C[R])}}}function BM(s,t){function e(){let F=!1;const nt=new Pe;let Q=null;const yt=new Pe(0,0,0,0);return{setMask:function(_t){Q!==_t&&!F&&(s.colorMask(_t,_t,_t,_t),Q=_t)},setLocked:function(_t){F=_t},setClear:function(_t,vt,Bt,Qt,ht){ht===!0&&(_t*=Qt,vt*=Qt,Bt*=Qt),nt.set(_t,vt,Bt,Qt),yt.equals(nt)===!1&&(s.clearColor(_t,vt,Bt,Qt),yt.copy(nt))},reset:function(){F=!1,Q=null,yt.set(-1,0,0,0)}}}function n(){let F=!1,nt=!1,Q=null,yt=null,_t=null;return{setReversed:function(vt){if(nt!==vt){const Bt=t.get("EXT_clip_control");vt?Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.ZERO_TO_ONE_EXT):Bt.clipControlEXT(Bt.LOWER_LEFT_EXT,Bt.NEGATIVE_ONE_TO_ONE_EXT),nt=vt;const Qt=_t;_t=null,this.setClear(Qt)}},getReversed:function(){return nt},setTest:function(vt){vt?st(s.DEPTH_TEST):bt(s.DEPTH_TEST)},setMask:function(vt){Q!==vt&&!F&&(s.depthMask(vt),Q=vt)},setFunc:function(vt){if(nt&&(vt=bm[vt]),yt!==vt){switch(vt){case Rl:s.depthFunc(s.NEVER);break;case Cl:s.depthFunc(s.ALWAYS);break;case Pl:s.depthFunc(s.LESS);break;case Fr:s.depthFunc(s.LEQUAL);break;case Dl:s.depthFunc(s.EQUAL);break;case Ll:s.depthFunc(s.GEQUAL);break;case Nl:s.depthFunc(s.GREATER);break;case Il:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}yt=vt}},setLocked:function(vt){F=vt},setClear:function(vt){_t!==vt&&(_t=vt,nt&&(vt=1-vt),s.clearDepth(vt))},reset:function(){F=!1,Q=null,yt=null,_t=null,nt=!1}}}function i(){let F=!1,nt=null,Q=null,yt=null,_t=null,vt=null,Bt=null,Qt=null,ht=null;return{setTest:function(Gt){F||(Gt?st(s.STENCIL_TEST):bt(s.STENCIL_TEST))},setMask:function(Gt){nt!==Gt&&!F&&(s.stencilMask(Gt),nt=Gt)},setFunc:function(Gt,jt,gt){(Q!==Gt||yt!==jt||_t!==gt)&&(s.stencilFunc(Gt,jt,gt),Q=Gt,yt=jt,_t=gt)},setOp:function(Gt,jt,gt){(vt!==Gt||Bt!==jt||Qt!==gt)&&(s.stencilOp(Gt,jt,gt),vt=Gt,Bt=jt,Qt=gt)},setLocked:function(Gt){F=Gt},setClear:function(Gt){ht!==Gt&&(s.clearStencil(Gt),ht=Gt)},reset:function(){F=!1,nt=null,Q=null,yt=null,_t=null,vt=null,Bt=null,Qt=null,ht=null}}}const r=new e,a=new n,o=new i;let l={};const c=new WeakMap;let u={},f={},h={},d=new WeakMap,g=[],_=null,p=!1,m=null,x=null,M=null,S=null,b=null,E=null,v=null,y=new Wt(0,0,0),C=0,R=!1,L=null,U=null,B=null,w=null,I=null;const D=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let O=!1,H=0;const z=s.getParameter(s.VERSION);z.indexOf("WebGL")!==-1?(H=parseFloat(/^WebGL (\d)/.exec(z)[1]),O=H>=1):z.indexOf("OpenGL ES")!==-1&&(H=parseFloat(/^OpenGL ES (\d)/.exec(z)[1]),O=H>=2);let V=null,Y={};const ut=s.getParameter(s.SCISSOR_BOX),At=s.getParameter(s.VIEWPORT),K=new Pe().fromArray(ut),lt=new Pe().fromArray(At);function wt(F,nt,Q,yt){const _t=new Uint8Array(4),vt=s.createTexture();s.bindTexture(F,vt),s.texParameteri(F,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(F,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Bt=0;Bt<Q;Bt++)F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY?s.texImage3D(nt,0,s.RGBA,1,1,yt,0,s.RGBA,s.UNSIGNED_BYTE,_t):s.texImage2D(nt+Bt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,_t);return vt}const Nt={};Nt[s.TEXTURE_2D]=wt(s.TEXTURE_2D,s.TEXTURE_2D,1),Nt[s.TEXTURE_CUBE_MAP]=wt(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Nt[s.TEXTURE_2D_ARRAY]=wt(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Nt[s.TEXTURE_3D]=wt(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),st(s.DEPTH_TEST),a.setFunc(Fr),Rt(!1),xt(Gu),st(s.CULL_FACE),dt(ss);function st(F){u[F]!==!0&&(s.enable(F),u[F]=!0)}function bt(F){u[F]!==!1&&(s.disable(F),u[F]=!1)}function Ht(F,nt){return h[F]!==nt?(s.bindFramebuffer(F,nt),h[F]=nt,F===s.DRAW_FRAMEBUFFER&&(h[s.FRAMEBUFFER]=nt),F===s.FRAMEBUFFER&&(h[s.DRAW_FRAMEBUFFER]=nt),!0):!1}function Lt(F,nt){let Q=g,yt=!1;if(F){Q=d.get(nt),Q===void 0&&(Q=[],d.set(nt,Q));const _t=F.textures;if(Q.length!==_t.length||Q[0]!==s.COLOR_ATTACHMENT0){for(let vt=0,Bt=_t.length;vt<Bt;vt++)Q[vt]=s.COLOR_ATTACHMENT0+vt;Q.length=_t.length,yt=!0}}else Q[0]!==s.BACK&&(Q[0]=s.BACK,yt=!0);yt&&s.drawBuffers(Q)}function Vt(F){return _!==F?(s.useProgram(F),_=F,!0):!1}const Ft={[Ns]:s.FUNC_ADD,[Xp]:s.FUNC_SUBTRACT,[qp]:s.FUNC_REVERSE_SUBTRACT};Ft[Yp]=s.MIN,Ft[Zp]=s.MAX;const it={[Kp]:s.ZERO,[Jp]:s.ONE,[$p]:s.SRC_COLOR,[Uf]:s.SRC_ALPHA,[im]:s.SRC_ALPHA_SATURATE,[em]:s.DST_COLOR,[jp]:s.DST_ALPHA,[Qp]:s.ONE_MINUS_SRC_COLOR,[Of]:s.ONE_MINUS_SRC_ALPHA,[nm]:s.ONE_MINUS_DST_COLOR,[tm]:s.ONE_MINUS_DST_ALPHA,[sm]:s.CONSTANT_COLOR,[rm]:s.ONE_MINUS_CONSTANT_COLOR,[am]:s.CONSTANT_ALPHA,[om]:s.ONE_MINUS_CONSTANT_ALPHA};function dt(F,nt,Q,yt,_t,vt,Bt,Qt,ht,Gt){if(F===ss){p===!0&&(bt(s.BLEND),p=!1);return}if(p===!1&&(st(s.BLEND),p=!0),F!==Wp){if(F!==m||Gt!==R){if((x!==Ns||b!==Ns)&&(s.blendEquation(s.FUNC_ADD),x=Ns,b=Ns),Gt)switch(F){case Cr:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Al:s.blendFunc(s.ONE,s.ONE);break;case Hu:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Vu:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:he("WebGLState: Invalid blending: ",F);break}else switch(F){case Cr:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Al:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Hu:he("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Vu:he("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:he("WebGLState: Invalid blending: ",F);break}M=null,S=null,E=null,v=null,y.set(0,0,0),C=0,m=F,R=Gt}return}_t=_t||nt,vt=vt||Q,Bt=Bt||yt,(nt!==x||_t!==b)&&(s.blendEquationSeparate(Ft[nt],Ft[_t]),x=nt,b=_t),(Q!==M||yt!==S||vt!==E||Bt!==v)&&(s.blendFuncSeparate(it[Q],it[yt],it[vt],it[Bt]),M=Q,S=yt,E=vt,v=Bt),(Qt.equals(y)===!1||ht!==C)&&(s.blendColor(Qt.r,Qt.g,Qt.b,ht),y.copy(Qt),C=ht),m=F,R=!1}function at(F,nt){F.side===Xn?bt(s.CULL_FACE):st(s.CULL_FACE);let Q=F.side===fn;nt&&(Q=!Q),Rt(Q),F.blending===Cr&&F.transparent===!1?dt(ss):dt(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);const yt=F.stencilWrite;o.setTest(yt),yt&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Pt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?st(s.SAMPLE_ALPHA_TO_COVERAGE):bt(s.SAMPLE_ALPHA_TO_COVERAGE)}function Rt(F){L!==F&&(F?s.frontFace(s.CW):s.frontFace(s.CCW),L=F)}function xt(F){F!==Gp?(st(s.CULL_FACE),F!==U&&(F===Gu?s.cullFace(s.BACK):F===Hp?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):bt(s.CULL_FACE),U=F}function kt(F){F!==B&&(O&&s.lineWidth(F),B=F)}function Pt(F,nt,Q){F?(st(s.POLYGON_OFFSET_FILL),(w!==nt||I!==Q)&&(w=nt,I=Q,a.getReversed()&&(nt=-nt,Q=-Q),s.polygonOffset(nt,Q))):bt(s.POLYGON_OFFSET_FILL)}function Jt(F){F?st(s.SCISSOR_TEST):bt(s.SCISSOR_TEST)}function Zt(F){F===void 0&&(F=s.TEXTURE0+D-1),V!==F&&(s.activeTexture(F),V=F)}function $t(F,nt,Q){Q===void 0&&(V===null?Q=s.TEXTURE0+D-1:Q=V);let yt=Y[Q];yt===void 0&&(yt={type:void 0,texture:void 0},Y[Q]=yt),(yt.type!==F||yt.texture!==nt)&&(V!==Q&&(s.activeTexture(Q),V=Q),s.bindTexture(F,nt||Nt[F]),yt.type=F,yt.texture=nt)}function G(){const F=Y[V];F!==void 0&&F.type!==void 0&&(s.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function ye(){try{s.compressedTexImage2D(...arguments)}catch(F){he("WebGLState:",F)}}function se(){try{s.compressedTexImage3D(...arguments)}catch(F){he("WebGLState:",F)}}function _e(){try{s.texSubImage2D(...arguments)}catch(F){he("WebGLState:",F)}}function Et(){try{s.texSubImage3D(...arguments)}catch(F){he("WebGLState:",F)}}function fe(){try{s.compressedTexSubImage2D(...arguments)}catch(F){he("WebGLState:",F)}}function zt(){try{s.compressedTexSubImage3D(...arguments)}catch(F){he("WebGLState:",F)}}function qt(){try{s.texStorage2D(...arguments)}catch(F){he("WebGLState:",F)}}function P(){try{s.texStorage3D(...arguments)}catch(F){he("WebGLState:",F)}}function T(){try{s.texImage2D(...arguments)}catch(F){he("WebGLState:",F)}}function X(){try{s.texImage3D(...arguments)}catch(F){he("WebGLState:",F)}}function pt(F){return f[F]!==void 0?f[F]:s.getParameter(F)}function rt(F,nt){f[F]!==nt&&(s.pixelStorei(F,nt),f[F]=nt)}function Mt(F){K.equals(F)===!1&&(s.scissor(F.x,F.y,F.z,F.w),K.copy(F))}function Tt(F){lt.equals(F)===!1&&(s.viewport(F.x,F.y,F.z,F.w),lt.copy(F))}function j(F,nt){let Q=c.get(nt);Q===void 0&&(Q=new WeakMap,c.set(nt,Q));let yt=Q.get(F);yt===void 0&&(yt=s.getUniformBlockIndex(nt,F.name),s.uniformBlockBinding(nt,yt,yt),Q.set(F,yt))}function tt(F,nt,Q){const _t=c.get(nt).get(F);l[_t]!==Q&&(s.bindBufferBase(s.UNIFORM_BUFFER,_t,Q),l[_t]=Q)}function St(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),u={},f={},V=null,Y={},h={},l={},d=new WeakMap,g=[],_=null,p=!1,m=null,x=null,M=null,S=null,b=null,E=null,v=null,y=new Wt(0,0,0),C=0,R=!1,L=null,U=null,B=null,w=null,I=null,K.set(0,0,s.canvas.width,s.canvas.height),lt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:st,disable:bt,bindFramebuffer:Ht,drawBuffers:Lt,useProgram:Vt,setBlending:dt,setMaterial:at,setFlipSided:Rt,setCullFace:xt,setLineWidth:kt,setPolygonOffset:Pt,setScissorTest:Jt,activeTexture:Zt,bindTexture:$t,unbindTexture:G,compressedTexImage2D:ye,compressedTexImage3D:se,texImage2D:T,texImage3D:X,pixelStorei:rt,getParameter:pt,updateUBOMapping:j,uniformBlockBinding:tt,texStorage2D:qt,texStorage3D:P,texSubImage2D:_e,texSubImage3D:Et,compressedTexSubImage2D:fe,compressedTexSubImage3D:zt,scissor:Mt,viewport:Tt,reset:St}}function zM(s,t,e,n,i,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ct,u=new WeakMap,f=new Set;let h;const d=new WeakMap,g=new Set,_=new FinalizationRegistry(P=>g.delete(P));let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function m(P,T){return p?new OffscreenCanvas(P,T):ao("canvas")}function x(P,T,X){let pt=1;const rt=qt(P);if((rt.width>X||rt.height>X)&&(pt=X/Math.max(rt.width,rt.height)),pt<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const Mt=Math.floor(pt*rt.width),Tt=Math.floor(pt*rt.height);h===void 0&&(h=m(Mt,Tt));const j=T?m(Mt,Tt):h;return j.width=Mt,j.height=Tt,j.getContext("2d").drawImage(P,0,0,Mt,Tt),Yt("WebGLRenderer: Texture has been resized from ("+rt.width+"x"+rt.height+") to ("+Mt+"x"+Tt+")."),j}else return"data"in P&&Yt("WebGLRenderer: Image in DataTexture is too big ("+rt.width+"x"+rt.height+")."),P;return P}function M(P){return P.generateMipmaps}function S(P){s.generateMipmap(P)}function b(P){return P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?s.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function E(P,T,X,pt,rt,Mt=!1){if(P!==null){if(s[P]!==void 0)return s[P];Yt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let Tt;pt&&(Tt=t.get("EXT_texture_norm16"),Tt||Yt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let j=T;if(T===s.RED&&(X===s.FLOAT&&(j=s.R32F),X===s.HALF_FLOAT&&(j=s.R16F),X===s.UNSIGNED_BYTE&&(j=s.R8),X===s.UNSIGNED_SHORT&&Tt&&(j=Tt.R16_EXT),X===s.SHORT&&Tt&&(j=Tt.R16_SNORM_EXT)),T===s.RED_INTEGER&&(X===s.UNSIGNED_BYTE&&(j=s.R8UI),X===s.UNSIGNED_SHORT&&(j=s.R16UI),X===s.UNSIGNED_INT&&(j=s.R32UI),X===s.BYTE&&(j=s.R8I),X===s.SHORT&&(j=s.R16I),X===s.INT&&(j=s.R32I)),T===s.RG&&(X===s.FLOAT&&(j=s.RG32F),X===s.HALF_FLOAT&&(j=s.RG16F),X===s.UNSIGNED_BYTE&&(j=s.RG8),X===s.UNSIGNED_SHORT&&Tt&&(j=Tt.RG16_EXT),X===s.SHORT&&Tt&&(j=Tt.RG16_SNORM_EXT)),T===s.RG_INTEGER&&(X===s.UNSIGNED_BYTE&&(j=s.RG8UI),X===s.UNSIGNED_SHORT&&(j=s.RG16UI),X===s.UNSIGNED_INT&&(j=s.RG32UI),X===s.BYTE&&(j=s.RG8I),X===s.SHORT&&(j=s.RG16I),X===s.INT&&(j=s.RG32I)),T===s.RGB_INTEGER&&(X===s.UNSIGNED_BYTE&&(j=s.RGB8UI),X===s.UNSIGNED_SHORT&&(j=s.RGB16UI),X===s.UNSIGNED_INT&&(j=s.RGB32UI),X===s.BYTE&&(j=s.RGB8I),X===s.SHORT&&(j=s.RGB16I),X===s.INT&&(j=s.RGB32I)),T===s.RGBA_INTEGER&&(X===s.UNSIGNED_BYTE&&(j=s.RGBA8UI),X===s.UNSIGNED_SHORT&&(j=s.RGBA16UI),X===s.UNSIGNED_INT&&(j=s.RGBA32UI),X===s.BYTE&&(j=s.RGBA8I),X===s.SHORT&&(j=s.RGBA16I),X===s.INT&&(j=s.RGBA32I)),T===s.RGB&&(X===s.UNSIGNED_SHORT&&Tt&&(j=Tt.RGB16_EXT),X===s.SHORT&&Tt&&(j=Tt.RGB16_SNORM_EXT),X===s.UNSIGNED_INT_5_9_9_9_REV&&(j=s.RGB9_E5),X===s.UNSIGNED_INT_10F_11F_11F_REV&&(j=s.R11F_G11F_B10F)),T===s.RGBA){const tt=Mt?ro:oe.getTransfer(rt);X===s.FLOAT&&(j=s.RGBA32F),X===s.HALF_FLOAT&&(j=s.RGBA16F),X===s.UNSIGNED_BYTE&&(j=tt===pe?s.SRGB8_ALPHA8:s.RGBA8),X===s.UNSIGNED_SHORT&&Tt&&(j=Tt.RGBA16_EXT),X===s.SHORT&&Tt&&(j=Tt.RGBA16_SNORM_EXT),X===s.UNSIGNED_SHORT_4_4_4_4&&(j=s.RGBA4),X===s.UNSIGNED_SHORT_5_5_5_1&&(j=s.RGB5_A1)}return(j===s.R16F||j===s.R32F||j===s.RG16F||j===s.RG32F||j===s.RGBA16F||j===s.RGBA32F)&&t.get("EXT_color_buffer_float"),j}function v(P,T){let X;return P?T===null||T===ai||T===Xs?X=s.DEPTH24_STENCIL8:T===Yn?X=s.DEPTH32F_STENCIL8:T===zr&&(X=s.DEPTH24_STENCIL8,Yt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):T===null||T===ai||T===Xs?X=s.DEPTH_COMPONENT24:T===Yn?X=s.DEPTH_COMPONENT32F:T===zr&&(X=s.DEPTH_COMPONENT16),X}function y(P,T){return M(P)===!0||P.isFramebufferTexture&&P.minFilter!==$e&&P.minFilter!==on?Math.log2(Math.max(T.width,T.height))+1:P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?T.mipmaps.length:1}function C(P){const T=new WeakRef(P);n.get(P).__ref=T,g.add(T),_.register(P,T,T)}function R(P){const T=n.get(P).__ref;T!==void 0&&(g.delete(T),_.unregister(T))}function L(P){B(P.target)}function U(P){w(P.target)}function B(P){P.removeEventListener("dispose",L),R(P),D(P),P.isVideoTexture&&u.delete(P),P.isHTMLTexture&&f.delete(P)}function w(P){P.removeEventListener("dispose",U),R(P),H(P)}function I(){for(const P of g){const T=P.deref();T!==void 0&&(T.isRenderTarget===!0?w(T):B(T))}g.clear(),f.clear()}function D(P){const T=n.get(P);if(T.__webglInit===void 0)return;const X=P.source,pt=d.get(X);if(pt){const rt=pt[T.__cacheKey];rt.usedTimes--,rt.usedTimes===0&&O(P),Object.keys(pt).length===0&&d.delete(X)}n.remove(P)}function O(P){const T=n.get(P);s.deleteTexture(T.__webglTexture);const X=P.source,pt=d.get(X);delete pt[T.__cacheKey],a.memory.textures--}function H(P){const T=n.get(P);T.__depthDisposeCallback&&T.__depthDisposeCallback();const X=P.depthTexture;if(X&&X.renderTarget===P&&B(X),P.isWebGLCubeRenderTarget)for(let rt=0;rt<6;rt++){if(Array.isArray(T.__webglFramebuffer[rt]))for(let Mt=0;Mt<T.__webglFramebuffer[rt].length;Mt++)s.deleteFramebuffer(T.__webglFramebuffer[rt][Mt]);else s.deleteFramebuffer(T.__webglFramebuffer[rt]);T.__webglDepthbuffer&&s.deleteRenderbuffer(T.__webglDepthbuffer[rt])}else{if(Array.isArray(T.__webglFramebuffer))for(let rt=0;rt<T.__webglFramebuffer.length;rt++)s.deleteFramebuffer(T.__webglFramebuffer[rt]);else s.deleteFramebuffer(T.__webglFramebuffer);if(T.__webglDepthbuffer&&s.deleteRenderbuffer(T.__webglDepthbuffer),T.__webglMultisampledFramebuffer&&s.deleteFramebuffer(T.__webglMultisampledFramebuffer),T.__webglColorRenderbuffer)for(let rt=0;rt<T.__webglColorRenderbuffer.length;rt++)T.__webglColorRenderbuffer[rt]&&s.deleteRenderbuffer(T.__webglColorRenderbuffer[rt]);T.__webglDepthRenderbuffer&&s.deleteRenderbuffer(T.__webglDepthRenderbuffer)}const pt=P.textures;for(let rt=0,Mt=pt.length;rt<Mt;rt++){const Tt=n.get(pt[rt]);Tt.__webglTexture&&(s.deleteTexture(Tt.__webglTexture),a.memory.textures--),n.remove(pt[rt])}n.remove(P)}let z=0;function V(){z=0}function Y(){return z}function ut(P){z=P}function At(){const P=z;return P>=i.maxTextures&&Yt("WebGLTextures: Trying to use "+(P+1)+" texture units while this GPU supports only "+i.maxTextures),z+=1,P}function K(P){const T=[];return T.push(P.wrapS),T.push(P.wrapT),T.push(P.wrapR||0),T.push(P.magFilter),T.push(P.minFilter),T.push(P.anisotropy),T.push(P.internalFormat),T.push(P.format),T.push(P.type),T.push(P.generateMipmaps),T.push(P.mipmapsAutoUpdate),T.push(P.premultiplyAlpha),T.push(P.flipY),T.push(P.unpackAlignment),T.push(P.colorSpace),T.join()}function lt(P,T){const X=n.get(P);if(P.isVideoTexture&&fe(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&X.__version!==P.version){const pt=P.image;if(pt===null)Yt("WebGLRenderer: Texture marked for update but no image data found.");else if(pt.complete===!1)Yt("WebGLRenderer: Texture marked for update but image is incomplete");else{at(X,P,T);return}}else P.isExternalTexture&&(X.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,X.__webglTexture,s.TEXTURE0+T)}function wt(P,T){const X=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&X.__version!==P.version){at(X,P,T);return}else P.isExternalTexture&&(X.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,X.__webglTexture,s.TEXTURE0+T)}function Nt(P,T){const X=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&X.__version!==P.version){at(X,P,T);return}e.bindTexture(s.TEXTURE_3D,X.__webglTexture,s.TEXTURE0+T)}function st(P,T){const X=n.get(P);if(P.version>0&&X.__version!==P.version){Rt(X,P,T);return}e.bindTexture(s.TEXTURE_CUBE_MAP,X.__webglTexture,s.TEXTURE0+T)}const bt={[Ul]:s.REPEAT,[vi]:s.CLAMP_TO_EDGE,[Ol]:s.MIRRORED_REPEAT},Ht={[$e]:s.NEAREST,[um]:s.NEAREST_MIPMAP_NEAREST,[da]:s.NEAREST_MIPMAP_LINEAR,[on]:s.LINEAR,[Ho]:s.LINEAR_MIPMAP_NEAREST,[Mi]:s.LINEAR_MIPMAP_LINEAR},Lt={[pm]:s.NEVER,[Yf]:s.ALWAYS,[mm]:s.LESS,[Xf]:s.LEQUAL,[_m]:s.EQUAL,[qf]:s.GEQUAL,[gm]:s.GREATER,[xm]:s.NOTEQUAL};function Vt(P,T){if(T.type===Yn&&t.has("OES_texture_float_linear")===!1&&(T.magFilter===on||T.magFilter===Ho||T.magFilter===da||T.magFilter===Mi||T.minFilter===on||T.minFilter===Ho||T.minFilter===da||T.minFilter===Mi)&&Yt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(P,s.TEXTURE_WRAP_S,bt[T.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,bt[T.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,bt[T.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,Ht[T.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,Ht[T.minFilter]),T.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,Lt[T.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(T.magFilter===$e||T.minFilter!==da&&T.minFilter!==Mi||T.type===Yn&&t.has("OES_texture_float_linear")===!1)return;if(T.anisotropy>1||n.get(T).__currentAnisotropy){const X=t.get("EXT_texture_filter_anisotropic");s.texParameterf(P,X.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(T.anisotropy,i.getMaxAnisotropy())),n.get(T).__currentAnisotropy=T.anisotropy}}}function Ft(P,T){let X=!1;P.__webglInit===void 0&&(P.__webglInit=!0,T.addEventListener("dispose",L),C(T));const pt=T.source;let rt=d.get(pt);rt===void 0&&(rt={},d.set(pt,rt));const Mt=K(T);if(Mt!==P.__cacheKey){rt[Mt]===void 0&&(rt[Mt]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,X=!0),rt[Mt].usedTimes++;const Tt=rt[P.__cacheKey];Tt!==void 0&&(rt[P.__cacheKey].usedTimes--,Tt.usedTimes===0&&O(T)),P.__cacheKey=Mt,P.__webglTexture=rt[Mt].texture}return X}function it(P,T,X){return Math.floor(Math.floor(P/X)/T)}function dt(P,T,X,pt){const Mt=P.updateRanges;if(Mt.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,T.width,T.height,X,pt,T.data);else{Mt.sort((F,nt)=>F.start-nt.start);let Tt=0;for(let F=1;F<Mt.length;F++){const nt=Mt[Tt],Q=Mt[F],yt=nt.start+nt.count,_t=it(Q.start,T.width,4),vt=it(nt.start,T.width,4);Q.start<=yt+1&&_t===vt&&it(Q.start+Q.count-1,T.width,4)===_t?nt.count=Math.max(nt.count,Q.start+Q.count-nt.start):(++Tt,Mt[Tt]=Q)}Mt.length=Tt+1;const j=e.getParameter(s.UNPACK_ROW_LENGTH),tt=e.getParameter(s.UNPACK_SKIP_PIXELS),St=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,T.width);for(let F=0,nt=Mt.length;F<nt;F++){const Q=Mt[F],yt=Math.floor(Q.start/4),_t=Math.ceil(Q.count/4),vt=yt%T.width,Bt=Math.floor(yt/T.width),Qt=_t,ht=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,vt),e.pixelStorei(s.UNPACK_SKIP_ROWS,Bt),e.texSubImage2D(s.TEXTURE_2D,0,vt,Bt,Qt,ht,X,pt,T.data)}P.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,j),e.pixelStorei(s.UNPACK_SKIP_PIXELS,tt),e.pixelStorei(s.UNPACK_SKIP_ROWS,St)}}function at(P,T,X){let pt=s.TEXTURE_2D;(T.isDataArrayTexture||T.isCompressedArrayTexture)&&(pt=s.TEXTURE_2D_ARRAY),T.isData3DTexture&&(pt=s.TEXTURE_3D);const rt=Ft(P,T),Mt=T.source;e.bindTexture(pt,P.__webglTexture,s.TEXTURE0+X);const Tt=n.get(Mt);if(Mt.version!==Tt.__version||rt===!0){if(e.activeTexture(s.TEXTURE0+X),(typeof ImageBitmap<"u"&&T.image instanceof ImageBitmap)===!1){const ht=oe.getPrimaries(oe.workingColorSpace),Gt=T.colorSpace===Ni?null:oe.getPrimaries(T.colorSpace),jt=T.colorSpace===Ni||ht===Gt?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,jt)}e.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment);let tt=x(T.image,!1,i.maxTextureSize);tt=zt(T,tt);const St=r.convert(T.format,T.colorSpace),F=r.convert(T.type);let nt=E(T.internalFormat,St,F,T.normalized,T.colorSpace,T.isVideoTexture);Vt(pt,T);let Q;const yt=T.mipmaps,_t=T.isVideoTexture!==!0,vt=Tt.__version===void 0||rt===!0,Bt=Mt.dataReady,Qt=y(T,tt);if(T.isDepthTexture)nt=v(T.format===Ii,T.type),vt&&(_t?e.texStorage2D(s.TEXTURE_2D,1,nt,tt.width,tt.height):e.texImage2D(s.TEXTURE_2D,0,nt,tt.width,tt.height,0,St,F,null));else if(T.isDataTexture)if(yt.length>0){_t&&vt&&e.texStorage2D(s.TEXTURE_2D,Qt,nt,yt[0].width,yt[0].height);for(let ht=0,Gt=yt.length;ht<Gt;ht++)Q=yt[ht],_t?Bt&&e.texSubImage2D(s.TEXTURE_2D,ht,0,0,Q.width,Q.height,St,F,Q.data):e.texImage2D(s.TEXTURE_2D,ht,nt,Q.width,Q.height,0,St,F,Q.data);T.generateMipmaps=!1}else _t?(vt&&e.texStorage2D(s.TEXTURE_2D,Qt,nt,tt.width,tt.height),Bt&&dt(T,tt,St,F)):e.texImage2D(s.TEXTURE_2D,0,nt,tt.width,tt.height,0,St,F,tt.data);else if(T.isCompressedTexture)if(T.isCompressedArrayTexture){_t&&vt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Qt,nt,yt[0].width,yt[0].height,tt.depth);for(let ht=0,Gt=yt.length;ht<Gt;ht++)if(Q=yt[ht],T.format!==si)if(St!==null)if(_t){if(Bt)if(T.layerUpdates.size>0){const jt=Ph(Q.width,Q.height,T.format,T.type);for(const gt of T.layerUpdates){const ue=Q.data.subarray(gt*jt/Q.data.BYTES_PER_ELEMENT,(gt+1)*jt/Q.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ht,0,0,gt,Q.width,Q.height,1,St,ue)}}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ht,0,0,0,Q.width,Q.height,tt.depth,St,Q.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ht,nt,Q.width,Q.height,tt.depth,0,Q.data,0,0);else Yt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else _t?Bt&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,ht,0,0,0,Q.width,Q.height,tt.depth,St,F,Q.data):e.texImage3D(s.TEXTURE_2D_ARRAY,ht,nt,Q.width,Q.height,tt.depth,0,St,F,Q.data);T.layerUpdates.size>0&&T.clearLayerUpdates()}else{_t&&vt&&e.texStorage2D(s.TEXTURE_2D,Qt,nt,yt[0].width,yt[0].height);for(let ht=0,Gt=yt.length;ht<Gt;ht++)Q=yt[ht],T.format!==si?St!==null?_t?Bt&&e.compressedTexSubImage2D(s.TEXTURE_2D,ht,0,0,Q.width,Q.height,St,Q.data):e.compressedTexImage2D(s.TEXTURE_2D,ht,nt,Q.width,Q.height,0,Q.data):Yt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):_t?Bt&&e.texSubImage2D(s.TEXTURE_2D,ht,0,0,Q.width,Q.height,St,F,Q.data):e.texImage2D(s.TEXTURE_2D,ht,nt,Q.width,Q.height,0,St,F,Q.data)}else if(T.isDataArrayTexture)if(_t){if(vt&&e.texStorage3D(s.TEXTURE_2D_ARRAY,Qt,nt,tt.width,tt.height,tt.depth),Bt)if(T.layerUpdates.size>0){const ht=Ph(tt.width,tt.height,T.format,T.type);for(const Gt of T.layerUpdates){const jt=tt.data.subarray(Gt*ht/tt.data.BYTES_PER_ELEMENT,(Gt+1)*ht/tt.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Gt,tt.width,tt.height,1,St,F,jt)}T.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,tt.width,tt.height,tt.depth,St,F,tt.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,nt,tt.width,tt.height,tt.depth,0,St,F,tt.data);else if(T.isData3DTexture)_t?(vt&&e.texStorage3D(s.TEXTURE_3D,Qt,nt,tt.width,tt.height,tt.depth),Bt&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,tt.width,tt.height,tt.depth,St,F,tt.data)):e.texImage3D(s.TEXTURE_3D,0,nt,tt.width,tt.height,tt.depth,0,St,F,tt.data);else if(T.isFramebufferTexture){if(vt)if(_t)e.texStorage2D(s.TEXTURE_2D,Qt,nt,tt.width,tt.height);else{let ht=tt.width,Gt=tt.height;for(let jt=0;jt<Qt;jt++)e.texImage2D(s.TEXTURE_2D,jt,nt,ht,Gt,0,St,F,null),ht>>=1,Gt>>=1}}else if(T.isHTMLTexture){if("texElementImage2D"in s){const ht=s.canvas;if(ht.hasAttribute("layoutsubtree")||ht.setAttribute("layoutsubtree","true"),tt.parentNode!==ht){ht.appendChild(tt),f.add(T),ht.onpaint=Gt=>{const jt=Gt.changedElements;for(const gt of f)jt.includes(gt.image)&&(gt.needsUpdate=!0)},ht.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,tt);else{const jt=s.RGBA,gt=s.RGBA,ue=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,jt,gt,ue,tt)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(yt.length>0){if(_t&&vt){const ht=qt(yt[0]);e.texStorage2D(s.TEXTURE_2D,Qt,nt,ht.width,ht.height)}for(let ht=0,Gt=yt.length;ht<Gt;ht++)Q=yt[ht],_t?Bt&&e.texSubImage2D(s.TEXTURE_2D,ht,0,0,St,F,Q):e.texImage2D(s.TEXTURE_2D,ht,nt,St,F,Q);T.generateMipmaps=!1}else if(_t){if(vt){const ht=qt(tt);e.texStorage2D(s.TEXTURE_2D,Qt,nt,ht.width,ht.height)}Bt&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,St,F,tt)}else e.texImage2D(s.TEXTURE_2D,0,nt,St,F,tt);M(T)&&T.mipmapsAutoUpdate===!0&&S(pt),Tt.__version=Mt.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function Rt(P,T,X){if(T.image.length!==6)return;const pt=Ft(P,T),rt=T.source;e.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+X);const Mt=n.get(rt);if(rt.version!==Mt.__version||pt===!0){e.activeTexture(s.TEXTURE0+X);const Tt=oe.getPrimaries(oe.workingColorSpace),j=T.colorSpace===Ni?null:oe.getPrimaries(T.colorSpace),tt=T.colorSpace===Ni||Tt===j?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,T.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,T.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,T.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,tt);const St=T.isCompressedTexture||T.image[0].isCompressedTexture,F=T.image[0]&&T.image[0].isDataTexture,nt=[];for(let gt=0;gt<6;gt++)!St&&!F?nt[gt]=x(T.image[gt],!0,i.maxCubemapSize):nt[gt]=F?T.image[gt].image:T.image[gt],nt[gt]=zt(T,nt[gt]);const Q=nt[0],yt=r.convert(T.format,T.colorSpace),_t=r.convert(T.type);let vt=E(T.internalFormat,yt,_t,T.normalized,T.colorSpace);const Bt=T.isVideoTexture!==!0,Qt=Mt.__version===void 0||pt===!0,ht=rt.dataReady;let Gt=y(T,Q);Vt(s.TEXTURE_CUBE_MAP,T);let jt;if(T.isDepthTexture){if(vt=v(T.format===Ii,T.type),Qt)if(Bt)e.texStorage2D(s.TEXTURE_CUBE_MAP,1,vt,Q.width,Q.height);else for(let gt=0;gt<6;gt++)e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,vt,Q.width,Q.height,0,yt,_t,null)}else if(St){Bt&&Qt&&e.texStorage2D(s.TEXTURE_CUBE_MAP,Gt,vt,Q.width,Q.height);for(let gt=0;gt<6;gt++){jt=nt[gt].mipmaps;for(let ue=0;ue<jt.length;ue++){const Oe=jt[ue];T.format!==si?yt!==null?Bt?ht&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,ue,0,0,Oe.width,Oe.height,yt,Oe.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,ue,vt,Oe.width,Oe.height,0,Oe.data):Yt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Bt?ht&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,ue,0,0,Oe.width,Oe.height,yt,_t,Oe.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,ue,vt,Oe.width,Oe.height,0,yt,_t,Oe.data)}}}else{if(jt=T.mipmaps,Bt&&Qt){jt.length>0&&Gt++;const gt=qt(nt[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,Gt,vt,gt.width,gt.height)}for(let gt=0;gt<6;gt++)if(F){Bt?ht&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,0,0,nt[gt].width,nt[gt].height,yt,_t,nt[gt].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,vt,nt[gt].width,nt[gt].height,0,yt,_t,nt[gt].data);for(let ue=0;ue<jt.length;ue++){const On=jt[ue].image[gt].image;Bt?ht&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,ue+1,0,0,On.width,On.height,yt,_t,On.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,ue+1,vt,On.width,On.height,0,yt,_t,On.data)}}else{Bt?ht&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,0,0,yt,_t,nt[gt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,0,vt,yt,_t,nt[gt]);for(let ue=0;ue<jt.length;ue++){const Oe=jt[ue];Bt?ht&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,ue+1,0,0,yt,_t,Oe.image[gt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+gt,ue+1,vt,yt,_t,Oe.image[gt])}}}M(T)&&T.mipmapsAutoUpdate===!0&&S(s.TEXTURE_CUBE_MAP),Mt.__version=rt.version,T.onUpdate&&T.onUpdate(T)}P.__version=T.version}function xt(P,T,X,pt,rt,Mt){const Tt=r.convert(X.format,X.colorSpace),j=r.convert(X.type),tt=E(X.internalFormat,Tt,j,X.normalized,X.colorSpace),St=n.get(T),F=n.get(X);if(F.__renderTarget=T,!St.__hasExternalTextures){const nt=Math.max(1,T.width>>Mt),Q=Math.max(1,T.height>>Mt);rt===s.TEXTURE_3D||rt===s.TEXTURE_2D_ARRAY?e.texImage3D(rt,Mt,tt,nt,Q,T.depth,0,Tt,j,null):e.texImage2D(rt,Mt,tt,nt,Q,0,Tt,j,null)}e.bindFramebuffer(s.FRAMEBUFFER,P),Et(T)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,pt,rt,F.__webglTexture,0,_e(T)):(rt===s.TEXTURE_2D||rt>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&rt<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,pt,rt,F.__webglTexture,Mt),e.bindFramebuffer(s.FRAMEBUFFER,null)}function kt(P,T,X){if(s.bindRenderbuffer(s.RENDERBUFFER,P),T.depthBuffer){const pt=T.depthTexture,rt=pt&&pt.isDepthTexture?pt.type:null,Mt=v(T.stencilBuffer,rt),Tt=T.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;Et(T)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,_e(T),Mt,T.width,T.height):X?s.renderbufferStorageMultisample(s.RENDERBUFFER,_e(T),Mt,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,Mt,T.width,T.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Tt,s.RENDERBUFFER,P)}else{const pt=T.textures;for(let rt=0;rt<pt.length;rt++){const Mt=pt[rt],Tt=r.convert(Mt.format,Mt.colorSpace),j=r.convert(Mt.type),tt=E(Mt.internalFormat,Tt,j,Mt.normalized,Mt.colorSpace);Et(T)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,_e(T),tt,T.width,T.height):X?s.renderbufferStorageMultisample(s.RENDERBUFFER,_e(T),tt,T.width,T.height):s.renderbufferStorage(s.RENDERBUFFER,tt,T.width,T.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Pt(P,T,X){const pt=T.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,P),!(T.depthTexture&&T.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const rt=n.get(T.depthTexture);rt.__renderTarget=T;const Mt=pt?T.depthTexture.image[0]:T.depthTexture.image;(!rt.__webglTexture||Mt.width!==T.width||Mt.height!==T.height)&&(Mt.width=T.width,Mt.height=T.height,T.depthTexture.needsUpdate=!0),pt?st(T.depthTexture,0):lt(T.depthTexture,0);const Tt=rt.__webglTexture,j=_e(T),tt=pt?s.TEXTURE_CUBE_MAP_POSITIVE_X+X:s.TEXTURE_2D,St=T.depthTexture.format===Ii?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(T.depthTexture.format===Hi)Et(T)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,St,tt,Tt,0,j):s.framebufferTexture2D(s.FRAMEBUFFER,St,tt,Tt,0);else if(T.depthTexture.format===Ii)Et(T)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,St,tt,Tt,0,j):s.framebufferTexture2D(s.FRAMEBUFFER,St,tt,Tt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function Jt(P){const T=n.get(P),X=P.isWebGLCubeRenderTarget===!0;if(T.__boundDepthTexture!==P.depthTexture){const pt=P.depthTexture;if(T.__depthDisposeCallback&&T.__depthDisposeCallback(),pt){const rt=()=>{delete T.__boundDepthTexture,delete T.__depthDisposeCallback,pt.removeEventListener("dispose",rt)};pt.addEventListener("dispose",rt),T.__depthDisposeCallback=rt}T.__boundDepthTexture=pt}if(P.depthTexture&&!T.__autoAllocateDepthBuffer)if(X)for(let pt=0;pt<6;pt++)Pt(T.__webglFramebuffer[pt],P,pt);else P.texture.mipmaps.length>0?Pt(T.__webglFramebuffer[0],P,0):Pt(T.__webglFramebuffer,P,0);else if(X){T.__webglDepthbuffer=[];for(let pt=0;pt<6;pt++)if(e.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer[pt]),T.__webglDepthbuffer[pt]===void 0)T.__webglDepthbuffer[pt]=s.createRenderbuffer(),kt(T.__webglDepthbuffer[pt],P,!1);else{const rt=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Mt=T.__webglDepthbuffer[pt];s.bindRenderbuffer(s.RENDERBUFFER,Mt),s.framebufferRenderbuffer(s.FRAMEBUFFER,rt,s.RENDERBUFFER,Mt)}}else if(P.texture.mipmaps.length>0?e.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,T.__webglFramebuffer),T.__webglDepthbuffer===void 0)T.__webglDepthbuffer=s.createRenderbuffer(),kt(T.__webglDepthbuffer,P,!1);else{const rt=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Mt=T.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,Mt),s.framebufferRenderbuffer(s.FRAMEBUFFER,rt,s.RENDERBUFFER,Mt)}e.bindFramebuffer(s.FRAMEBUFFER,null)}function Zt(P,T,X){const pt=n.get(P);T!==void 0&&xt(pt.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),X!==void 0&&Jt(P)}function $t(P){const T=P.texture,X=n.get(P),pt=n.get(T);P.addEventListener("dispose",U),C(P);const rt=P.textures,Mt=P.isWebGLCubeRenderTarget===!0,Tt=rt.length>1;if(Tt||(pt.__webglTexture===void 0&&(pt.__webglTexture=s.createTexture()),pt.__version=T.version,a.memory.textures++),Mt){X.__webglFramebuffer=[];for(let j=0;j<6;j++)if(T.mipmaps.length>0){X.__webglFramebuffer[j]=[];for(let tt=0;tt<T.mipmaps.length;tt++)X.__webglFramebuffer[j][tt]=s.createFramebuffer()}else X.__webglFramebuffer[j]=s.createFramebuffer()}else{if(T.mipmaps.length>0){X.__webglFramebuffer=[];for(let j=0;j<T.mipmaps.length;j++)X.__webglFramebuffer[j]=s.createFramebuffer()}else X.__webglFramebuffer=s.createFramebuffer();if(Tt)for(let j=0,tt=rt.length;j<tt;j++){const St=n.get(rt[j]);St.__webglTexture===void 0&&(St.__webglTexture=s.createTexture(),a.memory.textures++)}if(P.samples>0&&Et(P)===!1){X.__webglMultisampledFramebuffer=s.createFramebuffer(),X.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,X.__webglMultisampledFramebuffer);for(let j=0;j<rt.length;j++){const tt=rt[j];X.__webglColorRenderbuffer[j]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,X.__webglColorRenderbuffer[j]);const St=r.convert(tt.format,tt.colorSpace),F=r.convert(tt.type),nt=E(tt.internalFormat,St,F,tt.normalized,tt.colorSpace,P.isXRRenderTarget===!0),Q=_e(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,Q,nt,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+j,s.RENDERBUFFER,X.__webglColorRenderbuffer[j])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&(X.__webglDepthRenderbuffer=s.createRenderbuffer(),kt(X.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(Mt){e.bindTexture(s.TEXTURE_CUBE_MAP,pt.__webglTexture),Vt(s.TEXTURE_CUBE_MAP,T);for(let j=0;j<6;j++)if(T.mipmaps.length>0)for(let tt=0;tt<T.mipmaps.length;tt++)xt(X.__webglFramebuffer[j][tt],P,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+j,tt);else xt(X.__webglFramebuffer[j],P,T,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+j,0);M(T)?S(s.TEXTURE_CUBE_MAP):T.mipmaps.length>0&&s.texParameteri(s.TEXTURE_CUBE_MAP,s.TEXTURE_MAX_LEVEL,T.mipmaps.length-1),e.unbindTexture()}else if(Tt){for(let j=0,tt=rt.length;j<tt;j++){const St=rt[j],F=n.get(St);let nt=s.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(nt=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(nt,F.__webglTexture),Vt(nt,St),xt(X.__webglFramebuffer,P,St,s.COLOR_ATTACHMENT0+j,nt,0),M(St)&&S(nt)}e.unbindTexture()}else{let j=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(j=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(j,pt.__webglTexture),Vt(j,T),T.mipmaps.length>0)for(let tt=0;tt<T.mipmaps.length;tt++)xt(X.__webglFramebuffer[tt],P,T,s.COLOR_ATTACHMENT0,j,tt);else xt(X.__webglFramebuffer,P,T,s.COLOR_ATTACHMENT0,j,0);M(T)?S(j):T.mipmaps.length>0&&s.texParameteri(j,s.TEXTURE_MAX_LEVEL,T.mipmaps.length-1),e.unbindTexture()}P.depthBuffer&&Jt(P)}function G(P){const T=P.textures;for(let X=0,pt=T.length;X<pt;X++){const rt=T[X];if(M(rt)&&rt.mipmapsAutoUpdate===!0){const Mt=b(P),Tt=n.get(rt).__webglTexture;e.bindTexture(Mt,Tt),S(Mt),e.unbindTexture()}}}const ye=[];function se(P){if(P.samples>0){if(Et(P)===!1){const T=P.textures,X=P.width,pt=P.height;let rt=s.COLOR_BUFFER_BIT;const Mt=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Tt=n.get(P),j=T.length>1;if(j)for(let St=0;St<T.length;St++)e.bindFramebuffer(s.FRAMEBUFFER,Tt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+St,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,Tt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+St,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,Tt.__webglMultisampledFramebuffer),P.texture.mipmaps.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Tt.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Tt.__webglFramebuffer);for(let St=0;St<T.length;St++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(rt|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(rt|=s.STENCIL_BUFFER_BIT)),j){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Tt.__webglColorRenderbuffer[St]);const F=n.get(T[St]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,F,0)}s.blitFramebuffer(0,0,X,pt,0,0,X,pt,rt,s.NEAREST),l===!0&&(ye.length=0,ye.push(s.COLOR_ATTACHMENT0+St),P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&ye.push(Mt),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,ye))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),j)for(let St=0;St<T.length;St++){e.bindFramebuffer(s.FRAMEBUFFER,Tt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+St,s.RENDERBUFFER,Tt.__webglColorRenderbuffer[St]);const F=n.get(T[St]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,Tt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+St,s.TEXTURE_2D,F,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,Tt.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&l){const T=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[T])}}}function _e(P){return Math.min(i.maxSamples,P.samples)}function Et(P){const T=n.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&T.__useRenderToTexture!==!1}function fe(P){const T=a.render.frame;u.get(P)!==T&&(u.set(P,T),P.update())}function zt(P,T){const X=P.colorSpace,pt=P.format,rt=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||X!==so&&X!==Ni&&(oe.getTransfer(X)===pe?(pt!==si||rt!==En)&&Yt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):he("WebGLTextures: Unsupported texture color space:",X)),T}function qt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=At,this.resetTextureUnits=V,this.getTextureUnits=Y,this.setTextureUnits=ut,this.setTexture2D=lt,this.setTexture2DArray=wt,this.setTexture3D=Nt,this.setTextureCube=st,this.rebindTextures=Zt,this.setupRenderTarget=$t,this.updateRenderTargetMipmap=G,this.updateMultisampleRenderTarget=se,this.setupDepthRenderbuffer=Jt,this.setupFrameBufferTexture=xt,this.useMultisampledRTT=Et,this.dispose=I}function kM(s,t){function e(n,i=Ni){let r;const a=oe.getTransfer(i);if(n===En)return s.UNSIGNED_BYTE;if(n===Wc)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Xc)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Gf)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Hf)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===zf)return s.BYTE;if(n===kf)return s.SHORT;if(n===zr)return s.UNSIGNED_SHORT;if(n===Vc)return s.INT;if(n===ai)return s.UNSIGNED_INT;if(n===Yn)return s.FLOAT;if(n===dn)return s.HALF_FLOAT;if(n===Vf)return s.ALPHA;if(n===Wf)return s.RGB;if(n===si)return s.RGBA;if(n===Hi)return s.DEPTH_COMPONENT;if(n===Ii)return s.DEPTH_STENCIL;if(n===qc)return s.RED;if(n===Yc)return s.RED_INTEGER;if(n===us)return s.RG;if(n===Zc)return s.RG_INTEGER;if(n===Kc)return s.RGBA_INTEGER;if(n===Wa||n===Xa||n===qa||n===Ya)if(a===pe)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Wa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Xa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===qa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ya)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Wa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Xa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===qa)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ya)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Fl||n===Bl||n===zl||n===kl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Fl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Bl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===zl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===kl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Gl||n===Hl||n===Vl||n===Wl||n===Xl||n===no||n===ql)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Gl||n===Hl)return a===pe?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Vl)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Wl)return r.COMPRESSED_R11_EAC;if(n===Xl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===no)return r.COMPRESSED_RG11_EAC;if(n===ql)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===Yl||n===Zl||n===Kl||n===Jl||n===$l||n===Ql||n===jl||n===tc||n===ec||n===nc||n===ic||n===sc||n===rc||n===ac)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Yl)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Zl)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Kl)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Jl)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===$l)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ql)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===jl)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===tc)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===ec)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===nc)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ic)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===sc)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===rc)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===ac)return a===pe?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===oc||n===lc||n===cc)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===oc)return a===pe?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===lc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===cc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===uc||n===hc||n===io||n===fc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===uc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===hc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===io)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===fc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Xs?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}const GM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,HM=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class VM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new sd(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new hn({vertexShader:GM,fragmentShader:HM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new vn(new ir(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class WM extends qi{constructor(t,e){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,f=null,h=null,d=null,g=null;const _=typeof XRWebGLBinding<"u",p=new VM,m={},x=e.getContextAttributes();let M=null,S=null;const b=[],E=[],v=new ct;let y=null,C=null;const R=new Wn;R.viewport=new Pe;const L=new Wn;L.viewport=new Pe;const U=[R,L],B=new Q_;let w=null,I=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let lt=b[K];return lt===void 0&&(lt=new Ko,b[K]=lt),lt.getTargetRaySpace()},this.getControllerGrip=function(K){let lt=b[K];return lt===void 0&&(lt=new Ko,b[K]=lt),lt.getGripSpace()},this.getHand=function(K){let lt=b[K];return lt===void 0&&(lt=new Ko,b[K]=lt),lt.getHandSpace()};function D(K){const lt=E.indexOf(K.inputSource);if(lt===-1)return;const wt=b[lt];wt!==void 0&&(wt.update(K.inputSource,K.frame,c||a),wt.dispatchEvent({type:K.type,data:K.inputSource}))}function O(){i.removeEventListener("select",D),i.removeEventListener("selectstart",D),i.removeEventListener("selectend",D),i.removeEventListener("squeeze",D),i.removeEventListener("squeezestart",D),i.removeEventListener("squeezeend",D),i.removeEventListener("end",O),i.removeEventListener("inputsourceschange",H);for(let K=0;K<b.length;K++){const lt=E[K];lt!==null&&(E[K]=null,b[K].disconnect(lt))}w=null,I=null,p.reset();for(const K in m)delete m[K];if(t.setRenderTarget(M),d=null,h=null,f=null,i=null,S=null,At.stop(),n.isPresenting=!1,t.setPixelRatio(y),t.setSize(v.width,v.height,!1),C!==null){const K=C.camera;K.fov=C.fov,K.zoom=C.zoom,K.updateProjectionMatrix(),C=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,n.isPresenting===!0&&Yt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,n.isPresenting===!0&&Yt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return f===null&&_&&(f=new XRWebGLBinding(i,e)),f},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(K){if(i=K,i!==null){if(M=t.getRenderTarget(),i.addEventListener("select",D),i.addEventListener("selectstart",D),i.addEventListener("selectend",D),i.addEventListener("squeeze",D),i.addEventListener("squeezestart",D),i.addEventListener("squeezeend",D),i.addEventListener("end",O),i.addEventListener("inputsourceschange",H),x.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(v),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let wt=null,Nt=null,st=null;x.depth&&(st=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,wt=x.stencil?Ii:Hi,Nt=x.stencil?Xs:ai);const bt={colorFormat:e.RGBA8,depthFormat:st,scaleFactor:r};f=this.getBinding(),h=f.createProjectionLayer(bt),i.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),S=new pn(h.textureWidth,h.textureHeight,{format:si,type:En,depthTexture:new qs(h.textureWidth,h.textureHeight,Nt,void 0,void 0,void 0,void 0,void 0,void 0,wt),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{const wt={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(i,e,wt),i.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),S=new pn(d.framebufferWidth,d.framebufferHeight,{format:si,type:En,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),At.setContext(i),At.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function H(K){for(let lt=0;lt<K.removed.length;lt++){const wt=K.removed[lt],Nt=E.indexOf(wt);Nt>=0&&(E[Nt]=null,b[Nt].disconnect(wt))}for(let lt=0;lt<K.added.length;lt++){const wt=K.added[lt];let Nt=E.indexOf(wt);if(Nt===-1){for(let bt=0;bt<b.length;bt++)if(bt>=E.length){E.push(wt),Nt=bt;break}else if(E[bt]===null){E[bt]=wt,Nt=bt;break}if(Nt===-1)break}const st=b[Nt];st&&st.connect(wt)}}function z(K,lt){lt===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(lt.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(i===null)return;let lt=K.near,wt=K.far;p.texture!==null&&(p.depthNear>0&&(lt=p.depthNear),p.depthFar>0&&(wt=p.depthFar)),B.near=L.near=R.near=lt,B.far=L.far=R.far=wt,(w!==B.near||I!==B.far)&&(i.updateRenderState({depthNear:B.near,depthFar:B.far}),w=B.near,I=B.far),B.layers.mask=K.layers.mask|6,R.layers.mask=B.layers.mask&-5,L.layers.mask=B.layers.mask&-3;const Nt=K.parent,st=B.cameras;z(B,Nt);for(let bt=0;bt<st.length;bt++)z(st[bt],Nt);B.projectionMatrix.copy(R.projectionMatrix),B.projectionMatrixInverse.copy(R.projectionMatrixInverse),C===null&&K.isPerspectiveCamera&&(C={camera:K,fov:K.fov,zoom:K.zoom}),V(K,B,Nt)};function V(K,lt,wt){wt===null?K.matrix.copy(lt.matrixWorld):(K.matrix.copy(wt.matrixWorld),K.matrix.invert(),K.matrix.multiply(lt.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(lt.projectionMatrix),K.projectionMatrixInverse.copy(lt.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=Gr*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return B},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(K){l=K,h!==null&&(h.fixedFoveation=K),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=K)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(B)},this.getCameraTexture=function(K){return m[K]};let Y=null;function ut(K,lt){if(u=lt.getViewerPose(c||a),g=lt,u!==null){const wt=u.views;d!==null&&(t.setRenderTargetFramebuffer(S,d.framebuffer),t.setRenderTarget(S));let Nt=!1;wt.length!==B.cameras.length&&(B.cameras.length=0,Nt=!0);for(let Lt=0;Lt<wt.length;Lt++){const Vt=wt[Lt];let Ft=null;if(d!==null)Ft=d.getViewport(Vt);else{const dt=f.getViewSubImage(h,Vt);Ft=dt.viewport,Lt===0&&(t.setRenderTargetTextures(S,dt.colorTexture,dt.depthStencilTexture),t.setRenderTarget(S))}let it=U[Lt];it===void 0&&(it=new Wn,it.layers.enable(Lt),it.viewport=new Pe,U[Lt]=it),it.matrix.fromArray(Vt.transform.matrix),it.matrix.decompose(it.position,it.quaternion,it.scale),it.projectionMatrix.fromArray(Vt.projectionMatrix),it.projectionMatrixInverse.copy(it.projectionMatrix).invert(),it.viewport.set(Ft.x,Ft.y,Ft.width,Ft.height),Lt===0&&(B.matrix.copy(it.matrix),B.matrix.decompose(B.position,B.quaternion,B.scale)),Nt===!0&&B.cameras.push(it)}const st=i.enabledFeatures;if(st&&st.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&_){f=n.getBinding();const Lt=f.getDepthInformation(wt[0]);Lt&&Lt.isValid&&Lt.texture&&p.init(Lt,i.renderState)}if(st&&st.includes("camera-access")&&_){t.state.unbindTexture(),f=n.getBinding();for(let Lt=0;Lt<wt.length;Lt++){const Vt=wt[Lt].camera;if(Vt){let Ft=m[Vt];Ft||(Ft=new sd,m[Vt]=Ft);const it=f.getCameraImage(Vt);Ft.sourceTexture=it}}}}for(let wt=0;wt<b.length;wt++){const Nt=E[wt],st=b[wt];Nt!==null&&st!==void 0&&st.update(Nt,lt,c||a)}Y&&Y(K,lt),lt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:lt}),g=null}const At=new Md;At.setAnimationLoop(ut),this.setAnimationLoop=function(K){Y=K},this.dispose=function(){}}}const XM=new le,Pd=new Kt;Pd.set(-1,0,0,0,1,0,0,0,1);function qM(s,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,_d(s)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,x,M,S){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?r(p,m):m.isMeshLambertMaterial?(r(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(r(p,m),f(p,m)):m.isMeshPhongMaterial?(r(p,m),u(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(r(p,m),h(p,m),m.isMeshPhysicalMaterial&&d(p,m,S)):m.isMeshMatcapMaterial?(r(p,m),g(p,m)):m.isMeshDepthMaterial?r(p,m):m.isMeshDistanceMaterial?(r(p,m),_(p,m)):m.isMeshNormalMaterial?r(p,m):m.isLineBasicMaterial?(a(p,m),m.isLineDashedMaterial&&o(p,m)):m.isPointsMaterial?l(p,m,x,M):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function r(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===fn&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===fn&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const x=t.get(m),M=x.envMap,S=x.envMapRotation;M&&(p.envMap.value=M,p.envMapRotation.value.setFromMatrix4(XM.makeRotationFromEuler(S)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Pd),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function a(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function o(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,x,M){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*x,p.scale.value=M*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function u(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function f(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function h(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function d(p,m,x){p.ior.value=m.ior,m.diffuseRoughness>0&&(p.diffuseRoughness.value=m.diffuseRoughness,m.diffuseRoughnessMap&&(p.diffuseRoughnessMap.value=m.diffuseRoughnessMap,e(m.diffuseRoughnessMap,p.diffuseRoughnessMapTransform))),m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===fn&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.retroreflectivity>0&&(p.retroreflectivity.value=m.retroreflectivity),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessMinimum,p.iridescenceThicknessMaximum.value=m.iridescenceThicknessMaximum,m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=x.texture,p.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function _(p,m){const x=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(x.matrixWorld),p.nearDistance.value=x.shadow.camera.near,p.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function YM(s,t,e,n){let i={},r={};function a(x,M){const S=M.program;n.uniformBlockBinding(x,S,i[x.id])}function o(x,M){let S=i[x.id];S===void 0&&(g(x),S=l(x),i[x.id]=S,x.addEventListener("dispose",p));const b=M.program;n.updateUBOMapping(x,b);const E=t.render.frame;r[x.id]!==E&&(c(x),r[x.id]=E)}function l(x){const M=s.createBuffer(),S=x.__size,b=x.usage;return s.bindBuffer(s.UNIFORM_BUFFER,M),s.bufferData(s.UNIFORM_BUFFER,S,b),s.bindBuffer(s.UNIFORM_BUFFER,null),M}function c(x){const M=i[x.id],S=x.uniforms,b=x.__cache;s.bindBuffer(s.UNIFORM_BUFFER,M);for(let E=0,v=S.length;E<v;E++){const y=S[E];if(Array.isArray(y))for(let C=0,R=y.length;C<R;C++)u(y[C],E,C,b);else u(y,E,0,b)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function u(x,M,S,b){if(h(x,M,S,b)===!0){const E=x.__offset,v=x.value;if(Array.isArray(v)){let y=0;for(let C=0;C<v.length;C++){const R=v[C],L=_(R,!0);f(R,x.__data,y),y+=L.storage/Float32Array.BYTES_PER_ELEMENT}}else f(v,x.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,E,x.__data)}}function f(x,M,S){typeof x=="number"||typeof x=="boolean"?M[S]=x:x.isMatrix3?(M[S]=x.elements[0],M[S+1]=x.elements[1],M[S+2]=x.elements[2],M[S+3]=0,M[S+4]=x.elements[3],M[S+5]=x.elements[4],M[S+6]=x.elements[5],M[S+7]=0,M[S+8]=x.elements[6],M[S+9]=x.elements[7],M[S+10]=x.elements[8],M[S+11]=0):ArrayBuffer.isView(x)?M.set(x.subarray(0,M.length-S),S):x.toArray(M,S)}function h(x,M,S,b){const E=x.value,v=M+"_"+S;if(Array.isArray(E)){b[v]===void 0&&(b[v]=[]);const y=b[v];let C=!1;for(let R=0;R<E.length;R++)d(E[R],y,R)===!0&&(C=!0);return C}return d(E,b,v)}function d(x,M,S){if(M[S]===void 0)return typeof x=="number"||typeof x=="boolean"?M[S]=x:ArrayBuffer.isView(x)?M[S]=x.slice():M[S]=x.clone(),!0;{const b=M[S];if(typeof x=="number"||typeof x=="boolean"){if(b!==x)return M[S]=x,!0}else{if(ArrayBuffer.isView(x))return!0;if(b.equals(x)===!1)return b.copy(x),!0}}return!1}function g(x){const M=x.uniforms;let S=0;const b=16;for(let v=0,y=M.length;v<y;v++){const C=Array.isArray(M[v])?M[v]:[M[v]];for(let R=0,L=C.length;R<L;R++){const U=C[R],B=Array.isArray(U.value)?U.value:[U.value],w=Array.isArray(M[v])||Array.isArray(U.value);let I=S;for(let O=0,H=B.length;O<H;O++){const z=B[O],V=_(z,w),Y=S%b,ut=Y%V.boundary,At=Y+ut;S+=ut,At!==0&&b-At<V.storage&&(S+=b-At),O===0&&(I=S),S+=V.storage}const D=U.type==="int"?Int32Array:U.type==="uint"?Uint32Array:Float32Array;U.__data=new D((S-I)/Float32Array.BYTES_PER_ELEMENT),U.__offset=I}}const E=S%b;return E>0&&(S+=b-E),x.__size=S,x.__cache={},this}function _(x,M){const S={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(S.boundary=4,S.storage=4):x.isVector2?(S.boundary=8,S.storage=8):x.isVector3||x.isColor?(S.boundary=16,S.storage=12):x.isVector4?(S.boundary=16,S.storage=16):x.isMatrix3?(S.boundary=16,S.storage=48):x.isMatrix4?(S.boundary=16,S.storage=64):x.isTexture?Yt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(S.boundary=16,S.storage=x.byteLength):Yt("WebGLRenderer: Unsupported uniform value type.",x),M===!0&&(S.boundary=16,S.storage=Math.ceil(S.storage/16)*16),S}function p(x){const M=x.target;M.removeEventListener("dispose",p),s.deleteBuffer(i[M.id]),delete i[M.id],delete r[M.id]}function m(){for(const x in i)s.deleteBuffer(i[x]);i={},r={}}return{bind:a,update:o,dispose:m}}const ZM=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let ti=null;function KM(){return ti===null&&(ti=new tu(ZM,16,16,us,dn),ti.name="DFG_LUT",ti.minFilter=on,ti.magFilter=on,ti.wrapS=vi,ti.wrapT=vi,ti.generateMipmaps=!1,ti.needsUpdate=!0),ti}class JM{constructor(t={}){const{canvas:e=Sm(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1,reversedDepthBuffer:h=!1,outputBufferType:d=En}=t;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const _=d,p=new Set([Kc,Zc,Yc]),m=new Set([En,ai,zr,Xs,Wc,Xc]),x=new Uint32Array(4),M=new Int32Array(4),S={textures:[],min:[],max:[],resolution:[]};let b=null,E=null;const v=[],y=[];let C=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=yi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let L=!1,U=null,B=null,w=null,I=null;this._outputColorSpace=cn;let D=0,O=0,H=null,z=-1,V=null;const Y=new Pe,ut=new Pe;let At=null;const K=new Wt(0);let lt=0,wt=e.width,Nt=e.height,st=1,bt=null,Ht=null;const Lt=new Pe(0,0,wt,Nt),Vt=new Pe(0,0,wt,Nt);let Ft=!1;const it=new Hr,dt=new eu;let at=!1,Rt=!1;const xt=new le,kt=new N,Pt=new Pe,Jt={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Zt=!1;function $t(){return H===null?st:1}let G=n;function ye(A,k){return e.getContext(A,k)}let se,_e,Et,fe,zt,qt,P,T,X,pt,rt,Mt,Tt,j,tt,St,F,nt,Q,yt,_t,vt,Bt;try{const A={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Oc}`),e.addEventListener("webglcontextlost",Gt,!1),e.addEventListener("webglcontextrestored",jt,!1),e.addEventListener("webglcontextcreationerror",gt,!1),G===null){const k="webgl2";if(G=ye(k,A),G===null)throw ye(k)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}Qt()}catch(A){throw e.removeEventListener("webglcontextlost",Gt,!1),e.removeEventListener("webglcontextrestored",jt,!1),e.removeEventListener("webglcontextcreationerror",gt,!1),he("WebGLRenderer: "+A.message),A}function Qt(){se=new jx(G),se.init(),_t=new kM(G,se),_e=new Hx(G,se,t,_t),Et=new BM(G,se),_e.reversedDepthBuffer&&h&&Et.buffers.depth.setReversed(!0),B=G.createFramebuffer(),w=G.createFramebuffer(),I=G.createFramebuffer(),fe=new nv(G),zt=new EM,qt=new zM(G,se,Et,zt,_e,_t,fe),P=new Qx(R),T=new sg(G),vt=new kx(G,T),X=new tv(G,T,fe,vt),pt=new sv(G,X,T,vt,fe),nt=new iv(G,_e,qt),tt=new Vx(zt),rt=new bM(R,P,se,_e,vt,tt),Mt=new qM(R,zt),Tt=new wM,j=new LM(se),F=new zx(R,P,Et,pt,g,l),St=new FM(R,pt,_e),Bt=new YM(G,fe,_e,Et),Q=new Gx(G,se,fe),yt=new ev(G,se,fe),fe.programs=rt.programs,R.capabilities=_e,R.extensions=se,R.properties=zt,R.renderLists=Tt,R.shadowMap=St,R.state=Et,R.info=fe}_!==En&&(C=new av(_,e.width,e.height,o,i,r));const ht=new WM(R,G);this.xr=ht,this.getContext=function(){return G},this.getContextAttributes=function(){return G.getContextAttributes()},this.forceContextLoss=function(){const A=se.get("WEBGL_lose_context");A&&A.loseContext()},this.forceContextRestore=function(){const A=se.get("WEBGL_lose_context");A&&A.restoreContext()},this.getPixelRatio=function(){return st},this.setPixelRatio=function(A){A!==void 0&&(st=A,this.setSize(wt,Nt,!1))},this.getSize=function(A){return A.set(wt,Nt)},this.setSize=function(A,k,J=!0){if(ht.isPresenting){Yt("WebGLRenderer: Can't change size while VR device is presenting.");return}wt=A,Nt=k,e.width=Math.floor(A*st),e.height=Math.floor(k*st),J===!0&&(e.style.width=A+"px",e.style.height=k+"px"),C!==null&&C.setSize(e.width,e.height),this.setViewport(0,0,A,k)},this.getDrawingBufferSize=function(A){return A.set(wt*st,Nt*st).floor()},this.setDrawingBufferSize=function(A,k,J){wt=A,Nt=k,st=J,e.width=Math.floor(A*J),e.height=Math.floor(k*J),this.setViewport(0,0,A,k)},this.setEffects=function(A){if(_===En){he("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(A){for(let k=0;k<A.length;k++)if(A[k].isOutputPass===!0){Yt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}C.setEffects(A||[])},this.getCurrentViewport=function(A){return A.copy(Y)},this.getViewport=function(A){return A.copy(Lt)},this.setViewport=function(A,k,J,q){A.isVector4?Lt.set(A.x,A.y,A.z,A.w):Lt.set(A,k,J,q),Et.viewport(Y.copy(Lt).multiplyScalar($t()).round())},this.getScissor=function(A){return A.copy(Vt)},this.setScissor=function(A,k,J,q){A.isVector4?Vt.set(A.x,A.y,A.z,A.w):Vt.set(A,k,J,q),Et.scissor(ut.copy(Vt).multiplyScalar($t()).round())},this.getScissorTest=function(){return Ft},this.setScissorTest=function(A){Et.setScissorTest(Ft=A)},this.setOpaqueSort=function(A){bt=A},this.setTransparentSort=function(A){Ht=A},this.getClearColor=function(A){return A.copy(F.getClearColor())},this.setClearColor=function(){F.setClearColor(...arguments)},this.getClearAlpha=function(){return F.getClearAlpha()},this.setClearAlpha=function(){F.setClearAlpha(...arguments)},this.clear=function(A=!0,k=!0,J=!0){let q=0;if(A){let Z=!1;if(H!==null){const W=H.texture.format;Z=p.has(W)}if(Z){const W=H.texture.type,ot=m.has(W),et=F.getClearColor(),$=F.getClearAlpha(),mt=et.r,It=et.g,Ot=et.b;ot?(x[0]=mt,x[1]=It,x[2]=Ot,x[3]=$,G.clearBufferuiv(G.COLOR,0,x)):(M[0]=mt,M[1]=It,M[2]=Ot,M[3]=$,G.clearBufferiv(G.COLOR,0,M))}else q|=G.COLOR_BUFFER_BIT}k&&(q|=G.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),J&&(q|=G.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),q!==0&&G.clear(q)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(A){A.setRenderer(this),U=A},this.dispose=function(){e.removeEventListener("webglcontextlost",Gt,!1),e.removeEventListener("webglcontextrestored",jt,!1),e.removeEventListener("webglcontextcreationerror",gt,!1),F.dispose(),Tt.dispose(),j.dispose(),qt.dispose(),zt.dispose(),P.dispose(),pt.dispose(),X.dispose(),vt.dispose(),Bt.dispose(),rt.dispose(),ht.dispose(),ht.removeEventListener("sessionstart",or),ht.removeEventListener("sessionend",ra),ci.stop()};function Gt(A){A.preventDefault(),qu("WebGLRenderer: Context Lost."),L=!0}function jt(){qu("WebGLRenderer: Context Restored."),L=!1;const A=fe.autoReset,k=St.enabled,J=St.autoUpdate,q=St.needsUpdate,Z=St.type;Qt(),fe.autoReset=A,St.enabled=k,St.autoUpdate=J,St.needsUpdate=q,St.type=Z}function gt(A){he("WebGLRenderer: A WebGL context could not be created. Reason: ",A.statusMessage)}function ue(A){const k=A.target;k.removeEventListener("dispose",ue),Oe(k)}function Oe(A){On(A),zt.remove(A)}function On(A){const k=zt.get(A).programs;k!==void 0&&(k.forEach(function(J){rt.releaseProgram(J)}),A.isShaderMaterial&&rt.releaseShaderCache(A))}this.renderBufferDirect=function(A,k,J,q,Z,W){k===null&&(k=Jt);const ot=Z.isMesh&&Z.matrixWorld.determinantAffine()<0,et=ha(A,k,J,q,Z);Et.setMaterial(q,ot);let $=J.index,mt=1;if(q.wireframe===!0){if($=X.getWireframeAttribute(J),$===void 0)return;mt=2}const It=J.drawRange,Ot=J.attributes.position;let ft=It.start*mt,Ut=(It.start+It.count)*mt;W!==null&&(ft=Math.max(ft,W.start*mt),Ut=Math.min(Ut,(W.start+W.count)*mt)),$!==null?(ft=Math.max(ft,0),Ut=Math.min(Ut,$.count)):Ot!=null&&(ft=Math.max(ft,0),Ut=Math.min(Ut,Ot.count));const Xt=Ut-ft;if(Xt<0||Xt===1/0)return;vt.setup(Z,q,et,J,$);let te,ne=Q;if($!==null&&(te=T.get($),ne=yt,ne.setIndex(te)),Z.isMesh)q.wireframe===!0?(Et.setLineWidth(q.wireframeLinewidth*$t()),ne.setMode(G.LINES)):ne.setMode(G.TRIANGLES);else if(Z.isLine){let ge=q.linewidth;ge===void 0&&(ge=1),Et.setLineWidth(ge*$t()),Z.isLineSegments?ne.setMode(G.LINES):Z.isLineLoop?ne.setMode(G.LINE_LOOP):ne.setMode(G.LINE_STRIP)}else Z.isPoints?ne.setMode(G.POINTS):Z.isSprite&&ne.setMode(G.TRIANGLES);if(Z.isBatchedMesh)if(se.get("WEBGL_multi_draw"))ne.renderMultiDraw(Z._multiDrawStarts,Z._multiDrawCounts,Z._multiDrawCount);else{const ge=Z._multiDrawStarts,Dt=Z._multiDrawCounts,xe=Z._multiDrawCount,ee=$?T.get($).bytesPerElement:1,Je=zt.get(q).currentProgram.getUniforms();for(let we=0;we<xe;we++)Je.setValue(G,"_gl_DrawID",we),ne.render(ge[we]/ee,Dt[we])}else if(Z.isInstancedMesh)ne.renderInstances(ft,Xt,Z.count);else if(J.isInstancedBufferGeometry){const ge=J._maxInstanceCount!==void 0?J._maxInstanceCount:1/0,Dt=Math.min(J.instanceCount,ge);ne.renderInstances(ft,Xt,Dt)}else ne.render(ft,Xt)};function sa(A,k,J,q){U!==null&&A.isNodeMaterial&&U.setObject(q,A),at===!0&&tt.setState(A,J,!1),A.transparent===!0&&A.side===Xn&&A.forceSinglePass===!1?(A.side=fn,A.needsUpdate=!0,Bn(A,k,q),A.side=cs,A.needsUpdate=!0,Bn(A,k,q),A.side=Xn):Bn(A,k,q)}this.compile=function(A,k,J=null){J===null&&(J=A),U!==null&&U.renderStart(A,k,J),E=j.get(J),E.init(k),y.push(E),J.traverseVisible(function(Z){Z.isLight&&Z.layers.test(k.layers)&&(E.pushLight(Z),Z.castShadow&&E.pushShadow(Z))}),A!==J&&A.traverseVisible(function(Z){Z.isLight&&Z.layers.test(k.layers)&&(E.pushLight(Z),Z.castShadow&&E.pushShadow(Z))}),E.setupLights(),U!==null&&U.updateLights(E.state.lightsArray),Rt=this.localClippingEnabled,at=tt.init(this.clippingPlanes,Rt),at===!0&&tt.setGlobalState(this.clippingPlanes,k),U!==null&&St.render(E.state.shadowsArray,J,k);const q=new Set;return A.traverse(function(Z){if(!(Z.isMesh||Z.isPoints||Z.isLine||Z.isSprite))return;const W=Z.material;if(W)if(Array.isArray(W))for(let ot=0;ot<W.length;ot++){const et=W[ot];sa(et,J,k,Z),q.add(et)}else sa(W,J,k,Z),q.add(W)}),E=y.pop(),U!==null&&U.renderEnd(),q},this.compileAsync=function(A,k,J=null){const q=this.compile(A,k,J);return new Promise(Z=>{function W(){if(q.forEach(function(ot){const $=zt.get(ot).currentProgram;($===void 0||$.isReady())&&q.delete(ot)}),q.size===0){Z(A);return}setTimeout(W,10)}se.get("KHR_parallel_shader_compile")!==null?W():setTimeout(W,10)})};let Fn=null;function ar(A){Fn&&Fn(A)}function or(){ci.stop()}function ra(){ci.start()}const ci=new Md;ci.setAnimationLoop(ar),typeof self<"u"&&ci.setContext(self),this.setAnimationLoop=function(A){Fn=A,ht.setAnimationLoop(A),A===null?ci.stop():ci.start()},ht.addEventListener("sessionstart",or),ht.addEventListener("sessionend",ra),this.render=function(A,k){if(k!==void 0&&k.isCamera!==!0){he("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;U!==null&&U.renderStart(A,k);const J=ht.enabled===!0&&ht.isPresenting===!0,q=C!==null&&(H===null||J)&&C.begin(R,H);if(A.matrixWorldAutoUpdate===!0&&A.updateMatrixWorld(),k.parent===null&&k.matrixWorldAutoUpdate===!0&&k.updateMatrixWorld(),ht.enabled===!0&&ht.isPresenting===!0&&(C===null||C.isCompositing()===!1)&&(ht.cameraAutoUpdate===!0&&ht.updateCamera(k),k=ht.getCamera()),A.isScene===!0&&A.onBeforeRender(R,A,k,H),E=j.get(A,y.length),E.init(k),E.state.textureUnits=qt.getTextureUnits(),y.push(E),xt.multiplyMatrices(k.projectionMatrix,k.matrixWorldInverse),k.isArrayCamera?dt.setFromArrayCamera(k):it.setFromProjectionMatrix(xt,Zn,k.reversedDepth),Rt=this.localClippingEnabled,at=tt.init(this.clippingPlanes,Rt),b=Tt.get(A,v.length),b.init(),v.push(b),this.info.render.frame++,ht.enabled===!0&&ht.isPresenting===!0){const ot=R.xr.getDepthSensingMesh();ot!==null&&lr(ot,k,-1/0,R.sortObjects)}lr(A,k,0,R.sortObjects),b.finish(),U!==null&&U.updateLights(E.state.lightsArray),R.sortObjects===!0&&b.sort(bt,Ht),Zt=ht.enabled===!1||ht.isPresenting===!1||ht.hasDepthSensing()===!1,Zt&&F.addToRenderList(b,A),this.info.autoReset===!0&&this.info.reset(),at===!0&&tt.beginShadows();const Z=E.state.shadowsArray;if(St.render(Z,A,k),at===!0&&tt.endShadows(),(q&&C.hasRenderPass())===!1){const ot=b.opaque,et=b.transmissive;if(E.setupLights(),k.isArrayCamera){const $=k.cameras;if(et.length>0)for(let mt=0,It=$.length;mt<It;mt++){const Ot=$[mt];oa(ot,et,A,Ot)}Zt&&F.render(A);for(let mt=0,It=$.length;mt<It;mt++){const Ot=$[mt];aa(b,A,Ot,Ot.viewport)}}else et.length>0&&oa(ot,et,A,k),Zt&&F.render(A),aa(b,A,k)}H!==null&&O===0&&(qt.updateMultisampleRenderTarget(H),qt.updateRenderTargetMipmap(H)),q&&C.end(R),A.isScene===!0&&A.onAfterRender(R,A,k),vt.resetDefaultState(),z=-1,V=null,y.pop(),y.length>0?(E=y[y.length-1],qt.setTextureUnits(E.state.textureUnits),at===!0&&tt.setGlobalState(R.clippingPlanes,E.state.camera)):E=null,v.pop(),v.length>0?b=v[v.length-1]:b=null,U!==null&&U.renderEnd()};function lr(A,k,J,q){if(A.visible===!1)return;if(A.layers.test(k.layers)){if(A.isGroup)J=A.renderOrder;else if(A.isLOD)A.autoUpdate===!0&&A.update(k);else if(A.isLight)E.pushLight(A),A.castShadow&&E.pushShadow(A);else if(A.isSprite){const ot=k.isArrayCamera?dt:it;if(!A.frustumCulled||A.intersectsFrustum(ot)){q&&Pt.setFromMatrixPosition(A.matrixWorld).applyMatrix4(xt);const et=pt.update(A),$=A.material;$.visible&&b.push(A,et,$,J,Pt.z,null,k)}}else if(A.isMesh||A.isLine||A.isPoints){const ot=k.isArrayCamera?dt:it;if(!A.frustumCulled||A.intersectsFrustum(ot)){const et=pt.update(A),$=A.material;if(q&&(A.boundingSphere!==void 0?(A.boundingSphere===null&&A.computeBoundingSphere(),Pt.copy(A.boundingSphere.center)):(et.boundingSphere===null&&et.computeBoundingSphere(),Pt.copy(et.boundingSphere.center)),Pt.applyMatrix4(A.matrixWorld).applyMatrix4(xt)),Array.isArray($)){const mt=et.groups;for(let It=0,Ot=mt.length;It<Ot;It++){const ft=mt[It],Ut=$[ft.materialIndex];Ut&&Ut.visible&&b.push(A,et,Ut,J,Pt.z,ft,k)}}else $.visible&&b.push(A,et,$,J,Pt.z,null,k)}}}const W=A.children;for(let ot=0,et=W.length;ot<et;ot++)lr(W[ot],k,J,q)}function aa(A,k,J,q){const{opaque:Z,transmissive:W,transparent:ot}=A;E.setupLightsView(J),at===!0&&tt.setGlobalState(R.clippingPlanes,J),q&&Et.viewport(Y.copy(q)),Z.length>0&&ms(Z,k,J),W.length>0&&ms(W,k,J),ot.length>0&&ms(ot,k,J),Et.buffers.depth.setTest(!0),Et.buffers.depth.setMask(!0),Et.buffers.color.setMask(!0),Et.setPolygonOffset(!1)}function oa(A,k,J,q){if((J.isScene===!0?J.overrideMaterial:null)!==null)return;if(E.state.transmissionRenderTarget[q.id]===void 0){const ft=se.has("EXT_color_buffer_half_float")||se.has("EXT_color_buffer_float");E.state.transmissionRenderTarget[q.id]=new pn(1,1,{generateMipmaps:!0,type:ft?dn:En,minFilter:Mi,samples:Math.max(4,_e.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:oe.workingColorSpace})}const W=E.state.transmissionRenderTarget[q.id],ot=q.viewport||Y;W.setSize(ot.z*R.transmissionResolutionScale,ot.w*R.transmissionResolutionScale);const et=R.getRenderTarget(),$=R.getActiveCubeFace(),mt=R.getActiveMipmapLevel();R.setRenderTarget(W),R.getClearColor(K),lt=R.getClearAlpha(),lt<1&&R.setClearColor(16777215,.5),R.clear(),Zt&&F.render(J);const It=R.toneMapping;R.toneMapping=yi;const Ot=q.viewport;if(q.viewport!==void 0&&(q.viewport=void 0),E.setupLightsView(q),at===!0&&tt.setGlobalState(R.clippingPlanes,q),ms(A,J,q),qt.updateMultisampleRenderTarget(W),qt.updateRenderTargetMipmap(W),se.has("WEBGL_multisampled_render_to_texture")===!1){let ft=!1;for(let Ut=0,Xt=k.length;Ut<Xt;Ut++){const te=k[Ut],{object:ne,geometry:ge,material:Dt,group:xe}=te;if(Dt.side===Xn&&ne.layers.test(q.layers)){const ee=Dt.side;Dt.side=fn,Dt.needsUpdate=!0,la(ne,J,q,ge,Dt,xe),Dt.side=ee,Dt.needsUpdate=!0,ft=!0}}ft===!0&&(qt.updateMultisampleRenderTarget(W),qt.updateRenderTargetMipmap(W))}R.setRenderTarget(et,$,mt),R.setClearColor(K,lt),Ot!==void 0&&(q.viewport=Ot),R.toneMapping=It}function ms(A,k,J){const q=k.isScene===!0?k.overrideMaterial:null;for(let Z=0,W=A.length;Z<W;Z++){const ot=A[Z],{object:et,geometry:$,group:mt}=ot;let It=ot.material;It.allowOverride===!0&&q!==null&&(It=q),et.layers.test(J.layers)&&la(et,k,J,$,It,mt)}}function la(A,k,J,q,Z,W){U!==null&&Z.isNodeMaterial&&U.setObject(A,Z),A.onBeforeRender(R,k,J,q,Z,W),A.modelViewMatrix.multiplyMatrices(J.matrixWorldInverse,A.matrixWorld),A.normalMatrix.getNormalMatrix(A.modelViewMatrix),Z.onBeforeRender(R,k,J,q,A,W),Z.transparent===!0&&Z.side===Xn&&Z.forceSinglePass===!1?(Z.side=fn,Z.needsUpdate=!0,R.renderBufferDirect(J,k,q,Z,A,W),Z.side=cs,Z.needsUpdate=!0,R.renderBufferDirect(J,k,q,Z,A,W),Z.side=Xn):R.renderBufferDirect(J,k,q,Z,A,W),A.onAfterRender(R,k,J,q,Z,W)}function ca(A){let k=0;for(const J of A)J.texture!==null&&k++;return k}function Bn(A,k,J){k.isScene!==!0&&(k=Jt);const q=zt.get(A),Z=E.state.lights,W=E.state.shadowsArray,ot=Z.state.version,et=rt.getParameters(A,Z.state,W,k,J,E.state.lightProbeGridArray),$=rt.getProgramCacheKey(et);let mt=q.programs;q.environment=A.isMeshStandardMaterial||A.isMeshLambertMaterial||A.isMeshPhongMaterial?k.environment:null,q.fog=k.fog;const It=A.isMeshStandardMaterial||A.isMeshLambertMaterial&&!A.envMap||A.isMeshPhongMaterial&&!A.envMap;q.envMap=P.get(A.envMap||q.environment,It),q.envMapRotation=q.environment!==null&&A.envMap===null?k.environmentRotation:A.envMapRotation,mt===void 0&&(A.addEventListener("dispose",ue),mt=new Map,q.programs=mt,q.programVariants=new Map);let Ot=mt.get($);if(Ot!==void 0){if(q.currentProgram===Ot&&q.lightsStateVersion===ot)return cr(A,et),Ot}else et.uniforms=rt.getUniforms(A),U!==null&&A.isNodeMaterial&&U.build(A,J,et),A.onBeforeCompile(et,R),Ot=rt.acquireProgram(et,$),mt.set($,Ot),q.uniforms=et.uniforms;const ft=q.uniforms;return(!A.isShaderMaterial&&!A.isRawShaderMaterial||A.clipping===!0)&&(ft.clippingPlanes=tt.uniform),cr(A,et),q.needsLights=ur(A),q.lightsStateVersion=ot,q.needsLights&&(ft.ambientLightColor.value=Z.state.ambient,ft.lightProbe.value=Z.state.probe,ft.sunLights.value=Z.state.sun,ft.sunLightShadows.value=Z.state.sunShadow,ft.directionalLights.value=Z.state.directional,ft.directionalLightShadows.value=Z.state.directionalShadow,ft.spotLights.value=Z.state.spot,ft.spotLightShadows.value=Z.state.spotShadow,ft.rectAreaLights.value=Z.state.rectArea,ft.ltc_1.value=Z.state.rectAreaLTC1,ft.ltc_2.value=Z.state.rectAreaLTC2,ft.pointLights.value=Z.state.point,ft.pointLightShadows.value=Z.state.pointShadow,ft.hemisphereLights.value=Z.state.hemi,ft.sunShadowMatrix.value=Z.state.sunShadowMatrix,ft.sunShadowCascade.value=Z.state.sunShadowCascade,ft.directionalShadowMatrix.value=Z.state.directionalShadowMatrix,ft.spotLightMatrix.value=Z.state.spotLightMatrix,ft.spotLightMap.value=Z.state.spotLightMap,ft.pointShadowMatrix.value=Z.state.pointShadowMatrix),q.numLightProbeGrids=ca(E.state.lightProbeGridArray),q.currentProgram=Ot,q.uniformsList=null,Ot}function Fo(A,k,J,q,Z){const W=zt.get(A),ot=W.currentProgram.id+","+q+","+Z;let et=W.programVariants.get(ot);return et===void 0?(et=Bn(A,k,J),W.programVariants.set(ot,et)):(W.currentProgram=et,W.uniformsList=null,W.outputColorSpace=q,W.toneMapping=Z),et}function ua(A){if(A.uniformsList===null){const k=A.currentProgram.getUniforms();A.uniformsList=Ka.seqWithValue(k.seq,A.uniforms)}return A.uniformsList}function cr(A,k){const J=zt.get(A);J.outputColorSpace=k.outputColorSpace,J.batching=k.batching,J.batchingColor=k.batchingColor,J.instancing=k.instancing,J.instancingColor=k.instancingColor,J.instancingMorph=k.instancingMorph,J.skinning=k.skinning,J.morphTargets=k.morphTargets,J.morphNormals=k.morphNormals,J.morphColors=k.morphColors,J.morphTargetsCount=k.morphTargetsCount,J.numClippingPlanes=k.numClippingPlanes,J.numIntersection=k.numClipIntersection,J.vertexAlphas=k.vertexAlphas,J.vertexTangents=k.vertexTangents,J.toneMapping=k.toneMapping}function ha(A,k,J,q,Z){k.isScene!==!0&&(k=Jt),qt.resetTextureUnits();const W=k.fog,ot=q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial?k.environment:null,et=H===null?R.outputColorSpace:H.isXRRenderTarget===!0?H.texture.colorSpace:oe.workingColorSpace,$=q.isMeshStandardMaterial||q.isMeshLambertMaterial&&!q.envMap||q.isMeshPhongMaterial&&!q.envMap,mt=P.get(q.envMap||ot,$),It=q.vertexColors===!0&&!!J.attributes.color&&J.attributes.color.itemSize===4,Ot=!!J.attributes.tangent&&(!!q.normalMap||q.anisotropy>0),ft=!!J.morphAttributes.position,Ut=!!J.morphAttributes.normal,Xt=!!J.morphAttributes.color;let te=yi;q.toneMapped&&(H===null||H.isXRRenderTarget===!0)&&(te=R.toneMapping);const ne=J.morphAttributes.position||J.morphAttributes.normal||J.morphAttributes.color,ge=ne!==void 0?ne.length:0,Dt=zt.get(q),xe=E.state.lights;if(at===!0&&(Rt===!0||A!==V)){const Me=A===V&&q.id===z;tt.setState(q,A,Me)}let ee=!1,Je=!1;q.version===Dt.__version?Dt.needsLights&&Dt.lightsStateVersion!==xe.state.version||Z.isBatchedMesh&&Dt.batching===!1||!Z.isBatchedMesh&&Dt.batching===!0||Z.isBatchedMesh&&Dt.batchingColor===!0&&Z._colorsTexture===null||Z.isBatchedMesh&&Dt.batchingColor===!1&&Z._colorsTexture!==null||Z.isInstancedMesh&&Dt.instancing===!1||!Z.isInstancedMesh&&Dt.instancing===!0||Z.isSkinnedMesh&&Dt.skinning===!1||!Z.isSkinnedMesh&&Dt.skinning===!0||Z.isInstancedMesh&&Dt.instancingColor===!0&&Z.instanceColor===null||Z.isInstancedMesh&&Dt.instancingColor===!1&&Z.instanceColor!==null||Z.isInstancedMesh&&Dt.instancingMorph===!0&&Z.morphTexture===null||Z.isInstancedMesh&&Dt.instancingMorph===!1&&Z.morphTexture!==null||Dt.envMap!==mt||q.fog===!0&&Dt.fog!==W||Dt.numClippingPlanes!==void 0&&(Dt.numClippingPlanes!==tt.numPlanes||Dt.numIntersection!==tt.numIntersection)||Dt.vertexAlphas!==It||Dt.vertexTangents!==Ot||Dt.morphTargets!==ft||Dt.morphNormals!==Ut||Dt.morphColors!==Xt||Dt.morphTargetsCount!==ge||Dt.numLightProbeGrids!==ca(E.state.lightProbeGridArray)?ee=!0:(Dt.outputColorSpace!==et||Dt.toneMapping!==te)&&(Je=!0):(ee=!0,Dt.__version=q.version);let we=Dt.currentProgram;(ee===!0||Je===!0)&&(we=Je===!0?Fo(q,k,Z,et,te):Bn(q,k,Z),U&&q.isNodeMaterial&&U.onUpdateProgram(q,we,Dt));let Ge=!1,be=!1,rn=!1;const ie=we.getUniforms(),Ne=Dt.uniforms;if(Et.useProgram(we.program)&&(Ge=!0,be=!0,rn=!0),q.id!==z&&(z=q.id,be=!0),Ge||V!==A){Et.buffers.depth.getReversed()&&A.reversedDepth!==!0&&(A._reversedDepth=!0,A.updateProjectionMatrix()),ie.setValue(G,"projectionMatrix",A.projectionMatrix),ie.setValue(G,"viewMatrix",A.matrixWorldInverse);const Be=ie.map.cameraPosition;Be!==void 0&&Be.setValue(G,kt.setFromMatrixPosition(A.matrixWorld)),_e.logarithmicDepthBuffer&&ie.setValue(G,"logDepthBufFC",2/(Math.log(A.far+1)/Math.LN2)),(q.isMeshPhongMaterial||q.isMeshToonMaterial||q.isMeshLambertMaterial||q.isMeshBasicMaterial||q.isMeshStandardMaterial||q.isShaderMaterial)&&ie.setValue(G,"isOrthographic",A.isOrthographicCamera===!0),V!==A&&(V=A,be=!0,rn=!0)}if(Dt.needsLights&&(xe.state.sunShadowMap.length>0&&ie.setValue(G,"sunShadowMap",xe.state.sunShadowMap,qt),xe.state.directionalShadowMap.length>0&&ie.setValue(G,"directionalShadowMap",xe.state.directionalShadowMap,qt),xe.state.spotShadowMap.length>0&&ie.setValue(G,"spotShadowMap",xe.state.spotShadowMap,qt),xe.state.pointShadowMap.length>0&&ie.setValue(G,"pointShadowMap",xe.state.pointShadowMap,qt)),Z.isSkinnedMesh){ie.setOptional(G,Z,"bindMatrix"),ie.setOptional(G,Z,"bindMatrixInverse");const Me=Z.skeleton;Me&&(Me.boneTexture===null&&Me.computeBoneTexture(),ie.setValue(G,"boneTexture",Me.boneTexture,qt))}Z.isBatchedMesh&&(ie.setOptional(G,Z,"batchingTexture"),ie.setValue(G,"batchingTexture",Z._matricesTexture,qt),ie.setOptional(G,Z,"batchingIdTexture"),ie.setValue(G,"batchingIdTexture",Z._indirectTexture,qt),ie.setOptional(G,Z,"batchingColorTexture"),Z._colorsTexture!==null&&ie.setValue(G,"batchingColorTexture",Z._colorsTexture,qt));const qe=J.morphAttributes;if((qe.position!==void 0||qe.normal!==void 0||qe.color!==void 0)&&nt.update(Z,J,we),(be||Dt.receiveShadow!==Z.receiveShadow)&&(Dt.receiveShadow=Z.receiveShadow,ie.setValue(G,"receiveShadow",Z.receiveShadow)),(q.isMeshStandardMaterial||q.isMeshLambertMaterial||q.isMeshPhongMaterial)&&q.envMap===null&&k.environment!==null&&(Ne.envMapIntensity.value=k.environmentIntensity),Ne.dfgLUT!==void 0&&(Ne.dfgLUT.value=KM()),be){if(ie.setValue(G,"toneMappingExposure",R.toneMappingExposure),Dt.needsLights&&_s(Ne,rn),W&&q.fog===!0&&Mt.refreshFogUniforms(Ne,W),Mt.refreshMaterialUniforms(Ne,q,st,Nt,E.state.transmissionRenderTarget[A.id]),Dt.needsLights&&Dt.numLightProbeGrids>0){const Me=S;let Be=0;for(const ui of E.state.lightProbeGridArray)ui.texture!==null&&(Me.textures[Be]=ui.texture,Me.min[Be]=ui.boundingBox.min,Me.max[Be]=ui.boundingBox.max,Me.resolution[Be]=ui.resolution,Be++);for(const ui in Me)Me[ui].length=Be;Ne.probesSH.value=Me.textures,Ne.probesMin.value=Me.min,Ne.probesMax.value=Me.max,Ne.probesResolution.value=Me.resolution}Ka.upload(G,ua(Dt),Ne,qt)}if(q.isShaderMaterial&&q.uniformsNeedUpdate===!0&&(Ka.upload(G,ua(Dt),Ne,qt),q.uniformsNeedUpdate=!1),q.isSpriteMaterial&&ie.setValue(G,"center",Z.center),ie.setValue(G,"modelViewMatrix",Z.modelViewMatrix),ie.setValue(G,"normalMatrix",Z.normalMatrix),ie.setValue(G,"modelMatrix",Z.matrixWorld),q.uniformsGroups!==void 0){const Me=q.uniformsGroups;for(let Be=0,ui=Me.length;Be<ui;Be++){const Ou=Me[Be];Bt.update(Ou,we),Bt.bind(Ou,we)}}return we}function _s(A,k){A.ambientLightColor.needsUpdate=k,A.lightProbe.needsUpdate=k,A.sunLights.needsUpdate=k,A.sunLightShadows.needsUpdate=k,A.directionalLights.needsUpdate=k,A.directionalLightShadows.needsUpdate=k,A.pointLights.needsUpdate=k,A.pointLightShadows.needsUpdate=k,A.spotLights.needsUpdate=k,A.spotLightShadows.needsUpdate=k,A.rectAreaLights.needsUpdate=k,A.hemisphereLights.needsUpdate=k}function ur(A){return A.isMeshLambertMaterial||A.isMeshToonMaterial||A.isMeshPhongMaterial||A.isMeshStandardMaterial||A.isShadowMaterial||A.isShaderMaterial&&A.lights===!0}this.getActiveCubeFace=function(){return D},this.getActiveMipmapLevel=function(){return O},this.getRenderTarget=function(){return H},this.setRenderTargetTextures=function(A,k,J){const q=zt.get(A);q.__autoAllocateDepthBuffer=A.resolveDepthBuffer===!1,q.__autoAllocateDepthBuffer===!1&&(q.__useRenderToTexture=!1),zt.get(A.texture).__webglTexture=k,zt.get(A.depthTexture).__webglTexture=q.__autoAllocateDepthBuffer?void 0:J,q.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(A,k){const J=zt.get(A);J.__webglFramebuffer=k,J.__useDefaultFramebuffer=k===void 0},this.setRenderTarget=function(A,k=0,J=0){H=A,D=k,O=J;let q=null,Z=!1,W=!1;if(A){const et=zt.get(A);if(et.__useDefaultFramebuffer!==void 0){Et.bindFramebuffer(G.FRAMEBUFFER,et.__webglFramebuffer),Y.copy(A.viewport),ut.copy(A.scissor),At=A.scissorTest,Et.viewport(Y),Et.scissor(ut),Et.setScissorTest(At),z=-1;return}else if(et.__webglFramebuffer===void 0)qt.setupRenderTarget(A);else if(et.__hasExternalTextures)qt.rebindTextures(A,zt.get(A.texture).__webglTexture,zt.get(A.depthTexture).__webglTexture);else if(A.depthBuffer){const It=A.depthTexture;if(et.__boundDepthTexture!==It){if(It!==null&&zt.has(It)&&(A.width!==It.image.width||A.height!==It.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");qt.setupDepthRenderbuffer(A)}}const $=A.texture;($.isData3DTexture||$.isDataArrayTexture||$.isCompressedArrayTexture)&&(W=!0);const mt=zt.get(A).__webglFramebuffer;A.isWebGLCubeRenderTarget?(Array.isArray(mt[k])?q=mt[k][J]:q=mt[k],Z=!0):A.samples>0&&qt.useMultisampledRTT(A)===!1?q=zt.get(A).__webglMultisampledFramebuffer:Array.isArray(mt)?q=mt[J]:q=mt,Y.copy(A.viewport),ut.copy(A.scissor),At=A.scissorTest}else Y.copy(Lt).multiplyScalar(st).floor(),ut.copy(Vt).multiplyScalar(st).floor(),At=Ft;if(J!==0&&(q=B),Et.bindFramebuffer(G.FRAMEBUFFER,q)&&Et.drawBuffers(A,q),Et.viewport(Y),Et.scissor(ut),Et.setScissorTest(At),Z){const et=zt.get(A.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_CUBE_MAP_POSITIVE_X+k,et.__webglTexture,J)}else if(W){const et=k;for(let $=0;$<A.textures.length;$++){const mt=zt.get(A.textures[$]);G.framebufferTextureLayer(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0+$,mt.__webglTexture,J,et)}}else if(A!==null&&J!==0){const et=zt.get(A.texture);G.framebufferTexture2D(G.FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,et.__webglTexture,J)}z=-1};function hr(A){const k=zt.get(A);return(k.__readFormat!==A.format||k.__readType!==A.type)&&(k.__readFormat=A.format,k.__readType=A.type,k.__formatReadable=_e.textureFormatReadable(A.format),k.__typeReadable=_e.textureTypeReadable(A.type)),k}this.readRenderTargetPixels=function(A,k,J,q,Z,W,ot,et=0){if(!(A&&A.isWebGLRenderTarget)){he("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let $=zt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ot!==void 0&&($=$[ot],Array.isArray($)&&($=$[0])),$){Et.bindFramebuffer(G.FRAMEBUFFER,$);try{const mt=A.textures[et],It=mt.format,Ot=mt.type;A.textures.length>1&&G.readBuffer(G.COLOR_ATTACHMENT0+et);const ft=hr(mt);if(ft.__formatReadable===!1){he("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(ft.__typeReadable===!1){he("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}k>=0&&k<=A.width-q&&J>=0&&J<=A.height-Z&&G.readPixels(k,J,q,Z,_t.convert(It),_t.convert(Ot),W)}finally{const mt=H!==null?zt.get(H).__webglFramebuffer:null;Et.bindFramebuffer(G.FRAMEBUFFER,mt)}}},this.readRenderTargetPixelsAsync=async function(A,k,J,q,Z,W,ot,et=0){if(!(A&&A.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let $=zt.get(A).__webglFramebuffer;if(A.isWebGLCubeRenderTarget&&ot!==void 0&&($=$[ot],Array.isArray($)&&($=$[0])),$)if(k>=0&&k<=A.width-q&&J>=0&&J<=A.height-Z){Et.bindFramebuffer(G.FRAMEBUFFER,$);const mt=A.textures[et],It=mt.format,Ot=mt.type;A.textures.length>1&&G.readBuffer(G.COLOR_ATTACHMENT0+et);const ft=hr(mt);if(ft.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(ft.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Ut=G.createBuffer();G.bindBuffer(G.PIXEL_PACK_BUFFER,Ut),G.bufferData(G.PIXEL_PACK_BUFFER,W.byteLength,G.STREAM_READ),G.readPixels(k,J,q,Z,_t.convert(It),_t.convert(Ot),0),G.bindBuffer(G.PIXEL_PACK_BUFFER,null);const Xt=H!==null?zt.get(H).__webglFramebuffer:null;Et.bindFramebuffer(G.FRAMEBUFFER,Xt);const te=G.fenceSync(G.SYNC_GPU_COMMANDS_COMPLETE,0);return G.flush(),await ym(G,te,4),G.bindBuffer(G.PIXEL_PACK_BUFFER,Ut),G.getBufferSubData(G.PIXEL_PACK_BUFFER,0,W),G.bindBuffer(G.PIXEL_PACK_BUFFER,null),G.deleteBuffer(Ut),G.deleteSync(te),W}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(A,k=null,J=0){const q=Math.pow(2,-J),Z=Math.floor(A.image.width*q),W=Math.floor(A.image.height*q),ot=k!==null?k.x:0,et=k!==null?k.y:0;qt.setTexture2D(A,0),G.copyTexSubImage2D(G.TEXTURE_2D,J,0,0,ot,et,Z,W),Et.unbindTexture()},this.copyTextureToTexture=function(A,k,J=null,q=null,Z=0,W=0){let ot,et,$,mt,It,Ot,ft,Ut,Xt;const te=A.isCompressedTexture?A.mipmaps[W]:A.image;if(J!==null)ot=J.max.x-J.min.x,et=J.max.y-J.min.y,$=J.isBox3?J.max.z-J.min.z:1,mt=J.min.x,It=J.min.y,Ot=J.isBox3?J.min.z:0;else{const ie=Math.pow(2,-Z);ot=Math.floor(te.width*ie),et=Math.floor(te.height*ie),A.isDataArrayTexture?$=te.depth:A.isData3DTexture?$=Math.floor(te.depth*ie):$=1,mt=0,It=0,Ot=0}q!==null?(ft=q.x,Ut=q.y,Xt=q.z):(ft=0,Ut=0,Xt=0);const ne=_t.convert(k.format),ge=_t.convert(k.type);let Dt;k.isData3DTexture?(qt.setTexture3D(k,0),Dt=G.TEXTURE_3D):k.isDataArrayTexture||k.isCompressedArrayTexture?(qt.setTexture2DArray(k,0),Dt=G.TEXTURE_2D_ARRAY):(qt.setTexture2D(k,0),Dt=G.TEXTURE_2D),Et.activeTexture(G.TEXTURE0),Et.pixelStorei(G.UNPACK_FLIP_Y_WEBGL,k.flipY),Et.pixelStorei(G.UNPACK_PREMULTIPLY_ALPHA_WEBGL,k.premultiplyAlpha),Et.pixelStorei(G.UNPACK_ALIGNMENT,k.unpackAlignment);const xe=Et.getParameter(G.UNPACK_ROW_LENGTH),ee=Et.getParameter(G.UNPACK_IMAGE_HEIGHT),Je=Et.getParameter(G.UNPACK_SKIP_PIXELS),we=Et.getParameter(G.UNPACK_SKIP_ROWS),Ge=Et.getParameter(G.UNPACK_SKIP_IMAGES);Et.pixelStorei(G.UNPACK_ROW_LENGTH,te.width),Et.pixelStorei(G.UNPACK_IMAGE_HEIGHT,te.height),Et.pixelStorei(G.UNPACK_SKIP_PIXELS,mt),Et.pixelStorei(G.UNPACK_SKIP_ROWS,It),Et.pixelStorei(G.UNPACK_SKIP_IMAGES,Ot);const be=A.isDataArrayTexture||A.isData3DTexture,rn=k.isDataArrayTexture||k.isData3DTexture;if(A.isDepthTexture){const ie=zt.get(A),Ne=zt.get(k),qe=zt.get(ie.__renderTarget),Me=zt.get(Ne.__renderTarget);Et.bindFramebuffer(G.READ_FRAMEBUFFER,qe.__webglFramebuffer),Et.bindFramebuffer(G.DRAW_FRAMEBUFFER,Me.__webglFramebuffer);for(let Be=0;Be<$;Be++)be&&(G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,zt.get(A).__webglTexture,Z,Ot+Be),G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,zt.get(k).__webglTexture,W,Xt+Be)),G.blitFramebuffer(mt,It,mt+ot,It+et,ft,Ut,ft+ot,Ut+et,G.DEPTH_BUFFER_BIT,G.NEAREST);Et.bindFramebuffer(G.READ_FRAMEBUFFER,null),Et.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else if(Z!==0||A.isRenderTargetTexture||zt.has(A)){const ie=zt.get(A),Ne=zt.get(k);Et.bindFramebuffer(G.READ_FRAMEBUFFER,w),Et.bindFramebuffer(G.DRAW_FRAMEBUFFER,I);for(let qe=0;qe<$;qe++)be?G.framebufferTextureLayer(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,ie.__webglTexture,Z,Ot+qe):G.framebufferTexture2D(G.READ_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,ie.__webglTexture,Z),rn?G.framebufferTextureLayer(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,Ne.__webglTexture,W,Xt+qe):G.framebufferTexture2D(G.DRAW_FRAMEBUFFER,G.COLOR_ATTACHMENT0,G.TEXTURE_2D,Ne.__webglTexture,W),Z!==0?G.blitFramebuffer(mt,It,mt+ot,It+et,ft,Ut,ft+ot,Ut+et,G.COLOR_BUFFER_BIT,G.NEAREST):rn?G.copyTexSubImage3D(Dt,W,ft,Ut,Xt+qe,mt,It,ot,et):G.copyTexSubImage2D(Dt,W,ft,Ut,mt,It,ot,et);Et.bindFramebuffer(G.READ_FRAMEBUFFER,null),Et.bindFramebuffer(G.DRAW_FRAMEBUFFER,null)}else rn?A.isDataTexture||A.isData3DTexture?G.texSubImage3D(Dt,W,ft,Ut,Xt,ot,et,$,ne,ge,te.data):k.isCompressedArrayTexture?G.compressedTexSubImage3D(Dt,W,ft,Ut,Xt,ot,et,$,ne,te.data):G.texSubImage3D(Dt,W,ft,Ut,Xt,ot,et,$,ne,ge,te):A.isDataTexture?G.texSubImage2D(G.TEXTURE_2D,W,ft,Ut,ot,et,ne,ge,te.data):A.isCompressedTexture?G.compressedTexSubImage2D(G.TEXTURE_2D,W,ft,Ut,te.width,te.height,ne,te.data):G.texSubImage2D(G.TEXTURE_2D,W,ft,Ut,ot,et,ne,ge,te);Et.pixelStorei(G.UNPACK_ROW_LENGTH,xe),Et.pixelStorei(G.UNPACK_IMAGE_HEIGHT,ee),Et.pixelStorei(G.UNPACK_SKIP_PIXELS,Je),Et.pixelStorei(G.UNPACK_SKIP_ROWS,we),Et.pixelStorei(G.UNPACK_SKIP_IMAGES,Ge),W===0&&k.generateMipmaps===!0&&k.mipmapsAutoUpdate===!0&&G.generateMipmap(Dt),Et.unbindTexture()},this.initRenderTarget=function(A){zt.get(A).__webglFramebuffer===void 0&&qt.setupRenderTarget(A)},this.initTexture=function(A){A.isCubeTexture?qt.setTextureCube(A,0):A.isData3DTexture?qt.setTexture3D(A,0):A.isDataArrayTexture||A.isCompressedArrayTexture?qt.setTexture2DArray(A,0):qt.setTexture2D(A,0),Et.unbindTexture()},this.resetState=function(){D=0,O=0,H=null,Et.reset(),vt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Zn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=oe._getDrawingBufferColorSpace(t),e.unpackColorSpace=oe._getUnpackColorSpace()}}const Qh={type:"change"},fu={type:"start"},Dd={type:"end"},ka=new Ao,jh=new gi,$M=Math.cos(70*pc.DEG2RAD),He=new N,ln=2*Math.PI,de={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},gl=1e-6;class QM extends ng{constructor(t,e=null){super(t,e),this.state=de.NONE,this.target=new N,this.cursor=new N,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Bs.ROTATE,MIDDLE:Bs.DOLLY,RIGHT:Bs.PAN},this.touches={ONE:Is.ROTATE,TWO:Is.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new N,this._lastQuaternion=new Jn,this._lastTargetPosition=new N,this._quat=new Jn().setFromUnitVectors(t.up,new N(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new vc,this._sphericalDelta=new vc,this._scale=1,this._panOffset=new N,this._rotateStart=new ct,this._rotateEnd=new ct,this._rotateDelta=new ct,this._panStart=new ct,this._panEnd=new ct,this._panDelta=new ct,this._dollyStart=new ct,this._dollyEnd=new ct,this._dollyDelta=new ct,this._dollyDirection=new N,this._mouse=new ct,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=tS.bind(this),this._onPointerDown=jM.bind(this),this._onPointerUp=eS.bind(this),this._onContextMenu=lS.bind(this),this._onMouseWheel=sS.bind(this),this._onKeyDown=rS.bind(this),this._onTouchStart=aS.bind(this),this._onTouchMove=oS.bind(this),this._onMouseDown=nS.bind(this),this._onMouseMove=iS.bind(this),this._interceptControlDown=cS.bind(this),this._interceptControlUp=uS.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.ownerDocument.addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=de.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.ownerDocument.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Qh),this.update(),this.state=de.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){const e=this.object.position;He.copy(e).sub(this.target),He.applyQuaternion(this._quat),this._spherical.setFromVector3(He),this.autoRotate&&this.state===de.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,i=this.maxAzimuthAngle;isFinite(n)&&isFinite(i)&&(n<-Math.PI?n+=ln:n>Math.PI&&(n-=ln),i<-Math.PI?i+=ln:i>Math.PI&&(i-=ln),n<=i?this._spherical.theta=Math.max(n,Math.min(i,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+i)/2?Math.max(n,this._spherical.theta):Math.min(i,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(He.setFromSpherical(this._spherical),He.applyQuaternion(this._quatInverse),e.copy(this.target).add(He),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=He.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new N(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new N(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=He.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(ka.origin.copy(this.object.position),ka.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(ka.direction))<$M?this.object.lookAt(this.target):(jh.setFromNormalAndCoplanarPoint(this.object.up,this.target),ka.intersectPlane(jh,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>gl||8*(1-this._lastQuaternion.dot(this.object.quaternion))>gl||this._lastTargetPosition.distanceToSquared(this.target)>gl?(this.dispatchEvent(Qh),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?ln/60*this.autoRotateSpeed*t:ln/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){He.setFromMatrixColumn(e,0),He.multiplyScalar(-t),this._panOffset.add(He)}_panUp(t,e){this.screenSpacePanning===!0?He.setFromMatrixColumn(e,1):(He.setFromMatrixColumn(e,0),He.crossVectors(this.object.up,He)),He.multiplyScalar(t),this._panOffset.add(He)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const i=this.object.position;He.copy(i).sub(this.target);let r=He.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),i=t-n.left,r=e-n.top,a=n.width,o=n.height;this._mouse.x=i/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientY),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(ln*this._rotateDelta.x/e.clientHeight),this._rotateUp(ln*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.zoomToCursor&&(this._performCursorZoom=!0,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(ln*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-ln*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(ln*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-ln*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._rotateStart.set(n,i)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._panStart.set(n,i)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,i=t.pageY-e.y,r=Math.sqrt(n*n+i*i);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),i=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(i,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(ln*this._rotateDelta.x/e.clientHeight),this._rotateUp(ln*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._panEnd.set(n,i)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,i=t.pageY-e.y,r=Math.sqrt(n*n+i*i);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(t.pageX+e.x)*.5,o=(t.pageY+e.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new ct,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function jM(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function tS(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function eS(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Dd),this.state=de.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function nS(s){let t;switch(s.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Bs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=de.DOLLY;break;case Bs.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=de.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=de.ROTATE}break;case Bs.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=de.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=de.PAN}break;default:this.state=de.NONE}this.state!==de.NONE&&this.dispatchEvent(fu)}function iS(s){switch(this.state){case de.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case de.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case de.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function sS(s){this.enabled===!1||this.enableZoom===!1||this.state!==de.NONE||(s.preventDefault(),this.dispatchEvent(fu),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(Dd))}function rS(s){this.enabled!==!1&&this._handleKeyDown(s)}function aS(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case Is.ROTATE:if(this.enableRotate===!1){this.state=de.NONE;break}this._handleTouchStartRotate(s),this.state=de.TOUCH_ROTATE;break;case Is.PAN:if(this.enablePan===!1){this.state=de.NONE;break}this._handleTouchStartPan(s),this.state=de.TOUCH_PAN;break;default:this.state=de.NONE}break;case 2:switch(this.touches.TWO){case Is.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=de.TOUCH_DOLLY_PAN;break;case Is.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=de.TOUCH_DOLLY_ROTATE;break;default:this.state=de.NONE}break;default:this.state=de.NONE}this.state!==de.NONE&&this.dispatchEvent(fu)}function oS(s){switch(this._trackPointer(s),this.state){case de.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case de.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case de.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case de.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=de.NONE}}function lS(s){this.enabled!==!1&&s.preventDefault()}function cS(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.ownerDocument.addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function uS(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class hS extends Ve{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new ct(.5,.5),this.rotation2D=0,this.addEventListener("removed",function(){this.traverse(function(e){e.element&&e.element instanceof e.element.ownerDocument.defaultView.Element&&e.element.parentNode!==null&&e.element.remove()})})}copy(t,e){return super.copy(t,e),this.element=t.element.cloneNode(!0),this.center=t.center,this.rotation2D=t.rotation2D,this}}const Ds=new N,tf=new le,ef=new le,nf=new N,sf=new N;class fS{constructor(t={}){const e=this;let n,i,r,a;const o={objects:new WeakMap},l=t.element!==void 0?t.element:document.createElement("div");l.style.overflow="hidden",this.domElement=l,this.sortObjects=!0,this.getSize=function(){return{width:n,height:i}},this.render=function(g,_){g.matrixWorldAutoUpdate===!0&&g.updateMatrixWorld(),_.parent===null&&_.matrixWorldAutoUpdate===!0&&_.updateMatrixWorld(),tf.copy(_.matrixWorldInverse),ef.multiplyMatrices(_.projectionMatrix,tf),u(g,g,_),this.sortObjects&&d(g)},this.setSize=function(g,_){n=g,i=_,r=n/2,a=i/2,l.style.width=g+"px",l.style.height=_+"px"};function c(g){g.isCSS2DObject&&(g.element.style.display="none");for(let _=0,p=g.children.length;_<p;_++)c(g.children[_])}function u(g,_,p){if(g.visible===!1){c(g);return}if(g.isCSS2DObject){Ds.setFromMatrixPosition(g.matrixWorld),Ds.applyMatrix4(ef);const m=Ds.z>=-1&&Ds.z<=1&&g.layers.test(p.layers)===!0,x=g.element;if(x.style.display=m===!0?"":"none",m===!0){g.onBeforeRender(e,_,p);const S=100*g.center.x,b=100*g.center.y;x.style.transformOrigin=`${S}% ${b}%`;const E=-g.rotation2D,v=Ds.x*r+r,y=-Ds.y*a+a;x.style.transform=`translate(${-S}%, ${-b}%) translate(${v}px, ${y}px) rotate(${E}rad)`,x.parentNode!==l&&l.appendChild(x),g.onAfterRender(e,_,p)}const M={distanceToCameraSquared:f(p,g)};o.objects.set(g,M)}for(let m=0,x=g.children.length;m<x;m++)u(g.children[m],_,p)}function f(g,_){return nf.setFromMatrixPosition(g.matrixWorld),sf.setFromMatrixPosition(_.matrixWorld),nf.distanceToSquared(sf)}function h(g){const _=[];return g.traverseVisible(function(p){p.isCSS2DObject&&_.push(p)}),_}function d(g){const _=h(g).sort(function(m,x){if(m.renderOrder!==x.renderOrder)return x.renderOrder-m.renderOrder;const M=o.objects.get(m).distanceToCameraSquared,S=o.objects.get(x).distanceToCameraSquared;return M-S}),p=_.length;for(let m=0,x=_.length;m<x;m++)_[m].element.style.zIndex=p-m}}}const Ja={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class rr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const dS=new Po(-1,1,1,-1,0,1);class pS extends Ze{constructor(){super(),this.setAttribute("position",new me([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new me([0,2,0,0,2,0],2))}}const mS=new pS;class du{constructor(t){this._mesh=new vn(mS,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,dS)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class _S extends rr{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof hn?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=qr.clone(t.uniforms),this.material=new hn({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new du(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class rf extends rr{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const i=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class gS extends rr{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class xS{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new ct);this._width=n.width,this._height=n.height,e=new pn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:dn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new _S(Ja),this.copyPass.material.blending=ss,this.timer=new j_}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const a=this.passes[i];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}rf!==void 0&&(a instanceof rf?n=!0:a instanceof gS&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new ct);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}const Ga={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class vS extends rr{constructor(){super(),this.isOutputPass=!0,this.uniforms=qr.clone(Ga.uniforms),this.material=new gd({name:Ga.name,uniforms:this.uniforms,vertexShader:Ga.vertexShader,fragmentShader:Ga.fragmentShader}),this._fsQuad=new du(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},oe.getTransfer(this._outputColorSpace)===pe&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===Fc?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===Bc?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===zc?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===wo?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Gc?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Hc?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===kc&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class MS extends rr{constructor(t,e,n=null,i=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Wt}render(t,e,n){const i=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=i}}const SS={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Wt(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class Ks extends rr{constructor(t,e=1,n,i){super(),this.strength=e,this.radius=n,this.threshold=i,this.resolution=t!==void 0?new ct(t.x,t.y):new ct(256,256),this.clearColor=new Wt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new pn(r,a,{type:dn,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const f=new pn(r,a,{type:dn,depthBuffer:!1});f.texture.name="UnrealBloomPass.h"+u,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const h=new pn(r,a,{type:dn,depthBuffer:!1});h.texture.name="UnrealBloomPass.v"+u,h.texture.generateMipmaps=!1,this.renderTargetsVertical.push(h),r=Math.round(r/2),a=Math.round(a/2)}const o=SS;this.highPassUniforms=qr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new hn({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new ct(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new N(1,1,1),new N(1,1,1),new N(1,1,1),new N(1,1,1),new N(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=qr.clone(Ja.uniforms),this.blendMaterial=new hn({uniforms:this.copyUniforms,vertexShader:Ja.vertexShader,fragmentShader:Ja.fragmentShader,premultipliedAlpha:!0,blending:Al,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Wt,this._oldClearAlpha=1,this._basic=new Kn,this._fsQuad=new du(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),i=Math.round(e/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new ct(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(t,e,n,i,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=Ks.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Ks.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=a}_getSeparableBlurMaterial(t){const e=[],n=t/3;for(let a=0;a<t;a++)e.push(.39894*Math.exp(-.5*a*a/(n*n))/n);const i=[],r=[];for(let a=1;a<t;a+=2){const o=e[a],l=a+1<t?e[a+1]:0,c=o+l;i.push((a*o+(a+1)*l)/c),r.push(c)}return new hn({defines:{KERNEL_PAIRS:i.length},uniforms:{colorTexture:{value:null},invSize:{value:new ct(.5,.5)},direction:{value:new ct(.5,.5)},centerWeight:{value:e[0]},gaussianOffsets:{value:i},gaussianWeights:{value:r}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float centerWeight;
				uniform float gaussianOffsets[KERNEL_PAIRS];
				uniform float gaussianWeights[KERNEL_PAIRS];

				void main() {

					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * centerWeight;

					for ( int i = 0; i < KERNEL_PAIRS; i ++ ) {

						vec2 uvOffset = direction * invSize * gaussianOffsets[ i ];
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * gaussianWeights[ i ];

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(t){return new hn({defines:{NUM_MIPS:t},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}Ks.BlurDirectionX=new ct(1,0);Ks.BlurDirectionY=new ct(0,1);function _i(s){if(s===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return s}function Ld(s,t){s.prototype=Object.create(t.prototype),s.prototype.constructor=s,s.__proto__=t}/*!
 * GSAP 3.15.1
 * https://gsap.com
 *
 * @license Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var Rn={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},Yr={duration:.5,overwrite:!1,delay:0},pu,Qe,Te,In=1e8,ve=1/In,Sc=Math.PI*2,yS=Sc/4,bS=0,Nd=Math.sqrt,ES=Math.cos,TS=Math.sin,Ke=function(t){return typeof t=="string"},Ue=function(t){return typeof t=="function"},Ti=function(t){return typeof t=="number"},mu=function(t){return typeof t>"u"},oi=function(t){return typeof t=="object"},mn=function(t){return t!==!1},_u=function(){return typeof window<"u"},Ha=function(t){return Ue(t)||Ke(t)},Id=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},sn=Array.isArray,wS=/random\([^)]+\)/g,AS=/,\s*/g,af=/(?:-?\.?\d|\.)+/gi,Ud=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,Os=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,xl=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,Od=/[+-]=-?[.\d]+/,RS=/[^,'"\[\]\s]+/gi,CS=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,Ce,ei,yc,gu,Cn={},fo={},Fd,Bd=function(t){return(fo=Js(t,Cn))&&Mn},xu=function(t,e){return console.warn("Invalid property",t,"set to",e,"Missing plugin? gsap.registerPlugin()")},Zr=function(t,e){return!e&&console.warn(t)},zd=function(t,e){return t&&(Cn[t]=e)&&fo&&(fo[t]=e)||Cn},Kr=function(){return 0},PS={suppressEvents:!0,isStart:!0,kill:!1},$a={suppressEvents:!0,kill:!1},DS={suppressEvents:!0},vu={},ki=[],bc={},kd,bn={},vl={},of=30,Qa=[],Mu="",Su=function(t){var e=t[0],n,i;if(oi(e)||Ue(e)||(t=[t]),!(n=(e._gsap||{}).harness)){for(i=Qa.length;i--&&!Qa[i].targetTest(e););n=Qa[i]}for(i=t.length;i--;)t[i]&&(t[i]._gsap||(t[i]._gsap=new lp(t[i],n)))||t.splice(i,1);return t},rs=function(t){return t._gsap||Su(Un(t))[0]._gsap},Gd=function(t,e,n){return(n=t[e])&&Ue(n)?t[e]():mu(n)&&t.getAttribute&&t.getAttribute(e)||n},_n=function(t,e){return(t=t.split(",")).forEach(e)||t},Fe=function(t){return Math.round(t*1e5)/1e5||0},Re=function(t){return Math.round(t*1e7)/1e7||0},Gs=function(t,e){var n=e.charAt(0),i=parseFloat(e.substr(2));return t=parseFloat(t),n==="+"?t+i:n==="-"?t-i:n==="*"?t*i:t/i},LS=function(t,e){for(var n=e.length,i=0;t.indexOf(e[i])<0&&++i<n;);return i<n},po=function(){var t=ki.length,e=ki.slice(0),n,i;for(bc={},ki.length=0,n=0;n<t;n++)i=e[n],i&&i._lazy&&(i.render(i._lazy[0],i._lazy[1],!0)._lazy=0)},yu=function(t){return!!(t._initted||t._startAt||t.add)},Hd=function(t,e,n,i){ki.length&&!Qe&&po(),t.render(e,n,!!(Qe&&e<0&&yu(t))),ki.length&&!Qe&&po()},Vd=function(t){var e=parseFloat(t);return(e||e===0)&&(t+"").match(RS).length<2?e:Ke(t)?t.trim():t},Wd=function(t){return t},Pn=function(t,e){for(var n in e)n in t||(t[n]=e[n]);return t},NS=function(t){return function(e,n){for(var i in n)i in e||i==="duration"&&t||i==="ease"||(e[i]=n[i])}},Js=function(t,e){for(var n in e)t[n]=e[n];return t},lf=function s(t,e){for(var n in e)n!=="__proto__"&&n!=="constructor"&&n!=="prototype"&&(t[n]=oi(e[n])?s(t[n]||(t[n]={}),e[n]):e[n]);return t},mo=function(t,e){var n={},i;for(i in t)i in e||(n[i]=t[i]);return n},Ir=function(t){var e=t.parent||Ce,n=t.keyframes?NS(sn(t.keyframes)):Pn;if(mn(t.inherit))for(;e;)n(t,e.vars.defaults),e=e.parent||e._dp;return t},IS=function(t,e){for(var n=t.length,i=n===e.length;i&&n--&&t[n]===e[n];);return n<0},Xd=function(t,e,n,i,r){var a=t[i],o;if(r)for(o=e[r];a&&a[r]>o;)a=a._prev;return a?(e._next=a._next,a._next=e):(e._next=t[n],t[n]=e),e._next?e._next._prev=e:t[i]=e,e._prev=a,e.parent=e._dp=t,e},No=function(t,e,n,i){n===void 0&&(n="_first"),i===void 0&&(i="_last");var r=e._prev,a=e._next;r?r._next=a:t[n]===e&&(t[n]=a),a?a._prev=r:t[i]===e&&(t[i]=r),e._next=e._prev=e.parent=null},Vi=function(t,e){t.parent&&(!e||t.parent.autoRemoveChildren)&&t.parent.remove&&t.parent.remove(t),t._act=0},as=function(t,e){if(t&&(!e||e._end>t._dur||e._start<0))for(var n=t;n;)n._dirty=1,n=n.parent;return t},US=function(t){for(var e=t.parent;e&&e.parent;)e._dirty=1,e.totalDuration(),e=e.parent;return t},Ec=function(t,e,n,i){return t._startAt&&(Qe?t._startAt.revert($a):t.vars.immediateRender&&!t.vars.autoRevert||t._startAt.render(e,!0,i))},OS=function s(t){return!t||t._ts&&s(t.parent)},cf=function(t){return t._repeat?$s(t._tTime,t=t.duration()+t._rDelay)*t:0},$s=function(t,e){var n=Math.floor(t=Re(t/e));return t&&n===t?n-1:n},_o=function(t,e){return(t-e._start)*e._ts+(e._ts>=0?0:e._dirty?e.totalDuration():e._tDur)},Io=function(t){return t._end=Re(t._start+(t._tDur/Math.abs(t._ts||t._rts||ve)||0))},Uo=function(t,e){var n=t._dp;return n&&n.smoothChildTiming&&t._ts&&(t._start=Re(n._time-(t._ts>0?e/t._ts:((t._dirty?t.totalDuration():t._tDur)-e)/-t._ts)),Io(t),n._dirty||as(n,t)),t},qd=function(t,e){var n;if((e._time||!e._dur&&e._initted||e._start<t._time&&(e._dur||!e.add))&&(n=_o(t.rawTime(),e),(!e._dur||ia(0,e.totalDuration(),n)-e._tTime>ve)&&e.render(n,!0)),as(t,e)._dp&&t._initted&&t._time>=t._dur&&t._ts){if(t._dur<t.duration())for(n=t;n._dp;)n.rawTime()>=0&&n.totalTime(n._tTime),n=n._dp;t._zTime=-ve}},ii=function(t,e,n,i){return e.parent&&Vi(e),e._start=Re((Ti(n)?n:!n&&go(e)&&(!t._last||t._last._start>=t._time)?t._last?t._last._start:t._time:n||t!==Ce?Nn(t,n,e):t._time)+e._delay),e._end=Re(e._start+(e.totalDuration()/Math.abs(e.timeScale())||0)),Xd(t,e,"_first","_last",t._sort?"_start":0),go(e)||(t._recent=e),i||qd(t,e),t._ts<0&&Uo(t,t._tTime),t},Yd=function(t,e){return(Cn.ScrollTrigger||xu("scrollTrigger",e))&&Cn.ScrollTrigger.create(e,t)},Zd=function(t,e,n,i,r){if(Eu(t,e,r),!t._initted)return 1;if(!n&&t._pt&&!Qe&&(t._dur&&t.vars.lazy!==!1||!t._dur&&t.vars.lazy)&&kd!==Tn.frame)return ki.push(t),t._lazy=[r,i],1},FS=function s(t){var e=t.parent;return e&&e._ts&&e._initted&&!e._lock&&(e.rawTime()<0||s(e))},go=function(t){var e=t.data;return e==="isFromStart"||e==="isStart"},BS=function(t,e,n,i){var r=t.ratio,a=e<0||!e&&(!t._start&&FS(t)&&!(!t._initted&&go(t))||(t._ts<0||t._dp._ts<0)&&!go(t))?0:1,o=t._rDelay,l=0,c,u,f;if(o&&t._repeat&&(l=ia(0,t._tDur,e),u=$s(l,o),t._yoyo&&u&1&&(a=1-a),u!==$s(t._tTime,o)&&(r=1-a,t.vars.repeatRefresh&&t._initted&&t.invalidate())),a!==r||Qe||i||t._zTime===ve||!e&&t._zTime){if(!t._initted&&Zd(t,e,i,n,l))return;for(f=t._zTime,t._zTime=e||(n?ve:0),n||(n=e&&!f),t.ratio=a,t._from&&(a=1-a),t._time=0,t._tTime=l,c=t._pt;c;)c.r(a,c.d),c=c._next;e<0&&Ec(t,e,n,!0),t._onUpdate&&!n&&wn(t,"onUpdate"),l&&t._repeat&&!n&&t.parent&&wn(t,"onRepeat"),(e>=t._tDur||e<0)&&t.ratio===a&&(a&&Vi(t,1),!n&&!Qe&&(wn(t,a?"onComplete":"onReverseComplete",!0),t._prom&&t._prom()))}else t._zTime||(t._zTime=e)},zS=function(t,e,n){var i;if(n>e)for(i=t._first;i&&i._start<=n;){if(i.data==="isPause"&&i._start>e)return i;i=i._next}else for(i=t._last;i&&i._start>=n;){if(i.data==="isPause"&&i._start<e)return i;i=i._prev}},Qs=function(t,e,n,i){var r=t._repeat,a=Re(e)||0,o=t._tTime/t._tDur;return o&&!i&&(t._time*=a/t._dur),t._dur=a,t._tDur=r?r<0?1e10:Re(a*(r+1)+t._rDelay*r):a,o>0&&!i&&Uo(t,t._tTime=t._tDur*o),t.parent&&Io(t),n||as(t.parent,t),t},uf=function(t){return t instanceof un?as(t):Qs(t,t._dur)},kS={_start:0,endTime:Kr,totalDuration:Kr},Nn=function s(t,e,n){var i=t.labels,r=t._recent||kS,a=t.duration()>=In?r.endTime(!1):t._dur,o,l,c;return Ke(e)&&(isNaN(e)||e in i)?(l=e.charAt(0),c=e.substr(-1)==="%",o=e.indexOf("="),l==="<"||l===">"?(o>=0&&(e=e.replace(/=/,"")),(l==="<"?r._start:r.endTime(r._repeat>=0))+(parseFloat(e.substr(1))||0)*(c?(o<0?r:n).totalDuration()/100:1)):o<0?(e in i||(i[e]=a),i[e]):(l=parseFloat(e.charAt(o-1)+e.substr(o+1)),c&&n&&(l=l/100*(sn(n)?n[0]:n).totalDuration()),o>1?s(t,e.substr(0,o-1),n)+l:a+l)):e==null?a:+e},Ur=function(t,e,n){var i=Ti(e[1]),r=(i?2:1)+(t<2?0:1),a=e[r],o,l;if(i&&(a.duration=e[1]),a.parent=n,t){for(o=a,l=n;l&&!("immediateRender"in o);)o=l.vars.defaults||{},l=mn(l.vars.inherit)&&l.parent;a.immediateRender=mn(o.immediateRender),t<2?a.runBackwards=1:a.startAt=e[r-1]}return new ke(e[0],a,e[r+1])},Yi=function(t,e){return t||t===0?e(t):e},ia=function(t,e,n){return n<t?t:n>e?e:n},en=function(t,e){return!Ke(t)||!(e=CS.exec(t))?"":e[1]},GS=function(t,e,n){return Yi(n,function(i){return ia(t,e,i)})},Tc=[].slice,Kd=function(t,e){return t&&oi(t)&&"length"in t&&(!e&&!t.length||t.length-1 in t&&oi(t[0]))&&!t.nodeType&&t!==ei},HS=function(t,e,n){return n===void 0&&(n=[]),t.forEach(function(i){var r;return Ke(i)&&!e||Kd(i,1)?(r=n).push.apply(r,Un(i)):n.push(i)})||n},Un=function(t,e,n){return Te&&!e&&Te.selector?Te.selector(t):Ke(t)&&!n&&(yc||!js())?Tc.call((e||gu).querySelectorAll(t),0):sn(t)?HS(t,n):Kd(t)?Tc.call(t,0):t?[t]:[]},wc=function(t){return t=Un(t)[0]||Zr("Invalid scope")||{},function(e){var n=t.current||t.nativeElement||t;return Un(e,n.querySelectorAll?n:n===t?Zr("Invalid scope")||gu.createElement("div"):t)}},Jd=function(t){return t.sort(function(){return .5-Math.random()})},$d=function(t){if(Ue(t))return t;var e=oi(t)?t:{each:t},n=os(e.ease),i=e.from||0,r=parseFloat(e.base)||0,a={},o=i>0&&i<1,l=isNaN(i)||o,c=e.axis,u=i,f=i;return Ke(i)?u=f={center:.5,edges:.5,end:1}[i]||0:!o&&l&&(u=i[0],f=i[1]),function(h,d,g){var _=(g||e).length,p=a[_],m,x,M,S,b,E,v,y,C;if(!p){if(C=e.grid==="auto"?0:(e.grid||[1,In])[1],!C){for(v=-In;v<(v=g[C++].getBoundingClientRect().left)&&C<_;);C<_&&C--}for(p=a[_]=[],m=l?Math.min(C,_)*u-.5:i%C,x=C===In?0:l?_*f/C-.5:i/C|0,v=0,y=In,E=0;E<_;E++)M=E%C-m,S=x-(E/C|0),p[E]=b=c?Math.abs(c==="y"?S:M):Nd(M*M+S*S),b>v&&(v=b),b<y&&(y=b);i==="random"&&Jd(p),p.max=v-y,p.min=y,p.v=_=(parseFloat(e.amount)||parseFloat(e.each)*(C>_?_-1:c?c==="y"?_/C:C:Math.max(C,_/C))||0)*(i==="edges"?-1:1),p.b=_<0?r-_:r,p.u=en(e.amount||e.each)||0,n=n&&_<0?ey(n):n}return _=(p[h]-p.min)/p.max||0,Re(p.b+(n?n(_):_)*p.v)+p.u}},Ac=function(t){var e=Math.pow(10,((t+"").split(".")[1]||"").length);return function(n){var i=Re(Math.round(parseFloat(n)/t)*t*e);return(i-i%1)/e+(Ti(n)?0:en(n))}},Qd=function(t,e){var n=sn(t),i,r;return!n&&oi(t)&&(i=n=t.radius||In,t.values?(t=Un(t.values),(r=!Ti(t[0]))&&(i*=i)):t=Ac(t.increment)),Yi(e,n?Ue(t)?function(a){return r=t(a),Math.abs(r-a)<=i?r:a}:function(a){for(var o=parseFloat(r?a.x:a),l=parseFloat(r?a.y:0),c=In,u=0,f=t.length,h,d;f--;)r?(h=t[f].x-o,d=t[f].y-l,h=h*h+d*d):h=Math.abs(t[f]-o),h<c&&(c=h,u=f);return u=!i||c<=i?t[u]:a,r||u===a||Ti(a)?u:u+en(a)}:Ac(t))},jd=function(t,e,n,i){return Yi(sn(t)?!e:n===!0?!!(n=0):!i,function(){return sn(t)?t[~~(Math.random()*t.length)]:(n=n||1e-5)&&(i=n<1?Math.pow(10,(n+"").length-2):1)&&Math.floor(Math.round((t-n/2+Math.random()*(e-t+n*.99))/n)*n*i)/i})},VS=function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return function(i){return e.reduce(function(r,a){return a(r)},i)}},WS=function(t,e){return function(n){return t(parseFloat(n))+(e||en(n))}},XS=function(t,e,n){return ep(t,e,0,1,n)},tp=function(t,e,n){return Yi(n,function(i){return t[~~e(i)]})},qS=function s(t,e,n){var i=e-t;return sn(t)?tp(t,s(0,t.length),e):Yi(n,function(r){return(i+(r-t)%i)%i+t})},YS=function s(t,e,n){var i=e-t,r=i*2;return sn(t)?tp(t,s(0,t.length-1),e):Yi(n,function(a){return a=(r+(a-t)%r)%r||0,t+(a>i?r-a:a)})},Jr=function(t){return t.replace(wS,function(e){var n=e.indexOf("[")+1,i=e.substring(n||7,n?e.indexOf("]"):e.length-1).split(AS);return jd(n?i:+i[0],n?0:+i[1],+i[2]||1e-5)})},ep=function(t,e,n,i,r){var a=e-t,o=i-n;return Yi(r,function(l){return n+((l-t)/a*o||0)})},ZS=function s(t,e,n,i){var r=isNaN(t+e)?0:function(d){return(1-d)*t+d*e};if(!r){var a=Ke(t),o={},l,c,u,f,h;if(n===!0&&(i=1)&&(n=null),a)t={p:t},e={p:e};else if(sn(t)&&!sn(e)){for(u=[],f=t.length,h=f-2,c=1;c<f;c++)u.push(s(t[c-1],t[c]));f--,r=function(g){g*=f;var _=Math.min(h,~~g);return u[_](g-_)},n=e}else i||(t=Js(sn(t)?[]:{},t));if(!u){for(l in e)bu.call(o,t,l,"get",e[l]);r=function(g){return Au(g,o)||(a?t.p:t)}}}return Yi(n,r)},hf=function(t,e,n){var i=t.labels,r=In,a,o,l;for(a in i)o=i[a]-e,o<0==!!n&&o&&r>(o=Math.abs(o))&&(l=a,r=o);return l},wn=function(t,e,n){var i=t.vars,r=i[e],a=Te,o=t._ctx,l,c,u;if(r)return l=i[e+"Params"],c=i.callbackScope||t,n&&ki.length&&po(),o&&(Te=o),u=l?r.apply(c,l):r.call(c),Te=a,u},Ar=function(t){return Vi(t),t.scrollTrigger&&t.scrollTrigger.kill(!!Qe),t.progress()<1&&wn(t,"onInterrupt"),t},Fs,np=[],ip=function(t){if(t)if(t=!t.name&&t.default||t,_u()||t.headless){var e=t.name,n=Ue(t),i=e&&!n&&t.init?function(){this._props=[]}:t,r={init:Kr,render:Au,add:bu,kill:hy,modifier:uy,rawVars:0},a={targetTest:0,get:0,getSetter:wu,aliases:{},register:0};if(js(),t!==i){if(bn[e])return;Pn(i,Pn(mo(t,r),a)),Js(i.prototype,Js(r,mo(t,a))),bn[i.prop=e]=i,t.targetTest&&(Qa.push(i),vu[e]=1),e=(e==="css"?"CSS":e.charAt(0).toUpperCase()+e.substr(1))+"Plugin"}zd(e,i),t.register&&t.register(Mn,i,gn)}else np.push(t)},Se=255,Rr={aqua:[0,Se,Se],lime:[0,Se,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,Se],navy:[0,0,128],white:[Se,Se,Se],olive:[128,128,0],yellow:[Se,Se,0],orange:[Se,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[Se,0,0],pink:[Se,192,203],cyan:[0,Se,Se],transparent:[Se,Se,Se,0]},Ml=function(t,e,n){return t+=t<0?1:t>1?-1:0,(t*6<1?e+(n-e)*t*6:t<.5?n:t*3<2?e+(n-e)*(2/3-t)*6:e)*Se+.5|0},sp=function(t,e,n){var i=t?Ti(t)?[t>>16,t>>8&Se,t&Se]:0:Rr.black,r,a,o,l,c,u,f,h,d,g;if(!i){if(t.substr(-1)===","&&(t=t.substr(0,t.length-1)),Rr[t])i=Rr[t];else if(t.charAt(0)==="#"){if(t.length<6&&(r=t.charAt(1),a=t.charAt(2),o=t.charAt(3),t="#"+r+r+a+a+o+o+(t.length===5?t.charAt(4)+t.charAt(4):"")),t.length===9)return i=parseInt(t.substr(1,6),16),[i>>16,i>>8&Se,i&Se,parseInt(t.substr(7),16)/255];t=parseInt(t.substr(1),16),i=[t>>16,t>>8&Se,t&Se]}else if(t.substr(0,3)==="hsl"){if(i=g=t.match(af),!e)l=+i[0]%360/360,c=+i[1]/100,u=+i[2]/100,a=u<=.5?u*(c+1):u+c-u*c,r=u*2-a,i.length>3&&(i[3]*=1),i[0]=Ml(l+1/3,r,a),i[1]=Ml(l,r,a),i[2]=Ml(l-1/3,r,a);else if(~t.indexOf("="))return i=t.match(Ud),n&&i.length<4&&(i[3]=1),i}else i=t.match(af)||Rr.transparent;i=i.map(Number)}return e&&!g&&(r=i[0]/Se,a=i[1]/Se,o=i[2]/Se,f=Math.max(r,a,o),h=Math.min(r,a,o),u=(f+h)/2,f===h?l=c=0:(d=f-h,c=u>.5?d/(2-f-h):d/(f+h),l=f===r?(a-o)/d+(a<o?6:0):f===a?(o-r)/d+2:(r-a)/d+4,l*=60),i[0]=~~(l+.5),i[1]=~~(c*100+.5),i[2]=~~(u*100+.5)),n&&i.length<4&&(i[3]=1),i},rp=function(t){var e=[],n=[],i=-1;return t.split(Gi).forEach(function(r){var a=r.match(Os)||[];e.push.apply(e,a),n.push(i+=a.length+1)}),e.c=n,e},ff=function(t,e,n){var i="",r=(t+i).match(Gi),a=e?"hsla(":"rgba(",o=0,l,c,u,f;if(!r)return t;if(r=r.map(function(h){return(h=sp(h,e,1))&&a+(e?h[0]+","+h[1]+"%,"+h[2]+"%,"+h[3]:h.join(","))+")"}),n&&(u=rp(t),l=n.c,l.join(i)!==u.c.join(i)))for(c=t.replace(Gi,"1").split(Os),f=c.length-1;o<f;o++)i+=c[o]+(~l.indexOf(o)?r.shift()||a+"0,0,0,0)":(u.length?u:r.length?r:n).shift());if(!c)for(c=t.split(Gi),f=c.length-1;o<f;o++)i+=c[o]+r[o];return i+c[f]},Gi=(function(){var s="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",t;for(t in Rr)s+="|"+t+"\\b";return new RegExp(s+")","gi")})(),KS=/hsl[a]?\(/,ap=function(t){var e=t.join(" "),n;if(Gi.lastIndex=0,Gi.test(e))return n=KS.test(e),t[1]=ff(t[1],n),t[0]=ff(t[0],n,rp(t[1])),!0},$r,Tn=(function(){var s=Date.now,t=500,e=33,n=s(),i=n,r=1e3/240,a=r,o=[],l,c,u,f,h,d,g=function _(p){var m=s()-i,x=p===!0,M,S,b,E;if((m>t||m<0)&&(n+=m-e),i+=m,b=i-n,M=b-a,(M>0||x)&&(E=++f.frame,h=b-f.time*1e3,f.time=b=b/1e3,a+=M+(M>=r?0:r-M),S=1),x||(l=c(_)),S)for(d=0;d<o.length;d++)o[d](b,h,E,p)};return f={time:0,frame:0,tick:function(){g(!0)},deltaRatio:function(p){return h/(1e3/(p||60))},wake:function(){Fd&&(!yc&&_u()&&(ei=yc=window,gu=ei.document||{},Cn.gsap=Mn,(ei.gsapVersions||(ei.gsapVersions=[])).push(Mn.version),Bd(fo||ei.GreenSockGlobals||!ei.gsap&&ei||{}),np.forEach(ip)),u=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&f.sleep(),c=u||function(p){return setTimeout(p,a-f.time*1e3+1|0)},$r=1,g(2))},sleep:function(){(u?cancelAnimationFrame:clearTimeout)(l),$r=0,c=Kr},lagSmoothing:function(p,m){t=p||1/0,e=Math.min(m||33,t)},fps:function(p){r=1e3/(p||240),a=f.time*1e3+r},add:function(p,m,x){var M=m?function(S,b,E,v){p(S,b,E,v),f.remove(M)}:p;return f.remove(p),o[x?"unshift":"push"](M),js(),M},remove:function(p,m){~(m=o.indexOf(p))&&o.splice(m,1)&&d>=m&&d--},_listeners:o},f})(),js=function(){return!$r&&Tn.wake()},ce={},JS=/^[\d.\-M][\d.\-,\s]/,$S=/["']/g,QS=function(t){for(var e={},n=t.substr(1,t.length-3).split(":"),i=n[0],r=1,a=n.length,o,l,c;r<a;r++)l=n[r],o=r!==a-1?l.lastIndexOf(","):l.length,c=l.substr(0,o),e[i]=isNaN(c)?c.replace($S,"").trim():+c,i=l.substr(o+1).trim();return e},jS=function(t){var e=t.indexOf("(")+1,n=t.indexOf(")"),i=t.indexOf("(",e);return t.substring(e,~i&&i<n?t.indexOf(")",n+1):n)},ty=function(t){var e=(t+"").split("("),n=ce[e[0]];return n&&e.length>1&&n.config?n.config.apply(null,~t.indexOf("{")?[QS(e[1])]:jS(t).split(",").map(Vd)):ce._CE&&JS.test(t)?ce._CE("",t):n},ey=function(t){return function(e){return 1-t(1-e)}},os=function(t,e){return t&&(Ue(t)?t:ce[t]||ty(t))||e},ps=function(t,e,n,i){n===void 0&&(n=function(l){return 1-e(1-l)}),i===void 0&&(i=function(l){return l<.5?e(l*2)/2:1-e((1-l)*2)/2});var r={easeIn:e,easeOut:n,easeInOut:i},a;return _n(t,function(o){ce[o]=Cn[o]=r,ce[a=o.toLowerCase()]=n;for(var l in r)ce[a+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=ce[o+"."+l]=r[l]}),r},op=function(t){return function(e){return e<.5?(1-t(1-e*2))/2:.5+t((e-.5)*2)/2}},Sl=function s(t,e,n){var i=e>=1?e:1,r=(n||(t?.3:.45))/(e<1?e:1),a=r/Sc*(Math.asin(1/i)||0),o=function(u){return u===1?1:i*Math.pow(2,-10*u)*TS((u-a)*r)+1},l=t==="out"?o:t==="in"?function(c){return 1-o(1-c)}:op(o);return r=Sc/r,l.config=function(c,u){return s(t,c,u)},l},yl=function s(t,e){e===void 0&&(e=1.70158);var n=function(a){return a?--a*a*((e+1)*a+e)+1:0},i=t==="out"?n:t==="in"?function(r){return 1-n(1-r)}:op(n);return i.config=function(r){return s(t,r)},i};_n("Linear,Quad,Cubic,Quart,Quint,Strong",function(s,t){var e=t<5?t+1:t;ps(s+",Power"+(e-1),t?function(n){return Math.pow(n,e)}:function(n){return n},function(n){return 1-Math.pow(1-n,e)},function(n){return n<.5?Math.pow(n*2,e)/2:1-Math.pow((1-n)*2,e)/2})});ce.Linear.easeNone=ce.none=ce.Linear.easeIn;ps("Elastic",Sl("in"),Sl("out"),Sl());(function(s,t){var e=1/t,n=2*e,i=2.5*e,r=function(o){return o<e?s*o*o:o<n?s*Math.pow(o-1.5/t,2)+.75:o<i?s*(o-=2.25/t)*o+.9375:s*Math.pow(o-2.625/t,2)+.984375};ps("Bounce",function(a){return 1-r(1-a)},r)})(7.5625,2.75);ps("Expo",function(s){return Math.pow(2,10*(s-1))*s+s*s*s*s*s*s*(1-s)});ps("Circ",function(s){return-(Nd(1-s*s)-1)});ps("Sine",function(s){return s===1?1:-ES(s*yS)+1});ps("Back",yl("in"),yl("out"),yl());ce.SteppedEase=ce.steps=Cn.SteppedEase={config:function(t,e){t===void 0&&(t=1);var n=1/t,i=t+(e?0:1),r=e?1:0,a=1-ve;return function(o){return((i*ia(0,a,o)|0)+r)*n}}};Yr.ease=ce["quad.out"];_n("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(s){return Mu+=s+","+s+"Params,"});var lp=function(t,e){this.id=bS++,t._gsap=this,this.target=t,this.harness=e,this.get=e?e.get:Gd,this.set=e?e.getSetter:wu},Qr=(function(){function s(e){this.vars=e,this._delay=+e.delay||0,(this._repeat=e.repeat===1/0?-2:e.repeat||0)&&(this._rDelay=e.repeatDelay||0,this._yoyo=!!e.yoyo||!!e.yoyoEase),this._ts=1,Qs(this,+e.duration,1,1),this.data=e.data,Te&&(this._ctx=Te,Te.data.push(this)),$r||Tn.wake()}var t=s.prototype;return t.delay=function(n){return n||n===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+n-this._delay),this._delay=n,this):this._delay},t.duration=function(n){return arguments.length?this.totalDuration(this._repeat>0?n+(n+this._rDelay)*this._repeat:n):this.totalDuration()&&this._dur},t.totalDuration=function(n){return arguments.length?(this._dirty=0,Qs(this,this._repeat<0?n:(n-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},t.totalTime=function(n,i){if(js(),!arguments.length)return this._tTime;var r=this._dp;if(r&&r.smoothChildTiming&&this._ts){for(Uo(this,n),!r._dp||r.parent||qd(r,this);r&&r.parent;)r.parent._time!==r._start+(r._ts>=0?r._tTime/r._ts:(r.totalDuration()-r._tTime)/-r._ts)&&r.totalTime(r._tTime,!0),r=r.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&n<this._tDur||this._ts<0&&n>0||!this._tDur&&!n)&&ii(this._dp,this,this._start-this._delay)}return(this._tTime!==n||!this._dur&&!i||this._initted&&Math.abs(this._zTime)===ve||!this._initted&&this._dur&&n||!n&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=n),Hd(this,n,i)),this},t.time=function(n,i){return arguments.length?this.totalTime(Math.min(this.totalDuration(),n+cf(this))%(this._dur+this._rDelay)||(n?this._dur:0),i):this._time},t.totalProgress=function(n,i){return arguments.length?this.totalTime(this.totalDuration()*n,i):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},t.progress=function(n,i){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-n:n)+cf(this),i):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},t.iteration=function(n,i){var r=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(n-1)*r,i):this._repeat?$s(this._tTime,r)+1:1},t.timeScale=function(n,i){if(!arguments.length)return this._rts===-ve?0:this._rts;if(this._rts===n)return this;var r=this.parent&&this._ts?_o(this.parent._time,this):this._tTime,a=this._rts<0;this._rts=+n||0,this._ts=this._ps||n===-ve?0:this._rts;var o=this.totalDuration();return(a!==this._rts<0||r>0&&r<o)&&this.totalTime(ia(-Math.abs(this._delay),o,r),i!==!1),Io(this),US(this)},t.paused=function(n){if(!arguments.length)return this._ps;if(this._ps!==n)if(this._ps=n,n)this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0;else{js(),this._ts=this._rts;var i=this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,r=this.progress()===1&&Math.abs(this._zTime)!==ve,a;if(r)for(this._tTime-=ve,a=this._first;a;){if(!a._dur&&a._zTime<0&&a._ts&&a._start<=i+ve){r=!1;break}a=a._next}this.totalTime(i,r)}return this},t.startTime=function(n){if(arguments.length){this._start=Re(n);var i=this.parent||this._dp;return i&&(i._sort||!this.parent)&&ii(i,this,this._start-this._delay),this}return this._start},t.endTime=function(n){return this._start+(mn(n)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},t.rawTime=function(n){var i=this.parent||this._dp;return i?n&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?_o(i.rawTime(n),this):this._tTime:this._tTime},t.revert=function(n){n===void 0&&(n=DS);var i=Qe;return Qe=n,yu(this)&&(this.timeline&&this.timeline.revert(n),this.totalTime(-.01,n.suppressEvents)),this.data!=="nested"&&n.kill!==!1&&this.kill(),Qe=i,this},t.globalTime=function(n){for(var i=this,r=arguments.length?n:i.rawTime();i;)r=i._start+r/(Math.abs(i._ts)||1),i=i._dp;return!this.parent&&this._sat?this._sat.globalTime(n):r},t.repeat=function(n){return arguments.length?(this._repeat=n===1/0?-2:n,uf(this)):this._repeat===-2?1/0:this._repeat},t.repeatDelay=function(n){if(arguments.length){var i=this._time;return this._rDelay=n,uf(this),i?this.time(i):this}return this._rDelay},t.yoyo=function(n){return arguments.length?(this._yoyo=n,this):this._yoyo},t.seek=function(n,i){return this.totalTime(Nn(this,n),mn(i))},t.restart=function(n,i){return this.play().totalTime(n?-this._delay:0,mn(i)),this._dur||(this._zTime=-ve),this},t.play=function(n,i){return n!=null&&this.seek(n,i),this.reversed(!1).paused(!1)},t.reverse=function(n,i){return n!=null&&this.seek(n||this.totalDuration(),i),this.reversed(!0).paused(!1)},t.pause=function(n,i){return n!=null&&this.seek(n,i),this.paused(!0)},t.resume=function(){return this.paused(!1)},t.reversed=function(n){return arguments.length?(!!n!==this.reversed()&&this.timeScale(-this._rts||(n?-ve:0)),this):this._rts<0},t.invalidate=function(){return this._initted=this._act=0,this._zTime=-ve,this},t.isActive=function(){var n=this.parent||this._dp,i=this._start,r;return!!(!n||this._ts&&this._initted&&n.isActive()&&(r=n.rawTime(!0))>=i&&r<this.endTime(!0)-ve)},t.eventCallback=function(n,i,r){var a=this.vars;return arguments.length>1?(i?(a[n]=i,r&&(a[n+"Params"]=r),n==="onUpdate"&&(this._onUpdate=i)):delete a[n],this):a[n]},t.then=function(n){var i=this,r=i._prom;return new Promise(function(a){var o=Ue(n)?n:Wd,l=function(){var u=i.then;i.then=null,r&&r(),Ue(o)&&(o=o(i))&&(o.then||o===i)&&(i.then=u),a(o),i.then=u};i._initted&&i.totalProgress()===1&&i._ts>=0||!i._tTime&&i._ts<0?l():i._prom=l})},t.kill=function(){Ar(this)},s})();Pn(Qr.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-ve,_prom:0,_ps:!1,_rts:1});var un=(function(s){Ld(t,s);function t(n,i){var r;return n===void 0&&(n={}),r=s.call(this,n)||this,r.labels={},r.smoothChildTiming=!!n.smoothChildTiming,r.autoRemoveChildren=!!n.autoRemoveChildren,r._sort=mn(n.sortChildren),Ce&&ii(n.parent||Ce,_i(r),i),n.reversed&&r.reverse(),n.paused&&r.paused(!0),n.scrollTrigger&&Yd(_i(r),n.scrollTrigger),r}var e=t.prototype;return e.to=function(i,r,a){return Ur(0,arguments,this),this},e.from=function(i,r,a){return Ur(1,arguments,this),this},e.fromTo=function(i,r,a,o){return Ur(2,arguments,this),this},e.set=function(i,r,a){return r.duration=0,r.parent=this,Ir(r).repeatDelay||(r.repeat=0),r.immediateRender=!!r.immediateRender,new ke(i,r,Nn(this,a),1),this},e.call=function(i,r,a){return ii(this,ke.delayedCall(0,i,r),a)},e.staggerTo=function(i,r,a,o,l,c,u){return a.duration=r,a.stagger=a.stagger||o,a.onComplete=c,a.onCompleteParams=u,a.parent=this,new ke(i,a,Nn(this,l)),this},e.staggerFrom=function(i,r,a,o,l,c,u){return a.runBackwards=1,Ir(a).immediateRender=mn(a.immediateRender),this.staggerTo(i,r,a,o,l,c,u)},e.staggerFromTo=function(i,r,a,o,l,c,u,f){return o.startAt=a,Ir(o).immediateRender=mn(o.immediateRender),this.staggerTo(i,r,o,l,c,u,f)},e.render=function(i,r,a){var o=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,u=i<=0?0:Re(i),f=this._zTime<0!=i<0&&(this._initted||!c),h,d,g,_,p,m,x,M,S,b,E,v;if(this!==Ce&&u>l&&i>=0&&(u=l),u!==this._tTime||a||f){if(o!==this._time&&c&&(u+=this._time-o,i+=this._time-o),h=u,S=this._start,M=this._ts,m=!M,f&&(c||(o=this._zTime),(i||!r)&&(this._zTime=i)),this._repeat){if(E=this._yoyo,p=c+this._rDelay,this._repeat<-1&&i<0)return this.totalTime(p*100+i,r,a);if(h=Re(u%p),u===l?(_=this._repeat,h=c):(b=Re(u/p),_=~~b,_&&_===b&&(h=c,_--),h>c&&(h=c)),b=$s(this._tTime,p),!o&&this._tTime&&b!==_&&this._tTime-b*p-this._dur<=0&&(b=_),E&&_&1&&(h=c-h,v=1),_!==b&&!this._lock){var y=E&&b&1,C=y===(E&&_&1);if(_<b&&(y=!y),o=y?0:u%c?c:u,this._lock=1,this.render(o||(v?0:Re(_*p)),r,!c)._lock=0,this._tTime=u,!r&&this.parent&&wn(this,"onRepeat"),this.vars.repeatRefresh&&!v&&(this.invalidate()._lock=1,b=_),o&&o!==this._time||m!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,C&&(this._lock=2,o=y?c:-1e-4,this.render(o,!0),this.vars.repeatRefresh&&!v&&this.invalidate()),this._lock=0,!this._ts&&!m)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(x=zS(this,Re(o),Re(h)),x&&(u-=h-(h=x._start))),this._tTime=u,this._time=h,this._act=!!M,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=i,o=0),!o&&u&&c&&!r&&!b&&(wn(this,"onStart"),this._tTime!==u))return this;if(h>=o&&i>=0)for(d=this._first;d;){if(g=d._next,(d._act||h>=d._start)&&d._ts&&x!==d){if(d.parent!==this)return this.render(i,r,a);if(d.render(d._ts>0?(h-d._start)*d._ts:(d._dirty?d.totalDuration():d._tDur)+(h-d._start)*d._ts,r,a),h!==this._time||!this._ts&&!m){x=0,g&&(u+=this._zTime=-ve);break}}d=g}else{d=this._last;for(var R=i<0?i:h;d;){if(g=d._prev,(d._act||R<=d._end)&&d._ts&&x!==d){if(d.parent!==this)return this.render(i,r,a);if(d.render(d._ts>0?(R-d._start)*d._ts:(d._dirty?d.totalDuration():d._tDur)+(R-d._start)*d._ts,r,a||Qe&&yu(d)),h!==this._time||!this._ts&&!m){x=0,g&&(u+=this._zTime=R?-ve:ve);break}}d=g}}if(x&&!r&&(this.pause(),x.render(h>=o?0:-ve)._zTime=h>=o?1:-1,this._ts))return this._start=S,Io(this),this.render(i,r,a);this._onUpdate&&!r&&wn(this,"onUpdate",!0),(u===l&&this._tTime>=this.totalDuration()||!u&&o)&&(S===this._start||Math.abs(M)!==Math.abs(this._ts))&&(this._lock||((i||!c)&&(u===l&&this._ts>0||!u&&this._ts<0)&&Vi(this,1),!r&&!(i<0&&!o)&&(u||o||!l)&&(wn(this,u===l&&i>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(u<l&&this.timeScale()>0)&&this._prom())))}return this},e.add=function(i,r){var a=this;if(Ti(r)||(r=Nn(this,r,i)),!(i instanceof Qr)){if(sn(i))return i.forEach(function(o){return a.add(o,r)}),this;if(Ke(i))return this.addLabel(i,r);if(Ue(i))i=ke.delayedCall(0,i);else return this}return this!==i?ii(this,i,r):this},e.getChildren=function(i,r,a,o){i===void 0&&(i=!0),r===void 0&&(r=!0),a===void 0&&(a=!0),o===void 0&&(o=-In);for(var l=[],c=this._first;c;)c._start>=o&&(c instanceof ke?r&&l.push(c):(a&&l.push(c),i&&l.push.apply(l,c.getChildren(!0,r,a)))),c=c._next;return l},e.getById=function(i){for(var r=this.getChildren(1,1,1),a=r.length;a--;)if(r[a].vars.id===i)return r[a]},e.remove=function(i){return Ke(i)?this.removeLabel(i):Ue(i)?this.killTweensOf(i):(i.parent===this&&No(this,i),i===this._recent&&(this._recent=this._last),as(this))},e.totalTime=function(i,r){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=Re(Tn.time-(this._ts>0?i/this._ts:(this.totalDuration()-i)/-this._ts))),s.prototype.totalTime.call(this,i,r),this._forcing=0,this):this._tTime},e.addLabel=function(i,r){return this.labels[i]=Nn(this,r),this},e.removeLabel=function(i){return delete this.labels[i],this},e.addPause=function(i,r,a){var o=ke.delayedCall(0,r||Kr,a);return o.data="isPause",this._hasPause=1,ii(this,o,Nn(this,i))},e.removePause=function(i){var r=this._first;for(i=Nn(this,i);r;)r._start===i&&r.data==="isPause"&&Vi(r),r=r._next},e.killTweensOf=function(i,r,a){for(var o=this.getTweensOf(i,a),l=o.length;l--;)Ui!==o[l]&&o[l].kill(i,r);return this},e.getTweensOf=function(i,r){for(var a=[],o=Un(i),l=this._first,c=Ti(r),u;l;)l instanceof ke?LS(l._targets,o)&&(c?(!Ui||l._initted&&l._ts)&&l.globalTime(0)<=r&&l.globalTime(l.totalDuration())>r:!r||l.isActive())&&a.push(l):(u=l.getTweensOf(o,r)).length&&a.push.apply(a,u),l=l._next;return a},e.tweenTo=function(i,r){r=r||{};var a=this,o=Nn(a,i),l=r,c=l.startAt,u=l.onStart,f=l.onStartParams,h=l.immediateRender,d,g=ke.to(a,Pn({ease:r.ease||"none",lazy:!1,immediateRender:!1,time:o,overwrite:"auto",duration:r.duration||Math.abs((o-(c&&"time"in c?c.time:a._time))/a.timeScale())||ve,onStart:function(){if(a.pause(),!d){var p=r.duration||Math.abs((o-(c&&"time"in c?c.time:a._time))/a.timeScale());g._dur!==p&&Qs(g,p,0,1).render(g._time,!0,!0),d=1}u&&u.apply(g,f||[])}},r));return h?g.render(0):g},e.tweenFromTo=function(i,r,a){return this.tweenTo(r,Pn({startAt:{time:Nn(this,i)}},a))},e.recent=function(){return this._recent},e.nextLabel=function(i){return i===void 0&&(i=this._time),hf(this,Nn(this,i))},e.previousLabel=function(i){return i===void 0&&(i=this._time),hf(this,Nn(this,i),1)},e.currentLabel=function(i){return arguments.length?this.seek(i,!0):this.previousLabel(this._time+ve)},e.shiftChildren=function(i,r,a){a===void 0&&(a=0);var o=this._first,l=this.labels,c;for(i=Re(i);o;)o._start>=a&&(o._start+=i,o._end+=i),o=o._next;if(r)for(c in l)l[c]>=a&&(l[c]+=i);return as(this)},e.invalidate=function(i){var r=this._first;for(this._lock=0;r;)r.invalidate(i),r=r._next;return s.prototype.invalidate.call(this,i)},e.clear=function(i){i===void 0&&(i=!0);for(var r=this._first,a;r;)a=r._next,this.remove(r),r=a;return this._dp&&(this._time=this._tTime=this._pTime=0),i&&(this.labels={}),as(this)},e.totalDuration=function(i){var r=0,a=this,o=a._last,l=In,c,u,f;if(arguments.length)return a.timeScale((a._repeat<0?a.duration():a.totalDuration())/(a.reversed()?-i:i));if(a._dirty){for(f=a.parent;o;)c=o._prev,o._dirty&&o.totalDuration(),u=o._start,u>l&&a._sort&&o._ts&&!a._lock?(a._lock=1,ii(a,o,u-o._delay,1)._lock=0):l=u,u<0&&o._ts&&(r-=u,(!f&&!a._dp||f&&f.smoothChildTiming)&&(a._start+=Re(u/a._ts),a._time-=u,a._tTime-=u),a.shiftChildren(-u,!1,-1/0),l=0),o._end>r&&o._ts&&(r=o._end),o=c;Qs(a,a===Ce&&a._time>r?a._time:r,1,1),a._dirty=0}return a._tDur},t.updateRoot=function(i){if(Ce._ts&&(Hd(Ce,_o(i,Ce)),kd=Tn.frame),Tn.frame>=of){of+=Rn.autoSleep||120;var r=Ce._first;if((!r||!r._ts)&&Rn.autoSleep&&Tn._listeners.length<2){for(;r&&!r._ts;)r=r._next;r||Tn.sleep()}}},t})(Qr);Pn(un.prototype,{_lock:0,_hasPause:0,_forcing:0});var ny=function(t,e,n,i,r,a,o){var l=new gn(this._pt,t,e,0,1,dp,null,r),c=0,u=0,f,h,d,g,_,p,m,x;for(l.b=n,l.e=i,n+="",i+="",(m=~i.indexOf("random("))&&(i=Jr(i)),a&&(x=[n,i],a(x,t,e),n=x[0],i=x[1]),h=n.match(xl)||[];f=xl.exec(i);)g=f[0],_=i.substring(c,f.index),d?d=(d+1)%5:_.substr(-5)==="rgba("&&(d=1),g!==h[u++]&&(p=parseFloat(h[u-1])||0,l._pt={_next:l._pt,p:_||u===1?_:",",s:p,c:g.charAt(1)==="="?Gs(p,g)-p:parseFloat(g)-p,m:d&&d<4?Math.round:0},c=xl.lastIndex);return l.c=c<i.length?i.substring(c,i.length):"",l.fp=o,(Od.test(i)||m)&&(l.e=0),this._pt=l,l},bu=function(t,e,n,i,r,a,o,l,c,u){Ue(i)&&(i=i(r||0,t,a));var f=t[e],h=n!=="get"?n:Ue(f)?c?t[e.indexOf("set")||!Ue(t["get"+e.substr(3)])?e:"get"+e.substr(3)](c):t[e]():f,d=Ue(f)?c?oy:hp:Tu,g;if(Ke(i)&&(~i.indexOf("random(")&&(i=Jr(i)),i.charAt(1)==="="&&(g=Gs(h,i)+(en(h)||0),(g||g===0)&&(i=g))),!u||h!==i||Rc)return!isNaN(h*i)&&i!==""?(g=new gn(this._pt,t,e,+h||0,i-(h||0),typeof f=="boolean"?cy:fp,0,d),c&&(g.fp=c),o&&g.modifier(o,this,t),this._pt=g):(!f&&!(e in t)&&xu(e,i),ny.call(this,t,e,h,i,d,l||Rn.stringFilter,c))},iy=function(t,e,n,i,r){if(Ue(t)&&(t=Or(t,r,e,n,i)),!oi(t)||t.style&&t.nodeType||sn(t)||Id(t))return Ke(t)?Or(t,r,e,n,i):t;var a={},o;for(o in t)a[o]=Or(t[o],r,e,n,i);return a},cp=function(t,e,n,i,r,a){var o,l,c,u;if(bn[t]&&(o=new bn[t]).init(r,o.rawVars?e[t]:iy(e[t],i,r,a,n),n,i,a)!==!1&&(n._pt=l=new gn(n._pt,r,t,0,1,o.render,o,0,o.priority),n!==Fs))for(c=n._ptLookup[n._targets.indexOf(r)],u=o._props.length;u--;)c[o._props[u]]=l;return o},Ui,Rc,Eu=function s(t,e,n){var i=t.vars,r=i.ease,a=i.startAt,o=i.immediateRender,l=i.lazy,c=i.onUpdate,u=i.runBackwards,f=i.yoyoEase,h=i.keyframes,d=i.autoRevert,g=t._dur,_=t._startAt,p=t._targets,m=t.parent,x=m&&m.data==="nested"?m.vars.targets:p,M=t._overwrite==="auto"&&!pu,S=t.timeline,b=i.easeReverse||f,E,v,y,C,R,L,U,B,w,I,D,O,H;if(S&&(!h||!r)&&(r="none"),t._ease=os(r,Yr.ease),t._rEase=b&&(os(b)||t._ease),t._from=!S&&!!i.runBackwards,t._from&&(t.ratio=1),!S||h&&!i.stagger){if(B=p[0]?rs(p[0]).harness:0,O=B&&i[B.prop],E=mo(i,vu),_&&(_._zTime<0&&_.progress(1),e<0&&u&&o&&!d?_.render(-1,!0):_.revert(u&&g?$a:PS),_._lazy=0),a){if(Vi(t._startAt=ke.set(p,Pn({data:"isStart",overwrite:!1,parent:m,immediateRender:!0,lazy:!_&&mn(l),startAt:null,delay:0,onUpdate:c&&function(){return wn(t,"onUpdate")},stagger:0},a))),t._startAt._dp=0,t._startAt._sat=t,e<0&&(Qe||!o&&!d)&&t._startAt.revert($a),o&&g&&e<=0&&n<=0){e&&(t._zTime=e);return}}else if(u&&g&&!_){if(e&&(o=!1),y=Pn({overwrite:!1,data:"isFromStart",lazy:o&&!_&&mn(l),immediateRender:o,stagger:0,parent:m},E),O&&(y[B.prop]=O),Vi(t._startAt=ke.set(p,y)),t._startAt._dp=0,t._startAt._sat=t,e<0&&(Qe?t._startAt.revert($a):t._startAt.render(-1,!0)),t._zTime=e,!o)s(t._startAt,ve,ve);else if(!e)return}for(t._pt=t._ptCache=0,l=g&&mn(l)||l&&!g,v=0;v<p.length;v++){if(R=p[v],U=R._gsap||Su(p)[v]._gsap,t._ptLookup[v]=I={},bc[U.id]&&ki.length&&po(),D=x===p?v:x.indexOf(R),B&&(w=new B).init(R,O||E,t,D,x)!==!1&&(t._pt=C=new gn(t._pt,R,w.name,0,1,w.render,w,0,w.priority),w._props.forEach(function(z){I[z]=C}),w.priority&&(L=1)),!B||O)for(y in E)bn[y]&&(w=cp(y,E,t,D,R,x))?w.priority&&(L=1):I[y]=C=bu.call(t,R,y,"get",E[y],D,x,0,i.stringFilter);t._op&&t._op[v]&&t.kill(R,t._op[v]),M&&t._pt&&(Ui=t,Ce.killTweensOf(R,I,t.globalTime(e)),H=!t.parent,Ui=0),t._pt&&l&&(bc[U.id]=1)}L&&pp(t),t._onInit&&t._onInit(t)}t._onUpdate=c,t._initted=(!t._op||t._pt)&&!H,h&&e<=0&&S.render(In,!0,!0)},sy=function(t,e,n,i,r,a,o,l){var c=(t._pt&&t._ptCache||(t._ptCache={}))[e],u,f,h,d;if(!c)for(c=t._ptCache[e]=[],h=t._ptLookup,d=t._targets.length;d--;){if(u=h[d][e],u&&u.d&&u.d._pt)for(u=u.d._pt;u&&u.p!==e&&u.fp!==e;)u=u._next;if(!u)return Rc=1,t.vars[e]="+=0",Eu(t,o),Rc=0,l?Zr(e+" not eligible for reset. Try splitting into individual properties"):1;c.push(u)}for(d=c.length;d--;)f=c[d],u=f._pt||f,u.s=(i||i===0)&&!r?i:u.s+(i||0)+a*u.c,u.c=n-u.s,f.e&&(f.e=Fe(n)+en(f.e)),f.b&&(f.b=u.s+en(f.b))},ry=function(t,e){var n=t[0]?rs(t[0]).harness:0,i=n&&n.aliases,r,a,o,l;if(!i)return e;r=Js({},e);for(a in i)if(a in r)for(l=i[a].split(","),o=l.length;o--;)r[l[o]]=r[a];return r},ay=function(t,e,n,i){var r=e.ease||i||"power1.inOut",a,o;if(sn(e))o=n[t]||(n[t]=[]),e.forEach(function(l,c){return o.push({t:c/(e.length-1)*100,v:l,e:r})});else for(a in e)o=n[a]||(n[a]=[]),a==="ease"||o.push({t:parseFloat(t),v:e[a],e:r})},Or=function(t,e,n,i,r){return Ue(t)?t.call(e,n,i,r):Ke(t)&&~t.indexOf("random(")?Jr(t):t},xo=Mu+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",up={};_n(xo+",id,stagger,delay,duration,paused,scrollTrigger",function(s){return up[s]=1});xo=xo.split(",");var ke=(function(s){Ld(t,s);function t(n,i,r,a){var o;typeof i=="number"&&(r.duration=i,i=r,r=null),o=s.call(this,a?i:Ir(i))||this;var l=o.vars,c=l.duration,u=l.delay,f=l.immediateRender,h=l.stagger,d=l.overwrite,g=l.keyframes,_=l.defaults,p=l.scrollTrigger,m=i.parent||Ce,x=(sn(n)||Id(n)?Ti(n[0]):"length"in i)?[n]:Un(n),M,S,b,E,v,y,C,R;if(o._targets=x.length?Su(x):Zr("GSAP target "+n+" not found. https://gsap.com",!Rn.nullTargetWarn)||[],o._ptLookup=[],o._overwrite=d,g||h||Ha(c)||Ha(u)){i=o.vars;var L=i.easeReverse||i.yoyoEase;if(M=o.timeline=new un({data:"nested",defaults:_||{},targets:m&&m.data==="nested"?m.vars.targets:x}),M.kill(),M.parent=M._dp=_i(o),M._start=0,h||Ha(c)||Ha(u)){if(E=x.length,C=h&&$d(h),oi(h))for(v in h)~xo.indexOf(v)&&(R||(R={}),R[v]=h[v]);for(S=0;S<E;S++)b=mo(i,up),b.stagger=0,L&&(b.easeReverse=L),R&&Js(b,R),y=x[S],b.duration=+Or(c,_i(o),S,y,x),b.delay=(+Or(u,_i(o),S,y,x)||0)-o._delay,!h&&E===1&&b.delay&&(o._delay=u=b.delay,o._start+=u,b.delay=0),M.to(y,b,C?C(S,y,x):0),M._ease=ce.none;M.duration()?c=u=0:o.timeline=0}else if(g){Ir(Pn(M.vars.defaults,{ease:"none"})),M._ease=os(g.ease||i.ease||"none");var U=0,B,w,I;if(sn(g))g.forEach(function(D){return M.to(x,D,">")}),M.duration();else{b={};for(v in g)v==="ease"||v==="easeEach"||ay(v,g[v],b,g.easeEach);for(v in b)for(B=b[v].sort(function(D,O){return D.t-O.t}),U=0,S=0;S<B.length;S++)w=B[S],I={ease:w.e,duration:(w.t-(S?B[S-1].t:0))/100*c},I[v]=w.v,M.to(x,I,U),U+=I.duration;M.duration()<c&&M.to({},{duration:c-M.duration()})}}c||o.duration(c=M.duration())}else o.timeline=0;return d===!0&&!pu&&(Ui=_i(o),Ce.killTweensOf(x),Ui=0),ii(m,_i(o),r),i.reversed&&o.reverse(),i.paused&&o.paused(!0),(f||!c&&!g&&o._start===Re(m._time)&&mn(f)&&OS(_i(o))&&m.data!=="nested")&&(o._tTime=-ve,o.render(Math.max(0,-u)||0)),p&&Yd(_i(o),p),o}var e=t.prototype;return e.render=function(i,r,a){var o=this._time,l=this._tDur,c=this._dur,u=i<0,f=i>l-ve&&!u?l:i<ve?0:i,h,d,g,_,p,m,x,M;if(!c)BS(this,i,r,a);else if(f!==this._tTime||!i||a||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==u||this._lazy){if(h=f,M=this.timeline,this._repeat){if(_=c+this._rDelay,this._repeat<-1&&u)return this.totalTime(_*100+i,r,a);if(h=Re(f%_),f===l?(g=this._repeat,h=c):(p=Re(f/_),g=~~p,g&&g===p?(h=c,g--):h>c&&(h=c)),m=this._yoyo&&g&1,m&&(h=c-h),p=$s(this._tTime,_),h===o&&!a&&this._initted&&g===p)return this._tTime=f,this;g!==p&&this.vars.repeatRefresh&&!m&&!this._lock&&h!==_&&this._initted&&(this._lock=a=1,this.render(Re(_*g),!0).invalidate()._lock=0)}if(!this._initted){if(Zd(this,u?i:h,a,r,f))return this._tTime=0,this;if(o!==this._time&&!(a&&this.vars.repeatRefresh&&g!==p))return this;if(c!==this._dur)return this.render(i,r,a)}if(this._rEase){var S=h<o;if(S!==this._inv){var b=S?o:c-o;this._inv=S,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=o,this._invRecip=b?(S?-1:1)/b:0,this._invScale=S?-this.ratio:1-this.ratio,this._invEase=S?this._rEase:this._ease}this.ratio=x=this._invRatio+this._invScale*this._invEase((h-this._invTime)*this._invRecip)}else this.ratio=x=this._ease(h/c);if(this._from&&(this.ratio=x=1-x),this._tTime=f,this._time=h,!this._act&&this._ts&&(this._act=1,this._lazy=0),!o&&f&&!r&&!p&&(wn(this,"onStart"),this._tTime!==f))return this;for(d=this._pt;d;)d.r(x,d.d),d=d._next;M&&M.render(i<0?i:M._dur*M._ease(h/this._dur),r,a)||this._startAt&&(this._zTime=i),this._onUpdate&&!r&&(u&&Ec(this,i,r,a),wn(this,"onUpdate")),this._repeat&&g!==p&&this.vars.onRepeat&&!r&&this.parent&&wn(this,"onRepeat"),(f===this._tDur||!f)&&this._tTime===f&&(u&&!this._onUpdate&&Ec(this,i,!0,!0),(i||!c)&&(f===this._tDur&&this._ts>0||!f&&this._ts<0)&&Vi(this,1),!r&&!(u&&!o)&&(f||o||m)&&(wn(this,f===l?"onComplete":"onReverseComplete",!0),this._prom&&!(f<l&&this.timeScale()>0)&&this._prom()))}return this},e.targets=function(){return this._targets},e.invalidate=function(i){return(!i||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(i),s.prototype.invalidate.call(this,i)},e.resetTo=function(i,r,a,o,l){$r||Tn.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),u;return this._initted||Eu(this,c),u=this._ease(c/this._dur),sy(this,i,r,a,o,u,c,l)?this.resetTo(i,r,a,o,1):(Uo(this,0),this.parent||Xd(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},e.kill=function(i,r){if(r===void 0&&(r="all"),!i&&(!r||r==="all"))return this._lazy=this._pt=0,this.parent?Ar(this):this.scrollTrigger&&this.scrollTrigger.kill(!!Qe),this;if(this.timeline){var a=this.timeline.totalDuration();return this.timeline.killTweensOf(i,r,Ui&&Ui.vars.overwrite!==!0)._first||Ar(this),this.parent&&a!==this.timeline.totalDuration()&&Qs(this,this._dur*this.timeline._tDur/a,0,1),this}var o=this._targets,l=i?Un(i):o,c=this._ptLookup,u=this._pt,f,h,d,g,_,p,m;if((!r||r==="all")&&IS(o,l))return r==="all"&&(this._pt=0),Ar(this);for(f=this._op=this._op||[],r!=="all"&&(Ke(r)&&(_={},_n(r,function(x){return _[x]=1}),r=_),r=ry(o,r)),m=o.length;m--;)if(~l.indexOf(o[m])){h=c[m],r==="all"?(f[m]=r,g=h,d={}):(d=f[m]=f[m]||{},g=r);for(_ in g)p=h&&h[_],p&&((!("kill"in p.d)||p.d.kill(_)===!0)&&No(this,p,"_pt"),delete h[_]),d!=="all"&&(d[_]=1)}return this._initted&&!this._pt&&u&&Ar(this),this},t.to=function(i,r){return new t(i,r,arguments[2])},t.from=function(i,r){return Ur(1,arguments)},t.delayedCall=function(i,r,a,o){return new t(r,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:i,onComplete:r,onReverseComplete:r,onCompleteParams:a,onReverseCompleteParams:a,callbackScope:o})},t.fromTo=function(i,r,a){return Ur(2,arguments)},t.set=function(i,r){return r.duration=0,r.repeatDelay||(r.repeat=0),new t(i,r)},t.killTweensOf=function(i,r,a){return Ce.killTweensOf(i,r,a)},t})(Qr);Pn(ke.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});_n("staggerTo,staggerFrom,staggerFromTo",function(s){ke[s]=function(){var t=new un,e=Tc.call(arguments,0);return e.splice(s==="staggerFromTo"?5:4,0,0),t[s].apply(t,e)}});var Tu=function(t,e,n){return t[e]=n},hp=function(t,e,n){return t[e](n)},oy=function(t,e,n,i){return t[e](i.fp,n)},ly=function(t,e,n){return t.setAttribute(e,n)},wu=function(t,e){return Ue(t[e])?hp:mu(t[e])&&t.setAttribute?ly:Tu},fp=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e6)/1e6,e)},cy=function(t,e){return e.set(e.t,e.p,!!(e.s+e.c*t),e)},dp=function(t,e){var n=e._pt,i="";if(!t&&e.b)i=e.b;else if(t===1&&e.e)i=e.e;else{for(;n;)i=n.p+(n.m?n.m(n.s+n.c*t):Math.round((n.s+n.c*t)*1e4)/1e4)+i,n=n._next;i+=e.c}e.set(e.t,e.p,i,e)},Au=function(t,e){for(var n=e._pt;n;)n.r(t,n.d),n=n._next},uy=function(t,e,n,i){for(var r=this._pt,a;r;)a=r._next,r.p===i&&r.modifier(t,e,n),r=a},hy=function(t){for(var e=this._pt,n,i;e;)i=e._next,e.p===t&&!e.op||e.op===t?No(this,e,"_pt"):e.dep||(n=1),e=i;return!n},fy=function(t,e,n,i){i.mSet(t,e,i.m.call(i.tween,n,i.mt),i)},pp=function(t){for(var e=t._pt,n,i,r,a;e;){for(n=e._next,i=r;i&&i.pr>e.pr;)i=i._next;(e._prev=i?i._prev:a)?e._prev._next=e:r=e,(e._next=i)?i._prev=e:a=e,e=n}t._pt=r},gn=(function(){function s(e,n,i,r,a,o,l,c,u){this.t=n,this.s=r,this.c=a,this.p=i,this.r=o||fp,this.d=l||this,this.set=c||Tu,this.pr=u||0,this._next=e,e&&(e._prev=this)}var t=s.prototype;return t.modifier=function(n,i,r){this.mSet=this.mSet||this.set,this.set=fy,this.m=n,this.mt=r,this.tween=i},s})();_n(Mu+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(s){return vu[s]=1});Cn.TweenMax=Cn.TweenLite=ke;Cn.TimelineLite=Cn.TimelineMax=un;Ce=new un({sortChildren:!1,defaults:Yr,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});Rn.stringFilter=ap;var ls=[],ja={},dy=[],df=0,py=0,bl=function(t){return(ja[t]||dy).map(function(e){return e()})},jr=function(){var t=Date.now(),e=[];t-df>2&&(bl("matchMediaInit"),ls.forEach(function(n){var i=n.queries,r=n.conditions,a,o,l,c;for(o in i)a=ei.matchMedia(i[o]).matches,a&&(l=1),a!==r[o]&&(r[o]=a,c=1);c&&(n.revert(),l&&e.push(n))}),bl("matchMediaRevert"),e.forEach(function(n){return n.onMatch(n,function(i){return n.add(null,i)})}),df=t,bl("matchMedia"))},mp=(function(){function s(e,n){this.selector=n&&wc(n),this.data=[],this._r=[],this.isReverted=!1,this.id=py++,e&&this.add(e)}var t=s.prototype;return t.add=function(n,i,r){Ue(n)&&(r=i,i=n,n=Ue);var a=this,o=function(){var c=Te,u=a.selector,f;return c&&c!==a&&c.data.push(a),r&&(a.selector=wc(r)),Te=a,f=i.apply(a,arguments),Ue(f)&&a._r.push(f),Te=c,a.selector=u,a.isReverted=!1,f};return a.last=o,n===Ue?o(a,function(l){return a.add(null,l)}):n?a[n]=o:o},t.ignore=function(n){var i=Te;Te=null,n(this),Te=i},t.getTweens=function(){var n=[];return this.data.forEach(function(i){return i instanceof s?n.push.apply(n,i.getTweens()):i instanceof ke&&!(i.parent&&i.parent.data==="nested")&&n.push(i)}),n},t.clear=function(){this._r.length=this.data.length=0},t.kill=function(n,i){var r=this;if(n?(function(){for(var o=r.getTweens(),l=r.data.length,c;l--;)c=r.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(u){return o.splice(o.indexOf(u),1)}));for(o.map(function(u){return{g:u._dur||u._delay||u._sat&&!u._sat.vars.immediateRender?u.globalTime(0):-1/0,t:u}}).sort(function(u,f){return f.g-u.g||-1/0}).forEach(function(u){return u.t.revert(n)}),l=r.data.length;l--;)c=r.data[l],c instanceof un?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof ke)&&c.revert&&c.revert(n);r._r.forEach(function(u){return u(n,r)}),r.isReverted=!0})():this.data.forEach(function(o){return o.kill&&o.kill()}),this.clear(),i){for(var a=ls.length;a--;)ls[a].id===this.id&&ls.splice(a,1);this._mqs&&this._mqs.forEach(function(o){return o.removeListener?o.removeListener(jr):o.removeEventListener("change",jr)}),this._mqs=null}},t.revert=function(n){this.kill(n||{})},s})(),my=(function(){function s(e){this.contexts=[],this.scope=e,Te&&Te.data.push(this)}var t=s.prototype;return t.add=function(n,i,r){oi(n)||(n={matches:n});var a=new mp(0,r||this.scope),o=a.conditions={},l,c,u;Te&&!a.selector&&(a.selector=Te.selector),this.contexts.push(a),i=a.add("onMatch",i),a.queries=n;for(c in n)c==="all"?u=1:(l=ei.matchMedia(n[c]),l&&(ls.indexOf(a)<0&&ls.push(a),(o[c]=l.matches)&&(u=1),l.addListener?l.addListener(jr):l.addEventListener("change",jr),(a._mqs||(a._mqs=[])).push(l)));return u&&i(a,function(f){return a.add(null,f)}),this},t.revert=function(n){this.kill(n||{})},t.kill=function(n){this.contexts.forEach(function(i){return i.kill(n,!0)})},s})(),vo={registerPlugin:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];e.forEach(function(i){return ip(i)})},timeline:function(t){return new un(t)},getTweensOf:function(t,e){return Ce.getTweensOf(t,e)},getProperty:function(t,e,n,i){Ke(t)&&(t=Un(t)[0]);var r=rs(t||{}).get,a=n?Wd:Vd;return n==="native"&&(n=""),t&&(e?a((bn[e]&&bn[e].get||r)(t,e,n,i)):function(o,l,c){return a((bn[o]&&bn[o].get||r)(t,o,l,c))})},quickSetter:function(t,e,n){if(t=Un(t),t.length>1){var i=t.map(function(u){return Mn.quickSetter(u,e,n)}),r=i.length;return function(u){for(var f=r;f--;)i[f](u)}}t=t[0]||{};var a=bn[e],o=rs(t),l=o.harness&&(o.harness.aliases||{})[e]||e,c=a?function(u){var f=new a;Fs._pt=0,f.init(t,n?u+n:u,Fs,0,[t]),f.render(1,f),Fs._pt&&Au(1,Fs)}:o.set(t,l);return a?c:function(u){return c(t,l,n?u+n:u,o,1)}},quickTo:function(t,e,n){var i,r=Mn.to(t,Pn((i={},i[e]="+=0.1",i.paused=!0,i.stagger=0,i),n||{})),a=function(l,c,u){return r.resetTo(e,l,c,u)};return a.tween=r,a},isTweening:function(t){return Ce.getTweensOf(t,!0).length>0},defaults:function(t){return t&&t.ease&&(t.ease=os(t.ease,Yr.ease)),lf(Yr,t||{})},config:function(t){return lf(Rn,t||{})},registerEffect:function(t){var e=t.name,n=t.effect,i=t.plugins,r=t.defaults,a=t.extendTimeline;(i||"").split(",").forEach(function(o){return o&&!bn[o]&&!Cn[o]&&Zr(e+" effect requires "+o+" plugin.")}),vl[e]=function(o,l,c){return n(Un(o),Pn(l||{},r),c)},a&&(un.prototype[e]=function(o,l,c){return this.add(vl[e](o,oi(l)?l:(c=l)&&{},this),c)})},registerEase:function(t,e){ce[t]=os(e)},parseEase:function(t,e){return arguments.length?os(t,e):ce},getById:function(t){return Ce.getById(t)},exportRoot:function(t,e){t===void 0&&(t={});var n=new un(t),i,r;for(n.smoothChildTiming=mn(t.smoothChildTiming),Ce.remove(n),n._dp=0,n._time=n._tTime=Ce._time,i=Ce._first;i;)r=i._next,(e||!(!i._dur&&i instanceof ke&&i.vars.onComplete===i._targets[0]))&&ii(n,i,i._start-i._delay),i=r;return ii(Ce,n,0),n},context:function(t,e){return t?new mp(t,e):Te},matchMedia:function(t){return new my(t)},matchMediaRefresh:function(){return ls.forEach(function(t){var e=t.conditions,n,i;for(i in e)e[i]&&(e[i]=!1,n=1);n&&t.revert()})||jr()},addEventListener:function(t,e){var n=ja[t]||(ja[t]=[]);~n.indexOf(e)||n.push(e)},removeEventListener:function(t,e){var n=ja[t],i=n&&n.indexOf(e);i>=0&&n.splice(i,1)},utils:{wrap:qS,wrapYoyo:YS,distribute:$d,random:jd,snap:Qd,normalize:XS,getUnit:en,clamp:GS,splitColor:sp,toArray:Un,selector:wc,mapRange:ep,pipe:VS,unitize:WS,interpolate:ZS,shuffle:Jd},install:Bd,effects:vl,ticker:Tn,updateRoot:un.updateRoot,plugins:bn,globalTimeline:Ce,core:{PropTween:gn,globals:zd,Tween:ke,Timeline:un,Animation:Qr,getCache:rs,_removeLinkedListItem:No,reverting:function(){return Qe},context:function(t){return t&&Te&&(Te.data.push(t),t._ctx=Te),Te},suppressOverwrites:function(t){return pu=t}}};_n("to,from,fromTo,delayedCall,set,killTweensOf",function(s){return vo[s]=ke[s]});Tn.add(un.updateRoot);Fs=vo.to({},{duration:0});var _y=function(t,e){for(var n=t._pt;n&&n.p!==e&&n.op!==e&&n.fp!==e;)n=n._next;return n},gy=function(t,e){var n=t._targets,i,r,a;for(i in e)for(r=n.length;r--;)a=t._ptLookup[r][i],a&&(a=a.d)&&(a._pt&&(a=_y(a,i)),a&&a.modifier&&a.modifier(e[i],t,n[r],i))},El=function(t,e){return{name:t,headless:1,rawVars:1,init:function(i,r,a){a._onInit=function(o){var l,c;if(Ke(r)&&(l={},_n(r,function(u){return l[u]=1}),r=l),e){l={};for(c in r)l[c]=e(r[c]);r=l}gy(o,r)}}}},Mn=vo.registerPlugin({name:"attr",init:function(t,e,n,i,r){var a,o,l;this.tween=n;for(a in e)l=t.getAttribute(a)||"",o=this.add(t,"setAttribute",(l||0)+"",e[a],i,r,0,0,a),o.op=a,o.b=l,this._props.push(a)},render:function(t,e){for(var n=e._pt;n;)Qe?n.set(n.t,n.p,n.b,n):n.r(t,n.d),n=n._next}},{name:"endArray",headless:1,init:function(t,e){for(var n=e.length;n--;)this.add(t,n,t[n]||0,e[n],0,0,0,0,0,1)}},El("roundProps",Ac),El("modifiers"),El("snap",Qd))||vo;ke.version=un.version=Mn.version="3.15.1";Fd=1;_u()&&js();ce.Power0;ce.Power1;ce.Power2;ce.Power3;ce.Power4;ce.Linear;ce.Quad;ce.Cubic;ce.Quart;ce.Quint;ce.Strong;ce.Elastic;ce.Back;ce.SteppedEase;ce.Bounce;ce.Sine;ce.Expo;ce.Circ;/*!
 * CSSPlugin 3.15.1
 * https://gsap.com
 *
 * Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var pf,Oi,Hs,Ru,is,mf,Cu,xy=function(){return typeof window<"u"},wi={},es=180/Math.PI,Vs=Math.PI/180,Ls=Math.atan2,_f=1e8,Pu=/([A-Z])/g,vy=/(left|right|width|margin|padding|x)/i,My=/[\s,\(]\S/,ri={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},Cc=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},Sy=function(t,e){return e.set(e.t,e.p,t===1?e.e:Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},yy=function(t,e){return e.set(e.t,e.p,t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},by=function(t,e){return e.set(e.t,e.p,t===1?e.e:t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},Ey=function(t,e){var n=e.s+e.c*t;e.set(e.t,e.p,~~(n+(n<0?-.5:.5))+e.u,e)},_p=function(t,e){return e.set(e.t,e.p,t?e.e:e.b,e)},gp=function(t,e){return e.set(e.t,e.p,t!==1?e.b:e.e,e)},Ty=function(t,e,n){return t.style[e]=n},wy=function(t,e,n){return t.style.setProperty(e,n)},Ay=function(t,e,n){return t._gsap[e]=n},Ry=function(t,e,n){return t._gsap.scaleX=t._gsap.scaleY=n},Cy=function(t,e,n,i,r){var a=t._gsap;a.scaleX=a.scaleY=n,a.renderTransform(r,a)},Py=function(t,e,n,i,r){var a=t._gsap;a[e]=n,a.renderTransform(r,a)},Le="transform",xn=Le+"Origin",Dy=function s(t,e){var n=this,i=this.target,r=i.style,a=i._gsap;if(t in wi&&r){if(this.tfm=this.tfm||{},t!=="transform")t=ri[t]||t,~t.indexOf(",")?t.split(",").forEach(function(o){return n.tfm[o]=xi(i,o)}):this.tfm[t]=a.x?a[t]:xi(i,t),t===xn&&(this.tfm.zOrigin=a.zOrigin);else return ri.transform.split(",").forEach(function(o){return s.call(n,o,e)});if(this.props.indexOf(Le)>=0)return;a.svg&&(this.svgo=i.getAttribute("data-svg-origin"),this.props.push(xn,e,"")),t=Le}(r||e)&&this.props.push(t,e,r[t])},xp=function(t){t.translate&&(t.removeProperty("translate"),t.removeProperty("scale"),t.removeProperty("rotate"))},Ly=function(){var t=this.props,e=this.target,n=e.style,i=e._gsap,r,a;for(r=0;r<t.length;r+=3)t[r+1]?t[r+1]===2?e[t[r]](t[r+2]):e[t[r]]=t[r+2]:t[r+2]?n[t[r]]=t[r+2]:n.removeProperty(t[r].substr(0,2)==="--"?t[r]:t[r].replace(Pu,"-$1").toLowerCase());if(this.tfm){for(a in this.tfm)i[a]=this.tfm[a];i.svg&&(i.renderTransform(),e.setAttribute("data-svg-origin",this.svgo||"")),r=Cu(),(!r||!r.isStart)&&!n[Le]&&(xp(n),i.zOrigin&&n[xn]&&(n[xn]+=" "+i.zOrigin+"px",i.zOrigin=0,i.renderTransform()),i.uncache=1)}},vp=function(t,e){var n={target:t,props:[],revert:Ly,save:Dy};return t._gsap||Mn.core.getCache(t),e&&t.style&&t.nodeType&&e.split(",").forEach(function(i){return n.save(i)}),n},Mp,Pc=function(t,e){var n=Oi.createElementNS?Oi.createElementNS((e||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),t):Oi.createElement(t);return n&&n.style?n:Oi.createElement(t)},An=function s(t,e,n){var i=getComputedStyle(t);return i[e]||i.getPropertyValue(e.replace(Pu,"-$1").toLowerCase())||i.getPropertyValue(e)||!n&&s(t,tr(e)||e,1)||""},gf="O,Moz,ms,Ms,Webkit".split(","),tr=function(t,e,n){var i=e||is,r=i.style,a=5;if(t in r&&!n)return t;for(t=t.charAt(0).toUpperCase()+t.substr(1);a--&&!(gf[a]+t in r););return a<0?null:(a===3?"ms":a>=0?gf[a]:"")+t},Dc=function(){xy()&&window.document&&(pf=window,Oi=pf.document,Hs=Oi.documentElement,is=Pc("div")||{style:{}},Pc("div"),Le=tr(Le),xn=Le+"Origin",is.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",Mp=!!tr("perspective"),Cu=Mn.core.reverting,Ru=1)},xf=function(t){var e=t.ownerSVGElement,n=Pc("svg",e&&e.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),i=t.cloneNode(!0),r;i.style.display="block",n.appendChild(i),Hs.appendChild(n);try{r=i.getBBox()}catch{}return n.removeChild(i),Hs.removeChild(n),r},vf=function(t,e){for(var n=e.length;n--;)if(t.hasAttribute(e[n]))return t.getAttribute(e[n])},Sp=function(t){var e,n;try{e=t.getBBox()}catch{e=xf(t),n=1}return e&&(e.width||e.height)||n||(e=xf(t)),e&&!e.width&&!e.x&&!e.y?{x:+vf(t,["x","cx","x1"])||0,y:+vf(t,["y","cy","y1"])||0,width:0,height:0}:e},yp=function(t){return!!(t.getCTM&&(!t.parentNode||t.ownerSVGElement)&&Sp(t))},Wi=function(t,e){if(e){var n=t.style,i;e in wi&&e!==xn&&(e=Le),n.removeProperty?(i=e.substr(0,2),(i==="ms"||e.substr(0,6)==="webkit")&&(e="-"+e),n.removeProperty(i==="--"?e:e.replace(Pu,"-$1").toLowerCase())):n.removeAttribute(e)}},Fi=function(t,e,n,i,r,a){var o=new gn(t._pt,e,n,0,1,a?gp:_p);return t._pt=o,o.b=i,o.e=r,t._props.push(n),o},Mf={deg:1,rad:1,turn:1},Ny={grid:1,flex:1},Xi=function s(t,e,n,i){var r=parseFloat(n)||0,a=(n+"").trim().substr((r+"").length)||"px",o=is.style,l=vy.test(e),c=t.tagName.toLowerCase()==="svg",u=(c?"client":"offset")+(l?"Width":"Height"),f=100,h=i==="px",d=i==="%",g,_,p,m;if(i===a||!r||Mf[i]||Mf[a])return r;if(a!=="px"&&!h&&(r=s(t,e,n,"px")),m=t.getCTM&&yp(t),(d||a==="%")&&(wi[e]||~e.indexOf("adius")))return g=m?t.getBBox()[l?"width":"height"]:t[u],Fe(d?r/g*f:r/100*g);if(o[l?"width":"height"]=f+(h?a:i),_=i!=="rem"&&~e.indexOf("adius")||i==="em"&&t.appendChild&&!c?t:t.parentNode,m&&(_=(t.ownerSVGElement||{}).parentNode),(!_||_===Oi||!_.appendChild)&&(_=Oi.body),p=_._gsap,p&&d&&p.width&&l&&p.time===Tn.time&&!p.uncache)return Fe(r/p.width*f);if(d&&(e==="height"||e==="width")){var x=t.style[e];t.style[e]=f+i,g=t[u],x?t.style[e]=x:Wi(t,e)}else(d||a==="%")&&!Ny[An(_,"display")]&&(o.position=An(t,"position")),_===t&&(o.position="static"),_.appendChild(is),g=is[u],_.removeChild(is),o.position="absolute";return l&&d&&(p=rs(_),p.time=Tn.time,p.width=_[u]),Fe(h?g*r/f:g&&r?f/g*r:0)},xi=function(t,e,n,i){var r;return Ru||Dc(),e in ri&&e!=="transform"&&(e=ri[e],~e.indexOf(",")&&(e=e.split(",")[0])),wi[e]&&e!=="transform"?(r=ea(t,i),r=e!=="transformOrigin"?r[e]:r.svg?r.origin:So(An(t,xn))+" "+r.zOrigin+"px"):(r=t.style[e],(!r||r==="auto"||i||~(r+"").indexOf("calc("))&&(r=Mo[e]&&Mo[e](t,e,n)||An(t,e)||Gd(t,e)||(e==="opacity"?1:0))),n&&!~(r+"").trim().indexOf(" ")?Xi(t,e,r,n)+n:r},Iy=function(t,e,n,i){if(!n||n==="none"){var r=tr(e,t,1),a=r&&An(t,r,1);a&&a!==n?(e=r,n=a):e==="borderColor"&&(n=An(t,"borderTopColor"))}var o=new gn(this._pt,t.style,e,0,1,dp),l=0,c=0,u,f,h,d,g,_,p,m,x,M,S,b;if(o.b=n,o.e=i,n+="",i+="",i.substring(0,6)==="var(--"&&(i=An(t,i.substring(4,i.indexOf(")")))),i==="auto"&&(_=t.style[e],t.style[e]=i,i=An(t,e)||i,_?t.style[e]=_:Wi(t,e)),u=[n,i],ap(u),n=u[0],i=u[1],h=n.match(Os)||[],b=i.match(Os)||[],b.length){for(;f=Os.exec(i);)p=f[0],x=i.substring(l,f.index),g?g=(g+1)%5:(x.substr(-5)==="rgba("||x.substr(-5)==="hsla(")&&(g=1),p!==(_=h[c++]||"")&&(d=parseFloat(_)||0,S=_.substr((d+"").length),p.charAt(1)==="="&&(p=Gs(d,p)+S),m=parseFloat(p),M=p.substr((m+"").length),l=Os.lastIndex-M.length,M||(M=M||Rn.units[e]||S,l===i.length&&(i+=M,o.e+=M)),S!==M&&(d=Xi(t,e,_,M)||0),o._pt={_next:o._pt,p:x||c===1?x:",",s:d,c:m-d,m:g&&g<4||e==="zIndex"?Math.round:0});o.c=l<i.length?i.substring(l,i.length):""}else o.r=e==="display"&&i==="none"?gp:_p;return Od.test(i)&&(o.e=0),this._pt=o,o},Sf={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},Uy=function(t){var e=t.split(" "),n=e[0],i=e[1]||"50%";return(n==="top"||n==="bottom"||i==="left"||i==="right")&&(t=n,n=i,i=t),e[0]=Sf[n]||n,e[1]=Sf[i]||i,e.join(" ")},Oy=function(t,e){if(e.tween&&e.tween._time===e.tween._dur){var n=e.t,i=n.style,r=e.u,a=n._gsap,o,l,c;if(r==="all"||r===!0)i.cssText="",l=1;else for(r=r.split(","),c=r.length;--c>-1;)o=r[c],wi[o]&&(l=1,o=o==="transformOrigin"?xn:Le),Wi(n,o);l&&(Wi(n,Le),a&&(a.svg&&n.removeAttribute("transform"),i.scale=i.rotate=i.translate="none",ea(n,1),a.uncache=1,xp(i)))}},Mo={clearProps:function(t,e,n,i,r){if(r.data!=="isFromStart"){var a=t._pt=new gn(t._pt,e,n,0,0,Oy);return a.u=i,a.pr=-10,a.tween=r,t._props.push(n),1}}},ta=[1,0,0,1,0,0],bp={},Ep=function(t){return t==="matrix(1, 0, 0, 1, 0, 0)"||t==="none"||!t},yf=function(t){var e=An(t,Le);return Ep(e)?ta:e.substr(7).match(Ud).map(Fe)},Du=function(t,e){var n=t._gsap||rs(t),i=t.style,r=yf(t),a,o,l,c;return n.svg&&t.getAttribute("transform")?(l=t.transform.baseVal.consolidate().matrix,r=[l.a,l.b,l.c,l.d,l.e,l.f],r.join(",")==="1,0,0,1,0,0"?ta:r):(r===ta&&!t.offsetParent&&t!==Hs&&!n.svg&&(l=i.display,i.display="block",a=t.parentNode,(!a||!t.offsetParent&&!t.getBoundingClientRect().width)&&(c=1,o=t.nextElementSibling,Hs.appendChild(t)),r=yf(t),l?i.display=l:Wi(t,"display"),c&&(o?a.insertBefore(t,o):a?a.appendChild(t):Hs.removeChild(t))),e&&r.length>6?[r[0],r[1],r[4],r[5],r[12],r[13]]:r)},Lc=function(t,e,n,i,r,a){var o=t._gsap,l=r||Du(t,!0),c=o.xOrigin||0,u=o.yOrigin||0,f=o.xOffset||0,h=o.yOffset||0,d=l[0],g=l[1],_=l[2],p=l[3],m=l[4],x=l[5],M=e.split(" "),S=parseFloat(M[0])||0,b=parseFloat(M[1])||0,E,v,y,C;n?l!==ta&&(v=d*p-g*_)&&(y=S*(p/v)+b*(-_/v)+(_*x-p*m)/v,C=S*(-g/v)+b*(d/v)-(d*x-g*m)/v,S=y,b=C):(E=Sp(t),S=E.x+(~M[0].indexOf("%")?S/100*E.width:S),b=E.y+(~(M[1]||M[0]).indexOf("%")?b/100*E.height:b)),i||i!==!1&&o.smooth?(m=S-c,x=b-u,o.xOffset=f+(m*d+x*_)-m,o.yOffset=h+(m*g+x*p)-x):o.xOffset=o.yOffset=0,o.xOrigin=S,o.yOrigin=b,o.smooth=!!i,o.origin=e,o.originIsAbsolute=!!n,t.style[xn]="0px 0px",a&&(Fi(a,o,"xOrigin",c,S),Fi(a,o,"yOrigin",u,b),Fi(a,o,"xOffset",f,o.xOffset),Fi(a,o,"yOffset",h,o.yOffset)),t.setAttribute("data-svg-origin",S+" "+b)},ea=function(t,e){var n=t._gsap||new lp(t);if("x"in n&&!e&&!n.uncache)return n;var i=t.style,r=n.scaleX<0,a="px",o="deg",l=getComputedStyle(t),c=An(t,xn)||"0",u,f,h,d,g,_,p,m,x,M,S,b,E,v,y,C,R,L,U,B,w,I,D,O,H,z,V,Y,ut,At,K,lt;return u=f=h=_=p=m=x=M=S=0,d=g=1,n.svg=!!(t.getCTM&&yp(t)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(i[Le]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[Le]!=="none"?l[Le]:"")),i.scale=i.rotate=i.translate="none"),v=Du(t,n.svg),n.svg&&(n.uncache?(H=t.getBBox(),c=n.xOrigin-H.x+"px "+(n.yOrigin-H.y)+"px",O=""):O=!e&&t.getAttribute("data-svg-origin"),Lc(t,O||c,!!O||n.originIsAbsolute,n.smooth!==!1,v)),b=n.xOrigin||0,E=n.yOrigin||0,v!==ta&&(L=v[0],U=v[1],B=v[2],w=v[3],u=I=v[4],f=D=v[5],v.length===6?(d=Math.sqrt(L*L+U*U),g=Math.sqrt(w*w+B*B),_=L||U?Ls(U,L)*es:0,x=B||w?Ls(B,w)*es+_:0,x&&(g*=Math.abs(Math.cos(x*Vs))),n.svg&&(u-=b-(b*L+E*B),f-=E-(b*U+E*w))):(lt=v[6],At=v[7],V=v[8],Y=v[9],ut=v[10],K=v[11],u=v[12],f=v[13],h=v[14],y=Ls(lt,ut),p=y*es,y&&(C=Math.cos(-y),R=Math.sin(-y),O=I*C+V*R,H=D*C+Y*R,z=lt*C+ut*R,V=I*-R+V*C,Y=D*-R+Y*C,ut=lt*-R+ut*C,K=At*-R+K*C,I=O,D=H,lt=z),y=Ls(-B,ut),m=y*es,y&&(C=Math.cos(-y),R=Math.sin(-y),O=L*C-V*R,H=U*C-Y*R,z=B*C-ut*R,K=w*R+K*C,L=O,U=H,B=z),y=Ls(U,L),_=y*es,y&&(C=Math.cos(y),R=Math.sin(y),O=L*C+U*R,H=I*C+D*R,U=U*C-L*R,D=D*C-I*R,L=O,I=H),p&&Math.abs(p)+Math.abs(_)>359.9&&(p=_=0,m=180-m),d=Fe(Math.sqrt(L*L+U*U+B*B)),g=Fe(Math.sqrt(D*D+lt*lt)),y=Ls(I,D),x=Math.abs(y)>2e-4?y*es:0,S=K?1/(K<0?-K:K):0),n.svg&&(O=t.getAttribute("transform"),n.forceCSS=t.setAttribute("transform","")||!Ep(An(t,Le)),O&&t.setAttribute("transform",O))),Math.abs(x)>90&&Math.abs(x)<270&&(r?(d*=-1,x+=_<=0?180:-180,_+=_<=0?180:-180):(g*=-1,x+=x<=0?180:-180)),e=e||n.uncache,n.x=u-((n.xPercent=u&&(!e&&n.xPercent||(Math.round(t.offsetWidth/2)===Math.round(-u)?-50:0)))?t.offsetWidth*n.xPercent/100:0)+a,n.y=f-((n.yPercent=f&&(!e&&n.yPercent||(Math.round(t.offsetHeight/2)===Math.round(-f)?-50:0)))?t.offsetHeight*n.yPercent/100:0)+a,n.z=h+a,n.scaleX=Fe(d),n.scaleY=Fe(g),n.rotation=Fe(_)+o,n.rotationX=Fe(p)+o,n.rotationY=Fe(m)+o,n.skewX=x+o,n.skewY=M+o,n.transformPerspective=S+a,(n.zOrigin=parseFloat(c.split(" ")[2])||!e&&n.zOrigin||0)&&(i[xn]=So(c)),n.xOffset=n.yOffset=0,n.force3D=Rn.force3D,n.renderTransform=n.svg?By:Mp?Tp:Fy,n.uncache=0,n},So=function(t){return(t=t.split(" "))[0]+" "+t[1]},Tl=function(t,e,n){var i=en(e);return Fe(parseFloat(e)+parseFloat(Xi(t,"x",n+"px",i)))+i},Fy=function(t,e){e.z="0px",e.rotationY=e.rotationX="0deg",e.force3D=0,Tp(t,e)},ji="0deg",yr="0px",ts=") ",Tp=function(t,e){var n=e||this,i=n.xPercent,r=n.yPercent,a=n.x,o=n.y,l=n.z,c=n.rotation,u=n.rotationY,f=n.rotationX,h=n.skewX,d=n.skewY,g=n.scaleX,_=n.scaleY,p=n.transformPerspective,m=n.force3D,x=n.target,M=n.zOrigin,S="",b=m==="auto"&&t&&t!==1||m===!0;if(M&&(f!==ji||u!==ji)){var E=parseFloat(u)*Vs,v=Math.sin(E),y=Math.cos(E),C;E=parseFloat(f)*Vs,C=Math.cos(E),a=Tl(x,a,v*C*-M),o=Tl(x,o,-Math.sin(E)*-M),l=Tl(x,l,y*C*-M+M)}p!==yr&&(S+="perspective("+p+ts),(i||r)&&(S+="translate("+i+"%, "+r+"%) "),(b||a!==yr||o!==yr||l!==yr)&&(S+=l!==yr||b?"translate3d("+a+", "+o+", "+l+") ":"translate("+a+", "+o+ts),c!==ji&&(S+="rotate("+c+ts),u!==ji&&(S+="rotateY("+u+ts),f!==ji&&(S+="rotateX("+f+ts),(h!==ji||d!==ji)&&(S+="skew("+h+", "+d+ts),(g!==1||_!==1)&&(S+="scale("+g+", "+_+ts),x.style[Le]=S||"translate(0, 0)"},By=function(t,e){var n=e||this,i=n.xPercent,r=n.yPercent,a=n.x,o=n.y,l=n.rotation,c=n.skewX,u=n.skewY,f=n.scaleX,h=n.scaleY,d=n.target,g=n.xOrigin,_=n.yOrigin,p=n.xOffset,m=n.yOffset,x=n.forceCSS,M=parseFloat(a),S=parseFloat(o),b,E,v,y,C;l=parseFloat(l),c=parseFloat(c),u=parseFloat(u),u&&(u=parseFloat(u),c+=u,l+=u),l||c?(l*=Vs,c*=Vs,b=Math.cos(l)*f,E=Math.sin(l)*f,v=Math.sin(l-c)*-h,y=Math.cos(l-c)*h,c&&(u*=Vs,C=Math.tan(c-u),C=Math.sqrt(1+C*C),v*=C,y*=C,u&&(C=Math.tan(u),C=Math.sqrt(1+C*C),b*=C,E*=C)),b=Fe(b),E=Fe(E),v=Fe(v),y=Fe(y)):(b=f,y=h,E=v=0),(M&&!~(a+"").indexOf("px")||S&&!~(o+"").indexOf("px"))&&(M=Xi(d,"x",a,"px"),S=Xi(d,"y",o,"px")),(g||_||p||m)&&(M=Fe(M+g-(g*b+_*v)+p),S=Fe(S+_-(g*E+_*y)+m)),(i||r)&&(C=d.getBBox(),M=Fe(M+i/100*C.width),S=Fe(S+r/100*C.height)),C="matrix("+b+","+E+","+v+","+y+","+M+","+S+")",d.setAttribute("transform",C),x&&(d.style[Le]=C)},zy=function(t,e,n,i,r){var a=360,o=Ke(r),l=parseFloat(r)*(o&&~r.indexOf("rad")?es:1),c=l-i,u=i+c+"deg",f,h;return o&&(f=r.split("_")[1],f==="short"&&(c%=a,c!==c%(a/2)&&(c+=c<0?a:-a)),f==="cw"&&c<0?c=(c+a*_f)%a-~~(c/a)*a:f==="ccw"&&c>0&&(c=(c-a*_f)%a-~~(c/a)*a)),t._pt=h=new gn(t._pt,e,n,i,c,Sy),h.e=u,h.u="deg",t._props.push(n),h},bf=function(t,e){for(var n in e)t[n]=e[n];return t},ky=function(t,e,n){var i=bf({},n._gsap),r="perspective,force3D,transformOrigin,svgOrigin",a=n.style,o,l,c,u,f,h,d,g;i.svg?(c=n.getAttribute("transform"),n.setAttribute("transform",""),a[Le]=e,o=ea(n,1),Wi(n,Le),n.setAttribute("transform",c)):(c=getComputedStyle(n)[Le],a[Le]=e,o=ea(n,1),a[Le]=c);for(l in wi)c=i[l],u=o[l],c!==u&&r.indexOf(l)<0&&(d=en(c),g=en(u),f=d!==g?Xi(n,l,c,g):parseFloat(c),h=parseFloat(u),t._pt=new gn(t._pt,o,l,f,h-f,Cc),t._pt.u=g||0,t._props.push(l));bf(o,i)};_n("padding,margin,Width,Radius",function(s,t){var e="Top",n="Right",i="Bottom",r="Left",a=(t<3?[e,n,i,r]:[e+r,e+n,i+n,i+r]).map(function(o){return t<2?s+o:"border"+o+s});Mo[t>1?"border"+s:s]=function(o,l,c,u,f){var h,d;if(arguments.length<4)return h=a.map(function(g){return xi(o,g,c)}),d=h.join(" "),d.split(h[0]).length===5?h[0]:d;h=(u+"").split(" "),d={},a.forEach(function(g,_){return d[g]=h[_]=h[_]||h[(_-1)/2|0]}),o.init(l,d,f)}});var wp={name:"css",register:Dc,targetTest:function(t){return t.style&&t.nodeType},init:function(t,e,n,i,r){var a=this._props,o=t.style,l=n.vars.startAt,c,u,f,h,d,g,_,p,m,x,M,S,b,E,v,y,C;Ru||Dc(),this.styles=this.styles||vp(t),y=this.styles.props,this.tween=n;for(_ in e)if(_!=="autoRound"&&(u=e[_],!(bn[_]&&cp(_,e,n,i,t,r)))){if(d=typeof u,g=Mo[_],d==="function"&&(u=u.call(n,i,t,r),d=typeof u),d==="string"&&~u.indexOf("random(")&&(u=Jr(u)),g)g(this,t,_,u,n)&&(v=1);else if(_.substr(0,2)==="--")c=(getComputedStyle(t).getPropertyValue(_)+"").trim(),u+="",Gi.lastIndex=0,Gi.test(c)||(p=en(c),m=en(u),m?p!==m&&(c=Xi(t,_,c,m)+m):p&&(u+=p)),this.add(o,"setProperty",c,u,i,r,0,0,_),a.push(_),y.push(_,0,o[_]);else if(d!=="undefined"){if(l&&_ in l?(c=typeof l[_]=="function"?l[_].call(n,i,t,r):l[_],Ke(c)&&~c.indexOf("random(")&&(c=Jr(c)),en(c+"")||c==="auto"||(c+=Rn.units[_]||en(xi(t,_))||""),(c+"").charAt(1)==="="&&(c=xi(t,_))):c=xi(t,_),h=parseFloat(c),x=d==="string"&&u.charAt(1)==="="&&u.substr(0,2),x&&(u=u.substr(2)),f=parseFloat(u),_ in ri&&(_==="autoAlpha"&&(h===1&&xi(t,"visibility")==="hidden"&&f&&(h=0),y.push("visibility",0,o.visibility),Fi(this,o,"visibility",h?"inherit":"hidden",f?"inherit":"hidden",!f)),_!=="scale"&&_!=="transform"&&(_=ri[_],~_.indexOf(",")&&(_=_.split(",")[0]))),M=_ in wi,M){if(this.styles.save(_),C=u,d==="string"&&u.substring(0,6)==="var(--"){if(u=An(t,u.substring(4,u.indexOf(")"))),u.substring(0,5)==="calc("){var R=t.style.perspective;t.style.perspective=u,u=An(t,"perspective"),R?t.style.perspective=R:Wi(t,"perspective")}f=parseFloat(u)}if(S||(b=t._gsap,b.renderTransform&&!e.parseTransform||ea(t,e.parseTransform),E=e.smoothOrigin!==!1&&b.smooth,S=this._pt=new gn(this._pt,o,Le,0,1,b.renderTransform,b,0,-1),S.dep=1),_==="scale")this._pt=new gn(this._pt,b,"scaleY",b.scaleY,(x?Gs(b.scaleY,x+f):f)-b.scaleY||0,Cc),this._pt.u=0,a.push("scaleY",_),_+="X";else if(_==="transformOrigin"){y.push(xn,0,o[xn]),u=Uy(u),b.svg?Lc(t,u,0,E,0,this):(m=parseFloat(u.split(" ")[2])||0,m!==b.zOrigin&&Fi(this,b,"zOrigin",b.zOrigin,m),Fi(this,o,_,So(c),So(u)));continue}else if(_==="svgOrigin"){Lc(t,u,1,E,0,this);continue}else if(_ in bp){zy(this,b,_,h,x?Gs(h,x+u):u);continue}else if(_==="smoothOrigin"){Fi(this,b,"smooth",b.smooth,u);continue}else if(_==="force3D"){b[_]=u;continue}else if(_==="transform"){ky(this,u,t);continue}}else _ in o||(_=tr(_)||_);if(M||(f||f===0)&&(h||h===0)&&!My.test(u)&&_ in o)p=(c+"").substr((h+"").length),f||(f=0),m=en(u)||(_ in Rn.units?Rn.units[_]:p),p!==m&&(h=Xi(t,_,c,m)),this._pt=new gn(this._pt,M?b:o,_,h,(x?Gs(h,x+f):f)-h,!M&&(m==="px"||_==="zIndex")&&e.autoRound!==!1?Ey:Cc),this._pt.u=m||0,M&&C!==u?(this._pt.b=c,this._pt.e=C,this._pt.r=by):p!==m&&m!=="%"&&(this._pt.b=c,this._pt.r=yy);else if(_ in o)Iy.call(this,t,_,c,x?x+u:u);else if(_ in t)this.add(t,_,c||t[_],x?x+u:u,i,r);else if(_!=="parseTransform"){xu(_,u);continue}M||(_ in o?y.push(_,0,o[_]):typeof t[_]=="function"?y.push(_,2,t[_]()):y.push(_,1,c||t[_])),a.push(_)}}v&&pp(this)},render:function(t,e){if(e.tween._time||!Cu())for(var n=e._pt;n;)n.r(t,n.d),n=n._next;else e.styles.revert()},get:xi,aliases:ri,getSetter:function(t,e,n){var i=ri[e];return i&&i.indexOf(",")<0&&(e=i),e in wi&&e!==xn&&(t._gsap.x||xi(t,"x"))?n&&mf===n?e==="scale"?Ry:Ay:(mf=n||{})&&(e==="scale"?Cy:Py):t.style&&!mu(t.style[e])?Ty:~e.indexOf("-")?wy:wu(t,e)},core:{_removeProperty:Wi,_getMatrix:Du}};Mn.utils.checkPrefix=tr;Mn.core.getStyleSaver=vp;(function(s,t,e,n){var i=_n(s+","+t+","+e,function(r){wi[r]=1});_n(t,function(r){Rn.units[r]="deg",bp[r]=1}),ri[i[13]]=s+","+t,_n(n,function(r){var a=r.split(":");ri[a[1]]=i[a[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");_n("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(s){Rn.units[s]="px"});Mn.registerPlugin(wp);var to=Mn.registerPlugin(wp)||Mn;to.core.Tween;const Gy=["category","file","algorithm"],Hy=["file","algorithm","reference"],Vy={category:"#469b8e",file:"#527bb8",algorithm:"#49a79b",reference:"#9675b6"};function eo(s,t,e,n,i){const r=Math.floor(s/e),a=Math.min(e,t-r*e);return[(s%e-(a-1)/2)*n,(Math.ceil(t/e)-1)*i/2-r*i]}function Wy(s,t,e){if(s.kind==="category")return t?[55,55,16]:[47,47,16];if(s.kind==="reference")return[32,35,26];const n=Math.log1p(s.total||0)/Math.log1p(e);if(s.kind==="file"){const r=t?9+21*n:15;return t?[52,35,r]:[44,30,r]}const i=t?25+37*n:35;return[i,i,i]}function Xy(s,t,e,n,i){if(s.kind==="category")return eo(t,e,2,n?119:169,n?86:100);if(s.kind==="file")return eo(t,e,i,n?117:133,n?77:102);if(e>15)return eo(t,e,i,84,77);if(t===0)return[0,0];const r=(t-1)*2*Math.PI/Math.max(e-1,1)-Math.PI/2;return[(n?99:158)*Math.cos(r),98*Math.sin(r)]}function qy(s,t,e=!1){const n=t==="atlas",i=n?300:250,r=s.nodes,a=r.reduce((h,d)=>Math.max(h,d.total||0),1),o=(n?Gy:Hy).map((h,d)=>{const g=r.filter(x=>x.kind===h);n||g.sort((x,M)=>(x.y||0)-(M.y||0)||(x.x||0)-(M.x||0));const _=n&&h==="file"?Math.max(1,Math.min(e?2:4,Math.ceil(g.length/2))):Math.max(2,Math.ceil(Math.sqrt(g.length*1.35)));let p=n?e?264:420:Math.max(310,_*120+36),m=n?e?278:350:Math.max(215,Math.ceil(g.length/_)*83+44);return n&&s.expanded&&h==="file"&&(e||(p=Math.max(p,(_-1)*133+120)),m=Math.max(m,Math.ceil(g.length/_)*(e?77:102)+54)),n&&h==="algorithm"&&g.length>15&&(p=Math.max(p,_*84+24),m=Math.max(m,Math.ceil(g.length/_)*77+36)),{kind:h,index:d,depth:(1-d)*i,width:p,height:m,data:g,columns:_}}).filter(h=>!n||h.kind!=="file"||!!s.expanded),l=Math.max(...o.map(h=>h.width)),c=new Map;for(const h of o){const d=n?e?l*.36:l*.82:e?l*.1:Math.max(175,l*.42),g=h.index-1;h.center=new N(g*d,n?g*48:0,h.depth),n&&(h.caption={layer:h.index,size:[164,36,1],position:h.center.clone().add(new N(0,19-h.height/2,-.7))}),h.data.forEach((_,p)=>{const m=n?Xy(_,p,h.data.length,e,h.columns):eo(p,h.data.length,h.columns,120,83),x=h.center.clone().add(new N(m[0],m[1],0)),M=Wy(_,n,a),S=n&&_.kind==="algorithm"?Np(_.label):Vy[_.kind];c.set(_.id,{..._,position:x,size:M,tint:S,layer:h.index})})}const u=(s.branches||[]).map(h=>({...h,id:"branch:"+h.target,branch:!0,status:"pending",color:"#28ad91"})),f=[...s.links,...u].flatMap(h=>{const d=c.get(h.source),g=c.get(h.target);if(!d||!g)return[];const _=h.branch?1.5:h.band??If(h.value||1,s.peak||10,h.status);return[{...h,from:d,to:g,band:_,curve:Yy(d,g)}]});return{layers:o,nodes:c,links:f,peak:a}}function Yy(s,t){const e=s.position.clone(),n=t.position.clone(),i=Math.sign(n.z-e.z);e.z+=(i||1)*s.size[2]*.44,n.z+=(-i||1)*t.size[2]*.44;const r=(e.z+n.z)/2+(i?0:62);return new ad(e,new N(e.x,e.y,r),new N(n.x,n.y,r),n)}function Ef(s,t){const e=new Set(t?[t]:[]),n=new Set;if(!t)return{nodes:e,edges:n};const i=new Set(s.links.filter(r=>r.branch&&r.source===t).map(r=>r.target));for(const r of s.links)(r.source===t||r.target===t||i.has(r.source))&&(n.add(r.id),e.add(r.source),e.add(r.target));for(const r of s.links)r.branch&&e.has(r.target)&&(n.add(r.id),e.add(r.source));return{nodes:e,edges:n}}const Bi=4,Zy=new N,Ky=[-1,1].flatMap(s=>[-1,1].flatMap(t=>[-1,1].map(e=>[s,t,e]))),Jy=[[0,0],...[20,38,58,78].flatMap(s=>[[0,s],[0,-s],[s,0],[-s,0],[s,s*.67],[-s,s*.67],[s,-s*.67],[-s,-s*.67],[s,s*.4],[-s,s*.4],[s,-s*.4],[-s,-s*.4]])];function ns(s,t){return s.left<t.right&&s.right>t.left&&s.top<t.bottom&&s.bottom>t.top}function Tf(s,t,e,n=new Map,i=new Jn){const r=new N,a=new N(0,0,1).applyQuaternion(i);function o(){return r.project(s),{x:(r.x+1)*t/2,y:(1-r.y)*e/2,z:r.z}}function l(d,g,_,p,m=0,x){return r.set(d,g,_),n.has(p)&&r.applyMatrix4(n.get(p).matrix),r.addScaledVector(a,m),x&&r.add(x),o()}function c(d,g){const _=d.size[2]*.55;return l(g.x,g.y,g.z,d.layer,_)}function u(d,g,_){_.copy(g).applyMatrix4(n.get(d.layer).matrix).addScaledVector(a,d.size[2]*.55)}function f(d,g){const[_,p,m]=d.size,x=r.copy(g);n.has(d.layer)&&x.applyMatrix4(n.get(d.layer).matrix);const M=x.x,S=x.y,b=x.z,E={left:1/0,top:1/0,right:-1/0,bottom:-1/0};for(const[v,y,C]of Ky){r.set(v*_/2,y*p/2,C*m/2).applyQuaternion(i),r.x+=M,r.y+=S,r.z+=b;const R=o();E.left=Math.min(E.left,R.x),E.right=Math.max(E.right,R.x),E.top=Math.min(E.top,R.y),E.bottom=Math.max(E.bottom,R.y)}return E}function h(d,g,_,p){const m=d/t*2-1,x=1-g/e*2,M=new N(m,x,-1).unproject(s),S=new N(m,x,1).unproject(s);if(n.has(p)){const{inverse:E}=n.get(p);M.applyMatrix4(E),S.applyMatrix4(E)}if(S.sub(M),Math.abs(S.z)<1e-7)return null;const b=(_-M.z)/S.z;return b>=0&&b<=1?M.addScaledVector(S,b):null}return{point:l,label:c,placeLabel:u,body:f,world:h,width:t,height:e}}function Nc(s,t,e,n){return{left:s-e/2-2,right:s+e/2+2,top:t-n/2-2,bottom:t+n/2+2}}function Ap(s,t,{w:e,h:n}){const i=Math.max(15,t.bottom-s.y+n/2+Bi),r=Math.min(-15,t.top-s.y-n/2-Bi),a=t.left-s.x-e/2-Bi-2,o=t.right-s.x+e/2+Bi+2;return[[0,i],[0,r],[a,0],[o,0],[24,r],[-24,r],[26,i],[-26,i],[0,i+17],[0,r-17],[a,20],[o,20],[a,-20],[o,-20],[52,i],[-52,i],[52,r],[-52,r],[0,i+37],[0,r-37]]}function Rp(s,{w:t},e){const n=[t/2+7,e-t/2-7].sort((i,r)=>Math.abs(i-s.x)-Math.abs(r-s.x));return[...[66,88,112,142,174].flatMap(i=>[[0,i],[0,-i],[i,0],[-i,0],[i*.6,i*.8],[-i*.6,i*.8],[i*.6,-i*.8],[-i*.6,-i*.8]]),...[0,24,-24,46,-46,70,-70,94,-94,118,-118].flatMap(i=>n.filter(r=>Math.hypot(r-s.x,i)<162).map(r=>[r-s.x,i]))]}function yo(s,t,e,n=0){return s.left>=3&&s.right<=t-3&&s.top>=n&&s.bottom<=e-3}function wl(s){return s.reduce((t,e,n)=>{const i=s[(n+1)%s.length];return t+e.x*i.y-e.y*i.x},0)/2}function wf(s,t){for(let e=0;e<t.length&&s.length;e++){const n=t[e],i=t[(e+1)%t.length],r=c=>(i.x-n.x)*(c.y-n.y)-(i.y-n.y)*(c.x-n.x),a=[];let o=s.at(-1),l=r(o);for(const c of s){const u=r(c);if(l>=0!=u>=0){const f=l/(l-u);a.push({x:o.x+(c.x-o.x)*f,y:o.y+(c.y-o.y)*f})}u>=0&&a.push(c),o=c,l=u}s=a}return s}function $y(s,t,e=!1){const{width:n,height:i}=t,r=[{x:0,y:0},{x:n,y:0},{x:n,y:i},{x:0,y:i}],a=s.filter(f=>f.data.length).flatMap(f=>{const{x:h,y:d,z:g}=f.center,_=t.point(h,d,g,f.index);if(_.z<-1||_.z>1)return[];const p=e?.5:.38;function m(M){const S=[[-1,1],[1,1],[1,-1],[-1,-1]].map(([v,y])=>t.point(h+v*f.width*p,d+y*f.height*p,g,f.index,0,M)),b=wl(S);if(Math.abs(b)<1||S.some(v=>v.z<-1||v.z>1))return{area:0,visible:0,polygon:[]};b<0&&S.reverse();const E=wf(S,r);return{area:Math.abs(b),visible:Math.abs(wl(E)),polygon:E}}const x=m();return x.visible>=1?[{layer:f,at:_,measure:m,home:x}]:[]}),o=(f,h)=>Math.abs(wl(wf(f.polygon,h.polygon)))/Math.max(1,Math.min(f.area,h.area));function l(f){let h=0;for(const[d,g]of f.entries()){h+=g.cost;for(const _ of f.slice(d+1))h+=Math.max(0,o(g.shape,_.shape)-(e?.06:.16))}return h}let c=a.map(f=>({shape:f.home,cost:0})),u=l(c);if(!u)return new Map;for(const f of["x","y"]){let _=function(p){if(p.length===g.length){const m=l(p);m<u-1e-6&&(c=p,u=m);return}for(const m of g[p.length])(!p.length||m.at>=p.at(-1).at-2)&&_([...p,m])};const h=Math.min(e?154:96,(f==="x"?n:i)*(e?.2:.17)),g=a.slice().sort((p,m)=>p.at[f]-m.at[f]).map(p=>{var x;const m=[{board:p,shape:p.home,at:p.at[f],cost:0}];for(const M of[-1,-.5,.5,1]){const S={...p.at,[f]:p.at[f]+h*M},b=(x=t.world(S.x,S.y,p.layer.depth))==null?void 0:x.sub(p.layer.center);if(!b)continue;b.z=0,b.clampLength(0,e?p.layer.width*.55:Math.min(110,p.layer.width*.35));const E=p.measure(b);if(E.visible<p.home.visible*.93)continue;const{x:v,y,z:C}=p.layer.center,R=t.point(v,y,C,p.layer.index,0,b)[f];m.push({board:p,shape:E,offset:b,at:R,cost:b.length()*55e-5})}return m});_([])}return new Map(c.filter(f=>f.offset).map(f=>[f.board.layer.index,f.offset]))}function Qy(s,t,e,n,i){const r=new Map,a=new Map,o=[],l=[],{width:c,height:u}=t,f=new Map(s.layers.map(p=>[p.index,p])),h=p=>(p.row?200:0)+(e.nodes.has(p.id)?120:0)+(p.group?28:0),d=[...s.nodes.values()].sort((p,m)=>h(m)-h(p)),g=c<620,_=n==="atlas"?.66:.5;for(const p of d){const m=p.position,x=t.point(m.x,m.y,m.z,p.layer);if(x.z<-1||x.z>1||x.x<-18||x.x>c+18||x.y<-18||x.y>u+18)continue;const M=f.get(p.layer),[S,b]=p.size,E=p.row?107:68;let v=null;const y=n==="atlas"&&p.row,C=y?i(p,g,n):null;for(const[L,U]of Jy){const B=L||U?t.world(x.x+L,x.y+U,m.z,p.layer):m;if(!B||(B.z=m.z,B.distanceToSquared(m)>E*E||Math.abs(B.x-M.center.x)+S*_>M.width/2||Math.abs(B.y-M.center.y)+b*_>M.height/2||n==="atlas"&&B.y-b*_<M.center.y-M.height/2+26))continue;const w=t.body(p,B),I={left:w.left-Bi,right:w.right+Bi,top:w.top-Bi,bottom:w.bottom+Bi};if(!yo(I,c,u,0)||o.some(V=>ns(V,I))||l.some(V=>ns(V,I)))continue;if(v||(v={pos:B,body:w}),!y)break;const D=t.label(p,B),O=C,z=[...Ap(D,w,O),...Rp(D,O,c)].find(([V,Y])=>{const ut=Nc(D.x+V,D.y+Y,O.w,O.h);return!yo(ut,c,u,43)||ns(ut,w)||o.some(At=>ns(At,ut))||l.some(At=>ns(At,ut))?!1:(l.push(ut),!0)});if(z){a.set(p.id,z),v={pos:B,body:w};break}}const R=(v==null?void 0:v.pos)||m;if(o.push((v==null?void 0:v.body)||t.body(p,m)),R!==m){const L=R.clone().sub(m);L.distanceToSquared(Zy)>.02&&r.set(p.id,L)}}return{offsets:r,hints:a}}function jy(s,t){const e=new Map,n=new Map,i=document.createElement("canvas").getContext("2d"),r=getComputedStyle(document.documentElement).getPropertyValue("--font-sans").trim()||"sans-serif";let a="";function o(h){const d=h.map(_=>_.id).join(`
`);if(d===a)return!1;a=d;const g=new Set(h.map(_=>_.id));for(const[_,p]of e)g.has(_)||(p.anchor.removeFromParent(),e.delete(_));for(const _ of h)if(!e.has(_.id)){const p=document.createElement("div");p.className="spatial-anchor",p.dataset.kind=_.kind;const m=new hS(p);s.add(m),e.set(_.id,{node:_,target:p,anchor:m})}return t(h.map(_=>e.get(_.id))),!0}function l(h,d,g){var L;const _=g+":"+Number(d)+":"+h.id,p=(L=e.get(h.id))==null?void 0:L.target.firstElementChild;if(p!=null&&p.offsetWidth){const U={w:p.offsetWidth,h:p.offsetHeight};return n.set(_,U),U}if(n.has(_))return n.get(_);const m=g==="atlas"?h.label:h.title||h.label,x=h.kind==="algorithm",M=x?g==="atlas"?1/0:d?68:70:d?92:112,S=d?10.5:12,b=g==="atlas"?x?750:h.row?550:650:650;i.font=b+" "+S+"px "+r;const E=i.measureText(m).width,v=Math.max(43,Math.min(M,E+(g==="atlas"?18:14))),y=Math.max(1,Math.ceil(E/(M-13))),C=(g==="atlas"?y:Math.min(y,2))*S*1.18+22,R={w:v,h:C};return n.set(_,R),R}function c(h,d,g,_){const p=h.layers.filter(m=>m.caption&&(_===null||_===m.index)).map(({caption:m})=>d.body(m,m.position));for(const m of h.nodes.values()){if(_!==null&&_!==m.layer)continue;const x=g.get(m.id)||m.position,M=d.point(x.x,x.y,x.z,m.layer);M.z<-1||M.z>1||M.x<-90||M.x>d.width+90||M.y<-90||M.y>d.height+90||p.push(d.body(m,x))}return p}function u({layout:h,projection:d,positions:g,review:_,focus:p,near:m,progress:x,variant:M,bodies:S,hints:b,selected:E,expanded:v}){const{width:y,height:C}=d,R=y<620,L=p.size>0,U=[],B=[...S],w=new Set(M==="atlas"?[...h.nodes.values()].filter(H=>H.kind==="algorithm").sort((H,z)=>z.total-H.total).slice(0,3).map(H=>H.id):[]);for(const H of h.nodes.values()){if(_!==null&&H.layer!==_||H.parent&&x<.72)continue;const z=p.has(H.id);if(M!=="atlas"&&!m&&h.nodes.size>72&&!z)continue;const V=g.get(H.id)||H.position,Y=d.label(H,V);if(Y.z<-1||Y.z>1)continue;const ut=l(H,R,M),K=(H.id===E||H.id===v?2e4:w.has(H.id)?1e4:0)+(H.row?3500:0)+(z?3e3:0)+(H.group?500:0)+Math.log1p(H.total||0)*4-Math.abs(Y.x-y/2)*.022-Math.abs(Y.y-C/2)*.022;U.push({node:H,priority:K,anchor:Y,metrics:ut,position:V})}U.sort((H,z)=>z.priority-H.priority);const I=[],D=new Map;for(const{node:H,anchor:z,metrics:V,position:Y,priority:ut}of U){const At=e.get(H.id),K=V,lt=Ap(z,d.body(H,Y),K);At!=null&&At.goal&&lt.unshift(At.goal),b.has(H.id)&&lt.unshift(b.get(H.id));const wt=([st,bt])=>{const Ht=Nc(z.x+st,z.y+bt,K.w,K.h);return!yo(Ht,y,C,42)||B.some(Lt=>ns(Lt,Ht))?!1:(B.push(Ht),!0)},Nt=lt.find(wt)||(H.row||M==="atlas")&&Rp(z,K,y).find(wt);if(Nt&&(I.push(H),D.set(H.id,{goal:Nt,metrics:V,priority:ut}),I.length>=(R?40:100)))break}I.sort((H,z)=>H.layer-z.layer||z.position.y-H.position.y||H.position.x-z.position.x);const O=o(I);for(const H of e.values()){Object.assign(H,D.get(H.node.id)),H.offset||(H.offset=[...H.goal]);const z=p.has(H.node.id);H.target.classList.toggle("dimmed",L&&!z),H.target.classList.toggle("focused",z)}return O}function f({projection:h,positions:d,step:g,bodies:_,variant:p}){var E;let m=!1,x=0;const{width:M,height:S}=h,b=[..._];for(const v of[...e.values()].sort((y,C)=>C.priority-y.priority)){const{node:y,anchor:C,target:R,goal:L,offset:U}=v;for(const H of[0,1]){const z=L[H]-U[H];Math.abs(z)>.28&&g<1?(U[H]+=z*g,m=!0):U[H]=L[H]}const B=d.get(y.id)||y.position;h.placeLabel(y,B,C.position),R.style.setProperty("--label-shift-x",U[0]+"px"),R.style.setProperty("--label-shift-y",U[1]+"px");const w=h.label(y,B);!v.measured&&((E=R.firstElementChild)!=null&&E.offsetWidth)&&(v.measured=!0,v.metrics={w:R.firstElementChild.offsetWidth,h:R.firstElementChild.offsetHeight});const I=v.metrics,D=Nc(w.x+U[0],w.y+U[1],I.w,I.h),O=w.z>=-1&&w.z<=1&&yo(D,M,S,42)&&b.every(H=>!ns(H,D));if(R.style.visibility=O?"visible":"hidden",O){b.push(D),x++;const[H,z]=U,V=Math.hypot(H,z),Y=Math.min(I.w/2/Math.abs(H),I.h/2/Math.abs(z)),ut=V>0?V*(1-Y):0,At=ut>(p==="atlas"?6:22);R.classList.toggle("leader",At),At&&(R.style.setProperty("--label-leader-length",ut+"px"),R.style.setProperty("--label-leader-angle",Math.atan2(z,H)+"rad"))}}return{moving:m,visible:x}}return{size:l,bodyBoxes:c,update:u,move:f,clear:()=>{n.clear(),o([])},live:e}}const tb=new N(.68,.85,1).normalize(),eb=new N(.11,1.12,1).normalize(),nb=new N(.48,.62,1).normalize(),ib=new N(.56,.2,1).normalize(),Af=new N(0,0,1),Rf=new N(0,1,0),Cp=35,sb=38*Math.PI/180,rb=26*Math.PI/180;function Pp(s,t,e=!1){const n=Math.hypot(t.x,t.z),i=n?sb*(e?.66:1)*t.x/n:0;return s.set(-rb*(e?.49:1)*t.y,i,0,"YXZ")}function ab(s,t,e){return Math.max(Math.abs(s.x-t.x),Math.abs(s.y-t.y))<=.004||e===1/0?(s.copy(t),!1):(s.x=pc.damp(s.x,t.x,1/.09,e/1e3),s.y=pc.damp(s.y,t.y,1/.09,e/1e3),!0)}function Cf(s,t,e){return new Map(s.map(({index:n,center:i})=>{const r=i.clone().applyQuaternion(t).negate().add(i),a=e.get(n);a&&r.add(a);const o=new le().makeRotationFromQuaternion(t).setPosition(r);return[n,{matrix:o,inverse:o.clone().invert()}]}))}function ob(s=220){let t=null;return{touch(e){t=e+s},wait(e){return t===null?null:Math.max(0,t-e)},take(e){return t===null||e<t?!1:(t=null,!0)},get pending(){return t!==null}}}function Pf(s,{aspect:t,variant:e,review:n,focus:i,compact:r=!1,direction:a}){const o=s.layers.find(L=>L.index===n),l=e==="atlas"?t>2.7?ib:nb:tb,c=o?Af:a??(r?eb:l),u=Rf.clone().cross(c).normalize(),f=c.clone().cross(u),h=Pp(new $n,c,e==="atlas"),d=new N(1,0,0).applyEuler(h),g=Rf.clone().applyEuler(h),_=Af.clone().applyEuler(h),p=(o?[o]:s.layers).flatMap(({center:L,width:U,height:B})=>[-1,1].flatMap(w=>[-1,1].map(I=>L.clone().addScaledVector(d,w*U/2).addScaledVector(g,I*B/2).addScaledVector(_,18)))),m=new Ei().setFromPoints(p),x=m.getCenter(new N),M=i.map(L=>s.nodes.get(L)).filter(Boolean),S=e!=="atlas"&&M.length&&n===null?M.flatMap(L=>{const[U,B,w]=L.size,I=s.layers.find(O=>O.index===L.layer).center,D=I.clone().addScaledVector(d,L.position.x-I.x).addScaledVector(g,L.position.y-I.y);return[-1,1].map(O=>D.clone().addScaledVector(u,O*(U/2+36)).addScaledVector(f,O*(B/2+40)).addScaledVector(c,O*w/2))}):p,b=new Ei().setFromPoints(S).getCenter(new N),E=Math.tan(Cp*Math.PI/360),v=r||a?.79:.86,y=(L,U)=>L.reduce((B,w)=>{const I=w.clone().sub(U),D=Math.max(Math.abs(I.dot(u))/t,Math.abs(I.dot(f)));return Math.max(B,D/(E*v)+I.dot(c))},1),C=y(p,x);let R=Math.max(y(S,b),M.length&&n===null?C*.46:100);if(o){const L=Math.max(m.max.y-m.min.y,(m.max.x-m.min.x)/t)/v;return R=Math.max(1400,C),{target:x,position:x.clone().addScaledVector(c,R),orthoHeight:L}}return{target:b,position:b.clone().addScaledVector(c,R),orthoHeight:2*R*E}}const br=new N;function Ln(s,t,e,n,i,r){const a=2*Math.PI*i/4,o=Math.max(r-2*i,0),l=Math.PI/4;br.copy(t),br[n]=0,br.normalize();const c=.5*a/(a+o),u=1-br.angleTo(s)/l;return Math.sign(br[e])===1?u*c:o/(a+o)+c+c*(1-u)}class Oo extends ds{constructor(t=1,e=1,n=1,i=2,r=.1){const a=i*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:i,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new N,c=new N,u=new N(t,e,n).divideScalar(2).subScalar(r),f=this.attributes.position.array,h=this.attributes.normal.array,d=this.attributes.uv.array,g=f.length/6,_=new N,p=.5/a;for(let m=0,x=0;m<f.length;m+=3,x+=2)switch(l.fromArray(f,m),c.copy(l),c.x-=Math.sign(c.x)*p,c.y-=Math.sign(c.y)*p,c.z-=Math.sign(c.z)*p,c.normalize(),f[m+0]=u.x*Math.sign(l.x)+c.x*r,f[m+1]=u.y*Math.sign(l.y)+c.y*r,f[m+2]=u.z*Math.sign(l.z)+c.z*r,h[m+0]=c.x,h[m+1]=c.y,h[m+2]=c.z,Math.floor(m/g)){case 0:_.set(1,0,0),d[x+0]=Ln(_,c,"z","y",r,n),d[x+1]=1-Ln(_,c,"y","z",r,e);break;case 1:_.set(-1,0,0),d[x+0]=1-Ln(_,c,"z","y",r,n),d[x+1]=1-Ln(_,c,"y","z",r,e);break;case 2:_.set(0,1,0),d[x+0]=1-Ln(_,c,"x","z",r,t),d[x+1]=Ln(_,c,"z","x",r,n);break;case 3:_.set(0,-1,0),d[x+0]=1-Ln(_,c,"x","z",r,t),d[x+1]=1-Ln(_,c,"z","x",r,n);break;case 4:_.set(0,0,1),d[x+0]=1-Ln(_,c,"x","y",r,t),d[x+1]=1-Ln(_,c,"y","x",r,e);break;case 5:_.set(0,0,-1),d[x+0]=Ln(_,c,"x","y",r,t),d[x+1]=1-Ln(_,c,"y","x",r,e);break}}static fromJSON(t){return new Oo(t.width,t.height,t.depth,t.segments,t.radius)}}const Df=new N,Dp=s=>s*s*(3-2*s);function Lp(s,t,e,n){const i=Dp(t);return s.addScaledVector(e,1-i).addScaledVector(n,i)}function lb(s,t,e){const n=s.getAttribute("position"),i=s.getAttribute("uv"),r=n.array.slice(),a=new Float32Array(n.count),o=new Map;for(let l=0;l<n.count;l++){const c=e?l/(n.count-1):i.getX(l);o.has(c)||o.set(c,Dp(e?c:t.getUtoTmapping(c))),a[l]=o.get(c)}return{from:new N,to:new N,update(l=Df,c=Df){if(!(l.equals(this.from)&&c.equals(this.to))){this.from.copy(l),this.to.copy(c);for(let u=0;u<n.count;u++){const f=u*3,h=a[u];n.array[f]=r[f]+l.x+(c.x-l.x)*h,n.array[f+1]=r[f+1]+l.y+(c.y-l.y)*h,n.array[f+2]=r[f+2]+l.z+(c.z-l.z)*h}n.needsUpdate=!0,s.boundingSphere=null,s.boundingBox=null}}}}function bo(s,t,e,n,i=e.position){return s.copy(t).add(i).sub(e.position).applyMatrix4(n.get(e.layer).matrix).sub(t)}function Eo(s){const t=s.getAttribute("position"),e=s.getAttribute("uv");for(let n=0;n<t.count;n++)e.setXY(n,t.getX(n)+.5,t.getY(n)+.5);return s}function cb(){const s=new hd;for(let t=0;t<6;t++){const e=t*Math.PI/3;s[t?"lineTo":"moveTo"](.428*Math.cos(e),.428*Math.sin(e))}return s.closePath(),Eo(new ou(s,{depth:.84,bevelEnabled:!0,bevelThickness:.08,bevelSize:.066,bevelSegments:3}).translate(0,0,-.42))}function ub(){const s=new Oo(1,1,1,3,.18);for(const t of s.groups)t.materialIndex=t.materialIndex===4?0:1;return s}const hb={category:cb,file:ub,algorithm:()=>Eo(new Co(.5,3)),reference:()=>Eo(new lu(.5,1))};function Ic(s){const t=new Set,e=new Set;s.traverse(n=>{var i;n.geometry&&t.add(n.geometry),Array.isArray(n.material)?n.material.forEach(r=>e.add(r)):n.material&&e.add(n.material),(i=n.userData.ownedTexture)==null||i.dispose(),n.isInstancedMesh&&n.dispose()});for(const n of t)n.dispose();for(const n of e)n.dispose();s.clear()}function fb({width:s,height:t,center:e,index:n,caption:i},r,a){const o=new Si;o.position.copy(e),o.position.z-=1;const l=a?["#163d3b","#1c3454","#352845"][n]:["#b7ddd2","#c5dcf3","#d8caed"][n],c=new Kn({color:l,transparent:!0,opacity:1,depthWrite:!1,toneMapped:!1}),u=new Kn({color:new Wt(l).lerp(new Wt(r),.56),transparent:!0,depthWrite:!1,toneMapped:!1}),f=new vn(new ds(s,t,23),[u,u,u,u,c,c]);f.position.z=-11.5,f.renderOrder=-3,o.add(f);const h=document.createElement("canvas");h.width=280,h.height=64;const d=h.getContext("2d");d.font="bold 45px system-ui, sans-serif",d.textAlign="center",d.textBaseline="middle",d.fillStyle=a?"#f3edf8":["#164e44","#284a74","#51336f"][n],d.fillText(["领域分类","仓库矩阵","密码算法"][n],140,32);const g=new c_(h);g.colorSpace=cn;const _=new vn(new ir(i.size[0],i.size[1]),new Kn({map:g,transparent:!0,depthWrite:!1,toneMapped:!1}));return _.position.copy(i.position).sub(o.position),_.renderOrder=-1,_.userData.ownedTexture=g,o.add(_),{sheet:o,slab:f}}function db(s,t,e){const n=new Si,{width:i,height:r}=s;n.position.copy(s.center),n.position.z-=1;const a=new vn(new ir(i,r),new Kn({color:t,side:Xn,transparent:!0,opacity:e?.055:.073,depthWrite:!1}));a.renderOrder=-3,n.add(a);const o=i/2,l=r/2,c=[];for(let f=-o+22;f<o;f+=32)c.push(new N(f,-l,0),new N(f,l,0));for(let f=-l+22;f<l;f+=32)c.push(new N(-o,f,0),new N(o,f,0));n.add(new l_(new Ze().setFromPoints(c),new oo({color:t,transparent:!0,opacity:e?.12:.16,depthWrite:!1})));const u=[[-o,-l],[o,-l],[o,l],[-o,l],[-o,-l]];return n.add(new nu(new Ze().setFromPoints(u.map(([f,h])=>new N(f,h,0))),new oo({color:t,transparent:!0,opacity:e?.52:.48}))),n}function pb(s,t,e){return!e&&s.status!=="ai_assessed"?new Kn({color:t,transparent:!0,depthWrite:!1}):new hn({transparent:!0,depthWrite:!1,uniforms:{ink:{value:t},opacity:{value:1},time:{value:0},dashCount:{value:s.branch?12:17},duty:{value:s.status==="pending"&&!s.branch?.37:.66}},vertexShader:`
      varying float progress;
      void main() {
        progress = uv.x;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,fragmentShader:`
      varying float progress;
      uniform vec3 ink;
      uniform float opacity;
      uniform float time;
      uniform float dashCount;
      uniform float duty;
      void main() {
        float dash = fract(progress * dashCount - time);
        if (dash > duty) discard;
        gl_FragColor = vec4(ink, opacity);
      }
    `})}function mb(s,t,e,n){const i=new Wt(e&&s.branch?t?"#69cbb4":"#20836d":s.color||"#4b846d");t?i.lerp(new Wt("#bdd4ff"),.2):e&&n&&i.lerp(new Wt("#263f58"),n===2?.22:.1);const r=s.branch||s.status==="pending"||s.label==="关联"||s.status==="legacy",a=r&&!n,o=n===2?Math.max(3.6,s.band*.78):n?Math.max(1.8,s.band*.61):e?Math.max(.92,s.band/2):s.band/2,l=a?new nu(new Ze().setFromPoints(s.curve.getPoints(36)),new Y_({color:i,dashSize:s.branch?13:6,gapSize:s.branch?6:5,transparent:!0,depthWrite:!1})):new vn(new uu(s.curve,24,o,5,!1),pb(s,i.clone(),r));return l.renderOrder=n,a&&l.computeLineDistances(),l.userData.edge=s,{edge:s,object:l,color:i,line:a,strength:n,motion:lb(l.geometry,s.curve,a)}}const Uc=420;function _b(s,t,e){const n=[],i=[];for(const a of s.links)(t.has(a.id)||a.branch?n:i).push(a);const r=e?Uc:180;return i.sort((a,o)=>o.band-a.band),[...n,...i].slice(0,r)}function Lf(s,t,e=[]){var a,o;const n=s.intersectObjects(t,!1)[0],i=(a=n==null?void 0:n.object.userData.ids)==null?void 0:a[n.instanceId];if(i)return{id:i,edge:!1};const r=(n==null?void 0:n.object.userData.edge)??((o=s.intersectObjects(e,!1)[0])==null?void 0:o.object.userData.edge);return r?{id:r.id,edge:!0}:null}function gb(s,{variant:t,dark:e,textures:n}){const i=new Si,r=t==="atlas",a=r?e?["#5ab4a2","#82a5ed","#b99adb"]:["#277767","#456ab3","#8053a8"]:["#3d9b8d","#668ace","#8e71b0"],o=new Wt(e?"#445664":"#778e97"),l=e?["#31605b","#3a587e","#68547d"]:["#8dbdab","#99b9d7","#b5a0d6"],c=s.layers.map(D=>{const O=a[D.index],{sheet:H,slab:z}=r?fb(D,O,e):{sheet:db(D,O,e)},V=new Si;V.matrixAutoUpdate=!1,V.add(H);const Y=[...new Set(H.children.flatMap(ut=>[ut.material].flat()))];return{layer:D,sheet:H,slab:z,group:V,paints:Y.map(ut=>[ut,ut.opacity])}});i.add(...c.map(D=>D.group));const u=new Map(c.map(D=>[D.layer.index,D.group])),f=new Si;i.add(f);const h=new Map,d=new Ve;for(const D of s.layers){const O=[...s.nodes.values()].filter(Ht=>Ht.layer===D.index);if(!O.length)continue;const H=t!=="atlas"&&D.kind==="algorithm"?Eo(new iu(.28,.45,6,16).rotateZ(Math.PI/2)):hb[D.kind](),z=r&&D.kind==="algorithm"?{}:n[D.kind]??n.algorithm,V=new Za({...z,color:16777215,metalness:r?.1:.27,roughness:.86,emissive:2505792,emissiveIntensity:.08}),ut=(D.kind==="category"||D.kind==="file")&&!r?[V,new Za({color:8754334,metalness:.32,roughness:.47})]:V,At=new $i(H,ut,O.length),K=new $i(H,new Za({color:16777215,metalness:.08,roughness:.65,transparent:!r,opacity:r?1:.17,depthWrite:r}),O.length),lt=r?new $i(H,new W_({...z,roughness:e?.54:.43,metalness:.12,clearcoat:.42,clearcoatRoughness:.36,emissiveIntensity:e?.14:.04}),1):null,wt=lt?[At,K,lt]:[At,K];for(const Ht of wt)Ht.count=0,Ht.frustumCulled=!1,Ht.userData.ids=[],u.get(D.index).add(Ht);let Nt;if(r){const Ht=D.kind==="file"?new Oo(1,1,1,2,.13):new su(.48,.5,1,D.kind==="category"?6:32).rotateX(Math.PI/2);D.kind==="category"&&Ht.rotateZ(Math.PI/6),Nt=new $i(Ht,new Kn({side:Xn,toneMapped:!1}),O.length),Nt.count=0,Nt.frustumCulled=!1,Nt.userData.ids=[],u.get(D.index).add(Nt)}const st=r?new Wt(l[D.index]):null,bt=st==null?void 0:st.clone().lerp(new Wt(a[D.index]),.36);h.set(D.index,{nodes:O,active:At,quiet:K,current:lt,meshes:wt,pads:Nt,padInk:st,currentPadInk:bt})}const g=new $i(new Co(2.6,0),new Kn({color:new Wt("#b4fff0").multiplyScalar(1.55),transparent:!0,opacity:e?.93:.78}),100);g.frustumCulled=!1,g.count=0,i.add(g);const _=r&&new $i(new cu(1,12,8),new Kn({transparent:!0,opacity:.9,depthTest:!1,depthWrite:!1,toneMapped:!1}),2*Uc),p=_&&new $i(_.geometry,new Kn({color:"#f2f8fc",transparent:!0,opacity:.98,depthTest:!1,depthWrite:!1,toneMapped:!1}),2*Uc);if(_){for(const D of[_,p])D.count=0,D.frustumCulled=!1;_.renderOrder=3,p.renderOrder=4,i.add(_,p)}const m=new Set,x=new Wt,M=new Wt(e?"#bef4e8":"#123d46");let S=[],b,E,v,y;const C=new N,R=new N;function L(D,O,H){Ic(f),S=D.map(z=>mb(z,e,r,r&&O.has(z.id)?z.id===H?2:1:0)),S.length&&f.add(...S.map(z=>z.object))}function U({positions:D,repositioned:O,focus:H,selected:z,layer:V,progress:Y,poses:ut,now:At,effects:K}){var Nt;const lt=H.nodes.size>0,wt=b!==H||E!==z||v!==V||y!==Y||O;for(const[st,bt]of u)bt.matrix.copy(ut.get(st).matrix),bt.matrixWorldNeedsUpdate=!0;if(b=H,E=z,v=V,y=Y,wt)for(const{nodes:st,active:bt,quiet:Ht,current:Lt,meshes:Vt,pads:Ft,padInk:it,currentPadInk:dt}of h.values()){Ft&&(Ft.count=0,Ft.userData.ids.length=0);for(const at of Vt)at.count=0,at.userData.ids.length=0;for(const at of st){if(V!==null&&at.layer!==V)continue;const Rt=!lt||H.nodes.has(at.id),xt=Lt&&at.id===z,kt=xt?Lt:Rt?bt:Ht,Pt=kt.count++,Jt=D.get(at.id)??at.position,Zt=at.parent&&V===null?Math.max(.32,Y):1;d.position.copy(Jt),d.scale.fromArray(at.size).multiplyScalar(Zt),d.updateMatrix(),kt.setMatrixAt(Pt,d.matrix);const $t=new Wt(at.tint);r&&!Rt&&!xt&&$t.lerp(o,.42),at.row&&!at.total&&(r?$t.lerp(o,.75):$t.multiplyScalar(.38)),xt&&($t.multiplyScalar(e?1.24:.48),Lt.material.emissive.copy($t)),kt.setColorAt(Pt,$t),kt.userData.ids.push(at.id),Ft&&(!at.parent||Y===1||V!==null)&&(d.position.z=at.position.z+.15,d.scale.set(at.size[0]*1.15,at.size[1]*1.15,2.3),d.updateMatrix(),Ft.setMatrixAt(Ft.count,d.matrix),Ft.setColorAt(Ft.count++,xt?dt:it),Ft.userData.ids.push(at.id))}Ft&&(Ft.instanceMatrix.needsUpdate=!0,Ft.instanceColor&&(Ft.instanceColor.needsUpdate=!0),Ft.boundingSphere=null);for(const at of Vt)at.instanceMatrix.needsUpdate=!0,at.instanceColor&&(at.instanceColor.needsUpdate=!0),at.boundingSphere=null}g.count=0,_&&(_.count=p.count=0,m.clear());for(const{edge:st,object:bt,color:Ht,line:Lt,strength:Vt,motion:Ft}of S){if(bt.visible=V===null||st.from.layer===V&&st.to.layer===V,!bt.visible)continue;const it=st.branch&&Y<1?void 0:D.get(st.target);Ft.update(bo(C,st.curve.v0,st.from,ut,D.get(st.source)),bo(R,st.curve.v3,st.to,ut,it));const dt=H.edges.has(st.id),at=st.from.parent||st.to.parent,Rt=lt?dt?Vt?1:.9:r?.09:.08:st.branch?.72:e?.53:.62,xt=at&&!st.branch?Math.max(0,(Y-.65)/.35):1,kt=Ht.clone().multiplyScalar(dt?r?1.12:1.72:1);if(bt.material.uniforms?(bt.material.uniforms.opacity.value=Rt*xt,K&&st.status==="ai_assessed"&&(bt.material.uniforms.time.value=At/840),bt.material.uniforms.ink.value.copy(kt)):(bt.material.opacity=Rt*xt,bt.material.color.copy(kt)),st.branch){const Pt=(Nt=bt.geometry.index)==null?void 0:Nt.count;bt.geometry.setDrawRange(0,Pt?Math.floor(Pt*Y/3)*3:Math.floor(37*Y))}if(_&&Vt&&dt&&Y===1){const Pt=(Jt,Zt,$t,G)=>{const ye=Jt.id+Zt;m.has(ye)||(m.add(ye),d.position.copy($t).add(G),d.scale.setScalar(Vt===2?9.4:5.5),d.updateMatrix(),_.setMatrixAt(_.count,d.matrix),_.setColorAt(_.count++,x.copy(Ht).lerp(M,.32)),d.scale.multiplyScalar(.43),d.updateMatrix(),p.setMatrixAt(p.count++,d.matrix))};Pt(st.from,"start",st.curve.v0,Ft.from),Pt(st.to,"end",st.curve.v3,Ft.to)}if(K&&!Lt&&!st.branch&&st.status!=="ai_assessed"&&xt>.36&&(!lt||dt)&&g.count<100){const Pt=(At/1250+g.count*.183)%1;Lp(st.curve.getPoint(Pt,d.position),Pt,Ft.from,Ft.to),d.scale.setScalar(1),d.updateMatrix(),g.setMatrixAt(g.count++,d.matrix)}}_!=null&&_.count&&(_.instanceMatrix.needsUpdate=!0,_.instanceColor.needsUpdate=!0,p.instanceMatrix.needsUpdate=!0),g.count&&(g.instanceMatrix.needsUpdate=!0);for(const{sheet:st,layer:bt,paints:Ht}of c){st.visible=V===null||bt.index===V;const Lt=t==="atlas"&&bt.kind==="file"?Math.min(1,Y*1.85):1;for(const[Vt,Ft]of Ht)Vt.opacity=Ft*Lt}}const B=[...h.values()].flatMap(({meshes:D,pads:O})=>O?[...D,O]:D),w=()=>S.filter(D=>D.object.visible&&!D.edge.branch).map(D=>D.object);function I(D){const O=w();if(!r)return Lf(D,[...B,...O]);const H=c.filter(({sheet:z})=>z.visible).map(({slab:z})=>z);return Lf(D,[...B,...H],O)}return{root:i,setEdges:L,update:U,pickableEdges:w,pick:I}}const Vn=192;function xb(s,t){const e=Math.abs(s-.5),n=Math.abs(t-.5),i=Math.max(n,.866*e+.5*n);return Math.abs(i-.3)<.013||Math.abs(i-.21)<.01}function vb(s,t){for(const e of[-1,0,1]){const n=.5+e*.128;if(s>.17&&s<.62&&Math.abs(t-n)<.017||s>=.62&&s<.77&&Math.abs(t-n-(s-.62)*.55)<.019||Math.hypot(s-.78,t-n-.087)<.033||Math.hypot(s-.16,t-n)<.029)return!0}return!1}function Mb(s,t){const e=Math.hypot(s-.5,t-.5);return Math.abs(e-.17)<.009||Math.abs(e-.32)<.013||e>.36&&e<.41&&(Math.abs(s-.5)<.012||Math.abs(t-.5)<.012)}function Nf(s,t){const e=new tu(s,Vn,Vn);return t&&(e.colorSpace=cn),e.magFilter=on,e.minFilter=Mi,e.generateMipmaps=!0,e.needsUpdate=!0,e}function Sb(){let s=7143;return Object.fromEntries(Object.entries({category:xb,file:vb,algorithm:Mb}).map(([t,e])=>{const n=new Uint8Array(Vn*Vn*4),i=new Uint8Array(n.length);for(let r=0;r<Vn*Vn;r++){const a=(r%Vn+.5)/Vn,o=(Math.floor(r/Vn)+.5)/Vn;s=Math.imul(s,1664525)+1013904223>>>0;const l=((s>>>24)/255-.5)*15,c=e(a,o),u=Math.max(0,Math.abs(a-.5)+Math.abs(o-.5)-.52)*18,f=t==="file"?3*Math.sin(r%Vn*1.73):0,h=Math.round(236+l+f-u-(c?52:0)),d=Math.round(143+l*1.8+(c?35:0));n.set([h,h,h,255],r*4),i.set([d,d,d,255],r*4)}return[t,{map:Nf(n,!0),roughnessMap:Nf(i,!1)}]}))}function yb(s,{variant:t,fullscreen:e,onLabels:n,onPick:i,onStats:r,onExportReady:a,onLost:o}){const l=new Qm,c=new JM({antialias:!0,powerPreference:"low-power"}),u=c.getContext(),f=u.getExtension("WEBGL_debug_renderer_info"),h=!!(f&&/swiftshader|llvmpipe|softpipe|lavapipe|software rasterizer/i.test(u.getParameter(f.UNMASKED_RENDERER_WEBGL))),d=Sb();c.toneMapping=wo,c.toneMappingExposure=1.16,c.domElement.className="spatial-webgl",s.append(c.domElement),c.domElement.addEventListener("webglcontextlost",o);const g=new fS;g.domElement.className="spatial-overlay",g.domElement.style.display="none",s.append(g.domElement);const _=jy(l,n),p=new Wn(Cp,1,1,18e3),m=new Po(-1,1,1,-1,1,18e3);let x=p;x.position.set(620,760,1250);const M=new QM(x,c.domElement);M.enableDamping=!h,M.dampingFactor=.105,M.zoomToCursor=!0,M.minDistance=75,M.maxDistance=16e3,M.minZoom=.35,M.maxZoom=8,M.maxPolarAngle=Math.PI*.95;const S=new xS(c);if(t==="atlas"&&!h){const W=u.getInternalformatParameter(u.RENDERBUFFER,u.RGBA16F,u.SAMPLES),ot=(W==null?void 0:W.find(et=>et<=4))||0;S.renderTarget1.samples=S.renderTarget2.samples=ot}const b=new MS(l,x),E=new Ks(new ct(1,1),.36,.46,.9),v=new vS;S.addPass(b),S.addPass(E),S.addPass(v);const y=new eg;y.params.Line.threshold=4;const C=new ct;let R=null;const L={nodes:new Set,edges:new Set};let U=!1,B,w,I,D=L,O="",H="",z=null,V=0,Y=0,ut=600,At=!0,K=0,lt=-1/0,wt,Nt=new Map,st,bt,Ht={progress:1},Lt=new Map,Vt=null,Ft,it=!0;const dt=new Jn,at=new $n(0,0,0,"YXZ"),Rt=new $n,xt=new N,kt=new Map,Pt=new le,Jt=new le,Zt=new N,$t=new le,G=new le,ye=new Jn,se=new Map,_e=new N,Et=new N;let fe=new Map,zt,qt=!1;const P=ob();let T=new Map,X=new Map,pt=0,rt=0,Mt,Tt=0,j=!1,tt=!1,St=!1;function F(W){St!==W&&(St=W,a(W))}let nt,Q,yt,_t=[],vt={moving:!1,visible:0};const Bt=new Map,Qt=matchMedia("(prefers-reduced-motion: reduce)"),ht=()=>!h&&!Qt.matches,Gt=new $_(t==="atlas"?16777215:13232639,2),jt=new J_(t==="atlas"?16773859:14024687,2.2);jt.position.set(170,740,1200),l.add(Gt,jt);function gt(){!K&&At&&!document.hidden&&(K=requestAnimationFrame(aa))}function ue(){F(!1),rt=performance.now()+1e3,gt()}function Oe(){m.left=-ut*V/Y/2,m.right=-m.left,m.top=ut/2,m.bottom=-m.top,m.updateProjectionMatrix()}function On(){const W=s.clientWidth,ot=s.clientHeight;if(!W||!ot||W===V&&ot===Y)return;const et=V<660!=W<660;V=W,Y=ot;const $=Math.min(devicePixelRatio||1,V<720?1.25:1.6),It=Math.min($,Math.sqrt((h?65e4:25e5)/(V*Y)));c.setPixelRatio(It),c.setSize(V,Y),S.setPixelRatio(It),S.setSize(V,Y),g.setSize(V,Y),p.aspect=V/Y,p.updateProjectionMatrix(),Oe(),w&&et?ar():w&&Fn(!1)}function sa(W){return Pf(w,{aspect:V/Y,variant:t,review:z,focus:[],compact:V<660,direction:W})}function Fn(W=!0,ot){if(!w||!V||!Y)return;it=!0,ue(),P.touch(performance.now());const et=z===null?p:m;x!==et&&(et.position.copy(x.position),et.quaternion.copy(x.quaternion),et.zoom=1,x=et,b.camera=x,M.object=x);const $=ot?sa(ot):Pf(w,{aspect:V/Y,variant:t,review:z,focus:[...D.nodes],compact:V<660});Bn();const mt=x.zoom,It=x.position.clone(),Ot=M.target.clone(),ft=ut,Ut={amount:0};function Xt(){x.position.lerpVectors(It,$.position,Ut.amount),M.target.lerpVectors(Ot,$.target,Ut.amount),x.zoom=mt+(1-mt)*Ut.amount,ut=ft+($.orthoHeight-ft)*Ut.amount,Oe(),M.update(),gt()}W&&ht()?st=to.to(Ut,{amount:1,duration:.68,ease:"power3.inOut",onUpdate:Xt,onComplete:()=>{Vt=null,gt()}}):(Ut.amount=1,Xt())}function ar(W=!1,ot=!1){var $;if(!B)return;const et=ot&&w?w:qy(B,t,V<660);if(Bt.clear(),W&&B.expanded&&ht())for(const mt of et.links)mt.branch&&Bt.set(mt.target,mt);bt==null||bt.kill(),Ht={progress:Bt.size?0:1},Bt.size&&(bt=to.to(Ht,{progress:1,duration:.68,ease:"power2.out",onUpdate:gt})),Lt=new Map,kt.clear(),fe=new Map,zt=null,qt=!1,T.clear(),X.clear(),P.touch(performance.now()),I&&(l.remove(I.root),Ic(I.root)),_.clear(),lt=-1/0,w=et,I=gb(w,{variant:t,dark:U,textures:d}),l.add(I.root),E.enabled=!h&&w.nodes.size<360,H||(D=Ef(w,w.nodes.has(O)?O:B.expanded)),s.dataset.planes=w.layers.map(mt=>mt.depth).join(","),s.dataset.repositories=String(t==="atlas"?(($=w.layers.find(mt=>mt.kind==="file"))==null?void 0:$.data.length)??0:0),wt=void 0,or(),ot?F(!1):Fn(W),gt()}function or(){const ot=(x.isOrthographicCamera?ut/x.zoom:x.position.distanceTo(M.target)*.63)<(wt?690:620);wt!==ot&&(wt=ot,I.setEdges(_b(w,D.edges,wt),D.edges,H),lt=-1/0)}function ra(W,ot){const et=(Ut,Xt,te)=>Ut.elements.some((ne,ge)=>Math.abs(ne-Xt.elements[ge])>(ge>=12&&ge<15?te:.001));if((ot||et(x.matrixWorld,Pt,.6)||et(x.projectionMatrix,Jt,.001))&&(Pt.copy(x.matrixWorld),Jt.copy(x.projectionMatrix),P.touch(W)),!j&&P.take(W)){const Ut=Cf(w.layers,dt,se),Xt=z===null?$y(w.layers,Tf(x,V,Y,Ut),t==="atlas"):se,te=w.layers.filter(({index:ne})=>(fe.get(ne)||Zt).distanceToSquared(Xt.get(ne)||Zt)>.01);zt=te.length?{from:fe,target:Xt,start:W,layers:te}:null,zt||(fe=Xt),qt=!0}if(j||P.pending||!zt)return!1;const{from:$,target:mt,start:It,layers:Ot}=zt,ft=ht()?Math.min(1,(W-It)/280):1;if(ft===1)fe=new Map(mt),zt=null;else{fe=new Map($);const Ut=ft*ft*(3-2*ft);for(const{index:Xt}of Ot)fe.set(Xt,new N().lerpVectors($.get(Xt)||Zt,mt.get(Xt)||Zt,Ut))}return ft<1}function ci(W,ot,et){if(P.pending||zt)return{moved:!1,moving:!1};if(qt)if(qt=!1,Tt=W+260,ht()&&(et=Math.min(et,.22)),z===null&&w.nodes.size<96){const It=Qy(w,ot,D,t,_.size);T=It.offsets,X=It.hints}else T.clear(),X.clear();W>=Tt&&(et=1);let $=!1,mt=!1;for(const It of new Set([...kt.keys(),...T.keys()])){const Ot=T.get(It)||Zt,ft=kt.get(It)||new N;ft.distanceToSquared(Ot)>.04&&et<1?(ft.lerp(Ot,et),mt=!0,$=!0):ft.equals(Ot)||(ft.copy(Ot),$=!0),ft.lengthSq()===0?kt.delete(It):kt.set(It,ft)}return{moved:$,moving:mt}}function lr(W){return tt===W?!1:(!W&&g.domElement.contains(document.activeElement)&&s.focus({preventScroll:!0}),tt=W,g.domElement.style.display=W?"":"none",lt=-1/0,!0)}function aa(W){if(K=0,!I||!V||!Y)return;const ot=Math.max(1,W-pt);pt=W;const et=ht()?1-Math.exp(-ot/65):1;M.dampingFactor=1-Math.pow(.895,ot/(1e3/60));const $=M.update();x.updateMatrixWorld(),z===null?Pp(Rt,xt.set(0,0,1).applyQuaternion(x.quaternion),t==="atlas"):Rt.set(0,0,0,"YXZ");const mt=ab(at,Rt,z===null&&ht()?ot:1/0);dt.setFromEuler(at),or();const It=mt||(st==null?void 0:st.isActive())||Ht.progress<1,Ot=ra(W,It),ft=Cf(w.layers,dt,fe),Ut=Tf(x,V,Y,ft,dt),{moved:Xt,moving:te}=ci(W,Ut,et),ne=lr(!P.pending&&!zt&&!te);if(Lt.clear(),Ht.progress<1){let Ge=0;for(const[be,rn]of Bt){const{curve:ie,from:Ne,to:qe}=rn,Me=Math.min(1,Math.max(0,Ht.progress*1.24-Ge++*.034)),Be=Lp(ie.getPoint(Me),Me,bo(_e,ie.v0,Ne,ft),bo(Et,ie.v3,qe,ft));Lt.set(be,Be.applyMatrix4(ft.get(qe.layer).inverse).addScaledVector(Et.copy(qe.position).sub(ie.v3),Me))}}else for(const[Ge,be]of kt)Lt.set(Ge,w.nodes.get(Ge).position.clone().add(be));const ge=z===null?D:L,Dt=ht()&&z===null&&W<rt&&w.links.length>0;I.update({positions:Lt,repositioned:Xt,focus:ge,selected:O||B.expanded,layer:z,progress:Ht.progress,poses:ft,now:W,effects:Dt});const xe=tt&&(ne||Xt||nt!==w||Q!==Ht.progress||yt!==z||!$t.equals(x.matrixWorld)||!G.equals(x.projectionMatrix)||!ye.equals(dt));xe&&(_t=_.bodyBoxes(w,Ut,Lt,z),nt=w,Q=Ht.progress,yt=z,$t.copy(x.matrixWorld),G.copy(x.projectionMatrix),ye.copy(dt));const ee=tt&&(W-lt>140||Xt&&!te),Je=ee&&_.update({layout:w,projection:Ut,positions:Lt,review:z,focus:ge.nodes,near:wt,progress:Ht.progress,variant:t,bodies:_t,hints:X,selected:O,expanded:B.expanded});tt&&(xe||ee||vt.moving)&&(vt=_.move({projection:Ut,positions:Lt,step:ne?1:et,bodies:_t,variant:t})),ee&&(Nt=_.live,r({nodes:w.nodes.size,edges:B.links.length,groups:vt.visible,drawn:I.pickableEdges().length,near:wt}),lt=Je?-1/0:W),S.render(),tt&&g.render(l,x),F(tt&&!vt.moving&&!Je&&!j),s.dataset.camera=x.position.toArray().map(Ge=>Ge.toFixed(2)).join(","),s.dataset.layerShift=w.layers.map(({index:Ge})=>(fe.get(Ge)||Zt).toArray().map(be=>be.toFixed(2)).join(",")).join(";"),s.dataset.layerAttitude=dt.toArray().map(Ge=>Ge.toFixed(4)).join(","),s.dataset.reflow=kt.size,s.dataset.layoutState=P.pending?"waiting":Ot||te?"arranging":"ready",s.dataset.ready="true";const we=P.wait(performance.now());we!==null&&!j&&!It&&Mt===void 0&&(Mt=setTimeout(()=>{Mt=void 0,gt()},Math.max(1,we))),(Dt||$||It||Ot||te||tt&&vt.moving||Je)&&gt()}function oa(W,ot){const et=!!(B&&W.expanded!==B.expanded);B=W,O=ot||"",H="",ar(et)}function ms(W){O===(W||"")&&!H||(O=W||"",H="",w&&(D=Ef(w,w.nodes.has(O)?O:B.expanded),wt=void 0,P.touch(performance.now()),Fn()))}function la(W){const ot=w==null?void 0:w.links.find(et=>et.id===W);if(!(!ot||H===W)){H=W,D={nodes:new Set([ot.source,ot.target]),edges:new Set([W])};for(const et of w.links)et.branch&&D.nodes.has(et.target)&&(D.nodes.add(et.source),D.edges.add(et.id));wt=void 0,P.touch(performance.now()),Fn()}}function ca(W=null){z=W,P.touch(performance.now()),M.enableRotate=W===null,Fn(),lt=-1/0}function Bn(){st==null||st.kill(),Vt=null}function Fo(W,ot){if(!w||z!==null)return;ue(),P.touch(performance.now());const et=x.position.clone().sub(M.target),$=new vc().setFromVector3(et),mt=Vt||$,It=2*Math.PI;$.theta+=Math.round((mt.theta-$.theta)/It)*It;const Ot=mt.theta+W*Math.PI/15,ft=Math.max(Math.PI/15,Math.min(Math.PI*14/15,mt.phi-ot*Math.PI/22.5));if(t==="atlas"&&it){Fn(!0,new N().setFromSphericalCoords(1,ft,Ot)),ht()&&(Vt={theta:Ot,phi:ft});return}Bn();const Ut=()=>{x.position.copy(M.target).add(et.setFromSpherical($)),M.update(),gt()},Xt=()=>{Vt=null,lt=-1/0,gt()};ht()?(Vt={theta:Ot,phi:ft},st=to.to($,{theta:Ot,phi:ft,duration:.31,ease:"power2.out",onUpdate:Ut,onComplete:Xt})):($.theta=Ot,$.phi=ft,Ut(),Xt())}function ua(W){if(it=!1,Bn(),x.isOrthographicCamera)x.zoom=Math.max(M.minZoom,Math.min(M.maxZoom,x.zoom*W)),x.updateProjectionMatrix();else{const ot=x.position.clone().sub(M.target);ot.setLength(Math.max(M.minDistance,Math.min(M.maxDistance,ot.length()/W))),x.position.copy(M.target).add(ot)}M.update(),lt=-1/0,ue()}function cr(W){(W.ctrlKey||W.metaKey||!e()&&!s.matches(":focus-within"))&&W.stopImmediatePropagation()}function ha(W){R=W.isPrimary&&W.button===0?{id:W.pointerId,x:W.clientX,y:W.clientY}:null}function _s(){R=null}function ur(W){(R==null?void 0:R.id)===W.pointerId&&Math.hypot(R.x-W.clientX,R.y-W.clientY)>5&&_s()}function hr(W){if(ur(W),(R==null?void 0:R.id)!==W.pointerId)return;_s();const ot=c.domElement.getBoundingClientRect();C.set((W.clientX-ot.left)/ot.width*2-1,1-(W.clientY-ot.top)/ot.height*2),y.setFromCamera(C,x);const et=I==null?void 0:I.pick(y);et?i(et.id,et.edge):t==="atlas"&&i("",!1)}function A(){U=document.documentElement.dataset.theme==="dark";const W=getComputedStyle(s).getPropertyValue("--bg-elevated").trim();l.background=t==="atlas"&&!U?new Wt("#eeece9"):new Wt(W||"#152330").multiplyScalar(U?1:1.42),E.strength=U?.29:.14,E.threshold=U?.94:1.51,Gt.intensity=U?1.8:2.1,ar(!1,!0)}function k(){if(!w||!V||!Y||!St)return null;const W=Math.min(2,4096/Math.max(V,Y)),ot=c.getPixelRatio();c.setPixelRatio(W),c.setSize(V,Y,!1),S.setPixelRatio(W),S.setSize(V,Y),S.render();const et=document.createElement("canvas");et.width=c.domElement.width,et.height=c.domElement.height;const $=et.getContext("2d");$.drawImage(c.domElement,0,0),c.setPixelRatio(ot),c.setSize(V,Y),S.setPixelRatio(ot),S.setSize(V,Y);const mt=s.getBoundingClientRect();$.scale(et.width/V,et.height/Y);const It=[...Nt.values()].filter(({target:Ot})=>Ot.firstElementChild&&Ot.style.visibility!=="hidden"&&Ot.getClientRects().length);if(t==="atlas")for(const{target:Ot}of It){if(!Ot.classList.contains("leader"))continue;const ft=Ot.getBoundingClientRect(),Ut=getComputedStyle(Ot,"::before"),Xt=getComputedStyle(Ot,"::after"),te=ft.left+ft.width/2-mt.left,ne=ft.top+ft.height/2-mt.top,ge=parseFloat(Ut.width),Dt=parseFloat(Ot.style.getPropertyValue("--label-leader-angle")),xe=Number(getComputedStyle(Ot).opacity);$.globalAlpha=xe*Number(Ut.opacity),$.strokeStyle=Ut.borderTopColor,$.lineWidth=parseFloat(Ut.borderTopWidth),$.beginPath(),$.moveTo(te,ne),$.lineTo(te+Math.cos(Dt)*ge,ne+Math.sin(Dt)*ge),$.stroke(),Xt.content!=="none"&&($.globalAlpha=xe*Number(Xt.opacity),$.fillStyle=Xt.backgroundColor,$.beginPath(),$.arc(te,ne,parseFloat(Xt.width)/2,0,2*Math.PI),$.fill())}for(const{target:Ot}of It){const ft=Ot.firstElementChild,Ut=ft.getBoundingClientRect(),Xt=getComputedStyle(ft),te=Number(getComputedStyle(Ot).opacity);$.save(),$.globalAlpha=te,$.fillStyle=Xt.backgroundColor,$.beginPath();const ne=Ut.left-mt.left,ge=Ut.top-mt.top,Dt=Math.min(parseFloat(Xt.borderTopLeftRadius),Ut.height/2);if($.roundRect(ne,ge,Ut.width,Ut.height,Dt),$.fill(),t==="atlas"){$.strokeStyle=Xt.borderTopColor,$.lineWidth=parseFloat(Xt.borderTopWidth),$.stroke(),Xt.borderLeftWidth!==Xt.borderTopWidth&&($.save(),$.clip(),$.fillStyle=Xt.borderLeftColor,$.fillRect(ne,ge,parseFloat(Xt.borderLeftWidth),Ut.height),$.restore());const xe=ft.querySelector(".label-dot");if(xe){const ee=xe.getBoundingClientRect();$.fillStyle=getComputedStyle(xe).backgroundColor,$.beginPath(),$.arc(ee.left+ee.width/2-mt.left,ee.top+ee.height/2-mt.top,ee.width/2,0,2*Math.PI),$.fill()}}for(const xe of ft.querySelectorAll("span")){const ee=xe.getBoundingClientRect(),Je=getComputedStyle(xe);$.globalAlpha=te*Number(Je.opacity),$.fillStyle=Je.color,$.font=Je.fontWeight+" "+Je.fontSize+" "+Je.fontFamily;const we=document.createRange(),Ge=new Map;for(const be of xe.childNodes)if(be.nodeType===Node.TEXT_NODE)for(let rn=0;rn<be.length;rn++){we.setStart(be,rn),we.setEnd(be,rn+1);const ie=we.getBoundingClientRect(),Ne=Math.round(ie.top*2),qe=Ge.get(Ne)||{left:ie.left,top:ie.top,text:""};qe.text+=be.data[rn],Ge.set(Ne,qe)}$.textBaseline="top";for(const be of Ge.values())be.top<ee.bottom&&$.fillText(be.text,be.left-mt.left,be.top-mt.top)}$.restore()}return gt(),et}const J=new ResizeObserver(On),q=new IntersectionObserver(([W])=>{At=W.isIntersecting,gt()}),Z=new MutationObserver(A);return M.addEventListener("change",gt),M.addEventListener("start",()=>{j=!0,t==="atlas"&&it&&z===null&&w&&(Ft={target:M.target.clone(),offset:x.position.clone().sub(M.target)}),Bn(),ue()}),M.addEventListener("end",()=>{if(j=!1,Ft){const W=x.position.clone().sub(M.target),{target:ot,offset:et}=Ft;Ft=void 0,ot.distanceToSquared(M.target)>1||Math.abs(W.length()-et.length())>1?it=!1:W.distanceToSquared(et)>1&&Fn(!0,W.normalize())}P.pending&&P.touch(performance.now()),gt()}),t==="atlas"&&c.domElement.addEventListener("wheel",cr,{capture:!0,passive:!0}),c.domElement.addEventListener("pointerdown",ha),c.domElement.addEventListener("pointerup",hr),c.domElement.addEventListener("pointermove",ur),c.domElement.addEventListener("pointercancel",_s),Z.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),J.observe(s),q.observe(s),document.addEventListener("visibilitychange",gt),Qt.addEventListener("change",A),On(),A(),{setData:oa,select:ms,selectRelation:la,setView:ca,turn:Fo,zoom:ua,exportPng:k,dispose(){J.disconnect(),q.disconnect(),Z.disconnect(),document.removeEventListener("visibilitychange",gt),Qt.removeEventListener("change",A),M.dispose(),Bn(),bt==null||bt.kill(),clearTimeout(Mt),cancelAnimationFrame(K),_.clear(),I&&Ic(I.root);for(const{map:W,roughnessMap:ot}of Object.values(d))W.dispose(),ot.dispose();b.dispose(),E.dispose(),v.dispose(),S.dispose(),c.domElement.removeEventListener("wheel",cr,!0),c.domElement.removeEventListener("pointerdown",ha),c.domElement.removeEventListener("pointerup",hr),c.domElement.removeEventListener("pointermove",ur),c.domElement.removeEventListener("pointercancel",_s),c.domElement.removeEventListener("webglcontextlost",o),c.dispose(),c.forceContextLoss(),c.domElement.remove(),g.domElement.remove()}}}const bb=["data-label-count","data-visible-edges","data-lod"],Eb={class:"spatial-controls"},Tb={class:"spatial-buttons",role:"group","aria-label":"镜头视角"},wb=["aria-pressed"],Ab={class:"spatial-buttons spatial-turn",role:"group","aria-label":"视角方向"},Rb=["aria-label","aria-keyshortcuts","title","disabled","onClick"],Cb={class:"spatial-buttons spatial-actions",role:"group","aria-label":"镜头工具"},Pb=["disabled","title"],Db={class:"spatial-buttons spatial-extra"},Lb=["aria-expanded"],Nb={class:"spatial-field"},Ib={class:"spatial-layers",role:"group","aria-label":"切面"},Ub=["aria-pressed","data-layer","onClick"],Ob={key:0,class:"spatial-empty",role:"status"},Fb={class:"spatial-footer"},Bb={key:0,class:"spatial-branch-key"},zb={key:1,role:"group","aria-label":"检出记录数与线宽",class:"spatial-weight"},kb={key:2},Gb={key:2,class:"spatial-label-hint"},Hb={key:3,class:"spatial-label-hint"},Vb={key:4,class:"spatial-lod"},Wb=["data-node","aria-label","aria-expanded","aria-pressed","title","onClick"],Xb={key:0,class:"label-dot","aria-hidden":"true"},qb={class:"label-title"},Yb={key:0},Zb={key:1,class:"label-disclosure","aria-hidden":"true"},Kb={key:2,class:"label-meta"},$b={__name:"Stage3DCanvas",props:{graph:{type:Object,required:!0},selected:String,selectedEdge:String,status:String,fullscreen:Boolean,variant:{type:String,default:"atlas"}},emits:["select","select-edge","stats","unavailable"],setup(s,{expose:t,emit:e}){const n=s,i=e,r=dr(null),a=ku([]),o=dr(null),l=dr(!1),c=dr(!1),u=ku({nodes:0,edges:0,groups:0,drawn:0,near:!1}),f=dr(!1),h=gs(()=>n.selected||n.graph.expanded),d=[{key:"ArrowLeft",glyph:"←",label:"向左旋转",yaw:-1,pitch:0},{key:"ArrowUp",glyph:"↑",label:"抬高视角",yaw:0,pitch:1},{key:"ArrowDown",glyph:"↓",label:"降低视角",yaw:0,pitch:-1},{key:"ArrowRight",glyph:"→",label:"向右旋转",yaw:1,pitch:0}],g=gs(()=>n.variant==="atlas"?["领域分类","仓库矩阵","密码算法"]:n.graph.mode==="calls"?["来源位置","密码操作","返回或关联"]:["文件与证据","密码算法","迁移参考"]),_=gs(()=>n.variant==="atlas"?300:250),p=gs(()=>g.value.map((w,I)=>({name:w,index:I,z:(1-I)*_.value})).filter(w=>n.variant!=="atlas"||w.index!==1||!!n.graph.expanded)),m=gs(()=>n.graph.peak||1),x=gs(()=>[...new Set([1,Math.round(m.value/4)||1,m.value])]);let M;function S(){o.value!==null&&!p.value.some(w=>w.index===o.value)&&b(),M==null||M.setData(zp(n.graph),n.selected),n.selectedEdge&&(M==null||M.selectRelation(n.selectedEdge))}function b(w=null){o.value=w,M==null||M.setView(w)}function E(w,I=!1){I&&n.variant==="workbench"&&(M==null||M.selectRelation(w)),i(I?"select-edge":"select",w)}function v(w){M==null||M.select(w)}function y(){i("select",""),b()}function C({yaw:w,pitch:I}){o.value===null&&(M==null||M.turn(w,I))}function R(w){var I;w.target.closest("button")||(I=r.value)==null||I.focus({preventScroll:!0})}function L(w){if(w.defaultPrevented||w.ctrlKey||w.metaKey||w.altKey)return;const I=d.find(D=>D.key===w.key);if(I&&o.value===null){w.preventDefault(),C(I);return}["+","=","-","0"].includes(w.key)&&w.preventDefault(),(w.key==="+"||w.key==="=")&&(M==null||M.zoom(1.3)),w.key==="-"&&(M==null||M.zoom(1/1.3)),w.key==="0"&&y(),w.key==="Escape"&&(n.selected||n.selectedEdge)&&!n.fullscreen&&(w.preventDefault(),i("select",""))}function U(w){return w.group?w.group.rows.length+" 仓":n.variant==="atlas"?w.detailLines.join(""):w.line?"第 "+w.line+" 行":w.status?kp(w.status):w.kindLabel||""}function B(){var w;(w=M==null?void 0:M.exportPng())==null||w.toBlob(I=>{if(!I)return;const D=URL.createObjectURL(I),O=document.createElement("a");O.href=D,O.download=n.variant==="atlas"?"仓库算法全景.png":"证据关系图.png",O.click(),setTimeout(()=>URL.revokeObjectURL(D),1e3)},"image/png")}return Ip(()=>{try{M=yb(r.value,{variant:n.variant,fullscreen:()=>n.fullscreen,onLabels:w=>{a.value=w},onPick:E,onStats:w=>{u.value=w,l.value=!0,i("stats",w)},onExportReady:w=>{c.value=w},onLost:w=>{w.preventDefault(),i("unavailable")}}),S()}catch(w){console.warn("3D 视图切换到兼容模式",w),i("unavailable")}}),Bo(()=>n.graph,S,{flush:"post"}),Bo(()=>n.selected,v),Bo(()=>n.selectedEdge,w=>{w?M==null||M.selectRelation(w):v(n.selected)}),Up(()=>M==null?void 0:M.dispose()),t({locate:v,exportView:B,fit:()=>b()}),(w,I)=>(Ee(),Ae("section",{class:zu(["spatial-stage",["spatial-"+s.variant,{"spatial-fullscreen":s.fullscreen,"spatial-tools-open":f.value,"spatial-has-relation":s.selectedEdge}]]),"data-label-count":u.value.groups,"data-visible-edges":u.value.drawn,"data-lod":u.value.near?"near":"far"},[Ie("div",Eb,[Ie("div",Tb,[Ie("button",{class:"button secondary compact","aria-pressed":o.value===null,onClick:I[0]||(I[0]=D=>b())},"空间巡航",8,wb)]),Ie("div",Ab,[(Ee(),Ae(Ai,null,fr(d,D=>Ie("button",{key:D.key,type:"button",class:"button secondary compact","aria-label":D.label,"aria-keyshortcuts":D.key,title:o.value===null?D.label:"返回空间巡航后调整视角",disabled:!l.value||o.value!==null,onClick:O=>C(D)},zn(D.glyph),9,Rb)),64))]),Ie("div",Cb,[Ie("button",{class:"button secondary compact","aria-label":"缩小关系图",onClick:I[1]||(I[1]=D=>{var O;return(O=zo(M))==null?void 0:O.zoom(1/1.3)})},"−"),Ie("button",{class:"button secondary compact","aria-label":"放大关系图",onClick:I[2]||(I[2]=D=>{var O;return(O=zo(M))==null?void 0:O.zoom(1.3)})},"＋"),Ie("button",{class:"button secondary compact",onClick:y},"复位"),Ie("button",{class:"button secondary compact spatial-export",disabled:!c.value,title:c.value?void 0:"等待图形和标签排布完成",onClick:B},"导出 PNG",8,Pb)]),Ie("div",Db,[s.variant==="atlas"?(Ee(),Ae("button",{key:0,type:"button",class:"button secondary compact spatial-tools-toggle","aria-expanded":f.value,onClick:I[3]||(I[3]=D=>f.value=!f.value)},"视图工具",8,Lb)):Qn("",!0),Op(w.$slots,"fullscreen")])]),Ie("div",Nb,[Ie("div",{ref_key:"surface",ref:r,class:"spatial-surface",tabindex:"0","aria-label":"三维关系图，方向键或拖动调整视角，聚焦图面后滚轮缩放，点节点或管道查看关系","aria-keyshortcuts":"ArrowLeft ArrowUp ArrowDown ArrowRight",onPointerdown:R,onKeydown:L},null,544),Ie("div",Ib,[(Ee(!0),Ae(Ai,null,fr(p.value,D=>(Ee(),Ae("button",{key:D.index,type:"button","aria-pressed":o.value===D.index,class:"spatial-layer","data-layer":D.index,onClick:O=>b(D.index)},[I[4]||(I[4]=Ie("i",{"aria-hidden":"true"},null,-1)),Ie("span",null,zn(D.name),1),Ie("small",null,"Z "+zn(D.z>0?"+":"")+zn(D.z),1)],8,Ub))),128))]),!l.value||!s.graph.nodes.length?(Ee(),Ae("p",Ob,zn(l.value?"没有匹配的关系":"正在构建空间图…"),1)):Qn("",!0)]),Ie("div",Fb,[s.variant==="workbench"?(Ee(),Fu(Fp,{key:0,mode:s.graph.mode},null,8,["mode"])):(Ee(),Ae(Ai,{key:1},[s.graph.expanded?(Ee(),Ae("span",Bb,[...I[5]||(I[5]=[Ie("i",null,null,-1),fa("类别归属",-1)])])):Qn("",!0),s.status!=="legacy"?(Ee(),Ae("div",zb,[(Ee(!0),Ae(Ai,null,fr(x.value,D=>(Ee(),Ae("span",{key:D},[Ie("i",{style:Bu({height:zo(If)(D,m.value,s.status)+"px"})},null,4),fa(zn(D)+" 项",1)]))),128))])):(Ee(),Ae("span",kb,"点线表示历史检出"))],64)),s.variant==="atlas"&&s.selectedEdge&&o.value===null?(Ee(),Ae("span",Gb,"选中关系加粗显示")):Qn("",!0),s.variant==="atlas"&&l.value&&o.value===null&&u.value.groups<u.value.nodes?(Ee(),Ae("span",Hb,"可逐层查看，或用定位查找节点")):Qn("",!0),u.value.drawn&&u.value.drawn<u.value.edges?(Ee(),Ae("span",Vb,"当前绘制 "+zn(u.value.drawn)+" 条主干关系",1)):Qn("",!0)]),(Ee(!0),Ae(Ai,null,fr(a.value,D=>(Ee(),Fu(Bp,{key:D.node.id,to:D.target},[Ie("button",{type:"button",class:zu(["spatial-label",["label-"+D.node.kind,{"is-current":D.node.id===h.value}]]),"data-node":D.node.id,"aria-label":s.variant==="atlas"?[g.value[D.node.layer],D.node.label,U(D.node)].join("，"):D.node.label,"aria-expanded":D.node.group?!!D.node.expanded:void 0,"aria-pressed":D.node.group?void 0:s.selected===D.node.id,title:D.node.label,style:Bu({"--node-tint":D.node.tint}),onClick:O=>E(D.node.id)},[s.variant==="atlas"&&D.node.kind==="algorithm"?(Ee(),Ae("i",Xb)):Qn("",!0),Ie("span",qb,[s.variant==="atlas"&&D.node.row?(Ee(!0),Ae(Ai,{key:0},fr(D.node.label.split(new RegExp("(?<=[/-])")),(O,H)=>(Ee(),Ae(Ai,{key:H},[H?(Ee(),Ae("wbr",Yb)):Qn("",!0),fa(zn(O),1)],64))),128)):(Ee(),Ae(Ai,{key:1},[fa(zn(s.variant==="atlas"?D.node.label:D.node.title||D.node.label),1)],64))]),D.node.group?(Ee(),Ae("span",Zb,zn(D.node.expanded?"−":"+"),1)):Qn("",!0),U(D.node)?(Ee(),Ae("span",Kb,zn(U(D.node)),1)):Qn("",!0)],14,Wb)],8,["to"]))),128))],10,bb))}};export{$b as default};
