import{z as Ip,B as If,s as Up,h as Bu,j as Op,o as ke,c as Je,a as Ne,F as Ri,r as cr,t as Kn,b as Bo,C as Fp,D as ca,k as zu,G as Bp,l as ua,f as ku,n as Gu,T as zp,q as zo,E as Hu,H as kp,g as ur,J as Gp}from"./index-CAxBayVP.js";/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Bc="187",Fs={ROTATE:0,DOLLY:1,PAN:2},Ns={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Hp=0,Vu=1,Vp=2,Wa=1,Wp=2,Sr=3,fs=0,fn=1,ti=2,os=0,wr=1,Pl=2,Wu=3,Xu=4,Xp=5,Ls=100,qp=101,Yp=102,Zp=103,Kp=104,$p=200,Jp=201,Qp=202,jp=203,Uf=204,Of=205,tm=206,em=207,nm=208,im=209,sm=210,rm=211,am=212,om=213,lm=214,Dl=0,Ll=1,Nl=2,Nr=3,Il=4,Ul=5,Ol=6,Fl=7,Ff=0,cm=1,um=2,Mi=0,zc=1,kc=2,Gc=3,wo=4,Hc=5,Vc=6,Wc=7,Bf=300,Vs=301,Ir=302,ko=303,Go=304,Bl=1e3,xi=1001,zl=1002,Qe=1003,hm=1004,ha=1005,on=1006,Ho=1007,vi=1008,En=1009,zf=1010,kf=1011,Ur=1012,Xc=1013,si=1014,Wn=1015,dn=1016,qc=1017,Yc=1018,Ws=1020,Gf=35902,Hf=35899,Vf=1021,Wf=1022,ni=1023,Wi=1026,Ui=1027,Zc=1028,Kc=1029,ds=1030,$c=1031,Jc=1033,Xa=33776,qa=33777,Ya=33778,Za=33779,kl=35840,Gl=35841,Hl=35842,Vl=35843,Wl=36196,Xl=37492,ql=37496,Yl=37488,Zl=37489,io=37490,Kl=37491,$l=37808,Jl=37809,Ql=37810,jl=37811,tc=37812,ec=37813,nc=37814,ic=37815,sc=37816,rc=37817,ac=37818,oc=37819,lc=37820,cc=37821,uc=36492,hc=36494,fc=36495,dc=36283,pc=36284,so=36285,mc=36286,fm=3200,_c=0,dm=1,Ii="",yn="srgb",ro="srgb-linear",ao="linear",ge="srgb",Vo=7680,pm=519,mm=512,_m=513,gm=514,Xf=515,xm=516,vm=517,qf=518,Yf=519,Mm=35044,qu="300 es",Xn=2e3,Or=2001;function Sm(s){for(let t=s.length-1;t>=0;--t)if(s[t]>=65535)return!0;return!1}function oo(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function ym(){const s=oo("canvas");return s.style.display="block",s}const Yu={};function Zu(...s){const t="THREE."+s.shift();console.log(t,...s)}function Zf(s){const t=s[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=s[1];e&&e.isStackTrace?s[0]+=" "+e.getLocation():s[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return s}function kt(...s){s=Zf(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...s)}}function he(...s){s=Zf(s);const t="THREE."+s.shift();{const e=s[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...s)}}function Ka(...s){const t=s.join(" ");t in Yu||(Yu[t]=!0,kt(...s))}function bm(s,t,e){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(t,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,e);break;default:n()}}setTimeout(r,e)})}const Em={[Dl]:Dl,[Nl]:Ol,[Il]:Il,[Nr]:Ul,[Ll]:Ll,[Ol]:Nl,[Fl]:Fl,[Ul]:Nr};class Zi{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const i=n[t];if(i!==void 0){const r=i.indexOf(e);r!==-1&&i.splice(r,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let r=0,a=i.length;r<a;r++)i[r].call(this,t);t.target=null}}}const en=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Ku=1234567;const Bs=Math.PI/180,Fr=180/Math.PI;function ms(){const s=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(en[s&255]+en[s>>8&255]+en[s>>16&255]+en[s>>24&255]+"-"+en[t&255]+en[t>>8&255]+"-"+en[t>>16&15|64]+en[t>>24&255]+"-"+en[e&63|128]+en[e>>8&255]+"-"+en[e>>16&255]+en[e>>24&255]+en[n&255]+en[n>>8&255]+en[n>>16&255]+en[n>>24&255]).toLowerCase()}function ne(s,t,e){return Math.max(t,Math.min(e,s))}function Qc(s,t){return(s%t+t)%t}function Tm(s,t,e,n,i){return n+(s-t)*(i-n)/(e-t)}function wm(s,t,e){return s!==t?(e-s)/(t-s):0}function Ar(s,t,e){return(1-e)*s+e*t}function Am(s,t,e,n){return Ar(s,t,1-Math.exp(-e*n))}function Rm(s,t=1){return t-Math.abs(Qc(s,t*2)-t)}function Cm(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*(3-2*s))}function Pm(s,t,e){return s<=t?0:s>=e?1:(s=(s-t)/(e-t),s*s*s*(s*(s*6-15)+10))}function Dm(s,t){return s+Math.floor(Math.random()*(t-s+1))}function Lm(s,t){return s+Math.random()*(t-s)}function Nm(s){return s*(.5-Math.random())}function Im(s){s!==void 0&&(Ku=s);let t=Ku+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Um(s){return s*Bs}function Om(s){return s*Fr}function Fm(s){return s>0&&Number.isInteger(s)&&2**Math.round(Math.log2(s))===s}function Bm(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function Kf(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function zm(s,t,e,n,i){const r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),c=r((t+n)/2),u=a((t+n)/2),p=r((t-n)/2),h=a((t-n)/2),d=r((n-t)/2),g=a((n-t)/2);switch(i){case"XYX":s.set(o*u,l*p,l*h,o*c);break;case"YZY":s.set(l*h,o*u,l*p,o*c);break;case"ZXZ":s.set(l*p,l*h,o*u,o*c);break;case"XZX":s.set(o*u,l*g,l*d,o*c);break;case"YXY":s.set(l*d,o*u,l*g,o*c);break;case"ZYZ":s.set(l*g,l*d,o*u,o*c);break;default:kt("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function jc(s){switch(s.constructor){case Uint32Array:return 4294967295;case Uint16Array:return 65535;case Uint8Array:case Uint8ClampedArray:return 255;case Int32Array:return 2147483647;case Int16Array:return 32767;case Int8Array:return 127;default:return}}function $f(s,t){if(t.constructor===Float32Array)return s;const e=jc(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.max(s/e,-1)}function Jf(s,t){if(t.constructor===Float32Array)return s;const e=jc(t);if(e===void 0)throw new Error("THREE.MathUtils: Invalid component type.");return Math.round(s*e)}const gc={DEG2RAD:Bs,RAD2DEG:Fr,generateUUID:ms,clamp:ne,euclideanModulo:Qc,mapLinear:Tm,inverseLerp:wm,lerp:Ar,damp:Am,pingpong:Rm,smoothstep:Cm,smootherstep:Pm,randInt:Dm,randFloat:Lm,randFloatSpread:Nm,seededRandom:Im,degToRad:Um,radToDeg:Om,isPowerOfTwo:Fm,ceilPowerOfTwo:Bm,floorPowerOfTwo:Kf,setQuaternionFromProperEuler:zm,normalize:Jf,denormalize:$f},Nu=class Nu{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("THREE.Vector2: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("THREE.Vector2: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*i+t.x,this.y=r*i+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Nu.prototype.isVector2=!0;let rt=Nu;class qn{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,r,a,o){let l=n[i+0],c=n[i+1],u=n[i+2],p=n[i+3],h=r[a+0],d=r[a+1],g=r[a+2],m=r[a+3];if(p!==m||l!==h||c!==d||u!==g){let f=l*h+c*d+u*g+p*m;f<0&&(h=-h,d=-d,g=-g,m=-m,f=-f);let _=1-o;if(f<.9995){const v=Math.acos(f),S=Math.sin(v);_=Math.sin(_*v)/S,o=Math.sin(o*v)/S,l=l*_+h*o,c=c*_+d*o,u=u*_+g*o,p=p*_+m*o}else{l=l*_+h*o,c=c*_+d*o,u=u*_+g*o,p=p*_+m*o;const v=1/Math.sqrt(l*l+c*c+u*u+p*p);l*=v,c*=v,u*=v,p*=v}}t[e]=l,t[e+1]=c,t[e+2]=u,t[e+3]=p}static multiplyQuaternionsFlat(t,e,n,i,r,a){const o=n[i],l=n[i+1],c=n[i+2],u=n[i+3],p=r[a],h=r[a+1],d=r[a+2],g=r[a+3];return t[e]=o*g+u*p+l*d-c*h,t[e+1]=l*g+u*h+c*p-o*d,t[e+2]=c*g+u*d+o*h-l*p,t[e+3]=u*g-o*p-l*h-c*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,c=o(n/2),u=o(i/2),p=o(r/2),h=l(n/2),d=l(i/2),g=l(r/2);switch(a){case"XYZ":this._x=h*u*p+c*d*g,this._y=c*d*p-h*u*g,this._z=c*u*g+h*d*p,this._w=c*u*p-h*d*g;break;case"YXZ":this._x=h*u*p+c*d*g,this._y=c*d*p-h*u*g,this._z=c*u*g-h*d*p,this._w=c*u*p+h*d*g;break;case"ZXY":this._x=h*u*p-c*d*g,this._y=c*d*p+h*u*g,this._z=c*u*g+h*d*p,this._w=c*u*p-h*d*g;break;case"ZYX":this._x=h*u*p-c*d*g,this._y=c*d*p+h*u*g,this._z=c*u*g-h*d*p,this._w=c*u*p+h*d*g;break;case"YZX":this._x=h*u*p+c*d*g,this._y=c*d*p+h*u*g,this._z=c*u*g-h*d*p,this._w=c*u*p-h*d*g;break;case"XZY":this._x=h*u*p-c*d*g,this._y=c*d*p-h*u*g,this._z=c*u*g+h*d*p,this._w=c*u*p+h*d*g;break;default:kt("Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],r=e[8],a=e[1],o=e[5],l=e[9],c=e[2],u=e[6],p=e[10],h=n+o+p;if(h>0){const d=.5/Math.sqrt(h+1);this._w=.25/d,this._x=(u-l)*d,this._y=(r-c)*d,this._z=(a-i)*d}else if(n>o&&n>p){const d=2*Math.sqrt(1+n-o-p);this._w=(u-l)/d,this._x=.25*d,this._y=(i+a)/d,this._z=(r+c)/d}else if(o>p){const d=2*Math.sqrt(1+o-n-p);this._w=(r-c)/d,this._x=(i+a)/d,this._y=.25*d,this._z=(l+u)/d}else{const d=2*Math.sqrt(1+p-n-o);this._w=(a-i)/d,this._x=(r+c)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(ne(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,r=t._z,a=t._w,o=e._x,l=e._y,c=e._z,u=e._w;return this._x=n*u+a*o+i*c-r*l,this._y=i*u+a*l+r*o-n*c,this._z=r*u+a*c+n*l-i*o,this._w=a*u-n*o-i*l-r*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,r=t._z,a=t._w,o=this.dot(t);o<0&&(n=-n,i=-i,r=-r,a=-a,o=-o);let l=1-e;if(o<.9995){const c=Math.acos(o),u=Math.sin(c);l=Math.sin(l*c)/u,e=Math.sin(e*c)/u,this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+r*e,this._w=this._w*l+a*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),r*Math.sin(e),r*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Iu=class Iu{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("THREE.Vector3: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("THREE.Vector3: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion($u.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion($u.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*i,this.y=r[1]*e+r[4]*n+r[7]*i,this.z=r[2]*e+r[5]*n+r[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*i+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*i+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*i+r[14])*a,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,r=t.x,a=t.y,o=t.z,l=t.w,c=2*(a*i-o*n),u=2*(o*e-r*i),p=2*(r*n-a*e);return this.x=e+l*c+a*p-o*u,this.y=n+l*u+o*c-r*p,this.z=i+l*p+r*u-a*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*i,this.y=r[1]*e+r[5]*n+r[9]*i,this.z=r[2]*e+r[6]*n+r[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=i*l-r*o,this.y=r*a-n*l,this.z=n*o-i*a,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Wo.copy(this).projectOnVector(t),this.sub(Wo)}reflect(t){return this.sub(Wo.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(ne(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Iu.prototype.isVector3=!0;let I=Iu;const Wo=new I,$u=new qn,Uu=class Uu{constructor(t,e,n,i,r,a,o,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c)}set(t,e,n,i,r,a,o,l,c){const u=this.elements;return u[0]=t,u[1]=i,u[2]=o,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],c=n[1],u=n[4],p=n[7],h=n[2],d=n[5],g=n[8],m=i[0],f=i[3],_=i[6],v=i[1],S=i[4],M=i[7],E=i[2],b=i[5],x=i[8];return r[0]=a*m+o*v+l*E,r[3]=a*f+o*S+l*b,r[6]=a*_+o*M+l*x,r[1]=c*m+u*v+p*E,r[4]=c*f+u*S+p*b,r[7]=c*_+u*M+p*x,r[2]=h*m+d*v+g*E,r[5]=h*f+d*S+g*b,r[8]=h*_+d*M+g*x,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8];return e*a*u-e*o*c-n*r*u+n*o*l+i*r*c-i*a*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],p=u*a-o*c,h=o*l-u*r,d=c*r-a*l,g=e*p+n*h+i*d;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const m=1/g;return t[0]=p*m,t[1]=(i*c-u*n)*m,t[2]=(o*n-i*a)*m,t[3]=h*m,t[4]=(u*e-i*l)*m,t[5]=(i*r-o*e)*m,t[6]=d*m,t[7]=(n*l-c*e)*m,t[8]=(a*e-n*r)*m,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,r,a,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*a+c*o)+a+t,-i*c,i*l,-i*(-c*a+l*o)+o+e,0,0,1),this}scale(t,e){return Ka("Matrix3: .scale() is deprecated. Use .makeScale() instead."),this.premultiply(Xo.makeScale(t,e)),this}rotate(t){return Ka("Matrix3: .rotate() is deprecated. Use .makeRotation() instead."),this.premultiply(Xo.makeRotation(-t)),this}translate(t,e){return Ka("Matrix3: .translate() is deprecated. Use .makeTranslation() instead."),this.premultiply(Xo.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};Uu.prototype.isMatrix3=!0;let Wt=Uu;const Xo=new Wt,Ju=new Wt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Qu=new Wt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function km(){const s={enabled:!0,workingColorSpace:ro,spaces:{},convert:function(i,r,a){return this.enabled===!1||r===a||!r||!a||(this.spaces[r].transfer===ge&&(i.r=Si(i.r),i.g=Si(i.g),i.b=Si(i.b)),this.spaces[r].primaries!==this.spaces[a].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[a].fromXYZ)),this.spaces[a].transfer===ge&&(i.r=zs(i.r),i.g=zs(i.g),i.b=zs(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Ii?ao:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,a){return i.copy(this.spaces[a].fromXYZ).multiply(this.spaces[r].toXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[ro]:{primaries:t,whitePoint:n,transfer:ao,toXYZ:Ju,fromXYZ:Qu,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:yn},outputColorSpaceConfig:{drawingBufferColorSpace:yn}},[yn]:{primaries:t,whitePoint:n,transfer:ge,toXYZ:Ju,fromXYZ:Qu,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:yn}}}),s}const re=km();function Si(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function zs(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}let gs;class Gm{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{gs===void 0&&(gs=oo("canvas")),gs.width=t.width,gs.height=t.height;const i=gs.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=gs}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=oo("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),r=i.data;for(let a=0;a<r.length;a++)r[a]=Si(r[a]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Si(e[n]/255)*255):e[n]=Si(e[n]);return{data:e,width:t.width,height:t.height}}else return kt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let Hm=0;class tu{constructor(t=null){this.isTextureSource=!0,Object.defineProperty(this,"id",{value:Hm++}),this.uuid=ms(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width||0,e.height||0,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let a=0,o=i.length;a<o;a++)i[a].isDataTexture?r.push(qo(i[a].image)):r.push(qo(i[a]))}else r=qo(i);n.url=r}return e||(t.images[this.uuid]=n),n}}function qo(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Gm.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(kt("Texture: Unable to serialize Texture."),{})}let Vm=0;const Yo=new I;class ln extends Zi{constructor(t=ln.DEFAULT_IMAGE,e=ln.DEFAULT_MAPPING,n=xi,i=xi,r=on,a=vi,o=ni,l=En,c=ln.DEFAULT_ANISOTROPY,u=Ii){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Vm++}),this.uuid=ms(),this.name="",this.source=new tu(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=r,this.minFilter=a,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new rt(0,0),this.repeat=new rt(1,1),this.center=new rt(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Wt,this.generateMipmaps=!0,this.mipmapsAutoUpdate=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=u,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.isPMREMTexture=!1,this.normalized=!1}get width(){return this.source.getSize(Yo).x}get height(){return this.source.getSize(Yo).y}get depth(){return this.source.getSize(Yo).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.mipmapsAutoUpdate=t.mipmapsAutoUpdate,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isPMREMTexture=t.isPMREMTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){kt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){kt(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,mipmapsAutoUpdate:this.mipmapsAutoUpdate,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==Bf)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case Bl:t.x=t.x-Math.floor(t.x);break;case xi:t.x=t.x<0?0:1;break;case zl:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case Bl:t.y=t.y-Math.floor(t.y);break;case xi:t.y=t.y<0?0:1;break;case zl:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}ln.DEFAULT_IMAGE=null;ln.DEFAULT_MAPPING=Bf;ln.DEFAULT_ANISOTROPY=1;const Ou=class Ou{constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("THREE.Vector4: index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("THREE.Vector4: index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*i+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*i+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*i+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*i+a[15]*r,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,r;const l=t.elements,c=l[0],u=l[4],p=l[8],h=l[1],d=l[5],g=l[9],m=l[2],f=l[6],_=l[10];if(Math.abs(u-h)<.01&&Math.abs(p-m)<.01&&Math.abs(g-f)<.01){if(Math.abs(u+h)<.1&&Math.abs(p+m)<.1&&Math.abs(g+f)<.1&&Math.abs(c+d+_-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const S=(c+1)/2,M=(d+1)/2,E=(_+1)/2,b=(u+h)/4,x=(p+m)/4,y=(g+f)/4;return S>M&&S>E?S<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(S),i=b/n,r=x/n):M>E?M<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(M),n=b/i,r=y/i):E<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(E),n=x/r,i=y/r),this.set(n,i,r,e),this}let v=Math.sqrt((f-g)*(f-g)+(p-m)*(p-m)+(h-u)*(h-u));return Math.abs(v)<.001&&(v=1),this.x=(f-g)/v,this.y=(p-m)/v,this.z=(h-u)/v,this.w=Math.acos((c+d+_-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=ne(this.x,t.x,e.x),this.y=ne(this.y,t.y,e.y),this.z=ne(this.z,t.z,e.z),this.w=ne(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=ne(this.x,t,e),this.y=ne(this.y,t,e),this.z=ne(this.z,t,e),this.w=ne(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ne(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};Ou.prototype.isVector4=!0;let Ce=Ou;class Wm extends Zi{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:on,depthBuffer:!0,stencilBuffer:!1,resolveColorBuffer:!0,resolveDepthBuffer:!0,resolveStencilBuffer:!0,storeMultisampledColorBuffer:!0,storeMultisampledDepthBuffer:!0,storeMultisampledStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1,useArrayDepthTexture:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new Ce(0,0,t,e),this.scissorTest=!1,this.viewport=new Ce(0,0,t,e),this.textures=[];const i=n.count;for(let r=0;r<i;r++)this.textures[r]=new ln({width:t,height:e,depth:n.depth}),this.textures[r].isRenderTargetTexture=!0,this.textures[r].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveColorBuffer=n.resolveColorBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this.storeMultisampledColorBuffer=n.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=n.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=n.storeMultisampledStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview,this.useArrayDepthTexture=n.useArrayDepthTexture}_setTextureOptions(t={}){const e={minFilter:on,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.mipmapsAutoUpdate!==void 0&&(e.mipmapsAutoUpdate=t.mipmapsAutoUpdate),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&this._depthTexture.renderTarget===this&&(this._depthTexture.renderTarget=null),t!==null&&t.renderTarget===null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const i=Object.assign({},t.textures[e].image);this.textures[e].source=new tu(i)}if(this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveColorBuffer=t.resolveColorBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,this.storeMultisampledColorBuffer=t.storeMultisampledColorBuffer,this.storeMultisampledDepthBuffer=t.storeMultisampledDepthBuffer,this.storeMultisampledStencilBuffer=t.storeMultisampledStencilBuffer,t.depthTexture!==null)if(t.depthTexture.renderTarget===t){const e=t.depthTexture.clone();e.renderTarget=null,this.depthTexture=e}else this.depthTexture=t.depthTexture;else this.depthTexture=null;return this.samples=t.samples,this.multiview=t.multiview,this.useArrayDepthTexture=t.useArrayDepthTexture,this}dispose(){this.dispatchEvent({type:"dispose"})}}class pn extends Wm{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class Qf extends ln{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Qe,this.minFilter=Qe,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Xm extends ln{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Qe,this.minFilter=Qe,this.wrapR=xi,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}copy(t){return super.copy(t),this.wrapR=t.wrapR,this}}const To=class To{constructor(t,e,n,i,r,a,o,l,c,u,p,h,d,g,m,f){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,r,a,o,l,c,u,p,h,d,g,m,f)}set(t,e,n,i,r,a,o,l,c,u,p,h,d,g,m,f){const _=this.elements;return _[0]=t,_[4]=e,_[8]=n,_[12]=i,_[1]=r,_[5]=a,_[9]=o,_[13]=l,_[2]=c,_[6]=u,_[10]=p,_[14]=h,_[3]=d,_[7]=g,_[11]=m,_[15]=f,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new To().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinantAffine()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinantAffine()===0)return this.identity();const e=this.elements,n=t.elements,i=1/xs.setFromMatrixColumn(t,0).length(),r=1/xs.setFromMatrixColumn(t,1).length(),a=1/xs.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(i),c=Math.sin(i),u=Math.cos(r),p=Math.sin(r);if(t.order==="XYZ"){const h=a*u,d=a*p,g=o*u,m=o*p;e[0]=l*u,e[4]=-l*p,e[8]=c,e[1]=d+g*c,e[5]=h-m*c,e[9]=-o*l,e[2]=m-h*c,e[6]=g+d*c,e[10]=a*l}else if(t.order==="YXZ"){const h=l*u,d=l*p,g=c*u,m=c*p;e[0]=h+m*o,e[4]=g*o-d,e[8]=a*c,e[1]=a*p,e[5]=a*u,e[9]=-o,e[2]=d*o-g,e[6]=m+h*o,e[10]=a*l}else if(t.order==="ZXY"){const h=l*u,d=l*p,g=c*u,m=c*p;e[0]=h-m*o,e[4]=-a*p,e[8]=g+d*o,e[1]=d+g*o,e[5]=a*u,e[9]=m-h*o,e[2]=-a*c,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){const h=a*u,d=a*p,g=o*u,m=o*p;e[0]=l*u,e[4]=g*c-d,e[8]=h*c+m,e[1]=l*p,e[5]=m*c+h,e[9]=d*c-g,e[2]=-c,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){const h=a*l,d=a*c,g=o*l,m=o*c;e[0]=l*u,e[4]=m-h*p,e[8]=g*p+d,e[1]=p,e[5]=a*u,e[9]=-o*u,e[2]=-c*u,e[6]=d*p+g,e[10]=h-m*p}else if(t.order==="XZY"){const h=a*l,d=a*c,g=o*l,m=o*c;e[0]=l*u,e[4]=-p,e[8]=c*u,e[1]=h*p+m,e[5]=a*u,e[9]=d*p-g,e[2]=g*p-d,e[6]=o*u,e[10]=m*p+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(qm,t,Ym)}lookAt(t,e,n){const i=this.elements;return Mn.subVectors(t,e),Mn.lengthSq()===0&&(Mn.z=1),Mn.normalize(),Ci.crossVectors(n,Mn),Ci.lengthSq()===0&&(Math.abs(n.z)===1?Mn.x+=1e-4:Mn.z+=1e-4,Mn.normalize(),Ci.crossVectors(n,Mn)),Ci.normalize(),fa.crossVectors(Mn,Ci),i[0]=Ci.x,i[4]=fa.x,i[8]=Mn.x,i[1]=Ci.y,i[5]=fa.y,i[9]=Mn.y,i[2]=Ci.z,i[6]=fa.z,i[10]=Mn.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],c=n[12],u=n[1],p=n[5],h=n[9],d=n[13],g=n[2],m=n[6],f=n[10],_=n[14],v=n[3],S=n[7],M=n[11],E=n[15],b=i[0],x=i[4],y=i[8],A=i[12],R=i[1],C=i[5],L=i[9],N=i[13],D=i[2],B=i[6],z=i[10],U=i[14],X=i[3],G=i[7],K=i[11],Z=i[15];return r[0]=a*b+o*R+l*D+c*X,r[4]=a*x+o*C+l*B+c*G,r[8]=a*y+o*L+l*z+c*K,r[12]=a*A+o*N+l*U+c*Z,r[1]=u*b+p*R+h*D+d*X,r[5]=u*x+p*C+h*B+d*G,r[9]=u*y+p*L+h*z+d*K,r[13]=u*A+p*N+h*U+d*Z,r[2]=g*b+m*R+f*D+_*X,r[6]=g*x+m*C+f*B+_*G,r[10]=g*y+m*L+f*z+_*K,r[14]=g*A+m*N+f*U+_*Z,r[3]=v*b+S*R+M*D+E*X,r[7]=v*x+S*C+M*B+E*G,r[11]=v*y+S*L+M*z+E*K,r[15]=v*A+S*N+M*U+E*Z,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[12],a=t[1],o=t[5],l=t[9],c=t[13],u=t[2],p=t[6],h=t[10],d=t[14],g=t[3],m=t[7],f=t[11],_=t[15],v=l*d-c*h,S=o*d-c*p,M=o*h-l*p,E=a*d-c*u,b=a*h-l*u,x=a*p-o*u;return e*(m*v-f*S+_*M)-n*(g*v-f*E+_*b)+i*(g*S-m*E+_*x)-r*(g*M-m*b+f*x)}determinantAffine(){const t=this.elements,e=t[0],n=t[4],i=t[8],r=t[1],a=t[5],o=t[9],l=t[2],c=t[6],u=t[10];return e*(a*u-o*c)-n*(r*u-o*l)+i*(r*c-a*l)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],r=t[3],a=t[4],o=t[5],l=t[6],c=t[7],u=t[8],p=t[9],h=t[10],d=t[11],g=t[12],m=t[13],f=t[14],_=t[15],v=e*o-n*a,S=e*l-i*a,M=e*c-r*a,E=n*l-i*o,b=n*c-r*o,x=i*c-r*l,y=u*m-p*g,A=u*f-h*g,R=u*_-d*g,C=p*f-h*m,L=p*_-d*m,N=h*_-d*f,D=v*N-S*L+M*C+E*R-b*A+x*y;if(D===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const B=1/D;return t[0]=(o*N-l*L+c*C)*B,t[1]=(i*L-n*N-r*C)*B,t[2]=(m*x-f*b+_*E)*B,t[3]=(h*b-p*x-d*E)*B,t[4]=(l*R-a*N-c*A)*B,t[5]=(e*N-i*R+r*A)*B,t[6]=(f*M-g*x-_*S)*B,t[7]=(u*x-h*M+d*S)*B,t[8]=(a*L-o*R+c*y)*B,t[9]=(n*R-e*L-r*y)*B,t[10]=(g*b-m*M+_*v)*B,t[11]=(p*M-u*b-d*v)*B,t[12]=(o*A-a*C-l*y)*B,t[13]=(e*C-n*A+i*y)*B,t[14]=(m*S-g*E-f*v)*B,t[15]=(u*E-p*S+h*v)*B,this}scale(t){const e=this.elements,n=t.x,i=t.y,r=t.z;return e[0]*=n,e[4]*=i,e[8]*=r,e[1]*=n,e[5]*=i,e[9]*=r,e[2]*=n,e[6]*=i,e[10]*=r,e[3]*=n,e[7]*=i,e[11]*=r,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,c=r*a,u=r*o;return this.set(c*a+n,c*o-i*l,c*l+i*o,0,c*o+i*l,u*o+n,u*l-i*a,0,c*l-i*o,u*l+i*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,r,a){return this.set(1,n,r,0,t,1,a,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,c=r+r,u=a+a,p=o+o,h=r*c,d=r*u,g=r*p,m=a*u,f=a*p,_=o*p,v=l*c,S=l*u,M=l*p,E=n.x,b=n.y,x=n.z;return i[0]=(1-(m+_))*E,i[1]=(d+M)*E,i[2]=(g-S)*E,i[3]=0,i[4]=(d-M)*b,i[5]=(1-(h+_))*b,i[6]=(f+v)*b,i[7]=0,i[8]=(g+S)*x,i[9]=(f-v)*x,i[10]=(1-(h+m))*x,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];const r=this.determinantAffine();if(r===0)return n.set(1,1,1),e.identity(),this;let a=xs.set(i[0],i[1],i[2]).length();const o=xs.set(i[4],i[5],i[6]).length(),l=xs.set(i[8],i[9],i[10]).length();r<0&&(a=-a),zn.copy(this);const c=1/a,u=1/o,p=1/l;return zn.elements[0]*=c,zn.elements[1]*=c,zn.elements[2]*=c,zn.elements[4]*=u,zn.elements[5]*=u,zn.elements[6]*=u,zn.elements[8]*=p,zn.elements[9]*=p,zn.elements[10]*=p,e.setFromRotationMatrix(zn),n.x=a,n.y=o,n.z=l,this}makePerspective(t,e,n,i,r,a,o=Xn,l=!1){const c=this.elements,u=2*r/(e-t),p=2*r/(n-i),h=(e+t)/(e-t),d=(n+i)/(n-i);let g,m;if(l)g=r/(a-r),m=a*r/(a-r);else if(o===Xn)g=-(a+r)/(a-r),m=-2*a*r/(a-r);else if(o===Or)g=-a/(a-r),m=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=p,c[9]=d,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=m,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,r,a,o=Xn,l=!1){const c=this.elements,u=2/(e-t),p=2/(n-i),h=-(e+t)/(e-t),d=-(n+i)/(n-i);let g,m;if(l)g=1/(a-r),m=a/(a-r);else if(o===Xn)g=-2/(a-r),m=-(a+r)/(a-r);else if(o===Or)g=-1/(a-r),m=-r/(a-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=u,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=p,c[9]=0,c[13]=d,c[2]=0,c[6]=0,c[10]=g,c[14]=m,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};To.prototype.isMatrix4=!0;let ae=To;const xs=new I,zn=new ae,qm=new I(0,0,0),Ym=new I(1,1,1),Ci=new I,fa=new I,Mn=new I,ju=new ae,th=new qn;class Yn{constructor(t=0,e=0,n=0,i=Yn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,r=i[0],a=i[4],o=i[8],l=i[1],c=i[5],u=i[9],p=i[2],h=i[6],d=i[10];switch(e){case"XYZ":this._y=Math.asin(ne(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ne(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-p,r),this._z=0);break;case"ZXY":this._x=Math.asin(ne(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-p,d),this._z=Math.atan2(-a,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ne(p,-1,1)),Math.abs(p)<.9999999?(this._x=Math.atan2(h,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,c));break;case"YZX":this._z=Math.asin(ne(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,c),this._y=Math.atan2(-p,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-ne(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:kt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return ju.makeRotationFromQuaternion(t),this.setFromRotationMatrix(ju,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return th.setFromEuler(this),this.setFromQuaternion(th,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}Yn.DEFAULT_ORDER="XYZ";class eu{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let Zm=0;const eh=new I,vs=new qn,ui=new ae,da=new I,hr=new I,Km=new I,$m=new qn,nh=new I(1,0,0),ih=new I(0,1,0),sh=new I(0,0,1),rh={type:"added"},Jm={type:"removed"},Ms={type:"childadded",child:null},Zo={type:"childremoved",child:null};class He extends Zi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zm++}),this.uuid=ms(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=He.DEFAULT_UP.clone();const t=new I,e=new Yn,n=new qn,i=new I(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new ae},normalMatrix:{value:new Wt}}),this.matrix=new ae,this.matrixWorld=new ae,this.matrixAutoUpdate=He.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=He.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new eu,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale),this.pivot!==null&&this.position.copy(this.pivot).applyMatrix4(this.matrix).sub(this.pivot)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return vs.setFromAxisAngle(t,e),this.quaternion.multiply(vs),this}rotateOnWorldAxis(t,e){return vs.setFromAxisAngle(t,e),this.quaternion.premultiply(vs),this}rotateX(t){return this.rotateOnAxis(nh,t)}rotateY(t){return this.rotateOnAxis(ih,t)}rotateZ(t){return this.rotateOnAxis(sh,t)}translateOnAxis(t,e){return eh.copy(t).applyQuaternion(this.quaternion),this.position.add(eh.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(nh,t)}translateY(t){return this.translateOnAxis(ih,t)}translateZ(t){return this.translateOnAxis(sh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(ui.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?da.copy(t):da.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),hr.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?ui.lookAt(hr,da,this.up):ui.lookAt(da,hr,this.up),this.quaternion.setFromRotationMatrix(ui),i&&(ui.extractRotation(i.matrixWorld),vs.setFromRotationMatrix(ui),this.quaternion.premultiply(vs.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(he("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(rh),Ms.child=t,this.dispatchEvent(Ms),Ms.child=null):he("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Jm),Zo.child=t,this.dispatchEvent(Zo),Zo.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),ui.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),ui.multiply(t.parent.matrixWorld)),t.applyMatrix4(ui),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(rh),Ms.child=t,this.dispatchEvent(Ms),Ms.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let r=0,a=i.length;r<a;r++)i[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hr,t,Km),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(hr,$m,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}intersectsFrustum(){return!0}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,i=t.z,r=this.matrix.elements;r[12]+=e-r[0]*e-r[4]*n-r[8]*i,r[13]+=n-r[1]*e-r[5]*n-r[9]*i,r[14]+=i-r[2]*e-r[6]*n-r[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e,n=!1){const i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||n)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,n=!0),e===!0){const r=this.children;for(let a=0,o=r.length;a<o;a++)r[a].updateWorldMatrix(!1,!0,n)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,i.name=this.name,i.castShadow=this.castShadow,i.receiveShadow=this.receiveShadow,i.visible=this.visible,i.frustumCulled=this.frustumCulled,i.renderOrder=this.renderOrder,i.static=this.static,i.matrixAutoUpdate=this.matrixAutoUpdate,Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(o=>({...o})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=r(t.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,u=l.length;c<u;c++){const p=l[c];r(t.shapes,p)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(t.materials,this.material[l]));i.material=o}else i.material=r(t.materials,this.material);if(this.children.length>0){i.children=[];for(let o=0;o<this.children.length;o++)i.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];i.animations.push(r(t.animations,l))}}if(e){const o=a(t.geometries),l=a(t.materials),c=a(t.textures),u=a(t.images),p=a(t.shapes),h=a(t.skeletons),d=a(t.animations),g=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),u.length>0&&(n.images=u),p.length>0&&(n.shapes=p),h.length>0&&(n.skeletons=h),d.length>0&&(n.animations=d),g.length>0&&(n.nodes=g)}return n.object=i,n;function a(o){const l=[];for(const c in o){const u=o[c];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}dispose(){this.dispatchEvent({type:"dispose"})}}He.DEFAULT_UP=new I(0,1,0);He.DEFAULT_MATRIX_AUTO_UPDATE=!0;He.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class Oi extends He{constructor(){super(),this.isGroup=!0,this.type="Group"}}const Qm={type:"move"};class Ko{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Oi,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Oi,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new I,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new I),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Oi,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new I,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new I,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,r=null,a=null;const o=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){a=!0;for(const m of t.hand.values()){const f=e.getJointPose(m,n),_=this._getHandJoint(c,m);f!==null&&(_.matrix.fromArray(f.transform.matrix),_.matrix.decompose(_.position,_.quaternion,_.scale),_.matrixWorldNeedsUpdate=!0,_.jointRadius=f.radius),_.visible=f!==null}const u=c.joints["index-finger-tip"],p=c.joints["thumb-tip"],h=u.position.distanceTo(p.position),d=.02,g=.005;c.inputState.pinching&&h>d+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&h<=d-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.quaternion,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));o!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(o.matrix.fromArray(i.transform.matrix),o.matrix.decompose(o.position,o.quaternion,o.scale),o.matrixWorldNeedsUpdate=!0,i.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(i.linearVelocity)):o.hasLinearVelocity=!1,i.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(i.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(Qm)))}return o!==null&&(o.visible=i!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new Oi;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const jf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Pi={h:0,s:0,l:0},pa={h:0,s:0,l:0};function $o(s,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?s+(t-s)*6*e:e<1/2?t:e<2/3?s+(t-s)*6*(2/3-e):s}class Xt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=yn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,re.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=re.workingColorSpace){return this.r=t,this.g=e,this.b=n,re.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=re.workingColorSpace){if(t=Qc(t,1),e=ne(e,0,1),n=ne(n,0,1),e===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=$o(a,r,t+1/3),this.g=$o(a,r,t),this.b=$o(a,r,t-1/3)}return re.colorSpaceToWorking(this,i),this}setStyle(t,e=yn){function n(r){r!==void 0&&parseFloat(r)<1&&kt("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let r;const a=i[1],o=i[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseFloat(r[1]))/100,Math.min(100,parseFloat(r[2]))/100,Math.min(100,parseFloat(r[3]))/100,e);break;case"hsl":case"hsla":if(r=/^\s*([+-]?(?:\d+(?:\.\d+)?|\.\d+))\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*,\s*(\d+(?:\.\d+)?|\.\d+)\%\s*(?:,\s*(\d+(?:\.\d+)?|\.\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:kt("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const r=i[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);kt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=yn){const n=jf[t.toLowerCase()];return n!==void 0?this.setHex(n,e):kt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Si(t.r),this.g=Si(t.g),this.b=Si(t.b),this}copyLinearToSRGB(t){return this.r=zs(t.r),this.g=zs(t.g),this.b=zs(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=yn){return re.workingToColorSpace(nn.copy(this),t),Math.round(ne(nn.r*255,0,255))*65536+Math.round(ne(nn.g*255,0,255))*256+Math.round(ne(nn.b*255,0,255))}getHexString(t=yn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=re.workingColorSpace){re.workingToColorSpace(nn.copy(this),e);const n=nn.r,i=nn.g,r=nn.b,a=Math.max(n,i,r),o=Math.min(n,i,r);let l,c;const u=(o+a)/2;if(o===a)l=0,c=0;else{const p=a-o;switch(c=u<=.5?p/(a+o):p/(2-a-o),a){case n:l=(i-r)/p+(i<r?6:0);break;case i:l=(r-n)/p+2;break;case r:l=(n-i)/p+4;break}l/=6}return t.h=l,t.s=c,t.l=u,t}getRGB(t,e=re.workingColorSpace){return re.workingToColorSpace(nn.copy(this),e),t.r=nn.r,t.g=nn.g,t.b=nn.b,t}getStyle(t=yn){re.workingToColorSpace(nn.copy(this),t);const e=nn.r,n=nn.g,i=nn.b;return t!==yn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Pi),this.setHSL(Pi.h+t,Pi.s+e,Pi.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Pi),t.getHSL(pa);const n=Ar(Pi.h,pa.h,e),i=Ar(Pi.s,pa.s,e),r=Ar(Pi.l,pa.l,e);return this.setHSL(n,i,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*i,this.g=r[1]*e+r[4]*n+r[7]*i,this.b=r[2]*e+r[5]*n+r[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const nn=new Xt;Xt.NAMES=jf;class jm extends He{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Yn,this.environmentIntensity=1,this.environmentRotation=new Yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),this.background=t.background!==null?t.background.clone():null,this.environment=t.environment!==null?t.environment.clone():null,this.fog=t.fog!==null?t.fog.clone():null,this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),this.overrideMaterial=t.overrideMaterial!==null?t.overrideMaterial.clone():null,this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),e.object.backgroundBlurriness=this.backgroundBlurriness,e.object.backgroundIntensity=this.backgroundIntensity,e.object.backgroundRotation=this.backgroundRotation.toArray(),e.object.environmentIntensity=this.environmentIntensity,e.object.environmentRotation=this.environmentRotation.toArray(),e}}const kn=new I,hi=new I,Jo=new I,fi=new I,Ss=new I,ys=new I,ah=new I,Qo=new I,jo=new I,tl=new I,el=new Ce,nl=new Ce,il=new Ce;class Un{constructor(t=new I,e=new I,n=new I){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),kn.subVectors(t,e),i.cross(kn);const r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(t,e,n,i,r){kn.subVectors(i,e),hi.subVectors(n,e),Jo.subVectors(t,e);const a=kn.dot(kn),o=kn.dot(hi),l=kn.dot(Jo),c=hi.dot(hi),u=hi.dot(Jo),p=a*c-o*o;if(p===0)return r.set(0,0,0),null;const h=1/p,d=(c*l-o*u)*h,g=(a*u-o*l)*h;return r.set(1-d-g,g,d)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,fi)===null?!1:fi.x>=0&&fi.y>=0&&fi.x+fi.y<=1}static getInterpolation(t,e,n,i,r,a,o,l){return this.getBarycoord(t,e,n,i,fi)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,fi.x),l.addScaledVector(a,fi.y),l.addScaledVector(o,fi.z),l)}static getInterpolatedAttribute(t,e,n,i,r,a){return el.setScalar(0),nl.setScalar(0),il.setScalar(0),el.fromBufferAttribute(t,e),nl.fromBufferAttribute(t,n),il.fromBufferAttribute(t,i),a.setScalar(0),a.addScaledVector(el,r.x),a.addScaledVector(nl,r.y),a.addScaledVector(il,r.z),a}static isFrontFacing(t,e,n,i){return kn.subVectors(n,e),hi.subVectors(t,e),kn.cross(hi).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return kn.subVectors(this.c,this.b),hi.subVectors(this.a,this.b),kn.cross(hi).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return Un.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return Un.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,r){return Un.getInterpolation(t,this.a,this.b,this.c,e,n,i,r)}containsPoint(t){return Un.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return Un.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,r=this.c;let a,o;Ss.subVectors(i,n),ys.subVectors(r,n),Qo.subVectors(t,n);const l=Ss.dot(Qo),c=ys.dot(Qo);if(l<=0&&c<=0)return e.copy(n);jo.subVectors(t,i);const u=Ss.dot(jo),p=ys.dot(jo);if(u>=0&&p<=u)return e.copy(i);const h=l*p-u*c;if(h<=0&&l>=0&&u<=0&&l-u>0)return a=l/(l-u),e.copy(n).addScaledVector(Ss,a);tl.subVectors(t,r);const d=Ss.dot(tl),g=ys.dot(tl);if(g>=0&&d<=g)return e.copy(r);const m=d*c-l*g;if(m<=0&&c>=0&&g<=0)return o=c/(c-g),e.copy(n).addScaledVector(ys,o);const f=u*g-d*p;if(f<=0&&p-u>=0&&d-g>=0)return ah.subVectors(r,i),o=(p-u)/(p-u+(d-g)),e.copy(i).addScaledVector(ah,o);const _=1/(f+m+h);return a=m*_,o=h*_,e.copy(n).addScaledVector(Ss,a).addScaledVector(ys,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class yi{constructor(t=new I(1/0,1/0,1/0),e=new I(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Gn.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Gn.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Gn.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0&&t.isBatchedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Gn):Gn.fromBufferAttribute(r,a),Gn.applyMatrix4(t.matrixWorld),this.expandByPoint(Gn);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),ma.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),ma.copy(n.boundingBox)),ma.applyMatrix4(t.matrixWorld),this.union(ma)}const i=t.children;for(let r=0,a=i.length;r<a;r++)this.expandByObject(i[r],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Gn),Gn.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(fr),_a.subVectors(this.max,fr),bs.subVectors(t.a,fr),Es.subVectors(t.b,fr),Ts.subVectors(t.c,fr),Di.subVectors(Es,bs),Li.subVectors(Ts,Es),Qi.subVectors(bs,Ts);let e=[0,-Di.z,Di.y,0,-Li.z,Li.y,0,-Qi.z,Qi.y,Di.z,0,-Di.x,Li.z,0,-Li.x,Qi.z,0,-Qi.x,-Di.y,Di.x,0,-Li.y,Li.x,0,-Qi.y,Qi.x,0];return!sl(e,bs,Es,Ts,_a)||(e=[1,0,0,0,1,0,0,0,1],!sl(e,bs,Es,Ts,_a))?!1:(ga.crossVectors(Di,Li),e=[ga.x,ga.y,ga.z],sl(e,bs,Es,Ts,_a))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Gn).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Gn).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(di[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),di[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),di[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),di[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),di[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),di[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),di[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),di[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(di),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const di=[new I,new I,new I,new I,new I,new I,new I,new I],Gn=new I,ma=new yi,bs=new I,Es=new I,Ts=new I,Di=new I,Li=new I,Qi=new I,fr=new I,_a=new I,ga=new I,ji=new I;function sl(s,t,e,n,i){for(let r=0,a=s.length-3;r<=a;r+=3){ji.fromArray(s,r);const o=i.x*Math.abs(ji.x)+i.y*Math.abs(ji.y)+i.z*Math.abs(ji.z),l=t.dot(ji),c=e.dot(ji),u=n.dot(ji);if(Math.max(-Math.max(l,c,u),Math.min(l,c,u))>o)return!1}return!0}const Be=new I,xa=new rt;let t_=0;class Gi extends Zi{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:t_++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Mm,this.updateRanges=[],this.gpuType=Wn,this.version=0,this._normalizationScale=t!==void 0?jc(t):void 0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this._normalizationScale=t._normalizationScale,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)xa.fromBufferAttribute(this,e),xa.applyMatrix3(t),this.setXY(e,xa.x,xa.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyMatrix3(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyMatrix4(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.applyNormalMatrix(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Be.fromBufferAttribute(this,e),Be.transformDirection(t),this.setXYZ(e,Be.x,Be.y,Be.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=this._denormalize(n)),n}setComponent(t,e,n){return this.normalized&&(n=this._normalize(n)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=this._denormalize(e)),e}setX(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=this._denormalize(e)),e}setY(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=this._denormalize(e)),e}setZ(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=this._denormalize(e)),e}setW(t,e){return this.normalized&&(e=this._normalize(e)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),i=this._normalize(i)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,r){return t*=this.itemSize,this.normalized&&(e=this._normalize(e),n=this._normalize(n),i=this._normalize(i),r=this._normalize(r)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return t.name=this.name,t.usage=this.usage,t.gpuType=this.gpuType,t}dispose(){this.dispatchEvent({type:"dispose"})}_denormalize(t){const e=this._normalizationScale;return e!==void 0?Math.max(t/e,-1):$f(t,this.array)}_normalize(t){const e=this._normalizationScale;return e!==void 0?Math.round(t*e):Jf(t,this.array)}}class td extends Gi{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class ed extends Gi{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class Se extends Gi{constructor(t,e,n){super(new Float32Array(t),e,n)}}const e_=new yi,dr=new I,rl=new I;class er{constructor(t=new I,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):e_.setFromPoints(t).getCenter(n);let i=0;for(let r=0,a=t.length;r<a;r++)i=Math.max(i,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;dr.subVectors(t,this.center);const e=dr.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(dr,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(rl.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(dr.copy(t.center).add(rl)),this.expandByPoint(dr.copy(t.center).sub(rl))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let n_=0;const Ln=new ae,al=new He,ws=new I,Sn=new yi,pr=new yi,qe=new I;class Ye extends Zi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:n_++}),this.uuid=ms(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={},this._transformed=!1}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(Sm(t)?ed:td)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Wt().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this._transformed=!0,this}applyQuaternion(t){return Ln.makeRotationFromQuaternion(t),this.applyMatrix4(Ln),this}rotateX(t){return Ln.makeRotationX(t),this.applyMatrix4(Ln),this}rotateY(t){return Ln.makeRotationY(t),this.applyMatrix4(Ln),this}rotateZ(t){return Ln.makeRotationZ(t),this.applyMatrix4(Ln),this}translate(t,e,n){return Ln.makeTranslation(t,e,n),this.applyMatrix4(Ln),this}scale(t,e,n){return Ln.makeScale(t,e,n),this.applyMatrix4(Ln),this}lookAt(t){return al.lookAt(t),al.updateMatrix(),this.applyMatrix4(al.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ws).negate(),this.translate(ws.x,ws.y,ws.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,r=t.length;i<r;i++){const a=t[i];n.push(a.x,a.y,a.z||0)}this.setAttribute("position",new Se(n,3))}else{const n=Math.min(t.length,e.count);for(let i=0;i<n;i++){const r=t[i];e.setXYZ(i,r.x,r.y,r.z||0)}t.length>e.count&&kt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new yi);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){he("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new I(-1/0,-1/0,-1/0),new I(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const r=e[n];Sn.setFromBufferAttribute(r),this.morphTargetsRelative?(qe.addVectors(this.boundingBox.min,Sn.min),this.boundingBox.expandByPoint(qe),qe.addVectors(this.boundingBox.max,Sn.max),this.boundingBox.expandByPoint(qe)):(this.boundingBox.expandByPoint(Sn.min),this.boundingBox.expandByPoint(Sn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&he('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new er);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){he("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new I,1/0);return}if(t){const n=this.boundingSphere.center;if(Sn.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){const o=e[r];pr.setFromBufferAttribute(o),this.morphTargetsRelative?(qe.addVectors(Sn.min,pr.min),Sn.expandByPoint(qe),qe.addVectors(Sn.max,pr.max),Sn.expandByPoint(qe)):(Sn.expandByPoint(pr.min),Sn.expandByPoint(pr.max))}Sn.getCenter(n);let i=0;for(let r=0,a=t.count;r<a;r++)qe.fromBufferAttribute(t,r),i=Math.max(i,n.distanceToSquared(qe));if(e)for(let r=0,a=e.length;r<a;r++){const o=e[r],l=this.morphTargetsRelative;for(let c=0,u=o.count;c<u;c++)qe.fromBufferAttribute(o,c),l&&(ws.fromBufferAttribute(t,c),qe.add(ws)),i=Math.max(i,n.distanceToSquared(qe))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&he('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){he("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,r=e.uv;let a=this.getAttribute("tangent");(a===void 0||a.count!==n.count)&&(a=new Gi(new Float32Array(4*n.count),4),this.setAttribute("tangent",a));const o=[],l=[],c=new Uint8Array(n.count);for(let A=0;A<n.count;A++)o[A]=new I,l[A]=new I;const u=new I,p=new I,h=new I,d=new rt,g=new rt,m=new rt,f=new I,_=new I;function v(A,R,C){c[A]=c[R]=c[C]=1,u.fromBufferAttribute(n,A),p.fromBufferAttribute(n,R),h.fromBufferAttribute(n,C),d.fromBufferAttribute(r,A),g.fromBufferAttribute(r,R),m.fromBufferAttribute(r,C),p.sub(u),h.sub(u),g.sub(d),m.sub(d);const L=1/(g.x*m.y-m.x*g.y);isFinite(L)&&(f.copy(p).multiplyScalar(m.y).addScaledVector(h,-g.y).multiplyScalar(L),_.copy(h).multiplyScalar(g.x).addScaledVector(p,-m.x).multiplyScalar(L),o[A].add(f),o[R].add(f),o[C].add(f),l[A].add(_),l[R].add(_),l[C].add(_))}let S=this.groups;S.length===0&&(S=[{start:0,count:t.count}]);for(let A=0,R=S.length;A<R;++A){const C=S[A],L=C.start,N=C.count;for(let D=L,B=L+N;D<B;D+=3)v(t.getX(D+0),t.getX(D+1),t.getX(D+2))}const M=new I,E=new I,b=new I,x=new I;function y(A){b.fromBufferAttribute(i,A),x.copy(b);const R=o[A];M.copy(R),M.sub(b.multiplyScalar(b.dot(R))).normalize(),E.crossVectors(x,R);const L=E.dot(l[A])<0?-1:1;a.setXYZW(A,M.x,M.y,M.z,L)}for(let A=0,R=n.count;A<R;++A)c[A]&&y(A);this._transformed=!0}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0||n.count!==e.count)n=new Gi(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let h=0,d=n.count;h<d;h++)n.setXYZ(h,0,0,0);const i=new I,r=new I,a=new I,o=new I,l=new I,c=new I,u=new I,p=new I;if(t)for(let h=0,d=t.count;h<d;h+=3){const g=t.getX(h+0),m=t.getX(h+1),f=t.getX(h+2);i.fromBufferAttribute(e,g),r.fromBufferAttribute(e,m),a.fromBufferAttribute(e,f),u.subVectors(a,r),p.subVectors(i,r),u.cross(p),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,m),c.fromBufferAttribute(n,f),o.add(u),l.add(u),c.add(u),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(m,l.x,l.y,l.z),n.setXYZ(f,c.x,c.y,c.z)}else for(let h=0,d=e.count;h<d;h+=3)i.fromBufferAttribute(e,h+0),r.fromBufferAttribute(e,h+1),a.fromBufferAttribute(e,h+2),u.subVectors(a,r),p.subVectors(i,r),u.cross(p),n.setXYZ(h+0,u.x,u.y,u.z),n.setXYZ(h+1,u.x,u.y,u.z),n.setXYZ(h+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)qe.fromBufferAttribute(t,e),qe.normalize(),t.setXYZ(e,qe.x,qe.y,qe.z)}toNonIndexed(){function t(o,l){const c=o.array,u=o.itemSize,p=o.normalized,h=new c.constructor(l.length*u);let d=0,g=0;for(let m=0,f=l.length;m<f;m++){o.isInterleavedBufferAttribute?d=l[m]*o.data.stride+o.offset:d=l[m]*u;for(let _=0;_<u;_++)h[g++]=c[d++]}return new Gi(h,u,p)}if(this.index===null)return kt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ye,n=this.index.array,i=this.attributes;for(const o in i){const l=i[o],c=t(l,n);e.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let u=0,p=c.length;u<p;u++){const h=c[u],d=t(h,n);l.push(d)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;const a=this.groups;for(let o=0,l=a.length;o<l;o++){const c=a[o];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.parameters!==void 0&&this._transformed===!0?"BufferGeometry":this.type,t.name=this.name,Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0&&this._transformed!==!0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],u=[];for(let p=0,h=c.length;p<h;p++){const d=c[p];u.push(d.toJSON(t.data))}u.length>0&&(i[l]=u,r=!0)}r&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));const o=this.boundingSphere;return o!==null&&(t.data.boundingSphere=o.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const i=t.attributes;for(const c in i){const u=i[c];this.setAttribute(c,u.clone(e))}const r=t.morphAttributes;for(const c in r){const u=[],p=r[c];for(let h=0,d=p.length;h<d;h++)u.push(p[h].clone(e));this.morphAttributes[c]=u}this.morphTargetsRelative=t.morphTargetsRelative;const a=t.groups;for(let c=0,u=a.length;c<u;c++){const p=a[c];this.addGroup(p.start,p.count,p.materialIndex)}const o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this._transformed=t._transformed,this}dispose(){this.dispatchEvent({type:"dispose"})}}const ol=new I,i_=new I,s_=new Wt;class _i{constructor(t=new I(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=ol.subVectors(n,e).cross(i_.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const i=t.delta(ol),r=this.normal.dot(i);if(r===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const a=-(t.start.dot(this.normal)+this.constant)/r;return n===!0&&(a<0||a>1)?null:e.copy(t.start).addScaledVector(i,a)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||s_.getNormalMatrix(t),i=this.coplanarPoint(ol).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}toJSON(){return{normal:this.normal.toArray(),constant:this.constant}}fromJSON(t){return this.normal.fromArray(t.normal),this.constant=t.constant,this}}let r_=0;class nr extends Zi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:r_++}),this.uuid=ms(),this.name="",this.type="Material",this.blending=wr,this.side=fs,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Uf,this.blendDst=Of,this.blendEquation=Ls,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xt(0,0,0),this.blendAlpha=0,this.depthFunc=Nr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=pm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Vo,this.stencilZFail=Vo,this.stencilZPass=Vo,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){kt(`Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){kt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector2&&n&&n.isVector2||i&&i.isEuler&&n&&n.isEuler||i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,n.blending=this.blending,n.side=this.side,n.shadowSide=this.shadowSide,n.vertexColors=this.vertexColors,n.opacity=this.opacity,n.transparent=this.transparent,n.blendSrc=this.blendSrc,n.blendDst=this.blendDst,n.blendEquation=this.blendEquation,n.blendSrcAlpha=this.blendSrcAlpha,n.blendDstAlpha=this.blendDstAlpha,n.blendEquationAlpha=this.blendEquationAlpha,n.blendColor=this.blendColor.getHex(),n.blendAlpha=this.blendAlpha,n.depthFunc=this.depthFunc,n.depthTest=this.depthTest,n.depthWrite=this.depthWrite,n.colorWrite=this.colorWrite,n.clipIntersection=this.clipIntersection,n.clipShadows=this.clipShadows,n.stencilWriteMask=this.stencilWriteMask,n.stencilFunc=this.stencilFunc,n.stencilRef=this.stencilRef,n.stencilFuncMask=this.stencilFuncMask,n.stencilFail=this.stencilFail,n.stencilZFail=this.stencilZFail,n.stencilZPass=this.stencilZPass,n.stencilWrite=this.stencilWrite,n.polygonOffset=this.polygonOffset,n.polygonOffsetFactor=this.polygonOffsetFactor,n.polygonOffsetUnits=this.polygonOffsetUnits,n.dithering=this.dithering,n.alphaTest=this.alphaTest,n.alphaHash=this.alphaHash,n.alphaToCoverage=this.alphaToCoverage,n.premultipliedAlpha=this.premultipliedAlpha,n.forceSinglePass=this.forceSinglePass,n.allowOverride=this.allowOverride,n.visible=this.visible,n.toneMapped=this.toneMapped,n.name=this.name,this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.diffuseRoughness!==void 0&&(n.diffuseRoughness=this.diffuseRoughness),this.diffuseRoughnessMap&&this.diffuseRoughnessMap.isTexture&&(n.diffuseRoughnessMap=this.diffuseRoughnessMap.toJSON(t).uuid),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.retroreflectivity!==void 0&&(n.retroreflectivity=this.retroreflectivity),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessMinimum!==void 0&&(n.iridescenceThicknessMinimum=this.iridescenceThicknessMinimum),this.iridescenceThicknessMaximum!==void 0&&(n.iridescenceThicknessMaximum=this.iridescenceThicknessMaximum),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),Array.isArray(this.clippingPlanes)&&this.clippingPlanes.length>0&&(n.clippingPlanes=this.clippingPlanes.map(r=>r.toJSON())),this.rotation!==void 0&&(n.rotation=this.rotation),this.depthPacking!==void 0&&(n.depthPacking=this.depthPacking),this.linewidth!==void 0&&(n.linewidth=this.linewidth),this.linecap!==void 0&&(n.linecap=this.linecap),this.linejoin!==void 0&&(n.linejoin=this.linejoin),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.wireframe!==void 0&&(n.wireframe=this.wireframe),this.wireframeLinewidth!==void 0&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!==void 0&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!==void 0&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading!==void 0&&(n.flatShading=this.flatShading),this.fog!==void 0&&(n.fog=this.fog),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){const a=[];for(const o in r){const l=r[o];delete l.metadata,a.push(l)}return a}if(e){const r=i(t.textures),a=i(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}fromJSON(t,e){if(t.uuid!==void 0&&(this.uuid=t.uuid),t.name!==void 0&&(this.name=t.name),t.color!==void 0&&this.color!==void 0&&this.color.setHex(t.color),t.roughness!==void 0&&(this.roughness=t.roughness),t.metalness!==void 0&&(this.metalness=t.metalness),t.sheen!==void 0&&(this.sheen=t.sheen),t.sheenColor!==void 0&&(this.sheenColor=new Xt().setHex(t.sheenColor)),t.sheenRoughness!==void 0&&(this.sheenRoughness=t.sheenRoughness),t.emissive!==void 0&&this.emissive!==void 0&&this.emissive.setHex(t.emissive),t.specular!==void 0&&this.specular!==void 0&&this.specular.setHex(t.specular),t.specularIntensity!==void 0&&(this.specularIntensity=t.specularIntensity),t.specularColor!==void 0&&this.specularColor!==void 0&&this.specularColor.setHex(t.specularColor),t.shininess!==void 0&&(this.shininess=t.shininess),t.clearcoat!==void 0&&(this.clearcoat=t.clearcoat),t.clearcoatRoughness!==void 0&&(this.clearcoatRoughness=t.clearcoatRoughness),t.diffuseRoughness!==void 0&&(this.diffuseRoughness=t.diffuseRoughness),t.dispersion!==void 0&&(this.dispersion=t.dispersion),t.retroreflectivity!==void 0&&(this.retroreflectivity=t.retroreflectivity),t.iridescence!==void 0&&(this.iridescence=t.iridescence),t.iridescenceIOR!==void 0&&(this.iridescenceIOR=t.iridescenceIOR),t.iridescenceThicknessMinimum!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessMinimum),t.iridescenceThicknessMaximum!==void 0&&(this.iridescenceThicknessMaximum=t.iridescenceThicknessMaximum),t.iridescenceThicknessRange!==void 0&&(this.iridescenceThicknessMinimum=t.iridescenceThicknessRange[0],this.iridescenceThicknessMaximum=t.iridescenceThicknessRange[1]),t.transmission!==void 0&&(this.transmission=t.transmission),t.thickness!==void 0&&(this.thickness=t.thickness),t.attenuationDistance!==void 0&&(this.attenuationDistance=t.attenuationDistance),t.attenuationColor!==void 0&&this.attenuationColor!==void 0&&this.attenuationColor.setHex(t.attenuationColor),t.anisotropy!==void 0&&(this.anisotropy=t.anisotropy),t.anisotropyRotation!==void 0&&(this.anisotropyRotation=t.anisotropyRotation),t.fog!==void 0&&(this.fog=t.fog),t.flatShading!==void 0&&(this.flatShading=t.flatShading),t.blending!==void 0&&(this.blending=t.blending),t.combine!==void 0&&(this.combine=t.combine),t.side!==void 0&&(this.side=t.side),t.shadowSide!==void 0&&(this.shadowSide=t.shadowSide),t.opacity!==void 0&&(this.opacity=t.opacity),t.transparent!==void 0&&(this.transparent=t.transparent),t.alphaTest!==void 0&&(this.alphaTest=t.alphaTest),t.alphaHash!==void 0&&(this.alphaHash=t.alphaHash),t.depthFunc!==void 0&&(this.depthFunc=t.depthFunc),t.depthTest!==void 0&&(this.depthTest=t.depthTest),t.depthWrite!==void 0&&(this.depthWrite=t.depthWrite),t.colorWrite!==void 0&&(this.colorWrite=t.colorWrite),t.clippingPlanes!==void 0&&(this.clippingPlanes=t.clippingPlanes.map(n=>new _i().fromJSON(n))),t.clipIntersection!==void 0&&(this.clipIntersection=t.clipIntersection),t.clipShadows!==void 0&&(this.clipShadows=t.clipShadows),t.depthPacking!==void 0&&(this.depthPacking=t.depthPacking),t.blendSrc!==void 0&&(this.blendSrc=t.blendSrc),t.blendDst!==void 0&&(this.blendDst=t.blendDst),t.blendEquation!==void 0&&(this.blendEquation=t.blendEquation),t.blendSrcAlpha!==void 0&&(this.blendSrcAlpha=t.blendSrcAlpha),t.blendDstAlpha!==void 0&&(this.blendDstAlpha=t.blendDstAlpha),t.blendEquationAlpha!==void 0&&(this.blendEquationAlpha=t.blendEquationAlpha),t.blendColor!==void 0&&this.blendColor!==void 0&&this.blendColor.setHex(t.blendColor),t.blendAlpha!==void 0&&(this.blendAlpha=t.blendAlpha),t.stencilWriteMask!==void 0&&(this.stencilWriteMask=t.stencilWriteMask),t.stencilFunc!==void 0&&(this.stencilFunc=t.stencilFunc),t.stencilRef!==void 0&&(this.stencilRef=t.stencilRef),t.stencilFuncMask!==void 0&&(this.stencilFuncMask=t.stencilFuncMask),t.stencilFail!==void 0&&(this.stencilFail=t.stencilFail),t.stencilZFail!==void 0&&(this.stencilZFail=t.stencilZFail),t.stencilZPass!==void 0&&(this.stencilZPass=t.stencilZPass),t.stencilWrite!==void 0&&(this.stencilWrite=t.stencilWrite),t.wireframe!==void 0&&(this.wireframe=t.wireframe),t.wireframeLinewidth!==void 0&&(this.wireframeLinewidth=t.wireframeLinewidth),t.wireframeLinecap!==void 0&&(this.wireframeLinecap=t.wireframeLinecap),t.wireframeLinejoin!==void 0&&(this.wireframeLinejoin=t.wireframeLinejoin),t.rotation!==void 0&&(this.rotation=t.rotation),t.linewidth!==void 0&&(this.linewidth=t.linewidth),t.linecap!==void 0&&(this.linecap=t.linecap),t.linejoin!==void 0&&(this.linejoin=t.linejoin),t.dashSize!==void 0&&(this.dashSize=t.dashSize),t.gapSize!==void 0&&(this.gapSize=t.gapSize),t.scale!==void 0&&(this.scale=t.scale),t.polygonOffset!==void 0&&(this.polygonOffset=t.polygonOffset),t.polygonOffsetFactor!==void 0&&(this.polygonOffsetFactor=t.polygonOffsetFactor),t.polygonOffsetUnits!==void 0&&(this.polygonOffsetUnits=t.polygonOffsetUnits),t.dithering!==void 0&&(this.dithering=t.dithering),t.alphaToCoverage!==void 0&&(this.alphaToCoverage=t.alphaToCoverage),t.premultipliedAlpha!==void 0&&(this.premultipliedAlpha=t.premultipliedAlpha),t.forceSinglePass!==void 0&&(this.forceSinglePass=t.forceSinglePass),t.allowOverride!==void 0&&(this.allowOverride=t.allowOverride),t.visible!==void 0&&(this.visible=t.visible),t.toneMapped!==void 0&&(this.toneMapped=t.toneMapped),t.userData!==void 0&&(this.userData=t.userData),t.vertexColors!==void 0&&(typeof t.vertexColors=="number"?this.vertexColors=t.vertexColors>0:this.vertexColors=t.vertexColors),t.size!==void 0&&(this.size=t.size),t.sizeAttenuation!==void 0&&(this.sizeAttenuation=t.sizeAttenuation),t.map!==void 0&&(this.map=e[t.map]||null),t.matcap!==void 0&&(this.matcap=e[t.matcap]||null),t.alphaMap!==void 0&&(this.alphaMap=e[t.alphaMap]||null),t.bumpMap!==void 0&&(this.bumpMap=e[t.bumpMap]||null),t.bumpScale!==void 0&&(this.bumpScale=t.bumpScale),t.normalMap!==void 0&&(this.normalMap=e[t.normalMap]||null),t.normalMapType!==void 0&&(this.normalMapType=t.normalMapType),t.normalScale!==void 0){let n=t.normalScale;Array.isArray(n)===!1&&(n=[n,n]),this.normalScale=new rt().fromArray(n)}return t.displacementMap!==void 0&&(this.displacementMap=e[t.displacementMap]||null),t.displacementScale!==void 0&&(this.displacementScale=t.displacementScale),t.displacementBias!==void 0&&(this.displacementBias=t.displacementBias),t.roughnessMap!==void 0&&(this.roughnessMap=e[t.roughnessMap]||null),t.metalnessMap!==void 0&&(this.metalnessMap=e[t.metalnessMap]||null),t.emissiveMap!==void 0&&(this.emissiveMap=e[t.emissiveMap]||null),t.emissiveIntensity!==void 0&&(this.emissiveIntensity=t.emissiveIntensity),t.specularMap!==void 0&&(this.specularMap=e[t.specularMap]||null),t.specularIntensityMap!==void 0&&(this.specularIntensityMap=e[t.specularIntensityMap]||null),t.specularColorMap!==void 0&&(this.specularColorMap=e[t.specularColorMap]||null),t.envMap!==void 0&&(this.envMap=e[t.envMap]||null),t.envMapRotation!==void 0&&this.envMapRotation.fromArray(t.envMapRotation),t.envMapIntensity!==void 0&&(this.envMapIntensity=t.envMapIntensity),t.reflectivity!==void 0&&(this.reflectivity=t.reflectivity),t.refractionRatio!==void 0&&(this.refractionRatio=t.refractionRatio),t.lightMap!==void 0&&(this.lightMap=e[t.lightMap]||null),t.lightMapIntensity!==void 0&&(this.lightMapIntensity=t.lightMapIntensity),t.aoMap!==void 0&&(this.aoMap=e[t.aoMap]||null),t.aoMapIntensity!==void 0&&(this.aoMapIntensity=t.aoMapIntensity),t.gradientMap!==void 0&&(this.gradientMap=e[t.gradientMap]||null),t.clearcoatMap!==void 0&&(this.clearcoatMap=e[t.clearcoatMap]||null),t.clearcoatRoughnessMap!==void 0&&(this.clearcoatRoughnessMap=e[t.clearcoatRoughnessMap]||null),t.clearcoatNormalMap!==void 0&&(this.clearcoatNormalMap=e[t.clearcoatNormalMap]||null),t.clearcoatNormalScale!==void 0&&(this.clearcoatNormalScale=new rt().fromArray(t.clearcoatNormalScale)),t.diffuseRoughnessMap!==void 0&&(this.diffuseRoughnessMap=e[t.diffuseRoughnessMap]||null),t.iridescenceMap!==void 0&&(this.iridescenceMap=e[t.iridescenceMap]||null),t.iridescenceThicknessMap!==void 0&&(this.iridescenceThicknessMap=e[t.iridescenceThicknessMap]||null),t.transmissionMap!==void 0&&(this.transmissionMap=e[t.transmissionMap]||null),t.thicknessMap!==void 0&&(this.thicknessMap=e[t.thicknessMap]||null),t.anisotropyMap!==void 0&&(this.anisotropyMap=e[t.anisotropyMap]||null),t.sheenColorMap!==void 0&&(this.sheenColorMap=e[t.sheenColorMap]||null),t.sheenRoughnessMap!==void 0&&(this.sheenRoughnessMap=e[t.sheenRoughnessMap]||null),this}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const pi=new I,ll=new I,va=new I,Ma=new I;class Ao{constructor(t=new I,e=new I(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,pi)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=pi.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(pi.copy(this.origin).addScaledVector(this.direction,e),pi.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){ll.copy(t).add(e).multiplyScalar(.5),va.copy(e).sub(t).normalize(),Ma.copy(this.origin).sub(ll);const r=t.distanceTo(e)*.5,a=-this.direction.dot(va),o=Ma.dot(this.direction),l=-Ma.dot(va),c=Ma.lengthSq(),u=Math.abs(1-a*a);let p,h,d,g;if(u>0)if(p=a*l-o,h=a*o-l,g=r*u,p>=0)if(h>=-g)if(h<=g){const m=1/u;p*=m,h*=m,d=p*(p+a*h+2*o)+h*(a*p+h+2*l)+c}else h=r,p=Math.max(0,-(a*h+o)),d=-p*p+h*(h+2*l)+c;else h=-r,p=Math.max(0,-(a*h+o)),d=-p*p+h*(h+2*l)+c;else h<=-g?(p=Math.max(0,-(-a*r+o)),h=p>0?-r:Math.min(Math.max(-r,-l),r),d=-p*p+h*(h+2*l)+c):h<=g?(p=0,h=Math.min(Math.max(-r,-l),r),d=h*(h+2*l)+c):(p=Math.max(0,-(a*r+o)),h=p>0?r:Math.min(Math.max(-r,-l),r),d=-p*p+h*(h+2*l)+c);else h=a>0?-r:r,p=Math.max(0,-(a*h+o)),d=-p*p+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,p),i&&i.copy(ll).addScaledVector(va,h),d}intersectSphere(t,e){if(t.radius<0)return null;pi.subVectors(t.center,this.origin);const n=pi.dot(this.direction),i=pi.dot(pi)-n*n,r=t.radius*t.radius;if(i>r)return null;const a=Math.sqrt(r-i),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,r,a,o,l;const c=1/this.direction.x,u=1/this.direction.y,p=1/this.direction.z,h=this.origin;return c>=0?(n=(t.min.x-h.x)*c,i=(t.max.x-h.x)*c):(n=(t.max.x-h.x)*c,i=(t.min.x-h.x)*c),u>=0?(r=(t.min.y-h.y)*u,a=(t.max.y-h.y)*u):(r=(t.max.y-h.y)*u,a=(t.min.y-h.y)*u),n>a||r>i||((r>n||isNaN(n))&&(n=r),(a<i||isNaN(i))&&(i=a),p>=0?(o=(t.min.z-h.z)*p,l=(t.max.z-h.z)*p):(o=(t.max.z-h.z)*p,l=(t.min.z-h.z)*p),n>l||o>i)||((o>n||n!==n)&&(n=o),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,pi)!==null}intersectTriangle(t,e,n,i,r){const a=this.origin,o=this.direction,l=o.x,c=o.y,u=o.z,p=t.x-a.x,h=t.y-a.y,d=t.z-a.z,g=e.x-a.x,m=e.y-a.y,f=e.z-a.z,_=n.x-a.x,v=n.y-a.y,S=n.z-a.z,M=Math.abs(l),E=Math.abs(c),b=Math.abs(u);let x,y,A,R,C,L,N,D,B,z,U,X;if(M>=E&&M>=b?(A=l,L=p,B=g,X=_,l>=0?(x=c,y=u,R=h,C=d,N=m,D=f,z=v,U=S):(x=u,y=c,R=d,C=h,N=f,D=m,z=S,U=v)):E>=b?(A=c,L=h,B=m,X=v,c>=0?(x=u,y=l,R=d,C=p,N=f,D=g,z=S,U=_):(x=l,y=u,R=p,C=d,N=g,D=f,z=_,U=S)):(A=u,L=d,B=f,X=S,u>=0?(x=l,y=c,R=p,C=h,N=g,D=m,z=_,U=v):(x=c,y=l,R=h,C=p,N=m,D=g,z=v,U=_)),A===0)return null;const G=x/A,K=y/A,Z=1/A,at=R-G*L,Rt=C-K*L,Y=N-G*B,it=D-K*B,St=z-G*X,Ct=U-K*X,gt=St*it-Ct*Y,It=at*Ct-Rt*St,ce=Y*Rt-it*at;if(i){if(gt<0||It<0||ce<0)return null}else if((gt<0||It<0||ce<0)&&(gt>0||It>0||ce>0))return null;const Ft=gt+It+ce;if(Ft===0)return null;const Yt=Z*(gt*L+It*B+ce*X);return(Ft>0?Yt<0:Yt>0)?null:this.at(Yt/Ft,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class Xs extends nr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.combine=Ff,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const oh=new ae,ts=new Ao,Sa=new er,lh=new I,ya=new I,ba=new I,Ea=new I,cl=new I,Ta=new I,ch=new I,wa=new I;class Cn extends He{constructor(t=new Ye,e=new Xs){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const o=this.morphTargetInfluences;if(r&&o){Ta.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const u=o[l],p=r[l];u!==0&&(cl.fromBufferAttribute(p,t),a?Ta.addScaledVector(cl,u):Ta.addScaledVector(cl.sub(e),u))}e.add(Ta)}return e}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Sa.copy(n.boundingSphere),Sa.applyMatrix4(r),ts.copy(t.ray).recast(t.near),!(Sa.containsPoint(ts.origin)===!1&&(ts.intersectSphere(Sa,lh)===null||ts.origin.distanceToSquared(lh)>(t.far-t.near)**2))&&(oh.copy(r).invert(),ts.copy(t.ray).applyMatrix4(oh),!(n.boundingBox!==null&&ts.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,ts)))}_computeIntersections(t,e,n){let i;const r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,u=r.attributes.uv1,p=r.attributes.normal,h=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let g=0,m=h.length;g<m;g++){const f=h[g],_=a[f.materialIndex],v=Math.max(f.start,d.start),S=Math.min(o.count,Math.min(f.start+f.count,d.start+d.count));for(let M=v,E=S;M<E;M+=3){const b=o.getX(M),x=o.getX(M+1),y=o.getX(M+2);i=Aa(this,_,t,n,c,u,p,b,x,y),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=f.materialIndex,e.push(i))}}else{const g=Math.max(0,d.start),m=Math.min(o.count,d.start+d.count);for(let f=g,_=m;f<_;f+=3){const v=o.getX(f),S=o.getX(f+1),M=o.getX(f+2);i=Aa(this,a,t,n,c,u,p,v,S,M),i&&(i.faceIndex=Math.floor(f/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(a))for(let g=0,m=h.length;g<m;g++){const f=h[g],_=a[f.materialIndex],v=Math.max(f.start,d.start),S=Math.min(l.count,Math.min(f.start+f.count,d.start+d.count));for(let M=v,E=S;M<E;M+=3){const b=M,x=M+1,y=M+2;i=Aa(this,_,t,n,c,u,p,b,x,y),i&&(i.faceIndex=Math.floor(M/3),i.face.materialIndex=f.materialIndex,e.push(i))}}else{const g=Math.max(0,d.start),m=Math.min(l.count,d.start+d.count);for(let f=g,_=m;f<_;f+=3){const v=f,S=f+1,M=f+2;i=Aa(this,a,t,n,c,u,p,v,S,M),i&&(i.faceIndex=Math.floor(f/3),e.push(i))}}}}function a_(s,t,e,n,i,r,a,o){let l;if(t.side===fn?l=n.intersectTriangle(a,r,i,!0,o):l=n.intersectTriangle(i,r,a,t.side===fs,o),l===null)return null;wa.copy(o),wa.applyMatrix4(s.matrixWorld);const c=e.ray.origin.distanceTo(wa);return c<e.near||c>e.far?null:{distance:c,point:wa.clone(),object:s}}function Aa(s,t,e,n,i,r,a,o,l,c){s.getVertexPosition(o,ya),s.getVertexPosition(l,ba),s.getVertexPosition(c,Ea);const u=a_(s,t,e,n,ya,ba,Ea,ch);if(u){const p=new I;Un.getBarycoord(ch,ya,ba,Ea,p),i&&(u.uv=Un.getInterpolatedAttribute(i,o,l,c,p,new rt)),r&&(u.uv1=Un.getInterpolatedAttribute(r,o,l,c,p,new rt)),a&&(u.normal=Un.getInterpolatedAttribute(a,o,l,c,p,new I),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));const h={a:o,b:l,c,normal:new I,materialIndex:0};Un.getNormal(ya,ba,Ea,h.normal),u.face=h,u.barycoord=p}return u}class nu extends ln{constructor(t=null,e=1,n=1,i,r,a,o,l,c=Qe,u=Qe,p,h){super(null,a,o,l,c,u,i,r,p,h),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class uh extends Gi{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const As=new ae,hh=new ae,Ra=[],fh=new yi,o_=new ae,mr=new Cn,_r=new er;class ul extends Cn{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new uh(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,o_)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new yi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,As),fh.copy(t.boundingBox).applyMatrix4(As),this.boundingBox.union(fh)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new er),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,As),_r.copy(t.boundingSphere).applyMatrix4(As),this.boundingSphere.union(_r)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),this.morphTexture=t.morphTexture!==null?t.morphTexture.clone():null,this.instanceColor=t.instanceColor!==null?t.instanceColor.clone():null,this.count=t.count,this.boundingBox=t.boundingBox!==null?t.boundingBox.clone():null,this.boundingSphere=t.boundingSphere!==null?t.boundingSphere.clone():null,this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,a=t*r+1;for(let o=0;o<n.length;o++)n[o]=i[a+o]}raycast(t,e){const n=this.matrixWorld,i=this.count;if(mr.geometry=this.geometry,mr.material=this.material,mr.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),_r.copy(this.boundingSphere),_r.applyMatrix4(n),t.ray.intersectsSphere(_r)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,As),hh.multiplyMatrices(n,As),mr.matrixWorld=hh,mr.raycast(t,Ra);for(let a=0,o=Ra.length;a<o;a++){const l=Ra[a];l.instanceId=r,l.object=this,e.push(l)}Ra.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new uh(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new nu(new Float32Array(i*this.count),i,this.count,Zc,Wn));const r=this.morphTexture.source.data.data;let a=0;for(let c=0;c<n.length;c++)a+=n[c];const o=this.geometry.morphTargetsRelative?1:1-a,l=i*t;return r[l]=o,r.set(n,l+1),this}updateMorphTargets(){}dispose(){super.dispose(),this.instanceMatrix.dispose(),this.instanceColor!==null&&this.instanceColor.dispose(),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const es=new er,l_=new rt(.5,.5),Ca=new I;class Br{constructor(t=new _i,e=new _i,n=new _i,i=new _i,r=new _i,a=new _i){this.planes=[t,e,n,i,r,a]}set(t,e,n,i,r,a){const o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(i),o[4].copy(r),o[5].copy(a),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Xn,n=!1){const i=this.planes,r=t.elements,a=r[0],o=r[1],l=r[2],c=r[3],u=r[4],p=r[5],h=r[6],d=r[7],g=r[8],m=r[9],f=r[10],_=r[11],v=r[12],S=r[13],M=r[14],E=r[15];if(i[0].setComponents(c-a,d-u,_-g,E-v).normalize(),i[1].setComponents(c+a,d+u,_+g,E+v).normalize(),i[2].setComponents(c+o,d+p,_+m,E+S).normalize(),i[3].setComponents(c-o,d-p,_-m,E-S).normalize(),n)i[4].setComponents(l,h,f,M).normalize(),i[5].setComponents(c-l,d-h,_-f,E-M).normalize();else if(i[4].setComponents(c-l,d-h,_-f,E-M).normalize(),e===Xn)i[5].setComponents(c+l,d+h,_+f,E+M).normalize();else if(e===Or)i[5].setComponents(l,h,f,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),es.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),es.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(es)}intersectsSprite(t){es.center.set(0,0,0);const e=l_.distanceTo(t.center);return es.radius=.7071067811865476+e,es.applyMatrix4(t.matrixWorld),this.intersectsSphere(es)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(Ca.x=i.normal.x>0?t.max.x:t.min.x,Ca.y=i.normal.y>0?t.max.y:t.min.y,Ca.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(Ca)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}const dh=new ae;class iu{constructor(){this.coordinateSystem=Xn,this._frustums=[],this._count=0}setFromArrayCamera(t){const e=t.cameras,n=this._frustums;for(let i=0;i<e.length;i++){const r=e[i];dh.multiplyMatrices(r.projectionMatrix,r.matrixWorldInverse),n[i]===void 0&&(n[i]=new Br),n[i].setFromProjectionMatrix(dh,r.coordinateSystem,r.reversedDepth)}return this._count=e.length,this}getFrustum(t){return this._frustums[t]}intersectsObject(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsObject(t))return!0;return!1}intersectsSprite(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSprite(t))return!0;return!1}intersectsSphere(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsSphere(t))return!0;return!1}intersectsBox(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].intersectsBox(t))return!0;return!1}containsPoint(t){const e=this._frustums;for(let n=0;n<this._count;n++)if(e[n].containsPoint(t))return!0;return!1}copy(t){this.coordinateSystem=t.coordinateSystem;const e=this._frustums,n=t._frustums;for(let i=0;i<t._count;i++)e[i]===void 0&&(e[i]=new Br),e[i].copy(n[i]);return this._count=t._count,this}clone(){return new iu().copy(this)}}class zr extends nr{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new Xt(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}}const lo=new I,co=new I,ph=new ae,gr=new Ao,Pa=new er,hl=new I,mh=new I;class su extends He{constructor(t=new Ye,e=new zr){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0?this.morphTargetInfluences=t.morphTargetInfluences.slice():this.morphTargetInfluences=void 0,t.morphTargetDictionary!==void 0?this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary):this.morphTargetDictionary=void 0,this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[0];for(let i=1,r=e.count;i<r;i++)lo.fromBufferAttribute(e,i-1),co.fromBufferAttribute(e,i),n[i]=n[i-1],n[i]+=lo.distanceTo(co);t.setAttribute("lineDistance",new Se(n,1))}else kt("Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}intersectsFrustum(t){return t.intersectsObject(this)}raycast(t,e){const n=this.geometry,i=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Pa.copy(n.boundingSphere),Pa.applyMatrix4(i),Pa.radius+=r,t.ray.intersectsSphere(Pa)===!1)return;ph.copy(i).invert(),gr.copy(t.ray).applyMatrix4(ph);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=this.isLineSegments?2:1,u=n.index,h=n.attributes.position;if(u!==null){const d=Math.max(0,a.start),g=Math.min(u.count,a.start+a.count);for(let m=d,f=g-1;m<f;m+=c){const _=u.getX(m),v=u.getX(m+1),S=Da(this,t,gr,l,_,v,m);S&&e.push(S)}if(this.isLineLoop){const m=u.getX(g-1),f=u.getX(d),_=Da(this,t,gr,l,m,f,g-1);_&&e.push(_)}}else{const d=Math.max(0,a.start),g=Math.min(h.count,a.start+a.count);for(let m=d,f=g-1;m<f;m+=c){const _=Da(this,t,gr,l,m,m+1,m);_&&e.push(_)}if(this.isLineLoop){const m=Da(this,t,gr,l,g-1,d,g-1);m&&e.push(m)}}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=i.length;r<a;r++){const o=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function Da(s,t,e,n,i,r,a){const o=s.geometry.attributes.position;if(lo.fromBufferAttribute(o,i),co.fromBufferAttribute(o,r),e.distanceSqToSegment(lo,co,hl,mh)>n)return;hl.applyMatrix4(s.matrixWorld);const c=t.ray.origin.distanceTo(hl);if(!(c<t.near||c>t.far))return{distance:c,point:mh.clone().applyMatrix4(s.matrixWorld),index:a,face:null,faceIndex:null,barycoord:null,object:s}}const _h=new I,gh=new I;class nd extends su{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){const t=this.geometry;if(t.index===null){const e=t.attributes.position,n=[];for(let i=0,r=e.count;i<r;i+=2)_h.fromBufferAttribute(e,i),gh.fromBufferAttribute(e,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+_h.distanceTo(gh);t.setAttribute("lineDistance",new Se(n,1))}else kt("LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}}class id extends ln{constructor(t=[],e=Vs,n,i,r,a,o,l,c,u){super(t,e,n,i,r,a,o,l,c,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class qs extends ln{constructor(t,e,n=si,i,r,a,o=Qe,l=Qe,c,u=Wi,p=1){if(u!==Wi&&u!==Ui)throw new Error("THREE.DepthTexture: format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:t,height:e,depth:p};super(h,i,r,a,o,l,u,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new tu(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return e.compareFunction=this.compareFunction,e}}class sd extends qs{constructor(t,e=si,n=Vs,i,r,a=Qe,o=Qe,l,c=Wi){const u={width:t,height:t,depth:1},p=[u,u,u,u,u,u];super(t,t,e,n,i,r,a,o,l,c),this.image=p,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class rd extends ln{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class ir extends Ye{constructor(t=1,e=1,n=1,i=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:r,depthSegments:a};const o=this;i=Math.floor(i),r=Math.floor(r),a=Math.floor(a);const l=[],c=[],u=[],p=[];let h=0,d=0;g("z","y","x",-1,-1,n,e,t,a,r,0),g("z","y","x",1,-1,n,e,-t,a,r,1),g("x","z","y",1,1,t,n,e,i,a,2),g("x","z","y",1,-1,t,n,-e,i,a,3),g("x","y","z",1,-1,t,e,n,i,r,4),g("x","y","z",-1,-1,t,e,-n,i,r,5),this.setIndex(l),this.setAttribute("position",new Se(c,3)),this.setAttribute("normal",new Se(u,3)),this.setAttribute("uv",new Se(p,2));function g(m,f,_,v,S,M,E,b,x,y,A){const R=M/x,C=E/y,L=M/2,N=E/2,D=b/2,B=x+1,z=y+1;let U=0,X=0;const G=new I;for(let K=0;K<z;K++){const Z=K*C-N;for(let at=0;at<B;at++){const Rt=at*R-L;G[m]=Rt*v,G[f]=Z*S,G[_]=D,c.push(G.x,G.y,G.z),G[m]=0,G[f]=0,G[_]=b>0?1:-1,u.push(G.x,G.y,G.z),p.push(at/x),p.push(1-K/y),U+=1}}for(let K=0;K<y;K++)for(let Z=0;Z<x;Z++){const at=h+Z+B*K,Rt=h+Z+B*(K+1),Y=h+(Z+1)+B*(K+1),it=h+(Z+1)+B*K;l.push(at,Rt,it),l.push(Rt,Y,it),X+=6}o.addGroup(d,X,A),d+=X,h+=U}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ir(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class ru extends Ye{constructor(t=1,e=1,n=4,i=8,r=1){super(),this.type="CapsuleGeometry",this.parameters={radius:t,height:e,capSegments:n,radialSegments:i,heightSegments:r},e=Math.max(0,e),n=Math.max(1,Math.floor(n)),i=Math.max(3,Math.floor(i)),r=Math.max(1,Math.floor(r));const a=[],o=[],l=[],c=[],u=e/2,p=Math.PI/2*t,h=e,d=2*p+h,g=n*2+r,m=i+1,f=new I,_=new I;for(let v=0;v<=g;v++){let S=0,M=0,E=0,b=0;if(v<=n){const A=v/n,R=A*Math.PI/2;M=-u-t*Math.cos(R),E=t*Math.sin(R),b=-t*Math.cos(R),S=A*p}else if(v<=n+r){const A=(v-n)/r;M=-u+A*e,E=t,b=0,S=p+A*h}else{const A=(v-n-r)/n,R=A*Math.PI/2;M=u+t*Math.sin(R),E=t*Math.cos(R),b=t*Math.sin(R),S=p+h+A*p}const x=Math.max(0,Math.min(1,S/d));let y=0;v===0?y=.5/i:v===g&&(y=-.5/i);for(let A=0;A<=i;A++){const R=A/i,C=R*Math.PI*2,L=Math.sin(C),N=Math.cos(C);_.x=-E*N,_.y=M,_.z=E*L,o.push(_.x,_.y,_.z),f.set(-E*N,b,E*L),f.normalize(),l.push(f.x,f.y,f.z),c.push(R+y,x)}if(v>0){const A=(v-1)*m;for(let R=0;R<i;R++){const C=A+R,L=A+R+1,N=v*m+R,D=v*m+R+1;a.push(C,L,N),a.push(L,D,N)}}}this.setIndex(a),this.setAttribute("position",new Se(o,3)),this.setAttribute("normal",new Se(l,3)),this.setAttribute("uv",new Se(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ru(t.radius,t.height,t.capSegments,t.radialSegments,t.heightSegments)}}class Ro extends Ye{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const r=[],a=[];o(i),c(n),u(),this.setAttribute("position",new Se(r,3)),this.setAttribute("normal",new Se(r.slice(),3)),this.setAttribute("uv",new Se(a,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function o(v){const S=new I,M=new I,E=new I;for(let b=0;b<e.length;b+=3)d(e[b+0],S),d(e[b+1],M),d(e[b+2],E),l(S,M,E,v)}function l(v,S,M,E){const b=E+1,x=[];for(let y=0;y<=b;y++){x[y]=[];const A=v.clone().lerp(M,y/b),R=S.clone().lerp(M,y/b),C=b-y;for(let L=0;L<=C;L++)L===0&&y===b?x[y][L]=A:x[y][L]=A.clone().lerp(R,L/C)}for(let y=0;y<b;y++)for(let A=0;A<2*(b-y)-1;A++){const R=Math.floor(A/2);A%2===0?(h(x[y][R+1]),h(x[y+1][R]),h(x[y][R])):(h(x[y][R+1]),h(x[y+1][R+1]),h(x[y+1][R]))}}function c(v){const S=new I;for(let M=0;M<r.length;M+=3)S.x=r[M+0],S.y=r[M+1],S.z=r[M+2],S.normalize().multiplyScalar(v),r[M+0]=S.x,r[M+1]=S.y,r[M+2]=S.z}function u(){const v=new I;for(let S=0;S<r.length;S+=3){v.x=r[S+0],v.y=r[S+1],v.z=r[S+2];const M=f(v)/2/Math.PI+.5,E=_(v)/Math.PI+.5;a.push(M,1-E)}g(),p()}function p(){for(let v=0;v<a.length;v+=6){const S=a[v+0],M=a[v+2],E=a[v+4],b=Math.max(S,M,E),x=Math.min(S,M,E);b>.9&&x<.1&&(S<.2&&(a[v+0]+=1),M<.2&&(a[v+2]+=1),E<.2&&(a[v+4]+=1))}}function h(v){r.push(v.x,v.y,v.z)}function d(v,S){const M=v*3;S.x=t[M+0],S.y=t[M+1],S.z=t[M+2]}function g(){const v=new I,S=new I,M=new I,E=new I,b=new rt,x=new rt,y=new rt;for(let A=0,R=0;A<r.length;A+=9,R+=6){v.set(r[A+0],r[A+1],r[A+2]),S.set(r[A+3],r[A+4],r[A+5]),M.set(r[A+6],r[A+7],r[A+8]),b.set(a[R+0],a[R+1]),x.set(a[R+2],a[R+3]),y.set(a[R+4],a[R+5]),E.copy(v).add(S).add(M).divideScalar(3);const C=f(E);m(b,R+0,v,C),m(x,R+2,S,C),m(y,R+4,M,C)}}function m(v,S,M,E){E<0&&v.x===1&&(a[S]=v.x-1),M.x===0&&M.z===0&&(a[S]=E/2/Math.PI+.5)}function f(v){return Math.atan2(v.z,-v.x)}function _(v){return Math.atan2(-v.y,Math.sqrt(v.x*v.x+v.z*v.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Ro(t.vertices,t.indices,t.radius,t.detail)}}const La=new I,Na=new I,fl=new I,Ia=new Un;class c_ extends Ye{constructor(t=null,e=1){if(super(),this.type="EdgesGeometry",this.parameters={geometry:t,thresholdAngle:e},t!==null){const i=Math.pow(10,4),r=Math.cos(Bs*e),a=t.getIndex(),o=t.getAttribute("position"),l=a?a.count:o.count,c=[0,0,0],u=["a","b","c"],p=new Array(3),h=new Map,d=[];for(let g=0;g<l;g+=3){a?(c[0]=a.getX(g),c[1]=a.getX(g+1),c[2]=a.getX(g+2)):(c[0]=g,c[1]=g+1,c[2]=g+2);const{a:m,b:f,c:_}=Ia;if(m.fromBufferAttribute(o,c[0]),f.fromBufferAttribute(o,c[1]),_.fromBufferAttribute(o,c[2]),Ia.getNormal(fl),p[0]=`${Math.round(m.x*i)},${Math.round(m.y*i)},${Math.round(m.z*i)}`,p[1]=`${Math.round(f.x*i)},${Math.round(f.y*i)},${Math.round(f.z*i)}`,p[2]=`${Math.round(_.x*i)},${Math.round(_.y*i)},${Math.round(_.z*i)}`,!(p[0]===p[1]||p[1]===p[2]||p[2]===p[0]))for(let v=0;v<3;v++){const S=(v+1)%3,M=p[v],E=p[S],b=Ia[u[v]],x=Ia[u[S]],y=`${M}_${E}`,A=`${E}_${M}`,R=h.get(A);R?(fl.dot(R.normal)<=r&&(d.push(b.x,b.y,b.z),d.push(x.x,x.y,x.z)),h.set(A,null)):h.has(y)||h.set(y,{index0:c[v],index1:c[S],normal:fl.clone()})}}for(const g of h.values())if(g){const{index0:m,index1:f}=g;La.fromBufferAttribute(o,m),Na.fromBufferAttribute(o,f),d.push(La.x,La.y,La.z),d.push(Na.x,Na.y,Na.z)}this.setAttribute("position",new Se(d,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}}class ai{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){kt("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(i),e.push(r),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let i=0;const r=n.length;let a;e?a=e:a=t*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(i=Math.floor(o+(l-o)/2),c=n[i]-a,c<0)o=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===a)return i/(r-1);const u=n[i],h=n[i+1]-u,d=(a-u)/h;return(i+d)/(r-1)}getTangent(t,e){let i=t-1e-4,r=t+1e-4;i<0&&(i=0),r>1&&(r=1);const a=this.getPoint(i),o=this.getPoint(r),l=e||(a.isVector2?new rt:new I);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new I,i=[],r=[],a=[],o=new I,l=new ae;for(let d=0;d<=t;d++){const g=d/t;i[d]=this.getTangentAt(g,new I)}r[0]=new I,a[0]=new I;let c=Number.MAX_VALUE;const u=Math.abs(i[0].x),p=Math.abs(i[0].y),h=Math.abs(i[0].z);u<=c&&(c=u,n.set(1,0,0)),p<=c&&(c=p,n.set(0,1,0)),h<=c&&n.set(0,0,1),o.crossVectors(i[0],n).normalize(),r[0].crossVectors(i[0],o),a[0].crossVectors(i[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(i[d-1],i[d]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(ne(i[d-1].dot(i[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,g))}a[d].crossVectors(i[d],r[d])}if(e===!0){let d=Math.acos(ne(r[0].dot(r[t]),-1,1));d/=t,i[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let g=1;g<=t;g++)r[g].applyMatrix4(l.makeRotationAxis(i[g],d*g)),a[g].crossVectors(i[g],r[g])}return{tangents:i,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this.cacheArcLengths=null,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this.cacheArcLengths=null,this}}class au extends ai{constructor(t=0,e=0,n=1,i=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e=new rt){const n=e,i=Math.PI*2;let r=this.aEndAngle-this.aStartAngle;const a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=i;for(;r>i;)r-=i;r<Number.EPSILON&&(a?r=0:r=i),this.aClockwise===!0&&!a&&(r===i?r=-i:r=r-i);const o=this.aStartAngle+t*r;let l=this.aX+this.xRadius*Math.cos(o),c=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){const u=Math.cos(this.aRotation),p=Math.sin(this.aRotation),h=l-this.aX,d=c-this.aY;l=h*u-d*p+this.aX,c=h*p+d*u+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class u_ extends au{constructor(t,e,n,i,r,a){super(t,e,n,n,i,r,a),this.isArcCurve=!0,this.type="ArcCurve"}}function ou(){let s=0,t=0,e=0,n=0;function i(r,a,o,l){s=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,c){i(a,o,c*(o-r),c*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,c,u,p){let h=(a-r)/c-(o-r)/(c+u)+(o-a)/u,d=(o-a)/u-(l-a)/(u+p)+(l-o)/p;h*=u,d*=u,i(a,o,h,d)},calc:function(r){const a=r*r,o=a*r;return s+t*r+e*a+n*o}}}const xh=new I,vh=new I,dl=new ou,pl=new ou,ml=new ou;class h_ extends ai{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new I){const n=e,i=this.points,r=i.length,a=(r-(this.closed?0:1))*t;let o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,u;this.closed||o>0?c=i[(o-1)%r]:(vh.subVectors(i[0],i[1]).add(i[0]),c=vh);const p=i[o%r],h=i[(o+1)%r];if(this.closed||o+2<r?u=i[(o+2)%r]:(xh.subVectors(i[r-1],i[r-2]).add(i[r-1]),u=xh),this.curveType==="centripetal"||this.curveType==="chordal"){const d=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(p),d),m=Math.pow(p.distanceToSquared(h),d),f=Math.pow(h.distanceToSquared(u),d);m<1e-4&&(m=1),g<1e-4&&(g=m),f<1e-4&&(f=m),dl.initNonuniformCatmullRom(c.x,p.x,h.x,u.x,g,m,f),pl.initNonuniformCatmullRom(c.y,p.y,h.y,u.y,g,m,f),ml.initNonuniformCatmullRom(c.z,p.z,h.z,u.z,g,m,f)}else this.curveType==="catmullrom"&&(dl.initCatmullRom(c.x,p.x,h.x,u.x,this.tension),pl.initCatmullRom(c.y,p.y,h.y,u.y,this.tension),ml.initCatmullRom(c.z,p.z,h.z,u.z,this.tension));return n.set(dl.calc(l),pl.calc(l),ml.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new I().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function Mh(s,t,e,n,i){const r=(n-t)*.5,a=(i-e)*.5,o=s*s,l=s*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*s+e}function f_(s,t){const e=1-s;return e*e*t}function d_(s,t){return 2*(1-s)*s*t}function p_(s,t){return s*s*t}function Rr(s,t,e,n){return f_(s,t)+d_(s,e)+p_(s,n)}function m_(s,t){const e=1-s;return e*e*e*t}function __(s,t){const e=1-s;return 3*e*e*s*t}function g_(s,t){return 3*(1-s)*s*s*t}function x_(s,t){return s*s*s*t}function Cr(s,t,e,n,i){return m_(s,t)+__(s,e)+g_(s,n)+x_(s,i)}class ad extends ai{constructor(t=new rt,e=new rt,n=new rt,i=new rt){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new rt){const n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Cr(t,i.x,r.x,a.x,o.x),Cr(t,i.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class od extends ai{constructor(t=new I,e=new I,n=new I,i=new I){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new I){const n=e,i=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(Cr(t,i.x,r.x,a.x,o.x),Cr(t,i.y,r.y,a.y,o.y),Cr(t,i.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class ld extends ai{constructor(t=new rt,e=new rt){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new rt){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new rt){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class v_ extends ai{constructor(t=new I,e=new I){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new I){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new I){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class cd extends ai{constructor(t=new rt,e=new rt,n=new rt){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new rt){const n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Rr(t,i.x,r.x,a.x),Rr(t,i.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class ud extends ai{constructor(t=new I,e=new I,n=new I){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new I){const n=e,i=this.v0,r=this.v1,a=this.v2;return n.set(Rr(t,i.x,r.x,a.x),Rr(t,i.y,r.y,a.y),Rr(t,i.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class hd extends ai{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new rt){const n=e,i=this.points,r=(i.length-1)*t,a=Math.floor(r),o=r-a,l=i[a===0?a:a-1],c=i[a],u=i[a>i.length-2?i.length-1:a+1],p=i[a>i.length-3?i.length-1:a+2];return n.set(Mh(o,l.x,c.x,u.x,p.x),Mh(o,l.y,c.y,u.y,p.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new rt().fromArray(i))}return this}}var uo=Object.freeze({__proto__:null,ArcCurve:u_,CatmullRomCurve3:h_,CubicBezierCurve:ad,CubicBezierCurve3:od,EllipseCurve:au,LineCurve:ld,LineCurve3:v_,QuadraticBezierCurve:cd,QuadraticBezierCurve3:ud,SplineCurve:hd});class M_ extends ai{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1,this.cacheLengths=null}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new uo[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),i=this.getCurveLengths();let r=0;for(;r<i.length;){if(i[r]>=n){const a=i[r]-n,o=this.curves[r],l=o.getLength(),c=l===0?0:1-a/l;return o.getPointAt(c,e)}r++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let i=0,r=this.curves;i<r.length;i++){const a=r[i],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let c=0;c<l.length;c++){const u=l[c];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this.cacheLengths=null,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(new uo[i.type]().fromJSON(i))}return this.cacheLengths=null,this}}class Sh extends M_{constructor(t){super(),this.type="Path",this.currentPoint=new rt,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new ld(this.currentPoint.clone(),new rt(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){const r=new cd(this.currentPoint.clone(),new rt(t,e),new rt(n,i));return this.curves.push(r),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,r,a){const o=new ad(this.currentPoint.clone(),new rt(t,e),new rt(n,i),new rt(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new hd(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,r,a){const o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,i,r,a),this}absarc(t,e,n,i,r,a){return this.absellipse(t,e,n,n,i,r,a),this}ellipse(t,e,n,i,r,a,o,l){const c=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+c,e+u,n,i,r,a,o,l),this}absellipse(t,e,n,i,r,a,o,l){const c=new au(t,e,n,i,r,a,o,l);if(this.curves.length>0){const p=c.getPoint(0);p.equals(this.currentPoint)||this.lineTo(p.x,p.y)}this.curves.push(c);const u=c.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class fd extends Sh{constructor(t){super(t),this.uuid=ms(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(new Sh().fromJSON(i))}return this}}function S_(s,t,e=2){const n=t&&t.length,i=n?t[0]*e:s.length;let r=dd(s,0,i,e,!0);const a=[];if(!r||r.next===r.prev)return a;let o,l,c;if(n&&(r=w_(s,t,r,e)),s.length>80*e){o=s[0],l=s[1];let u=o,p=l;for(let h=e;h<i;h+=e){const d=s[h],g=s[h+1];d<o&&(o=d),g<l&&(l=g),d>u&&(u=d),g>p&&(p=g)}c=Math.max(u-o,p-l),c=c!==0?32767/c:0}return kr(r,a,e,o,l,c,0),a}function dd(s,t,e,n,i){let r;if(i===F_(s,t,e,n)>0)for(let a=t;a<e;a+=n)r=yh(a/n|0,s[a],s[a+1],r);else for(let a=e-n;a>=t;a-=n)r=yh(a/n|0,s[a],s[a+1],r);return r&&Ys(r,r.next)&&(Hr(r),r=r.next),r}function ps(s,t){if(!s)return s;t||(t=s);let e=s,n;do if(n=!1,!e.steiner&&(Ys(e,e.next)||Pe(e.prev,e,e.next)===0)){if(Hr(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function kr(s,t,e,n,i,r,a){if(!s)return;!a&&r&&D_(s,n,i,r);let o=s;for(;s.prev!==s.next;){const l=s.prev,c=s.next;if(r?b_(s,n,i,r):y_(s)){t.push(l.i,s.i,c.i),Hr(s),s=c.next,o=c.next;continue}if(s=c,s===o){a?a===1?(s=E_(ps(s),t),kr(s,t,e,n,i,r,2)):a===2&&T_(s,t,e,n,i,r):kr(ps(s),t,e,n,i,r,1);break}}}function y_(s){const t=s.prev,e=s,n=s.next;if(Pe(t,e,n)>=0)return!1;const i=t.x,r=e.x,a=n.x,o=t.y,l=e.y,c=n.y,u=Math.min(i,r,a),p=Math.min(o,l,c),h=Math.max(i,r,a),d=Math.max(o,l,c);let g=n.next;for(;g!==t;){if(g.x>=u&&g.x<=h&&g.y>=p&&g.y<=d&&yr(i,o,r,l,a,c,g.x,g.y)&&Pe(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function b_(s,t,e,n){const i=s.prev,r=s,a=s.next;if(Pe(i,r,a)>=0)return!1;const o=i.x,l=r.x,c=a.x,u=i.y,p=r.y,h=a.y,d=Math.min(o,l,c),g=Math.min(u,p,h),m=Math.max(o,l,c),f=Math.max(u,p,h),_=xc(d,g,t,e,n),v=xc(m,f,t,e,n);let S=s.prevZ,M=s.nextZ;for(;S&&S.z>=_&&M&&M.z<=v;){if(S.x>=d&&S.x<=m&&S.y>=g&&S.y<=f&&S!==i&&S!==a&&yr(o,u,l,p,c,h,S.x,S.y)&&Pe(S.prev,S,S.next)>=0||(S=S.prevZ,M.x>=d&&M.x<=m&&M.y>=g&&M.y<=f&&M!==i&&M!==a&&yr(o,u,l,p,c,h,M.x,M.y)&&Pe(M.prev,M,M.next)>=0))return!1;M=M.nextZ}for(;S&&S.z>=_;){if(S.x>=d&&S.x<=m&&S.y>=g&&S.y<=f&&S!==i&&S!==a&&yr(o,u,l,p,c,h,S.x,S.y)&&Pe(S.prev,S,S.next)>=0)return!1;S=S.prevZ}for(;M&&M.z<=v;){if(M.x>=d&&M.x<=m&&M.y>=g&&M.y<=f&&M!==i&&M!==a&&yr(o,u,l,p,c,h,M.x,M.y)&&Pe(M.prev,M,M.next)>=0)return!1;M=M.nextZ}return!0}function E_(s,t){let e=s;do{const n=e.prev,i=e.next.next;!Ys(n,i)&&md(n,e,e.next,i)&&Gr(n,i)&&Gr(i,n)&&(t.push(n.i,e.i,i.i),Hr(e),Hr(e.next),e=s=i),e=e.next}while(e!==s);return ps(e)}function T_(s,t,e,n,i,r){let a=s;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&I_(a,o)){let l=_d(a,o);a=ps(a,a.next),l=ps(l,l.next),kr(a,t,e,n,i,r,0),kr(l,t,e,n,i,r,0);return}o=o.next}a=a.next}while(a!==s)}function w_(s,t,e,n){const i=[];for(let r=0,a=t.length;r<a;r++){const o=t[r]*n,l=r<a-1?t[r+1]*n:s.length,c=dd(s,o,l,n,!1);c===c.next&&(c.steiner=!0),i.push(N_(c))}i.sort(A_);for(let r=0;r<i.length;r++)e=R_(i[r],e);return e}function A_(s,t){let e=s.x-t.x;if(e===0&&(e=s.y-t.y,e===0)){const n=(s.next.y-s.y)/(s.next.x-s.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function R_(s,t){const e=C_(s,t);if(!e)return t;const n=_d(e,s);return ps(n,n.next),ps(e,e.next)}function C_(s,t){let e=t;const n=s.x,i=s.y;let r=-1/0,a;if(Ys(s,e))return e;do{if(Ys(s,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){const p=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(p<=n&&p>r&&(r=p,a=e.x<e.next.x?e:e.next,p===n))return a}e=e.next}while(e!==t);if(!a)return null;const o=a,l=a.x,c=a.y;let u=1/0;e=a;do{if(n>=e.x&&e.x>=l&&n!==e.x&&pd(i<c?n:r,i,l,c,i<c?r:n,i,e.x,e.y)){const p=Math.abs(i-e.y)/(n-e.x);Gr(e,s)&&(p<u||p===u&&(e.x>a.x||e.x===a.x&&P_(a,e)))&&(a=e,u=p)}e=e.next}while(e!==o);return a}function P_(s,t){return Pe(s.prev,s,t.prev)<0&&Pe(t.next,s,s.next)<0}function D_(s,t,e,n){let i=s;do i.z===0&&(i.z=xc(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==s);i.prevZ.nextZ=null,i.prevZ=null,L_(i)}function L_(s){let t,e=1;do{let n=s,i;s=null;let r=null;for(t=0;n;){t++;let a=n,o=0;for(let c=0;c<e&&(o++,a=a.nextZ,!!a);c++);let l=e;for(;o>0||l>0&&a;)o!==0&&(l===0||!a||n.z<=a.z)?(i=n,n=n.nextZ,o--):(i=a,a=a.nextZ,l--),r?r.nextZ=i:s=i,i.prevZ=r,r=i;n=a}r.nextZ=null,e*=2}while(t>1);return s}function xc(s,t,e,n,i){return s=(s-e)*i|0,t=(t-n)*i|0,s=(s|s<<8)&16711935,s=(s|s<<4)&252645135,s=(s|s<<2)&858993459,s=(s|s<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,s|t<<1}function N_(s){let t=s,e=s;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==s);return e}function pd(s,t,e,n,i,r,a,o){return(i-a)*(t-o)>=(s-a)*(r-o)&&(s-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(i-a)*(n-o)}function yr(s,t,e,n,i,r,a,o){return!(s===a&&t===o)&&pd(s,t,e,n,i,r,a,o)}function I_(s,t){return s.next.i!==t.i&&s.prev.i!==t.i&&!U_(s,t)&&(Gr(s,t)&&Gr(t,s)&&O_(s,t)&&(Pe(s.prev,s,t.prev)||Pe(s,t.prev,t))||Ys(s,t)&&Pe(s.prev,s,s.next)>0&&Pe(t.prev,t,t.next)>0)}function Pe(s,t,e){return(t.y-s.y)*(e.x-t.x)-(t.x-s.x)*(e.y-t.y)}function Ys(s,t){return s.x===t.x&&s.y===t.y}function md(s,t,e,n){const i=Oa(Pe(s,t,e)),r=Oa(Pe(s,t,n)),a=Oa(Pe(e,n,s)),o=Oa(Pe(e,n,t));return!!(i!==r&&a!==o||i===0&&Ua(s,e,t)||r===0&&Ua(s,n,t)||a===0&&Ua(e,s,n)||o===0&&Ua(e,t,n))}function Ua(s,t,e){return t.x<=Math.max(s.x,e.x)&&t.x>=Math.min(s.x,e.x)&&t.y<=Math.max(s.y,e.y)&&t.y>=Math.min(s.y,e.y)}function Oa(s){return s>0?1:s<0?-1:0}function U_(s,t){let e=s;do{if(e.i!==s.i&&e.next.i!==s.i&&e.i!==t.i&&e.next.i!==t.i&&md(e,e.next,s,t))return!0;e=e.next}while(e!==s);return!1}function Gr(s,t){return Pe(s.prev,s,s.next)<0?Pe(s,t,s.next)>=0&&Pe(s,s.prev,t)>=0:Pe(s,t,s.prev)<0||Pe(s,s.next,t)<0}function O_(s,t){let e=s,n=!1;const i=(s.x+t.x)/2,r=(s.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&i<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==s);return n}function _d(s,t){const e=vc(s.i,s.x,s.y),n=vc(t.i,t.x,t.y),i=s.next,r=t.prev;return s.next=t,t.prev=s,e.next=i,i.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function yh(s,t,e,n){const i=vc(s,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function Hr(s){s.next.prev=s.prev,s.prev.next=s.next,s.prevZ&&(s.prevZ.nextZ=s.nextZ),s.nextZ&&(s.nextZ.prevZ=s.prevZ)}function vc(s,t,e){return{i:s,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function F_(s,t,e,n){let i=0;for(let r=t,a=e-n;r<e;r+=n)i+=(s[a]-s[r])*(s[r+1]+s[a+1]),a=r;return i}class B_{static triangulate(t,e,n=2){return S_(t,e,n)}}class Is{static area(t){const e=t.length;let n=0;for(let i=e-1,r=0;r<e;i=r++)n+=t[i].x*t[r].y-t[r].x*t[i].y;return n*.5}static isClockWise(t){return Is.area(t)<0}static triangulateShape(t,e){const n=[],i=[],r=[];bh(t),Eh(n,t);let a=t.length;e.forEach(bh);for(let l=0;l<e.length;l++)i.push(a),a+=e[l].length,Eh(n,e[l]);const o=B_.triangulate(n,i);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}}function bh(s){const t=s.length;t>2&&s[t-1].equals(s[0])&&s.pop()}function Eh(s,t){for(let e=0;e<t.length;e++)s.push(t[e].x),s.push(t[e].y)}class lu extends Ye{constructor(t=new fd([new rt(.5,.5),new rt(-.5,.5),new rt(-.5,-.5),new rt(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,i=[],r=[];for(let o=0,l=t.length;o<l;o++){const c=t[o];a(c)}this.setAttribute("position",new Se(i,3)),this.setAttribute("uv",new Se(r,2)),this.computeVertexNormals();function a(o){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,p=e.depth!==void 0?e.depth:1;let h=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:d-.1,m=e.bevelOffset!==void 0?e.bevelOffset:0,f=e.bevelSegments!==void 0?e.bevelSegments:3;const _=e.extrudePath,v=e.UVGenerator!==void 0?e.UVGenerator:z_;let S,M=!1,E,b,x,y;if(_){S=_.getSpacedPoints(u),M=!0,h=!1;const tt=_.isCatmullRomCurve3?_.closed:!1;E=_.computeFrenetFrames(u,tt),b=new I,x=new I,y=new I}h||(f=0,d=0,g=0,m=0);const A=o.extractPoints(c);let R=A.shape;const C=A.holes;if(!Is.isClockWise(R)){R=R.reverse();for(let tt=0,mt=C.length;tt<mt;tt++){const ft=C[tt];Is.isClockWise(ft)&&(C[tt]=ft.reverse())}}function N(tt){const ft=10000000000000001e-36;let Et=tt[0];for(let Mt=1;Mt<=tt.length;Mt++){const Vt=Mt%tt.length,Lt=tt[Vt],te=Lt.x-Et.x,se=Lt.y-Et.y,oe=te*te+se*se,k=Math.max(Math.abs(Lt.x),Math.abs(Lt.y),Math.abs(Et.x),Math.abs(Et.y)),xe=ft*k*k;if(oe<=xe){tt.splice(Vt,1),Mt--;continue}Et=Lt}}N(R),C.forEach(N);const D=C.length,B=R;for(let tt=0;tt<D;tt++){const mt=C[tt];R=R.concat(mt)}function z(tt,mt,ft){return mt||he("ExtrudeGeometry: vec does not exist"),tt.clone().addScaledVector(mt,ft)}const U=R.length;function X(tt,mt,ft){let Et,Mt,Vt;const Lt=tt.x-mt.x,te=tt.y-mt.y,se=ft.x-tt.x,oe=ft.y-tt.y,k=Lt*Lt+te*te,xe=Lt*oe-te*se;if(Math.abs(xe)>Number.EPSILON){const Zt=Math.sqrt(k),Kt=Math.sqrt(se*se+oe*oe),dt=mt.x-te/Zt,ye=mt.y+Lt/Zt,Ot=ft.x-oe/Kt,zt=ft.y+se/Kt,P=((Ot-dt)*oe-(zt-ye)*se)/(Lt*oe-te*se);Et=dt+Lt*P-tt.x,Mt=ye+te*P-tt.y;const w=Et*Et+Mt*Mt;if(w<=2)return new rt(Et,Mt);Vt=Math.sqrt(w/2)}else{let Zt=!1;Lt>Number.EPSILON?se>Number.EPSILON&&(Zt=!0):Lt<-Number.EPSILON?se<-Number.EPSILON&&(Zt=!0):Math.sign(te)===Math.sign(oe)&&(Zt=!0),Zt?(Et=-te,Mt=Lt,Vt=Math.sqrt(k)):(Et=Lt,Mt=te,Vt=Math.sqrt(k/2))}return new rt(Et/Vt,Mt/Vt)}const G=[];for(let tt=0,mt=B.length,ft=mt-1,Et=tt+1;tt<mt;tt++,ft++,Et++)ft===mt&&(ft=0),Et===mt&&(Et=0),G[tt]=X(B[tt],B[ft],B[Et]);const K=[];let Z,at=G.concat();for(let tt=0,mt=D;tt<mt;tt++){const ft=C[tt];Z=[];for(let Et=0,Mt=ft.length,Vt=Mt-1,Lt=Et+1;Et<Mt;Et++,Vt++,Lt++)Vt===Mt&&(Vt=0),Lt===Mt&&(Lt=0),Z[Et]=X(ft[Et],ft[Vt],ft[Lt]);K.push(Z),at=at.concat(Z)}let Rt;if(f===0)Rt=Is.triangulateShape(B,C);else{const tt=[],mt=[];for(let ft=0;ft<f;ft++){const Et=ft/f,Mt=d*Math.cos(Et*Math.PI/2),Vt=g*Math.sin(Et*Math.PI/2)+m;for(let Lt=0,te=B.length;Lt<te;Lt++){const se=z(B[Lt],G[Lt],Vt);It(se.x,se.y,-Mt),Et===0&&tt.push(se)}for(let Lt=0,te=D;Lt<te;Lt++){const se=C[Lt];Z=K[Lt];const oe=[];for(let k=0,xe=se.length;k<xe;k++){const Zt=z(se[k],Z[k],Vt);It(Zt.x,Zt.y,-Mt),Et===0&&oe.push(Zt)}Et===0&&mt.push(oe)}}Rt=Is.triangulateShape(tt,mt)}const Y=Rt.length,it=g+m;for(let tt=0;tt<U;tt++){const mt=h?z(R[tt],at[tt],it):R[tt];M?(x.copy(E.normals[0]).multiplyScalar(mt.x),b.copy(E.binormals[0]).multiplyScalar(mt.y),y.copy(S[0]).add(x).add(b),It(y.x,y.y,y.z)):It(mt.x,mt.y,0)}for(let tt=1;tt<=u;tt++)for(let mt=0;mt<U;mt++){const ft=h?z(R[mt],at[mt],it):R[mt];M?(x.copy(E.normals[tt]).multiplyScalar(ft.x),b.copy(E.binormals[tt]).multiplyScalar(ft.y),y.copy(S[tt]).add(x).add(b),It(y.x,y.y,y.z)):It(ft.x,ft.y,p/u*tt)}for(let tt=f-1;tt>=0;tt--){const mt=tt/f,ft=d*Math.cos(mt*Math.PI/2),Et=g*Math.sin(mt*Math.PI/2)+m;for(let Mt=0,Vt=B.length;Mt<Vt;Mt++){const Lt=z(B[Mt],G[Mt],Et);It(Lt.x,Lt.y,p+ft)}for(let Mt=0,Vt=C.length;Mt<Vt;Mt++){const Lt=C[Mt];Z=K[Mt];for(let te=0,se=Lt.length;te<se;te++){const oe=z(Lt[te],Z[te],Et);M?It(oe.x,oe.y+S[u-1].y,S[u-1].x+ft):It(oe.x,oe.y,p+ft)}}}St(),Ct();function St(){const tt=i.length/3;if(h){let mt=0,ft=U*mt;for(let Et=0;Et<Y;Et++){const Mt=Rt[Et];ce(Mt[2]+ft,Mt[1]+ft,Mt[0]+ft)}mt=u+f*2,ft=U*mt;for(let Et=0;Et<Y;Et++){const Mt=Rt[Et];ce(Mt[0]+ft,Mt[1]+ft,Mt[2]+ft)}}else{for(let mt=0;mt<Y;mt++){const ft=Rt[mt];ce(ft[2],ft[1],ft[0])}for(let mt=0;mt<Y;mt++){const ft=Rt[mt];ce(ft[0]+U*u,ft[1]+U*u,ft[2]+U*u)}}n.addGroup(tt,i.length/3-tt,0)}function Ct(){const tt=i.length/3;let mt=0;gt(B,mt),mt+=B.length;for(let ft=0,Et=C.length;ft<Et;ft++){const Mt=C[ft];gt(Mt,mt),mt+=Mt.length}n.addGroup(tt,i.length/3-tt,1)}function gt(tt,mt){let ft=tt.length;for(;--ft>=0;){const Et=ft;let Mt=ft-1;Mt<0&&(Mt=tt.length-1);for(let Vt=0,Lt=u+f*2;Vt<Lt;Vt++){const te=U*Vt,se=U*(Vt+1),oe=mt+Et+te,k=mt+Mt+te,xe=mt+Mt+se,Zt=mt+Et+se;Ft(oe,k,xe,Zt)}}}function It(tt,mt,ft){l.push(tt),l.push(mt),l.push(ft)}function ce(tt,mt,ft){Yt(tt),Yt(mt),Yt(ft);const Et=i.length/3,Mt=v.generateTopUV(n,i,Et-3,Et-2,Et-1);ie(Mt[0]),ie(Mt[1]),ie(Mt[2])}function Ft(tt,mt,ft,Et){Yt(tt),Yt(mt),Yt(Et),Yt(mt),Yt(ft),Yt(Et);const Mt=i.length/3,Vt=v.generateSideWallUV(n,i,Mt-6,Mt-3,Mt-2,Mt-1);ie(Vt[0]),ie(Vt[1]),ie(Vt[3]),ie(Vt[1]),ie(Vt[2]),ie(Vt[3])}function Yt(tt){i.push(l[tt*3+0]),i.push(l[tt*3+1]),i.push(l[tt*3+2])}function ie(tt){r.push(tt.x),r.push(tt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return k_(e,n,t)}static fromJSON(t,e){const n=[];for(let r=0,a=t.shapes.length;r<a;r++){const o=e[t.shapes[r]];n.push(o)}const i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new uo[i.type]().fromJSON(i)),new lu(n,t.options)}}const z_={generateTopUV:function(s,t,e,n,i){const r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],c=t[i*3],u=t[i*3+1];return[new rt(r,a),new rt(o,l),new rt(c,u)]},generateSideWallUV:function(s,t,e,n,i,r){const a=t[e*3],o=t[e*3+1],l=t[e*3+2],c=t[n*3],u=t[n*3+1],p=t[n*3+2],h=t[i*3],d=t[i*3+1],g=t[i*3+2],m=t[r*3],f=t[r*3+1],_=t[r*3+2];return Math.abs(o-u)<Math.abs(a-c)?[new rt(a,1-l),new rt(c,1-p),new rt(h,1-g),new rt(m,1-_)]:[new rt(o,1-l),new rt(u,1-p),new rt(d,1-g),new rt(f,1-_)]}};function k_(s,t,e){if(e.shapes=[],Array.isArray(s))for(let n=0,i=s.length;n<i;n++){const r=s[n];e.shapes.push(r.uuid)}else e.shapes.push(s.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class Co extends Ro{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(i,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Co(t.radius,t.detail)}}class cu extends Ro{constructor(t=1,e=0){const n=[1,0,0,-1,0,0,0,1,0,0,-1,0,0,0,1,0,0,-1],i=[0,2,4,0,4,3,0,3,5,0,5,2,1,2,5,1,5,3,1,3,4,1,4,2];super(n,i,t,e),this.type="OctahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new cu(t.radius,t.detail)}}class jr extends Ye{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(i),c=o+1,u=l+1,p=t/o,h=e/l,d=[],g=[],m=[],f=[];for(let _=0;_<u;_++){const v=_*h-a;for(let S=0;S<c;S++){const M=S*p-r;g.push(M,-v,0),m.push(0,0,1),f.push(S/o),f.push(1-_/l)}}for(let _=0;_<l;_++)for(let v=0;v<o;v++){const S=v+c*_,M=v+c*(_+1),E=v+1+c*(_+1),b=v+1+c*_;d.push(S,M,b),d.push(M,E,b)}this.setIndex(d),this.setAttribute("position",new Se(g,3)),this.setAttribute("normal",new Se(m,3)),this.setAttribute("uv",new Se(f,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new jr(t.width,t.height,t.widthSegments,t.heightSegments)}}class uu extends Ye{constructor(t=1,e=.4,n=12,i=48,r=Math.PI*2,a=0,o=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:i,arc:r,thetaStart:a,thetaLength:o},n=Math.floor(n),i=Math.floor(i);const l=[],c=[],u=[],p=[],h=new I,d=new I,g=new I;for(let m=0;m<=n;m++){const f=a+m/n*o;for(let _=0;_<=i;_++){const v=_/i*r;d.x=(t+e*Math.cos(f))*Math.cos(v),d.y=(t+e*Math.cos(f))*Math.sin(v),d.z=e*Math.sin(f),c.push(d.x,d.y,d.z),h.x=t*Math.cos(v),h.y=t*Math.sin(v),g.subVectors(d,h).normalize(),u.push(g.x,g.y,g.z),p.push(_/i),p.push(m/n)}}for(let m=1;m<=n;m++)for(let f=1;f<=i;f++){const _=(i+1)*m+f-1,v=(i+1)*(m-1)+f-1,S=(i+1)*(m-1)+f,M=(i+1)*m+f;l.push(_,v,M),l.push(v,S,M)}this.setIndex(l),this.setAttribute("position",new Se(c,3)),this.setAttribute("normal",new Se(u,3)),this.setAttribute("uv",new Se(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new uu(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc,t.thetaStart,t.thetaLength)}}class hu extends Ye{constructor(t=new ud(new I(-1,-1,0),new I(-1,1,0),new I(1,1,0)),e=64,n=1,i=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:i,closed:r};const a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;const o=new I,l=new I,c=new rt;let u=new I;const p=[],h=[],d=[],g=[];m(),this.setIndex(g),this.setAttribute("position",new Se(p,3)),this.setAttribute("normal",new Se(h,3)),this.setAttribute("uv",new Se(d,2));function m(){for(let S=0;S<e;S++)f(S);f(r===!1?e:0),v(),_()}function f(S){u=t.getPointAt(S/e,u);const M=a.normals[S],E=a.binormals[S];for(let b=0;b<=i;b++){const x=b/i*Math.PI*2,y=Math.sin(x),A=-Math.cos(x);l.x=A*M.x+y*E.x,l.y=A*M.y+y*E.y,l.z=A*M.z+y*E.z,l.normalize(),h.push(l.x,l.y,l.z),o.x=u.x+n*l.x,o.y=u.y+n*l.y,o.z=u.z+n*l.z,p.push(o.x,o.y,o.z)}}function _(){for(let S=1;S<=e;S++)for(let M=1;M<=i;M++){const E=(i+1)*(S-1)+(M-1),b=(i+1)*S+(M-1),x=(i+1)*S+M,y=(i+1)*(S-1)+M;g.push(E,b,y),g.push(b,x,y)}}function v(){for(let S=0;S<=e;S++)for(let M=0;M<=i;M++)c.x=S/e,c.y=M/i,d.push(c.x,c.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new hu(new uo[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}}function Zs(s){const t={};for(const e in s){t[e]={};for(const n in s[e]){const i=s[e][n];if(Th(i))i.isRenderTargetTexture?(kt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(Th(i[0])){const r=[];for(let a=0,o=i.length;a<o;a++)r[a]=i[a].clone();t[e][n]=r}else t[e][n]=i.slice();else t[e][n]=i}}return t}function an(s){const t={};for(let e=0;e<s.length;e++){const n=Zs(s[e]);for(const i in n)t[i]=n[i]}return t}function Th(s){return s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)}function G_(s){const t=[];for(let e=0;e<s.length;e++)t.push(s[e].clone());return t}function gd(s){const t=s.getRenderTarget();return t===null?s.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:re.workingColorSpace}const Vr={clone:Zs,merge:an};var H_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,V_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class hn extends nr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=H_,this.fragmentShader=V_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Zs(t.uniforms),this.uniformsGroups=G_(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const a=this.uniforms[i].value;a&&a.isTexture?e.uniforms[i]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[i]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[i]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[i]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[i]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[i]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[i]={type:"m4",value:a.toArray()}:e.uniforms[i]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}fromJSON(t,e){if(super.fromJSON(t,e),t.uniforms!==void 0)for(const n in t.uniforms){const i=t.uniforms[n];switch(this.uniforms[n]={},i.type){case"t":this.uniforms[n].value=e[i.value]||null;break;case"c":this.uniforms[n].value=new Xt().setHex(i.value);break;case"v2":this.uniforms[n].value=new rt().fromArray(i.value);break;case"v3":this.uniforms[n].value=new I().fromArray(i.value);break;case"v4":this.uniforms[n].value=new Ce().fromArray(i.value);break;case"m3":this.uniforms[n].value=new Wt().fromArray(i.value);break;case"m4":this.uniforms[n].value=new ae().fromArray(i.value);break;default:this.uniforms[n].value=i.value}}if(t.defines!==void 0&&(this.defines=t.defines),t.vertexShader!==void 0&&(this.vertexShader=t.vertexShader),t.fragmentShader!==void 0&&(this.fragmentShader=t.fragmentShader),t.glslVersion!==void 0&&(this.glslVersion=t.glslVersion),t.extensions!==void 0)for(const n in t.extensions)this.extensions[n]=t.extensions[n];return t.lights!==void 0&&(this.lights=t.lights),t.clipping!==void 0&&(this.clipping=t.clipping),this}}class xd extends hn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class _l extends nr{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new Xt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=_c,this.normalScale=new rt(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class W_ extends nr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=fm,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class X_ extends nr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class q_ extends zr{constructor(t){super(),this.isLineDashedMaterial=!0,this.type="LineDashedMaterial",this.scale=1,this.dashSize=3,this.gapSize=1,this.setValues(t)}copy(t){return super.copy(t),this.scale=t.scale,this.dashSize=t.dashSize,this.gapSize=t.gapSize,this}}class vd extends He{static registerNode(t){this.prototype._lightNode=t}constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new Xt(t),this.intensity=e}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}const gl=new ae,wh=new I,Ah=new I;class Y_{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new rt(512,512),this.mapType=En,this.map=null,this.mapPass=null,this.matrix=new ae,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Br,this._frameExtents=new rt(1,1),this._viewportCount=1,this._viewports=[new Ce(0,0,1,1)]}getViewportCount(){return this._viewportCount}getCamera(){return this.camera}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera;wh.setFromMatrixPosition(t.matrixWorld),e.position.copy(wh),Ah.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(Ah),e.updateMatrixWorld(),this._updateMatrix(e,this.matrix,this._frustum)}_updateMatrix(t,e,n,i){gl.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),n.setFromProjectionMatrix(gl,t.coordinateSystem,t.reversedDepth);const r=this._frameExtents,a=i?i.z/r.x:1,o=i?i.w/r.y:1,l=i?i.x/r.x:0,c=i?i.y/r.y:0;t.coordinateSystem===Or||t.reversedDepth?e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,1,0,0,0,0,1):e.set(.5*a,0,0,.5*a+l,0,.5*o,0,.5*o+c,0,0,.5,.5,0,0,0,1),e.multiply(gl)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.mapType=t.mapType,this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return t.intensity=this.intensity,t.bias=this.bias,t.normalBias=this.normalBias,t.radius=this.radius,t.blurSamples=this.blurSamples,t.mapSize=this.mapSize.toArray(),t.mapType=this.mapType,t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Fa=new I,Ba=new qn,$n=new I;class Md extends He{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ae,this.projectionMatrix=new ae,this.projectionMatrixInverse=new ae,this.coordinateSystem=Xn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Fa,Ba,$n),$n.x===1&&$n.y===1&&$n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Fa,Ba,$n.set(1,1,1)).invert()}updateWorldMatrix(t,e,n=!1){super.updateWorldMatrix(t,e,n),this.matrixWorld.decompose(Fa,Ba,$n),$n.x===1&&$n.y===1&&$n.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Fa,Ba,$n.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Ni=new I,Rh=new rt,Ch=new rt;class Vn extends Md{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Fr*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(Bs*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Fr*2*Math.atan(Math.tan(Bs*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Ni.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Ni.x,Ni.y).multiplyScalar(-t/Ni.z),Ni.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Ni.x,Ni.y).multiplyScalar(-t/Ni.z)}getViewSize(t,e){return this.getViewBounds(t,Rh,Ch),e.subVectors(Ch,Rh)}setViewOffset(t,e,n,i,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(Bs*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,r=-.5*i;const a=this.view;if(this.view!==null&&this.view.enabled){const l=a.fullWidth,c=a.fullHeight;r+=a.offsetX*i/l,e-=a.offsetY*n/c,i*=a.width/l,n*=a.height/c}const o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class Po extends Md{constructor(t=-1,e=1,n=1,i=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let r=n-t,a=n+t,o=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,a=r+c*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class Z_ extends Y_{constructor(){super(new Po(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class K_ extends vd{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(He.DEFAULT_UP),this.updateMatrix(),this.target=new He,this.shadow=new Z_}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}class $_ extends vd{constructor(t,e){super(t,e),this.isAmbientLight=!0,this.type="AmbientLight"}}const Rs=-90,Cs=1;class Mc extends He{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new Vn(Rs,Cs,t,e);i.layers=this.layers,this.add(i);const r=new Vn(Rs,Cs,t,e);r.layers=this.layers,this.add(r);const a=new Vn(Rs,Cs,t,e);a.layers=this.layers,this.add(a);const o=new Vn(Rs,Cs,t,e);o.layers=this.layers,this.add(o);const l=new Vn(Rs,Cs,t,e);l.layers=this.layers,this.add(l);const c=new Vn(Rs,Cs,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,r,a,o,l]=e;for(const c of e)this.remove(c);if(t===Xn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===Or)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[r,a,o,l,c,u]=this.children,p=t.getRenderTarget(),h=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const m=n.texture.mipmapsAutoUpdate;n.texture.mipmapsAutoUpdate=!1;let f=!1;t.isWebGLRenderer===!0?f=t.state.buffers.depth.getReversed():f=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,r),t.setRenderTarget(n,1,i),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,2,i),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,3,i),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,i),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.mipmapsAutoUpdate=m,t.setRenderTarget(n,5,i),f&&t.autoClear===!1&&t.clearDepth(),t.render(e,u),t.setRenderTarget(p,h,d),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class J_ extends Vn{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t,this.perCameraFrustumCulled=!1}}class Q_{constructor(){this._previousTime=0,this._currentTime=0,this._startTime=performance.now(),this._delta=0,this._elapsed=0,this._timescale=1,this._document=null,this._pageVisibilityHandler=null}connect(t){this._document=t,t.hidden!==void 0&&(this._pageVisibilityHandler=j_.bind(this),t.addEventListener("visibilitychange",this._pageVisibilityHandler,!1))}disconnect(){this._pageVisibilityHandler!==null&&(this._document.removeEventListener("visibilitychange",this._pageVisibilityHandler),this._pageVisibilityHandler=null),this._document=null}getDelta(){return this._delta/1e3}getElapsed(){return this._elapsed/1e3}getTimescale(){return this._timescale}setTimescale(t){return this._timescale=t,this}reset(){return this._currentTime=performance.now()-this._startTime,this}dispose(){this.disconnect()}update(t){return this._pageVisibilityHandler!==null&&this._document.hidden===!0?this._delta=0:(this._previousTime=this._currentTime,this._currentTime=(t!==void 0?t:performance.now())-this._startTime,this._delta=(this._currentTime-this._previousTime)*this._timescale,this._elapsed+=this._delta),this}}function j_(){this._document.hidden===!1&&this.reset()}const Ph=new ae;class tg{constructor(t,e,n=0,i=1/0){this.ray=new Ao(t,e),this.near=n,this.far=i,this.camera=null,this.layers=new eu,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,e.projectionMatrix.elements[14]).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):he("Raycaster: Unsupported camera type: "+e.type)}setFromXRController(t){return Ph.identity().extractRotation(t.matrixWorld),this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Ph),this}intersectObject(t,e=!0,n=[]){return Sc(t,this,n,e),n.sort(Dh),n}intersectObjects(t,e=!0,n=[]){for(let i=0,r=t.length;i<r;i++)Sc(t[i],this,n,e);return n.sort(Dh),n}}function Dh(s,t){return s.distance-t.distance}function Sc(s,t,e,n){let i=!0;if(s.layers.test(t.layers)&&s.raycast(t,e)===!1&&(i=!1),i===!0&&n===!0){const r=s.children;for(let a=0,o=r.length;a<o;a++)Sc(r[a],t,e,!0)}}class yc{constructor(t=1,e=0,n=0){this.radius=t,this.phi=e,this.theta=n}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=ne(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(ne(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class eg extends Zi{constructor(t,e=null){super(),this.object=t,this.domElement=e,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(t){this.domElement!==null&&this.disconnect(),this.domElement=t}disconnect(){}dispose(){}update(){}}function Lh(s,t,e,n){const i=ng(n);switch(e){case Vf:return s*t;case Zc:return s*t/i.components*i.byteLength;case Kc:return s*t/i.components*i.byteLength;case ds:return s*t*2/i.components*i.byteLength;case $c:return s*t*2/i.components*i.byteLength;case Wf:return s*t*3/i.components*i.byteLength;case ni:return s*t*4/i.components*i.byteLength;case Jc:return s*t*4/i.components*i.byteLength;case Xa:case qa:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case Ya:case Za:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Gl:case Vl:return Math.max(s,16)*Math.max(t,8)/4;case kl:case Hl:return Math.max(s,8)*Math.max(t,8)/2;case Wl:case Xl:case Yl:case Zl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*8;case ql:case io:case Kl:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case $l:return Math.floor((s+3)/4)*Math.floor((t+3)/4)*16;case Jl:return Math.floor((s+4)/5)*Math.floor((t+3)/4)*16;case Ql:return Math.floor((s+4)/5)*Math.floor((t+4)/5)*16;case jl:return Math.floor((s+5)/6)*Math.floor((t+4)/5)*16;case tc:return Math.floor((s+5)/6)*Math.floor((t+5)/6)*16;case ec:return Math.floor((s+7)/8)*Math.floor((t+4)/5)*16;case nc:return Math.floor((s+7)/8)*Math.floor((t+5)/6)*16;case ic:return Math.floor((s+7)/8)*Math.floor((t+7)/8)*16;case sc:return Math.floor((s+9)/10)*Math.floor((t+4)/5)*16;case rc:return Math.floor((s+9)/10)*Math.floor((t+5)/6)*16;case ac:return Math.floor((s+9)/10)*Math.floor((t+7)/8)*16;case oc:return Math.floor((s+9)/10)*Math.floor((t+9)/10)*16;case lc:return Math.floor((s+11)/12)*Math.floor((t+9)/10)*16;case cc:return Math.floor((s+11)/12)*Math.floor((t+11)/12)*16;case uc:case hc:case fc:return Math.ceil(s/4)*Math.ceil(t/4)*16;case dc:case pc:return Math.ceil(s/4)*Math.ceil(t/4)*8;case so:case mc:return Math.ceil(s/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function ng(s){switch(s){case En:case zf:return{byteLength:1,components:1};case Ur:case kf:case dn:return{byteLength:2,components:1};case qc:case Yc:return{byteLength:2,components:4};case si:case Xc:case Wn:return{byteLength:4,components:1};case Gf:case Hf:return{byteLength:4,components:3}}throw new Error(`THREE.TextureUtils: Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Bc}}));typeof window<"u"&&(window.__THREE__?kt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Bc);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Sd(){let s=null,t=!1,e=null,n=null;function i(r,a){n=s.requestAnimationFrame(i),e(r,a)}return{start:function(){t!==!0&&e!==null&&s!==null&&(n=s.requestAnimationFrame(i),t=!0)},stop:function(){s!==null&&s.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){s=r}}}function ig(s){const t=new WeakMap;function e(o,l){const c=o.array,u=o.usage,p=c.byteLength,h=s.createBuffer();s.bindBuffer(l,h),s.bufferData(l,c,u),o.onUploadCallback();let d;if(c instanceof Float32Array)d=s.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)d=s.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?d=s.HALF_FLOAT:d=s.UNSIGNED_SHORT;else if(c instanceof Int16Array)d=s.SHORT;else if(c instanceof Uint32Array)d=s.UNSIGNED_INT;else if(c instanceof Int32Array)d=s.INT;else if(c instanceof Int8Array)d=s.BYTE;else if(c instanceof Uint8Array)d=s.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)d=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:d,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:p}}function n(o,l,c){const u=l.array,p=l.updateRanges;if(s.bindBuffer(c,o),p.length===0)s.bufferSubData(c,0,u);else{p.sort((d,g)=>d.start-g.start);let h=0;for(let d=1;d<p.length;d++){const g=p[h],m=p[d];m.start<=g.start+g.count+1?g.count=Math.max(g.count,m.start+m.count-g.start):(++h,p[h]=m)}p.length=h+1;for(let d=0,g=p.length;d<g;d++){const m=p[d];s.bufferSubData(c,m.start*u.BYTES_PER_ELEMENT,u,m.start,m.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(o){return o.isInterleavedBufferAttribute&&(o=o.data),t.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=t.get(o);l&&(s.deleteBuffer(l.buffer),t.delete(o))}function a(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const u=t.get(o);(!u||u.version<o.version)&&t.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=t.get(o);if(c===void 0)t.set(o,e(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:i,remove:r,update:a}}var sg=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,rg=`#ifdef USE_ALPHAHASH
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
#endif`,ag=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,og=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,lg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,cg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ug=`#ifdef USE_AOMAP
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
#endif`,hg=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,fg=`#ifdef USE_BATCHING
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
#endif`,dg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,pg=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,mg=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,_g=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,gg=`#ifdef USE_IRIDESCENCE
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
#endif`,xg=`#ifdef USE_BUMPMAP
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
#endif`,vg=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,Mg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Sg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,yg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,bg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,Eg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Tg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,wg=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
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
#endif`,Ag=`#define PI 3.141592653589793
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
} // validated`,Rg=`vec3 transformedNormal = objectNormal;
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
#endif`,Cg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Pg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Dg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Lg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Ng="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ig=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ug=`#ifdef USE_ENVMAP
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
#endif`,Og=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	uniform samplerCube envMap;
	#ifdef ENVMAP_TYPE_PMREM
		float roughnessToMip( const in float roughness ) {
			float r = clamp( roughness, 0.0, 1.0 );
			return ENVMAP_MAX_LOD * r * ( 2.0 - r );
		}
	#endif
#endif`,Fg=`#ifdef USE_ENVMAP
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
#endif`,Bg=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,zg=`#ifdef USE_ENVMAP
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
#endif`,kg=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Gg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Hg=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Vg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Wg=`#ifdef USE_GRADIENTMAP
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
}`,Xg=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,qg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Yg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Zg=`uniform bool receiveShadow;
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
#include <lightprobes_pars_fragment>`,Kg=`#ifdef USE_ENVMAP
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
material.diffuseColor = diffuseColor.rgb;`,Jg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Qg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,jg=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,t0=`PhysicalMaterial material;
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
#endif`,e0=`uniform sampler2D dfgLUT;
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
}`,n0=`
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
#endif`,i0=`#if defined( RE_IndirectDiffuse )
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
#endif`,s0=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,r0=`#if NUM_LIGHT_PROBE_GRIDS > 0
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
#endif`,a0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,o0=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,l0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,c0=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,u0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,h0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,f0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,d0=`#if defined( USE_POINTS_UV )
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
#endif`,p0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,m0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,_0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,g0=`#if defined( USE_MORPHCOLORS )
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
#endif`,x0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,v0=`#ifdef USE_MORPHTARGETS
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
#endif`,M0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,S0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,y0=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,b0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,E0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,T0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
		#ifdef FLIP_SIDED
			vBitangent = - vBitangent;
		#endif
	#endif
#endif`,w0=`#ifdef USE_NORMALMAP
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
#endif`,A0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,R0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,C0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,P0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,D0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,L0=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,N0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,I0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,U0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,O0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,F0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,B0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,z0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,k0=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,G0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_SUN_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,H0=`float getShadowMask() {
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
}`,V0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,W0=`#ifdef USE_SKINNING
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
#endif`,X0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,q0=`#ifdef USE_SKINNING
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
#endif`,Y0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Z0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,K0=`#if defined( TONE_MAPPING )
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,J0=`#ifdef USE_TRANSMISSION
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
#endif`,Q0=`#ifdef USE_TRANSMISSION
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
#endif`,j0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,tx=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,ex=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,nx=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ix=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,sx=`uniform sampler2D t2D;
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
}`,rx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,ax=`uniform float backgroundBlurriness;
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
}`,ox=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,lx=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cx=`#include <common>
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
}`,ux=`#if DEPTH_PACKING == 3200
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
}`,hx=`#define DISTANCE
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
}`,fx=`#define DISTANCE
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
}`,dx=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,px=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,mx=`uniform float scale;
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
}`,_x=`uniform vec3 diffuse;
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
}`,gx=`#include <common>
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
}`,xx=`uniform vec3 diffuse;
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
}`,vx=`#define LAMBERT
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
}`,Mx=`#define LAMBERT
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
}`,Sx=`#define MATCAP
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
}`,yx=`#define MATCAP
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
}`,bx=`#define NORMAL
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
}`,Ex=`#define NORMAL
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
}`,Tx=`#define PHONG
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
}`,wx=`#define PHONG
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
}`,Ax=`#define STANDARD
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
}`,Rx=`#define STANDARD
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
}`,Cx=`#define TOON
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
}`,Px=`#define TOON
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
}`,Dx=`uniform float size;
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
}`,Lx=`uniform vec3 diffuse;
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
}`,Nx=`#include <common>
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
}`,Ix=`uniform vec3 color;
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
}`,Ux=`uniform float rotation;
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
}`,Ox=`uniform vec3 diffuse;
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
}`,ee={alphahash_fragment:sg,alphahash_pars_fragment:rg,alphamap_fragment:ag,alphamap_pars_fragment:og,alphatest_fragment:lg,alphatest_pars_fragment:cg,aomap_fragment:ug,aomap_pars_fragment:hg,batching_pars_vertex:fg,batching_vertex:dg,begin_vertex:pg,beginnormal_vertex:mg,bsdfs:_g,iridescence_fragment:gg,bumpmap_pars_fragment:xg,clipping_planes_fragment:vg,clipping_planes_pars_fragment:Mg,clipping_planes_pars_vertex:Sg,clipping_planes_vertex:yg,color_fragment:bg,color_pars_fragment:Eg,color_pars_vertex:Tg,color_vertex:wg,common:Ag,defaultnormal_vertex:Rg,displacementmap_pars_vertex:Cg,displacementmap_vertex:Pg,emissivemap_fragment:Dg,emissivemap_pars_fragment:Lg,colorspace_fragment:Ng,colorspace_pars_fragment:Ig,envmap_fragment:Ug,envmap_common_pars_fragment:Og,envmap_pars_fragment:Fg,envmap_pars_vertex:Bg,envmap_physical_pars_fragment:Kg,envmap_vertex:zg,fog_vertex:kg,fog_pars_vertex:Gg,fog_fragment:Hg,fog_pars_fragment:Vg,gradientmap_pars_fragment:Wg,lightmap_pars_fragment:Xg,lights_lambert_fragment:qg,lights_lambert_pars_fragment:Yg,lights_pars_begin:Zg,lights_toon_fragment:$g,lights_toon_pars_fragment:Jg,lights_phong_fragment:Qg,lights_phong_pars_fragment:jg,lights_physical_fragment:t0,lights_physical_pars_fragment:e0,lights_fragment_begin:n0,lights_fragment_maps:i0,lights_fragment_end:s0,lightprobes_pars_fragment:r0,logdepthbuf_fragment:a0,logdepthbuf_pars_fragment:o0,logdepthbuf_pars_vertex:l0,logdepthbuf_vertex:c0,map_fragment:u0,map_pars_fragment:h0,map_particle_fragment:f0,map_particle_pars_fragment:d0,metalnessmap_fragment:p0,metalnessmap_pars_fragment:m0,morphinstance_vertex:_0,morphcolor_vertex:g0,morphnormal_vertex:x0,morphtarget_pars_vertex:v0,morphtarget_vertex:M0,normal_fragment_begin:S0,normal_fragment_maps:y0,normal_pars_fragment:b0,normal_pars_vertex:E0,normal_vertex:T0,normalmap_pars_fragment:w0,clearcoat_normal_fragment_begin:A0,clearcoat_normal_fragment_maps:R0,clearcoat_pars_fragment:C0,iridescence_pars_fragment:P0,opaque_fragment:D0,packing:L0,premultiplied_alpha_fragment:N0,project_vertex:I0,dithering_fragment:U0,dithering_pars_fragment:O0,roughnessmap_fragment:F0,roughnessmap_pars_fragment:B0,shadowmap_pars_fragment:z0,shadowmap_pars_vertex:k0,shadowmap_vertex:G0,shadowmask_pars_fragment:H0,skinbase_vertex:V0,skinning_pars_vertex:W0,skinning_vertex:X0,skinnormal_vertex:q0,specularmap_fragment:Y0,specularmap_pars_fragment:Z0,tonemapping_fragment:K0,tonemapping_pars_fragment:$0,transmission_fragment:J0,transmission_pars_fragment:Q0,uv_pars_fragment:j0,uv_pars_vertex:tx,uv_vertex:ex,worldpos_vertex:nx,background_vert:ix,background_frag:sx,backgroundCube_vert:rx,backgroundCube_frag:ax,cube_vert:ox,cube_frag:lx,depth_vert:cx,depth_frag:ux,distance_vert:hx,distance_frag:fx,equirect_vert:dx,equirect_frag:px,linedashed_vert:mx,linedashed_frag:_x,meshbasic_vert:gx,meshbasic_frag:xx,meshlambert_vert:vx,meshlambert_frag:Mx,meshmatcap_vert:Sx,meshmatcap_frag:yx,meshnormal_vert:bx,meshnormal_frag:Ex,meshphong_vert:Tx,meshphong_frag:wx,meshphysical_vert:Ax,meshphysical_frag:Rx,meshtoon_vert:Cx,meshtoon_frag:Px,points_vert:Dx,points_frag:Lx,shadow_vert:Nx,shadow_frag:Ix,sprite_vert:Ux,sprite_frag:Ox},wt={common:{diffuse:{value:new Xt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Wt}},envmap:{envMap:{value:null},envMapRotation:{value:new Wt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Wt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Wt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Wt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Wt},normalScale:{value:new rt(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Wt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Wt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Wt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Wt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},sunLights:{value:[],properties:{direction:{},color:{}}},sunLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},sunShadowMatrix:{value:[]},sunShadowCascade:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:[]},probesMin:{value:[]},probesMax:{value:[]},probesResolution:{value:[]}},points:{diffuse:{value:new Xt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0},uvTransform:{value:new Wt}},sprite:{diffuse:{value:new Xt(16777215)},opacity:{value:1},center:{value:new rt(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Wt},alphaMap:{value:null},alphaMapTransform:{value:new Wt},alphaTest:{value:0}}},jn={basic:{uniforms:an([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.fog]),vertexShader:ee.meshbasic_vert,fragmentShader:ee.meshbasic_frag},lambert:{uniforms:an([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new Xt(0)},envMapIntensity:{value:1}}]),vertexShader:ee.meshlambert_vert,fragmentShader:ee.meshlambert_frag},phong:{uniforms:an([wt.common,wt.specularmap,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,wt.lights,{emissive:{value:new Xt(0)},specular:{value:new Xt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:ee.meshphong_vert,fragmentShader:ee.meshphong_frag},standard:{uniforms:an([wt.common,wt.envmap,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.roughnessmap,wt.metalnessmap,wt.fog,wt.lights,{emissive:{value:new Xt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag},toon:{uniforms:an([wt.common,wt.aomap,wt.lightmap,wt.emissivemap,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.gradientmap,wt.fog,wt.lights,{emissive:{value:new Xt(0)}}]),vertexShader:ee.meshtoon_vert,fragmentShader:ee.meshtoon_frag},matcap:{uniforms:an([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,wt.fog,{matcap:{value:null}}]),vertexShader:ee.meshmatcap_vert,fragmentShader:ee.meshmatcap_frag},points:{uniforms:an([wt.points,wt.fog]),vertexShader:ee.points_vert,fragmentShader:ee.points_frag},dashed:{uniforms:an([wt.common,wt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:ee.linedashed_vert,fragmentShader:ee.linedashed_frag},depth:{uniforms:an([wt.common,wt.displacementmap]),vertexShader:ee.depth_vert,fragmentShader:ee.depth_frag},normal:{uniforms:an([wt.common,wt.bumpmap,wt.normalmap,wt.displacementmap,{opacity:{value:1}}]),vertexShader:ee.meshnormal_vert,fragmentShader:ee.meshnormal_frag},sprite:{uniforms:an([wt.sprite,wt.fog]),vertexShader:ee.sprite_vert,fragmentShader:ee.sprite_frag},background:{uniforms:{uvTransform:{value:new Wt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:ee.background_vert,fragmentShader:ee.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Wt}},vertexShader:ee.backgroundCube_vert,fragmentShader:ee.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:ee.cube_vert,fragmentShader:ee.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:ee.equirect_vert,fragmentShader:ee.equirect_frag},distance:{uniforms:an([wt.common,wt.displacementmap,{referencePosition:{value:new I},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:ee.distance_vert,fragmentShader:ee.distance_frag},shadow:{uniforms:an([wt.lights,wt.fog,{color:{value:new Xt(0)},opacity:{value:1}}]),vertexShader:ee.shadow_vert,fragmentShader:ee.shadow_frag}};jn.physical={uniforms:an([jn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Wt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Wt},clearcoatNormalScale:{value:new rt(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Wt},diffuseRoughness:{value:0},diffuseRoughnessMap:{value:null},diffuseRoughnessMapTransform:{value:new Wt},dispersion:{value:0},retroreflectivity:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Wt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Wt},sheen:{value:0},sheenColor:{value:new Xt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Wt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Wt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Wt},transmissionSamplerSize:{value:new rt},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Wt},attenuationDistance:{value:0},attenuationColor:{value:new Xt(0)},specularColor:{value:new Xt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Wt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Wt},anisotropyVector:{value:new rt},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Wt}}]),vertexShader:ee.meshphysical_vert,fragmentShader:ee.meshphysical_frag};const za={r:0,b:0,g:0},Fx=new ae,yd=new Wt;yd.set(-1,0,0,0,1,0,0,0,1);function Bx(s,t,e,n,i,r){const a=new Xt(0);let o=i===!0?0:1,l,c,u=null,p=0,h=null;function d(v){let S=v.isScene===!0?v.background:null;if(S&&S.isTexture){const M=v.backgroundBlurriness>0;S=t.get(S,M)}return S}function g(v){let S=!1;const M=d(v);M===null?f(a,o):M&&M.isColor&&(f(M,1),S=!0);const E=s.xr.getEnvironmentBlendMode();E==="additive"?e.buffers.color.setClear(0,0,0,1,r):E==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,r),(s.autoClear||S)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(v,S){const M=d(S);M&&M.isCubeTexture?(c===void 0&&(c=new Cn(new ir(1,1,1),new hn({name:"BackgroundCubeMaterial",uniforms:Zs(jn.backgroundCube.uniforms),vertexShader:jn.backgroundCube.vertexShader,fragmentShader:jn.backgroundCube.fragmentShader,side:fn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(E,b,x){this.matrixWorld.copyPosition(x.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=M,c.material.uniforms.backgroundBlurriness.value=S.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Fx.makeRotationFromEuler(S.backgroundRotation)).transpose(),M.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(yd),c.material.toneMapped=re.getTransfer(M.colorSpace)!==ge,(u!==M||p!==M.version||h!==s.toneMapping)&&(c.material.needsUpdate=!0,u=M,p=M.version,h=s.toneMapping),c.layers.enableAll(),v.unshift(c,c.geometry,c.material,0,0,null)):M&&M.isTexture&&(l===void 0&&(l=new Cn(new jr(2,2),new hn({name:"BackgroundMaterial",uniforms:Zs(jn.background.uniforms),vertexShader:jn.background.vertexShader,fragmentShader:jn.background.fragmentShader,side:fs,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=M,l.material.uniforms.backgroundIntensity.value=S.backgroundIntensity,l.material.toneMapped=re.getTransfer(M.colorSpace)!==ge,M.matrixAutoUpdate===!0&&M.updateMatrix(),l.material.uniforms.uvTransform.value.copy(M.matrix),(u!==M||p!==M.version||h!==s.toneMapping)&&(l.material.needsUpdate=!0,u=M,p=M.version,h=s.toneMapping),l.layers.enableAll(),v.unshift(l,l.geometry,l.material,0,0,null))}function f(v,S){v.getRGB(za,gd(s)),e.buffers.color.setClear(za.r,za.g,za.b,S,r)}function _(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return a},setClearColor:function(v,S=1){a.set(v),o=S,f(a,o)},getClearAlpha:function(){return o},setClearAlpha:function(v){o=v,f(a,o)},render:g,addToRenderList:m,dispose:_}}function zx(s,t){const e=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=h(null);let r=i,a=!1;function o(C,L,N,D,B){let z=!1;const U=p(C,D,N,L);r!==U&&(r=U,c(r.object)),z=d(C,D,N,B),z&&g(C,D,N,B),B!==null&&t.update(B,s.ELEMENT_ARRAY_BUFFER),(z||a)&&(a=!1,M(C,L,N,D),B!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,t.get(B).buffer))}function l(){return s.createVertexArray()}function c(C){return s.bindVertexArray(C)}function u(C){return s.deleteVertexArray(C)}function p(C,L,N,D){const B=D.wireframe===!0;let z=n[L.id];z===void 0&&(z={},n[L.id]=z);const U=C.isInstancedMesh===!0?C.id:0;let X=z[U];X===void 0&&(X={},z[U]=X);let G=X[N.id];G===void 0&&(G={},X[N.id]=G);let K=G[B];return K===void 0&&(K=h(l()),G[B]=K),K}function h(C){const L=[],N=[],D=[];for(let B=0;B<e;B++)L[B]=0,N[B]=0,D[B]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:L,enabledAttributes:N,attributeDivisors:D,object:C,attributes:{},index:null}}function d(C,L,N,D){const B=r.attributes,z=L.attributes;let U=0;const X=N.getAttributes();for(const G in X)if(X[G].location>=0){const Z=B[G];let at=z[G];if(at===void 0&&(G==="instanceMatrix"&&C.instanceMatrix&&(at=C.instanceMatrix),G==="instanceColor"&&C.instanceColor&&(at=C.instanceColor)),Z===void 0||Z.attribute!==at||at&&Z.data!==at.data)return!0;U++}return r.attributesNum!==U||r.index!==D}function g(C,L,N,D){const B={},z=L.attributes;let U=0;const X=N.getAttributes();for(const G in X)if(X[G].location>=0){let Z=z[G];Z===void 0&&(G==="instanceMatrix"&&C.instanceMatrix&&(Z=C.instanceMatrix),G==="instanceColor"&&C.instanceColor&&(Z=C.instanceColor));const at={};at.attribute=Z,Z&&Z.data&&(at.data=Z.data),B[G]=at,U++}r.attributes=B,r.attributesNum=U,r.index=D}function m(){const C=r.newAttributes;for(let L=0,N=C.length;L<N;L++)C[L]=0}function f(C){_(C,0)}function _(C,L){const N=r.newAttributes,D=r.enabledAttributes,B=r.attributeDivisors;N[C]=1,D[C]===0&&(s.enableVertexAttribArray(C),D[C]=1),B[C]!==L&&(s.vertexAttribDivisor(C,L),B[C]=L)}function v(){const C=r.newAttributes,L=r.enabledAttributes;for(let N=0,D=L.length;N<D;N++)L[N]!==C[N]&&(s.disableVertexAttribArray(N),L[N]=0)}function S(C,L,N,D,B,z,U){U===!0?s.vertexAttribIPointer(C,L,N,B,z):s.vertexAttribPointer(C,L,N,D,B,z)}function M(C,L,N,D){m();const B=D.attributes,z=N.getAttributes(),U=L.defaultAttributeValues;for(const X in z){const G=z[X];if(G.location>=0){let K=B[X];if(K===void 0&&(X==="instanceMatrix"&&C.instanceMatrix&&(K=C.instanceMatrix),X==="instanceColor"&&C.instanceColor&&(K=C.instanceColor)),K!==void 0){const Z=K.normalized,at=K.itemSize,Rt=t.get(K);if(Rt===void 0)continue;const Y=Rt.buffer,it=Rt.type,St=Rt.bytesPerElement,Ct=it===s.INT||it===s.UNSIGNED_INT||K.gpuType===Xc;if(K.isInterleavedBufferAttribute){const gt=K.data,It=gt.isInterleavedBuffer===!0?gt.stride:gt.itemSize,ce=K.offset;if(gt.isInstancedInterleavedBuffer||gt.isInstancedBufferAttribute){for(let Ft=0;Ft<G.locationSize;Ft++)_(G.location+Ft,gt.meshPerAttribute);C.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=gt.meshPerAttribute*gt.count)}else for(let Ft=0;Ft<G.locationSize;Ft++)f(G.location+Ft);s.bindBuffer(s.ARRAY_BUFFER,Y);for(let Ft=0;Ft<G.locationSize;Ft++)S(G.location+Ft,at/G.locationSize,it,Z,It*St,(ce+at/G.locationSize*Ft)*St,Ct)}else{if(K.isInstancedBufferAttribute){for(let gt=0;gt<G.locationSize;gt++)_(G.location+gt,K.meshPerAttribute);C.isInstancedMesh!==!0&&D._maxInstanceCount===void 0&&(D._maxInstanceCount=K.meshPerAttribute*K.count)}else for(let gt=0;gt<G.locationSize;gt++)f(G.location+gt);s.bindBuffer(s.ARRAY_BUFFER,Y);for(let gt=0;gt<G.locationSize;gt++)S(G.location+gt,at/G.locationSize,it,Z,at*St,at/G.locationSize*gt*St,Ct)}}else if(U!==void 0){const Z=U[X];if(Z!==void 0)switch(Z.length){case 2:s.vertexAttrib2fv(G.location,Z);break;case 3:s.vertexAttrib3fv(G.location,Z);break;case 4:s.vertexAttrib4fv(G.location,Z);break;default:s.vertexAttrib1fv(G.location,Z)}}}}v()}function E(){A();for(const C in n){const L=n[C];for(const N in L){const D=L[N];for(const B in D){const z=D[B];for(const U in z)u(z[U].object),delete z[U];delete D[B]}}delete n[C]}}function b(C){if(n[C.id]===void 0)return;const L=n[C.id];for(const N in L){const D=L[N];for(const B in D){const z=D[B];for(const U in z)u(z[U].object),delete z[U];delete D[B]}}delete n[C.id]}function x(C){for(const L in n){const N=n[L];for(const D in N){const B=N[D];if(B[C.id]===void 0)continue;const z=B[C.id];for(const U in z)u(z[U].object),delete z[U];delete B[C.id]}}}function y(C){for(const L in n){const N=n[L],D=C.isInstancedMesh===!0?C.id:0,B=N[D];if(B!==void 0){for(const z in B){const U=B[z];for(const X in U)u(U[X].object),delete U[X];delete B[z]}delete N[D],Object.keys(N).length===0&&delete n[L]}}}function A(){R(),a=!0,r!==i&&(r=i,c(r.object))}function R(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:o,reset:A,resetDefaultState:R,dispose:E,releaseStatesOfGeometry:b,releaseStatesOfObject:y,releaseStatesOfProgram:x,initAttributes:m,enableAttribute:f,disableUnusedAttributes:v}}function kx(s,t,e){let n;function i(l){n=l}function r(l,c){s.drawArrays(n,l,c),e.update(c,n,1)}function a(l,c,u){u!==0&&(s.drawArraysInstanced(n,l,c,u),e.update(c,n,u))}function o(l,c,u){if(u===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,u);let h=0;for(let d=0;d<u;d++)h+=c[d];e.update(h,n,1)}this.setMode=i,this.render=r,this.renderInstances=a,this.renderMultiDraw=o}function Gx(s,t,e,n){let i;function r(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const x=t.get("EXT_texture_filter_anisotropic");i=s.getParameter(x.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function a(x){return!(x!==ni&&n.convert(x)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(x){const y=x===dn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(x!==En&&x!==Wn&&!y&&n.convert(x)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE))}function l(x){if(x==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";x="mediump"}return x==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const u=l(c);u!==c&&(kt("WebGLRenderer:",c,"not supported, using",u,"instead."),c=u);const p=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control"),h=e.logarithmicDepthBuffer===!0&&p===!1;e.reversedDepthBuffer===!0&&p===!1&&kt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer."),e.logarithmicDepthBuffer===!0&&p===!0&&kt("WebGLRenderer: Logarithmic depth buffer is ignored when reversed depth buffer is enabled.");const d=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),m=s.getParameter(s.MAX_TEXTURE_SIZE),f=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),_=s.getParameter(s.MAX_VERTEX_ATTRIBS),v=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),S=s.getParameter(s.MAX_VARYING_VECTORS),M=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),E=s.getParameter(s.MAX_SAMPLES),b=s.getParameter(s.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:a,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:p,maxTextures:d,maxVertexTextures:g,maxTextureSize:m,maxCubemapSize:f,maxAttributes:_,maxVertexUniforms:v,maxVaryings:S,maxFragmentUniforms:M,maxSamples:E,samples:b}}function Hx(s){const t=this;let e=null,n=0,i=!1,r=!1;const a=new _i,o=new Wt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(p,h){const d=p.length!==0||h||n!==0||i;return i=h,n=p.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(p,h){e=u(p,h,0)},this.setState=function(p,h,d){const g=p.clippingPlanes,m=p.clipIntersection,f=p.clipShadows,_=s.get(p);if(!i||g===null||g.length===0||r&&!f)r?u(null):c();else{const v=r?0:n,S=v*4;let M=_.clippingState||null;l.value=M,M=u(g,h,S,d);for(let E=0;E!==S;++E)M[E]=e[E];_.clippingState=M,this.numIntersection=m?this.numPlanes:0,this.numPlanes+=v}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(p,h,d,g){const m=p!==null?p.length:0;let f=null;if(m!==0){if(f=l.value,g!==!0||f===null){const _=d+m*4,v=h.matrixWorldInverse;o.getNormalMatrix(v),(f===null||f.length<_)&&(f=new Float32Array(_));for(let S=0,M=d;S!==m;++S,M+=4)a.copy(p[S]).applyMatrix4(v,o),a.normal.toArray(f,M),f[M+3]=a.constant}l.value=f,l.needsUpdate=!0}return t.numPlanes=m,t.numIntersection=0,f}}class fu extends pn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new id(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},i=new ir(5,5,5),r=new hn({name:"CubemapFromEquirect",uniforms:Zs(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:fn,blending:os});r.uniforms.tEquirect.value=e;const a=new Cn(i,r),o=e.minFilter;return e.minFilter===vi&&(e.minFilter=on),new Mc(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){const r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,i);t.setRenderTarget(r)}}const Nh=256,Vx=3,Wx=20,bd=256,Ed=16,Xx=3,qx=new I,Yx=new Xt;class ho{constructor(t){this._renderer=t,this._cubeSize=0,this._sourceTarget=null,this._cubeCamera=new Mc(1,10,null),this._boxMesh=new Cn(new ir(5,5,5),null),this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null,this._integrationMaterial=null}fromScene(t,e=0,n=.1,i=100,r={}){const{size:a=256,position:o=qx}=r,l=this._renderer;this._setSize(a);const c=this._allocateTarget(),u=this._getSourceTarget(!0);e>0&&(u.texture.mipmapsAutoUpdate=!1);const p=l.autoClear,h=l.autoClearColor,d=l.autoClearDepth,g=l.autoClearStencil,m=t.background;l.autoClear=!0,l.autoClearColor=!0,l.autoClearDepth=!0,l.autoClearStencil=!0,m===null&&(t.background=l.getClearColor(Yx));const f=new Mc(n,i,u);return f.position.copy(o),f.update(l,t),l.autoClear=p,l.autoClearColor=h,l.autoClearDepth=d,l.autoClearStencil=g,t.background=m,e>0&&(u.texture.mipmapsAutoUpdate=!0,this._blur(c,e)),this._applyPMREM(c),c}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Oh(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Uh(),this._compileMaterial(this._equirectMaterial))}dispose(){this._sourceTarget!==null&&this._sourceTarget.dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._integrationMaterial!==null&&this._integrationMaterial.dispose(),this._boxMesh.geometry.dispose()}static lodToRoughness(t,e){return e>0?1-Math.sqrt(1-t/e):0}_setSize(t){this._cubeSize=Math.max(Nh,Kf(t))}_fromTexture(t,e){t.mapping===Vs||t.mapping===Ir?this._setSize(t.image.length===0?Nh:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4);const n=e||this._allocateTarget();return this._textureToCubemap(t),this._applyPMREM(n),n}_allocateTarget(){const t=this._cubeSize,e=Ih(t,!1,!1),n=Math.log2(t)-Vx;for(let i=0;i<=n;i++)e.texture.mipmaps.push({width:t>>i,height:t>>i});return e.texture.name="PMREM",e.texture.isPMREMTexture=!0,e}_getSourceTarget(t=!1){const e=this._cubeSize,n=this._sourceTarget;return(n===null||n.width!==e||t&&n.depthBuffer===!1)&&(n!==null&&n.dispose(),this._sourceTarget=Ih(e,!0,t)),this._sourceTarget}_compileMaterial(t){this._boxMesh.material=t,this._renderer.compile(this._boxMesh,this._cubeCamera.children[0])}_renderCube(t,e,n){const i=this._boxMesh,r=this._cubeCamera;i.material=n,r.renderTarget=t,r.activeMipmapLevel=e;const a=t.width>>e;t.viewport.set(0,0,a,a),r.update(this._renderer,i),t.viewport.set(0,0,t.width,t.height)}_textureToCubemap(t){let e;t.mapping===Vs||t.mapping===Ir?(this._cubemapMaterial===null&&(this._cubemapMaterial=Oh()),e=this._cubemapMaterial,e.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):(this._equirectMaterial===null&&(this._equirectMaterial=Uh()),e=this._equirectMaterial),e.uniforms.envMap.value=t,this._renderCube(this._getSourceTarget(),0,e)}_applyPMREM(t){this._ggxMaterial===null&&(this._ggxMaterial=Zx(),this._integrationMaterial=Kx());const e=this._cubeSize,n=t.texture.mipmaps.length-1,i=this._ggxMaterial.uniforms;i.envMap.value=this._sourceTarget.texture;const r=this._integrationMaterial.uniforms;r.envMap.value=this._sourceTarget.texture,r.sourceLod.value=Math.log2(e/Ed);for(let a=0;a<=n;a++){const o=ho.lodToRoughness(a,n);if(a>n-Xx)r.roughness.value=o,this._renderCube(t,a,this._integrationMaterial);else{const l=o>0?Math.log2(e)+.5*Math.log2(6/(bd*Math.pow(o,4)))+.5:0;i.roughness.value=o,i.lodBias.value=l,this._renderCube(t,a,this._ggxMaterial)}}}_blur(t,e){this._blurMaterial===null&&(this._blurMaterial=$x());const n=this._blurMaterial,i=n.uniforms,r=this._sourceTarget;i.sigma.value=Math.min(e,Math.PI)/Math.SQRT2,i.envMap.value=r.texture,this._renderCube(t,0,n),i.envMap.value=t.texture,this._renderCube(r,0,n)}}function Ih(s,t,e){return new fu(s,{minFilter:vi,generateMipmaps:t,type:dn,colorSpace:ro,depthBuffer:e})}function ta(s,t,e){return new hn({name:s,uniforms:t,vertexShader:ee.cube_vert,fragmentShader:e,side:fn,blending:os,depthTest:!1,depthWrite:!1})}function Zx(){return ta("PMREMGGXConvolution",{envMap:{value:null},roughness:{value:0},lodBias:{value:0}},`

		#define GGX_SAMPLES ${bd}u

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
	`)}function Kx(){return ta("PMREMGGXIntegration",{envMap:{value:null},roughness:{value:0},sourceLod:{value:0},sourceSize:{value:Ed}},`

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
	`)}function $x(){return ta("PMREMSphericalGaussianBlur",{envMap:{value:null},sigma:{value:0}},`

		#define SAMPLES ${Wx}
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
	`)}function Uh(){return ta("PMREMEquirectangularToCubemap",{envMap:{value:null}},`

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
	`)}function Oh(){return ta("PMREMCubemapToCubemap",{envMap:{value:null},flipEnvMap:{value:-1}},`

		varying vec3 vWorldDirection;

		uniform samplerCube envMap;
		uniform float flipEnvMap;

		void main() {

			gl_FragColor = vec4( textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) ).rgb, 1.0 );

		}
	`)}function Jx(s){let t=new WeakMap,e=new WeakMap,n=null;function i(h,d=!1){return h==null?null:d?a(h):r(h)}function r(h){if(h&&h.isTexture){const d=h.mapping;if(d===ko||d===Go)if(t.has(h)){const g=t.get(h).texture;return o(g,h.mapping)}else{const g=h.image;if(g&&g.height>0){const m=new fu(g.height);return m.fromEquirectangularTexture(s,h),t.set(h,m),h.addEventListener("dispose",c),o(m.texture,h.mapping)}else return null}}return h}function a(h){if(h&&h.isTexture&&h.isPMREMTexture!==!0){const d=h.mapping,g=d===ko||d===Go,m=d===Vs||d===Ir;if(g||m){let f=e.get(h);const _=f!==void 0?f.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==_)return n===null&&(n=new ho(s)),f=g?n.fromEquirectangular(h,f):n.fromCubemap(h,f),f.texture.pmremVersion=h.pmremVersion,e.set(h,f),f.texture;if(f!==void 0)return f.texture;{const v=h.image;return g&&v&&v.height>0||m&&v&&l(v)?(n===null&&(n=new ho(s)),f=g?n.fromEquirectangular(h):n.fromCubemap(h),f.texture.pmremVersion=h.pmremVersion,e.set(h,f),h.addEventListener("dispose",u),f.texture):null}}}return h}function o(h,d){return d===ko?h.mapping=Vs:d===Go&&(h.mapping=Ir),h}function l(h){let d=0;const g=6;for(let m=0;m<g;m++)h[m]!==void 0&&d++;return d===g}function c(h){const d=h.target;d.removeEventListener("dispose",c);const g=t.get(d);g!==void 0&&(t.delete(d),g.dispose())}function u(h){const d=h.target;d.removeEventListener("dispose",u);const g=e.get(d);g!==void 0&&(e.delete(d),g.dispose())}function p(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:p}}function Qx(s){const t={};function e(n){if(t[n]!==void 0)return t[n];const i=s.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&Ka("WebGLRenderer: "+n+" extension not supported."),i}}}function jx(s,t,e,n){const i={},r=new WeakMap,a=new FinalizationRegistry(g=>delete i[g]);function o(g){l(g.target)}function l(g){g.index!==null&&t.remove(g.index);for(const f in g.attributes)t.remove(g.attributes[f]);g.removeEventListener("dispose",o),delete i[g.id],a.unregister(g);const m=r.get(g);m&&(t.remove(m),r.delete(g)),n.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,e.memory.geometries--}function c(g,m){return i[m.id]!==void 0||(m.addEventListener("dispose",o),i[m.id]=new WeakRef(m),a.register(m,m.id,m),e.memory.geometries++),m}function u(g){const m=g.attributes;for(const f in m)t.update(m[f],s.ARRAY_BUFFER)}function p(g){const m=g.index,f=g.attributes.position;let _=0;if(f===void 0)return;const v=m!==null?m.array.length:f.array.length/3-1,S=f.count>=65535?ed:td,M=new S(Math.ceil(v/3)*6,1),E=M.array;if(m!==null){const x=m.array;_=m.version;for(let y=0,A=0;y<v;y+=3){const R=x[y+0],C=x[y+1],L=x[y+2];E[A++]=R,E[A++]=C,E[A++]=C,E[A++]=L,E[A++]=L,E[A++]=R}}else{_=f.version;for(let x=0,y=0;x<v;x+=3){const A=x+0,R=x+1,C=x+2;E[y++]=A,E[y++]=R,E[y++]=R,E[y++]=C,E[y++]=C,E[y++]=A}}M.version=_;const b=r.get(g);b&&t.remove(b),r.set(g,M)}function h(g){const m=r.get(g);if(m){const f=g.index;f!==null&&m.version<f.version&&p(g)}else p(g);return r.get(g)}function d(){for(const g in i){const m=i[g].deref();m!==void 0&&l(m)}}return{get:c,update:u,getWireframeAttribute:h,dispose:d}}function tv(s,t,e){let n;function i(p){n=p}let r,a;function o(p){r=p.type,a=p.bytesPerElement}function l(p,h){s.drawElements(n,h,r,p*a),e.update(h,n,1)}function c(p,h,d){d!==0&&(s.drawElementsInstanced(n,h,r,p*a,d),e.update(h,n,d))}function u(p,h,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,r,p,0,d);let m=0;for(let f=0;f<d;f++)m+=h[f];e.update(m,n,1)}this.setMode=i,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=u}function ev(s){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case s.TRIANGLES:e.triangles+=o*(r/3);break;case s.LINES:e.lines+=o*(r/2);break;case s.LINE_STRIP:e.lines+=o*(r-1);break;case s.LINE_LOOP:e.lines+=o*r;break;case s.POINTS:e.points+=o*r;break;default:he("WebGLInfo: Unknown draw mode:",a);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function nv(s,t,e){const n=new WeakMap,i=new Ce;function r(a,o,l){const c=a.morphTargetInfluences,u=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,p=u!==void 0?u.length:0;let h=n.get(o);if(h===void 0||h.count!==p){let A=function(){x.dispose(),n.delete(o),o.removeEventListener("dispose",A)};h!==void 0&&h.texture.dispose();const d=o.morphAttributes.position!==void 0,g=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],_=o.morphAttributes.normal||[],v=o.morphAttributes.color||[];let S=0;d===!0&&(S=1),g===!0&&(S=2),m===!0&&(S=3);let M=o.attributes.position.count*S,E=1;M>t.maxTextureSize&&(E=Math.ceil(M/t.maxTextureSize),M=t.maxTextureSize);const b=new Float32Array(M*E*4*p),x=new Qf(b,M,E,p);x.type=Wn,x.needsUpdate=!0;const y=S*4;for(let R=0;R<p;R++){const C=f[R],L=_[R],N=v[R],D=M*E*4*R;for(let B=0;B<C.count;B++){const z=B*y;d===!0&&(i.fromBufferAttribute(C,B),b[D+z+0]=i.x,b[D+z+1]=i.y,b[D+z+2]=i.z,b[D+z+3]=0),g===!0&&(i.fromBufferAttribute(L,B),b[D+z+4]=i.x,b[D+z+5]=i.y,b[D+z+6]=i.z,b[D+z+7]=0),m===!0&&(i.fromBufferAttribute(N,B),b[D+z+8]=i.x,b[D+z+9]=i.y,b[D+z+10]=i.z,b[D+z+11]=N.itemSize===4?i.w:1)}}h={count:p,texture:x,size:new rt(M,E)},n.set(o,h),o.addEventListener("dispose",A)}if(a.isInstancedMesh===!0&&a.morphTexture!==null)l.getUniforms().setValue(s,"morphTexture",a.morphTexture,e);else{let d=0;for(let m=0;m<c.length;m++)d+=c[m];const g=o.morphTargetsRelative?1:1-d;l.getUniforms().setValue(s,"morphTargetBaseInfluence",g),l.getUniforms().setValue(s,"morphTargetInfluences",c)}l.getUniforms().setValue(s,"morphTargetsTexture",h.texture,e),l.getUniforms().setValue(s,"morphTargetsTextureSize",h.size)}return{update:r}}function iv(s,t,e,n,i){let r=new WeakMap;function a(c){const u=i.render.frame,p=c.geometry,h=t.get(c,p);if(r.get(h)!==u&&(t.update(h),r.set(h,u)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),r.get(c)!==u&&(e.update(c.instanceMatrix,s.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,s.ARRAY_BUFFER),r.set(c,u))),c.isSkinnedMesh){const d=c.skeleton;r.get(d)!==u&&(d.update(),r.set(d,u))}return h}function o(){r=new WeakMap}function l(c){const u=c.target;u.removeEventListener("dispose",l),n.releaseStatesOfObject(u),e.remove(u.instanceMatrix),u.instanceColor!==null&&e.remove(u.instanceColor)}return{update:a,dispose:o}}const sv={[zc]:"LINEAR_TONE_MAPPING",[kc]:"REINHARD_TONE_MAPPING",[Gc]:"CINEON_TONE_MAPPING",[wo]:"ACES_FILMIC_TONE_MAPPING",[Vc]:"AGX_TONE_MAPPING",[Wc]:"NEUTRAL_TONE_MAPPING",[Hc]:"CUSTOM_TONE_MAPPING"};function rv(s,t,e,n,i,r){const a=new pn(t,e,{type:s,depthBuffer:i,stencilBuffer:r,samples:n?4:0,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,resolveDepthBuffer:!1,resolveStencilBuffer:!1});let o=null,l=null,c=null;const u=new Ye;u.setAttribute("position",new Se([-1,3,0,-1,-1,0,3,-1,0],3)),u.setAttribute("uv",new Se([0,2,0,0,2,0],2));const p=new xd({uniforms:{tDiffuse:{value:null}},vertexShader:`
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
			}`,depthTest:!1,depthWrite:!1}),h=new Cn(u,p),d=new Po(-1,1,1,-1,0,1);let g=null,m=null,f=!1,_,v=null,S=[],M=!1;this.setSize=function(E,b){a.setSize(E,b),o!==null&&o.setSize(E,b),l!==null&&l.setSize(E,b);for(let x=0;x<S.length;x++){const y=S[x];y.setSize&&y.setSize(E,b)}},this.setEffects=function(E){S=E,M=S.length>0&&S[0].isRenderPass===!0;const b=a.width,x=a.height;S.length>0&&o===null&&(o=new pn(b,x,{type:dn,depthBuffer:!1,stencilBuffer:!1}),l=new pn(b,x,{type:dn,depthBuffer:!1,stencilBuffer:!1}));const y=i===!0&&S.some(A=>A.needsDepthTexture===!0);y!==(a.depthTexture!==null)&&(y===!0&&c===null&&(c=new qs(b,x),r===!0&&(c.format=Ui,c.type=Ws)),a.dispose(),a.depthTexture=y?c:null,a.resolveDepthBuffer=y,a.storeMultisampledDepthBuffer=y);for(let A=0;A<S.length;A++){const R=S[A];R.setSize&&R.setSize(b,x),y&&R.needsDepthTexture===!0&&R.setDepthTexture&&R.setDepthTexture(c)}},this.begin=function(E,b){if(f||E.toneMapping===Mi&&S.length===0)return!1;if(v=b,b!==null){const x=b.width,y=b.height;(a.width!==x||a.height!==y)&&this.setSize(x,y)}return M===!1&&E.setRenderTarget(a),_=E.toneMapping,E.toneMapping=Mi,!0},this.hasRenderPass=function(){return M},this.end=function(E,b){E.toneMapping=_,f=!0;let x=a,y=o;for(let A=0;A<S.length;A++){const R=S[A];R.enabled!==!1&&(R.render(E,y,x,b),R.needsSwap!==!1&&(x=y,y=y===o?l:o))}if(g!==E.outputColorSpace||m!==E.toneMapping){g=E.outputColorSpace,m=E.toneMapping,p.defines={},re.getTransfer(g)===ge&&(p.defines.SRGB_TRANSFER="");const A=sv[m];A&&(p.defines[A]=""),p.needsUpdate=!0}p.uniforms.tDiffuse.value=x.texture,E.setRenderTarget(v),E.render(h,d),v=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){a.dispose(),o!==null&&o.dispose(),l!==null&&l.dispose(),u.dispose(),p.dispose()}}const Td=new ln,wd=new qs(1,1),Ad=new sd(1),Rd=new Qf,Cd=new Xm,Pd=new id,Fh=[],Bh=[],zh=new Float32Array(16),kh=new Float32Array(9),Gh=new Float32Array(4);function sr(s,t,e){const n=s[0];if(n<=0||n>0)return s;const i=t*e;let r=Fh[i];if(r===void 0&&(r=new Float32Array(i),Fh[i]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,s[a].toArray(r,o)}return r}function Ve(s,t){if(s.length!==t.length)return!1;for(let e=0,n=s.length;e<n;e++)if(s[e]!==t[e])return!1;return!0}function We(s,t){for(let e=0,n=t.length;e<n;e++)s[e]=t[e]}function Do(s,t){let e=Bh[t];e===void 0&&(e=new Int32Array(t),Bh[t]=e);for(let n=0;n!==t;++n)e[n]=s.allocateTextureUnit();return e}function av(s,t){const e=this.cache;e[0]!==t&&(s.uniform1f(this.addr,t),e[0]=t)}function ov(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ve(e,t))return;s.uniform2fv(this.addr,t),We(e,t)}}function lv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(s.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ve(e,t))return;s.uniform3fv(this.addr,t),We(e,t)}}function cv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ve(e,t))return;s.uniform4fv(this.addr,t),We(e,t)}}function uv(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ve(e,t))return;s.uniformMatrix2fv(this.addr,!1,t),We(e,t)}else{if(Ve(e,n))return;Gh.set(n),s.uniformMatrix2fv(this.addr,!1,Gh),We(e,n)}}function hv(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ve(e,t))return;s.uniformMatrix3fv(this.addr,!1,t),We(e,t)}else{if(Ve(e,n))return;kh.set(n),s.uniformMatrix3fv(this.addr,!1,kh),We(e,n)}}function fv(s,t){const e=this.cache,n=t.elements;if(n===void 0){if(Ve(e,t))return;s.uniformMatrix4fv(this.addr,!1,t),We(e,t)}else{if(Ve(e,n))return;zh.set(n),s.uniformMatrix4fv(this.addr,!1,zh),We(e,n)}}function dv(s,t){const e=this.cache;e[0]!==t&&(s.uniform1i(this.addr,t),e[0]=t)}function pv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ve(e,t))return;s.uniform2iv(this.addr,t),We(e,t)}}function mv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ve(e,t))return;s.uniform3iv(this.addr,t),We(e,t)}}function _v(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ve(e,t))return;s.uniform4iv(this.addr,t),We(e,t)}}function gv(s,t){const e=this.cache;e[0]!==t&&(s.uniform1ui(this.addr,t),e[0]=t)}function xv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(s.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ve(e,t))return;s.uniform2uiv(this.addr,t),We(e,t)}}function vv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(s.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ve(e,t))return;s.uniform3uiv(this.addr,t),We(e,t)}}function Mv(s,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(s.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ve(e,t))return;s.uniform4uiv(this.addr,t),We(e,t)}}function Lo(s){return s.version===0&&(s.compareFunction=Yf,s.needsUpdate=!0),s}function Sv(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?r=Lo(wd):r=Td,e.setTexture2D(t||r,i)}function yv(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||Cd,i)}function bv(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_CUBE_SHADOW?r=Lo(Ad):r=Pd,e.setTextureCube(t||r,i)}function Ev(s,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Rd,i)}function Tv(s){switch(s){case 5126:return av;case 35664:return ov;case 35665:return lv;case 35666:return cv;case 35674:return uv;case 35675:return hv;case 35676:return fv;case 5124:case 35670:return dv;case 35667:case 35671:return pv;case 35668:case 35672:return mv;case 35669:case 35673:return _v;case 5125:return gv;case 36294:return xv;case 36295:return vv;case 36296:return Mv;case 35678:case 36198:case 36298:case 36306:case 35682:return Sv;case 35679:case 36299:case 36307:return yv;case 35680:case 36300:case 36308:case 36293:return bv;case 36289:case 36303:case 36311:case 36292:return Ev}}function wv(s,t){s.uniform1fv(this.addr,t)}function Av(s,t){const e=sr(t,this.size,2);s.uniform2fv(this.addr,e)}function Rv(s,t){const e=sr(t,this.size,3);s.uniform3fv(this.addr,e)}function Cv(s,t){const e=sr(t,this.size,4);s.uniform4fv(this.addr,e)}function Pv(s,t){const e=sr(t,this.size,4);s.uniformMatrix2fv(this.addr,!1,e)}function Dv(s,t){const e=sr(t,this.size,9);s.uniformMatrix3fv(this.addr,!1,e)}function Lv(s,t){const e=sr(t,this.size,16);s.uniformMatrix4fv(this.addr,!1,e)}function Nv(s,t){s.uniform1iv(this.addr,t)}function Iv(s,t){s.uniform2iv(this.addr,t)}function Uv(s,t){s.uniform3iv(this.addr,t)}function Ov(s,t){s.uniform4iv(this.addr,t)}function Fv(s,t){s.uniform1uiv(this.addr,t)}function Bv(s,t){s.uniform2uiv(this.addr,t)}function zv(s,t){s.uniform3uiv(this.addr,t)}function kv(s,t){s.uniform4uiv(this.addr,t)}function Gv(s,t,e){const n=this.cache,i=t.length,r=Do(e,i);Ve(n,r)||(s.uniform1iv(this.addr,r),We(n,r));let a;this.type===s.SAMPLER_2D_SHADOW?a=Lo(wd):a=Td;for(let o=0;o!==i;++o)e.setTexture2D(t[o]||a,r[o])}function Hv(s,t,e){const n=this.cache,i=t.length,r=Do(e,i);Ve(n,r)||(s.uniform1iv(this.addr,r),We(n,r));for(let a=0;a!==i;++a)e.setTexture3D(t[a]||Cd,r[a])}function Vv(s,t,e){const n=this.cache,i=t.length,r=Do(e,i);Ve(n,r)||(s.uniform1iv(this.addr,r),We(n,r));let a;this.type===s.SAMPLER_CUBE_SHADOW?a=Lo(Ad):a=Pd;for(let o=0;o!==i;++o)e.setTextureCube(t[o]||a,r[o])}function Wv(s,t,e){const n=this.cache,i=t.length,r=Do(e,i);Ve(n,r)||(s.uniform1iv(this.addr,r),We(n,r));for(let a=0;a!==i;++a)e.setTexture2DArray(t[a]||Rd,r[a])}function Xv(s){switch(s){case 5126:return wv;case 35664:return Av;case 35665:return Rv;case 35666:return Cv;case 35674:return Pv;case 35675:return Dv;case 35676:return Lv;case 5124:case 35670:return Nv;case 35667:case 35671:return Iv;case 35668:case 35672:return Uv;case 35669:case 35673:return Ov;case 5125:return Fv;case 36294:return Bv;case 36295:return zv;case 36296:return kv;case 35678:case 36198:case 36298:case 36306:case 35682:return Gv;case 35679:case 36299:case 36307:return Hv;case 35680:case 36300:case 36308:case 36293:return Vv;case 36289:case 36303:case 36311:case 36292:return Wv}}class qv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Tv(e.type)}}class Yv{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Xv(e.type)}}class Zv{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let r=0,a=i.length;r!==a;++r){const o=i[r];o.setValue(t,e[o.id],n)}}}const xl=/(\w+)(\])?(\[|\.)?/g;function Hh(s,t){s.seq.push(t),s.map[t.id]=t}function Kv(s,t,e){const n=s.name,i=n.length;for(xl.lastIndex=0;;){const r=xl.exec(n),a=xl.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&a+2===i){Hh(e,c===void 0?new qv(o,s,t):new Yv(o,s,t));break}else{let p=e.map[o];p===void 0&&(p=new Zv(o),Hh(e,p)),e=p}}}class $a{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const o=t.getActiveUniform(e,a),l=t.getUniformLocation(e,o.name);Kv(o,l,this)}const i=[],r=[];for(const a of this.seq)a.type===t.SAMPLER_2D_SHADOW||a.type===t.SAMPLER_CUBE_SHADOW||a.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(a):r.push(a);i.length>0&&(this.seq=i.concat(r))}setValue(t,e,n,i){const r=this.map[e];r!==void 0&&r.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let r=0,a=e.length;r!==a;++r){const o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,r=t.length;i!==r;++i){const a=t[i];a.id in e&&n.push(a)}return n}}function Vh(s,t,e){const n=s.createShader(t);return s.shaderSource(n,e),s.compileShader(n),n}const $v=37297;let Jv=0;function Qv(s,t){const e=s.split(`
`),n=[],i=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=i;a<r;a++){const o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}const Wh=new Wt;function jv(s){re._getMatrix(Wh,re.workingColorSpace,s);const t=`mat3( ${Wh.elements.map(e=>e.toFixed(4))} )`;switch(re.getTransfer(s)){case ao:return[t,"LinearTransferOETF"];case ge:return[t,"sRGBTransferOETF"];default:return kt("WebGLProgram: Unsupported color space: ",s),[t,"LinearTransferOETF"]}}function Xh(s,t,e){const n=s.getShaderParameter(t,s.COMPILE_STATUS),r=(s.getShaderInfoLog(t)||"").trim();if(n&&r==="")return"";const a=/ERROR: 0:(\d+)/.exec(r);if(a){const o=parseInt(a[1]);return e.toUpperCase()+`

`+r+`

`+Qv(s.getShaderSource(t),o)}else return r}function tM(s,t){const e=jv(t);return[`vec4 ${s}( vec4 value ) {`,`	return ${e[1]}( vec4( ${e[0]} * value.rgb, value.a ) );`,"}"].join(`
`)}const eM={[zc]:"Linear",[kc]:"Reinhard",[Gc]:"Cineon",[wo]:"ACESFilmic",[Vc]:"AgX",[Wc]:"Neutral",[Hc]:"Custom"};function nM(s,t){const e=eM[t];return e===void 0?(kt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+s+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+s+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const ka=new I;function iM(){re.getLuminanceCoefficients(ka);const s=ka.x.toFixed(4),t=ka.y.toFixed(4),e=ka.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function sM(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(br).join(`
`)}function rM(s){const t=[];for(const e in s){const n=s[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function aM(s,t){const e={},n=s.getProgramParameter(t,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const r=s.getActiveAttrib(t,i),a=r.name;let o=1;r.type===s.FLOAT_MAT2&&(o=2),r.type===s.FLOAT_MAT3&&(o=3),r.type===s.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:s.getAttribLocation(t,a),locationSize:o}}return e}function br(s){return s!==""}function qh(s,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return s.replace(/NUM_SUN_LIGHTS/g,t.numSunLights).replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_SUN_LIGHT_SHADOWS/g,t.numSunLightShadows).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows).replace(/NUM_LIGHT_PROBE_GRIDS/g,t.numLightProbeGrids)}function Yh(s,t){return s.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const oM=/^[ \t]*#include +<([\w\d./]+)>/gm;function bc(s){return s.replace(oM,lM)}function lM(s,t){const e=ee[t];if(e===void 0)throw new Error("THREE.WebGLProgram: Can not resolve #include <"+t+">");return bc(e)}const cM=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Zh(s){return s.replace(cM,uM)}function uM(s,t,e,n){let i="";for(let r=parseInt(t);r<parseInt(e);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function Kh(s){let t=`precision ${s.precision} float;
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
#define LOW_PRECISION`),t}const hM={[Wa]:"SHADOWMAP_TYPE_PCF",[Sr]:"SHADOWMAP_TYPE_VSM"};function fM(s){return hM[s.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const dM={[Ir]:"ENVMAP_MODE_REFRACTION"};function pM(s){return s.envMap===!1?"ENVMAP_MODE_REFLECTION":dM[s.envMapMode]||"ENVMAP_MODE_REFLECTION"}const mM={[Ff]:"ENVMAP_BLENDING_MULTIPLY",[cm]:"ENVMAP_BLENDING_MIX",[um]:"ENVMAP_BLENDING_ADD"};function _M(s){return s.envMap===!1?"ENVMAP_BLENDING_NONE":mM[s.combine]||"ENVMAP_BLENDING_NONE"}function gM(s,t,e,n){const i=s.getContext(),r=e.defines;let a=e.vertexShader,o=e.fragmentShader;const l=fM(e),c=e.envMapPMREM===!0?"ENVMAP_TYPE_PMREM":"ENVMAP_TYPE_CUBE",u=pM(e),p=_M(e),h=sM(e),d=rM(r),g=i.createProgram();let m,f,_=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,d].filter(br).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,d].filter(br).join(`
`),f.length>0&&(f+=`
`)):(m=[Kh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,d,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.diffuseRoughnessMapUv?"#define DIFFUSE_ROUGHNESSMAP_UV "+e.diffuseRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(br).join(`
`),f=[Kh(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,d,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+u:"",e.envMap?"#define "+p:"",e.envMapPMREM?"#define ENVMAP_MAX_LOD "+e.envMapMaxLod+".0":"",e.envMapPMREM?"#define ENVMAP_SIZE "+e.envMapSize+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.diffuseRoughness?"#define USE_DIFFUSE_ROUGHNESS":"",e.diffuseRoughnessMap?"#define USE_DIFFUSE_ROUGHNESSMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.retroreflection?"#define USE_RETROREFLECTION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Mi?"#define TONE_MAPPING":"",e.toneMapping!==Mi?ee.tonemapping_pars_fragment:"",e.toneMapping!==Mi?nM("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",ee.colorspace_pars_fragment,tM("linearToOutputTexel",e.outputColorSpace),iM(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(br).join(`
`)),a=bc(a),a=qh(a,e),a=Yh(a,e),o=bc(o),o=qh(o,e),o=Yh(o,e),a=Zh(a),o=Zh(o),e.isRawShaderMaterial!==!0&&(_=`#version 300 es
`,m=[h,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",e.glslVersion===qu?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===qu?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const v=_+m+a,S=_+f+o,M=Vh(i,i.VERTEX_SHADER,v),E=Vh(i,i.FRAGMENT_SHADER,S);i.attachShader(g,M),i.attachShader(g,E),e.index0AttributeName!==void 0?i.bindAttribLocation(g,0,e.index0AttributeName):e.hasPositionAttribute===!0&&i.bindAttribLocation(g,0,"position"),i.linkProgram(g);function b(R){if(s.debug.checkShaderErrors){const C=i.getProgramInfoLog(g)||"",L=i.getShaderInfoLog(M)||"",N=i.getShaderInfoLog(E)||"",D=C.trim(),B=L.trim(),z=N.trim();let U=!0,X=!0;if(i.getProgramParameter(g,i.LINK_STATUS)===!1)if(U=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,g,M,E);else{const G=Xh(i,M,"vertex"),K=Xh(i,E,"fragment");he("WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(g,i.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+D+`
`+G+`
`+K)}else D!==""?kt("WebGLProgram: Program Info Log:",D):(B===""||z==="")&&(X=!1);X&&(R.diagnostics={runnable:U,programLog:D,vertexShader:{log:B,prefix:m},fragmentShader:{log:z,prefix:f}})}i.deleteShader(M),i.deleteShader(E),x=new $a(i,g),y=aM(i,g)}let x;this.getUniforms=function(){return x===void 0&&b(this),x};let y;this.getAttributes=function(){return y===void 0&&b(this),y};let A=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return A===!1&&(A=i.getProgramParameter(g,$v)),A},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(g),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Jv++,this.cacheKey=t,this.usedTimes=1,this.program=g,this.vertexShader=M,this.fragmentShader=E,this}let xM=0;class vM{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t,e,n){const i=this._getShaderCacheForMaterial(t);return i.has(e)===!1&&(i.add(e),e.usedTimes++),i.has(n)===!1&&(i.add(n),n.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderStage(t){return this._getShaderStage(t.vertexShader)}getFragmentShaderStage(t){return this._getShaderStage(t.fragmentShader)}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new MM(t),e.set(t,n)),n}}class MM{constructor(t){this.id=xM++,this.code=t,this.usedTimes=0}}function SM(s){return s===ds||s===io||s===so}function yM(s,t,e,n,i,r){const a=new eu,o=new vM,l=new Set,c=[],u=new Map,p=n.logarithmicDepthBuffer,h={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function d(x){return l.add(x),x===0?"uv":`uv${x}`}function g(x,y,A,R,C,L){const N=R.fog,D=C.geometry,B=x.isMeshStandardMaterial||x.isMeshLambertMaterial||x.isMeshPhongMaterial?R.environment:null,z=x.isMeshStandardMaterial||x.isMeshLambertMaterial&&!x.envMap||x.isMeshPhongMaterial&&!x.envMap,U=t.get(x.envMap||B,z),X=h[x.type];let G=n.precision;x.precision!==null&&(G=n.getMaxPrecision(x.precision),G!==x.precision&&kt("WebGLProgram.getParameters:",x.precision,"not supported, using",G,"instead."));const K=D.morphAttributes.position||D.morphAttributes.normal||D.morphAttributes.color,Z=K!==void 0?K.length:0;let at=0;D.morphAttributes.position!==void 0&&(at=1),D.morphAttributes.normal!==void 0&&(at=2),D.morphAttributes.color!==void 0&&(at=3);let Rt,Y,it,St;if(X){const yt=jn[X];Rt=yt.vertexShader,Y=yt.fragmentShader}else{Rt=x.vertexShader,Y=x.fragmentShader;const yt=o.getVertexShaderStage(x),de=o.getFragmentShaderStage(x);o.update(x,yt,de),it=yt.id,St=de.id}const Ct=s.getRenderTarget(),gt=s.state.buffers.depth.getReversed(),It=C.isInstancedMesh===!0,ce=C.isBatchedMesh===!0,Ft=!!x.map,Yt=!!x.matcap,ie=!!U,tt=ie&&U.isPMREMTexture===!0,mt=!!x.aoMap,ft=!!x.lightMap,Et=!!x.bumpMap&&x.wireframe===!1,Mt=!!x.normalMap,Vt=!!x.displacementMap,Lt=!!x.emissiveMap,te=!!x.metalnessMap,se=!!x.roughnessMap,oe=x.anisotropy>0,k=x.clearcoat>0,xe=x.diffuseRoughness>0,Zt=x.dispersion>0,Kt=x.retroreflectivity>0,dt=x.iridescence>0,ye=x.sheen>0,Ot=x.transmission>0,zt=oe&&!!x.anisotropyMap,P=k&&!!x.clearcoatMap,w=k&&!!x.clearcoatNormalMap,W=k&&!!x.clearcoatRoughnessMap,st=xe&&!!x.diffuseRoughnessMap,et=dt&&!!x.iridescenceMap,pt=dt&&!!x.iridescenceThicknessMap,vt=ye&&!!x.sheenColorMap,J=ye&&!!x.sheenRoughnessMap,j=!!x.specularMap,ct=!!x.specularColorMap,F=!!x.specularIntensityMap,Q=Ot&&!!x.transmissionMap,$=Ot&&!!x.thicknessMap,_t=!!x.gradientMap,nt=!!x.alphaMap,ut=x.alphaTest>0,Nt=!!x.alphaHash,$t=!!x.extensions;let ot=Mi;x.toneMapped&&(Ct===null||Ct.isXRRenderTarget===!0)&&(ot=s.toneMapping);const Ut=tt?U.isCompressedCubeTexture?U.image[0].mipmaps:U.mipmaps:null,qt={shaderID:X,shaderType:x.type,shaderName:x.name,vertexShader:Rt,fragmentShader:Y,defines:x.defines,customVertexShaderID:it,customFragmentShaderID:St,isRawShaderMaterial:x.isRawShaderMaterial===!0,glslVersion:x.glslVersion,precision:G,batching:ce,batchingColor:ce&&C._colorsTexture!==null,instancing:It,instancingColor:It&&C.instanceColor!==null,instancingMorph:It&&C.morphTexture!==null,outputColorSpace:Ct===null?s.outputColorSpace:Ct.isXRRenderTarget===!0?Ct.texture.colorSpace:re.workingColorSpace,alphaToCoverage:!!x.alphaToCoverage,map:Ft,matcap:Yt,envMap:ie,envMapMode:ie&&U.mapping,envMapPMREM:tt,envMapMaxLod:tt?Ut.length-1:null,envMapSize:tt?Ut[0].width:null,aoMap:mt,lightMap:ft,bumpMap:Et,normalMap:Mt,displacementMap:Vt,emissiveMap:Lt,normalMapObjectSpace:Mt&&x.normalMapType===dm,normalMapTangentSpace:Mt&&x.normalMapType===_c,packedNormalMap:Mt&&x.normalMapType===_c&&SM(x.normalMap.format),metalnessMap:te,roughnessMap:se,anisotropy:oe,anisotropyMap:zt,clearcoat:k,clearcoatMap:P,clearcoatNormalMap:w,clearcoatRoughnessMap:W,diffuseRoughness:xe,diffuseRoughnessMap:st,dispersion:Zt,retroreflection:Kt,iridescence:dt,iridescenceMap:et,iridescenceThicknessMap:pt,sheen:ye,sheenColorMap:vt,sheenRoughnessMap:J,specularMap:j,specularColorMap:ct,specularIntensityMap:F,transmission:Ot,transmissionMap:Q,thicknessMap:$,gradientMap:_t,opaque:x.transparent===!1&&x.blending===wr&&x.alphaToCoverage===!1,alphaMap:nt,alphaTest:ut,alphaHash:Nt,combine:x.combine,mapUv:Ft&&d(x.map.channel),aoMapUv:mt&&d(x.aoMap.channel),lightMapUv:ft&&d(x.lightMap.channel),bumpMapUv:Et&&d(x.bumpMap.channel),normalMapUv:Mt&&d(x.normalMap.channel),displacementMapUv:Vt&&d(x.displacementMap.channel),emissiveMapUv:Lt&&d(x.emissiveMap.channel),metalnessMapUv:te&&d(x.metalnessMap.channel),roughnessMapUv:se&&d(x.roughnessMap.channel),anisotropyMapUv:zt&&d(x.anisotropyMap.channel),clearcoatMapUv:P&&d(x.clearcoatMap.channel),clearcoatNormalMapUv:w&&d(x.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:W&&d(x.clearcoatRoughnessMap.channel),diffuseRoughnessMapUv:st&&d(x.diffuseRoughnessMap.channel),iridescenceMapUv:et&&d(x.iridescenceMap.channel),iridescenceThicknessMapUv:pt&&d(x.iridescenceThicknessMap.channel),sheenColorMapUv:vt&&d(x.sheenColorMap.channel),sheenRoughnessMapUv:J&&d(x.sheenRoughnessMap.channel),specularMapUv:j&&d(x.specularMap.channel),specularColorMapUv:ct&&d(x.specularColorMap.channel),specularIntensityMapUv:F&&d(x.specularIntensityMap.channel),transmissionMapUv:Q&&d(x.transmissionMap.channel),thicknessMapUv:$&&d(x.thicknessMap.channel),alphaMapUv:nt&&d(x.alphaMap.channel),vertexTangents:!!D.attributes.tangent&&(Mt||oe),vertexNormals:!!D.attributes.normal,vertexColors:x.vertexColors,vertexAlphas:x.vertexColors===!0&&!!D.attributes.color&&D.attributes.color.itemSize===4,pointsUvs:C.isPoints===!0&&!!D.attributes.uv&&(Ft||nt),fog:!!N,useFog:x.fog===!0,fogExp2:!!N&&N.isFogExp2,flatShading:x.wireframe===!1&&(x.flatShading===!0||D.attributes.normal===void 0&&Mt===!1&&(x.isMeshLambertMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isMeshPhysicalMaterial)),sizeAttenuation:x.sizeAttenuation===!0,logarithmicDepthBuffer:p,reversedDepthBuffer:gt,skinning:C.isSkinnedMesh===!0,hasPositionAttribute:D.attributes.position!==void 0,morphTargets:D.morphAttributes.position!==void 0,morphNormals:D.morphAttributes.normal!==void 0,morphColors:D.morphAttributes.color!==void 0,morphTargetsCount:Z,morphTextureStride:at,numSunLights:y.sun.length,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numSunLightShadows:y.sunShadowMap.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numLightProbeGrids:L.filter(yt=>yt.texture!==null).length,numClippingPlanes:r.numPlanes,numClipIntersection:r.numIntersection,dithering:x.dithering,shadowMapEnabled:s.shadowMap.enabled&&A.length>0,shadowMapType:s.shadowMap.type,toneMapping:ot,decodeVideoTexture:Ft&&x.map.isVideoTexture===!0&&re.getTransfer(x.map.colorSpace)===ge,decodeVideoTextureEmissive:Lt&&x.emissiveMap.isVideoTexture===!0&&re.getTransfer(x.emissiveMap.colorSpace)===ge,premultipliedAlpha:x.premultipliedAlpha,doubleSided:x.side===ti,flipSided:x.side===fn,useDepthPacking:x.depthPacking>=0,depthPacking:x.depthPacking||0,index0AttributeName:x.index0AttributeName,extensionClipCullDistance:$t&&x.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:($t&&x.extensions.multiDraw===!0||ce)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:x.customProgramCacheKey()};return qt.vertexUv1s=l.has(1),qt.vertexUv2s=l.has(2),qt.vertexUv3s=l.has(3),l.clear(),qt}function m(x){const y=[];if(x.shaderID?y.push(x.shaderID):(y.push(x.customVertexShaderID),y.push(x.customFragmentShaderID)),x.defines!==void 0)for(const A in x.defines)y.push(A),y.push(x.defines[A]);return x.isRawShaderMaterial===!1&&(f(y,x),_(y,x),y.push(s.outputColorSpace)),y.push(x.customProgramCacheKey),y.join()}function f(x,y){x.push(y.precision),x.push(y.outputColorSpace),x.push(y.envMapMode),x.push(y.envMapPMREM),x.push(y.envMapMaxLod),x.push(y.envMapSize),x.push(y.mapUv),x.push(y.alphaMapUv),x.push(y.lightMapUv),x.push(y.aoMapUv),x.push(y.bumpMapUv),x.push(y.normalMapUv),x.push(y.displacementMapUv),x.push(y.emissiveMapUv),x.push(y.metalnessMapUv),x.push(y.roughnessMapUv),x.push(y.anisotropyMapUv),x.push(y.clearcoatMapUv),x.push(y.clearcoatNormalMapUv),x.push(y.clearcoatRoughnessMapUv),x.push(y.diffuseRoughnessMapUv),x.push(y.iridescenceMapUv),x.push(y.iridescenceThicknessMapUv),x.push(y.sheenColorMapUv),x.push(y.sheenRoughnessMapUv),x.push(y.specularMapUv),x.push(y.specularColorMapUv),x.push(y.specularIntensityMapUv),x.push(y.transmissionMapUv),x.push(y.thicknessMapUv),x.push(y.combine),x.push(y.fogExp2),x.push(y.sizeAttenuation),x.push(y.morphTargetsCount),x.push(y.numSunLights),x.push(y.numDirLights),x.push(y.numPointLights),x.push(y.numSpotLights),x.push(y.numSpotLightMaps),x.push(y.numHemiLights),x.push(y.numRectAreaLights),x.push(y.numSunLightShadows),x.push(y.numDirLightShadows),x.push(y.numPointLightShadows),x.push(y.numSpotLightShadows),x.push(y.numSpotLightShadowsWithMaps),x.push(y.numLightProbes),x.push(y.numLightProbeGrids),x.push(y.shadowMapType),x.push(y.toneMapping),x.push(y.numClippingPlanes),x.push(y.numClipIntersection),x.push(y.depthPacking)}function _(x,y){a.disableAll(),y.instancing&&a.enable(0),y.instancingColor&&a.enable(1),y.instancingMorph&&a.enable(2),y.matcap&&a.enable(3),y.envMap&&a.enable(4),y.normalMapObjectSpace&&a.enable(5),y.normalMapTangentSpace&&a.enable(6),y.clearcoat&&a.enable(7),y.iridescence&&a.enable(8),y.alphaTest&&a.enable(9),y.vertexColors&&a.enable(10),y.vertexAlphas&&a.enable(11),y.vertexUv1s&&a.enable(12),y.vertexUv2s&&a.enable(13),y.vertexUv3s&&a.enable(14),y.vertexTangents&&a.enable(15),y.anisotropy&&a.enable(16),y.alphaHash&&a.enable(17),y.batching&&a.enable(18),y.dispersion&&a.enable(19),y.retroreflection&&a.enable(24),y.diffuseRoughness&&a.enable(25),y.batchingColor&&a.enable(20),y.gradientMap&&a.enable(21),y.packedNormalMap&&a.enable(22),y.vertexNormals&&a.enable(23),x.push(a.mask),a.disableAll(),y.fog&&a.enable(0),y.useFog&&a.enable(1),y.flatShading&&a.enable(2),y.logarithmicDepthBuffer&&a.enable(3),y.reversedDepthBuffer&&a.enable(4),y.skinning&&a.enable(5),y.morphTargets&&a.enable(6),y.morphNormals&&a.enable(7),y.morphColors&&a.enable(8),y.premultipliedAlpha&&a.enable(9),y.shadowMapEnabled&&a.enable(10),y.doubleSided&&a.enable(11),y.flipSided&&a.enable(12),y.useDepthPacking&&a.enable(13),y.dithering&&a.enable(14),y.transmission&&a.enable(15),y.sheen&&a.enable(16),y.opaque&&a.enable(17),y.pointsUvs&&a.enable(18),y.decodeVideoTexture&&a.enable(19),y.decodeVideoTextureEmissive&&a.enable(20),y.alphaToCoverage&&a.enable(21),y.numLightProbeGrids>0&&a.enable(22),y.hasPositionAttribute&&a.enable(23),x.push(a.mask)}function v(x){const y=h[x.type];let A;if(y){const R=jn[y];A=Vr.clone(R.uniforms)}else A=x.uniforms;return A}function S(x,y){let A=u.get(y);return A!==void 0?++A.usedTimes:(A=new gM(s,y,x,i),c.push(A),u.set(y,A)),A}function M(x){if(--x.usedTimes===0){const y=c.indexOf(x);c[y]=c[c.length-1],c.pop(),u.delete(x.cacheKey),x.destroy()}}function E(x){o.remove(x)}function b(){o.dispose()}return{getParameters:g,getProgramCacheKey:m,getUniforms:v,acquireProgram:S,releaseProgram:M,releaseShaderCache:E,programs:c,dispose:b}}function bM(){let s=new WeakMap;function t(a){return s.has(a)}function e(a){let o=s.get(a);return o===void 0&&(o={},s.set(a,o)),o}function n(a){s.delete(a)}function i(a,o,l){s.get(a)[o]=l}function r(){s=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:r}}function EM(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.material.id!==t.material.id?s.material.id-t.material.id:s.materialVariant!==t.materialVariant?s.materialVariant-t.materialVariant:s.z!==t.z?s.z-t.z:s.id-t.id}function $h(s,t){return s.groupOrder!==t.groupOrder?s.groupOrder-t.groupOrder:s.renderOrder!==t.renderOrder?s.renderOrder-t.renderOrder:s.z!==t.z?t.z-s.z:s.id-t.id}function Jh(){const s=[];let t=0;const e=[],n=[],i=[];function r(){t=0,e.length=0,n.length=0,i.length=0}function a(h){let d=0;return h.isInstancedMesh&&(d+=2),h.isSkinnedMesh&&(d+=1),d}function o(h,d,g,m,f,_){let v=s[t];return v===void 0?(v={id:h.id,object:h,geometry:d,material:g,materialVariant:a(h),groupOrder:m,renderOrder:h.renderOrder,z:f,group:_},s[t]=v):(v.id=h.id,v.object=h,v.geometry=d,v.material=g,v.materialVariant=a(h),v.groupOrder=m,v.renderOrder=h.renderOrder,v.z=f,v.group=_),t++,v}function l(h,d,g,m,f,_,v){v.reversedDepth===!0&&(f=-f);const S=o(h,d,g,m,f,_);g.transmission>0?n.push(S):g.transparent===!0?i.push(S):e.push(S)}function c(h,d,g,m,f,_){const v=o(h,d,g,m,f,_);g.transmission>0?n.unshift(v):g.transparent===!0?i.unshift(v):e.unshift(v)}function u(h,d){e.length>1&&e.sort(h||EM),n.length>1&&n.sort(d||$h),i.length>1&&i.sort(d||$h)}function p(){for(let h=t,d=s.length;h<d;h++){const g=s[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:i,init:r,push:l,unshift:c,finish:p,sort:u}}function TM(){let s=new WeakMap;function t(n,i){const r=s.get(n);let a;return r===void 0?(a=new Jh,s.set(n,[a])):i>=r.length?(a=new Jh,r.push(a)):a=r[i],a}function e(){s=new WeakMap}return{get:t,dispose:e}}function wM(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={direction:new I,color:new Xt};break;case"SpotLight":e={position:new I,direction:new I,color:new Xt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new I,color:new Xt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new I,skyColor:new Xt,groundColor:new Xt};break;case"RectAreaLight":e={color:new Xt,position:new I,halfWidth:new I,halfHeight:new I};break}return s[t.id]=e,e}}}function AM(){const s={};return{get:function(t){if(s[t.id]!==void 0)return s[t.id];let e;switch(t.type){case"SunLight":case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new rt,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[t.id]=e,e}}}let RM=0;function CM(s,t){return(t.castShadow?2:0)-(s.castShadow?2:0)+(t.map?1:0)-(s.map?1:0)}function PM(s){const t=new wM,e=AM(),n={version:0,hash:{sunLength:-1,directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numSunShadows:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],sun:[],sunShadow:[],sunShadowMap:[],sunShadowMatrix:[],sunShadowCascade:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new I);const i=new I,r=new ae,a=new ae;function o(c){let u=0,p=0,h=0;for(let L=0;L<9;L++)n.probe[L].set(0,0,0);let d=0,g=0,m=0,f=0,_=0,v=0,S=0,M=0,E=0,b=0,x=0,y=0,A=0,R=0;c.sort(CM);for(let L=0,N=c.length;L<N;L++){const D=c[L],B=D.color,z=D.intensity,U=D.distance;let X=null;if(D.shadow&&D.shadow.map&&(D.shadow.map.texture.format===ds?X=D.shadow.map.texture:X=D.shadow.map.depthTexture||D.shadow.map.texture),D.isAmbientLight)u+=B.r*z,p+=B.g*z,h+=B.b*z;else if(D.isLightProbe){for(let G=0;G<9;G++)n.probe[G].addScaledVector(D.sh.coefficients[G],z);R++}else if(D.isSunLight){const G=t.get(D);if(G.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const K=D.shadow,Z=e.get(D);Z.shadowIntensity=K.intensity,Z.shadowBias=K.bias,Z.shadowNormalBias=K.normalBias,Z.shadowRadius=K.radius,Z.shadowMapSize.copy(K.mapSize).multiply(K.getFrameExtents()),n.sunShadow[g]=Z,n.sunShadowMap[g]=X;const at=K.getViewportCount();for(let Rt=0;Rt<at;Rt++)n.sunShadowMatrix[m+Rt]=K.getMatrix(Rt),n.sunShadowCascade[m+Rt]=K._cascadeData[Rt];m+=at,g++}n.sun[d]=G,d++}else if(D.isDirectionalLight){const G=t.get(D);if(G.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const K=D.shadow,Z=e.get(D);Z.shadowIntensity=K.intensity,Z.shadowBias=K.bias,Z.shadowNormalBias=K.normalBias,Z.shadowRadius=K.radius,Z.shadowMapSize=K.mapSize,n.directionalShadow[f]=Z,n.directionalShadowMap[f]=X,n.directionalShadowMatrix[f]=D.shadow.matrix,E++}n.directional[f]=G,f++}else if(D.isSpotLight){const G=t.get(D);G.position.setFromMatrixPosition(D.matrixWorld),G.color.copy(B).multiplyScalar(z),G.distance=U,G.coneCos=Math.cos(D.angle),G.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),G.decay=D.decay,n.spot[v]=G;const K=D.shadow;if(D.map&&(n.spotLightMap[y]=D.map,y++,K.updateMatrices(D),D.castShadow&&A++),n.spotLightMatrix[v]=K.matrix,D.castShadow){const Z=e.get(D);Z.shadowIntensity=K.intensity,Z.shadowBias=K.bias,Z.shadowNormalBias=K.normalBias,Z.shadowRadius=K.radius,Z.shadowMapSize=K.mapSize,n.spotShadow[v]=Z,n.spotShadowMap[v]=X,x++}v++}else if(D.isRectAreaLight){const G=t.get(D);G.color.copy(B).multiplyScalar(z),G.halfWidth.set(D.width*.5,0,0),G.halfHeight.set(0,D.height*.5,0),n.rectArea[S]=G,S++}else if(D.isPointLight){const G=t.get(D);if(G.color.copy(D.color).multiplyScalar(D.intensity),G.distance=D.distance,G.decay=D.decay,D.castShadow){const K=D.shadow,Z=e.get(D);Z.shadowIntensity=K.intensity,Z.shadowBias=K.bias,Z.shadowNormalBias=K.normalBias,Z.shadowRadius=K.radius,Z.shadowMapSize=K.mapSize,Z.shadowCameraNear=K.camera.near,Z.shadowCameraFar=K.camera.far,n.pointShadow[_]=Z,n.pointShadowMap[_]=X,n.pointShadowMatrix[_]=D.shadow.matrix,b++}n.point[_]=G,_++}else if(D.isHemisphereLight){const G=t.get(D);G.skyColor.copy(D.color).multiplyScalar(z),G.groundColor.copy(D.groundColor).multiplyScalar(z),n.hemi[M]=G,M++}}S>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=wt.LTC_FLOAT_1,n.rectAreaLTC2=wt.LTC_FLOAT_2):(n.rectAreaLTC1=wt.LTC_HALF_1,n.rectAreaLTC2=wt.LTC_HALF_2)),n.ambient[0]=u,n.ambient[1]=p,n.ambient[2]=h;const C=n.hash;(C.sunLength!==d||C.directionalLength!==f||C.pointLength!==_||C.spotLength!==v||C.rectAreaLength!==S||C.hemiLength!==M||C.numSunShadows!==g||C.numDirectionalShadows!==E||C.numPointShadows!==b||C.numSpotShadows!==x||C.numSpotMaps!==y||C.numLightProbes!==R)&&(n.sun.length=d,n.directional.length=f,n.spot.length=v,n.rectArea.length=S,n.point.length=_,n.hemi.length=M,n.sunShadow.length=g,n.sunShadowMap.length=g,n.sunShadowMatrix.length=m,n.sunShadowCascade.length=m,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.directionalShadowMatrix.length=E,n.pointShadow.length=b,n.pointShadowMap.length=b,n.pointShadowMatrix.length=b,n.spotShadow.length=x,n.spotShadowMap.length=x,n.spotLightMatrix.length=x+y-A,n.spotLightMap.length=y,n.numSpotLightShadowsWithMaps=A,n.numLightProbes=R,C.sunLength=d,C.directionalLength=f,C.pointLength=_,C.spotLength=v,C.rectAreaLength=S,C.hemiLength=M,C.numSunShadows=g,C.numDirectionalShadows=E,C.numPointShadows=b,C.numSpotShadows=x,C.numSpotMaps=y,C.numLightProbes=R,n.version=RM++)}function l(c,u){let p=0,h=0,d=0,g=0,m=0,f=0;const _=u.matrixWorldInverse;for(let v=0,S=c.length;v<S;v++){const M=c[v];if(M.isSunLight){const E=n.sun[p];E.direction.setFromMatrixPosition(M.matrixWorld),E.direction.transformDirection(_),p++}else if(M.isDirectionalLight){const E=n.directional[h];E.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),E.direction.sub(i),E.direction.transformDirection(_),h++}else if(M.isSpotLight){const E=n.spot[g];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(_),E.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),E.direction.sub(i),E.direction.transformDirection(_),g++}else if(M.isRectAreaLight){const E=n.rectArea[m];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(_),a.identity(),r.copy(M.matrixWorld),r.premultiply(_),a.extractRotation(r),E.halfWidth.set(M.width*.5,0,0),E.halfHeight.set(0,M.height*.5,0),E.halfWidth.applyMatrix4(a),E.halfHeight.applyMatrix4(a),m++}else if(M.isPointLight){const E=n.point[d];E.position.setFromMatrixPosition(M.matrixWorld),E.position.applyMatrix4(_),d++}else if(M.isHemisphereLight){const E=n.hemi[f];E.direction.setFromMatrixPosition(M.matrixWorld),E.direction.transformDirection(_),f++}}}return{setup:o,setupView:l,state:n}}function Qh(s){const t=new PM(s),e=[],n=[],i=[];function r(p){u.camera=p,e.length=0,n.length=0,i.length=0}function a(p){p.isLightProbeGrid?i.push(p):e.push(p)}function o(p){n.push(p)}function l(){t.setup(e),i.sort((p,h)=>p.priority-h.priority||p.id-h.id)}function c(p){t.setupView(e,p)}const u={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:r,state:u,setupLights:l,setupLightsView:c,pushLight:a,pushShadow:o}}function DM(s){let t=new WeakMap;function e(i,r=0){const a=t.get(i);let o;return a===void 0?(o=new Qh(s),t.set(i,[o])):r>=a.length?(o=new Qh(s),a.push(o)):o=a[r],o}function n(){t=new WeakMap}return{get:e,dispose:n}}const LM=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,NM=`uniform sampler2D shadow_pass;
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
}`,IM=[new I(1,0,0),new I(-1,0,0),new I(0,1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1)],UM=[new I(0,-1,0),new I(0,-1,0),new I(0,0,1),new I(0,0,-1),new I(0,-1,0),new I(0,-1,0)],jh=new ae,xr=new I,vl=new I;function OM(s,t,e){let n=new Br;const i=new rt,r=new rt,a=new Ce,o=new W_,l=new X_,c={},u=e.maxTextureSize,p={[fs]:fn,[fn]:fs,[ti]:ti},h=new hn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new rt},radius:{value:4}},vertexShader:LM,fragmentShader:NM}),d=h.clone();d.defines.HORIZONTAL_PASS=1;const g=new Ye;g.setAttribute("position",new Gi(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const m=new Cn(g,h),f=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Wa;let _=this.type;this.render=function(b,x,y){if(f.enabled===!1||f.autoUpdate===!1&&f.needsUpdate===!1||b.length===0)return;this.type===Wp&&(kt("WebGLShadowMap: PCFSoftShadowMap has been removed. Using PCFShadowMap instead."),this.type=Wa);const A=s.getRenderTarget(),R=s.getActiveCubeFace(),C=s.getActiveMipmapLevel(),L=s.state;L.setBlending(os),L.buffers.depth.getReversed()===!0?L.buffers.color.setClear(0,0,0,0):L.buffers.color.setClear(1,1,1,1),L.buffers.depth.setTest(!0),L.setScissorTest(!1);const N=_!==this.type;N&&x.traverse(function(D){D.material&&(Array.isArray(D.material)?D.material.forEach(B=>B.needsUpdate=!0):D.material.needsUpdate=!0)});for(let D=0,B=b.length;D<B;D++){const z=b[D],U=z.shadow;if(U===void 0){kt("WebGLShadowMap:",z,"has no shadow.");continue}if(U.autoUpdate===!1&&U.needsUpdate===!1)continue;i.copy(U.mapSize);const X=U.getFrameExtents();i.multiply(X),r.copy(U.mapSize),(i.x>u||i.y>u)&&(i.x>u&&(r.x=Math.floor(u/X.x),i.x=r.x*X.x,U.mapSize.x=r.x),i.y>u&&(r.y=Math.floor(u/X.y),i.y=r.y*X.y,U.mapSize.y=r.y));const G=s.state.buffers.depth.getReversed();if(U.camera._reversedDepth=G,U.map===null||N===!0){if(U.map!==null&&(U.map.depthTexture!==null&&(U.map.depthTexture.dispose(),U.map.depthTexture=null),U.map.dispose()),this.type===Sr){if(z.isPointLight){kt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}U.map=new pn(i.x,i.y,{format:ds,type:dn,minFilter:on,magFilter:on,generateMipmaps:!1}),U.map.texture.name=z.name+".shadowMap",U.map.depthTexture=new qs(i.x,i.y,Wn),U.map.depthTexture.name=z.name+".shadowMapDepth",U.map.depthTexture.format=Wi,U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=Qe,U.map.depthTexture.magFilter=Qe}else z.isPointLight?(U.map=new fu(i.x),U.map.depthTexture=new sd(i.x,si)):(U.map=new pn(i.x,i.y),U.map.depthTexture=new qs(i.x,i.y,si)),U.map.depthTexture.name=z.name+".shadowMap",U.map.depthTexture.format=Wi,this.type===Wa?(U.map.depthTexture.compareFunction=G?qf:Xf,U.map.depthTexture.minFilter=on,U.map.depthTexture.magFilter=on):(U.map.depthTexture.compareFunction=null,U.map.depthTexture.minFilter=Qe,U.map.depthTexture.magFilter=Qe);U.camera.updateProjectionMatrix()}U.map.isWebGLCubeRenderTarget!==!0&&(U.map.width!==i.x||U.map.height!==i.y)&&U.map.setSize(i.x,i.y);const K=U.map.isWebGLCubeRenderTarget?6:U.getViewportCount();z.isPointLight!==!0&&U.updateMatrices(z,y);const Z=(U.camera.layers.mask&4294967294)!==0?U.camera.layers:y.layers;for(let at=0;at<K;at++){const Rt=U.getCamera(at);if(z.isPointLight){const Y=U.camera,it=U.matrix,St=z.distance||Y.far;St!==Y.far&&(Y.far=St,Y.updateProjectionMatrix()),xr.setFromMatrixPosition(z.matrixWorld),Y.position.copy(xr),vl.copy(Y.position),vl.add(IM[at]),Y.up.copy(UM[at]),Y.lookAt(vl),Y.updateMatrixWorld(),it.makeTranslation(-xr.x,-xr.y,-xr.z),jh.multiplyMatrices(Y.projectionMatrix,Y.matrixWorldInverse),U._frustum.setFromProjectionMatrix(jh,Y.coordinateSystem,Y.reversedDepth)}if(U.map.isWebGLCubeRenderTarget)s.setRenderTarget(U.map,at),s.clear();else{at===0&&(s.setRenderTarget(U.map),s.clear());const Y=U.getViewport(at);a.set(r.x*Y.x,r.y*Y.y,r.x*Y.z,r.y*Y.w),L.viewport(a)}n=U.getFrustum(at),M(x,y,Rt,z,Z,this.type)}U.isPointLightShadow!==!0&&this.type===Sr&&v(U,y),U.needsUpdate=!1}_=this.type,f.needsUpdate=!1,s.setRenderTarget(A,R,C)};function v(b,x){const y=t.update(m);h.defines.VSM_SAMPLES!==b.blurSamples&&(h.defines.VSM_SAMPLES=b.blurSamples,d.defines.VSM_SAMPLES=b.blurSamples,h.needsUpdate=!0,d.needsUpdate=!0),b.mapPass===null?b.mapPass=new pn(i.x,i.y,{format:ds,type:dn}):(b.mapPass.width!==b.map.width||b.mapPass.height!==b.map.height)&&b.mapPass.setSize(b.map.width,b.map.height),h.uniforms.shadow_pass.value=b.map.depthTexture,h.uniforms.resolution.value.set(b.map.width,b.map.height),h.uniforms.radius.value=b.radius,s.setRenderTarget(b.mapPass),s.clear(),s.renderBufferDirect(x,null,y,h,m,null),d.uniforms.shadow_pass.value=b.mapPass.texture,d.uniforms.resolution.value.set(b.map.width,b.map.height),d.uniforms.radius.value=b.radius,s.setRenderTarget(b.map),s.clear(),s.renderBufferDirect(x,null,y,d,m,null)}function S(b,x,y,A){let R=null;const C=y.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(C!==void 0)R=C;else if(R=y.isPointLight===!0?l:o,s.localClippingEnabled&&x.clipShadows===!0&&Array.isArray(x.clippingPlanes)&&x.clippingPlanes.length!==0||x.displacementMap&&x.displacementScale!==0||x.alphaMap&&x.alphaTest>0||x.map&&x.alphaTest>0||x.alphaToCoverage===!0){const L=R.uuid,N=x.uuid;let D=c[L];D===void 0&&(D={},c[L]=D);let B=D[N];B===void 0&&(B=R.clone(),D[N]=B,x.addEventListener("dispose",E)),R=B}if(R.visible=x.visible,R.wireframe=x.wireframe,A===Sr?R.side=x.shadowSide!==null?x.shadowSide:x.side:R.side=x.shadowSide!==null?x.shadowSide:p[x.side],R.alphaMap=x.alphaMap,R.alphaTest=x.alphaToCoverage===!0?.5:x.alphaTest,R.map=x.map,R.clipShadows=x.clipShadows,R.clippingPlanes=x.clippingPlanes,R.clipIntersection=x.clipIntersection,R.displacementMap=x.displacementMap,R.displacementScale=x.displacementScale,R.displacementBias=x.displacementBias,R.wireframeLinewidth=x.wireframeLinewidth,R.linewidth=x.linewidth,y.isPointLight===!0&&R.isMeshDistanceMaterial===!0){const L=s.properties.get(R);L.light=y}return R}function M(b,x,y,A,R,C){if(b.visible===!1)return;if(b.layers.test(R)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&C===Sr)&&(!b.frustumCulled||b.intersectsFrustum(n))){b.modelViewMatrix.multiplyMatrices(y.matrixWorldInverse,b.matrixWorld);const D=t.update(b),B=b.material;if(Array.isArray(B)){const z=D.groups;for(let U=0,X=z.length;U<X;U++){const G=z[U],K=B[G.materialIndex];if(K&&K.visible){const Z=S(b,K,A,C);b.onBeforeShadow(s,b,x,y,D,Z,G),s.renderBufferDirect(y,null,D,Z,b,G),b.onAfterShadow(s,b,x,y,D,Z,G)}}}else if(B.visible){const z=S(b,B,A,C);b.onBeforeShadow(s,b,x,y,D,z,null),s.renderBufferDirect(y,null,D,z,b,null),b.onAfterShadow(s,b,x,y,D,z,null)}}const N=b.children;for(let D=0,B=N.length;D<B;D++)M(N[D],x,y,A,R,C)}function E(b){b.target.removeEventListener("dispose",E);for(const y in c){const A=c[y],R=b.target.uuid;R in A&&(A[R].dispose(),delete A[R])}}}function FM(s,t){function e(){let F=!1;const Q=new Ce;let $=null;const _t=new Ce(0,0,0,0);return{setMask:function(nt){$!==nt&&!F&&(s.colorMask(nt,nt,nt,nt),$=nt)},setLocked:function(nt){F=nt},setClear:function(nt,ut,Nt,$t,ot){ot===!0&&(nt*=$t,ut*=$t,Nt*=$t),Q.set(nt,ut,Nt,$t),_t.equals(Q)===!1&&(s.clearColor(nt,ut,Nt,$t),_t.copy(Q))},reset:function(){F=!1,$=null,_t.set(-1,0,0,0)}}}function n(){let F=!1,Q=!1,$=null,_t=null,nt=null;return{setReversed:function(ut){if(Q!==ut){const Nt=t.get("EXT_clip_control");ut?Nt.clipControlEXT(Nt.LOWER_LEFT_EXT,Nt.ZERO_TO_ONE_EXT):Nt.clipControlEXT(Nt.LOWER_LEFT_EXT,Nt.NEGATIVE_ONE_TO_ONE_EXT),Q=ut;const $t=nt;nt=null,this.setClear($t)}},getReversed:function(){return Q},setTest:function(ut){ut?gt(s.DEPTH_TEST):It(s.DEPTH_TEST)},setMask:function(ut){$!==ut&&!F&&(s.depthMask(ut),$=ut)},setFunc:function(ut){if(Q&&(ut=Em[ut]),_t!==ut){switch(ut){case Dl:s.depthFunc(s.NEVER);break;case Ll:s.depthFunc(s.ALWAYS);break;case Nl:s.depthFunc(s.LESS);break;case Nr:s.depthFunc(s.LEQUAL);break;case Il:s.depthFunc(s.EQUAL);break;case Ul:s.depthFunc(s.GEQUAL);break;case Ol:s.depthFunc(s.GREATER);break;case Fl:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}_t=ut}},setLocked:function(ut){F=ut},setClear:function(ut){nt!==ut&&(nt=ut,Q&&(ut=1-ut),s.clearDepth(ut))},reset:function(){F=!1,$=null,_t=null,nt=null,Q=!1}}}function i(){let F=!1,Q=null,$=null,_t=null,nt=null,ut=null,Nt=null,$t=null,ot=null;return{setTest:function(Ut){F||(Ut?gt(s.STENCIL_TEST):It(s.STENCIL_TEST))},setMask:function(Ut){Q!==Ut&&!F&&(s.stencilMask(Ut),Q=Ut)},setFunc:function(Ut,qt,yt){($!==Ut||_t!==qt||nt!==yt)&&(s.stencilFunc(Ut,qt,yt),$=Ut,_t=qt,nt=yt)},setOp:function(Ut,qt,yt){(ut!==Ut||Nt!==qt||$t!==yt)&&(s.stencilOp(Ut,qt,yt),ut=Ut,Nt=qt,$t=yt)},setLocked:function(Ut){F=Ut},setClear:function(Ut){ot!==Ut&&(s.clearStencil(Ut),ot=Ut)},reset:function(){F=!1,Q=null,$=null,_t=null,nt=null,ut=null,Nt=null,$t=null,ot=null}}}const r=new e,a=new n,o=new i;let l={};const c=new WeakMap;let u={},p={},h={},d=new WeakMap,g=[],m=null,f=!1,_=null,v=null,S=null,M=null,E=null,b=null,x=null,y=new Xt(0,0,0),A=0,R=!1,C=null,L=null,N=null,D=null,B=null;const z=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let U=!1,X=0;const G=s.getParameter(s.VERSION);G.indexOf("WebGL")!==-1?(X=parseFloat(/^WebGL (\d)/.exec(G)[1]),U=X>=1):G.indexOf("OpenGL ES")!==-1&&(X=parseFloat(/^OpenGL ES (\d)/.exec(G)[1]),U=X>=2);let K=null,Z={};const at=s.getParameter(s.SCISSOR_BOX),Rt=s.getParameter(s.VIEWPORT),Y=new Ce().fromArray(at),it=new Ce().fromArray(Rt);function St(F,Q,$,_t){const nt=new Uint8Array(4),ut=s.createTexture();s.bindTexture(F,ut),s.texParameteri(F,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(F,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let Nt=0;Nt<$;Nt++)F===s.TEXTURE_3D||F===s.TEXTURE_2D_ARRAY?s.texImage3D(Q,0,s.RGBA,1,1,_t,0,s.RGBA,s.UNSIGNED_BYTE,nt):s.texImage2D(Q+Nt,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,nt);return ut}const Ct={};Ct[s.TEXTURE_2D]=St(s.TEXTURE_2D,s.TEXTURE_2D,1),Ct[s.TEXTURE_CUBE_MAP]=St(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),Ct[s.TEXTURE_2D_ARRAY]=St(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),Ct[s.TEXTURE_3D]=St(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),a.setClear(1),o.setClear(0),gt(s.DEPTH_TEST),a.setFunc(Nr),Et(!1),Mt(Vu),gt(s.CULL_FACE),mt(os);function gt(F){u[F]!==!0&&(s.enable(F),u[F]=!0)}function It(F){u[F]!==!1&&(s.disable(F),u[F]=!1)}function ce(F,Q){return h[F]!==Q?(s.bindFramebuffer(F,Q),h[F]=Q,F===s.DRAW_FRAMEBUFFER&&(h[s.FRAMEBUFFER]=Q),F===s.FRAMEBUFFER&&(h[s.DRAW_FRAMEBUFFER]=Q),!0):!1}function Ft(F,Q){let $=g,_t=!1;if(F){$=d.get(Q),$===void 0&&($=[],d.set(Q,$));const nt=F.textures;if($.length!==nt.length||$[0]!==s.COLOR_ATTACHMENT0){for(let ut=0,Nt=nt.length;ut<Nt;ut++)$[ut]=s.COLOR_ATTACHMENT0+ut;$.length=nt.length,_t=!0}}else $[0]!==s.BACK&&($[0]=s.BACK,_t=!0);_t&&s.drawBuffers($)}function Yt(F){return m!==F?(s.useProgram(F),m=F,!0):!1}const ie={[Ls]:s.FUNC_ADD,[qp]:s.FUNC_SUBTRACT,[Yp]:s.FUNC_REVERSE_SUBTRACT};ie[Zp]=s.MIN,ie[Kp]=s.MAX;const tt={[$p]:s.ZERO,[Jp]:s.ONE,[Qp]:s.SRC_COLOR,[Uf]:s.SRC_ALPHA,[sm]:s.SRC_ALPHA_SATURATE,[nm]:s.DST_COLOR,[tm]:s.DST_ALPHA,[jp]:s.ONE_MINUS_SRC_COLOR,[Of]:s.ONE_MINUS_SRC_ALPHA,[im]:s.ONE_MINUS_DST_COLOR,[em]:s.ONE_MINUS_DST_ALPHA,[rm]:s.CONSTANT_COLOR,[am]:s.ONE_MINUS_CONSTANT_COLOR,[om]:s.CONSTANT_ALPHA,[lm]:s.ONE_MINUS_CONSTANT_ALPHA};function mt(F,Q,$,_t,nt,ut,Nt,$t,ot,Ut){if(F===os){f===!0&&(It(s.BLEND),f=!1);return}if(f===!1&&(gt(s.BLEND),f=!0),F!==Xp){if(F!==_||Ut!==R){if((v!==Ls||E!==Ls)&&(s.blendEquation(s.FUNC_ADD),v=Ls,E=Ls),Ut)switch(F){case wr:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Pl:s.blendFunc(s.ONE,s.ONE);break;case Wu:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case Xu:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:he("WebGLState: Invalid blending: ",F);break}else switch(F){case wr:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Pl:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case Wu:he("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Xu:he("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:he("WebGLState: Invalid blending: ",F);break}S=null,M=null,b=null,x=null,y.set(0,0,0),A=0,_=F,R=Ut}return}nt=nt||Q,ut=ut||$,Nt=Nt||_t,(Q!==v||nt!==E)&&(s.blendEquationSeparate(ie[Q],ie[nt]),v=Q,E=nt),($!==S||_t!==M||ut!==b||Nt!==x)&&(s.blendFuncSeparate(tt[$],tt[_t],tt[ut],tt[Nt]),S=$,M=_t,b=ut,x=Nt),($t.equals(y)===!1||ot!==A)&&(s.blendColor($t.r,$t.g,$t.b,ot),y.copy($t),A=ot),_=F,R=!1}function ft(F,Q){F.side===ti?It(s.CULL_FACE):gt(s.CULL_FACE);let $=F.side===fn;Q&&($=!$),Et($),F.blending===wr&&F.transparent===!1?mt(os):mt(F.blending,F.blendEquation,F.blendSrc,F.blendDst,F.blendEquationAlpha,F.blendSrcAlpha,F.blendDstAlpha,F.blendColor,F.blendAlpha,F.premultipliedAlpha),a.setFunc(F.depthFunc),a.setTest(F.depthTest),a.setMask(F.depthWrite),r.setMask(F.colorWrite);const _t=F.stencilWrite;o.setTest(_t),_t&&(o.setMask(F.stencilWriteMask),o.setFunc(F.stencilFunc,F.stencilRef,F.stencilFuncMask),o.setOp(F.stencilFail,F.stencilZFail,F.stencilZPass)),Lt(F.polygonOffset,F.polygonOffsetFactor,F.polygonOffsetUnits),F.alphaToCoverage===!0?gt(s.SAMPLE_ALPHA_TO_COVERAGE):It(s.SAMPLE_ALPHA_TO_COVERAGE)}function Et(F){C!==F&&(F?s.frontFace(s.CW):s.frontFace(s.CCW),C=F)}function Mt(F){F!==Hp?(gt(s.CULL_FACE),F!==L&&(F===Vu?s.cullFace(s.BACK):F===Vp?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):It(s.CULL_FACE),L=F}function Vt(F){F!==N&&(U&&s.lineWidth(F),N=F)}function Lt(F,Q,$){F?(gt(s.POLYGON_OFFSET_FILL),(D!==Q||B!==$)&&(D=Q,B=$,a.getReversed()&&(Q=-Q,$=-$),s.polygonOffset(Q,$))):It(s.POLYGON_OFFSET_FILL)}function te(F){F?gt(s.SCISSOR_TEST):It(s.SCISSOR_TEST)}function se(F){F===void 0&&(F=s.TEXTURE0+z-1),K!==F&&(s.activeTexture(F),K=F)}function oe(F,Q,$){$===void 0&&(K===null?$=s.TEXTURE0+z-1:$=K);let _t=Z[$];_t===void 0&&(_t={type:void 0,texture:void 0},Z[$]=_t),(_t.type!==F||_t.texture!==Q)&&(K!==$&&(s.activeTexture($),K=$),s.bindTexture(F,Q||Ct[F]),_t.type=F,_t.texture=Q)}function k(){const F=Z[K];F!==void 0&&F.type!==void 0&&(s.bindTexture(F.type,null),F.type=void 0,F.texture=void 0)}function xe(){try{s.compressedTexImage2D(...arguments)}catch(F){he("WebGLState:",F)}}function Zt(){try{s.compressedTexImage3D(...arguments)}catch(F){he("WebGLState:",F)}}function Kt(){try{s.texSubImage2D(...arguments)}catch(F){he("WebGLState:",F)}}function dt(){try{s.texSubImage3D(...arguments)}catch(F){he("WebGLState:",F)}}function ye(){try{s.compressedTexSubImage2D(...arguments)}catch(F){he("WebGLState:",F)}}function Ot(){try{s.compressedTexSubImage3D(...arguments)}catch(F){he("WebGLState:",F)}}function zt(){try{s.texStorage2D(...arguments)}catch(F){he("WebGLState:",F)}}function P(){try{s.texStorage3D(...arguments)}catch(F){he("WebGLState:",F)}}function w(){try{s.texImage2D(...arguments)}catch(F){he("WebGLState:",F)}}function W(){try{s.texImage3D(...arguments)}catch(F){he("WebGLState:",F)}}function st(F){return p[F]!==void 0?p[F]:s.getParameter(F)}function et(F,Q){p[F]!==Q&&(s.pixelStorei(F,Q),p[F]=Q)}function pt(F){Y.equals(F)===!1&&(s.scissor(F.x,F.y,F.z,F.w),Y.copy(F))}function vt(F){it.equals(F)===!1&&(s.viewport(F.x,F.y,F.z,F.w),it.copy(F))}function J(F,Q){let $=c.get(Q);$===void 0&&($=new WeakMap,c.set(Q,$));let _t=$.get(F);_t===void 0&&(_t=s.getUniformBlockIndex(Q,F.name),s.uniformBlockBinding(Q,_t,_t),$.set(F,_t))}function j(F,Q,$){const nt=c.get(Q).get(F);l[nt]!==$&&(s.bindBufferBase(s.UNIFORM_BUFFER,nt,$),l[nt]=$)}function ct(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),a.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),s.pixelStorei(s.PACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_ALIGNMENT,4),s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,!1),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,s.BROWSER_DEFAULT_WEBGL),s.pixelStorei(s.PACK_ROW_LENGTH,0),s.pixelStorei(s.PACK_SKIP_PIXELS,0),s.pixelStorei(s.PACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_ROW_LENGTH,0),s.pixelStorei(s.UNPACK_IMAGE_HEIGHT,0),s.pixelStorei(s.UNPACK_SKIP_PIXELS,0),s.pixelStorei(s.UNPACK_SKIP_ROWS,0),s.pixelStorei(s.UNPACK_SKIP_IMAGES,0),u={},p={},K=null,Z={},h={},l={},d=new WeakMap,g=[],m=null,f=!1,_=null,v=null,S=null,M=null,E=null,b=null,x=null,y=new Xt(0,0,0),A=0,R=!1,C=null,L=null,N=null,D=null,B=null,Y.set(0,0,s.canvas.width,s.canvas.height),it.set(0,0,s.canvas.width,s.canvas.height),r.reset(),a.reset(),o.reset()}return{buffers:{color:r,depth:a,stencil:o},enable:gt,disable:It,bindFramebuffer:ce,drawBuffers:Ft,useProgram:Yt,setBlending:mt,setMaterial:ft,setFlipSided:Et,setCullFace:Mt,setLineWidth:Vt,setPolygonOffset:Lt,setScissorTest:te,activeTexture:se,bindTexture:oe,unbindTexture:k,compressedTexImage2D:xe,compressedTexImage3D:Zt,texImage2D:w,texImage3D:W,pixelStorei:et,getParameter:st,updateUBOMapping:J,uniformBlockBinding:j,texStorage2D:zt,texStorage3D:P,texSubImage2D:Kt,texSubImage3D:dt,compressedTexSubImage2D:ye,compressedTexSubImage3D:Ot,scissor:pt,viewport:vt,reset:ct}}function BM(s,t,e,n,i,r,a){const o=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new rt,u=new WeakMap,p=new Set;let h;const d=new WeakMap,g=new Set,m=new FinalizationRegistry(P=>g.delete(P));let f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function _(P,w){return f?new OffscreenCanvas(P,w):oo("canvas")}function v(P,w,W){let st=1;const et=zt(P);if((et.width>W||et.height>W)&&(st=W/Math.max(et.width,et.height)),st<1)if(typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&P instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&P instanceof ImageBitmap||typeof VideoFrame<"u"&&P instanceof VideoFrame){const pt=Math.floor(st*et.width),vt=Math.floor(st*et.height);h===void 0&&(h=_(pt,vt));const J=w?_(pt,vt):h;return J.width=pt,J.height=vt,J.getContext("2d").drawImage(P,0,0,pt,vt),kt("WebGLRenderer: Texture has been resized from ("+et.width+"x"+et.height+") to ("+pt+"x"+vt+")."),J}else return"data"in P&&kt("WebGLRenderer: Image in DataTexture is too big ("+et.width+"x"+et.height+")."),P;return P}function S(P){return P.generateMipmaps}function M(P){s.generateMipmap(P)}function E(P){return P.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:P.isWebGL3DRenderTarget?s.TEXTURE_3D:P.isWebGLArrayRenderTarget||P.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function b(P,w,W,st,et,pt=!1){if(P!==null){if(s[P]!==void 0)return s[P];kt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+P+"'")}let vt;st&&(vt=t.get("EXT_texture_norm16"),vt||kt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let J=w;if(w===s.RED&&(W===s.FLOAT&&(J=s.R32F),W===s.HALF_FLOAT&&(J=s.R16F),W===s.UNSIGNED_BYTE&&(J=s.R8),W===s.UNSIGNED_SHORT&&vt&&(J=vt.R16_EXT),W===s.SHORT&&vt&&(J=vt.R16_SNORM_EXT)),w===s.RED_INTEGER&&(W===s.UNSIGNED_BYTE&&(J=s.R8UI),W===s.UNSIGNED_SHORT&&(J=s.R16UI),W===s.UNSIGNED_INT&&(J=s.R32UI),W===s.BYTE&&(J=s.R8I),W===s.SHORT&&(J=s.R16I),W===s.INT&&(J=s.R32I)),w===s.RG&&(W===s.FLOAT&&(J=s.RG32F),W===s.HALF_FLOAT&&(J=s.RG16F),W===s.UNSIGNED_BYTE&&(J=s.RG8),W===s.UNSIGNED_SHORT&&vt&&(J=vt.RG16_EXT),W===s.SHORT&&vt&&(J=vt.RG16_SNORM_EXT)),w===s.RG_INTEGER&&(W===s.UNSIGNED_BYTE&&(J=s.RG8UI),W===s.UNSIGNED_SHORT&&(J=s.RG16UI),W===s.UNSIGNED_INT&&(J=s.RG32UI),W===s.BYTE&&(J=s.RG8I),W===s.SHORT&&(J=s.RG16I),W===s.INT&&(J=s.RG32I)),w===s.RGB_INTEGER&&(W===s.UNSIGNED_BYTE&&(J=s.RGB8UI),W===s.UNSIGNED_SHORT&&(J=s.RGB16UI),W===s.UNSIGNED_INT&&(J=s.RGB32UI),W===s.BYTE&&(J=s.RGB8I),W===s.SHORT&&(J=s.RGB16I),W===s.INT&&(J=s.RGB32I)),w===s.RGBA_INTEGER&&(W===s.UNSIGNED_BYTE&&(J=s.RGBA8UI),W===s.UNSIGNED_SHORT&&(J=s.RGBA16UI),W===s.UNSIGNED_INT&&(J=s.RGBA32UI),W===s.BYTE&&(J=s.RGBA8I),W===s.SHORT&&(J=s.RGBA16I),W===s.INT&&(J=s.RGBA32I)),w===s.RGB&&(W===s.UNSIGNED_SHORT&&vt&&(J=vt.RGB16_EXT),W===s.SHORT&&vt&&(J=vt.RGB16_SNORM_EXT),W===s.UNSIGNED_INT_5_9_9_9_REV&&(J=s.RGB9_E5),W===s.UNSIGNED_INT_10F_11F_11F_REV&&(J=s.R11F_G11F_B10F)),w===s.RGBA){const j=pt?ao:re.getTransfer(et);W===s.FLOAT&&(J=s.RGBA32F),W===s.HALF_FLOAT&&(J=s.RGBA16F),W===s.UNSIGNED_BYTE&&(J=j===ge?s.SRGB8_ALPHA8:s.RGBA8),W===s.UNSIGNED_SHORT&&vt&&(J=vt.RGBA16_EXT),W===s.SHORT&&vt&&(J=vt.RGBA16_SNORM_EXT),W===s.UNSIGNED_SHORT_4_4_4_4&&(J=s.RGBA4),W===s.UNSIGNED_SHORT_5_5_5_1&&(J=s.RGB5_A1)}return(J===s.R16F||J===s.R32F||J===s.RG16F||J===s.RG32F||J===s.RGBA16F||J===s.RGBA32F)&&t.get("EXT_color_buffer_float"),J}function x(P,w){let W;return P?w===null||w===si||w===Ws?W=s.DEPTH24_STENCIL8:w===Wn?W=s.DEPTH32F_STENCIL8:w===Ur&&(W=s.DEPTH24_STENCIL8,kt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===si||w===Ws?W=s.DEPTH_COMPONENT24:w===Wn?W=s.DEPTH_COMPONENT32F:w===Ur&&(W=s.DEPTH_COMPONENT16),W}function y(P,w){return S(P)===!0||P.isFramebufferTexture&&P.minFilter!==Qe&&P.minFilter!==on?Math.log2(Math.max(w.width,w.height))+1:P.mipmaps.length>0?P.mipmaps.length:P.isCompressedTexture&&Array.isArray(P.image)?w.mipmaps.length:1}function A(P){const w=new WeakRef(P);n.get(P).__ref=w,g.add(w),m.register(P,w,w)}function R(P){const w=n.get(P).__ref;w!==void 0&&(g.delete(w),m.unregister(w))}function C(P){N(P.target)}function L(P){D(P.target)}function N(P){P.removeEventListener("dispose",C),R(P),z(P),P.isVideoTexture&&u.delete(P),P.isHTMLTexture&&p.delete(P)}function D(P){P.removeEventListener("dispose",L),R(P),X(P)}function B(){for(const P of g){const w=P.deref();w!==void 0&&(w.isRenderTarget===!0?D(w):N(w))}g.clear(),p.clear()}function z(P){const w=n.get(P);if(w.__webglInit===void 0)return;const W=P.source,st=d.get(W);if(st){const et=st[w.__cacheKey];et.usedTimes--,et.usedTimes===0&&U(P),Object.keys(st).length===0&&d.delete(W)}n.remove(P)}function U(P){const w=n.get(P);s.deleteTexture(w.__webglTexture);const W=P.source,st=d.get(W);delete st[w.__cacheKey],a.memory.textures--}function X(P){const w=n.get(P);w.__depthDisposeCallback&&w.__depthDisposeCallback();const W=P.depthTexture;if(W&&W.renderTarget===P&&N(W),P.isWebGLCubeRenderTarget)for(let et=0;et<6;et++){if(Array.isArray(w.__webglFramebuffer[et]))for(let pt=0;pt<w.__webglFramebuffer[et].length;pt++)s.deleteFramebuffer(w.__webglFramebuffer[et][pt]);else s.deleteFramebuffer(w.__webglFramebuffer[et]);w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer[et])}else{if(Array.isArray(w.__webglFramebuffer))for(let et=0;et<w.__webglFramebuffer.length;et++)s.deleteFramebuffer(w.__webglFramebuffer[et]);else s.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&s.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&s.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let et=0;et<w.__webglColorRenderbuffer.length;et++)w.__webglColorRenderbuffer[et]&&s.deleteRenderbuffer(w.__webglColorRenderbuffer[et]);w.__webglDepthRenderbuffer&&s.deleteRenderbuffer(w.__webglDepthRenderbuffer)}const st=P.textures;for(let et=0,pt=st.length;et<pt;et++){const vt=n.get(st[et]);vt.__webglTexture&&(s.deleteTexture(vt.__webglTexture),a.memory.textures--),n.remove(st[et])}n.remove(P)}let G=0;function K(){G=0}function Z(){return G}function at(P){G=P}function Rt(){const P=G;return P>=i.maxTextures&&kt("WebGLTextures: Trying to use "+(P+1)+" texture units while this GPU supports only "+i.maxTextures),G+=1,P}function Y(P){const w=[];return w.push(P.wrapS),w.push(P.wrapT),w.push(P.wrapR||0),w.push(P.magFilter),w.push(P.minFilter),w.push(P.anisotropy),w.push(P.internalFormat),w.push(P.format),w.push(P.type),w.push(P.generateMipmaps),w.push(P.mipmapsAutoUpdate),w.push(P.premultiplyAlpha),w.push(P.flipY),w.push(P.unpackAlignment),w.push(P.colorSpace),w.join()}function it(P,w){const W=n.get(P);if(P.isVideoTexture&&ye(P),P.isRenderTargetTexture===!1&&P.isExternalTexture!==!0&&P.version>0&&W.__version!==P.version){const st=P.image;if(st===null)kt("WebGLRenderer: Texture marked for update but no image data found.");else if(st.complete===!1)kt("WebGLRenderer: Texture marked for update but image is incomplete");else{ft(W,P,w);return}}else P.isExternalTexture&&(W.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(s.TEXTURE_2D,W.__webglTexture,s.TEXTURE0+w)}function St(P,w){const W=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&W.__version!==P.version){ft(W,P,w);return}else P.isExternalTexture&&(W.__webglTexture=P.sourceTexture?P.sourceTexture:null);e.bindTexture(s.TEXTURE_2D_ARRAY,W.__webglTexture,s.TEXTURE0+w)}function Ct(P,w){const W=n.get(P);if(P.isRenderTargetTexture===!1&&P.version>0&&W.__version!==P.version){ft(W,P,w);return}e.bindTexture(s.TEXTURE_3D,W.__webglTexture,s.TEXTURE0+w)}function gt(P,w){const W=n.get(P);if(P.version>0&&W.__version!==P.version){Et(W,P,w);return}e.bindTexture(s.TEXTURE_CUBE_MAP,W.__webglTexture,s.TEXTURE0+w)}const It={[Bl]:s.REPEAT,[xi]:s.CLAMP_TO_EDGE,[zl]:s.MIRRORED_REPEAT},ce={[Qe]:s.NEAREST,[hm]:s.NEAREST_MIPMAP_NEAREST,[ha]:s.NEAREST_MIPMAP_LINEAR,[on]:s.LINEAR,[Ho]:s.LINEAR_MIPMAP_NEAREST,[vi]:s.LINEAR_MIPMAP_LINEAR},Ft={[mm]:s.NEVER,[Yf]:s.ALWAYS,[_m]:s.LESS,[Xf]:s.LEQUAL,[gm]:s.EQUAL,[qf]:s.GEQUAL,[xm]:s.GREATER,[vm]:s.NOTEQUAL};function Yt(P,w){if(w.type===Wn&&t.has("OES_texture_float_linear")===!1&&(w.magFilter===on||w.magFilter===Ho||w.magFilter===ha||w.magFilter===vi||w.minFilter===on||w.minFilter===Ho||w.minFilter===ha||w.minFilter===vi)&&kt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(P,s.TEXTURE_WRAP_S,It[w.wrapS]),s.texParameteri(P,s.TEXTURE_WRAP_T,It[w.wrapT]),(P===s.TEXTURE_3D||P===s.TEXTURE_2D_ARRAY)&&s.texParameteri(P,s.TEXTURE_WRAP_R,It[w.wrapR]),s.texParameteri(P,s.TEXTURE_MAG_FILTER,ce[w.magFilter]),s.texParameteri(P,s.TEXTURE_MIN_FILTER,ce[w.minFilter]),w.compareFunction&&(s.texParameteri(P,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(P,s.TEXTURE_COMPARE_FUNC,Ft[w.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===Qe||w.minFilter!==ha&&w.minFilter!==vi||w.type===Wn&&t.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||n.get(w).__currentAnisotropy){const W=t.get("EXT_texture_filter_anisotropic");s.texParameterf(P,W.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,i.getMaxAnisotropy())),n.get(w).__currentAnisotropy=w.anisotropy}}}function ie(P,w){let W=!1;P.__webglInit===void 0&&(P.__webglInit=!0,w.addEventListener("dispose",C),A(w));const st=w.source;let et=d.get(st);et===void 0&&(et={},d.set(st,et));const pt=Y(w);if(pt!==P.__cacheKey){et[pt]===void 0&&(et[pt]={texture:s.createTexture(),usedTimes:0},a.memory.textures++,W=!0),et[pt].usedTimes++;const vt=et[P.__cacheKey];vt!==void 0&&(et[P.__cacheKey].usedTimes--,vt.usedTimes===0&&U(w)),P.__cacheKey=pt,P.__webglTexture=et[pt].texture}return W}function tt(P,w,W){return Math.floor(Math.floor(P/W)/w)}function mt(P,w,W,st){const pt=P.updateRanges;if(pt.length===0)e.texSubImage2D(s.TEXTURE_2D,0,0,0,w.width,w.height,W,st,w.data);else{pt.sort((F,Q)=>F.start-Q.start);let vt=0;for(let F=1;F<pt.length;F++){const Q=pt[vt],$=pt[F],_t=Q.start+Q.count,nt=tt($.start,w.width,4),ut=tt(Q.start,w.width,4);$.start<=_t+1&&nt===ut&&tt($.start+$.count-1,w.width,4)===nt?Q.count=Math.max(Q.count,$.start+$.count-Q.start):(++vt,pt[vt]=$)}pt.length=vt+1;const J=e.getParameter(s.UNPACK_ROW_LENGTH),j=e.getParameter(s.UNPACK_SKIP_PIXELS),ct=e.getParameter(s.UNPACK_SKIP_ROWS);e.pixelStorei(s.UNPACK_ROW_LENGTH,w.width);for(let F=0,Q=pt.length;F<Q;F++){const $=pt[F],_t=Math.floor($.start/4),nt=Math.ceil($.count/4),ut=_t%w.width,Nt=Math.floor(_t/w.width),$t=nt,ot=1;e.pixelStorei(s.UNPACK_SKIP_PIXELS,ut),e.pixelStorei(s.UNPACK_SKIP_ROWS,Nt),e.texSubImage2D(s.TEXTURE_2D,0,ut,Nt,$t,ot,W,st,w.data)}P.clearUpdateRanges(),e.pixelStorei(s.UNPACK_ROW_LENGTH,J),e.pixelStorei(s.UNPACK_SKIP_PIXELS,j),e.pixelStorei(s.UNPACK_SKIP_ROWS,ct)}}function ft(P,w,W){let st=s.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(st=s.TEXTURE_2D_ARRAY),w.isData3DTexture&&(st=s.TEXTURE_3D);const et=ie(P,w),pt=w.source;e.bindTexture(st,P.__webglTexture,s.TEXTURE0+W);const vt=n.get(pt);if(pt.version!==vt.__version||et===!0){if(e.activeTexture(s.TEXTURE0+W),(typeof ImageBitmap<"u"&&w.image instanceof ImageBitmap)===!1){const ot=re.getPrimaries(re.workingColorSpace),Ut=w.colorSpace===Ii?null:re.getPrimaries(w.colorSpace),qt=w.colorSpace===Ii||ot===Ut?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,qt)}e.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment);let j=v(w.image,!1,i.maxTextureSize);j=Ot(w,j);const ct=r.convert(w.format,w.colorSpace),F=r.convert(w.type);let Q=b(w.internalFormat,ct,F,w.normalized,w.colorSpace,w.isVideoTexture);Yt(st,w);let $;const _t=w.mipmaps,nt=w.isVideoTexture!==!0,ut=vt.__version===void 0||et===!0,Nt=pt.dataReady,$t=y(w,j);if(w.isDepthTexture)Q=x(w.format===Ui,w.type),ut&&(nt?e.texStorage2D(s.TEXTURE_2D,1,Q,j.width,j.height):e.texImage2D(s.TEXTURE_2D,0,Q,j.width,j.height,0,ct,F,null));else if(w.isDataTexture)if(_t.length>0){nt&&ut&&e.texStorage2D(s.TEXTURE_2D,$t,Q,_t[0].width,_t[0].height);for(let ot=0,Ut=_t.length;ot<Ut;ot++)$=_t[ot],nt?Nt&&e.texSubImage2D(s.TEXTURE_2D,ot,0,0,$.width,$.height,ct,F,$.data):e.texImage2D(s.TEXTURE_2D,ot,Q,$.width,$.height,0,ct,F,$.data);w.generateMipmaps=!1}else nt?(ut&&e.texStorage2D(s.TEXTURE_2D,$t,Q,j.width,j.height),Nt&&mt(w,j,ct,F)):e.texImage2D(s.TEXTURE_2D,0,Q,j.width,j.height,0,ct,F,j.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){nt&&ut&&e.texStorage3D(s.TEXTURE_2D_ARRAY,$t,Q,_t[0].width,_t[0].height,j.depth);for(let ot=0,Ut=_t.length;ot<Ut;ot++)if($=_t[ot],w.format!==ni)if(ct!==null)if(nt){if(Nt)if(w.layerUpdates.size>0){const qt=Lh($.width,$.height,w.format,w.type);for(const yt of w.layerUpdates){const de=$.data.subarray(yt*qt/$.data.BYTES_PER_ELEMENT,(yt+1)*qt/$.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ot,0,0,yt,$.width,$.height,1,ct,de)}}else e.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,ot,0,0,0,$.width,$.height,j.depth,ct,$.data)}else e.compressedTexImage3D(s.TEXTURE_2D_ARRAY,ot,Q,$.width,$.height,j.depth,0,$.data,0,0);else kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else nt?Nt&&e.texSubImage3D(s.TEXTURE_2D_ARRAY,ot,0,0,0,$.width,$.height,j.depth,ct,F,$.data):e.texImage3D(s.TEXTURE_2D_ARRAY,ot,Q,$.width,$.height,j.depth,0,ct,F,$.data);w.layerUpdates.size>0&&w.clearLayerUpdates()}else{nt&&ut&&e.texStorage2D(s.TEXTURE_2D,$t,Q,_t[0].width,_t[0].height);for(let ot=0,Ut=_t.length;ot<Ut;ot++)$=_t[ot],w.format!==ni?ct!==null?nt?Nt&&e.compressedTexSubImage2D(s.TEXTURE_2D,ot,0,0,$.width,$.height,ct,$.data):e.compressedTexImage2D(s.TEXTURE_2D,ot,Q,$.width,$.height,0,$.data):kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):nt?Nt&&e.texSubImage2D(s.TEXTURE_2D,ot,0,0,$.width,$.height,ct,F,$.data):e.texImage2D(s.TEXTURE_2D,ot,Q,$.width,$.height,0,ct,F,$.data)}else if(w.isDataArrayTexture)if(nt){if(ut&&e.texStorage3D(s.TEXTURE_2D_ARRAY,$t,Q,j.width,j.height,j.depth),Nt)if(w.layerUpdates.size>0){const ot=Lh(j.width,j.height,w.format,w.type);for(const Ut of w.layerUpdates){const qt=j.data.subarray(Ut*ot/j.data.BYTES_PER_ELEMENT,(Ut+1)*ot/j.data.BYTES_PER_ELEMENT);e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,Ut,j.width,j.height,1,ct,F,qt)}w.clearLayerUpdates()}else e.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,ct,F,j.data)}else e.texImage3D(s.TEXTURE_2D_ARRAY,0,Q,j.width,j.height,j.depth,0,ct,F,j.data);else if(w.isData3DTexture)nt?(ut&&e.texStorage3D(s.TEXTURE_3D,$t,Q,j.width,j.height,j.depth),Nt&&e.texSubImage3D(s.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,ct,F,j.data)):e.texImage3D(s.TEXTURE_3D,0,Q,j.width,j.height,j.depth,0,ct,F,j.data);else if(w.isFramebufferTexture){if(ut)if(nt)e.texStorage2D(s.TEXTURE_2D,$t,Q,j.width,j.height);else{let ot=j.width,Ut=j.height;for(let qt=0;qt<$t;qt++)e.texImage2D(s.TEXTURE_2D,qt,Q,ot,Ut,0,ct,F,null),ot>>=1,Ut>>=1}}else if(w.isHTMLTexture){if("texElementImage2D"in s){const ot=s.canvas;if(ot.hasAttribute("layoutsubtree")||ot.setAttribute("layoutsubtree","true"),j.parentNode!==ot){ot.appendChild(j),p.add(w),ot.onpaint=Ut=>{const qt=Ut.changedElements;for(const yt of p)qt.includes(yt.image)&&(yt.needsUpdate=!0)},ot.requestPaint();return}if(s.texElementImage2D.length===3)s.texElementImage2D(s.TEXTURE_2D,s.RGBA8,j);else{const qt=s.RGBA,yt=s.RGBA,de=s.UNSIGNED_BYTE;s.texElementImage2D(s.TEXTURE_2D,0,qt,yt,de,j)}s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.LINEAR),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_S,s.CLAMP_TO_EDGE),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_WRAP_T,s.CLAMP_TO_EDGE)}}else if(_t.length>0){if(nt&&ut){const ot=zt(_t[0]);e.texStorage2D(s.TEXTURE_2D,$t,Q,ot.width,ot.height)}for(let ot=0,Ut=_t.length;ot<Ut;ot++)$=_t[ot],nt?Nt&&e.texSubImage2D(s.TEXTURE_2D,ot,0,0,ct,F,$):e.texImage2D(s.TEXTURE_2D,ot,Q,ct,F,$);w.generateMipmaps=!1}else if(nt){if(ut){const ot=zt(j);e.texStorage2D(s.TEXTURE_2D,$t,Q,ot.width,ot.height)}Nt&&e.texSubImage2D(s.TEXTURE_2D,0,0,0,ct,F,j)}else e.texImage2D(s.TEXTURE_2D,0,Q,ct,F,j);S(w)&&w.mipmapsAutoUpdate===!0&&M(st),vt.__version=pt.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function Et(P,w,W){if(w.image.length!==6)return;const st=ie(P,w),et=w.source;e.bindTexture(s.TEXTURE_CUBE_MAP,P.__webglTexture,s.TEXTURE0+W);const pt=n.get(et);if(et.version!==pt.__version||st===!0){e.activeTexture(s.TEXTURE0+W);const vt=re.getPrimaries(re.workingColorSpace),J=w.colorSpace===Ii?null:re.getPrimaries(w.colorSpace),j=w.colorSpace===Ii||vt===J?s.NONE:s.BROWSER_DEFAULT_WEBGL;e.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,w.flipY),e.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),e.pixelStorei(s.UNPACK_ALIGNMENT,w.unpackAlignment),e.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,j);const ct=w.isCompressedTexture||w.image[0].isCompressedTexture,F=w.image[0]&&w.image[0].isDataTexture,Q=[];for(let yt=0;yt<6;yt++)!ct&&!F?Q[yt]=v(w.image[yt],!0,i.maxCubemapSize):Q[yt]=F?w.image[yt].image:w.image[yt],Q[yt]=Ot(w,Q[yt]);const $=Q[0],_t=r.convert(w.format,w.colorSpace),nt=r.convert(w.type);let ut=b(w.internalFormat,_t,nt,w.normalized,w.colorSpace);const Nt=w.isVideoTexture!==!0,$t=pt.__version===void 0||st===!0,ot=et.dataReady;let Ut=y(w,$);Yt(s.TEXTURE_CUBE_MAP,w);let qt;if(w.isDepthTexture){if(ut=x(w.format===Ui,w.type),$t)if(Nt)e.texStorage2D(s.TEXTURE_CUBE_MAP,1,ut,$.width,$.height);else for(let yt=0;yt<6;yt++)e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,ut,$.width,$.height,0,_t,nt,null)}else if(ct){Nt&&$t&&e.texStorage2D(s.TEXTURE_CUBE_MAP,Ut,ut,$.width,$.height);for(let yt=0;yt<6;yt++){qt=Q[yt].mipmaps;for(let de=0;de<qt.length;de++){const Oe=qt[de];w.format!==ni?_t!==null?Nt?ot&&e.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+yt,de,0,0,Oe.width,Oe.height,_t,Oe.data):e.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+yt,de,ut,Oe.width,Oe.height,0,Oe.data):kt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):Nt?ot&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+yt,de,0,0,Oe.width,Oe.height,_t,nt,Oe.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+yt,de,ut,Oe.width,Oe.height,0,_t,nt,Oe.data)}}}else{if(qt=w.mipmaps,Nt&&$t){qt.length>0&&Ut++;const yt=zt(Q[0]);e.texStorage2D(s.TEXTURE_CUBE_MAP,Ut,ut,yt.width,yt.height)}for(let yt=0;yt<6;yt++)if(F){Nt?ot&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,0,0,Q[yt].width,Q[yt].height,_t,nt,Q[yt].data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,ut,Q[yt].width,Q[yt].height,0,_t,nt,Q[yt].data);for(let de=0;de<qt.length;de++){const Zn=qt[de].image[yt].image;Nt?ot&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+yt,de+1,0,0,Zn.width,Zn.height,_t,nt,Zn.data):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+yt,de+1,ut,Zn.width,Zn.height,0,_t,nt,Zn.data)}}else{Nt?ot&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,0,0,_t,nt,Q[yt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+yt,0,ut,_t,nt,Q[yt]);for(let de=0;de<qt.length;de++){const Oe=qt[de];Nt?ot&&e.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+yt,de+1,0,0,_t,nt,Oe.image[yt]):e.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+yt,de+1,ut,_t,nt,Oe.image[yt])}}}S(w)&&w.mipmapsAutoUpdate===!0&&M(s.TEXTURE_CUBE_MAP),pt.__version=et.version,w.onUpdate&&w.onUpdate(w)}P.__version=w.version}function Mt(P,w,W,st,et,pt){const vt=r.convert(W.format,W.colorSpace),J=r.convert(W.type),j=b(W.internalFormat,vt,J,W.normalized,W.colorSpace),ct=n.get(w),F=n.get(W);if(F.__renderTarget=w,!ct.__hasExternalTextures){const Q=Math.max(1,w.width>>pt),$=Math.max(1,w.height>>pt);et===s.TEXTURE_3D||et===s.TEXTURE_2D_ARRAY?e.texImage3D(et,pt,j,Q,$,w.depth,0,vt,J,null):e.texImage2D(et,pt,j,Q,$,0,vt,J,null)}e.bindFramebuffer(s.FRAMEBUFFER,P),dt(w)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,st,et,F.__webglTexture,0,Kt(w)):(et===s.TEXTURE_2D||et>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&et<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,st,et,F.__webglTexture,pt),e.bindFramebuffer(s.FRAMEBUFFER,null)}function Vt(P,w,W){if(s.bindRenderbuffer(s.RENDERBUFFER,P),w.depthBuffer){const st=w.depthTexture,et=st&&st.isDepthTexture?st.type:null,pt=x(w.stencilBuffer,et),vt=w.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;dt(w)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Kt(w),pt,w.width,w.height):W?s.renderbufferStorageMultisample(s.RENDERBUFFER,Kt(w),pt,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,pt,w.width,w.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,vt,s.RENDERBUFFER,P)}else{const st=w.textures;for(let et=0;et<st.length;et++){const pt=st[et],vt=r.convert(pt.format,pt.colorSpace),J=r.convert(pt.type),j=b(pt.internalFormat,vt,J,pt.normalized,pt.colorSpace);dt(w)?o.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,Kt(w),j,w.width,w.height):W?s.renderbufferStorageMultisample(s.RENDERBUFFER,Kt(w),j,w.width,w.height):s.renderbufferStorage(s.RENDERBUFFER,j,w.width,w.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Lt(P,w,W){const st=w.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(s.FRAMEBUFFER,P),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("THREE.WebGLTextures: renderTarget.depthTexture must be an instance of THREE.DepthTexture.");const et=n.get(w.depthTexture);et.__renderTarget=w;const pt=st?w.depthTexture.image[0]:w.depthTexture.image;(!et.__webglTexture||pt.width!==w.width||pt.height!==w.height)&&(pt.width=w.width,pt.height=w.height,w.depthTexture.needsUpdate=!0),st?gt(w.depthTexture,0):it(w.depthTexture,0);const vt=et.__webglTexture,J=Kt(w),j=st?s.TEXTURE_CUBE_MAP_POSITIVE_X+W:s.TEXTURE_2D,ct=w.depthTexture.format===Ui?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;if(w.depthTexture.format===Wi)dt(w)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ct,j,vt,0,J):s.framebufferTexture2D(s.FRAMEBUFFER,ct,j,vt,0);else if(w.depthTexture.format===Ui)dt(w)?o.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,ct,j,vt,0,J):s.framebufferTexture2D(s.FRAMEBUFFER,ct,j,vt,0);else throw new Error("THREE.WebGLTextures: Unknown depthTexture format.")}function te(P){const w=n.get(P),W=P.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==P.depthTexture){const st=P.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),st){const et=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,st.removeEventListener("dispose",et)};st.addEventListener("dispose",et),w.__depthDisposeCallback=et}w.__boundDepthTexture=st}if(P.depthTexture&&!w.__autoAllocateDepthBuffer)if(W)for(let st=0;st<6;st++)Lt(w.__webglFramebuffer[st],P,st);else P.texture.mipmaps.length>0?Lt(w.__webglFramebuffer[0],P,0):Lt(w.__webglFramebuffer,P,0);else if(W){w.__webglDepthbuffer=[];for(let st=0;st<6;st++)if(e.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer[st]),w.__webglDepthbuffer[st]===void 0)w.__webglDepthbuffer[st]=s.createRenderbuffer(),Vt(w.__webglDepthbuffer[st],P,!1);else{const et=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,pt=w.__webglDepthbuffer[st];s.bindRenderbuffer(s.RENDERBUFFER,pt),s.framebufferRenderbuffer(s.FRAMEBUFFER,et,s.RENDERBUFFER,pt)}}else if(P.texture.mipmaps.length>0?e.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer[0]):e.bindFramebuffer(s.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=s.createRenderbuffer(),Vt(w.__webglDepthbuffer,P,!1);else{const et=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,pt=w.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,pt),s.framebufferRenderbuffer(s.FRAMEBUFFER,et,s.RENDERBUFFER,pt)}e.bindFramebuffer(s.FRAMEBUFFER,null)}function se(P,w,W){const st=n.get(P);w!==void 0&&Mt(st.__webglFramebuffer,P,P.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),W!==void 0&&te(P)}function oe(P){const w=P.texture,W=n.get(P),st=n.get(w);P.addEventListener("dispose",L),A(P);const et=P.textures,pt=P.isWebGLCubeRenderTarget===!0,vt=et.length>1;if(vt||(st.__webglTexture===void 0&&(st.__webglTexture=s.createTexture()),st.__version=w.version,a.memory.textures++),pt){W.__webglFramebuffer=[];for(let J=0;J<6;J++)if(w.mipmaps.length>0){W.__webglFramebuffer[J]=[];for(let j=0;j<w.mipmaps.length;j++)W.__webglFramebuffer[J][j]=s.createFramebuffer()}else W.__webglFramebuffer[J]=s.createFramebuffer()}else{if(w.mipmaps.length>0){W.__webglFramebuffer=[];for(let J=0;J<w.mipmaps.length;J++)W.__webglFramebuffer[J]=s.createFramebuffer()}else W.__webglFramebuffer=s.createFramebuffer();if(vt)for(let J=0,j=et.length;J<j;J++){const ct=n.get(et[J]);ct.__webglTexture===void 0&&(ct.__webglTexture=s.createTexture(),a.memory.textures++)}if(P.samples>0&&dt(P)===!1){W.__webglMultisampledFramebuffer=s.createFramebuffer(),W.__webglColorRenderbuffer=[],e.bindFramebuffer(s.FRAMEBUFFER,W.__webglMultisampledFramebuffer);for(let J=0;J<et.length;J++){const j=et[J];W.__webglColorRenderbuffer[J]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,W.__webglColorRenderbuffer[J]);const ct=r.convert(j.format,j.colorSpace),F=r.convert(j.type),Q=b(j.internalFormat,ct,F,j.normalized,j.colorSpace,P.isXRRenderTarget===!0),$=Kt(P);s.renderbufferStorageMultisample(s.RENDERBUFFER,$,Q,P.width,P.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+J,s.RENDERBUFFER,W.__webglColorRenderbuffer[J])}s.bindRenderbuffer(s.RENDERBUFFER,null),P.depthBuffer&&(W.__webglDepthRenderbuffer=s.createRenderbuffer(),Vt(W.__webglDepthRenderbuffer,P,!0)),e.bindFramebuffer(s.FRAMEBUFFER,null)}}if(pt){e.bindTexture(s.TEXTURE_CUBE_MAP,st.__webglTexture),Yt(s.TEXTURE_CUBE_MAP,w);for(let J=0;J<6;J++)if(w.mipmaps.length>0)for(let j=0;j<w.mipmaps.length;j++)Mt(W.__webglFramebuffer[J][j],P,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+J,j);else Mt(W.__webglFramebuffer[J],P,w,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);S(w)?M(s.TEXTURE_CUBE_MAP):w.mipmaps.length>0&&s.texParameteri(s.TEXTURE_CUBE_MAP,s.TEXTURE_MAX_LEVEL,w.mipmaps.length-1),e.unbindTexture()}else if(vt){for(let J=0,j=et.length;J<j;J++){const ct=et[J],F=n.get(ct);let Q=s.TEXTURE_2D;(P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(Q=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(Q,F.__webglTexture),Yt(Q,ct),Mt(W.__webglFramebuffer,P,ct,s.COLOR_ATTACHMENT0+J,Q,0),S(ct)&&M(Q)}e.unbindTexture()}else{let J=s.TEXTURE_2D;if((P.isWebGL3DRenderTarget||P.isWebGLArrayRenderTarget)&&(J=P.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),e.bindTexture(J,st.__webglTexture),Yt(J,w),w.mipmaps.length>0)for(let j=0;j<w.mipmaps.length;j++)Mt(W.__webglFramebuffer[j],P,w,s.COLOR_ATTACHMENT0,J,j);else Mt(W.__webglFramebuffer,P,w,s.COLOR_ATTACHMENT0,J,0);S(w)?M(J):w.mipmaps.length>0&&s.texParameteri(J,s.TEXTURE_MAX_LEVEL,w.mipmaps.length-1),e.unbindTexture()}P.depthBuffer&&te(P)}function k(P){const w=P.textures;for(let W=0,st=w.length;W<st;W++){const et=w[W];if(S(et)&&et.mipmapsAutoUpdate===!0){const pt=E(P),vt=n.get(et).__webglTexture;e.bindTexture(pt,vt),M(pt),e.unbindTexture()}}}const xe=[];function Zt(P){if(P.samples>0){if(dt(P)===!1){const w=P.textures,W=P.width,st=P.height;let et=s.COLOR_BUFFER_BIT;const pt=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,vt=n.get(P),J=w.length>1;if(J)for(let ct=0;ct<w.length;ct++)e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ct,s.RENDERBUFFER,null),e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ct,s.TEXTURE_2D,null,0);e.bindFramebuffer(s.READ_FRAMEBUFFER,vt.__webglMultisampledFramebuffer),P.texture.mipmaps.length>0?e.bindFramebuffer(s.DRAW_FRAMEBUFFER,vt.__webglFramebuffer[0]):e.bindFramebuffer(s.DRAW_FRAMEBUFFER,vt.__webglFramebuffer);for(let ct=0;ct<w.length;ct++){if(P.resolveDepthBuffer&&(P.depthBuffer&&(et|=s.DEPTH_BUFFER_BIT),P.stencilBuffer&&P.resolveStencilBuffer&&(et|=s.STENCIL_BUFFER_BIT)),J){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,vt.__webglColorRenderbuffer[ct]);const F=n.get(w[ct]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,F,0)}s.blitFramebuffer(0,0,W,st,0,0,W,st,et,s.NEAREST),l===!0&&(xe.length=0,xe.push(s.COLOR_ATTACHMENT0+ct),P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&xe.push(pt),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,xe))}if(e.bindFramebuffer(s.READ_FRAMEBUFFER,null),e.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),J)for(let ct=0;ct<w.length;ct++){e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ct,s.RENDERBUFFER,vt.__webglColorRenderbuffer[ct]);const F=n.get(w[ct]).__webglTexture;e.bindFramebuffer(s.FRAMEBUFFER,vt.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+ct,s.TEXTURE_2D,F,0)}e.bindFramebuffer(s.DRAW_FRAMEBUFFER,vt.__webglMultisampledFramebuffer)}else if(P.depthBuffer&&P.storeMultisampledDepthBuffer===!1&&l){const w=P.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[w])}}}function Kt(P){return Math.min(i.maxSamples,P.samples)}function dt(P){const w=n.get(P);return P.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function ye(P){const w=a.render.frame;u.get(P)!==w&&(u.set(P,w),P.update())}function Ot(P,w){const W=P.colorSpace,st=P.format,et=P.type;return P.isCompressedTexture===!0||P.isVideoTexture===!0||W!==ro&&W!==Ii&&(re.getTransfer(W)===ge?(st!==ni||et!==En)&&kt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):he("WebGLTextures: Unsupported texture color space:",W)),w}function zt(P){return typeof HTMLImageElement<"u"&&P instanceof HTMLImageElement?(c.width=P.naturalWidth||P.width,c.height=P.naturalHeight||P.height):typeof VideoFrame<"u"&&P instanceof VideoFrame?(c.width=P.displayWidth,c.height=P.displayHeight):(c.width=P.width,c.height=P.height),c}this.allocateTextureUnit=Rt,this.resetTextureUnits=K,this.getTextureUnits=Z,this.setTextureUnits=at,this.setTexture2D=it,this.setTexture2DArray=St,this.setTexture3D=Ct,this.setTextureCube=gt,this.rebindTextures=se,this.setupRenderTarget=oe,this.updateRenderTargetMipmap=k,this.updateMultisampleRenderTarget=Zt,this.setupDepthRenderbuffer=te,this.setupFrameBufferTexture=Mt,this.useMultisampledRTT=dt,this.dispose=B}function zM(s,t){function e(n,i=Ii){let r;const a=re.getTransfer(i);if(n===En)return s.UNSIGNED_BYTE;if(n===qc)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Yc)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Gf)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Hf)return s.UNSIGNED_INT_10F_11F_11F_REV;if(n===zf)return s.BYTE;if(n===kf)return s.SHORT;if(n===Ur)return s.UNSIGNED_SHORT;if(n===Xc)return s.INT;if(n===si)return s.UNSIGNED_INT;if(n===Wn)return s.FLOAT;if(n===dn)return s.HALF_FLOAT;if(n===Vf)return s.ALPHA;if(n===Wf)return s.RGB;if(n===ni)return s.RGBA;if(n===Wi)return s.DEPTH_COMPONENT;if(n===Ui)return s.DEPTH_STENCIL;if(n===Zc)return s.RED;if(n===Kc)return s.RED_INTEGER;if(n===ds)return s.RG;if(n===$c)return s.RG_INTEGER;if(n===Jc)return s.RGBA_INTEGER;if(n===Xa||n===qa||n===Ya||n===Za)if(a===ge)if(r=t.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===Xa)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===qa)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Ya)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Za)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=t.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===Xa)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===qa)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Ya)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Za)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===kl||n===Gl||n===Hl||n===Vl)if(r=t.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===kl)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Gl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Hl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Vl)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Wl||n===Xl||n===ql||n===Yl||n===Zl||n===io||n===Kl)if(r=t.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Wl||n===Xl)return a===ge?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ql)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC;if(n===Yl)return r.COMPRESSED_R11_EAC;if(n===Zl)return r.COMPRESSED_SIGNED_R11_EAC;if(n===io)return r.COMPRESSED_RG11_EAC;if(n===Kl)return r.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===$l||n===Jl||n===Ql||n===jl||n===tc||n===ec||n===nc||n===ic||n===sc||n===rc||n===ac||n===oc||n===lc||n===cc)if(r=t.get("WEBGL_compressed_texture_astc"),r!==null){if(n===$l)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Jl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ql)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===jl)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===tc)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ec)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===nc)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===ic)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===sc)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===rc)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===ac)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===oc)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===lc)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===cc)return a===ge?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===uc||n===hc||n===fc)if(r=t.get("EXT_texture_compression_bptc"),r!==null){if(n===uc)return a===ge?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===hc)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===fc)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===dc||n===pc||n===so||n===mc)if(r=t.get("EXT_texture_compression_rgtc"),r!==null){if(n===dc)return r.COMPRESSED_RED_RGTC1_EXT;if(n===pc)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===so)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===mc)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Ws?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:e}}const kM=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,GM=`
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

}`;class HM{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new rd(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new hn({vertexShader:kM,fragmentShader:GM,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Cn(new jr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class VM extends Zi{constructor(t,e){super();const n=this;let i=null,r=1,a=null,o="local-floor",l=1,c=null,u=null,p=null,h=null,d=null,g=null;const m=typeof XRWebGLBinding<"u",f=new HM,_={},v=e.getContextAttributes();let S=null,M=null;const E=[],b=[],x=new rt;let y=null,A=null;const R=new Vn;R.viewport=new Ce;const C=new Vn;C.viewport=new Ce;const L=[R,C],N=new J_;let D=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Y){let it=E[Y];return it===void 0&&(it=new Ko,E[Y]=it),it.getTargetRaySpace()},this.getControllerGrip=function(Y){let it=E[Y];return it===void 0&&(it=new Ko,E[Y]=it),it.getGripSpace()},this.getHand=function(Y){let it=E[Y];return it===void 0&&(it=new Ko,E[Y]=it),it.getHandSpace()};function z(Y){const it=b.indexOf(Y.inputSource);if(it===-1)return;const St=E[it];St!==void 0&&(St.update(Y.inputSource,Y.frame,c||a),St.dispatchEvent({type:Y.type,data:Y.inputSource}))}function U(){i.removeEventListener("select",z),i.removeEventListener("selectstart",z),i.removeEventListener("selectend",z),i.removeEventListener("squeeze",z),i.removeEventListener("squeezestart",z),i.removeEventListener("squeezeend",z),i.removeEventListener("end",U),i.removeEventListener("inputsourceschange",X);for(let Y=0;Y<E.length;Y++){const it=b[Y];it!==null&&(b[Y]=null,E[Y].disconnect(it))}D=null,B=null,f.reset();for(const Y in _)delete _[Y];if(t.setRenderTarget(S),d=null,h=null,p=null,i=null,M=null,Rt.stop(),n.isPresenting=!1,t.setPixelRatio(y),t.setSize(x.width,x.height,!1),A!==null){const Y=A.camera;Y.fov=A.fov,Y.zoom=A.zoom,Y.updateProjectionMatrix(),A=null}n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Y){r=Y,n.isPresenting===!0&&kt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Y){o=Y,n.isPresenting===!0&&kt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||a},this.setReferenceSpace=function(Y){c=Y},this.getBaseLayer=function(){return h!==null?h:d},this.getBinding=function(){return p===null&&m&&(p=new XRWebGLBinding(i,e)),p},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(Y){if(i=Y,i!==null){if(S=t.getRenderTarget(),i.addEventListener("select",z),i.addEventListener("selectstart",z),i.addEventListener("selectend",z),i.addEventListener("squeeze",z),i.addEventListener("squeezestart",z),i.addEventListener("squeezeend",z),i.addEventListener("end",U),i.addEventListener("inputsourceschange",X),v.xrCompatible!==!0&&await e.makeXRCompatible(),y=t.getPixelRatio(),t.getSize(x),m&&"createProjectionLayer"in XRWebGLBinding.prototype){let St=null,Ct=null,gt=null;v.depth&&(gt=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,St=v.stencil?Ui:Wi,Ct=v.stencil?Ws:si);const It={colorFormat:e.RGBA8,depthFormat:gt,scaleFactor:r};p=this.getBinding(),h=p.createProjectionLayer(It),i.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),M=new pn(h.textureWidth,h.textureHeight,{format:ni,type:En,depthTexture:new qs(h.textureWidth,h.textureHeight,Ct,void 0,void 0,void 0,void 0,void 0,void 0,St),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1,storeMultisampledDepthBuffer:h.ignoreDepthValues===!1,storeMultisampledStencilBuffer:h.ignoreDepthValues===!1})}else{const St={antialias:v.antialias,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(i,e,St),i.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),M=new pn(d.framebufferWidth,d.framebufferHeight,{format:ni,type:En,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil,resolveDepthBuffer:d.ignoreDepthValues===!1,resolveStencilBuffer:d.ignoreDepthValues===!1,storeMultisampledDepthBuffer:d.ignoreDepthValues===!1,storeMultisampledStencilBuffer:d.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(l),c=null,a=await i.requestReferenceSpace(o),Rt.setContext(i),Rt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return f.getDepthTexture()};function X(Y){for(let it=0;it<Y.removed.length;it++){const St=Y.removed[it],Ct=b.indexOf(St);Ct>=0&&(b[Ct]=null,E[Ct].disconnect(St))}for(let it=0;it<Y.added.length;it++){const St=Y.added[it];let Ct=b.indexOf(St);if(Ct===-1){for(let It=0;It<E.length;It++)if(It>=b.length){b.push(St),Ct=It;break}else if(b[It]===null){b[It]=St,Ct=It;break}if(Ct===-1)break}const gt=E[Ct];gt&&gt.connect(St)}}function G(Y,it){it===null?Y.matrixWorld.copy(Y.matrix):Y.matrixWorld.multiplyMatrices(it.matrixWorld,Y.matrix),Y.matrixWorldInverse.copy(Y.matrixWorld).invert()}this.updateCamera=function(Y){if(i===null)return;let it=Y.near,St=Y.far;f.texture!==null&&(f.depthNear>0&&(it=f.depthNear),f.depthFar>0&&(St=f.depthFar)),N.near=C.near=R.near=it,N.far=C.far=R.far=St,(D!==N.near||B!==N.far)&&(i.updateRenderState({depthNear:N.near,depthFar:N.far}),D=N.near,B=N.far),N.layers.mask=Y.layers.mask|6,R.layers.mask=N.layers.mask&-5,C.layers.mask=N.layers.mask&-3;const Ct=Y.parent,gt=N.cameras;G(N,Ct);for(let It=0;It<gt.length;It++)G(gt[It],Ct);N.projectionMatrix.copy(R.projectionMatrix),N.projectionMatrixInverse.copy(R.projectionMatrixInverse),A===null&&Y.isPerspectiveCamera&&(A={camera:Y,fov:Y.fov,zoom:Y.zoom}),K(Y,N,Ct)};function K(Y,it,St){St===null?Y.matrix.copy(it.matrixWorld):(Y.matrix.copy(St.matrixWorld),Y.matrix.invert(),Y.matrix.multiply(it.matrixWorld)),Y.matrix.decompose(Y.position,Y.quaternion,Y.scale),Y.updateMatrixWorld(!0),Y.projectionMatrix.copy(it.projectionMatrix),Y.projectionMatrixInverse.copy(it.projectionMatrixInverse),Y.isPerspectiveCamera&&(Y.fov=Fr*2*Math.atan(1/Y.projectionMatrix.elements[5]),Y.zoom=1)}this.getCamera=function(){return N},this.getFoveation=function(){if(!(h===null&&d===null))return l},this.setFoveation=function(Y){l=Y,h!==null&&(h.fixedFoveation=Y),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Y)},this.hasDepthSensing=function(){return f.texture!==null},this.getDepthSensingMesh=function(){return f.getMesh(N)},this.getCameraTexture=function(Y){return _[Y]};let Z=null;function at(Y,it){if(u=it.getViewerPose(c||a),g=it,u!==null){const St=u.views;d!==null&&(t.setRenderTargetFramebuffer(M,d.framebuffer),t.setRenderTarget(M));let Ct=!1;St.length!==N.cameras.length&&(N.cameras.length=0,Ct=!0);for(let Ft=0;Ft<St.length;Ft++){const Yt=St[Ft];let ie=null;if(d!==null)ie=d.getViewport(Yt);else{const mt=p.getViewSubImage(h,Yt);ie=mt.viewport,Ft===0&&(t.setRenderTargetTextures(M,mt.colorTexture,mt.depthStencilTexture),t.setRenderTarget(M))}let tt=L[Ft];tt===void 0&&(tt=new Vn,tt.layers.enable(Ft),tt.viewport=new Ce,L[Ft]=tt),tt.matrix.fromArray(Yt.transform.matrix),tt.matrix.decompose(tt.position,tt.quaternion,tt.scale),tt.projectionMatrix.fromArray(Yt.projectionMatrix),tt.projectionMatrixInverse.copy(tt.projectionMatrix).invert(),tt.viewport.set(ie.x,ie.y,ie.width,ie.height),Ft===0&&(N.matrix.copy(tt.matrix),N.matrix.decompose(N.position,N.quaternion,N.scale)),Ct===!0&&N.cameras.push(tt)}const gt=i.enabledFeatures;if(gt&&gt.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&m){p=n.getBinding();const Ft=p.getDepthInformation(St[0]);Ft&&Ft.isValid&&Ft.texture&&f.init(Ft,i.renderState)}if(gt&&gt.includes("camera-access")&&m){t.state.unbindTexture(),p=n.getBinding();for(let Ft=0;Ft<St.length;Ft++){const Yt=St[Ft].camera;if(Yt){let ie=_[Yt];ie||(ie=new rd,_[Yt]=ie);const tt=p.getCameraImage(Yt);ie.sourceTexture=tt}}}}for(let St=0;St<E.length;St++){const Ct=b[St],gt=E[St];Ct!==null&&gt!==void 0&&gt.update(Ct,it,c||a)}Z&&Z(Y,it),it.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:it}),g=null}const Rt=new Sd;Rt.setAnimationLoop(at),this.setAnimationLoop=function(Y){Z=Y},this.dispose=function(){}}}const WM=new ae,Dd=new Wt;Dd.set(-1,0,0,0,1,0,0,0,1);function XM(s,t){function e(f,_){f.matrixAutoUpdate===!0&&f.updateMatrix(),_.value.copy(f.matrix)}function n(f,_){_.color.getRGB(f.fogColor.value,gd(s)),_.isFog?(f.fogNear.value=_.near,f.fogFar.value=_.far):_.isFogExp2&&(f.fogDensity.value=_.density)}function i(f,_,v,S,M){_.isNodeMaterial?_.uniformsNeedUpdate=!1:_.isMeshBasicMaterial?r(f,_):_.isMeshLambertMaterial?(r(f,_),_.envMap&&(f.envMapIntensity.value=_.envMapIntensity)):_.isMeshToonMaterial?(r(f,_),p(f,_)):_.isMeshPhongMaterial?(r(f,_),u(f,_),_.envMap&&(f.envMapIntensity.value=_.envMapIntensity)):_.isMeshStandardMaterial?(r(f,_),h(f,_),_.isMeshPhysicalMaterial&&d(f,_,M)):_.isMeshMatcapMaterial?(r(f,_),g(f,_)):_.isMeshDepthMaterial?r(f,_):_.isMeshDistanceMaterial?(r(f,_),m(f,_)):_.isMeshNormalMaterial?r(f,_):_.isLineBasicMaterial?(a(f,_),_.isLineDashedMaterial&&o(f,_)):_.isPointsMaterial?l(f,_,v,S):_.isSpriteMaterial?c(f,_):_.isShadowMaterial?(f.color.value.copy(_.color),f.opacity.value=_.opacity):_.isShaderMaterial&&(_.uniformsNeedUpdate=!1)}function r(f,_){f.opacity.value=_.opacity,_.color&&f.diffuse.value.copy(_.color),_.emissive&&f.emissive.value.copy(_.emissive).multiplyScalar(_.emissiveIntensity),_.map&&(f.map.value=_.map,e(_.map,f.mapTransform)),_.alphaMap&&(f.alphaMap.value=_.alphaMap,e(_.alphaMap,f.alphaMapTransform)),_.bumpMap&&(f.bumpMap.value=_.bumpMap,e(_.bumpMap,f.bumpMapTransform),f.bumpScale.value=_.bumpScale,_.side===fn&&(f.bumpScale.value*=-1)),_.normalMap&&(f.normalMap.value=_.normalMap,e(_.normalMap,f.normalMapTransform),f.normalScale.value.copy(_.normalScale),_.side===fn&&f.normalScale.value.negate()),_.displacementMap&&(f.displacementMap.value=_.displacementMap,e(_.displacementMap,f.displacementMapTransform),f.displacementScale.value=_.displacementScale,f.displacementBias.value=_.displacementBias),_.emissiveMap&&(f.emissiveMap.value=_.emissiveMap,e(_.emissiveMap,f.emissiveMapTransform)),_.specularMap&&(f.specularMap.value=_.specularMap,e(_.specularMap,f.specularMapTransform)),_.alphaTest>0&&(f.alphaTest.value=_.alphaTest);const v=t.get(_),S=v.envMap,M=v.envMapRotation;S&&(f.envMap.value=S,f.envMapRotation.value.setFromMatrix4(WM.makeRotationFromEuler(M)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&f.envMapRotation.value.premultiply(Dd),f.reflectivity.value=_.reflectivity,f.ior.value=_.ior,f.refractionRatio.value=_.refractionRatio),_.lightMap&&(f.lightMap.value=_.lightMap,f.lightMapIntensity.value=_.lightMapIntensity,e(_.lightMap,f.lightMapTransform)),_.aoMap&&(f.aoMap.value=_.aoMap,f.aoMapIntensity.value=_.aoMapIntensity,e(_.aoMap,f.aoMapTransform))}function a(f,_){f.diffuse.value.copy(_.color),f.opacity.value=_.opacity,_.map&&(f.map.value=_.map,e(_.map,f.mapTransform))}function o(f,_){f.dashSize.value=_.dashSize,f.totalSize.value=_.dashSize+_.gapSize,f.scale.value=_.scale}function l(f,_,v,S){f.diffuse.value.copy(_.color),f.opacity.value=_.opacity,f.size.value=_.size*v,f.scale.value=S*.5,_.map&&(f.map.value=_.map,e(_.map,f.uvTransform)),_.alphaMap&&(f.alphaMap.value=_.alphaMap,e(_.alphaMap,f.alphaMapTransform)),_.alphaTest>0&&(f.alphaTest.value=_.alphaTest)}function c(f,_){f.diffuse.value.copy(_.color),f.opacity.value=_.opacity,f.rotation.value=_.rotation,_.map&&(f.map.value=_.map,e(_.map,f.mapTransform)),_.alphaMap&&(f.alphaMap.value=_.alphaMap,e(_.alphaMap,f.alphaMapTransform)),_.alphaTest>0&&(f.alphaTest.value=_.alphaTest)}function u(f,_){f.specular.value.copy(_.specular),f.shininess.value=Math.max(_.shininess,1e-4)}function p(f,_){_.gradientMap&&(f.gradientMap.value=_.gradientMap)}function h(f,_){f.metalness.value=_.metalness,_.metalnessMap&&(f.metalnessMap.value=_.metalnessMap,e(_.metalnessMap,f.metalnessMapTransform)),f.roughness.value=_.roughness,_.roughnessMap&&(f.roughnessMap.value=_.roughnessMap,e(_.roughnessMap,f.roughnessMapTransform)),_.envMap&&(f.envMapIntensity.value=_.envMapIntensity)}function d(f,_,v){f.ior.value=_.ior,_.diffuseRoughness>0&&(f.diffuseRoughness.value=_.diffuseRoughness,_.diffuseRoughnessMap&&(f.diffuseRoughnessMap.value=_.diffuseRoughnessMap,e(_.diffuseRoughnessMap,f.diffuseRoughnessMapTransform))),_.sheen>0&&(f.sheenColor.value.copy(_.sheenColor).multiplyScalar(_.sheen),f.sheenRoughness.value=_.sheenRoughness,_.sheenColorMap&&(f.sheenColorMap.value=_.sheenColorMap,e(_.sheenColorMap,f.sheenColorMapTransform)),_.sheenRoughnessMap&&(f.sheenRoughnessMap.value=_.sheenRoughnessMap,e(_.sheenRoughnessMap,f.sheenRoughnessMapTransform))),_.clearcoat>0&&(f.clearcoat.value=_.clearcoat,f.clearcoatRoughness.value=_.clearcoatRoughness,_.clearcoatMap&&(f.clearcoatMap.value=_.clearcoatMap,e(_.clearcoatMap,f.clearcoatMapTransform)),_.clearcoatRoughnessMap&&(f.clearcoatRoughnessMap.value=_.clearcoatRoughnessMap,e(_.clearcoatRoughnessMap,f.clearcoatRoughnessMapTransform)),_.clearcoatNormalMap&&(f.clearcoatNormalMap.value=_.clearcoatNormalMap,e(_.clearcoatNormalMap,f.clearcoatNormalMapTransform),f.clearcoatNormalScale.value.copy(_.clearcoatNormalScale),_.side===fn&&f.clearcoatNormalScale.value.negate())),_.dispersion>0&&(f.dispersion.value=_.dispersion),_.retroreflectivity>0&&(f.retroreflectivity.value=_.retroreflectivity),_.iridescence>0&&(f.iridescence.value=_.iridescence,f.iridescenceIOR.value=_.iridescenceIOR,f.iridescenceThicknessMinimum.value=_.iridescenceThicknessMinimum,f.iridescenceThicknessMaximum.value=_.iridescenceThicknessMaximum,_.iridescenceMap&&(f.iridescenceMap.value=_.iridescenceMap,e(_.iridescenceMap,f.iridescenceMapTransform)),_.iridescenceThicknessMap&&(f.iridescenceThicknessMap.value=_.iridescenceThicknessMap,e(_.iridescenceThicknessMap,f.iridescenceThicknessMapTransform))),_.transmission>0&&(f.transmission.value=_.transmission,f.transmissionSamplerMap.value=v.texture,f.transmissionSamplerSize.value.set(v.width,v.height),_.transmissionMap&&(f.transmissionMap.value=_.transmissionMap,e(_.transmissionMap,f.transmissionMapTransform)),f.thickness.value=_.thickness,_.thicknessMap&&(f.thicknessMap.value=_.thicknessMap,e(_.thicknessMap,f.thicknessMapTransform)),f.attenuationDistance.value=_.attenuationDistance,f.attenuationColor.value.copy(_.attenuationColor)),_.anisotropy>0&&(f.anisotropyVector.value.set(_.anisotropy*Math.cos(_.anisotropyRotation),_.anisotropy*Math.sin(_.anisotropyRotation)),_.anisotropyMap&&(f.anisotropyMap.value=_.anisotropyMap,e(_.anisotropyMap,f.anisotropyMapTransform))),f.specularIntensity.value=_.specularIntensity,f.specularColor.value.copy(_.specularColor),_.specularColorMap&&(f.specularColorMap.value=_.specularColorMap,e(_.specularColorMap,f.specularColorMapTransform)),_.specularIntensityMap&&(f.specularIntensityMap.value=_.specularIntensityMap,e(_.specularIntensityMap,f.specularIntensityMapTransform))}function g(f,_){_.matcap&&(f.matcap.value=_.matcap)}function m(f,_){const v=t.get(_).light;f.referencePosition.value.setFromMatrixPosition(v.matrixWorld),f.nearDistance.value=v.shadow.camera.near,f.farDistance.value=v.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function qM(s,t,e,n){let i={},r={};function a(v,S){const M=S.program;n.uniformBlockBinding(v,M,i[v.id])}function o(v,S){let M=i[v.id];M===void 0&&(g(v),M=l(v),i[v.id]=M,v.addEventListener("dispose",f));const E=S.program;n.updateUBOMapping(v,E);const b=t.render.frame;r[v.id]!==b&&(c(v),r[v.id]=b)}function l(v){const S=s.createBuffer(),M=v.__size,E=v.usage;return s.bindBuffer(s.UNIFORM_BUFFER,S),s.bufferData(s.UNIFORM_BUFFER,M,E),s.bindBuffer(s.UNIFORM_BUFFER,null),S}function c(v){const S=i[v.id],M=v.uniforms,E=v.__cache;s.bindBuffer(s.UNIFORM_BUFFER,S);for(let b=0,x=M.length;b<x;b++){const y=M[b];if(Array.isArray(y))for(let A=0,R=y.length;A<R;A++)u(y[A],b,A,E);else u(y,b,0,E)}s.bindBuffer(s.UNIFORM_BUFFER,null)}function u(v,S,M,E){if(h(v,S,M,E)===!0){const b=v.__offset,x=v.value;if(Array.isArray(x)){let y=0;for(let A=0;A<x.length;A++){const R=x[A],C=m(R,!0);p(R,v.__data,y),y+=C.storage/Float32Array.BYTES_PER_ELEMENT}}else p(x,v.__data,0);s.bufferSubData(s.UNIFORM_BUFFER,b,v.__data)}}function p(v,S,M){typeof v=="number"||typeof v=="boolean"?S[M]=v:v.isMatrix3?(S[M]=v.elements[0],S[M+1]=v.elements[1],S[M+2]=v.elements[2],S[M+3]=0,S[M+4]=v.elements[3],S[M+5]=v.elements[4],S[M+6]=v.elements[5],S[M+7]=0,S[M+8]=v.elements[6],S[M+9]=v.elements[7],S[M+10]=v.elements[8],S[M+11]=0):ArrayBuffer.isView(v)?S.set(v.subarray(0,S.length-M),M):v.toArray(S,M)}function h(v,S,M,E){const b=v.value,x=S+"_"+M;if(Array.isArray(b)){E[x]===void 0&&(E[x]=[]);const y=E[x];let A=!1;for(let R=0;R<b.length;R++)d(b[R],y,R)===!0&&(A=!0);return A}return d(b,E,x)}function d(v,S,M){if(S[M]===void 0)return typeof v=="number"||typeof v=="boolean"?S[M]=v:ArrayBuffer.isView(v)?S[M]=v.slice():S[M]=v.clone(),!0;{const E=S[M];if(typeof v=="number"||typeof v=="boolean"){if(E!==v)return S[M]=v,!0}else{if(ArrayBuffer.isView(v))return!0;if(E.equals(v)===!1)return E.copy(v),!0}}return!1}function g(v){const S=v.uniforms;let M=0;const E=16;for(let x=0,y=S.length;x<y;x++){const A=Array.isArray(S[x])?S[x]:[S[x]];for(let R=0,C=A.length;R<C;R++){const L=A[R],N=Array.isArray(L.value)?L.value:[L.value],D=Array.isArray(S[x])||Array.isArray(L.value);let B=M;for(let U=0,X=N.length;U<X;U++){const G=N[U],K=m(G,D),Z=M%E,at=Z%K.boundary,Rt=Z+at;M+=at,Rt!==0&&E-Rt<K.storage&&(M+=E-Rt),U===0&&(B=M),M+=K.storage}const z=L.type==="int"?Int32Array:L.type==="uint"?Uint32Array:Float32Array;L.__data=new z((M-B)/Float32Array.BYTES_PER_ELEMENT),L.__offset=B}}const b=M%E;return b>0&&(M+=E-b),v.__size=M,v.__cache={},this}function m(v,S){const M={boundary:0,storage:0};return typeof v=="number"||typeof v=="boolean"?(M.boundary=4,M.storage=4):v.isVector2?(M.boundary=8,M.storage=8):v.isVector3||v.isColor?(M.boundary=16,M.storage=12):v.isVector4?(M.boundary=16,M.storage=16):v.isMatrix3?(M.boundary=16,M.storage=48):v.isMatrix4?(M.boundary=16,M.storage=64):v.isTexture?kt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(v)?(M.boundary=16,M.storage=v.byteLength):kt("WebGLRenderer: Unsupported uniform value type.",v),S===!0&&(M.boundary=16,M.storage=Math.ceil(M.storage/16)*16),M}function f(v){const S=v.target;S.removeEventListener("dispose",f),s.deleteBuffer(i[S.id]),delete i[S.id],delete r[S.id]}function _(){for(const v in i)s.deleteBuffer(i[v]);i={},r={}}return{bind:a,update:o,dispose:_}}const YM=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let Jn=null;function ZM(){return Jn===null&&(Jn=new nu(YM,16,16,ds,dn),Jn.name="DFG_LUT",Jn.minFilter=on,Jn.magFilter=on,Jn.wrapS=xi,Jn.wrapT=xi,Jn.generateMipmaps=!1,Jn.needsUpdate=!0),Jn}class KM{constructor(t={}){const{canvas:e=ym(),context:n=null,depth:i=!0,stencil:r=!1,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:p=!1,reversedDepthBuffer:h=!1,outputBufferType:d=En}=t;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=a;const m=d,f=new Set([Jc,$c,Kc]),_=new Set([En,si,Ur,Ws,qc,Yc]),v=new Uint32Array(4),S=new Int32Array(4),M={textures:[],min:[],max:[],resolution:[]};let E=null,b=null;const x=[],y=[];let A=null;this.domElement=e,this.debug={checkShaderErrors:!0,diagnostics:{keywords:!1},onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Mi,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const R=this;let C=!1,L=null,N=null,D=null,B=null;this._outputColorSpace=yn;let z=0,U=0,X=null,G=-1,K=null;const Z=new Ce,at=new Ce;let Rt=null;const Y=new Xt(0);let it=0,St=e.width,Ct=e.height,gt=1,It=null,ce=null;const Ft=new Ce(0,0,St,Ct),Yt=new Ce(0,0,St,Ct);let ie=!1;const tt=new Br,mt=new iu;let ft=!1,Et=!1;const Mt=new ae,Vt=new I,Lt=new Ce,te={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let se=!1;function oe(){return X===null?gt:1}let k=n;function xe(T,O){return e.getContext(T,O)}let Zt,Kt,dt,ye,Ot,zt,P,w,W,st,et,pt,vt,J,j,ct,F,Q,$,_t,nt,ut,Nt;try{const T={alpha:!0,depth:i,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:u,failIfMajorPerformanceCaveat:p};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Bc}`),e.addEventListener("webglcontextlost",Ut,!1),e.addEventListener("webglcontextrestored",qt,!1),e.addEventListener("webglcontextcreationerror",yt,!1),k===null){const O="webgl2";if(k=xe(O,T),k===null)throw xe(O)?new Error("THREE.WebGLRenderer: Error creating WebGL context with your selected attributes."):new Error("THREE.WebGLRenderer: Error creating WebGL context.")}$t()}catch(T){throw e.removeEventListener("webglcontextlost",Ut,!1),e.removeEventListener("webglcontextrestored",qt,!1),e.removeEventListener("webglcontextcreationerror",yt,!1),he("WebGLRenderer: "+T.message),T}function $t(){Zt=new Qx(k),Zt.init(),nt=new zM(k,Zt),Kt=new Gx(k,Zt,t,nt),dt=new FM(k,Zt),Kt.reversedDepthBuffer&&h&&dt.buffers.depth.setReversed(!0),N=k.createFramebuffer(),D=k.createFramebuffer(),B=k.createFramebuffer(),ye=new ev(k),Ot=new bM,zt=new BM(k,Zt,dt,Ot,Kt,nt,ye),P=new Jx(R),w=new ig(k),ut=new zx(k,w),W=new jx(k,w,ye,ut),st=new iv(k,W,w,ut,ye),Q=new nv(k,Kt,zt),j=new Hx(Ot),et=new yM(R,P,Zt,Kt,ut,j),pt=new XM(R,Ot),vt=new TM,J=new DM(Zt),F=new Bx(R,P,dt,st,g,l),ct=new OM(R,st,Kt),Nt=new qM(k,ye,Kt,dt),$=new kx(k,Zt,ye),_t=new tv(k,Zt,ye),ye.programs=et.programs,R.capabilities=Kt,R.extensions=Zt,R.properties=Ot,R.renderLists=vt,R.shadowMap=ct,R.state=dt,R.info=ye}m!==En&&(A=new rv(m,e.width,e.height,o,i,r));const ot=new VM(R,k);this.xr=ot,this.getContext=function(){return k},this.getContextAttributes=function(){return k.getContextAttributes()},this.forceContextLoss=function(){const T=Zt.get("WEBGL_lose_context");T&&T.loseContext()},this.forceContextRestore=function(){const T=Zt.get("WEBGL_lose_context");T&&T.restoreContext()},this.getPixelRatio=function(){return gt},this.setPixelRatio=function(T){T!==void 0&&(gt=T,this.setSize(St,Ct,!1))},this.getSize=function(T){return T.set(St,Ct)},this.setSize=function(T,O,q=!0){if(ot.isPresenting){kt("WebGLRenderer: Can't change size while VR device is presenting.");return}St=T,Ct=O,e.width=Math.floor(T*gt),e.height=Math.floor(O*gt),q===!0&&(e.style.width=T+"px",e.style.height=O+"px"),A!==null&&A.setSize(e.width,e.height),this.setViewport(0,0,T,O)},this.getDrawingBufferSize=function(T){return T.set(St*gt,Ct*gt).floor()},this.setDrawingBufferSize=function(T,O,q){St=T,Ct=O,gt=q,e.width=Math.floor(T*q),e.height=Math.floor(O*q),this.setViewport(0,0,T,O)},this.setEffects=function(T){if(m===En){he("WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(T){for(let O=0;O<T.length;O++)if(T[O].isOutputPass===!0){kt("WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(T||[])},this.getCurrentViewport=function(T){return T.copy(Z)},this.getViewport=function(T){return T.copy(Ft)},this.setViewport=function(T,O,q,H){T.isVector4?Ft.set(T.x,T.y,T.z,T.w):Ft.set(T,O,q,H),dt.viewport(Z.copy(Ft).multiplyScalar(oe()).round())},this.getScissor=function(T){return T.copy(Yt)},this.setScissor=function(T,O,q,H){T.isVector4?Yt.set(T.x,T.y,T.z,T.w):Yt.set(T,O,q,H),dt.scissor(at.copy(Yt).multiplyScalar(oe()).round())},this.getScissorTest=function(){return ie},this.setScissorTest=function(T){dt.setScissorTest(ie=T)},this.setOpaqueSort=function(T){It=T},this.setTransparentSort=function(T){ce=T},this.getClearColor=function(T){return T.copy(F.getClearColor())},this.setClearColor=function(){F.setClearColor(...arguments)},this.getClearAlpha=function(){return F.getClearAlpha()},this.setClearAlpha=function(){F.setClearAlpha(...arguments)},this.clear=function(T=!0,O=!0,q=!0){let H=0;if(T){let V=!1;if(X!==null){const lt=X.texture.format;V=f.has(lt)}if(V){const lt=X.texture.type,Tt=_.has(lt),ht=F.getClearColor(),xt=F.getClearAlpha(),At=ht.r,Bt=ht.g,Qt=ht.b;Tt?(v[0]=At,v[1]=Bt,v[2]=Qt,v[3]=xt,k.clearBufferuiv(k.COLOR,0,v)):(S[0]=At,S[1]=Bt,S[2]=Qt,S[3]=xt,k.clearBufferiv(k.COLOR,0,S))}else H|=k.COLOR_BUFFER_BIT}O&&(H|=k.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),q&&(H|=k.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),H!==0&&k.clear(H)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(T){T.setRenderer(this),L=T},this.dispose=function(){e.removeEventListener("webglcontextlost",Ut,!1),e.removeEventListener("webglcontextrestored",qt,!1),e.removeEventListener("webglcontextcreationerror",yt,!1),F.dispose(),vt.dispose(),J.dispose(),zt.dispose(),Ot.dispose(),P.dispose(),st.dispose(),W.dispose(),ut.dispose(),Nt.dispose(),et.dispose(),ot.dispose(),ot.removeEventListener("sessionstart",ia),ot.removeEventListener("sessionend",Ti),oi.stop()};function Ut(T){T.preventDefault(),Zu("WebGLRenderer: Context Lost."),C=!0}function qt(){Zu("WebGLRenderer: Context Restored."),C=!1;const T=ye.autoReset,O=ct.enabled,q=ct.autoUpdate,H=ct.needsUpdate,V=ct.type;$t(),ye.autoReset=T,ct.enabled=O,ct.autoUpdate=q,ct.needsUpdate=H,ct.type=V}function yt(T){he("WebGLRenderer: A WebGL context could not be created. Reason: ",T.statusMessage)}function de(T){const O=T.target;O.removeEventListener("dispose",de),Oe(O)}function Oe(T){Zn(T),Ot.remove(T)}function Zn(T){const O=Ot.get(T).programs;O!==void 0&&(O.forEach(function(q){et.releaseProgram(q)}),T.isShaderMaterial&&et.releaseShaderCache(T))}this.renderBufferDirect=function(T,O,q,H,V,lt){O===null&&(O=te);const Tt=V.isMesh&&V.matrixWorld.determinantAffine()<0,ht=Jt(T,O,q,H,V);dt.setMaterial(H,Tt);let xt=q.index,At=1;if(H.wireframe===!0){if(xt=W.getWireframeAttribute(q),xt===void 0)return;At=2}const Bt=q.drawRange,Qt=q.attributes.position;let bt=Bt.start*At,jt=(Bt.start+Bt.count)*At;lt!==null&&(bt=Math.max(bt,lt.start*At),jt=Math.min(jt,(lt.start+lt.count)*At)),xt!==null?(bt=Math.max(bt,0),jt=Math.min(jt,xt.count)):Qt!=null&&(bt=Math.max(bt,0),jt=Math.min(jt,Qt.count));const Le=jt-bt;if(Le<0||Le===1/0)return;ut.setup(V,H,ht,q,xt);let pe,ve=$;if(xt!==null&&(pe=w.get(xt),ve=_t,ve.setIndex(pe)),V.isMesh)H.wireframe===!0?(dt.setLineWidth(H.wireframeLinewidth*oe()),ve.setMode(k.LINES)):ve.setMode(k.TRIANGLES);else if(V.isLine){let Fe=H.linewidth;Fe===void 0&&(Fe=1),dt.setLineWidth(Fe*oe()),V.isLineSegments?ve.setMode(k.LINES):V.isLineLoop?ve.setMode(k.LINE_LOOP):ve.setMode(k.LINE_STRIP)}else V.isPoints?ve.setMode(k.POINTS):V.isSprite&&ve.setMode(k.TRIANGLES);if(V.isBatchedMesh)if(Zt.get("WEBGL_multi_draw"))ve.renderMultiDraw(V._multiDrawStarts,V._multiDrawCounts,V._multiDrawCount);else{const Fe=V._multiDrawStarts,Dt=V._multiDrawCounts,Ke=V._multiDrawCount,me=xt?w.get(xt).bytesPerElement:1,$i=Ot.get(H).currentProgram.getUniforms();for(let tn=0;tn<Ke;tn++)$i.setValue(k,"_gl_DrawID",tn),ve.render(Fe[tn]/me,Dt[tn])}else if(V.isInstancedMesh)ve.renderInstances(bt,Le,V.count);else if(q.isInstancedBufferGeometry){const Fe=q._maxInstanceCount!==void 0?q._maxInstanceCount:1/0,Dt=Math.min(q.instanceCount,Fe);ve.renderInstances(bt,Le,Dt)}else ve.render(bt,Le)};function na(T,O,q,H){L!==null&&T.isNodeMaterial&&L.setObject(H,T),ft===!0&&j.setState(T,q,!1),T.transparent===!0&&T.side===ti&&T.forceSinglePass===!1?(T.side=fn,T.needsUpdate=!0,wi(T,O,H),T.side=fs,T.needsUpdate=!0,wi(T,O,H),T.side=ti):wi(T,O,H)}this.compile=function(T,O,q=null){q===null&&(q=T),L!==null&&L.renderStart(T,O,q),b=J.get(q),b.init(O),y.push(b),q.traverseVisible(function(V){V.isLight&&V.layers.test(O.layers)&&(b.pushLight(V),V.castShadow&&b.pushShadow(V))}),T!==q&&T.traverseVisible(function(V){V.isLight&&V.layers.test(O.layers)&&(b.pushLight(V),V.castShadow&&b.pushShadow(V))}),b.setupLights(),L!==null&&L.updateLights(b.state.lightsArray),Et=this.localClippingEnabled,ft=j.init(this.clippingPlanes,Et),ft===!0&&j.setGlobalState(this.clippingPlanes,O),L!==null&&ct.render(b.state.shadowsArray,q,O);const H=new Set;return T.traverse(function(V){if(!(V.isMesh||V.isPoints||V.isLine||V.isSprite))return;const lt=V.material;if(lt)if(Array.isArray(lt))for(let Tt=0;Tt<lt.length;Tt++){const ht=lt[Tt];na(ht,q,O,V),H.add(ht)}else na(lt,q,O,V),H.add(lt)}),b=y.pop(),L!==null&&L.renderEnd(),H},this.compileAsync=function(T,O,q=null){const H=this.compile(T,O,q);return new Promise(V=>{function lt(){if(H.forEach(function(Tt){const xt=Ot.get(Tt).currentProgram;(xt===void 0||xt.isReady())&&H.delete(Tt)}),H.size===0){V(T);return}setTimeout(lt,10)}Zt.get("KHR_parallel_shader_compile")!==null?lt():setTimeout(lt,10)})};let ar=null;function Fo(T){ar&&ar(T)}function ia(){oi.stop()}function Ti(){oi.start()}const oi=new Sd;oi.setAnimationLoop(Fo),typeof self<"u"&&oi.setContext(self),this.setAnimationLoop=function(T){ar=T,ot.setAnimationLoop(T),T===null?oi.stop():oi.start()},ot.addEventListener("sessionstart",ia),ot.addEventListener("sessionend",Ti),this.render=function(T,O){if(O!==void 0&&O.isCamera!==!0){he("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;L!==null&&L.renderStart(T,O);const q=ot.enabled===!0&&ot.isPresenting===!0,H=A!==null&&(X===null||q)&&A.begin(R,X);if(T.matrixWorldAutoUpdate===!0&&T.updateMatrixWorld(),O.parent===null&&O.matrixWorldAutoUpdate===!0&&O.updateMatrixWorld(),ot.enabled===!0&&ot.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(ot.cameraAutoUpdate===!0&&ot.updateCamera(O),O=ot.getCamera()),T.isScene===!0&&T.onBeforeRender(R,T,O,X),b=J.get(T,y.length),b.init(O),b.state.textureUnits=zt.getTextureUnits(),y.push(b),Mt.multiplyMatrices(O.projectionMatrix,O.matrixWorldInverse),O.isArrayCamera?mt.setFromArrayCamera(O):tt.setFromProjectionMatrix(Mt,Xn,O.reversedDepth),Et=this.localClippingEnabled,ft=j.init(this.clippingPlanes,Et),E=vt.get(T,x.length),E.init(),x.push(E),this.info.render.frame++,ot.enabled===!0&&ot.isPresenting===!0){const Tt=R.xr.getDepthSensingMesh();Tt!==null&&or(Tt,O,-1/0,R.sortObjects)}or(T,O,0,R.sortObjects),E.finish(),L!==null&&L.updateLights(b.state.lightsArray),R.sortObjects===!0&&E.sort(It,ce),se=ot.enabled===!1||ot.isPresenting===!1||ot.hasDepthSensing()===!1,se&&F.addToRenderList(E,T),this.info.autoReset===!0&&this.info.reset(),ft===!0&&j.beginShadows();const V=b.state.shadowsArray;if(ct.render(V,T,O),ft===!0&&j.endShadows(),(H&&A.hasRenderPass())===!1){const Tt=E.opaque,ht=E.transmissive;if(b.setupLights(),O.isArrayCamera){const xt=O.cameras;if(ht.length>0)for(let At=0,Bt=xt.length;At<Bt;At++){const Qt=xt[At];ra(Tt,ht,T,Qt)}se&&F.render(T);for(let At=0,Bt=xt.length;At<Bt;At++){const Qt=xt[At];sa(E,T,Qt,Qt.viewport)}}else ht.length>0&&ra(Tt,ht,T,O),se&&F.render(T),sa(E,T,O)}X!==null&&U===0&&(zt.updateMultisampleRenderTarget(X),zt.updateRenderTargetMipmap(X)),H&&A.end(R),T.isScene===!0&&T.onAfterRender(R,T,O),ut.resetDefaultState(),G=-1,K=null,y.pop(),y.length>0?(b=y[y.length-1],zt.setTextureUnits(b.state.textureUnits),ft===!0&&j.setGlobalState(R.clippingPlanes,b.state.camera)):b=null,x.pop(),x.length>0?E=x[x.length-1]:E=null,L!==null&&L.renderEnd()};function or(T,O,q,H){if(T.visible===!1)return;if(T.layers.test(O.layers)){if(T.isGroup)q=T.renderOrder;else if(T.isLOD)T.autoUpdate===!0&&T.update(O);else if(T.isLight)b.pushLight(T),T.castShadow&&b.pushShadow(T);else if(T.isSprite){const Tt=O.isArrayCamera?mt:tt;if(!T.frustumCulled||T.intersectsFrustum(Tt)){H&&Lt.setFromMatrixPosition(T.matrixWorld).applyMatrix4(Mt);const ht=st.update(T),xt=T.material;xt.visible&&E.push(T,ht,xt,q,Lt.z,null,O)}}else if(T.isMesh||T.isLine||T.isPoints){const Tt=O.isArrayCamera?mt:tt;if(!T.frustumCulled||T.intersectsFrustum(Tt)){const ht=st.update(T),xt=T.material;if(H&&(T.boundingSphere!==void 0?(T.boundingSphere===null&&T.computeBoundingSphere(),Lt.copy(T.boundingSphere.center)):(ht.boundingSphere===null&&ht.computeBoundingSphere(),Lt.copy(ht.boundingSphere.center)),Lt.applyMatrix4(T.matrixWorld).applyMatrix4(Mt)),Array.isArray(xt)){const At=ht.groups;for(let Bt=0,Qt=At.length;Bt<Qt;Bt++){const bt=At[Bt],jt=xt[bt.materialIndex];jt&&jt.visible&&E.push(T,ht,jt,q,Lt.z,bt,O)}}else xt.visible&&E.push(T,ht,xt,q,Lt.z,null,O)}}}const lt=T.children;for(let Tt=0,ht=lt.length;Tt<ht;Tt++)or(lt[Tt],O,q,H)}function sa(T,O,q,H){const{opaque:V,transmissive:lt,transparent:Tt}=T;b.setupLightsView(q),ft===!0&&j.setGlobalState(R.clippingPlanes,q),H&&dt.viewport(Z.copy(H)),V.length>0&&li(V,O,q),lt.length>0&&li(lt,O,q),Tt.length>0&&li(Tt,O,q),dt.buffers.depth.setTest(!0),dt.buffers.depth.setMask(!0),dt.buffers.color.setMask(!0),dt.setPolygonOffset(!1)}function ra(T,O,q,H){if((q.isScene===!0?q.overrideMaterial:null)!==null)return;if(b.state.transmissionRenderTarget[H.id]===void 0){const bt=Zt.has("EXT_color_buffer_half_float")||Zt.has("EXT_color_buffer_float");b.state.transmissionRenderTarget[H.id]=new pn(1,1,{generateMipmaps:!0,type:bt?dn:En,minFilter:vi,samples:Math.max(4,Kt.samples),stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,storeMultisampledDepthBuffer:!1,storeMultisampledStencilBuffer:!1,colorSpace:re.workingColorSpace})}const lt=b.state.transmissionRenderTarget[H.id],Tt=H.viewport||Z;lt.setSize(Tt.z*R.transmissionResolutionScale,Tt.w*R.transmissionResolutionScale);const ht=R.getRenderTarget(),xt=R.getActiveCubeFace(),At=R.getActiveMipmapLevel();R.setRenderTarget(lt),R.getClearColor(Y),it=R.getClearAlpha(),it<1&&R.setClearColor(16777215,.5),R.clear(),se&&F.render(q);const Bt=R.toneMapping;R.toneMapping=Mi;const Qt=H.viewport;if(H.viewport!==void 0&&(H.viewport=void 0),b.setupLightsView(H),ft===!0&&j.setGlobalState(R.clippingPlanes,H),li(T,q,H),zt.updateMultisampleRenderTarget(lt),zt.updateRenderTargetMipmap(lt),Zt.has("WEBGL_multisampled_render_to_texture")===!1){let bt=!1;for(let jt=0,Le=O.length;jt<Le;jt++){const pe=O[jt],{object:ve,geometry:Fe,material:Dt,group:Ke}=pe;if(Dt.side===ti&&ve.layers.test(H.layers)){const me=Dt.side;Dt.side=fn,Dt.needsUpdate=!0,aa(ve,q,H,Fe,Dt,Ke),Dt.side=me,Dt.needsUpdate=!0,bt=!0}}bt===!0&&(zt.updateMultisampleRenderTarget(lt),zt.updateRenderTargetMipmap(lt))}R.setRenderTarget(ht,xt,At),R.setClearColor(Y,it),Qt!==void 0&&(H.viewport=Qt),R.toneMapping=Bt}function li(T,O,q){const H=O.isScene===!0?O.overrideMaterial:null;for(let V=0,lt=T.length;V<lt;V++){const Tt=T[V],{object:ht,geometry:xt,group:At}=Tt;let Bt=Tt.material;Bt.allowOverride===!0&&H!==null&&(Bt=H),ht.layers.test(q.layers)&&aa(ht,O,q,xt,Bt,At)}}function aa(T,O,q,H,V,lt){L!==null&&V.isNodeMaterial&&L.setObject(T,V),T.onBeforeRender(R,O,q,H,V,lt),T.modelViewMatrix.multiplyMatrices(q.matrixWorldInverse,T.matrixWorld),T.normalMatrix.getNormalMatrix(T.modelViewMatrix),V.onBeforeRender(R,O,q,H,T,lt),V.transparent===!0&&V.side===ti&&V.forceSinglePass===!1?(V.side=fn,V.needsUpdate=!0,R.renderBufferDirect(q,O,H,V,T,lt),V.side=fs,V.needsUpdate=!0,R.renderBufferDirect(q,O,H,V,T,lt),V.side=ti):R.renderBufferDirect(q,O,H,V,T,lt),T.onAfterRender(R,O,q,H,V,lt)}function lr(T){let O=0;for(const q of T)q.texture!==null&&O++;return O}function wi(T,O,q){O.isScene!==!0&&(O=te);const H=Ot.get(T),V=b.state.lights,lt=b.state.shadowsArray,Tt=V.state.version,ht=et.getParameters(T,V.state,lt,O,q,b.state.lightProbeGridArray),xt=et.getProgramCacheKey(ht);let At=H.programs;H.environment=T.isMeshStandardMaterial||T.isMeshLambertMaterial||T.isMeshPhongMaterial?O.environment:null,H.fog=O.fog;const Bt=T.isMeshStandardMaterial||T.isMeshLambertMaterial&&!T.envMap||T.isMeshPhongMaterial&&!T.envMap;H.envMap=P.get(T.envMap||H.environment,Bt),H.envMapRotation=H.environment!==null&&T.envMap===null?O.environmentRotation:T.envMapRotation,At===void 0&&(T.addEventListener("dispose",de),At=new Map,H.programs=At,H.programVariants=new Map);let Qt=At.get(xt);if(Qt!==void 0){if(H.currentProgram===Qt&&H.lightsStateVersion===Tt)return Gt(T,ht),Qt}else ht.uniforms=et.getUniforms(T),L!==null&&T.isNodeMaterial&&L.build(T,q,ht),T.onBeforeCompile(ht,R),Qt=et.acquireProgram(ht,xt),At.set(xt,Qt),H.uniforms=ht.uniforms;const bt=H.uniforms;return(!T.isShaderMaterial&&!T.isRawShaderMaterial||T.clipping===!0)&&(bt.clippingPlanes=j.uniform),Gt(T,ht),H.needsLights=Ee(T),H.lightsStateVersion=Tt,H.needsLights&&(bt.ambientLightColor.value=V.state.ambient,bt.lightProbe.value=V.state.probe,bt.sunLights.value=V.state.sun,bt.sunLightShadows.value=V.state.sunShadow,bt.directionalLights.value=V.state.directional,bt.directionalLightShadows.value=V.state.directionalShadow,bt.spotLights.value=V.state.spot,bt.spotLightShadows.value=V.state.spotShadow,bt.rectAreaLights.value=V.state.rectArea,bt.ltc_1.value=V.state.rectAreaLTC1,bt.ltc_2.value=V.state.rectAreaLTC2,bt.pointLights.value=V.state.point,bt.pointLightShadows.value=V.state.pointShadow,bt.hemisphereLights.value=V.state.hemi,bt.sunShadowMatrix.value=V.state.sunShadowMatrix,bt.sunShadowCascade.value=V.state.sunShadowCascade,bt.directionalShadowMatrix.value=V.state.directionalShadowMatrix,bt.spotLightMatrix.value=V.state.spotLightMatrix,bt.spotLightMap.value=V.state.spotLightMap,bt.pointShadowMatrix.value=V.state.pointShadowMatrix),H.numLightProbeGrids=lr(b.state.lightProbeGridArray),H.currentProgram=Qt,H.uniformsList=null,Qt}function oa(T,O,q,H,V){const lt=Ot.get(T),Tt=lt.currentProgram.id+","+H+","+V;let ht=lt.programVariants.get(Tt);return ht===void 0?(ht=wi(T,O,q),lt.programVariants.set(Tt,ht)):(lt.currentProgram=ht,lt.uniformsList=null,lt.outputColorSpace=H,lt.toneMapping=V),ht}function Pt(T){if(T.uniformsList===null){const O=T.currentProgram.getUniforms();T.uniformsList=$a.seqWithValue(O.seq,T.uniforms)}return T.uniformsList}function Gt(T,O){const q=Ot.get(T);q.outputColorSpace=O.outputColorSpace,q.batching=O.batching,q.batchingColor=O.batchingColor,q.instancing=O.instancing,q.instancingColor=O.instancingColor,q.instancingMorph=O.instancingMorph,q.skinning=O.skinning,q.morphTargets=O.morphTargets,q.morphNormals=O.morphNormals,q.morphColors=O.morphColors,q.morphTargetsCount=O.morphTargetsCount,q.numClippingPlanes=O.numClippingPlanes,q.numIntersection=O.numClipIntersection,q.vertexAlphas=O.vertexAlphas,q.vertexTangents=O.vertexTangents,q.toneMapping=O.toneMapping}function Jt(T,O,q,H,V){O.isScene!==!0&&(O=te),zt.resetTextureUnits();const lt=O.fog,Tt=H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial?O.environment:null,ht=X===null?R.outputColorSpace:X.isXRRenderTarget===!0?X.texture.colorSpace:re.workingColorSpace,xt=H.isMeshStandardMaterial||H.isMeshLambertMaterial&&!H.envMap||H.isMeshPhongMaterial&&!H.envMap,At=P.get(H.envMap||Tt,xt),Bt=H.vertexColors===!0&&!!q.attributes.color&&q.attributes.color.itemSize===4,Qt=!!q.attributes.tangent&&(!!H.normalMap||H.anisotropy>0),bt=!!q.morphAttributes.position,jt=!!q.morphAttributes.normal,Le=!!q.morphAttributes.color;let pe=Mi;H.toneMapped&&(X===null||X.isXRRenderTarget===!0)&&(pe=R.toneMapping);const ve=q.morphAttributes.position||q.morphAttributes.normal||q.morphAttributes.color,Fe=ve!==void 0?ve.length:0,Dt=Ot.get(H),Ke=b.state.lights;if(ft===!0&&(Et===!0||T!==K)){const we=T===K&&H.id===G;j.setState(H,T,we)}let me=!1,$i=!1;H.version===Dt.__version?Dt.needsLights&&Dt.lightsStateVersion!==Ke.state.version||V.isBatchedMesh&&Dt.batching===!1||!V.isBatchedMesh&&Dt.batching===!0||V.isBatchedMesh&&Dt.batchingColor===!0&&V._colorsTexture===null||V.isBatchedMesh&&Dt.batchingColor===!1&&V._colorsTexture!==null||V.isInstancedMesh&&Dt.instancing===!1||!V.isInstancedMesh&&Dt.instancing===!0||V.isSkinnedMesh&&Dt.skinning===!1||!V.isSkinnedMesh&&Dt.skinning===!0||V.isInstancedMesh&&Dt.instancingColor===!0&&V.instanceColor===null||V.isInstancedMesh&&Dt.instancingColor===!1&&V.instanceColor!==null||V.isInstancedMesh&&Dt.instancingMorph===!0&&V.morphTexture===null||V.isInstancedMesh&&Dt.instancingMorph===!1&&V.morphTexture!==null||Dt.envMap!==At||H.fog===!0&&Dt.fog!==lt||Dt.numClippingPlanes!==void 0&&(Dt.numClippingPlanes!==j.numPlanes||Dt.numIntersection!==j.numIntersection)||Dt.vertexAlphas!==Bt||Dt.vertexTangents!==Qt||Dt.morphTargets!==bt||Dt.morphNormals!==jt||Dt.morphColors!==Le||Dt.morphTargetsCount!==Fe||Dt.numLightProbeGrids!==lr(b.state.lightProbeGridArray)?me=!0:(Dt.outputColorSpace!==ht||Dt.toneMapping!==pe)&&($i=!0):(me=!0,Dt.__version=H.version);let tn=Dt.currentProgram;(me===!0||$i===!0)&&(tn=$i===!0?oa(H,O,V,ht,pe):wi(H,O,V),L&&H.isNodeMaterial&&L.onUpdateProgram(H,tn,Dt));let la=!1,Ai=!1,Ji=!1;const ue=tn.getUniforms(),$e=Dt.uniforms;if(dt.useProgram(tn.program)&&(la=!0,Ai=!0,Ji=!0),H.id!==G&&(G=H.id,Ai=!0),la||K!==T){dt.buffers.depth.getReversed()&&T.reversedDepth!==!0&&(T._reversedDepth=!0,T.updateProjectionMatrix()),ue.setValue(k,"projectionMatrix",T.projectionMatrix),ue.setValue(k,"viewMatrix",T.matrixWorldInverse);const Xe=ue.map.cameraPosition;Xe!==void 0&&Xe.setValue(k,Vt.setFromMatrixPosition(T.matrixWorld)),Kt.logarithmicDepthBuffer&&ue.setValue(k,"logDepthBufFC",2/(Math.log(T.far+1)/Math.LN2)),(H.isMeshPhongMaterial||H.isMeshToonMaterial||H.isMeshLambertMaterial||H.isMeshBasicMaterial||H.isMeshStandardMaterial||H.isShaderMaterial)&&ue.setValue(k,"isOrthographic",T.isOrthographicCamera===!0),K!==T&&(K=T,Ai=!0,Ji=!0)}if(Dt.needsLights&&(Ke.state.sunShadowMap.length>0&&ue.setValue(k,"sunShadowMap",Ke.state.sunShadowMap,zt),Ke.state.directionalShadowMap.length>0&&ue.setValue(k,"directionalShadowMap",Ke.state.directionalShadowMap,zt),Ke.state.spotShadowMap.length>0&&ue.setValue(k,"spotShadowMap",Ke.state.spotShadowMap,zt),Ke.state.pointShadowMap.length>0&&ue.setValue(k,"pointShadowMap",Ke.state.pointShadowMap,zt)),V.isSkinnedMesh){ue.setOptional(k,V,"bindMatrix"),ue.setOptional(k,V,"bindMatrixInverse");const we=V.skeleton;we&&(we.boneTexture===null&&we.computeBoneTexture(),ue.setValue(k,"boneTexture",we.boneTexture,zt))}V.isBatchedMesh&&(ue.setOptional(k,V,"batchingTexture"),ue.setValue(k,"batchingTexture",V._matricesTexture,zt),ue.setOptional(k,V,"batchingIdTexture"),ue.setValue(k,"batchingIdTexture",V._indirectTexture,zt),ue.setOptional(k,V,"batchingColorTexture"),V._colorsTexture!==null&&ue.setValue(k,"batchingColorTexture",V._colorsTexture,zt));const Bn=q.morphAttributes;if((Bn.position!==void 0||Bn.normal!==void 0||Bn.color!==void 0)&&Q.update(V,q,tn),(Ai||Dt.receiveShadow!==V.receiveShadow)&&(Dt.receiveShadow=V.receiveShadow,ue.setValue(k,"receiveShadow",V.receiveShadow)),(H.isMeshStandardMaterial||H.isMeshLambertMaterial||H.isMeshPhongMaterial)&&H.envMap===null&&O.environment!==null&&($e.envMapIntensity.value=O.environmentIntensity),$e.dfgLUT!==void 0&&($e.dfgLUT.value=ZM()),Ai){if(ue.setValue(k,"toneMappingExposure",R.toneMappingExposure),Dt.needsLights&&Ht($e,Ji),lt&&H.fog===!0&&pt.refreshFogUniforms($e,lt),pt.refreshMaterialUniforms($e,H,gt,Ct,b.state.transmissionRenderTarget[T.id]),Dt.needsLights&&Dt.numLightProbeGrids>0){const we=M;let Xe=0;for(const ci of b.state.lightProbeGridArray)ci.texture!==null&&(we.textures[Xe]=ci.texture,we.min[Xe]=ci.boundingBox.min,we.max[Xe]=ci.boundingBox.max,we.resolution[Xe]=ci.resolution,Xe++);for(const ci in we)we[ci].length=Xe;$e.probesSH.value=we.textures,$e.probesMin.value=we.min,$e.probesMax.value=we.max,$e.probesResolution.value=we.resolution}$a.upload(k,Pt(Dt),$e,zt)}if(H.isShaderMaterial&&H.uniformsNeedUpdate===!0&&($a.upload(k,Pt(Dt),$e,zt),H.uniformsNeedUpdate=!1),H.isSpriteMaterial&&ue.setValue(k,"center",V.center),ue.setValue(k,"modelViewMatrix",V.modelViewMatrix),ue.setValue(k,"normalMatrix",V.normalMatrix),ue.setValue(k,"modelMatrix",V.matrixWorld),H.uniformsGroups!==void 0){const we=H.uniformsGroups;for(let Xe=0,ci=we.length;Xe<ci;Xe++){const Fu=we[Xe];Nt.update(Fu,tn),Nt.bind(Fu,tn)}}return tn}function Ht(T,O){T.ambientLightColor.needsUpdate=O,T.lightProbe.needsUpdate=O,T.sunLights.needsUpdate=O,T.sunLightShadows.needsUpdate=O,T.directionalLights.needsUpdate=O,T.directionalLightShadows.needsUpdate=O,T.pointLights.needsUpdate=O,T.pointLightShadows.needsUpdate=O,T.spotLights.needsUpdate=O,T.spotLightShadows.needsUpdate=O,T.rectAreaLights.needsUpdate=O,T.hemisphereLights.needsUpdate=O}function Ee(T){return T.isMeshLambertMaterial||T.isMeshToonMaterial||T.isMeshPhongMaterial||T.isMeshStandardMaterial||T.isShadowMaterial||T.isShaderMaterial&&T.lights===!0}this.getActiveCubeFace=function(){return z},this.getActiveMipmapLevel=function(){return U},this.getRenderTarget=function(){return X},this.setRenderTargetTextures=function(T,O,q){const H=Ot.get(T);H.__autoAllocateDepthBuffer=T.resolveDepthBuffer===!1,H.__autoAllocateDepthBuffer===!1&&(H.__useRenderToTexture=!1),Ot.get(T.texture).__webglTexture=O,Ot.get(T.depthTexture).__webglTexture=H.__autoAllocateDepthBuffer?void 0:q,H.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(T,O){const q=Ot.get(T);q.__webglFramebuffer=O,q.__useDefaultFramebuffer=O===void 0},this.setRenderTarget=function(T,O=0,q=0){X=T,z=O,U=q;let H=null,V=!1,lt=!1;if(T){const ht=Ot.get(T);if(ht.__useDefaultFramebuffer!==void 0){dt.bindFramebuffer(k.FRAMEBUFFER,ht.__webglFramebuffer),Z.copy(T.viewport),at.copy(T.scissor),Rt=T.scissorTest,dt.viewport(Z),dt.scissor(at),dt.setScissorTest(Rt),G=-1;return}else if(ht.__webglFramebuffer===void 0)zt.setupRenderTarget(T);else if(ht.__hasExternalTextures)zt.rebindTextures(T,Ot.get(T.texture).__webglTexture,Ot.get(T.depthTexture).__webglTexture);else if(T.depthBuffer){const Bt=T.depthTexture;if(ht.__boundDepthTexture!==Bt){if(Bt!==null&&Ot.has(Bt)&&(T.width!==Bt.image.width||T.height!==Bt.image.height))throw new Error("THREE.WebGLRenderer: Attached DepthTexture is initialized to the incorrect size.");zt.setupDepthRenderbuffer(T)}}const xt=T.texture;(xt.isData3DTexture||xt.isDataArrayTexture||xt.isCompressedArrayTexture)&&(lt=!0);const At=Ot.get(T).__webglFramebuffer;T.isWebGLCubeRenderTarget?(Array.isArray(At[O])?H=At[O][q]:H=At[O],V=!0):T.samples>0&&zt.useMultisampledRTT(T)===!1?H=Ot.get(T).__webglMultisampledFramebuffer:Array.isArray(At)?H=At[q]:H=At,Z.copy(T.viewport),at.copy(T.scissor),Rt=T.scissorTest}else Z.copy(Ft).multiplyScalar(gt).floor(),at.copy(Yt).multiplyScalar(gt).floor(),Rt=ie;if(q!==0&&(H=N),dt.bindFramebuffer(k.FRAMEBUFFER,H)&&dt.drawBuffers(T,H),dt.viewport(Z),dt.scissor(at),dt.setScissorTest(Rt),V){const ht=Ot.get(T.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_CUBE_MAP_POSITIVE_X+O,ht.__webglTexture,q)}else if(lt){const ht=O;for(let xt=0;xt<T.textures.length;xt++){const At=Ot.get(T.textures[xt]);k.framebufferTextureLayer(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0+xt,At.__webglTexture,q,ht)}}else if(T!==null&&q!==0){const ht=Ot.get(T.texture);k.framebufferTexture2D(k.FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,ht.__webglTexture,q)}G=-1};function fe(T){const O=Ot.get(T);return(O.__readFormat!==T.format||O.__readType!==T.type)&&(O.__readFormat=T.format,O.__readType=T.type,O.__formatReadable=Kt.textureFormatReadable(T.format),O.__typeReadable=Kt.textureTypeReadable(T.type)),O}this.readRenderTargetPixels=function(T,O,q,H,V,lt,Tt,ht=0){if(!(T&&T.isWebGLRenderTarget)){he("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let xt=Ot.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Tt!==void 0&&(xt=xt[Tt],Array.isArray(xt)&&(xt=xt[0])),xt){dt.bindFramebuffer(k.FRAMEBUFFER,xt);try{const At=T.textures[ht],Bt=At.format,Qt=At.type;T.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+ht);const bt=fe(At);if(bt.__formatReadable===!1){he("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(bt.__typeReadable===!1){he("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}O>=0&&O<=T.width-H&&q>=0&&q<=T.height-V&&k.readPixels(O,q,H,V,nt.convert(Bt),nt.convert(Qt),lt)}finally{const At=X!==null?Ot.get(X).__webglFramebuffer:null;dt.bindFramebuffer(k.FRAMEBUFFER,At)}}},this.readRenderTargetPixelsAsync=async function(T,O,q,H,V,lt,Tt,ht=0){if(!(T&&T.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let xt=Ot.get(T).__webglFramebuffer;if(T.isWebGLCubeRenderTarget&&Tt!==void 0&&(xt=xt[Tt],Array.isArray(xt)&&(xt=xt[0])),xt)if(O>=0&&O<=T.width-H&&q>=0&&q<=T.height-V){dt.bindFramebuffer(k.FRAMEBUFFER,xt);const At=T.textures[ht],Bt=At.format,Qt=At.type;T.textures.length>1&&k.readBuffer(k.COLOR_ATTACHMENT0+ht);const bt=fe(At);if(bt.__formatReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(bt.__typeReadable===!1)throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const jt=k.createBuffer();k.bindBuffer(k.PIXEL_PACK_BUFFER,jt),k.bufferData(k.PIXEL_PACK_BUFFER,lt.byteLength,k.STREAM_READ),k.readPixels(O,q,H,V,nt.convert(Bt),nt.convert(Qt),0),k.bindBuffer(k.PIXEL_PACK_BUFFER,null);const Le=X!==null?Ot.get(X).__webglFramebuffer:null;dt.bindFramebuffer(k.FRAMEBUFFER,Le);const pe=k.fenceSync(k.SYNC_GPU_COMMANDS_COMPLETE,0);return k.flush(),await bm(k,pe,4),k.bindBuffer(k.PIXEL_PACK_BUFFER,jt),k.getBufferSubData(k.PIXEL_PACK_BUFFER,0,lt),k.bindBuffer(k.PIXEL_PACK_BUFFER,null),k.deleteBuffer(jt),k.deleteSync(pe),lt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(T,O=null,q=0){const H=Math.pow(2,-q),V=Math.floor(T.image.width*H),lt=Math.floor(T.image.height*H),Tt=O!==null?O.x:0,ht=O!==null?O.y:0;zt.setTexture2D(T,0),k.copyTexSubImage2D(k.TEXTURE_2D,q,0,0,Tt,ht,V,lt),dt.unbindTexture()},this.copyTextureToTexture=function(T,O,q=null,H=null,V=0,lt=0){let Tt,ht,xt,At,Bt,Qt,bt,jt,Le;const pe=T.isCompressedTexture?T.mipmaps[lt]:T.image;if(q!==null)Tt=q.max.x-q.min.x,ht=q.max.y-q.min.y,xt=q.isBox3?q.max.z-q.min.z:1,At=q.min.x,Bt=q.min.y,Qt=q.isBox3?q.min.z:0;else{const ue=Math.pow(2,-V);Tt=Math.floor(pe.width*ue),ht=Math.floor(pe.height*ue),T.isDataArrayTexture?xt=pe.depth:T.isData3DTexture?xt=Math.floor(pe.depth*ue):xt=1,At=0,Bt=0,Qt=0}H!==null?(bt=H.x,jt=H.y,Le=H.z):(bt=0,jt=0,Le=0);const ve=nt.convert(O.format),Fe=nt.convert(O.type);let Dt;O.isData3DTexture?(zt.setTexture3D(O,0),Dt=k.TEXTURE_3D):O.isDataArrayTexture||O.isCompressedArrayTexture?(zt.setTexture2DArray(O,0),Dt=k.TEXTURE_2D_ARRAY):(zt.setTexture2D(O,0),Dt=k.TEXTURE_2D),dt.activeTexture(k.TEXTURE0),dt.pixelStorei(k.UNPACK_FLIP_Y_WEBGL,O.flipY),dt.pixelStorei(k.UNPACK_PREMULTIPLY_ALPHA_WEBGL,O.premultiplyAlpha),dt.pixelStorei(k.UNPACK_ALIGNMENT,O.unpackAlignment);const Ke=dt.getParameter(k.UNPACK_ROW_LENGTH),me=dt.getParameter(k.UNPACK_IMAGE_HEIGHT),$i=dt.getParameter(k.UNPACK_SKIP_PIXELS),tn=dt.getParameter(k.UNPACK_SKIP_ROWS),la=dt.getParameter(k.UNPACK_SKIP_IMAGES);dt.pixelStorei(k.UNPACK_ROW_LENGTH,pe.width),dt.pixelStorei(k.UNPACK_IMAGE_HEIGHT,pe.height),dt.pixelStorei(k.UNPACK_SKIP_PIXELS,At),dt.pixelStorei(k.UNPACK_SKIP_ROWS,Bt),dt.pixelStorei(k.UNPACK_SKIP_IMAGES,Qt);const Ai=T.isDataArrayTexture||T.isData3DTexture,Ji=O.isDataArrayTexture||O.isData3DTexture;if(T.isDepthTexture){const ue=Ot.get(T),$e=Ot.get(O),Bn=Ot.get(ue.__renderTarget),we=Ot.get($e.__renderTarget);dt.bindFramebuffer(k.READ_FRAMEBUFFER,Bn.__webglFramebuffer),dt.bindFramebuffer(k.DRAW_FRAMEBUFFER,we.__webglFramebuffer);for(let Xe=0;Xe<xt;Xe++)Ai&&(k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Ot.get(T).__webglTexture,V,Qt+Xe),k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,Ot.get(O).__webglTexture,lt,Le+Xe)),k.blitFramebuffer(At,Bt,At+Tt,Bt+ht,bt,jt,bt+Tt,jt+ht,k.DEPTH_BUFFER_BIT,k.NEAREST);dt.bindFramebuffer(k.READ_FRAMEBUFFER,null),dt.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else if(V!==0||T.isRenderTargetTexture||Ot.has(T)){const ue=Ot.get(T),$e=Ot.get(O);dt.bindFramebuffer(k.READ_FRAMEBUFFER,D),dt.bindFramebuffer(k.DRAW_FRAMEBUFFER,B);for(let Bn=0;Bn<xt;Bn++)Ai?k.framebufferTextureLayer(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,ue.__webglTexture,V,Qt+Bn):k.framebufferTexture2D(k.READ_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,ue.__webglTexture,V),Ji?k.framebufferTextureLayer(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,$e.__webglTexture,lt,Le+Bn):k.framebufferTexture2D(k.DRAW_FRAMEBUFFER,k.COLOR_ATTACHMENT0,k.TEXTURE_2D,$e.__webglTexture,lt),V!==0?k.blitFramebuffer(At,Bt,At+Tt,Bt+ht,bt,jt,bt+Tt,jt+ht,k.COLOR_BUFFER_BIT,k.NEAREST):Ji?k.copyTexSubImage3D(Dt,lt,bt,jt,Le+Bn,At,Bt,Tt,ht):k.copyTexSubImage2D(Dt,lt,bt,jt,At,Bt,Tt,ht);dt.bindFramebuffer(k.READ_FRAMEBUFFER,null),dt.bindFramebuffer(k.DRAW_FRAMEBUFFER,null)}else Ji?T.isDataTexture||T.isData3DTexture?k.texSubImage3D(Dt,lt,bt,jt,Le,Tt,ht,xt,ve,Fe,pe.data):O.isCompressedArrayTexture?k.compressedTexSubImage3D(Dt,lt,bt,jt,Le,Tt,ht,xt,ve,pe.data):k.texSubImage3D(Dt,lt,bt,jt,Le,Tt,ht,xt,ve,Fe,pe):T.isDataTexture?k.texSubImage2D(k.TEXTURE_2D,lt,bt,jt,Tt,ht,ve,Fe,pe.data):T.isCompressedTexture?k.compressedTexSubImage2D(k.TEXTURE_2D,lt,bt,jt,pe.width,pe.height,ve,pe.data):k.texSubImage2D(k.TEXTURE_2D,lt,bt,jt,Tt,ht,ve,Fe,pe);dt.pixelStorei(k.UNPACK_ROW_LENGTH,Ke),dt.pixelStorei(k.UNPACK_IMAGE_HEIGHT,me),dt.pixelStorei(k.UNPACK_SKIP_PIXELS,$i),dt.pixelStorei(k.UNPACK_SKIP_ROWS,tn),dt.pixelStorei(k.UNPACK_SKIP_IMAGES,la),lt===0&&O.generateMipmaps===!0&&O.mipmapsAutoUpdate===!0&&k.generateMipmap(Dt),dt.unbindTexture()},this.initRenderTarget=function(T){Ot.get(T).__webglFramebuffer===void 0&&zt.setupRenderTarget(T)},this.initTexture=function(T){T.isCubeTexture?zt.setTextureCube(T,0):T.isData3DTexture?zt.setTexture3D(T,0):T.isDataArrayTexture||T.isCompressedArrayTexture?zt.setTexture2DArray(T,0):zt.setTexture2D(T,0),dt.unbindTexture()},this.resetState=function(){z=0,U=0,X=null,dt.reset(),ut.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Xn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=re._getDrawingBufferColorSpace(t),e.unpackColorSpace=re._getUnpackColorSpace()}}const tf={type:"change"},du={type:"start"},Ld={type:"end"},Ga=new Ao,ef=new _i,$M=Math.cos(70*gc.DEG2RAD),Ge=new I,cn=2*Math.PI,_e={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Ml=1e-6;class JM extends eg{constructor(t,e=null){super(t,e),this.state=_e.NONE,this.target=new I,this.cursor=new I,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Fs.ROTATE,MIDDLE:Fs.DOLLY,RIGHT:Fs.PAN},this.touches={ONE:Ns.ROTATE,TWO:Ns.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._cursorStyle="auto",this._domElementKeyEvents=null,this._lastPosition=new I,this._lastQuaternion=new qn,this._lastTargetPosition=new I,this._quat=new qn().setFromUnitVectors(t.up,new I(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new yc,this._sphericalDelta=new yc,this._scale=1,this._panOffset=new I,this._rotateStart=new rt,this._rotateEnd=new rt,this._rotateDelta=new rt,this._panStart=new rt,this._panEnd=new rt,this._panDelta=new rt,this._dollyStart=new rt,this._dollyEnd=new rt,this._dollyDelta=new rt,this._dollyDirection=new I,this._mouse=new rt,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=jM.bind(this),this._onPointerDown=QM.bind(this),this._onPointerUp=tS.bind(this),this._onContextMenu=oS.bind(this),this._onMouseWheel=iS.bind(this),this._onKeyDown=sS.bind(this),this._onTouchStart=rS.bind(this),this._onTouchMove=aS.bind(this),this._onMouseDown=eS.bind(this),this._onMouseMove=nS.bind(this),this._interceptControlDown=lS.bind(this),this._interceptControlUp=cS.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}set cursorStyle(t){this._cursorStyle=t,t==="grab"?this.domElement.style.cursor="grab":this.domElement.style.cursor="auto"}get cursorStyle(){return this._cursorStyle}connect(t){super.connect(t),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.ownerDocument.addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.state=_e.NONE,this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.ownerDocument.removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{capture:!0}),this._controlActive=!1,this._pointers.length=0,this._pointerPositions={},this.domElement.style.touchAction="",this.domElement.style.cursor="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(tf),this.update(),this.state=_e.NONE}pan(t,e){this._pan(t,e),this.update()}dollyIn(t){this._dollyIn(t),this.update()}dollyOut(t){this._dollyOut(t),this.update()}rotateLeft(t){this._rotateLeft(t),this.update()}rotateUp(t){this._rotateUp(t),this.update()}update(t=null){const e=this.object.position;Ge.copy(e).sub(this.target),Ge.applyQuaternion(this._quat),this._spherical.setFromVector3(Ge),this.autoRotate&&this.state===_e.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,i=this.maxAzimuthAngle;isFinite(n)&&isFinite(i)&&(n<-Math.PI?n+=cn:n>Math.PI&&(n-=cn),i<-Math.PI?i+=cn:i>Math.PI&&(i-=cn),n<=i?this._spherical.theta=Math.max(n,Math.min(i,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+i)/2?Math.max(n,this._spherical.theta):Math.min(i,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=a!=this._spherical.radius}if(Ge.setFromSpherical(this._spherical),Ge.applyQuaternion(this._quatInverse),e.copy(this.target).add(Ge),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const o=Ge.length();a=this._clampDistance(o*this._scale);const l=o-a;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new I(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new I(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),a=Ge.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(Ga.origin.copy(this.object.position),Ga.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ga.direction))<$M?this.object.lookAt(this.target):(ef.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ga.intersectPlane(ef,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Ml||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Ml||this._lastTargetPosition.distanceToSquared(this.target)>Ml?(this.dispatchEvent(tf),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?cn/60*this.autoRotateSpeed*t:cn/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){Ge.setFromMatrixColumn(e,0),Ge.multiplyScalar(-t),this._panOffset.add(Ge)}_panUp(t,e){this.screenSpacePanning===!0?Ge.setFromMatrixColumn(e,1):(Ge.setFromMatrixColumn(e,0),Ge.crossVectors(this.object.up,Ge)),Ge.multiplyScalar(t),this._panOffset.add(Ge)}_pan(t,e){const n=this.domElement;if(this.object.isPerspectiveCamera){const i=this.object.position;Ge.copy(i).sub(this.target);let r=Ge.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*r/n.clientHeight,this.object.matrix),this._panUp(2*e*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),i=t-n.left,r=e-n.top,a=n.width,o=n.height;this._mouse.x=i/a*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientY),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(cn*this._rotateDelta.x/e.clientHeight),this._rotateUp(cn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.zoomToCursor&&(this._performCursorZoom=!0,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(cn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateUp(-cn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(cn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this.enableRotate&&this._rotateLeft(-cn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._rotateStart.set(n,i)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._panStart.set(n,i)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,i=t.pageY-e.y,r=Math.sqrt(n*n+i*i);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const n=this._getSecondPointerPosition(t),i=.5*(t.pageX+n.x),r=.5*(t.pageY+n.y);this._rotateEnd.set(i,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(cn*this._rotateDelta.x/e.clientHeight),this._rotateUp(cn*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),n=.5*(t.pageX+e.x),i=.5*(t.pageY+e.y);this._panEnd.set(n,i)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),n=t.pageX-e.x,i=t.pageY-e.y,r=Math.sqrt(n*n+i*i);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(t.pageX+e.x)*.5,o=(t.pageY+e.y)*.5;this._updateZoomParameters(a,o)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new rt,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,n={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function QM(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.ownerDocument.addEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s),this._cursorStyle==="grab"&&(this.domElement.style.cursor="grabbing")))}function jM(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function tS(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.ownerDocument.removeEventListener("pointermove",this._onPointerMove),this.domElement.ownerDocument.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(Ld),this.state=_e.NONE,this._cursorStyle==="grab"&&(this.domElement.style.cursor="grab");break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function eS(s){let t;switch(s.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case Fs.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=_e.DOLLY;break;case Fs.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=_e.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=_e.ROTATE}break;case Fs.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=_e.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=_e.PAN}break;default:this.state=_e.NONE}this.state!==_e.NONE&&this.dispatchEvent(du)}function nS(s){switch(this.state){case _e.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case _e.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case _e.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function iS(s){this.enabled===!1||this.enableZoom===!1||this.state!==_e.NONE||(s.preventDefault(),this.dispatchEvent(du),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(Ld))}function sS(s){this.enabled!==!1&&this._handleKeyDown(s)}function rS(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case Ns.ROTATE:if(this.enableRotate===!1){this.state=_e.NONE;break}this._handleTouchStartRotate(s),this.state=_e.TOUCH_ROTATE;break;case Ns.PAN:if(this.enablePan===!1){this.state=_e.NONE;break}this._handleTouchStartPan(s),this.state=_e.TOUCH_PAN;break;default:this.state=_e.NONE}break;case 2:switch(this.touches.TWO){case Ns.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=_e.TOUCH_DOLLY_PAN;break;case Ns.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=_e.TOUCH_DOLLY_ROTATE;break;default:this.state=_e.NONE}break;default:this.state=_e.NONE}this.state!==_e.NONE&&this.dispatchEvent(du)}function aS(s){switch(this._trackPointer(s),this.state){case _e.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case _e.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case _e.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case _e.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=_e.NONE}}function oS(s){this.enabled!==!1&&s.preventDefault()}function lS(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.ownerDocument.addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function cS(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.ownerDocument.removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class uS extends He{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new rt(.5,.5),this.rotation2D=0,this.addEventListener("removed",function(){this.traverse(function(e){e.element&&e.element instanceof e.element.ownerDocument.defaultView.Element&&e.element.parentNode!==null&&e.element.remove()})})}copy(t,e){return super.copy(t,e),this.element=t.element.cloneNode(!0),this.center=t.center,this.rotation2D=t.rotation2D,this}}const Ps=new I,nf=new ae,sf=new ae,rf=new I,af=new I;class hS{constructor(t={}){const e=this;let n,i,r,a;const o={objects:new WeakMap},l=t.element!==void 0?t.element:document.createElement("div");l.style.overflow="hidden",this.domElement=l,this.sortObjects=!0,this.getSize=function(){return{width:n,height:i}},this.render=function(g,m){g.matrixWorldAutoUpdate===!0&&g.updateMatrixWorld(),m.parent===null&&m.matrixWorldAutoUpdate===!0&&m.updateMatrixWorld(),nf.copy(m.matrixWorldInverse),sf.multiplyMatrices(m.projectionMatrix,nf),u(g,g,m),this.sortObjects&&d(g)},this.setSize=function(g,m){n=g,i=m,r=n/2,a=i/2,l.style.width=g+"px",l.style.height=m+"px"};function c(g){g.isCSS2DObject&&(g.element.style.display="none");for(let m=0,f=g.children.length;m<f;m++)c(g.children[m])}function u(g,m,f){if(g.visible===!1){c(g);return}if(g.isCSS2DObject){Ps.setFromMatrixPosition(g.matrixWorld),Ps.applyMatrix4(sf);const _=Ps.z>=-1&&Ps.z<=1&&g.layers.test(f.layers)===!0,v=g.element;if(v.style.display=_===!0?"":"none",_===!0){g.onBeforeRender(e,m,f);const M=100*g.center.x,E=100*g.center.y;v.style.transformOrigin=`${M}% ${E}%`;const b=-g.rotation2D,x=Ps.x*r+r,y=-Ps.y*a+a;v.style.transform=`translate(${-M}%, ${-E}%) translate(${x}px, ${y}px) rotate(${b}rad)`,v.parentNode!==l&&l.appendChild(v),g.onAfterRender(e,m,f)}const S={distanceToCameraSquared:p(f,g)};o.objects.set(g,S)}for(let _=0,v=g.children.length;_<v;_++)u(g.children[_],m,f)}function p(g,m){return rf.setFromMatrixPosition(g.matrixWorld),af.setFromMatrixPosition(m.matrixWorld),rf.distanceToSquared(af)}function h(g){const m=[];return g.traverseVisible(function(f){f.isCSS2DObject&&m.push(f)}),m}function d(g){const m=h(g).sort(function(_,v){if(_.renderOrder!==v.renderOrder)return v.renderOrder-_.renderOrder;const S=o.objects.get(_).distanceToCameraSquared,M=o.objects.get(v).distanceToCameraSquared;return S-M}),f=m.length;for(let _=0,v=m.length;_<v;_++)m[_].element.style.zIndex=f-_}}}const Ja={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class rr{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const fS=new Po(-1,1,1,-1,0,1);class dS extends Ye{constructor(){super(),this.setAttribute("position",new Se([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Se([0,2,0,0,2,0],2))}}const pS=new dS;class pu{constructor(t){this._mesh=new Cn(pS,t)}dispose(){this._mesh.geometry.dispose()}render(t){t.render(this._mesh,fS)}get material(){return this._mesh.material}set material(t){this._mesh.material=t}}class mS extends rr{constructor(t,e="tDiffuse"){super(),this.textureID=e,this.uniforms=null,this.material=null,t instanceof hn?(this.uniforms=t.uniforms,this.material=t):t&&(this.uniforms=Vr.clone(t.uniforms),this.material=new hn({name:t.name!==void 0?t.name:"unspecified",defines:Object.assign({},t.defines),uniforms:this.uniforms,vertexShader:t.vertexShader,fragmentShader:t.fragmentShader})),this._fsQuad=new pu(this.material)}render(t,e,n){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=n.texture),this._fsQuad.material=this.material,this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class of extends rr{constructor(t,e){super(),this.scene=t,this.camera=e,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(t,e,n){const i=t.getContext(),r=t.state;r.buffers.color.setMask(!1),r.buffers.depth.setMask(!1),r.buffers.color.setLocked(!0),r.buffers.depth.setLocked(!0);let a,o;this.inverse?(a=0,o=1):(a=1,o=0),r.buffers.stencil.setTest(!0),r.buffers.stencil.setOp(i.REPLACE,i.REPLACE,i.REPLACE),r.buffers.stencil.setFunc(i.ALWAYS,a,4294967295),r.buffers.stencil.setClear(o),r.buffers.stencil.setLocked(!0),t.setRenderTarget(n),this.clear&&t.clear(),t.render(this.scene,this.camera),t.setRenderTarget(e),this.clear&&t.clear(),t.render(this.scene,this.camera),r.buffers.color.setLocked(!1),r.buffers.depth.setLocked(!1),r.buffers.color.setMask(!0),r.buffers.depth.setMask(!0),r.buffers.stencil.setLocked(!1),r.buffers.stencil.setFunc(i.EQUAL,1,4294967295),r.buffers.stencil.setOp(i.KEEP,i.KEEP,i.KEEP),r.buffers.stencil.setLocked(!0)}}class _S extends rr{constructor(){super(),this.needsSwap=!1}render(t){t.state.buffers.stencil.setLocked(!1),t.state.buffers.stencil.setTest(!1)}}class gS{constructor(t,e){if(this.renderer=t,this._pixelRatio=t.getPixelRatio(),e===void 0){const n=t.getSize(new rt);this._width=n.width,this._height=n.height,e=new pn(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:dn}),e.texture.name="EffectComposer.rt1"}else this._width=e.width,this._height=e.height;this.renderTarget1=e,this.renderTarget2=e.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new mS(Ja),this.copyPass.material.blending=os,this.timer=new Q_}swapBuffers(){const t=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=t}addPass(t){this.passes.push(t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(t,e){this.passes.splice(e,0,t),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(t){const e=this.passes.indexOf(t);e!==-1&&this.passes.splice(e,1)}isLastEnabledPass(t){for(let e=t+1;e<this.passes.length;e++)if(this.passes[e].enabled)return!1;return!0}render(t){this.timer.update(),t===void 0&&(t=this.timer.getDelta());const e=this.renderer.getRenderTarget();let n=!1;for(let i=0,r=this.passes.length;i<r;i++){const a=this.passes[i];if(a.enabled!==!1){if(a.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(i),a.render(this.renderer,this.writeBuffer,this.readBuffer,t,n),a.needsSwap){if(n){const o=this.renderer.getContext(),l=this.renderer.state.buffers.stencil;l.setFunc(o.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,t),l.setFunc(o.EQUAL,1,4294967295)}this.swapBuffers()}of!==void 0&&(a instanceof of?n=!0:a instanceof _S&&(n=!1))}}this.renderer.setRenderTarget(e)}reset(t){if(t===void 0){const e=this.renderer.getSize(new rt);this._pixelRatio=this.renderer.getPixelRatio(),this._width=e.width,this._height=e.height,t=this.renderTarget1.clone(),t.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=t,this.renderTarget2=t.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(t,e){this._width=t,this._height=e;const n=this._width*this._pixelRatio,i=this._height*this._pixelRatio;this.renderTarget1.setSize(n,i),this.renderTarget2.setSize(n,i);for(let r=0;r<this.passes.length;r++)this.passes[r].setSize(n,i)}setPixelRatio(t){this._pixelRatio=t,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}const Ha={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class xS extends rr{constructor(){super(),this.isOutputPass=!0,this.uniforms=Vr.clone(Ha.uniforms),this.material=new xd({name:Ha.name,uniforms:this.uniforms,vertexShader:Ha.vertexShader,fragmentShader:Ha.fragmentShader}),this._fsQuad=new pu(this.material),this._outputColorSpace=null,this._toneMapping=null}render(t,e,n){this.uniforms.tDiffuse.value=n.texture,this.uniforms.toneMappingExposure.value=t.toneMappingExposure,(this._outputColorSpace!==t.outputColorSpace||this._toneMapping!==t.toneMapping)&&(this._outputColorSpace=t.outputColorSpace,this._toneMapping=t.toneMapping,this.material.defines={},re.getTransfer(this._outputColorSpace)===ge&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===zc?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===kc?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===Gc?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===wo?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Vc?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Wc?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===Hc&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(e),this.clear&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),this._fsQuad.render(t))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class vS extends rr{constructor(t,e,n=null,i=null,r=null){super(),this.scene=t,this.camera=e,this.overrideMaterial=n,this.clearColor=i,this.clearAlpha=r,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new Xt}render(t,e,n){const i=t.autoClear;t.autoClear=!1;let r,a;this.overrideMaterial!==null&&(a=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(t.getClearColor(this._oldClearColor),t.setClearColor(this.clearColor,t.getClearAlpha())),this.clearAlpha!==null&&(r=t.getClearAlpha(),t.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&t.clearDepth(),t.setRenderTarget(this.renderToScreen?null:n),this.clear===!0&&t.clear(t.autoClearColor,t.autoClearDepth,t.autoClearStencil),t.render(this.scene,this.camera),this.clearColor!==null&&t.setClearColor(this._oldClearColor),this.clearAlpha!==null&&t.setClearAlpha(r),this.overrideMaterial!==null&&(this.scene.overrideMaterial=a),t.autoClear=i}}const MS={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new Xt(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class Ks extends rr{constructor(t,e=1,n,i){super(),this.strength=e,this.radius=n,this.threshold=i,this.resolution=t!==void 0?new rt(t.x,t.y):new rt(256,256),this.clearColor=new Xt(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);this.renderTargetBright=new pn(r,a,{type:dn,depthBuffer:!1}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let u=0;u<this.nMips;u++){const p=new pn(r,a,{type:dn,depthBuffer:!1});p.texture.name="UnrealBloomPass.h"+u,p.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(p);const h=new pn(r,a,{type:dn,depthBuffer:!1});h.texture.name="UnrealBloomPass.v"+u,h.texture.generateMipmaps=!1,this.renderTargetsVertical.push(h),r=Math.round(r/2),a=Math.round(a/2)}const o=MS;this.highPassUniforms=Vr.clone(o.uniforms),this.highPassUniforms.luminosityThreshold.value=i,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new hn({uniforms:this.highPassUniforms,vertexShader:o.vertexShader,fragmentShader:o.fragmentShader}),this.separableBlurMaterials=[];const l=[6,10,14,18,22];r=Math.round(this.resolution.x/2),a=Math.round(this.resolution.y/2);for(let u=0;u<this.nMips;u++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(l[u])),this.separableBlurMaterials[u].uniforms.invSize.value=new rt(1/r,1/a),r=Math.round(r/2),a=Math.round(a/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=e,this.compositeMaterial.uniforms.bloomRadius.value=.1;const c=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=c,this.bloomTintColors=[new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1),new I(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Vr.clone(Ja.uniforms),this.blendMaterial=new hn({uniforms:this.copyUniforms,vertexShader:Ja.vertexShader,fragmentShader:Ja.fragmentShader,premultipliedAlpha:!0,blending:Pl,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new Xt,this._oldClearAlpha=1,this._basic=new Xs,this._fsQuad=new pu(null)}dispose(){for(let t=0;t<this.renderTargetsHorizontal.length;t++)this.renderTargetsHorizontal[t].dispose();for(let t=0;t<this.renderTargetsVertical.length;t++)this.renderTargetsVertical[t].dispose();this.renderTargetBright.dispose();for(let t=0;t<this.separableBlurMaterials.length;t++)this.separableBlurMaterials[t].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(t,e){let n=Math.round(t/2),i=Math.round(e/2);this.renderTargetBright.setSize(n,i);for(let r=0;r<this.nMips;r++)this.renderTargetsHorizontal[r].setSize(n,i),this.renderTargetsVertical[r].setSize(n,i),this.separableBlurMaterials[r].uniforms.invSize.value=new rt(1/n,1/i),n=Math.round(n/2),i=Math.round(i/2)}render(t,e,n,i,r){t.getClearColor(this._oldClearColor),this._oldClearAlpha=t.getClearAlpha();const a=t.autoClear;t.autoClear=!1,t.setClearColor(this.clearColor,0),r&&t.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=n.texture,t.setRenderTarget(null),t.clear(),this._fsQuad.render(t)),this.highPassUniforms.tDiffuse.value=n.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,t.setRenderTarget(this.renderTargetBright),t.clear(),this._fsQuad.render(t);let o=this.renderTargetBright;for(let l=0;l<this.nMips;l++)this._fsQuad.material=this.separableBlurMaterials[l],this.separableBlurMaterials[l].uniforms.colorTexture.value=o.texture,this.separableBlurMaterials[l].uniforms.direction.value=Ks.BlurDirectionX,t.setRenderTarget(this.renderTargetsHorizontal[l]),t.clear(),this._fsQuad.render(t),this.separableBlurMaterials[l].uniforms.colorTexture.value=this.renderTargetsHorizontal[l].texture,this.separableBlurMaterials[l].uniforms.direction.value=Ks.BlurDirectionY,t.setRenderTarget(this.renderTargetsVertical[l]),t.clear(),this._fsQuad.render(t),o=this.renderTargetsVertical[l];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,t.setRenderTarget(this.renderTargetsHorizontal[0]),t.clear(),this._fsQuad.render(t),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,r&&t.state.buffers.stencil.setTest(!0),this.renderToScreen?(t.setRenderTarget(null),this._fsQuad.render(t)):(t.setRenderTarget(n),this._fsQuad.render(t)),t.setClearColor(this._oldClearColor,this._oldClearAlpha),t.autoClear=a}_getSeparableBlurMaterial(t){const e=[],n=t/3;for(let a=0;a<t;a++)e.push(.39894*Math.exp(-.5*a*a/(n*n))/n);const i=[],r=[];for(let a=1;a<t;a+=2){const o=e[a],l=a+1<t?e[a+1]:0,c=o+l;i.push((a*o+(a+1)*l)/c),r.push(c)}return new hn({defines:{KERNEL_PAIRS:i.length},uniforms:{colorTexture:{value:null},invSize:{value:new rt(.5,.5)},direction:{value:new rt(.5,.5)},centerWeight:{value:e[0]},gaussianOffsets:{value:i},gaussianWeights:{value:r}},vertexShader:`

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

				}`})}}Ks.BlurDirectionX=new rt(1,0);Ks.BlurDirectionY=new rt(0,1);function mi(s){if(s===void 0)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return s}function Nd(s,t){s.prototype=Object.create(t.prototype),s.prototype.constructor=s,s.__proto__=t}/*!
 * GSAP 3.15.1
 * https://gsap.com
 *
 * @license Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var Rn={autoSleep:120,force3D:"auto",nullTargetWarn:1,units:{lineHeight:""}},Wr={duration:.5,overwrite:!1,delay:0},mu,je,Te,On=1e8,Me=1/On,Ec=Math.PI*2,SS=Ec/4,yS=0,Id=Math.sqrt,bS=Math.cos,ES=Math.sin,Ze=function(t){return typeof t=="string"},Ie=function(t){return typeof t=="function"},bi=function(t){return typeof t=="number"},_u=function(t){return typeof t>"u"},ri=function(t){return typeof t=="object"},mn=function(t){return t!==!1},gu=function(){return typeof window<"u"},Va=function(t){return Ie(t)||Ze(t)},Ud=typeof ArrayBuffer=="function"&&ArrayBuffer.isView||function(){},rn=Array.isArray,TS=/random\([^)]+\)/g,wS=/,\s*/g,lf=/(?:-?\.?\d|\.)+/gi,Od=/[-+=.]*\d+[.e\-+]*\d*[e\-+]*\d*/g,Us=/[-+=.]*\d+[.e-]*\d*[a-z%]*/g,Sl=/[-+=.]*\d+\.?\d*(?:e-|e\+)?\d*/gi,Fd=/[+-]=-?[.\d]+/,AS=/[^,'"\[\]\s]+/gi,RS=/^[+\-=e\s\d]*\d+[.\d]*([a-z]*|%)\s*$/i,Re,Qn,Tc,xu,Pn={},fo={},Bd,zd=function(t){return(fo=$s(t,Pn))&&vn},vu=function(t,e){return console.warn("Invalid property",t,"set to",e,"Missing plugin? gsap.registerPlugin()")},Xr=function(t,e){return!e&&console.warn(t)},kd=function(t,e){return t&&(Pn[t]=e)&&fo&&(fo[t]=e)||Pn},qr=function(){return 0},CS={suppressEvents:!0,isStart:!0,kill:!1},Qa={suppressEvents:!0,kill:!1},PS={suppressEvents:!0},Mu={},Hi=[],wc={},Gd,bn={},yl={},cf=30,ja=[],Su="",yu=function(t){var e=t[0],n,i;if(ri(e)||Ie(e)||(t=[t]),!(n=(e._gsap||{}).harness)){for(i=ja.length;i--&&!ja[i].targetTest(e););n=ja[i]}for(i=t.length;i--;)t[i]&&(t[i]._gsap||(t[i]._gsap=new cp(t[i],n)))||t.splice(i,1);return t},ls=function(t){return t._gsap||yu(Fn(t))[0]._gsap},Hd=function(t,e,n){return(n=t[e])&&Ie(n)?t[e]():_u(n)&&t.getAttribute&&t.getAttribute(e)||n},_n=function(t,e){return(t=t.split(",")).forEach(e)||t},Ue=function(t){return Math.round(t*1e5)/1e5||0},Ae=function(t){return Math.round(t*1e7)/1e7||0},ks=function(t,e){var n=e.charAt(0),i=parseFloat(e.substr(2));return t=parseFloat(t),n==="+"?t+i:n==="-"?t-i:n==="*"?t*i:t/i},DS=function(t,e){for(var n=e.length,i=0;t.indexOf(e[i])<0&&++i<n;);return i<n},po=function(){var t=Hi.length,e=Hi.slice(0),n,i;for(wc={},Hi.length=0,n=0;n<t;n++)i=e[n],i&&i._lazy&&(i.render(i._lazy[0],i._lazy[1],!0)._lazy=0)},bu=function(t){return!!(t._initted||t._startAt||t.add)},Vd=function(t,e,n,i){Hi.length&&!je&&po(),t.render(e,n,!!(je&&e<0&&bu(t))),Hi.length&&!je&&po()},Wd=function(t){var e=parseFloat(t);return(e||e===0)&&(t+"").match(AS).length<2?e:Ze(t)?t.trim():t},Xd=function(t){return t},Dn=function(t,e){for(var n in e)n in t||(t[n]=e[n]);return t},LS=function(t){return function(e,n){for(var i in n)i in e||i==="duration"&&t||i==="ease"||(e[i]=n[i])}},$s=function(t,e){for(var n in e)t[n]=e[n];return t},uf=function s(t,e){for(var n in e)n!=="__proto__"&&n!=="constructor"&&n!=="prototype"&&(t[n]=ri(e[n])?s(t[n]||(t[n]={}),e[n]):e[n]);return t},mo=function(t,e){var n={},i;for(i in t)i in e||(n[i]=t[i]);return n},Pr=function(t){var e=t.parent||Re,n=t.keyframes?LS(rn(t.keyframes)):Dn;if(mn(t.inherit))for(;e;)n(t,e.vars.defaults),e=e.parent||e._dp;return t},NS=function(t,e){for(var n=t.length,i=n===e.length;i&&n--&&t[n]===e[n];);return n<0},qd=function(t,e,n,i,r){var a=t[i],o;if(r)for(o=e[r];a&&a[r]>o;)a=a._prev;return a?(e._next=a._next,a._next=e):(e._next=t[n],t[n]=e),e._next?e._next._prev=e:t[i]=e,e._prev=a,e.parent=e._dp=t,e},No=function(t,e,n,i){n===void 0&&(n="_first"),i===void 0&&(i="_last");var r=e._prev,a=e._next;r?r._next=a:t[n]===e&&(t[n]=a),a?a._prev=r:t[i]===e&&(t[i]=r),e._next=e._prev=e.parent=null},Xi=function(t,e){t.parent&&(!e||t.parent.autoRemoveChildren)&&t.parent.remove&&t.parent.remove(t),t._act=0},cs=function(t,e){if(t&&(!e||e._end>t._dur||e._start<0))for(var n=t;n;)n._dirty=1,n=n.parent;return t},IS=function(t){for(var e=t.parent;e&&e.parent;)e._dirty=1,e.totalDuration(),e=e.parent;return t},Ac=function(t,e,n,i){return t._startAt&&(je?t._startAt.revert(Qa):t.vars.immediateRender&&!t.vars.autoRevert||t._startAt.render(e,!0,i))},US=function s(t){return!t||t._ts&&s(t.parent)},hf=function(t){return t._repeat?Js(t._tTime,t=t.duration()+t._rDelay)*t:0},Js=function(t,e){var n=Math.floor(t=Ae(t/e));return t&&n===t?n-1:n},_o=function(t,e){return(t-e._start)*e._ts+(e._ts>=0?0:e._dirty?e.totalDuration():e._tDur)},Io=function(t){return t._end=Ae(t._start+(t._tDur/Math.abs(t._ts||t._rts||Me)||0))},Uo=function(t,e){var n=t._dp;return n&&n.smoothChildTiming&&t._ts&&(t._start=Ae(n._time-(t._ts>0?e/t._ts:((t._dirty?t.totalDuration():t._tDur)-e)/-t._ts)),Io(t),n._dirty||cs(n,t)),t},Yd=function(t,e){var n;if((e._time||!e._dur&&e._initted||e._start<t._time&&(e._dur||!e.add))&&(n=_o(t.rawTime(),e),(!e._dur||ea(0,e.totalDuration(),n)-e._tTime>Me)&&e.render(n,!0)),cs(t,e)._dp&&t._initted&&t._time>=t._dur&&t._ts){if(t._dur<t.duration())for(n=t;n._dp;)n.rawTime()>=0&&n.totalTime(n._tTime),n=n._dp;t._zTime=-Me}},ei=function(t,e,n,i){return e.parent&&Xi(e),e._start=Ae((bi(n)?n:!n&&go(e)&&(!t._last||t._last._start>=t._time)?t._last?t._last._start:t._time:n||t!==Re?In(t,n,e):t._time)+e._delay),e._end=Ae(e._start+(e.totalDuration()/Math.abs(e.timeScale())||0)),qd(t,e,"_first","_last",t._sort?"_start":0),go(e)||(t._recent=e),i||Yd(t,e),t._ts<0&&Uo(t,t._tTime),t},Zd=function(t,e){return(Pn.ScrollTrigger||vu("scrollTrigger",e))&&Pn.ScrollTrigger.create(e,t)},Kd=function(t,e,n,i,r){if(Tu(t,e,r),!t._initted)return 1;if(!n&&t._pt&&!je&&(t._dur&&t.vars.lazy!==!1||!t._dur&&t.vars.lazy)&&Gd!==Tn.frame)return Hi.push(t),t._lazy=[r,i],1},OS=function s(t){var e=t.parent;return e&&e._ts&&e._initted&&!e._lock&&(e.rawTime()<0||s(e))},go=function(t){var e=t.data;return e==="isFromStart"||e==="isStart"},FS=function(t,e,n,i){var r=t.ratio,a=e<0||!e&&(!t._start&&OS(t)&&!(!t._initted&&go(t))||(t._ts<0||t._dp._ts<0)&&!go(t))?0:1,o=t._rDelay,l=0,c,u,p;if(o&&t._repeat&&(l=ea(0,t._tDur,e),u=Js(l,o),t._yoyo&&u&1&&(a=1-a),u!==Js(t._tTime,o)&&(r=1-a,t.vars.repeatRefresh&&t._initted&&t.invalidate())),a!==r||je||i||t._zTime===Me||!e&&t._zTime){if(!t._initted&&Kd(t,e,i,n,l))return;for(p=t._zTime,t._zTime=e||(n?Me:0),n||(n=e&&!p),t.ratio=a,t._from&&(a=1-a),t._time=0,t._tTime=l,c=t._pt;c;)c.r(a,c.d),c=c._next;e<0&&Ac(t,e,n,!0),t._onUpdate&&!n&&wn(t,"onUpdate"),l&&t._repeat&&!n&&t.parent&&wn(t,"onRepeat"),(e>=t._tDur||e<0)&&t.ratio===a&&(a&&Xi(t,1),!n&&!je&&(wn(t,a?"onComplete":"onReverseComplete",!0),t._prom&&t._prom()))}else t._zTime||(t._zTime=e)},BS=function(t,e,n){var i;if(n>e)for(i=t._first;i&&i._start<=n;){if(i.data==="isPause"&&i._start>e)return i;i=i._next}else for(i=t._last;i&&i._start>=n;){if(i.data==="isPause"&&i._start<e)return i;i=i._prev}},Qs=function(t,e,n,i){var r=t._repeat,a=Ae(e)||0,o=t._tTime/t._tDur;return o&&!i&&(t._time*=a/t._dur),t._dur=a,t._tDur=r?r<0?1e10:Ae(a*(r+1)+t._rDelay*r):a,o>0&&!i&&Uo(t,t._tTime=t._tDur*o),t.parent&&Io(t),n||cs(t.parent,t),t},ff=function(t){return t instanceof un?cs(t):Qs(t,t._dur)},zS={_start:0,endTime:qr,totalDuration:qr},In=function s(t,e,n){var i=t.labels,r=t._recent||zS,a=t.duration()>=On?r.endTime(!1):t._dur,o,l,c;return Ze(e)&&(isNaN(e)||e in i)?(l=e.charAt(0),c=e.substr(-1)==="%",o=e.indexOf("="),l==="<"||l===">"?(o>=0&&(e=e.replace(/=/,"")),(l==="<"?r._start:r.endTime(r._repeat>=0))+(parseFloat(e.substr(1))||0)*(c?(o<0?r:n).totalDuration()/100:1)):o<0?(e in i||(i[e]=a),i[e]):(l=parseFloat(e.charAt(o-1)+e.substr(o+1)),c&&n&&(l=l/100*(rn(n)?n[0]:n).totalDuration()),o>1?s(t,e.substr(0,o-1),n)+l:a+l)):e==null?a:+e},Dr=function(t,e,n){var i=bi(e[1]),r=(i?2:1)+(t<2?0:1),a=e[r],o,l;if(i&&(a.duration=e[1]),a.parent=n,t){for(o=a,l=n;l&&!("immediateRender"in o);)o=l.vars.defaults||{},l=mn(l.vars.inherit)&&l.parent;a.immediateRender=mn(o.immediateRender),t<2?a.runBackwards=1:a.startAt=e[r-1]}return new ze(e[0],a,e[r+1])},Ki=function(t,e){return t||t===0?e(t):e},ea=function(t,e,n){return n<t?t:n>e?e:n},sn=function(t,e){return!Ze(t)||!(e=RS.exec(t))?"":e[1]},kS=function(t,e,n){return Ki(n,function(i){return ea(t,e,i)})},Rc=[].slice,$d=function(t,e){return t&&ri(t)&&"length"in t&&(!e&&!t.length||t.length-1 in t&&ri(t[0]))&&!t.nodeType&&t!==Qn},GS=function(t,e,n){return n===void 0&&(n=[]),t.forEach(function(i){var r;return Ze(i)&&!e||$d(i,1)?(r=n).push.apply(r,Fn(i)):n.push(i)})||n},Fn=function(t,e,n){return Te&&!e&&Te.selector?Te.selector(t):Ze(t)&&!n&&(Tc||!js())?Rc.call((e||xu).querySelectorAll(t),0):rn(t)?GS(t,n):$d(t)?Rc.call(t,0):t?[t]:[]},Cc=function(t){return t=Fn(t)[0]||Xr("Invalid scope")||{},function(e){var n=t.current||t.nativeElement||t;return Fn(e,n.querySelectorAll?n:n===t?Xr("Invalid scope")||xu.createElement("div"):t)}},Jd=function(t){return t.sort(function(){return .5-Math.random()})},Qd=function(t){if(Ie(t))return t;var e=ri(t)?t:{each:t},n=us(e.ease),i=e.from||0,r=parseFloat(e.base)||0,a={},o=i>0&&i<1,l=isNaN(i)||o,c=e.axis,u=i,p=i;return Ze(i)?u=p={center:.5,edges:.5,end:1}[i]||0:!o&&l&&(u=i[0],p=i[1]),function(h,d,g){var m=(g||e).length,f=a[m],_,v,S,M,E,b,x,y,A;if(!f){if(A=e.grid==="auto"?0:(e.grid||[1,On])[1],!A){for(x=-On;x<(x=g[A++].getBoundingClientRect().left)&&A<m;);A<m&&A--}for(f=a[m]=[],_=l?Math.min(A,m)*u-.5:i%A,v=A===On?0:l?m*p/A-.5:i/A|0,x=0,y=On,b=0;b<m;b++)S=b%A-_,M=v-(b/A|0),f[b]=E=c?Math.abs(c==="y"?M:S):Id(S*S+M*M),E>x&&(x=E),E<y&&(y=E);i==="random"&&Jd(f),f.max=x-y,f.min=y,f.v=m=(parseFloat(e.amount)||parseFloat(e.each)*(A>m?m-1:c?c==="y"?m/A:A:Math.max(A,m/A))||0)*(i==="edges"?-1:1),f.b=m<0?r-m:r,f.u=sn(e.amount||e.each)||0,n=n&&m<0?ty(n):n}return m=(f[h]-f.min)/f.max||0,Ae(f.b+(n?n(m):m)*f.v)+f.u}},Pc=function(t){var e=Math.pow(10,((t+"").split(".")[1]||"").length);return function(n){var i=Ae(Math.round(parseFloat(n)/t)*t*e);return(i-i%1)/e+(bi(n)?0:sn(n))}},jd=function(t,e){var n=rn(t),i,r;return!n&&ri(t)&&(i=n=t.radius||On,t.values?(t=Fn(t.values),(r=!bi(t[0]))&&(i*=i)):t=Pc(t.increment)),Ki(e,n?Ie(t)?function(a){return r=t(a),Math.abs(r-a)<=i?r:a}:function(a){for(var o=parseFloat(r?a.x:a),l=parseFloat(r?a.y:0),c=On,u=0,p=t.length,h,d;p--;)r?(h=t[p].x-o,d=t[p].y-l,h=h*h+d*d):h=Math.abs(t[p]-o),h<c&&(c=h,u=p);return u=!i||c<=i?t[u]:a,r||u===a||bi(a)?u:u+sn(a)}:Pc(t))},tp=function(t,e,n,i){return Ki(rn(t)?!e:n===!0?!!(n=0):!i,function(){return rn(t)?t[~~(Math.random()*t.length)]:(n=n||1e-5)&&(i=n<1?Math.pow(10,(n+"").length-2):1)&&Math.floor(Math.round((t-n/2+Math.random()*(e-t+n*.99))/n)*n*i)/i})},HS=function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];return function(i){return e.reduce(function(r,a){return a(r)},i)}},VS=function(t,e){return function(n){return t(parseFloat(n))+(e||sn(n))}},WS=function(t,e,n){return np(t,e,0,1,n)},ep=function(t,e,n){return Ki(n,function(i){return t[~~e(i)]})},XS=function s(t,e,n){var i=e-t;return rn(t)?ep(t,s(0,t.length),e):Ki(n,function(r){return(i+(r-t)%i)%i+t})},qS=function s(t,e,n){var i=e-t,r=i*2;return rn(t)?ep(t,s(0,t.length-1),e):Ki(n,function(a){return a=(r+(a-t)%r)%r||0,t+(a>i?r-a:a)})},Yr=function(t){return t.replace(TS,function(e){var n=e.indexOf("[")+1,i=e.substring(n||7,n?e.indexOf("]"):e.length-1).split(wS);return tp(n?i:+i[0],n?0:+i[1],+i[2]||1e-5)})},np=function(t,e,n,i,r){var a=e-t,o=i-n;return Ki(r,function(l){return n+((l-t)/a*o||0)})},YS=function s(t,e,n,i){var r=isNaN(t+e)?0:function(d){return(1-d)*t+d*e};if(!r){var a=Ze(t),o={},l,c,u,p,h;if(n===!0&&(i=1)&&(n=null),a)t={p:t},e={p:e};else if(rn(t)&&!rn(e)){for(u=[],p=t.length,h=p-2,c=1;c<p;c++)u.push(s(t[c-1],t[c]));p--,r=function(g){g*=p;var m=Math.min(h,~~g);return u[m](g-m)},n=e}else i||(t=$s(rn(t)?[]:{},t));if(!u){for(l in e)Eu.call(o,t,l,"get",e[l]);r=function(g){return Ru(g,o)||(a?t.p:t)}}}return Ki(n,r)},df=function(t,e,n){var i=t.labels,r=On,a,o,l;for(a in i)o=i[a]-e,o<0==!!n&&o&&r>(o=Math.abs(o))&&(l=a,r=o);return l},wn=function(t,e,n){var i=t.vars,r=i[e],a=Te,o=t._ctx,l,c,u;if(r)return l=i[e+"Params"],c=i.callbackScope||t,n&&Hi.length&&po(),o&&(Te=o),u=l?r.apply(c,l):r.call(c),Te=a,u},Er=function(t){return Xi(t),t.scrollTrigger&&t.scrollTrigger.kill(!!je),t.progress()<1&&wn(t,"onInterrupt"),t},Os,ip=[],sp=function(t){if(t)if(t=!t.name&&t.default||t,gu()||t.headless){var e=t.name,n=Ie(t),i=e&&!n&&t.init?function(){this._props=[]}:t,r={init:qr,render:Ru,add:Eu,kill:uy,modifier:cy,rawVars:0},a={targetTest:0,get:0,getSetter:Au,aliases:{},register:0};if(js(),t!==i){if(bn[e])return;Dn(i,Dn(mo(t,r),a)),$s(i.prototype,$s(r,mo(t,a))),bn[i.prop=e]=i,t.targetTest&&(ja.push(i),Mu[e]=1),e=(e==="css"?"CSS":e.charAt(0).toUpperCase()+e.substr(1))+"Plugin"}kd(e,i),t.register&&t.register(vn,i,gn)}else ip.push(t)},be=255,Tr={aqua:[0,be,be],lime:[0,be,0],silver:[192,192,192],black:[0,0,0],maroon:[128,0,0],teal:[0,128,128],blue:[0,0,be],navy:[0,0,128],white:[be,be,be],olive:[128,128,0],yellow:[be,be,0],orange:[be,165,0],gray:[128,128,128],purple:[128,0,128],green:[0,128,0],red:[be,0,0],pink:[be,192,203],cyan:[0,be,be],transparent:[be,be,be,0]},bl=function(t,e,n){return t+=t<0?1:t>1?-1:0,(t*6<1?e+(n-e)*t*6:t<.5?n:t*3<2?e+(n-e)*(2/3-t)*6:e)*be+.5|0},rp=function(t,e,n){var i=t?bi(t)?[t>>16,t>>8&be,t&be]:0:Tr.black,r,a,o,l,c,u,p,h,d,g;if(!i){if(t.substr(-1)===","&&(t=t.substr(0,t.length-1)),Tr[t])i=Tr[t];else if(t.charAt(0)==="#"){if(t.length<6&&(r=t.charAt(1),a=t.charAt(2),o=t.charAt(3),t="#"+r+r+a+a+o+o+(t.length===5?t.charAt(4)+t.charAt(4):"")),t.length===9)return i=parseInt(t.substr(1,6),16),[i>>16,i>>8&be,i&be,parseInt(t.substr(7),16)/255];t=parseInt(t.substr(1),16),i=[t>>16,t>>8&be,t&be]}else if(t.substr(0,3)==="hsl"){if(i=g=t.match(lf),!e)l=+i[0]%360/360,c=+i[1]/100,u=+i[2]/100,a=u<=.5?u*(c+1):u+c-u*c,r=u*2-a,i.length>3&&(i[3]*=1),i[0]=bl(l+1/3,r,a),i[1]=bl(l,r,a),i[2]=bl(l-1/3,r,a);else if(~t.indexOf("="))return i=t.match(Od),n&&i.length<4&&(i[3]=1),i}else i=t.match(lf)||Tr.transparent;i=i.map(Number)}return e&&!g&&(r=i[0]/be,a=i[1]/be,o=i[2]/be,p=Math.max(r,a,o),h=Math.min(r,a,o),u=(p+h)/2,p===h?l=c=0:(d=p-h,c=u>.5?d/(2-p-h):d/(p+h),l=p===r?(a-o)/d+(a<o?6:0):p===a?(o-r)/d+2:(r-a)/d+4,l*=60),i[0]=~~(l+.5),i[1]=~~(c*100+.5),i[2]=~~(u*100+.5)),n&&i.length<4&&(i[3]=1),i},ap=function(t){var e=[],n=[],i=-1;return t.split(Vi).forEach(function(r){var a=r.match(Us)||[];e.push.apply(e,a),n.push(i+=a.length+1)}),e.c=n,e},pf=function(t,e,n){var i="",r=(t+i).match(Vi),a=e?"hsla(":"rgba(",o=0,l,c,u,p;if(!r)return t;if(r=r.map(function(h){return(h=rp(h,e,1))&&a+(e?h[0]+","+h[1]+"%,"+h[2]+"%,"+h[3]:h.join(","))+")"}),n&&(u=ap(t),l=n.c,l.join(i)!==u.c.join(i)))for(c=t.replace(Vi,"1").split(Us),p=c.length-1;o<p;o++)i+=c[o]+(~l.indexOf(o)?r.shift()||a+"0,0,0,0)":(u.length?u:r.length?r:n).shift());if(!c)for(c=t.split(Vi),p=c.length-1;o<p;o++)i+=c[o]+r[o];return i+c[p]},Vi=(function(){var s="(?:\\b(?:(?:rgb|rgba|hsl|hsla)\\(.+?\\))|\\B#(?:[0-9a-f]{3,4}){1,2}\\b",t;for(t in Tr)s+="|"+t+"\\b";return new RegExp(s+")","gi")})(),ZS=/hsl[a]?\(/,op=function(t){var e=t.join(" "),n;if(Vi.lastIndex=0,Vi.test(e))return n=ZS.test(e),t[1]=pf(t[1],n),t[0]=pf(t[0],n,ap(t[1])),!0},Zr,Tn=(function(){var s=Date.now,t=500,e=33,n=s(),i=n,r=1e3/240,a=r,o=[],l,c,u,p,h,d,g=function m(f){var _=s()-i,v=f===!0,S,M,E,b;if((_>t||_<0)&&(n+=_-e),i+=_,E=i-n,S=E-a,(S>0||v)&&(b=++p.frame,h=E-p.time*1e3,p.time=E=E/1e3,a+=S+(S>=r?0:r-S),M=1),v||(l=c(m)),M)for(d=0;d<o.length;d++)o[d](E,h,b,f)};return p={time:0,frame:0,tick:function(){g(!0)},deltaRatio:function(f){return h/(1e3/(f||60))},wake:function(){Bd&&(!Tc&&gu()&&(Qn=Tc=window,xu=Qn.document||{},Pn.gsap=vn,(Qn.gsapVersions||(Qn.gsapVersions=[])).push(vn.version),zd(fo||Qn.GreenSockGlobals||!Qn.gsap&&Qn||{}),ip.forEach(sp)),u=typeof requestAnimationFrame<"u"&&requestAnimationFrame,l&&p.sleep(),c=u||function(f){return setTimeout(f,a-p.time*1e3+1|0)},Zr=1,g(2))},sleep:function(){(u?cancelAnimationFrame:clearTimeout)(l),Zr=0,c=qr},lagSmoothing:function(f,_){t=f||1/0,e=Math.min(_||33,t)},fps:function(f){r=1e3/(f||240),a=p.time*1e3+r},add:function(f,_,v){var S=_?function(M,E,b,x){f(M,E,b,x),p.remove(S)}:f;return p.remove(f),o[v?"unshift":"push"](S),js(),S},remove:function(f,_){~(_=o.indexOf(f))&&o.splice(_,1)&&d>=_&&d--},_listeners:o},p})(),js=function(){return!Zr&&Tn.wake()},le={},KS=/^[\d.\-M][\d.\-,\s]/,$S=/["']/g,JS=function(t){for(var e={},n=t.substr(1,t.length-3).split(":"),i=n[0],r=1,a=n.length,o,l,c;r<a;r++)l=n[r],o=r!==a-1?l.lastIndexOf(","):l.length,c=l.substr(0,o),e[i]=isNaN(c)?c.replace($S,"").trim():+c,i=l.substr(o+1).trim();return e},QS=function(t){var e=t.indexOf("(")+1,n=t.indexOf(")"),i=t.indexOf("(",e);return t.substring(e,~i&&i<n?t.indexOf(")",n+1):n)},jS=function(t){var e=(t+"").split("("),n=le[e[0]];return n&&e.length>1&&n.config?n.config.apply(null,~t.indexOf("{")?[JS(e[1])]:QS(t).split(",").map(Wd)):le._CE&&KS.test(t)?le._CE("",t):n},ty=function(t){return function(e){return 1-t(1-e)}},us=function(t,e){return t&&(Ie(t)?t:le[t]||jS(t))||e},_s=function(t,e,n,i){n===void 0&&(n=function(l){return 1-e(1-l)}),i===void 0&&(i=function(l){return l<.5?e(l*2)/2:1-e((1-l)*2)/2});var r={easeIn:e,easeOut:n,easeInOut:i},a;return _n(t,function(o){le[o]=Pn[o]=r,le[a=o.toLowerCase()]=n;for(var l in r)le[a+(l==="easeIn"?".in":l==="easeOut"?".out":".inOut")]=le[o+"."+l]=r[l]}),r},lp=function(t){return function(e){return e<.5?(1-t(1-e*2))/2:.5+t((e-.5)*2)/2}},El=function s(t,e,n){var i=e>=1?e:1,r=(n||(t?.3:.45))/(e<1?e:1),a=r/Ec*(Math.asin(1/i)||0),o=function(u){return u===1?1:i*Math.pow(2,-10*u)*ES((u-a)*r)+1},l=t==="out"?o:t==="in"?function(c){return 1-o(1-c)}:lp(o);return r=Ec/r,l.config=function(c,u){return s(t,c,u)},l},Tl=function s(t,e){e===void 0&&(e=1.70158);var n=function(a){return a?--a*a*((e+1)*a+e)+1:0},i=t==="out"?n:t==="in"?function(r){return 1-n(1-r)}:lp(n);return i.config=function(r){return s(t,r)},i};_n("Linear,Quad,Cubic,Quart,Quint,Strong",function(s,t){var e=t<5?t+1:t;_s(s+",Power"+(e-1),t?function(n){return Math.pow(n,e)}:function(n){return n},function(n){return 1-Math.pow(1-n,e)},function(n){return n<.5?Math.pow(n*2,e)/2:1-Math.pow((1-n)*2,e)/2})});le.Linear.easeNone=le.none=le.Linear.easeIn;_s("Elastic",El("in"),El("out"),El());(function(s,t){var e=1/t,n=2*e,i=2.5*e,r=function(o){return o<e?s*o*o:o<n?s*Math.pow(o-1.5/t,2)+.75:o<i?s*(o-=2.25/t)*o+.9375:s*Math.pow(o-2.625/t,2)+.984375};_s("Bounce",function(a){return 1-r(1-a)},r)})(7.5625,2.75);_s("Expo",function(s){return Math.pow(2,10*(s-1))*s+s*s*s*s*s*s*(1-s)});_s("Circ",function(s){return-(Id(1-s*s)-1)});_s("Sine",function(s){return s===1?1:-bS(s*SS)+1});_s("Back",Tl("in"),Tl("out"),Tl());le.SteppedEase=le.steps=Pn.SteppedEase={config:function(t,e){t===void 0&&(t=1);var n=1/t,i=t+(e?0:1),r=e?1:0,a=1-Me;return function(o){return((i*ea(0,a,o)|0)+r)*n}}};Wr.ease=le["quad.out"];_n("onComplete,onUpdate,onStart,onRepeat,onReverseComplete,onInterrupt",function(s){return Su+=s+","+s+"Params,"});var cp=function(t,e){this.id=yS++,t._gsap=this,this.target=t,this.harness=e,this.get=e?e.get:Hd,this.set=e?e.getSetter:Au},Kr=(function(){function s(e){this.vars=e,this._delay=+e.delay||0,(this._repeat=e.repeat===1/0?-2:e.repeat||0)&&(this._rDelay=e.repeatDelay||0,this._yoyo=!!e.yoyo||!!e.yoyoEase),this._ts=1,Qs(this,+e.duration,1,1),this.data=e.data,Te&&(this._ctx=Te,Te.data.push(this)),Zr||Tn.wake()}var t=s.prototype;return t.delay=function(n){return n||n===0?(this.parent&&this.parent.smoothChildTiming&&this.startTime(this._start+n-this._delay),this._delay=n,this):this._delay},t.duration=function(n){return arguments.length?this.totalDuration(this._repeat>0?n+(n+this._rDelay)*this._repeat:n):this.totalDuration()&&this._dur},t.totalDuration=function(n){return arguments.length?(this._dirty=0,Qs(this,this._repeat<0?n:(n-this._repeat*this._rDelay)/(this._repeat+1))):this._tDur},t.totalTime=function(n,i){if(js(),!arguments.length)return this._tTime;var r=this._dp;if(r&&r.smoothChildTiming&&this._ts){for(Uo(this,n),!r._dp||r.parent||Yd(r,this);r&&r.parent;)r.parent._time!==r._start+(r._ts>=0?r._tTime/r._ts:(r.totalDuration()-r._tTime)/-r._ts)&&r.totalTime(r._tTime,!0),r=r.parent;!this.parent&&this._dp.autoRemoveChildren&&(this._ts>0&&n<this._tDur||this._ts<0&&n>0||!this._tDur&&!n)&&ei(this._dp,this,this._start-this._delay)}return(this._tTime!==n||!this._dur&&!i||this._initted&&Math.abs(this._zTime)===Me||!this._initted&&this._dur&&n||!n&&!this._initted&&(this.add||this._ptLookup))&&(this._ts||(this._pTime=n),Vd(this,n,i)),this},t.time=function(n,i){return arguments.length?this.totalTime(Math.min(this.totalDuration(),n+hf(this))%(this._dur+this._rDelay)||(n?this._dur:0),i):this._time},t.totalProgress=function(n,i){return arguments.length?this.totalTime(this.totalDuration()*n,i):this.totalDuration()?Math.min(1,this._tTime/this._tDur):this.rawTime()>=0&&this._initted?1:0},t.progress=function(n,i){return arguments.length?this.totalTime(this.duration()*(this._yoyo&&!(this.iteration()&1)?1-n:n)+hf(this),i):this.duration()?Math.min(1,this._time/this._dur):this.rawTime()>0?1:0},t.iteration=function(n,i){var r=this.duration()+this._rDelay;return arguments.length?this.totalTime(this._time+(n-1)*r,i):this._repeat?Js(this._tTime,r)+1:1},t.timeScale=function(n,i){if(!arguments.length)return this._rts===-Me?0:this._rts;if(this._rts===n)return this;var r=this.parent&&this._ts?_o(this.parent._time,this):this._tTime,a=this._rts<0;this._rts=+n||0,this._ts=this._ps||n===-Me?0:this._rts;var o=this.totalDuration();return(a!==this._rts<0||r>0&&r<o)&&this.totalTime(ea(-Math.abs(this._delay),o,r),i!==!1),Io(this),IS(this)},t.paused=function(n){if(!arguments.length)return this._ps;if(this._ps!==n)if(this._ps=n,n)this._pTime=this._tTime||Math.max(-this._delay,this.rawTime()),this._ts=this._act=0;else{js(),this._ts=this._rts;var i=this.parent&&!this.parent.smoothChildTiming?this.rawTime():this._tTime||this._pTime,r=this.progress()===1&&Math.abs(this._zTime)!==Me,a;if(r)for(this._tTime-=Me,a=this._first;a;){if(!a._dur&&a._zTime<0&&a._ts&&a._start<=i+Me){r=!1;break}a=a._next}this.totalTime(i,r)}return this},t.startTime=function(n){if(arguments.length){this._start=Ae(n);var i=this.parent||this._dp;return i&&(i._sort||!this.parent)&&ei(i,this,this._start-this._delay),this}return this._start},t.endTime=function(n){return this._start+(mn(n)?this.totalDuration():this.duration())/Math.abs(this._ts||1)},t.rawTime=function(n){var i=this.parent||this._dp;return i?n&&(!this._ts||this._repeat&&this._time&&this.totalProgress()<1)?this._tTime%(this._dur+this._rDelay):this._ts?_o(i.rawTime(n),this):this._tTime:this._tTime},t.revert=function(n){n===void 0&&(n=PS);var i=je;return je=n,bu(this)&&(this.timeline&&this.timeline.revert(n),this.totalTime(-.01,n.suppressEvents)),this.data!=="nested"&&n.kill!==!1&&this.kill(),je=i,this},t.globalTime=function(n){for(var i=this,r=arguments.length?n:i.rawTime();i;)r=i._start+r/(Math.abs(i._ts)||1),i=i._dp;return!this.parent&&this._sat?this._sat.globalTime(n):r},t.repeat=function(n){return arguments.length?(this._repeat=n===1/0?-2:n,ff(this)):this._repeat===-2?1/0:this._repeat},t.repeatDelay=function(n){if(arguments.length){var i=this._time;return this._rDelay=n,ff(this),i?this.time(i):this}return this._rDelay},t.yoyo=function(n){return arguments.length?(this._yoyo=n,this):this._yoyo},t.seek=function(n,i){return this.totalTime(In(this,n),mn(i))},t.restart=function(n,i){return this.play().totalTime(n?-this._delay:0,mn(i)),this._dur||(this._zTime=-Me),this},t.play=function(n,i){return n!=null&&this.seek(n,i),this.reversed(!1).paused(!1)},t.reverse=function(n,i){return n!=null&&this.seek(n||this.totalDuration(),i),this.reversed(!0).paused(!1)},t.pause=function(n,i){return n!=null&&this.seek(n,i),this.paused(!0)},t.resume=function(){return this.paused(!1)},t.reversed=function(n){return arguments.length?(!!n!==this.reversed()&&this.timeScale(-this._rts||(n?-Me:0)),this):this._rts<0},t.invalidate=function(){return this._initted=this._act=0,this._zTime=-Me,this},t.isActive=function(){var n=this.parent||this._dp,i=this._start,r;return!!(!n||this._ts&&this._initted&&n.isActive()&&(r=n.rawTime(!0))>=i&&r<this.endTime(!0)-Me)},t.eventCallback=function(n,i,r){var a=this.vars;return arguments.length>1?(i?(a[n]=i,r&&(a[n+"Params"]=r),n==="onUpdate"&&(this._onUpdate=i)):delete a[n],this):a[n]},t.then=function(n){var i=this,r=i._prom;return new Promise(function(a){var o=Ie(n)?n:Xd,l=function(){var u=i.then;i.then=null,r&&r(),Ie(o)&&(o=o(i))&&(o.then||o===i)&&(i.then=u),a(o),i.then=u};i._initted&&i.totalProgress()===1&&i._ts>=0||!i._tTime&&i._ts<0?l():i._prom=l})},t.kill=function(){Er(this)},s})();Dn(Kr.prototype,{_time:0,_start:0,_end:0,_tTime:0,_tDur:0,_dirty:0,_repeat:0,_yoyo:!1,parent:null,_initted:!1,_rDelay:0,_ts:1,_dp:0,ratio:0,_zTime:-Me,_prom:0,_ps:!1,_rts:1});var un=(function(s){Nd(t,s);function t(n,i){var r;return n===void 0&&(n={}),r=s.call(this,n)||this,r.labels={},r.smoothChildTiming=!!n.smoothChildTiming,r.autoRemoveChildren=!!n.autoRemoveChildren,r._sort=mn(n.sortChildren),Re&&ei(n.parent||Re,mi(r),i),n.reversed&&r.reverse(),n.paused&&r.paused(!0),n.scrollTrigger&&Zd(mi(r),n.scrollTrigger),r}var e=t.prototype;return e.to=function(i,r,a){return Dr(0,arguments,this),this},e.from=function(i,r,a){return Dr(1,arguments,this),this},e.fromTo=function(i,r,a,o){return Dr(2,arguments,this),this},e.set=function(i,r,a){return r.duration=0,r.parent=this,Pr(r).repeatDelay||(r.repeat=0),r.immediateRender=!!r.immediateRender,new ze(i,r,In(this,a),1),this},e.call=function(i,r,a){return ei(this,ze.delayedCall(0,i,r),a)},e.staggerTo=function(i,r,a,o,l,c,u){return a.duration=r,a.stagger=a.stagger||o,a.onComplete=c,a.onCompleteParams=u,a.parent=this,new ze(i,a,In(this,l)),this},e.staggerFrom=function(i,r,a,o,l,c,u){return a.runBackwards=1,Pr(a).immediateRender=mn(a.immediateRender),this.staggerTo(i,r,a,o,l,c,u)},e.staggerFromTo=function(i,r,a,o,l,c,u,p){return o.startAt=a,Pr(o).immediateRender=mn(o.immediateRender),this.staggerTo(i,r,o,l,c,u,p)},e.render=function(i,r,a){var o=this._time,l=this._dirty?this.totalDuration():this._tDur,c=this._dur,u=i<=0?0:Ae(i),p=this._zTime<0!=i<0&&(this._initted||!c),h,d,g,m,f,_,v,S,M,E,b,x;if(this!==Re&&u>l&&i>=0&&(u=l),u!==this._tTime||a||p){if(o!==this._time&&c&&(u+=this._time-o,i+=this._time-o),h=u,M=this._start,S=this._ts,_=!S,p&&(c||(o=this._zTime),(i||!r)&&(this._zTime=i)),this._repeat){if(b=this._yoyo,f=c+this._rDelay,this._repeat<-1&&i<0)return this.totalTime(f*100+i,r,a);if(h=Ae(u%f),u===l?(m=this._repeat,h=c):(E=Ae(u/f),m=~~E,m&&m===E&&(h=c,m--),h>c&&(h=c)),E=Js(this._tTime,f),!o&&this._tTime&&E!==m&&this._tTime-E*f-this._dur<=0&&(E=m),b&&m&1&&(h=c-h,x=1),m!==E&&!this._lock){var y=b&&E&1,A=y===(b&&m&1);if(m<E&&(y=!y),o=y?0:u%c?c:u,this._lock=1,this.render(o||(x?0:Ae(m*f)),r,!c)._lock=0,this._tTime=u,!r&&this.parent&&wn(this,"onRepeat"),this.vars.repeatRefresh&&!x&&(this.invalidate()._lock=1,E=m),o&&o!==this._time||_!==!this._ts||this.vars.onRepeat&&!this.parent&&!this._act)return this;if(c=this._dur,l=this._tDur,A&&(this._lock=2,o=y?c:-1e-4,this.render(o,!0),this.vars.repeatRefresh&&!x&&this.invalidate()),this._lock=0,!this._ts&&!_)return this}}if(this._hasPause&&!this._forcing&&this._lock<2&&(v=BS(this,Ae(o),Ae(h)),v&&(u-=h-(h=v._start))),this._tTime=u,this._time=h,this._act=!!S,this._initted||(this._onUpdate=this.vars.onUpdate,this._initted=1,this._zTime=i,o=0),!o&&u&&c&&!r&&!E&&(wn(this,"onStart"),this._tTime!==u))return this;if(h>=o&&i>=0)for(d=this._first;d;){if(g=d._next,(d._act||h>=d._start)&&d._ts&&v!==d){if(d.parent!==this)return this.render(i,r,a);if(d.render(d._ts>0?(h-d._start)*d._ts:(d._dirty?d.totalDuration():d._tDur)+(h-d._start)*d._ts,r,a),h!==this._time||!this._ts&&!_){v=0,g&&(u+=this._zTime=-Me);break}}d=g}else{d=this._last;for(var R=i<0?i:h;d;){if(g=d._prev,(d._act||R<=d._end)&&d._ts&&v!==d){if(d.parent!==this)return this.render(i,r,a);if(d.render(d._ts>0?(R-d._start)*d._ts:(d._dirty?d.totalDuration():d._tDur)+(R-d._start)*d._ts,r,a||je&&bu(d)),h!==this._time||!this._ts&&!_){v=0,g&&(u+=this._zTime=R?-Me:Me);break}}d=g}}if(v&&!r&&(this.pause(),v.render(h>=o?0:-Me)._zTime=h>=o?1:-1,this._ts))return this._start=M,Io(this),this.render(i,r,a);this._onUpdate&&!r&&wn(this,"onUpdate",!0),(u===l&&this._tTime>=this.totalDuration()||!u&&o)&&(M===this._start||Math.abs(S)!==Math.abs(this._ts))&&(this._lock||((i||!c)&&(u===l&&this._ts>0||!u&&this._ts<0)&&Xi(this,1),!r&&!(i<0&&!o)&&(u||o||!l)&&(wn(this,u===l&&i>=0?"onComplete":"onReverseComplete",!0),this._prom&&!(u<l&&this.timeScale()>0)&&this._prom())))}return this},e.add=function(i,r){var a=this;if(bi(r)||(r=In(this,r,i)),!(i instanceof Kr)){if(rn(i))return i.forEach(function(o){return a.add(o,r)}),this;if(Ze(i))return this.addLabel(i,r);if(Ie(i))i=ze.delayedCall(0,i);else return this}return this!==i?ei(this,i,r):this},e.getChildren=function(i,r,a,o){i===void 0&&(i=!0),r===void 0&&(r=!0),a===void 0&&(a=!0),o===void 0&&(o=-On);for(var l=[],c=this._first;c;)c._start>=o&&(c instanceof ze?r&&l.push(c):(a&&l.push(c),i&&l.push.apply(l,c.getChildren(!0,r,a)))),c=c._next;return l},e.getById=function(i){for(var r=this.getChildren(1,1,1),a=r.length;a--;)if(r[a].vars.id===i)return r[a]},e.remove=function(i){return Ze(i)?this.removeLabel(i):Ie(i)?this.killTweensOf(i):(i.parent===this&&No(this,i),i===this._recent&&(this._recent=this._last),cs(this))},e.totalTime=function(i,r){return arguments.length?(this._forcing=1,!this._dp&&this._ts&&(this._start=Ae(Tn.time-(this._ts>0?i/this._ts:(this.totalDuration()-i)/-this._ts))),s.prototype.totalTime.call(this,i,r),this._forcing=0,this):this._tTime},e.addLabel=function(i,r){return this.labels[i]=In(this,r),this},e.removeLabel=function(i){return delete this.labels[i],this},e.addPause=function(i,r,a){var o=ze.delayedCall(0,r||qr,a);return o.data="isPause",this._hasPause=1,ei(this,o,In(this,i))},e.removePause=function(i){var r=this._first;for(i=In(this,i);r;)r._start===i&&r.data==="isPause"&&Xi(r),r=r._next},e.killTweensOf=function(i,r,a){for(var o=this.getTweensOf(i,a),l=o.length;l--;)Fi!==o[l]&&o[l].kill(i,r);return this},e.getTweensOf=function(i,r){for(var a=[],o=Fn(i),l=this._first,c=bi(r),u;l;)l instanceof ze?DS(l._targets,o)&&(c?(!Fi||l._initted&&l._ts)&&l.globalTime(0)<=r&&l.globalTime(l.totalDuration())>r:!r||l.isActive())&&a.push(l):(u=l.getTweensOf(o,r)).length&&a.push.apply(a,u),l=l._next;return a},e.tweenTo=function(i,r){r=r||{};var a=this,o=In(a,i),l=r,c=l.startAt,u=l.onStart,p=l.onStartParams,h=l.immediateRender,d,g=ze.to(a,Dn({ease:r.ease||"none",lazy:!1,immediateRender:!1,time:o,overwrite:"auto",duration:r.duration||Math.abs((o-(c&&"time"in c?c.time:a._time))/a.timeScale())||Me,onStart:function(){if(a.pause(),!d){var f=r.duration||Math.abs((o-(c&&"time"in c?c.time:a._time))/a.timeScale());g._dur!==f&&Qs(g,f,0,1).render(g._time,!0,!0),d=1}u&&u.apply(g,p||[])}},r));return h?g.render(0):g},e.tweenFromTo=function(i,r,a){return this.tweenTo(r,Dn({startAt:{time:In(this,i)}},a))},e.recent=function(){return this._recent},e.nextLabel=function(i){return i===void 0&&(i=this._time),df(this,In(this,i))},e.previousLabel=function(i){return i===void 0&&(i=this._time),df(this,In(this,i),1)},e.currentLabel=function(i){return arguments.length?this.seek(i,!0):this.previousLabel(this._time+Me)},e.shiftChildren=function(i,r,a){a===void 0&&(a=0);var o=this._first,l=this.labels,c;for(i=Ae(i);o;)o._start>=a&&(o._start+=i,o._end+=i),o=o._next;if(r)for(c in l)l[c]>=a&&(l[c]+=i);return cs(this)},e.invalidate=function(i){var r=this._first;for(this._lock=0;r;)r.invalidate(i),r=r._next;return s.prototype.invalidate.call(this,i)},e.clear=function(i){i===void 0&&(i=!0);for(var r=this._first,a;r;)a=r._next,this.remove(r),r=a;return this._dp&&(this._time=this._tTime=this._pTime=0),i&&(this.labels={}),cs(this)},e.totalDuration=function(i){var r=0,a=this,o=a._last,l=On,c,u,p;if(arguments.length)return a.timeScale((a._repeat<0?a.duration():a.totalDuration())/(a.reversed()?-i:i));if(a._dirty){for(p=a.parent;o;)c=o._prev,o._dirty&&o.totalDuration(),u=o._start,u>l&&a._sort&&o._ts&&!a._lock?(a._lock=1,ei(a,o,u-o._delay,1)._lock=0):l=u,u<0&&o._ts&&(r-=u,(!p&&!a._dp||p&&p.smoothChildTiming)&&(a._start+=Ae(u/a._ts),a._time-=u,a._tTime-=u),a.shiftChildren(-u,!1,-1/0),l=0),o._end>r&&o._ts&&(r=o._end),o=c;Qs(a,a===Re&&a._time>r?a._time:r,1,1),a._dirty=0}return a._tDur},t.updateRoot=function(i){if(Re._ts&&(Vd(Re,_o(i,Re)),Gd=Tn.frame),Tn.frame>=cf){cf+=Rn.autoSleep||120;var r=Re._first;if((!r||!r._ts)&&Rn.autoSleep&&Tn._listeners.length<2){for(;r&&!r._ts;)r=r._next;r||Tn.sleep()}}},t})(Kr);Dn(un.prototype,{_lock:0,_hasPause:0,_forcing:0});var ey=function(t,e,n,i,r,a,o){var l=new gn(this._pt,t,e,0,1,pp,null,r),c=0,u=0,p,h,d,g,m,f,_,v;for(l.b=n,l.e=i,n+="",i+="",(_=~i.indexOf("random("))&&(i=Yr(i)),a&&(v=[n,i],a(v,t,e),n=v[0],i=v[1]),h=n.match(Sl)||[];p=Sl.exec(i);)g=p[0],m=i.substring(c,p.index),d?d=(d+1)%5:m.substr(-5)==="rgba("&&(d=1),g!==h[u++]&&(f=parseFloat(h[u-1])||0,l._pt={_next:l._pt,p:m||u===1?m:",",s:f,c:g.charAt(1)==="="?ks(f,g)-f:parseFloat(g)-f,m:d&&d<4?Math.round:0},c=Sl.lastIndex);return l.c=c<i.length?i.substring(c,i.length):"",l.fp=o,(Fd.test(i)||_)&&(l.e=0),this._pt=l,l},Eu=function(t,e,n,i,r,a,o,l,c,u){Ie(i)&&(i=i(r||0,t,a));var p=t[e],h=n!=="get"?n:Ie(p)?c?t[e.indexOf("set")||!Ie(t["get"+e.substr(3)])?e:"get"+e.substr(3)](c):t[e]():p,d=Ie(p)?c?ay:fp:wu,g;if(Ze(i)&&(~i.indexOf("random(")&&(i=Yr(i)),i.charAt(1)==="="&&(g=ks(h,i)+(sn(h)||0),(g||g===0)&&(i=g))),!u||h!==i||Dc)return!isNaN(h*i)&&i!==""?(g=new gn(this._pt,t,e,+h||0,i-(h||0),typeof p=="boolean"?ly:dp,0,d),c&&(g.fp=c),o&&g.modifier(o,this,t),this._pt=g):(!p&&!(e in t)&&vu(e,i),ey.call(this,t,e,h,i,d,l||Rn.stringFilter,c))},ny=function(t,e,n,i,r){if(Ie(t)&&(t=Lr(t,r,e,n,i)),!ri(t)||t.style&&t.nodeType||rn(t)||Ud(t))return Ze(t)?Lr(t,r,e,n,i):t;var a={},o;for(o in t)a[o]=Lr(t[o],r,e,n,i);return a},up=function(t,e,n,i,r,a){var o,l,c,u;if(bn[t]&&(o=new bn[t]).init(r,o.rawVars?e[t]:ny(e[t],i,r,a,n),n,i,a)!==!1&&(n._pt=l=new gn(n._pt,r,t,0,1,o.render,o,0,o.priority),n!==Os))for(c=n._ptLookup[n._targets.indexOf(r)],u=o._props.length;u--;)c[o._props[u]]=l;return o},Fi,Dc,Tu=function s(t,e,n){var i=t.vars,r=i.ease,a=i.startAt,o=i.immediateRender,l=i.lazy,c=i.onUpdate,u=i.runBackwards,p=i.yoyoEase,h=i.keyframes,d=i.autoRevert,g=t._dur,m=t._startAt,f=t._targets,_=t.parent,v=_&&_.data==="nested"?_.vars.targets:f,S=t._overwrite==="auto"&&!mu,M=t.timeline,E=i.easeReverse||p,b,x,y,A,R,C,L,N,D,B,z,U,X;if(M&&(!h||!r)&&(r="none"),t._ease=us(r,Wr.ease),t._rEase=E&&(us(E)||t._ease),t._from=!M&&!!i.runBackwards,t._from&&(t.ratio=1),!M||h&&!i.stagger){if(N=f[0]?ls(f[0]).harness:0,U=N&&i[N.prop],b=mo(i,Mu),m&&(m._zTime<0&&m.progress(1),e<0&&u&&o&&!d?m.render(-1,!0):m.revert(u&&g?Qa:CS),m._lazy=0),a){if(Xi(t._startAt=ze.set(f,Dn({data:"isStart",overwrite:!1,parent:_,immediateRender:!0,lazy:!m&&mn(l),startAt:null,delay:0,onUpdate:c&&function(){return wn(t,"onUpdate")},stagger:0},a))),t._startAt._dp=0,t._startAt._sat=t,e<0&&(je||!o&&!d)&&t._startAt.revert(Qa),o&&g&&e<=0&&n<=0){e&&(t._zTime=e);return}}else if(u&&g&&!m){if(e&&(o=!1),y=Dn({overwrite:!1,data:"isFromStart",lazy:o&&!m&&mn(l),immediateRender:o,stagger:0,parent:_},b),U&&(y[N.prop]=U),Xi(t._startAt=ze.set(f,y)),t._startAt._dp=0,t._startAt._sat=t,e<0&&(je?t._startAt.revert(Qa):t._startAt.render(-1,!0)),t._zTime=e,!o)s(t._startAt,Me,Me);else if(!e)return}for(t._pt=t._ptCache=0,l=g&&mn(l)||l&&!g,x=0;x<f.length;x++){if(R=f[x],L=R._gsap||yu(f)[x]._gsap,t._ptLookup[x]=B={},wc[L.id]&&Hi.length&&po(),z=v===f?x:v.indexOf(R),N&&(D=new N).init(R,U||b,t,z,v)!==!1&&(t._pt=A=new gn(t._pt,R,D.name,0,1,D.render,D,0,D.priority),D._props.forEach(function(G){B[G]=A}),D.priority&&(C=1)),!N||U)for(y in b)bn[y]&&(D=up(y,b,t,z,R,v))?D.priority&&(C=1):B[y]=A=Eu.call(t,R,y,"get",b[y],z,v,0,i.stringFilter);t._op&&t._op[x]&&t.kill(R,t._op[x]),S&&t._pt&&(Fi=t,Re.killTweensOf(R,B,t.globalTime(e)),X=!t.parent,Fi=0),t._pt&&l&&(wc[L.id]=1)}C&&mp(t),t._onInit&&t._onInit(t)}t._onUpdate=c,t._initted=(!t._op||t._pt)&&!X,h&&e<=0&&M.render(On,!0,!0)},iy=function(t,e,n,i,r,a,o,l){var c=(t._pt&&t._ptCache||(t._ptCache={}))[e],u,p,h,d;if(!c)for(c=t._ptCache[e]=[],h=t._ptLookup,d=t._targets.length;d--;){if(u=h[d][e],u&&u.d&&u.d._pt)for(u=u.d._pt;u&&u.p!==e&&u.fp!==e;)u=u._next;if(!u)return Dc=1,t.vars[e]="+=0",Tu(t,o),Dc=0,l?Xr(e+" not eligible for reset. Try splitting into individual properties"):1;c.push(u)}for(d=c.length;d--;)p=c[d],u=p._pt||p,u.s=(i||i===0)&&!r?i:u.s+(i||0)+a*u.c,u.c=n-u.s,p.e&&(p.e=Ue(n)+sn(p.e)),p.b&&(p.b=u.s+sn(p.b))},sy=function(t,e){var n=t[0]?ls(t[0]).harness:0,i=n&&n.aliases,r,a,o,l;if(!i)return e;r=$s({},e);for(a in i)if(a in r)for(l=i[a].split(","),o=l.length;o--;)r[l[o]]=r[a];return r},ry=function(t,e,n,i){var r=e.ease||i||"power1.inOut",a,o;if(rn(e))o=n[t]||(n[t]=[]),e.forEach(function(l,c){return o.push({t:c/(e.length-1)*100,v:l,e:r})});else for(a in e)o=n[a]||(n[a]=[]),a==="ease"||o.push({t:parseFloat(t),v:e[a],e:r})},Lr=function(t,e,n,i,r){return Ie(t)?t.call(e,n,i,r):Ze(t)&&~t.indexOf("random(")?Yr(t):t},xo=Su+"repeat,repeatDelay,yoyo,repeatRefresh,yoyoEase,easeReverse,autoRevert",hp={};_n(xo+",id,stagger,delay,duration,paused,scrollTrigger",function(s){return hp[s]=1});xo=xo.split(",");var ze=(function(s){Nd(t,s);function t(n,i,r,a){var o;typeof i=="number"&&(r.duration=i,i=r,r=null),o=s.call(this,a?i:Pr(i))||this;var l=o.vars,c=l.duration,u=l.delay,p=l.immediateRender,h=l.stagger,d=l.overwrite,g=l.keyframes,m=l.defaults,f=l.scrollTrigger,_=i.parent||Re,v=(rn(n)||Ud(n)?bi(n[0]):"length"in i)?[n]:Fn(n),S,M,E,b,x,y,A,R;if(o._targets=v.length?yu(v):Xr("GSAP target "+n+" not found. https://gsap.com",!Rn.nullTargetWarn)||[],o._ptLookup=[],o._overwrite=d,g||h||Va(c)||Va(u)){i=o.vars;var C=i.easeReverse||i.yoyoEase;if(S=o.timeline=new un({data:"nested",defaults:m||{},targets:_&&_.data==="nested"?_.vars.targets:v}),S.kill(),S.parent=S._dp=mi(o),S._start=0,h||Va(c)||Va(u)){if(b=v.length,A=h&&Qd(h),ri(h))for(x in h)~xo.indexOf(x)&&(R||(R={}),R[x]=h[x]);for(M=0;M<b;M++)E=mo(i,hp),E.stagger=0,C&&(E.easeReverse=C),R&&$s(E,R),y=v[M],E.duration=+Lr(c,mi(o),M,y,v),E.delay=(+Lr(u,mi(o),M,y,v)||0)-o._delay,!h&&b===1&&E.delay&&(o._delay=u=E.delay,o._start+=u,E.delay=0),S.to(y,E,A?A(M,y,v):0),S._ease=le.none;S.duration()?c=u=0:o.timeline=0}else if(g){Pr(Dn(S.vars.defaults,{ease:"none"})),S._ease=us(g.ease||i.ease||"none");var L=0,N,D,B;if(rn(g))g.forEach(function(z){return S.to(v,z,">")}),S.duration();else{E={};for(x in g)x==="ease"||x==="easeEach"||ry(x,g[x],E,g.easeEach);for(x in E)for(N=E[x].sort(function(z,U){return z.t-U.t}),L=0,M=0;M<N.length;M++)D=N[M],B={ease:D.e,duration:(D.t-(M?N[M-1].t:0))/100*c},B[x]=D.v,S.to(v,B,L),L+=B.duration;S.duration()<c&&S.to({},{duration:c-S.duration()})}}c||o.duration(c=S.duration())}else o.timeline=0;return d===!0&&!mu&&(Fi=mi(o),Re.killTweensOf(v),Fi=0),ei(_,mi(o),r),i.reversed&&o.reverse(),i.paused&&o.paused(!0),(p||!c&&!g&&o._start===Ae(_._time)&&mn(p)&&US(mi(o))&&_.data!=="nested")&&(o._tTime=-Me,o.render(Math.max(0,-u)||0)),f&&Zd(mi(o),f),o}var e=t.prototype;return e.render=function(i,r,a){var o=this._time,l=this._tDur,c=this._dur,u=i<0,p=i>l-Me&&!u?l:i<Me?0:i,h,d,g,m,f,_,v,S;if(!c)FS(this,i,r,a);else if(p!==this._tTime||!i||a||!this._initted&&this._tTime||this._startAt&&this._zTime<0!==u||this._lazy){if(h=p,S=this.timeline,this._repeat){if(m=c+this._rDelay,this._repeat<-1&&u)return this.totalTime(m*100+i,r,a);if(h=Ae(p%m),p===l?(g=this._repeat,h=c):(f=Ae(p/m),g=~~f,g&&g===f?(h=c,g--):h>c&&(h=c)),_=this._yoyo&&g&1,_&&(h=c-h),f=Js(this._tTime,m),h===o&&!a&&this._initted&&g===f)return this._tTime=p,this;g!==f&&this.vars.repeatRefresh&&!_&&!this._lock&&h!==m&&this._initted&&(this._lock=a=1,this.render(Ae(m*g),!0).invalidate()._lock=0)}if(!this._initted){if(Kd(this,u?i:h,a,r,p))return this._tTime=0,this;if(o!==this._time&&!(a&&this.vars.repeatRefresh&&g!==f))return this;if(c!==this._dur)return this.render(i,r,a)}if(this._rEase){var M=h<o;if(M!==this._inv){var E=M?o:c-o;this._inv=M,this._from&&(this.ratio=1-this.ratio),this._invRatio=this.ratio,this._invTime=o,this._invRecip=E?(M?-1:1)/E:0,this._invScale=M?-this.ratio:1-this.ratio,this._invEase=M?this._rEase:this._ease}this.ratio=v=this._invRatio+this._invScale*this._invEase((h-this._invTime)*this._invRecip)}else this.ratio=v=this._ease(h/c);if(this._from&&(this.ratio=v=1-v),this._tTime=p,this._time=h,!this._act&&this._ts&&(this._act=1,this._lazy=0),!o&&p&&!r&&!f&&(wn(this,"onStart"),this._tTime!==p))return this;for(d=this._pt;d;)d.r(v,d.d),d=d._next;S&&S.render(i<0?i:S._dur*S._ease(h/this._dur),r,a)||this._startAt&&(this._zTime=i),this._onUpdate&&!r&&(u&&Ac(this,i,r,a),wn(this,"onUpdate")),this._repeat&&g!==f&&this.vars.onRepeat&&!r&&this.parent&&wn(this,"onRepeat"),(p===this._tDur||!p)&&this._tTime===p&&(u&&!this._onUpdate&&Ac(this,i,!0,!0),(i||!c)&&(p===this._tDur&&this._ts>0||!p&&this._ts<0)&&Xi(this,1),!r&&!(u&&!o)&&(p||o||_)&&(wn(this,p===l?"onComplete":"onReverseComplete",!0),this._prom&&!(p<l&&this.timeScale()>0)&&this._prom()))}return this},e.targets=function(){return this._targets},e.invalidate=function(i){return(!i||!this.vars.runBackwards)&&(this._startAt=0),this._pt=this._op=this._onUpdate=this._lazy=this.ratio=0,this._ptLookup=[],this.timeline&&this.timeline.invalidate(i),s.prototype.invalidate.call(this,i)},e.resetTo=function(i,r,a,o,l){Zr||Tn.wake(),this._ts||this.play();var c=Math.min(this._dur,(this._dp._time-this._start)*this._ts),u;return this._initted||Tu(this,c),u=this._ease(c/this._dur),iy(this,i,r,a,o,u,c,l)?this.resetTo(i,r,a,o,1):(Uo(this,0),this.parent||qd(this._dp,this,"_first","_last",this._dp._sort?"_start":0),this.render(0))},e.kill=function(i,r){if(r===void 0&&(r="all"),!i&&(!r||r==="all"))return this._lazy=this._pt=0,this.parent?Er(this):this.scrollTrigger&&this.scrollTrigger.kill(!!je),this;if(this.timeline){var a=this.timeline.totalDuration();return this.timeline.killTweensOf(i,r,Fi&&Fi.vars.overwrite!==!0)._first||Er(this),this.parent&&a!==this.timeline.totalDuration()&&Qs(this,this._dur*this.timeline._tDur/a,0,1),this}var o=this._targets,l=i?Fn(i):o,c=this._ptLookup,u=this._pt,p,h,d,g,m,f,_;if((!r||r==="all")&&NS(o,l))return r==="all"&&(this._pt=0),Er(this);for(p=this._op=this._op||[],r!=="all"&&(Ze(r)&&(m={},_n(r,function(v){return m[v]=1}),r=m),r=sy(o,r)),_=o.length;_--;)if(~l.indexOf(o[_])){h=c[_],r==="all"?(p[_]=r,g=h,d={}):(d=p[_]=p[_]||{},g=r);for(m in g)f=h&&h[m],f&&((!("kill"in f.d)||f.d.kill(m)===!0)&&No(this,f,"_pt"),delete h[m]),d!=="all"&&(d[m]=1)}return this._initted&&!this._pt&&u&&Er(this),this},t.to=function(i,r){return new t(i,r,arguments[2])},t.from=function(i,r){return Dr(1,arguments)},t.delayedCall=function(i,r,a,o){return new t(r,0,{immediateRender:!1,lazy:!1,overwrite:!1,delay:i,onComplete:r,onReverseComplete:r,onCompleteParams:a,onReverseCompleteParams:a,callbackScope:o})},t.fromTo=function(i,r,a){return Dr(2,arguments)},t.set=function(i,r){return r.duration=0,r.repeatDelay||(r.repeat=0),new t(i,r)},t.killTweensOf=function(i,r,a){return Re.killTweensOf(i,r,a)},t})(Kr);Dn(ze.prototype,{_targets:[],_lazy:0,_startAt:0,_op:0,_onInit:0});_n("staggerTo,staggerFrom,staggerFromTo",function(s){ze[s]=function(){var t=new un,e=Rc.call(arguments,0);return e.splice(s==="staggerFromTo"?5:4,0,0),t[s].apply(t,e)}});var wu=function(t,e,n){return t[e]=n},fp=function(t,e,n){return t[e](n)},ay=function(t,e,n,i){return t[e](i.fp,n)},oy=function(t,e,n){return t.setAttribute(e,n)},Au=function(t,e){return Ie(t[e])?fp:_u(t[e])&&t.setAttribute?oy:wu},dp=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e6)/1e6,e)},ly=function(t,e){return e.set(e.t,e.p,!!(e.s+e.c*t),e)},pp=function(t,e){var n=e._pt,i="";if(!t&&e.b)i=e.b;else if(t===1&&e.e)i=e.e;else{for(;n;)i=n.p+(n.m?n.m(n.s+n.c*t):Math.round((n.s+n.c*t)*1e4)/1e4)+i,n=n._next;i+=e.c}e.set(e.t,e.p,i,e)},Ru=function(t,e){for(var n=e._pt;n;)n.r(t,n.d),n=n._next},cy=function(t,e,n,i){for(var r=this._pt,a;r;)a=r._next,r.p===i&&r.modifier(t,e,n),r=a},uy=function(t){for(var e=this._pt,n,i;e;)i=e._next,e.p===t&&!e.op||e.op===t?No(this,e,"_pt"):e.dep||(n=1),e=i;return!n},hy=function(t,e,n,i){i.mSet(t,e,i.m.call(i.tween,n,i.mt),i)},mp=function(t){for(var e=t._pt,n,i,r,a;e;){for(n=e._next,i=r;i&&i.pr>e.pr;)i=i._next;(e._prev=i?i._prev:a)?e._prev._next=e:r=e,(e._next=i)?i._prev=e:a=e,e=n}t._pt=r},gn=(function(){function s(e,n,i,r,a,o,l,c,u){this.t=n,this.s=r,this.c=a,this.p=i,this.r=o||dp,this.d=l||this,this.set=c||wu,this.pr=u||0,this._next=e,e&&(e._prev=this)}var t=s.prototype;return t.modifier=function(n,i,r){this.mSet=this.mSet||this.set,this.set=hy,this.m=n,this.mt=r,this.tween=i},s})();_n(Su+"parent,duration,ease,delay,overwrite,runBackwards,startAt,yoyo,immediateRender,repeat,repeatDelay,data,paused,reversed,lazy,callbackScope,stringFilter,id,yoyoEase,stagger,inherit,repeatRefresh,keyframes,autoRevert,scrollTrigger,easeReverse",function(s){return Mu[s]=1});Pn.TweenMax=Pn.TweenLite=ze;Pn.TimelineLite=Pn.TimelineMax=un;Re=new un({sortChildren:!1,defaults:Wr,autoRemoveChildren:!0,id:"root",smoothChildTiming:!0});Rn.stringFilter=op;var hs=[],to={},fy=[],mf=0,dy=0,wl=function(t){return(to[t]||fy).map(function(e){return e()})},$r=function(){var t=Date.now(),e=[];t-mf>2&&(wl("matchMediaInit"),hs.forEach(function(n){var i=n.queries,r=n.conditions,a,o,l,c;for(o in i)a=Qn.matchMedia(i[o]).matches,a&&(l=1),a!==r[o]&&(r[o]=a,c=1);c&&(n.revert(),l&&e.push(n))}),wl("matchMediaRevert"),e.forEach(function(n){return n.onMatch(n,function(i){return n.add(null,i)})}),mf=t,wl("matchMedia"))},_p=(function(){function s(e,n){this.selector=n&&Cc(n),this.data=[],this._r=[],this.isReverted=!1,this.id=dy++,e&&this.add(e)}var t=s.prototype;return t.add=function(n,i,r){Ie(n)&&(r=i,i=n,n=Ie);var a=this,o=function(){var c=Te,u=a.selector,p;return c&&c!==a&&c.data.push(a),r&&(a.selector=Cc(r)),Te=a,p=i.apply(a,arguments),Ie(p)&&a._r.push(p),Te=c,a.selector=u,a.isReverted=!1,p};return a.last=o,n===Ie?o(a,function(l){return a.add(null,l)}):n?a[n]=o:o},t.ignore=function(n){var i=Te;Te=null,n(this),Te=i},t.getTweens=function(){var n=[];return this.data.forEach(function(i){return i instanceof s?n.push.apply(n,i.getTweens()):i instanceof ze&&!(i.parent&&i.parent.data==="nested")&&n.push(i)}),n},t.clear=function(){this._r.length=this.data.length=0},t.kill=function(n,i){var r=this;if(n?(function(){for(var o=r.getTweens(),l=r.data.length,c;l--;)c=r.data[l],c.data==="isFlip"&&(c.revert(),c.getChildren(!0,!0,!1).forEach(function(u){return o.splice(o.indexOf(u),1)}));for(o.map(function(u){return{g:u._dur||u._delay||u._sat&&!u._sat.vars.immediateRender?u.globalTime(0):-1/0,t:u}}).sort(function(u,p){return p.g-u.g||-1/0}).forEach(function(u){return u.t.revert(n)}),l=r.data.length;l--;)c=r.data[l],c instanceof un?c.data!=="nested"&&(c.scrollTrigger&&c.scrollTrigger.revert(),c.kill()):!(c instanceof ze)&&c.revert&&c.revert(n);r._r.forEach(function(u){return u(n,r)}),r.isReverted=!0})():this.data.forEach(function(o){return o.kill&&o.kill()}),this.clear(),i){for(var a=hs.length;a--;)hs[a].id===this.id&&hs.splice(a,1);this._mqs&&this._mqs.forEach(function(o){return o.removeListener?o.removeListener($r):o.removeEventListener("change",$r)}),this._mqs=null}},t.revert=function(n){this.kill(n||{})},s})(),py=(function(){function s(e){this.contexts=[],this.scope=e,Te&&Te.data.push(this)}var t=s.prototype;return t.add=function(n,i,r){ri(n)||(n={matches:n});var a=new _p(0,r||this.scope),o=a.conditions={},l,c,u;Te&&!a.selector&&(a.selector=Te.selector),this.contexts.push(a),i=a.add("onMatch",i),a.queries=n;for(c in n)c==="all"?u=1:(l=Qn.matchMedia(n[c]),l&&(hs.indexOf(a)<0&&hs.push(a),(o[c]=l.matches)&&(u=1),l.addListener?l.addListener($r):l.addEventListener("change",$r),(a._mqs||(a._mqs=[])).push(l)));return u&&i(a,function(p){return a.add(null,p)}),this},t.revert=function(n){this.kill(n||{})},t.kill=function(n){this.contexts.forEach(function(i){return i.kill(n,!0)})},s})(),vo={registerPlugin:function(){for(var t=arguments.length,e=new Array(t),n=0;n<t;n++)e[n]=arguments[n];e.forEach(function(i){return sp(i)})},timeline:function(t){return new un(t)},getTweensOf:function(t,e){return Re.getTweensOf(t,e)},getProperty:function(t,e,n,i){Ze(t)&&(t=Fn(t)[0]);var r=ls(t||{}).get,a=n?Xd:Wd;return n==="native"&&(n=""),t&&(e?a((bn[e]&&bn[e].get||r)(t,e,n,i)):function(o,l,c){return a((bn[o]&&bn[o].get||r)(t,o,l,c))})},quickSetter:function(t,e,n){if(t=Fn(t),t.length>1){var i=t.map(function(u){return vn.quickSetter(u,e,n)}),r=i.length;return function(u){for(var p=r;p--;)i[p](u)}}t=t[0]||{};var a=bn[e],o=ls(t),l=o.harness&&(o.harness.aliases||{})[e]||e,c=a?function(u){var p=new a;Os._pt=0,p.init(t,n?u+n:u,Os,0,[t]),p.render(1,p),Os._pt&&Ru(1,Os)}:o.set(t,l);return a?c:function(u){return c(t,l,n?u+n:u,o,1)}},quickTo:function(t,e,n){var i,r=vn.to(t,Dn((i={},i[e]="+=0.1",i.paused=!0,i.stagger=0,i),n||{})),a=function(l,c,u){return r.resetTo(e,l,c,u)};return a.tween=r,a},isTweening:function(t){return Re.getTweensOf(t,!0).length>0},defaults:function(t){return t&&t.ease&&(t.ease=us(t.ease,Wr.ease)),uf(Wr,t||{})},config:function(t){return uf(Rn,t||{})},registerEffect:function(t){var e=t.name,n=t.effect,i=t.plugins,r=t.defaults,a=t.extendTimeline;(i||"").split(",").forEach(function(o){return o&&!bn[o]&&!Pn[o]&&Xr(e+" effect requires "+o+" plugin.")}),yl[e]=function(o,l,c){return n(Fn(o),Dn(l||{},r),c)},a&&(un.prototype[e]=function(o,l,c){return this.add(yl[e](o,ri(l)?l:(c=l)&&{},this),c)})},registerEase:function(t,e){le[t]=us(e)},parseEase:function(t,e){return arguments.length?us(t,e):le},getById:function(t){return Re.getById(t)},exportRoot:function(t,e){t===void 0&&(t={});var n=new un(t),i,r;for(n.smoothChildTiming=mn(t.smoothChildTiming),Re.remove(n),n._dp=0,n._time=n._tTime=Re._time,i=Re._first;i;)r=i._next,(e||!(!i._dur&&i instanceof ze&&i.vars.onComplete===i._targets[0]))&&ei(n,i,i._start-i._delay),i=r;return ei(Re,n,0),n},context:function(t,e){return t?new _p(t,e):Te},matchMedia:function(t){return new py(t)},matchMediaRefresh:function(){return hs.forEach(function(t){var e=t.conditions,n,i;for(i in e)e[i]&&(e[i]=!1,n=1);n&&t.revert()})||$r()},addEventListener:function(t,e){var n=to[t]||(to[t]=[]);~n.indexOf(e)||n.push(e)},removeEventListener:function(t,e){var n=to[t],i=n&&n.indexOf(e);i>=0&&n.splice(i,1)},utils:{wrap:XS,wrapYoyo:qS,distribute:Qd,random:tp,snap:jd,normalize:WS,getUnit:sn,clamp:kS,splitColor:rp,toArray:Fn,selector:Cc,mapRange:np,pipe:HS,unitize:VS,interpolate:YS,shuffle:Jd},install:zd,effects:yl,ticker:Tn,updateRoot:un.updateRoot,plugins:bn,globalTimeline:Re,core:{PropTween:gn,globals:kd,Tween:ze,Timeline:un,Animation:Kr,getCache:ls,_removeLinkedListItem:No,reverting:function(){return je},context:function(t){return t&&Te&&(Te.data.push(t),t._ctx=Te),Te},suppressOverwrites:function(t){return mu=t}}};_n("to,from,fromTo,delayedCall,set,killTweensOf",function(s){return vo[s]=ze[s]});Tn.add(un.updateRoot);Os=vo.to({},{duration:0});var my=function(t,e){for(var n=t._pt;n&&n.p!==e&&n.op!==e&&n.fp!==e;)n=n._next;return n},_y=function(t,e){var n=t._targets,i,r,a;for(i in e)for(r=n.length;r--;)a=t._ptLookup[r][i],a&&(a=a.d)&&(a._pt&&(a=my(a,i)),a&&a.modifier&&a.modifier(e[i],t,n[r],i))},Al=function(t,e){return{name:t,headless:1,rawVars:1,init:function(i,r,a){a._onInit=function(o){var l,c;if(Ze(r)&&(l={},_n(r,function(u){return l[u]=1}),r=l),e){l={};for(c in r)l[c]=e(r[c]);r=l}_y(o,r)}}}},vn=vo.registerPlugin({name:"attr",init:function(t,e,n,i,r){var a,o,l;this.tween=n;for(a in e)l=t.getAttribute(a)||"",o=this.add(t,"setAttribute",(l||0)+"",e[a],i,r,0,0,a),o.op=a,o.b=l,this._props.push(a)},render:function(t,e){for(var n=e._pt;n;)je?n.set(n.t,n.p,n.b,n):n.r(t,n.d),n=n._next}},{name:"endArray",headless:1,init:function(t,e){for(var n=e.length;n--;)this.add(t,n,t[n]||0,e[n],0,0,0,0,0,1)}},Al("roundProps",Pc),Al("modifiers"),Al("snap",jd))||vo;ze.version=un.version=vn.version="3.15.1";Bd=1;gu()&&js();le.Power0;le.Power1;le.Power2;le.Power3;le.Power4;le.Linear;le.Quad;le.Cubic;le.Quart;le.Quint;le.Strong;le.Elastic;le.Back;le.SteppedEase;le.Bounce;le.Sine;le.Expo;le.Circ;/*!
 * CSSPlugin 3.15.1
 * https://gsap.com
 *
 * Copyright 2008-2026, GreenSock. All rights reserved.
 * Subject to the terms at https://gsap.com/standard-license
 * @author: Jack Doyle, jack@greensock.com
*/var _f,Bi,Gs,Cu,as,gf,Pu,gy=function(){return typeof window<"u"},Ei={},ss=180/Math.PI,Hs=Math.PI/180,Ds=Math.atan2,xf=1e8,Du=/([A-Z])/g,xy=/(left|right|width|margin|padding|x)/i,vy=/[\s,\(]\S/,ii={autoAlpha:"opacity,visibility",scale:"scaleX,scaleY",alpha:"opacity"},Lc=function(t,e){return e.set(e.t,e.p,Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},My=function(t,e){return e.set(e.t,e.p,t===1?e.e:Math.round((e.s+e.c*t)*1e4)/1e4+e.u,e)},Sy=function(t,e){return e.set(e.t,e.p,t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},yy=function(t,e){return e.set(e.t,e.p,t===1?e.e:t?Math.round((e.s+e.c*t)*1e4)/1e4+e.u:e.b,e)},by=function(t,e){var n=e.s+e.c*t;e.set(e.t,e.p,~~(n+(n<0?-.5:.5))+e.u,e)},gp=function(t,e){return e.set(e.t,e.p,t?e.e:e.b,e)},xp=function(t,e){return e.set(e.t,e.p,t!==1?e.b:e.e,e)},Ey=function(t,e,n){return t.style[e]=n},Ty=function(t,e,n){return t.style.setProperty(e,n)},wy=function(t,e,n){return t._gsap[e]=n},Ay=function(t,e,n){return t._gsap.scaleX=t._gsap.scaleY=n},Ry=function(t,e,n,i,r){var a=t._gsap;a.scaleX=a.scaleY=n,a.renderTransform(r,a)},Cy=function(t,e,n,i,r){var a=t._gsap;a[e]=n,a.renderTransform(r,a)},De="transform",xn=De+"Origin",Py=function s(t,e){var n=this,i=this.target,r=i.style,a=i._gsap;if(t in Ei&&r){if(this.tfm=this.tfm||{},t!=="transform")t=ii[t]||t,~t.indexOf(",")?t.split(",").forEach(function(o){return n.tfm[o]=gi(i,o)}):this.tfm[t]=a.x?a[t]:gi(i,t),t===xn&&(this.tfm.zOrigin=a.zOrigin);else return ii.transform.split(",").forEach(function(o){return s.call(n,o,e)});if(this.props.indexOf(De)>=0)return;a.svg&&(this.svgo=i.getAttribute("data-svg-origin"),this.props.push(xn,e,"")),t=De}(r||e)&&this.props.push(t,e,r[t])},vp=function(t){t.translate&&(t.removeProperty("translate"),t.removeProperty("scale"),t.removeProperty("rotate"))},Dy=function(){var t=this.props,e=this.target,n=e.style,i=e._gsap,r,a;for(r=0;r<t.length;r+=3)t[r+1]?t[r+1]===2?e[t[r]](t[r+2]):e[t[r]]=t[r+2]:t[r+2]?n[t[r]]=t[r+2]:n.removeProperty(t[r].substr(0,2)==="--"?t[r]:t[r].replace(Du,"-$1").toLowerCase());if(this.tfm){for(a in this.tfm)i[a]=this.tfm[a];i.svg&&(i.renderTransform(),e.setAttribute("data-svg-origin",this.svgo||"")),r=Pu(),(!r||!r.isStart)&&!n[De]&&(vp(n),i.zOrigin&&n[xn]&&(n[xn]+=" "+i.zOrigin+"px",i.zOrigin=0,i.renderTransform()),i.uncache=1)}},Mp=function(t,e){var n={target:t,props:[],revert:Dy,save:Py};return t._gsap||vn.core.getCache(t),e&&t.style&&t.nodeType&&e.split(",").forEach(function(i){return n.save(i)}),n},Sp,Nc=function(t,e){var n=Bi.createElementNS?Bi.createElementNS((e||"http://www.w3.org/1999/xhtml").replace(/^https/,"http"),t):Bi.createElement(t);return n&&n.style?n:Bi.createElement(t)},An=function s(t,e,n){var i=getComputedStyle(t);return i[e]||i.getPropertyValue(e.replace(Du,"-$1").toLowerCase())||i.getPropertyValue(e)||!n&&s(t,tr(e)||e,1)||""},vf="O,Moz,ms,Ms,Webkit".split(","),tr=function(t,e,n){var i=e||as,r=i.style,a=5;if(t in r&&!n)return t;for(t=t.charAt(0).toUpperCase()+t.substr(1);a--&&!(vf[a]+t in r););return a<0?null:(a===3?"ms":a>=0?vf[a]:"")+t},Ic=function(){gy()&&window.document&&(_f=window,Bi=_f.document,Gs=Bi.documentElement,as=Nc("div")||{style:{}},Nc("div"),De=tr(De),xn=De+"Origin",as.style.cssText="border-width:0;line-height:0;position:absolute;padding:0",Sp=!!tr("perspective"),Pu=vn.core.reverting,Cu=1)},Mf=function(t){var e=t.ownerSVGElement,n=Nc("svg",e&&e.getAttribute("xmlns")||"http://www.w3.org/2000/svg"),i=t.cloneNode(!0),r;i.style.display="block",n.appendChild(i),Gs.appendChild(n);try{r=i.getBBox()}catch{}return n.removeChild(i),Gs.removeChild(n),r},Sf=function(t,e){for(var n=e.length;n--;)if(t.hasAttribute(e[n]))return t.getAttribute(e[n])},yp=function(t){var e,n;try{e=t.getBBox()}catch{e=Mf(t),n=1}return e&&(e.width||e.height)||n||(e=Mf(t)),e&&!e.width&&!e.x&&!e.y?{x:+Sf(t,["x","cx","x1"])||0,y:+Sf(t,["y","cy","y1"])||0,width:0,height:0}:e},bp=function(t){return!!(t.getCTM&&(!t.parentNode||t.ownerSVGElement)&&yp(t))},qi=function(t,e){if(e){var n=t.style,i;e in Ei&&e!==xn&&(e=De),n.removeProperty?(i=e.substr(0,2),(i==="ms"||e.substr(0,6)==="webkit")&&(e="-"+e),n.removeProperty(i==="--"?e:e.replace(Du,"-$1").toLowerCase())):n.removeAttribute(e)}},zi=function(t,e,n,i,r,a){var o=new gn(t._pt,e,n,0,1,a?xp:gp);return t._pt=o,o.b=i,o.e=r,t._props.push(n),o},yf={deg:1,rad:1,turn:1},Ly={grid:1,flex:1},Yi=function s(t,e,n,i){var r=parseFloat(n)||0,a=(n+"").trim().substr((r+"").length)||"px",o=as.style,l=xy.test(e),c=t.tagName.toLowerCase()==="svg",u=(c?"client":"offset")+(l?"Width":"Height"),p=100,h=i==="px",d=i==="%",g,m,f,_;if(i===a||!r||yf[i]||yf[a])return r;if(a!=="px"&&!h&&(r=s(t,e,n,"px")),_=t.getCTM&&bp(t),(d||a==="%")&&(Ei[e]||~e.indexOf("adius")))return g=_?t.getBBox()[l?"width":"height"]:t[u],Ue(d?r/g*p:r/100*g);if(o[l?"width":"height"]=p+(h?a:i),m=i!=="rem"&&~e.indexOf("adius")||i==="em"&&t.appendChild&&!c?t:t.parentNode,_&&(m=(t.ownerSVGElement||{}).parentNode),(!m||m===Bi||!m.appendChild)&&(m=Bi.body),f=m._gsap,f&&d&&f.width&&l&&f.time===Tn.time&&!f.uncache)return Ue(r/f.width*p);if(d&&(e==="height"||e==="width")){var v=t.style[e];t.style[e]=p+i,g=t[u],v?t.style[e]=v:qi(t,e)}else(d||a==="%")&&!Ly[An(m,"display")]&&(o.position=An(t,"position")),m===t&&(o.position="static"),m.appendChild(as),g=as[u],m.removeChild(as),o.position="absolute";return l&&d&&(f=ls(m),f.time=Tn.time,f.width=m[u]),Ue(h?g*r/p:g&&r?p/g*r:0)},gi=function(t,e,n,i){var r;return Cu||Ic(),e in ii&&e!=="transform"&&(e=ii[e],~e.indexOf(",")&&(e=e.split(",")[0])),Ei[e]&&e!=="transform"?(r=Qr(t,i),r=e!=="transformOrigin"?r[e]:r.svg?r.origin:So(An(t,xn))+" "+r.zOrigin+"px"):(r=t.style[e],(!r||r==="auto"||i||~(r+"").indexOf("calc("))&&(r=Mo[e]&&Mo[e](t,e,n)||An(t,e)||Hd(t,e)||(e==="opacity"?1:0))),n&&!~(r+"").trim().indexOf(" ")?Yi(t,e,r,n)+n:r},Ny=function(t,e,n,i){if(!n||n==="none"){var r=tr(e,t,1),a=r&&An(t,r,1);a&&a!==n?(e=r,n=a):e==="borderColor"&&(n=An(t,"borderTopColor"))}var o=new gn(this._pt,t.style,e,0,1,pp),l=0,c=0,u,p,h,d,g,m,f,_,v,S,M,E;if(o.b=n,o.e=i,n+="",i+="",i.substring(0,6)==="var(--"&&(i=An(t,i.substring(4,i.indexOf(")")))),i==="auto"&&(m=t.style[e],t.style[e]=i,i=An(t,e)||i,m?t.style[e]=m:qi(t,e)),u=[n,i],op(u),n=u[0],i=u[1],h=n.match(Us)||[],E=i.match(Us)||[],E.length){for(;p=Us.exec(i);)f=p[0],v=i.substring(l,p.index),g?g=(g+1)%5:(v.substr(-5)==="rgba("||v.substr(-5)==="hsla(")&&(g=1),f!==(m=h[c++]||"")&&(d=parseFloat(m)||0,M=m.substr((d+"").length),f.charAt(1)==="="&&(f=ks(d,f)+M),_=parseFloat(f),S=f.substr((_+"").length),l=Us.lastIndex-S.length,S||(S=S||Rn.units[e]||M,l===i.length&&(i+=S,o.e+=S)),M!==S&&(d=Yi(t,e,m,S)||0),o._pt={_next:o._pt,p:v||c===1?v:",",s:d,c:_-d,m:g&&g<4||e==="zIndex"?Math.round:0});o.c=l<i.length?i.substring(l,i.length):""}else o.r=e==="display"&&i==="none"?xp:gp;return Fd.test(i)&&(o.e=0),this._pt=o,o},bf={top:"0%",bottom:"100%",left:"0%",right:"100%",center:"50%"},Iy=function(t){var e=t.split(" "),n=e[0],i=e[1]||"50%";return(n==="top"||n==="bottom"||i==="left"||i==="right")&&(t=n,n=i,i=t),e[0]=bf[n]||n,e[1]=bf[i]||i,e.join(" ")},Uy=function(t,e){if(e.tween&&e.tween._time===e.tween._dur){var n=e.t,i=n.style,r=e.u,a=n._gsap,o,l,c;if(r==="all"||r===!0)i.cssText="",l=1;else for(r=r.split(","),c=r.length;--c>-1;)o=r[c],Ei[o]&&(l=1,o=o==="transformOrigin"?xn:De),qi(n,o);l&&(qi(n,De),a&&(a.svg&&n.removeAttribute("transform"),i.scale=i.rotate=i.translate="none",Qr(n,1),a.uncache=1,vp(i)))}},Mo={clearProps:function(t,e,n,i,r){if(r.data!=="isFromStart"){var a=t._pt=new gn(t._pt,e,n,0,0,Uy);return a.u=i,a.pr=-10,a.tween=r,t._props.push(n),1}}},Jr=[1,0,0,1,0,0],Ep={},Tp=function(t){return t==="matrix(1, 0, 0, 1, 0, 0)"||t==="none"||!t},Ef=function(t){var e=An(t,De);return Tp(e)?Jr:e.substr(7).match(Od).map(Ue)},Lu=function(t,e){var n=t._gsap||ls(t),i=t.style,r=Ef(t),a,o,l,c;return n.svg&&t.getAttribute("transform")?(l=t.transform.baseVal.consolidate().matrix,r=[l.a,l.b,l.c,l.d,l.e,l.f],r.join(",")==="1,0,0,1,0,0"?Jr:r):(r===Jr&&!t.offsetParent&&t!==Gs&&!n.svg&&(l=i.display,i.display="block",a=t.parentNode,(!a||!t.offsetParent&&!t.getBoundingClientRect().width)&&(c=1,o=t.nextElementSibling,Gs.appendChild(t)),r=Ef(t),l?i.display=l:qi(t,"display"),c&&(o?a.insertBefore(t,o):a?a.appendChild(t):Gs.removeChild(t))),e&&r.length>6?[r[0],r[1],r[4],r[5],r[12],r[13]]:r)},Uc=function(t,e,n,i,r,a){var o=t._gsap,l=r||Lu(t,!0),c=o.xOrigin||0,u=o.yOrigin||0,p=o.xOffset||0,h=o.yOffset||0,d=l[0],g=l[1],m=l[2],f=l[3],_=l[4],v=l[5],S=e.split(" "),M=parseFloat(S[0])||0,E=parseFloat(S[1])||0,b,x,y,A;n?l!==Jr&&(x=d*f-g*m)&&(y=M*(f/x)+E*(-m/x)+(m*v-f*_)/x,A=M*(-g/x)+E*(d/x)-(d*v-g*_)/x,M=y,E=A):(b=yp(t),M=b.x+(~S[0].indexOf("%")?M/100*b.width:M),E=b.y+(~(S[1]||S[0]).indexOf("%")?E/100*b.height:E)),i||i!==!1&&o.smooth?(_=M-c,v=E-u,o.xOffset=p+(_*d+v*m)-_,o.yOffset=h+(_*g+v*f)-v):o.xOffset=o.yOffset=0,o.xOrigin=M,o.yOrigin=E,o.smooth=!!i,o.origin=e,o.originIsAbsolute=!!n,t.style[xn]="0px 0px",a&&(zi(a,o,"xOrigin",c,M),zi(a,o,"yOrigin",u,E),zi(a,o,"xOffset",p,o.xOffset),zi(a,o,"yOffset",h,o.yOffset)),t.setAttribute("data-svg-origin",M+" "+E)},Qr=function(t,e){var n=t._gsap||new cp(t);if("x"in n&&!e&&!n.uncache)return n;var i=t.style,r=n.scaleX<0,a="px",o="deg",l=getComputedStyle(t),c=An(t,xn)||"0",u,p,h,d,g,m,f,_,v,S,M,E,b,x,y,A,R,C,L,N,D,B,z,U,X,G,K,Z,at,Rt,Y,it;return u=p=h=m=f=_=v=S=M=0,d=g=1,n.svg=!!(t.getCTM&&bp(t)),l.translate&&((l.translate!=="none"||l.scale!=="none"||l.rotate!=="none")&&(i[De]=(l.translate!=="none"?"translate3d("+(l.translate+" 0 0").split(" ").slice(0,3).join(", ")+") ":"")+(l.rotate!=="none"?"rotate("+l.rotate+") ":"")+(l.scale!=="none"?"scale("+l.scale.split(" ").join(",")+") ":"")+(l[De]!=="none"?l[De]:"")),i.scale=i.rotate=i.translate="none"),x=Lu(t,n.svg),n.svg&&(n.uncache?(X=t.getBBox(),c=n.xOrigin-X.x+"px "+(n.yOrigin-X.y)+"px",U=""):U=!e&&t.getAttribute("data-svg-origin"),Uc(t,U||c,!!U||n.originIsAbsolute,n.smooth!==!1,x)),E=n.xOrigin||0,b=n.yOrigin||0,x!==Jr&&(C=x[0],L=x[1],N=x[2],D=x[3],u=B=x[4],p=z=x[5],x.length===6?(d=Math.sqrt(C*C+L*L),g=Math.sqrt(D*D+N*N),m=C||L?Ds(L,C)*ss:0,v=N||D?Ds(N,D)*ss+m:0,v&&(g*=Math.abs(Math.cos(v*Hs))),n.svg&&(u-=E-(E*C+b*N),p-=b-(E*L+b*D))):(it=x[6],Rt=x[7],K=x[8],Z=x[9],at=x[10],Y=x[11],u=x[12],p=x[13],h=x[14],y=Ds(it,at),f=y*ss,y&&(A=Math.cos(-y),R=Math.sin(-y),U=B*A+K*R,X=z*A+Z*R,G=it*A+at*R,K=B*-R+K*A,Z=z*-R+Z*A,at=it*-R+at*A,Y=Rt*-R+Y*A,B=U,z=X,it=G),y=Ds(-N,at),_=y*ss,y&&(A=Math.cos(-y),R=Math.sin(-y),U=C*A-K*R,X=L*A-Z*R,G=N*A-at*R,Y=D*R+Y*A,C=U,L=X,N=G),y=Ds(L,C),m=y*ss,y&&(A=Math.cos(y),R=Math.sin(y),U=C*A+L*R,X=B*A+z*R,L=L*A-C*R,z=z*A-B*R,C=U,B=X),f&&Math.abs(f)+Math.abs(m)>359.9&&(f=m=0,_=180-_),d=Ue(Math.sqrt(C*C+L*L+N*N)),g=Ue(Math.sqrt(z*z+it*it)),y=Ds(B,z),v=Math.abs(y)>2e-4?y*ss:0,M=Y?1/(Y<0?-Y:Y):0),n.svg&&(U=t.getAttribute("transform"),n.forceCSS=t.setAttribute("transform","")||!Tp(An(t,De)),U&&t.setAttribute("transform",U))),Math.abs(v)>90&&Math.abs(v)<270&&(r?(d*=-1,v+=m<=0?180:-180,m+=m<=0?180:-180):(g*=-1,v+=v<=0?180:-180)),e=e||n.uncache,n.x=u-((n.xPercent=u&&(!e&&n.xPercent||(Math.round(t.offsetWidth/2)===Math.round(-u)?-50:0)))?t.offsetWidth*n.xPercent/100:0)+a,n.y=p-((n.yPercent=p&&(!e&&n.yPercent||(Math.round(t.offsetHeight/2)===Math.round(-p)?-50:0)))?t.offsetHeight*n.yPercent/100:0)+a,n.z=h+a,n.scaleX=Ue(d),n.scaleY=Ue(g),n.rotation=Ue(m)+o,n.rotationX=Ue(f)+o,n.rotationY=Ue(_)+o,n.skewX=v+o,n.skewY=S+o,n.transformPerspective=M+a,(n.zOrigin=parseFloat(c.split(" ")[2])||!e&&n.zOrigin||0)&&(i[xn]=So(c)),n.xOffset=n.yOffset=0,n.force3D=Rn.force3D,n.renderTransform=n.svg?Fy:Sp?wp:Oy,n.uncache=0,n},So=function(t){return(t=t.split(" "))[0]+" "+t[1]},Rl=function(t,e,n){var i=sn(e);return Ue(parseFloat(e)+parseFloat(Yi(t,"x",n+"px",i)))+i},Oy=function(t,e){e.z="0px",e.rotationY=e.rotationX="0deg",e.force3D=0,wp(t,e)},ns="0deg",vr="0px",is=") ",wp=function(t,e){var n=e||this,i=n.xPercent,r=n.yPercent,a=n.x,o=n.y,l=n.z,c=n.rotation,u=n.rotationY,p=n.rotationX,h=n.skewX,d=n.skewY,g=n.scaleX,m=n.scaleY,f=n.transformPerspective,_=n.force3D,v=n.target,S=n.zOrigin,M="",E=_==="auto"&&t&&t!==1||_===!0;if(S&&(p!==ns||u!==ns)){var b=parseFloat(u)*Hs,x=Math.sin(b),y=Math.cos(b),A;b=parseFloat(p)*Hs,A=Math.cos(b),a=Rl(v,a,x*A*-S),o=Rl(v,o,-Math.sin(b)*-S),l=Rl(v,l,y*A*-S+S)}f!==vr&&(M+="perspective("+f+is),(i||r)&&(M+="translate("+i+"%, "+r+"%) "),(E||a!==vr||o!==vr||l!==vr)&&(M+=l!==vr||E?"translate3d("+a+", "+o+", "+l+") ":"translate("+a+", "+o+is),c!==ns&&(M+="rotate("+c+is),u!==ns&&(M+="rotateY("+u+is),p!==ns&&(M+="rotateX("+p+is),(h!==ns||d!==ns)&&(M+="skew("+h+", "+d+is),(g!==1||m!==1)&&(M+="scale("+g+", "+m+is),v.style[De]=M||"translate(0, 0)"},Fy=function(t,e){var n=e||this,i=n.xPercent,r=n.yPercent,a=n.x,o=n.y,l=n.rotation,c=n.skewX,u=n.skewY,p=n.scaleX,h=n.scaleY,d=n.target,g=n.xOrigin,m=n.yOrigin,f=n.xOffset,_=n.yOffset,v=n.forceCSS,S=parseFloat(a),M=parseFloat(o),E,b,x,y,A;l=parseFloat(l),c=parseFloat(c),u=parseFloat(u),u&&(u=parseFloat(u),c+=u,l+=u),l||c?(l*=Hs,c*=Hs,E=Math.cos(l)*p,b=Math.sin(l)*p,x=Math.sin(l-c)*-h,y=Math.cos(l-c)*h,c&&(u*=Hs,A=Math.tan(c-u),A=Math.sqrt(1+A*A),x*=A,y*=A,u&&(A=Math.tan(u),A=Math.sqrt(1+A*A),E*=A,b*=A)),E=Ue(E),b=Ue(b),x=Ue(x),y=Ue(y)):(E=p,y=h,b=x=0),(S&&!~(a+"").indexOf("px")||M&&!~(o+"").indexOf("px"))&&(S=Yi(d,"x",a,"px"),M=Yi(d,"y",o,"px")),(g||m||f||_)&&(S=Ue(S+g-(g*E+m*x)+f),M=Ue(M+m-(g*b+m*y)+_)),(i||r)&&(A=d.getBBox(),S=Ue(S+i/100*A.width),M=Ue(M+r/100*A.height)),A="matrix("+E+","+b+","+x+","+y+","+S+","+M+")",d.setAttribute("transform",A),v&&(d.style[De]=A)},By=function(t,e,n,i,r){var a=360,o=Ze(r),l=parseFloat(r)*(o&&~r.indexOf("rad")?ss:1),c=l-i,u=i+c+"deg",p,h;return o&&(p=r.split("_")[1],p==="short"&&(c%=a,c!==c%(a/2)&&(c+=c<0?a:-a)),p==="cw"&&c<0?c=(c+a*xf)%a-~~(c/a)*a:p==="ccw"&&c>0&&(c=(c-a*xf)%a-~~(c/a)*a)),t._pt=h=new gn(t._pt,e,n,i,c,My),h.e=u,h.u="deg",t._props.push(n),h},Tf=function(t,e){for(var n in e)t[n]=e[n];return t},zy=function(t,e,n){var i=Tf({},n._gsap),r="perspective,force3D,transformOrigin,svgOrigin",a=n.style,o,l,c,u,p,h,d,g;i.svg?(c=n.getAttribute("transform"),n.setAttribute("transform",""),a[De]=e,o=Qr(n,1),qi(n,De),n.setAttribute("transform",c)):(c=getComputedStyle(n)[De],a[De]=e,o=Qr(n,1),a[De]=c);for(l in Ei)c=i[l],u=o[l],c!==u&&r.indexOf(l)<0&&(d=sn(c),g=sn(u),p=d!==g?Yi(n,l,c,g):parseFloat(c),h=parseFloat(u),t._pt=new gn(t._pt,o,l,p,h-p,Lc),t._pt.u=g||0,t._props.push(l));Tf(o,i)};_n("padding,margin,Width,Radius",function(s,t){var e="Top",n="Right",i="Bottom",r="Left",a=(t<3?[e,n,i,r]:[e+r,e+n,i+n,i+r]).map(function(o){return t<2?s+o:"border"+o+s});Mo[t>1?"border"+s:s]=function(o,l,c,u,p){var h,d;if(arguments.length<4)return h=a.map(function(g){return gi(o,g,c)}),d=h.join(" "),d.split(h[0]).length===5?h[0]:d;h=(u+"").split(" "),d={},a.forEach(function(g,m){return d[g]=h[m]=h[m]||h[(m-1)/2|0]}),o.init(l,d,p)}});var Ap={name:"css",register:Ic,targetTest:function(t){return t.style&&t.nodeType},init:function(t,e,n,i,r){var a=this._props,o=t.style,l=n.vars.startAt,c,u,p,h,d,g,m,f,_,v,S,M,E,b,x,y,A;Cu||Ic(),this.styles=this.styles||Mp(t),y=this.styles.props,this.tween=n;for(m in e)if(m!=="autoRound"&&(u=e[m],!(bn[m]&&up(m,e,n,i,t,r)))){if(d=typeof u,g=Mo[m],d==="function"&&(u=u.call(n,i,t,r),d=typeof u),d==="string"&&~u.indexOf("random(")&&(u=Yr(u)),g)g(this,t,m,u,n)&&(x=1);else if(m.substr(0,2)==="--")c=(getComputedStyle(t).getPropertyValue(m)+"").trim(),u+="",Vi.lastIndex=0,Vi.test(c)||(f=sn(c),_=sn(u),_?f!==_&&(c=Yi(t,m,c,_)+_):f&&(u+=f)),this.add(o,"setProperty",c,u,i,r,0,0,m),a.push(m),y.push(m,0,o[m]);else if(d!=="undefined"){if(l&&m in l?(c=typeof l[m]=="function"?l[m].call(n,i,t,r):l[m],Ze(c)&&~c.indexOf("random(")&&(c=Yr(c)),sn(c+"")||c==="auto"||(c+=Rn.units[m]||sn(gi(t,m))||""),(c+"").charAt(1)==="="&&(c=gi(t,m))):c=gi(t,m),h=parseFloat(c),v=d==="string"&&u.charAt(1)==="="&&u.substr(0,2),v&&(u=u.substr(2)),p=parseFloat(u),m in ii&&(m==="autoAlpha"&&(h===1&&gi(t,"visibility")==="hidden"&&p&&(h=0),y.push("visibility",0,o.visibility),zi(this,o,"visibility",h?"inherit":"hidden",p?"inherit":"hidden",!p)),m!=="scale"&&m!=="transform"&&(m=ii[m],~m.indexOf(",")&&(m=m.split(",")[0]))),S=m in Ei,S){if(this.styles.save(m),A=u,d==="string"&&u.substring(0,6)==="var(--"){if(u=An(t,u.substring(4,u.indexOf(")"))),u.substring(0,5)==="calc("){var R=t.style.perspective;t.style.perspective=u,u=An(t,"perspective"),R?t.style.perspective=R:qi(t,"perspective")}p=parseFloat(u)}if(M||(E=t._gsap,E.renderTransform&&!e.parseTransform||Qr(t,e.parseTransform),b=e.smoothOrigin!==!1&&E.smooth,M=this._pt=new gn(this._pt,o,De,0,1,E.renderTransform,E,0,-1),M.dep=1),m==="scale")this._pt=new gn(this._pt,E,"scaleY",E.scaleY,(v?ks(E.scaleY,v+p):p)-E.scaleY||0,Lc),this._pt.u=0,a.push("scaleY",m),m+="X";else if(m==="transformOrigin"){y.push(xn,0,o[xn]),u=Iy(u),E.svg?Uc(t,u,0,b,0,this):(_=parseFloat(u.split(" ")[2])||0,_!==E.zOrigin&&zi(this,E,"zOrigin",E.zOrigin,_),zi(this,o,m,So(c),So(u)));continue}else if(m==="svgOrigin"){Uc(t,u,1,b,0,this);continue}else if(m in Ep){By(this,E,m,h,v?ks(h,v+u):u);continue}else if(m==="smoothOrigin"){zi(this,E,"smooth",E.smooth,u);continue}else if(m==="force3D"){E[m]=u;continue}else if(m==="transform"){zy(this,u,t);continue}}else m in o||(m=tr(m)||m);if(S||(p||p===0)&&(h||h===0)&&!vy.test(u)&&m in o)f=(c+"").substr((h+"").length),p||(p=0),_=sn(u)||(m in Rn.units?Rn.units[m]:f),f!==_&&(h=Yi(t,m,c,_)),this._pt=new gn(this._pt,S?E:o,m,h,(v?ks(h,v+p):p)-h,!S&&(_==="px"||m==="zIndex")&&e.autoRound!==!1?by:Lc),this._pt.u=_||0,S&&A!==u?(this._pt.b=c,this._pt.e=A,this._pt.r=yy):f!==_&&_!=="%"&&(this._pt.b=c,this._pt.r=Sy);else if(m in o)Ny.call(this,t,m,c,v?v+u:u);else if(m in t)this.add(t,m,c||t[m],v?v+u:u,i,r);else if(m!=="parseTransform"){vu(m,u);continue}S||(m in o?y.push(m,0,o[m]):typeof t[m]=="function"?y.push(m,2,t[m]()):y.push(m,1,c||t[m])),a.push(m)}}x&&mp(this)},render:function(t,e){if(e.tween._time||!Pu())for(var n=e._pt;n;)n.r(t,n.d),n=n._next;else e.styles.revert()},get:gi,aliases:ii,getSetter:function(t,e,n){var i=ii[e];return i&&i.indexOf(",")<0&&(e=i),e in Ei&&e!==xn&&(t._gsap.x||gi(t,"x"))?n&&gf===n?e==="scale"?Ay:wy:(gf=n||{})&&(e==="scale"?Ry:Cy):t.style&&!_u(t.style[e])?Ey:~e.indexOf("-")?Ty:Au(t,e)},core:{_removeProperty:qi,_getMatrix:Lu}};vn.utils.checkPrefix=tr;vn.core.getStyleSaver=Mp;(function(s,t,e,n){var i=_n(s+","+t+","+e,function(r){Ei[r]=1});_n(t,function(r){Rn.units[r]="deg",Ep[r]=1}),ii[i[13]]=s+","+t,_n(n,function(r){var a=r.split(":");ii[a[1]]=i[a[0]]})})("x,y,z,scale,scaleX,scaleY,xPercent,yPercent","rotation,rotationX,rotationY,skewX,skewY","transform,transformOrigin,svgOrigin,force3D,smoothOrigin,transformPerspective","0:translateX,1:translateY,2:translateZ,8:rotate,8:rotationZ,8:rotateZ,9:rotateX,10:rotateY");_n("x,y,z,top,right,bottom,left,width,height,fontSize,padding,margin,perspective",function(s){Rn.units[s]="px"});vn.registerPlugin(Ap);var eo=vn.registerPlugin(Ap)||vn;eo.core.Tween;const ky=["category","file","algorithm"],Gy=["file","algorithm","reference"],Hy={category:"#469b8e",file:"#527bb8",algorithm:"#49a79b",reference:"#9675b6"};function no(s,t,e,n,i){const r=Math.floor(s/e),a=Math.min(e,t-r*e);return[(s%e-(a-1)/2)*n,(Math.ceil(t/e)-1)*i/2-r*i]}function Vy(s,t,e){if(s.kind==="category")return[47,47,16];if(s.kind==="reference")return[32,35,26];const n=Math.log1p(s.total||0)/Math.log1p(e);if(s.kind==="file")return[44,30,t?6+24*n:15];const i=t?22+34*n:35;return[i,i,i]}function Wy(s,t,e,n,i){if(s.kind==="category")return no(t,e,2,n?116:169,n?65:100);if(s.kind==="file")return no(t,e,i,n?117:133,n?77:102);if(e>15)return no(t,e,i,84,77);if(t===0)return[0,0];const r=(t-1)*2*Math.PI/Math.max(e-1,1)-Math.PI/2;return[(n?99:158)*Math.cos(r),98*Math.sin(r)]}function Xy(s,t,e=!1){const n=t==="atlas",i=n?300:250,r=s.nodes,a=r.reduce((h,d)=>Math.max(h,d.total||0),1),o=(n?ky:Gy).map((h,d)=>{const g=r.filter(v=>v.kind===h);n||g.sort((v,S)=>(v.y||0)-(S.y||0)||(v.x||0)-(S.x||0));const m=n&&h==="file"?Math.max(1,Math.min(e?2:4,Math.ceil(g.length/2))):Math.max(2,Math.ceil(Math.sqrt(g.length*1.35)));let f=n?e?264:420:Math.max(310,m*120+36),_=n?e?250:323:Math.max(215,Math.ceil(g.length/m)*83+44);return n&&s.expanded&&h==="file"&&(e||(f=Math.max(f,(m-1)*133+120)),_=Math.max(_,Math.ceil(g.length/m)*(e?77:102)+38)),n&&h==="algorithm"&&g.length>15&&(f=Math.max(f,m*84+24),_=Math.max(_,Math.ceil(g.length/m)*77+36)),{kind:h,index:d,depth:(1-d)*i,width:f,height:_,data:g,columns:m}}).filter(h=>!n||h.kind!=="file"||!!s.expanded),l=Math.max(...o.map(h=>h.width)),c=new Map;for(const h of o){const d=e?l*.1:Math.max(n?218:175,l*.42);h.center=new I((h.index-1)*d,0,h.depth),h.data.forEach((g,m)=>{const f=n?Wy(g,m,h.data.length,e,h.columns):no(m,h.data.length,h.columns,120,83),_=h.center.clone().add(new I(f[0],f[1],0)),v=Vy(g,n,a),S=n&&g.kind==="algorithm"?Ip(g.label):Hy[g.kind];c.set(g.id,{...g,position:_,size:v,tint:S,layer:h.index})})}const u=(s.branches||[]).map(h=>({...h,id:"branch:"+h.target,branch:!0,status:"pending",color:"#28ad91"})),p=[...s.links,...u].flatMap(h=>{const d=c.get(h.source),g=c.get(h.target);if(!d||!g)return[];const m=h.branch?1.5:h.band??If(h.value||1,s.peak||10,h.status);return[{...h,from:d,to:g,band:m,curve:qy(d,g)}]});return{layers:o,nodes:c,links:p,peak:a}}function qy(s,t){const e=s.position.clone(),n=t.position.clone(),i=Math.sign(n.z-e.z);e.z+=(i||1)*s.size[2]*.44,n.z+=(-i||1)*t.size[2]*.44;const r=(e.z+n.z)/2+(i?0:62);return new od(e,new I(e.x,e.y,r),new I(n.x,n.y,r),n)}function wf(s,t){const e=new Set(t?[t]:[]),n=new Set;if(!t)return{nodes:e,edges:n};const i=new Set(s.links.filter(r=>r.branch&&r.source===t).map(r=>r.target));for(const r of s.links)(r.source===t||r.target===t||i.has(r.source))&&(n.add(r.id),e.add(r.source),e.add(r.target));for(const r of s.links)r.branch&&e.has(r.target)&&(n.add(r.id),e.add(r.source));return{nodes:e,edges:n}}const ki=4,Yy=new I,Zy=[-1,1].flatMap(s=>[-1,1].flatMap(t=>[-1,1].map(e=>[s,t,e]))),Ky=[[0,0],...[20,38,58,78].flatMap(s=>[[0,s],[0,-s],[s,0],[-s,0],[s,s*.67],[-s,s*.67],[s,-s*.67],[-s,-s*.67],[s,s*.4],[-s,s*.4],[s,-s*.4],[-s,-s*.4]])];function rs(s,t){return s.left<t.right&&s.right>t.left&&s.top<t.bottom&&s.bottom>t.top}function Af(s,t,e,n=new Map,i=new qn){const r=new I,a=new I(0,0,1).applyQuaternion(i);function o(){return r.project(s),{x:(r.x+1)*t/2,y:(1-r.y)*e/2,z:r.z}}function l(d,g,m,f,_=0,v){return r.set(d,g,m),n.has(f)&&r.applyMatrix4(n.get(f).matrix),r.addScaledVector(a,_),v&&r.add(v),o()}function c(d,g){const m=d.size[2]*.55;return l(g.x,g.y,g.z,d.layer,m)}function u(d,g,m){m.copy(g).applyMatrix4(n.get(d.layer).matrix).addScaledVector(a,d.size[2]*.55)}function p(d,g){const[m,f,_]=d.size,v=r.copy(g);n.has(d.layer)&&v.applyMatrix4(n.get(d.layer).matrix);const S=v.x,M=v.y,E=v.z,b={left:1/0,top:1/0,right:-1/0,bottom:-1/0};for(const[x,y,A]of Zy){r.set(x*m/2,y*f/2,A*_/2).applyQuaternion(i),r.x+=S,r.y+=M,r.z+=E;const R=o();b.left=Math.min(b.left,R.x),b.right=Math.max(b.right,R.x),b.top=Math.min(b.top,R.y),b.bottom=Math.max(b.bottom,R.y)}return b}function h(d,g,m,f){const _=d/t*2-1,v=1-g/e*2,S=new I(_,v,-1).unproject(s),M=new I(_,v,1).unproject(s);if(n.has(f)){const{inverse:b}=n.get(f);S.applyMatrix4(b),M.applyMatrix4(b)}if(M.sub(S),Math.abs(M.z)<1e-7)return null;const E=(m-S.z)/M.z;return E>=0&&E<=1?S.addScaledVector(M,E):null}return{point:l,label:c,placeLabel:u,body:p,world:h,width:t,height:e}}function Oc(s,t,e,n){return{left:s-e/2-2,right:s+e/2+2,top:t-n/2-2,bottom:t+n/2+2}}function Rp(s,t,{w:e,h:n}){const i=Math.max(15,t.bottom-s.y+n/2+ki),r=Math.min(-15,t.top-s.y-n/2-ki),a=t.left-s.x-e/2-ki-2,o=t.right-s.x+e/2+ki+2;return[[0,i],[0,r],[a,0],[o,0],[24,r],[-24,r],[26,i],[-26,i],[0,i+17],[0,r-17],[a,20],[o,20],[a,-20],[o,-20],[52,i],[-52,i],[52,r],[-52,r],[0,i+37],[0,r-37]]}function Cp(s,{w:t},e){const n=[t/2+7,e-t/2-7].sort((i,r)=>Math.abs(i-s.x)-Math.abs(r-s.x));return[...[66,88,112,142,174].flatMap(i=>[[0,i],[0,-i],[i,0],[-i,0],[i*.6,i*.8],[-i*.6,i*.8],[i*.6,-i*.8],[-i*.6,-i*.8]]),...[0,24,-24,46,-46,70,-70,94,-94,118,-118].flatMap(i=>n.filter(r=>Math.hypot(r-s.x,i)<162).map(r=>[r-s.x,i]))]}function yo(s,t,e,n=0){return s.left>=3&&s.right<=t-3&&s.top>=n&&s.bottom<=e-3}function Cl(s){return s.reduce((t,e,n)=>{const i=s[(n+1)%s.length];return t+e.x*i.y-e.y*i.x},0)/2}function Rf(s,t){for(let e=0;e<t.length&&s.length;e++){const n=t[e],i=t[(e+1)%t.length],r=c=>(i.x-n.x)*(c.y-n.y)-(i.y-n.y)*(c.x-n.x),a=[];let o=s.at(-1),l=r(o);for(const c of s){const u=r(c);if(l>=0!=u>=0){const p=l/(l-u);a.push({x:o.x+(c.x-o.x)*p,y:o.y+(c.y-o.y)*p})}u>=0&&a.push(c),o=c,l=u}s=a}return s}function $y(s,t){const{width:e,height:n}=t,i=[{x:0,y:0},{x:e,y:0},{x:e,y:n},{x:0,y:n}],r=s.filter(u=>u.data.length).flatMap(u=>{const{x:p,y:h,z:d}=u.center,g=t.point(p,h,d,u.index);if(g.z<-1||g.z>1)return[];function m(_){const v=[[-1,1],[1,1],[1,-1],[-1,-1]].map(([E,b])=>t.point(p+E*u.width*.38,h+b*u.height*.38,d,u.index,0,_)),S=Cl(v);if(Math.abs(S)<1||v.some(E=>E.z<-1||E.z>1))return{area:0,visible:0,polygon:[]};S<0&&v.reverse();const M=Rf(v,i);return{area:Math.abs(S),visible:Math.abs(Cl(M)),polygon:M}}const f=m();return f.visible>=1?[{layer:u,at:g,measure:m,home:f}]:[]}),a=(u,p)=>Math.abs(Cl(Rf(u.polygon,p.polygon)))/Math.max(1,Math.min(u.area,p.area));function o(u){let p=0;for(const[h,d]of u.entries()){p+=d.cost;for(const g of u.slice(h+1))p+=Math.max(0,a(d.shape,g.shape)-.16)}return p}let l=r.map(u=>({shape:u.home,cost:0})),c=o(l);if(!c)return new Map;for(const u of["x","y"]){let g=function(m){if(m.length===d.length){const f=o(m);f<c-1e-6&&(l=m,c=f);return}for(const f of d[m.length])(!m.length||f.at>=m.at(-1).at-2)&&g([...m,f])};const p=Math.min(96,(u==="x"?e:n)*.17),d=r.slice().sort((m,f)=>m.at[u]-f.at[u]).map(m=>{var _;const f=[{board:m,shape:m.home,at:m.at[u],cost:0}];for(const v of[-1,-.5,.5,1]){const S={...m.at,[u]:m.at[u]+p*v},M=(_=t.world(S.x,S.y,m.layer.depth))==null?void 0:_.sub(m.layer.center);if(!M)continue;M.z=0,M.clampLength(0,Math.min(110,m.layer.width*.35));const E=m.measure(M);if(E.visible<m.home.visible*.93)continue;const{x:b,y:x,z:y}=m.layer.center,A=t.point(b,x,y,m.layer.index,0,M)[u];f.push({board:m,shape:E,offset:M,at:A,cost:M.length()*55e-5})}return f});g([])}return new Map(l.filter(u=>u.offset).map(u=>[u.board.layer.index,u.offset]))}function Jy(s,t,e,n,i){const r=new Map,a=new Map,o=[],l=[],{width:c,height:u}=t,p=new Map(s.layers.map(m=>[m.index,m])),h=m=>(m.row?200:0)+(e.nodes.has(m.id)?120:0)+(m.group?28:0),d=[...s.nodes.values()].sort((m,f)=>h(f)-h(m)),g=c<620;for(const m of d){const f=m.position,_=t.point(f.x,f.y,f.z,m.layer);if(_.z<-1||_.z>1||_.x<-18||_.x>c+18||_.y<-18||_.y>u+18)continue;const v=p.get(m.layer),[S,M]=m.size,E=m.row?107:68;let b=null;const x=n==="atlas"&&m.row,y=x?i(m,g,n):null;for(const[R,C]of Ky){const L=R||C?t.world(_.x+R,_.y+C,f.z,m.layer):f;if(!L||(L.z=f.z,L.distanceToSquared(f)>E*E||Math.abs(L.x-v.center.x)+S/2>v.width/2||Math.abs(L.y-v.center.y)+M/2>v.height/2))continue;const N=t.body(m,L),D={left:N.left-ki,right:N.right+ki,top:N.top-ki,bottom:N.bottom+ki};if(!yo(D,c,u,0)||o.some(G=>rs(G,D))||l.some(G=>rs(G,D)))continue;if(b||(b={pos:L,body:N}),!x)break;const B=t.label(m,L),z=y,X=[...Rp(B,N,z),...Cp(B,z,c)].find(([G,K])=>{const Z=Oc(B.x+G,B.y+K,z.w,z.h);return!yo(Z,c,u,43)||rs(Z,N)||o.some(at=>rs(at,Z))||l.some(at=>rs(at,Z))?!1:(l.push(Z),!0)});if(X){a.set(m.id,X),b={pos:L,body:N};break}}const A=(b==null?void 0:b.pos)||f;if(o.push((b==null?void 0:b.body)||t.body(m,f)),A!==f){const R=A.clone().sub(f);R.distanceToSquared(Yy)>.02&&r.set(m.id,R)}}return{offsets:r,hints:a}}function Qy(s,t){const e=new Map,n=new Map,i=document.createElement("canvas").getContext("2d"),r=getComputedStyle(document.documentElement).getPropertyValue("--font-sans").trim()||"sans-serif";let a="";function o(h){const d=h.map(m=>m.id).join(`
`);if(d===a)return!1;a=d;const g=new Set(h.map(m=>m.id));for(const[m,f]of e)g.has(m)||(f.anchor.removeFromParent(),e.delete(m));for(const m of h)if(!e.has(m.id)){const f=document.createElement("div");f.className="spatial-anchor";const _=new uS(f);s.add(_),e.set(m.id,{node:m,target:f,anchor:_})}return t(h.map(m=>e.get(m.id))),!0}function l(h,d,g){var A;const m=g+":"+Number(d)+":"+h.id,f=(A=e.get(h.id))==null?void 0:A.target.firstElementChild;if(f!=null&&f.offsetWidth){const R={w:f.offsetWidth,h:f.offsetHeight};return n.set(m,R),R}if(n.has(m))return n.get(m);const _=g==="atlas"?h.label:h.title||h.label,v=h.kind==="algorithm"?d?68:70:d?92:112,S=d?10.5:12;i.font="650 "+S+"px "+r;const M=i.measureText(_).width,E=Math.max(43,Math.min(v,M+14)),b=Math.max(1,Math.ceil(M/(v-13))),x=(g==="atlas"?b:Math.min(b,2))*S*1.18+22,y={w:E,h:x};return n.set(m,y),y}function c(h,d,g,m){const f=[];for(const _ of h.nodes.values()){if(m!==null&&m!==_.layer)continue;const v=g.get(_.id)||_.position,S=d.point(v.x,v.y,v.z,_.layer);S.z<-1||S.z>1||S.x<-90||S.x>d.width+90||S.y<-90||S.y>d.height+90||f.push(d.body(_,v))}return f}function u({layout:h,projection:d,positions:g,review:m,focus:f,near:_,progress:v,variant:S,bodies:M,hints:E}){const{width:b,height:x}=d,y=b<620,A=f.size>0,R=[],C=[...M];for(const B of h.nodes.values()){if(m!==null&&B.layer!==m||B.parent&&v<.72)continue;const z=f.has(B.id);if(S!=="atlas"&&!_&&h.nodes.size>72&&!z)continue;const U=g.get(B.id)||B.position,X=d.label(B,U);if(X.z<-1||X.z>1)continue;const G=l(B,y,S),K=(B.row?3500:0)+(z?3e3:0)+(B.group?500:0)+Math.log1p(B.total||0)*4-Math.abs(X.x-b/2)*.022-Math.abs(X.y-x/2)*.022;R.push({node:B,priority:K,anchor:X,metrics:G,position:U})}R.sort((B,z)=>z.priority-B.priority);const L=[],N=new Map;for(const{node:B,anchor:z,metrics:U,position:X,priority:G}of R){const K=e.get(B.id),Z=U,at=Rp(z,d.body(B,X),Z);K!=null&&K.goal&&at.unshift(K.goal),E.has(B.id)&&at.unshift(E.get(B.id)),B.row&&at.push(...Cp(z,Z,b));const Rt=at.find(([Y,it])=>{const St=Oc(z.x+Y,z.y+it,Z.w,Z.h);return!yo(St,b,x,42)||C.some(Ct=>rs(Ct,St))?!1:(C.push(St),!0)});if(Rt&&(L.push(B),N.set(B.id,{goal:Rt,metrics:U,priority:G}),L.length>=(y?40:100)))break}L.sort((B,z)=>B.layer-z.layer||z.position.y-B.position.y||B.position.x-z.position.x);const D=o(L);for(const B of e.values())Object.assign(B,N.get(B.node.id)),B.offset||(B.offset=[...B.goal]),B.target.classList.toggle("dimmed",A&&!f.has(B.node.id));return D}function p({projection:h,positions:d,step:g,bodies:m}){var E;let f=!1,_=0;const{width:v,height:S}=h,M=[...m];for(const b of[...e.values()].sort((x,y)=>y.priority-x.priority)){const{node:x,anchor:y,target:A,goal:R,offset:C}=b;for(const U of[0,1]){const X=R[U]-C[U];Math.abs(X)>.28&&g<1?(C[U]+=X*g,f=!0):C[U]=R[U]}const L=d.get(x.id)||x.position;h.placeLabel(x,L,y.position),A.style.setProperty("--label-shift-x",C[0]+"px"),A.style.setProperty("--label-shift-y",C[1]+"px");const N=h.label(x,L);!b.measured&&((E=A.firstElementChild)!=null&&E.offsetWidth)&&(b.measured=!0,b.metrics={w:A.firstElementChild.offsetWidth,h:A.firstElementChild.offsetHeight});const D=b.metrics,B=Oc(N.x+C[0],N.y+C[1],D.w,D.h),z=N.z>=-1&&N.z<=1&&yo(B,v,S,42)&&M.every(U=>!rs(U,B));if(A.style.visibility=z?"visible":"hidden",z){M.push(B),_++;const[U,X]=C,G=Math.hypot(U,X),K=Math.min(D.w/2/Math.abs(U),D.h/2/Math.abs(X)),Z=G>0?G*(1-K):0;A.classList.toggle("leader",Z>22),Z>22&&(A.style.setProperty("--label-leader-length",Z+"px"),A.style.setProperty("--label-leader-angle",Math.atan2(X,U)+"rad"))}}return{moving:f,visible:_}}return{size:l,bodyBoxes:c,update:u,move:p,clear:()=>{n.clear(),o([])},live:e}}const jy=new I(.68,.85,1).normalize(),tb=new I(.11,1.12,1).normalize(),eb=new I(.32,.34,1).normalize(),Cf=new I(0,0,1),Pf=new I(0,1,0),Pp=35,nb=38*Math.PI/180,ib=26*Math.PI/180;function Dp(s,t){const e=Math.hypot(t.x,t.z),n=e?nb*t.x/e:0;return s.set(-ib*t.y,n,0,"YXZ")}function sb(s,t,e){return Math.max(Math.abs(s.x-t.x),Math.abs(s.y-t.y))<=.004||e===1/0?(s.copy(t),!1):(s.x=gc.damp(s.x,t.x,1/.09,e/1e3),s.y=gc.damp(s.y,t.y,1/.09,e/1e3),!0)}function Df(s,t,e){return new Map(s.map(({index:n,center:i})=>{const r=i.clone().applyQuaternion(t).negate().add(i),a=e.get(n);a&&r.add(a);const o=new ae().makeRotationFromQuaternion(t).setPosition(r);return[n,{matrix:o,inverse:o.clone().invert()}]}))}function rb(s=220){let t=null;return{touch(e){t=e+s},wait(e){return t===null?null:Math.max(0,t-e)},take(e){return t===null||e<t?!1:(t=null,!0)},get pending(){return t!==null}}}function ab(s,{aspect:t,variant:e,review:n,focus:i,compact:r=!1}){const a=s.layers.find(A=>A.index===n),o=a?Cf:r?tb:e==="atlas"?eb:jy,l=Pf.clone().cross(o).normalize(),c=o.clone().cross(l),u=Dp(new Yn,o),p=new I(1,0,0).applyEuler(u),h=Pf.clone().applyEuler(u),d=Cf.clone().applyEuler(u),g=(a?[a]:s.layers).flatMap(({center:A,width:R,height:C})=>[-1,1].flatMap(L=>[-1,1].map(N=>A.clone().addScaledVector(p,L*R/2).addScaledVector(h,N*C/2).addScaledVector(d,18)))),m=new yi().setFromPoints(g),f=m.getCenter(new I),_=i.map(A=>s.nodes.get(A)).filter(Boolean),v=_.length&&n===null?_.flatMap(A=>{const[R,C,L]=A.size,N=s.layers.find(B=>B.index===A.layer).center,D=N.clone().addScaledVector(p,A.position.x-N.x).addScaledVector(h,A.position.y-N.y);return[-1,1].map(B=>D.clone().addScaledVector(l,B*(R/2+36)).addScaledVector(c,B*(C/2+40)).addScaledVector(o,B*L/2))}):g,S=new yi().setFromPoints(v).getCenter(new I),M=Math.tan(Pp*Math.PI/360),E=r?.81:.86,b=(A,R)=>A.reduce((C,L)=>{const N=L.clone().sub(R),D=Math.max(Math.abs(N.dot(l))/t,Math.abs(N.dot(c)));return Math.max(C,D/(M*E)+N.dot(o))},1),x=b(g,f);let y=Math.max(b(v,S),_.length&&n===null?x*.46:100);if(a){const A=Math.max(m.max.y-m.min.y,(m.max.x-m.min.x)/t)/E;return y=Math.max(1400,x),{target:f,position:f.clone().addScaledVector(o,y),orthoHeight:A}}return{target:S,position:S.clone().addScaledVector(o,y),orthoHeight:2*y*M}}const Mr=new I;function Nn(s,t,e,n,i,r){const a=2*Math.PI*i/4,o=Math.max(r-2*i,0),l=Math.PI/4;Mr.copy(t),Mr[n]=0,Mr.normalize();const c=.5*a/(a+o),u=1-Mr.angleTo(s)/l;return Math.sign(Mr[e])===1?u*c:o/(a+o)+c+c*(1-u)}class Oo extends ir{constructor(t=1,e=1,n=1,i=2,r=.1){const a=i*2+1;if(r=Math.min(t/2,e/2,n/2,r),super(1,1,1,a,a,a),this.type="RoundedBoxGeometry",this.parameters={width:t,height:e,depth:n,segments:i,radius:r},a===1)return;const o=this.toNonIndexed();this.index=null,this.attributes.position=o.attributes.position,this.attributes.normal=o.attributes.normal,this.attributes.uv=o.attributes.uv;const l=new I,c=new I,u=new I(t,e,n).divideScalar(2).subScalar(r),p=this.attributes.position.array,h=this.attributes.normal.array,d=this.attributes.uv.array,g=p.length/6,m=new I,f=.5/a;for(let _=0,v=0;_<p.length;_+=3,v+=2)switch(l.fromArray(p,_),c.copy(l),c.x-=Math.sign(c.x)*f,c.y-=Math.sign(c.y)*f,c.z-=Math.sign(c.z)*f,c.normalize(),p[_+0]=u.x*Math.sign(l.x)+c.x*r,p[_+1]=u.y*Math.sign(l.y)+c.y*r,p[_+2]=u.z*Math.sign(l.z)+c.z*r,h[_+0]=c.x,h[_+1]=c.y,h[_+2]=c.z,Math.floor(_/g)){case 0:m.set(1,0,0),d[v+0]=Nn(m,c,"z","y",r,n),d[v+1]=1-Nn(m,c,"y","z",r,e);break;case 1:m.set(-1,0,0),d[v+0]=1-Nn(m,c,"z","y",r,n),d[v+1]=1-Nn(m,c,"y","z",r,e);break;case 2:m.set(0,1,0),d[v+0]=1-Nn(m,c,"x","z",r,t),d[v+1]=Nn(m,c,"z","x",r,n);break;case 3:m.set(0,-1,0),d[v+0]=1-Nn(m,c,"x","z",r,t),d[v+1]=1-Nn(m,c,"z","x",r,n);break;case 4:m.set(0,0,1),d[v+0]=1-Nn(m,c,"x","y",r,t),d[v+1]=1-Nn(m,c,"y","x",r,e);break;case 5:m.set(0,0,-1),d[v+0]=Nn(m,c,"x","y",r,t),d[v+1]=1-Nn(m,c,"y","x",r,e);break}}static fromJSON(t){return new Oo(t.width,t.height,t.depth,t.segments,t.radius)}}const Lf=new I,Lp=s=>s*s*(3-2*s);function Np(s,t,e,n){const i=Lp(t);return s.addScaledVector(e,1-i).addScaledVector(n,i)}function ob(s,t,e){const n=s.getAttribute("position"),i=s.getAttribute("uv"),r=n.array.slice(),a=new Float32Array(n.count),o=new Map;for(let l=0;l<n.count;l++){const c=e?l/(n.count-1):i.getX(l);o.has(c)||o.set(c,Lp(e?c:t.getUtoTmapping(c))),a[l]=o.get(c)}return{from:new I,to:new I,update(l=Lf,c=Lf){if(!(l.equals(this.from)&&c.equals(this.to))){this.from.copy(l),this.to.copy(c);for(let u=0;u<n.count;u++){const p=u*3,h=a[u];n.array[p]=r[p]+l.x+(c.x-l.x)*h,n.array[p+1]=r[p+1]+l.y+(c.y-l.y)*h,n.array[p+2]=r[p+2]+l.z+(c.z-l.z)*h}n.needsUpdate=!0,s.boundingSphere=null,s.boundingBox=null}}}}function bo(s,t,e,n,i=e.position){return s.copy(t).add(i).sub(e.position).applyMatrix4(n.get(e.layer).matrix).sub(t)}function Eo(s){const t=s.getAttribute("position"),e=s.getAttribute("uv");for(let n=0;n<t.count;n++)e.setXY(n,t.getX(n)+.5,t.getY(n)+.5);return s}function lb(){const s=new fd;for(let t=0;t<6;t++){const e=t*Math.PI/3;s[t?"lineTo":"moveTo"](.428*Math.cos(e),.428*Math.sin(e))}return s.closePath(),Eo(new lu(s,{depth:.84,bevelEnabled:!0,bevelThickness:.08,bevelSize:.066,bevelSegments:3}).translate(0,0,-.42))}function cb(){const s=new Oo(1,1,1,3,.18);for(const t of s.groups)t.materialIndex=t.materialIndex===4?0:1;return s}const ub={category:lb,file:cb,algorithm:()=>Eo(new Co(.5,3)),reference:()=>Eo(new cu(.5,1))};function Fc(s){const t=new Set,e=new Set;s.traverse(n=>{n.geometry&&t.add(n.geometry),Array.isArray(n.material)?n.material.forEach(i=>e.add(i)):n.material&&e.add(n.material),n.isInstancedMesh&&n.dispose()});for(const n of t)n.dispose();for(const n of e)n.dispose();s.clear()}function hb(s,t,e){const n=new Oi,{width:i,height:r}=s;n.position.copy(s.center),n.position.z-=1;const a=new Cn(new jr(i,r),new Xs({color:t,side:ti,transparent:!0,opacity:e?.055:.073,depthWrite:!1}));a.renderOrder=-3,n.add(a);const o=i/2,l=r/2,c=[];for(let p=-o+22;p<o;p+=32)c.push(new I(p,-l,0),new I(p,l,0));for(let p=-l+22;p<l;p+=32)c.push(new I(-o,p,0),new I(o,p,0));n.add(new nd(new Ye().setFromPoints(c),new zr({color:t,transparent:!0,opacity:e?.12:.16,depthWrite:!1})));const u=[[-o,-l],[o,-l],[o,l],[-o,l],[-o,-l]];return n.add(new su(new Ye().setFromPoints(u.map(([p,h])=>new I(p,h,0))),new zr({color:t,transparent:!0,opacity:e?.52:.48}))),n}function fb(s,t){return s.status!=="ai_assessed"?new Xs({color:t,transparent:!0,depthWrite:!1}):new hn({transparent:!0,depthWrite:!1,uniforms:{ink:{value:t},opacity:{value:1},time:{value:0}},vertexShader:`
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
      void main() {
        float dash = fract(progress * 17.0 - time);
        if (dash > .66) discard;
        gl_FragColor = vec4(ink, opacity);
      }
    `})}function db(s,t){const e=new Xt(s.color||"#4b846d");t&&e.lerp(new Xt("#bdd4ff"),.2);const n=s.branch||s.status==="pending"||s.label==="关联"||s.status==="legacy",i=n?new su(new Ye().setFromPoints(s.curve.getPoints(36)),new q_({color:e,dashSize:s.branch?13:6,gapSize:s.branch?6:5,transparent:!0,depthWrite:!1})):new Cn(new hu(s.curve,24,s.band/2,5,!1),fb(s,e.clone()));return n&&i.computeLineDistances(),i.userData.edge=s,{edge:s,object:i,color:e,line:n,motion:ob(i.geometry,s.curve,n)}}function pb(s,t,e){const n=[],i=[];for(const a of s.links)(t.has(a.id)||a.branch?n:i).push(a);const r=e?420:180;return i.sort((a,o)=>o.band-a.band),[...n,...i].slice(0,r)}function mb(s,{variant:t,dark:e,textures:n}){const i=new Oi,r=["#3d9b8d","#668ace","#8e71b0"],a=s.layers.map(b=>{const x=hb(b,r[b.index],e),y=new Oi;return y.matrixAutoUpdate=!1,y.add(x),{layer:b,sheet:x,group:y,opacities:x.children.map(A=>A.material.opacity)}});i.add(...a.map(b=>b.group));const o=new Map(a.map(b=>[b.layer.index,b.group])),l=new Oi;i.add(l);const c=new Map,u=new He;for(const b of s.layers){const x=[...s.nodes.values()].filter(D=>D.layer===b.index);if(!x.length)continue;const y=t!=="atlas"&&b.kind==="algorithm"?Eo(new ru(.28,.45,6,16).rotateZ(Math.PI/2)):ub[b.kind](),A=new _l({...n[b.kind]??n.algorithm,color:16777215,metalness:.27,roughness:.86,emissive:2505792,emissiveIntensity:.08}),C=b.kind==="category"||b.kind==="file"?[A,new _l({color:8754334,metalness:.32,roughness:.47})]:A,L=new ul(y,C,x.length),N=new ul(y,new _l({color:16777215,metalness:.08,roughness:.65,transparent:!0,opacity:.17,depthWrite:!1}),x.length);for(const D of[L,N])D.count=0,D.frustumCulled=!1,D.userData.ids=[],o.get(b.index).add(D);c.set(b.index,{nodes:x,active:L,quiet:N})}const p=new Map,h=new Map;if(t==="atlas"){const b=new uu(.68,.014,5,36),x=new Oo(1,1,1,3,.14),y=new c_(x,26);x.dispose();for(const A of s.nodes.values())if(A.kind==="algorithm"){const R=new Cn(b,new Xs({color:new Xt(A.tint).multiplyScalar(1.6),transparent:!0,opacity:.8,depthWrite:!1}));R.rotation.x=.58,R.rotation.y=-.29,o.get(A.layer).add(R),p.set(A.id,R)}p.size||b.dispose();for(const A of s.nodes.values())if(A.row){const R=Math.max(0,Math.min(100,Number(A.row.repo.migration_score)||0)),C=new nd(y,new zr({color:new Xt("#a8c9ee").multiplyScalar(1+R/110),transparent:!0,opacity:.12+R*.005,depthWrite:!1}));o.get(A.layer).add(C),h.set(A.id,C)}h.size||y.dispose()}const d=new ul(new Co(2.6,0),new Xs({color:new Xt("#b4fff0").multiplyScalar(1.55),transparent:!0,opacity:e?.93:.78}),100);d.frustumCulled=!1,d.count=0,i.add(d);let g=[],m,f,_;const v=new I,S=new I;function M(b){Fc(l),g=b.map(x=>db(x,e)),g.length&&l.add(...g.map(x=>x.object))}function E({positions:b,repositioned:x,focus:y,layer:A,progress:R,poses:C,now:L,effects:N}){const D=y.nodes.size>0,B=m!==y||f!==A||_!==R||x;for(const[z,U]of o)U.matrix.copy(C.get(z).matrix),U.matrixWorldNeedsUpdate=!0;if(m=y,f=A,_=R,B){for(const{nodes:z,active:U,quiet:X}of c.values()){for(const G of[U,X])G.count=0,G.userData.ids.length=0;for(const G of z){if(A!==null&&G.layer!==A)continue;const Z=!D||y.nodes.has(G.id)?U:X,at=Z.count++,Rt=b.get(G.id)??G.position,Y=G.parent&&A===null?Math.max(.32,R):1;u.position.copy(Rt),u.scale.fromArray(G.size).multiplyScalar(Y),u.updateMatrix(),Z.setMatrixAt(at,u.matrix);const it=new Xt(G.tint);G.row&&!G.total&&it.multiplyScalar(.38),Z.setColorAt(at,it),Z.userData.ids.push(G.id)}for(const G of[U,X])G.instanceMatrix.needsUpdate=!0,G.instanceColor&&(G.instanceColor.needsUpdate=!0),G.boundingSphere=null}for(const[z,U]of h){const X=s.nodes.get(z);U.visible=(A===null||A===X.layer)&&(!D||y.nodes.has(z)),U.position.copy(b.get(z)||X.position),U.scale.fromArray(X.size).multiplyScalar(1.024*Math.max(.32,R))}}for(const[z,U]of p){const X=s.nodes.get(z);U.position.copy(b.get(z)||X.position),N&&(U.rotation.z=L*22e-5),U.scale.setScalar(X.size[0]);const G=y.nodes.has(z);U.visible=(A===null||X.layer===A)&&G,U.material.opacity=.63}d.count=0;for(const{edge:z,object:U,color:X,line:G,motion:K}of g){if(U.visible=A===null||z.from.layer===A&&z.to.layer===A,!U.visible)continue;const Z=z.branch&&R<1?void 0:b.get(z.target);K.update(bo(v,z.curve.v0,z.from,C,b.get(z.source)),bo(S,z.curve.v3,z.to,C,Z));const at=y.edges.has(z.id),Rt=z.from.parent||z.to.parent,Y=D?at?.9:.08:z.branch?.72:e?.53:.62,it=Rt&&!z.branch?Math.max(0,(R-.65)/.35):1,St=X.clone().multiplyScalar(at?1.72:1);if(U.material.uniforms?(U.material.uniforms.opacity.value=Y*it,N&&(U.material.uniforms.time.value=L/840),U.material.uniforms.ink.value.copy(St)):(U.material.opacity=Y*it,U.material.color.copy(St)),z.branch&&U.geometry.setDrawRange(0,Math.max(0,Math.floor(37*R))),N&&!G&&z.status!=="ai_assessed"&&it>.36&&(!D||at)&&d.count<100){const Ct=(L/1250+d.count*.183)%1;Np(z.curve.getPoint(Ct,u.position),Ct,K.from,K.to),u.scale.setScalar(1),u.updateMatrix(),d.setMatrixAt(d.count++,u.matrix)}}d.count&&(d.instanceMatrix.needsUpdate=!0);for(const{sheet:z,layer:U,opacities:X}of a){z.visible=A===null||U.index===A;const G=t==="atlas"&&U.kind==="file"?Math.min(1,R*1.85):1;z.children.forEach((K,Z)=>{K.material.opacity=X[Z]*G})}}return{root:i,setEdges:M,update:E,pickables:()=>[...[...c.values()].flatMap(({active:b,quiet:x})=>[b,x]),...g.filter(b=>b.object.visible&&!b.edge.branch).map(b=>b.object)]}}const Hn=192;function _b(s,t){const e=Math.abs(s-.5),n=Math.abs(t-.5),i=Math.max(n,.866*e+.5*n);return Math.abs(i-.3)<.013||Math.abs(i-.21)<.01||n<.027&&e<.13||e<.027&&n<.13}function gb(s,t){for(const e of[-1,0,1]){const n=.5+e*.128;if(s>.17&&s<.62&&Math.abs(t-n)<.017||s>=.62&&s<.77&&Math.abs(t-n-(s-.62)*.55)<.019||Math.hypot(s-.78,t-n-.087)<.033||Math.hypot(s-.16,t-n)<.029)return!0}return!1}function xb(s,t){const e=Math.hypot(s-.5,t-.5);return Math.abs(e-.17)<.009||Math.abs(e-.32)<.013||e>.36&&e<.41&&(Math.abs(s-.5)<.012||Math.abs(t-.5)<.012)}function Nf(s,t){const e=new nu(s,Hn,Hn);return t&&(e.colorSpace=yn),e.magFilter=on,e.minFilter=vi,e.generateMipmaps=!0,e.needsUpdate=!0,e}function vb(){let s=7143;return Object.fromEntries(Object.entries({category:_b,file:gb,algorithm:xb}).map(([t,e])=>{const n=new Uint8Array(Hn*Hn*4),i=new Uint8Array(n.length);for(let r=0;r<Hn*Hn;r++){const a=(r%Hn+.5)/Hn,o=(Math.floor(r/Hn)+.5)/Hn;s=Math.imul(s,1664525)+1013904223>>>0;const l=((s>>>24)/255-.5)*15,c=e(a,o),u=Math.max(0,Math.abs(a-.5)+Math.abs(o-.5)-.52)*18,p=t==="file"?3*Math.sin(r%Hn*1.73):0,h=Math.round(236+l+p-u-(c?52:0)),d=Math.round(143+l*1.8+(c?35:0));n.set([h,h,h,255],r*4),i.set([d,d,d,255],r*4)}return[t,{map:Nf(n,!0),roughnessMap:Nf(i,!1)}]}))}function Mb(s,{variant:t,onLabels:e,onPick:n,onStats:i,onLost:r}){const a=new jm,o=new KM({antialias:!0,powerPreference:"low-power"}),l=o.getContext(),c=l.getExtension("WEBGL_debug_renderer_info"),u=!!(c&&/swiftshader|llvmpipe|softpipe|lavapipe|software rasterizer/i.test(l.getParameter(c.UNMASKED_RENDERER_WEBGL))),p=vb();o.toneMapping=wo,o.toneMappingExposure=1.16,o.domElement.className="spatial-webgl",s.append(o.domElement),o.domElement.addEventListener("webglcontextlost",r);const h=new hS;h.domElement.className="spatial-overlay",h.domElement.style.display="none",s.append(h.domElement);const d=Qy(a,e),g=new Vn(Pp,1,1,18e3),m=new Po(-1,1,1,-1,1,18e3);let f=g;f.position.set(620,760,1250);const _=new JM(f,o.domElement);_.enableDamping=!u,_.dampingFactor=.105,_.zoomToCursor=!0,_.minDistance=75,_.maxDistance=16e3,_.minZoom=.35,_.maxZoom=8,_.maxPolarAngle=Math.PI*.95;const v=new gS(o),S=new vS(a,f),M=new Ks(new rt(1,1),.36,.46,.9),E=new xS;v.addPass(S),v.addPass(M),v.addPass(E);const b=new tg;b.params.Line.threshold=4;const x=new rt;let y=null;const A={nodes:new Set,edges:new Set};let R=!1,C,L,N,D=A,B="",z=null,U=0,X=0,G=600,K=!0,Z=0,at=-1/0,Rt,Y=new Map,it,St,Ct={progress:1},gt=new Map,It=null;const ce=new qn,Ft=new Yn(0,0,0,"YXZ"),Yt=new Yn,ie=new I,tt=new Map,mt=new ae,ft=new ae,Et=new I,Mt=new ae,Vt=new ae,Lt=new qn,te=new Map,se=new I,oe=new I;let k=new Map,xe,Zt=!1;const Kt=rb();let dt=new Map,ye=new Map,Ot=0,zt=0,P,w=0,W=!1,st=!1,et,pt,vt,J=[],j={moving:!1,visible:0};const ct=new Map,F=matchMedia("(prefers-reduced-motion: reduce)"),Q=()=>!u&&!F.matches,$=new $_(13232639,2),_t=new K_(14024687,2.2);_t.position.set(170,740,1200),a.add($,_t);function nt(){!Z&&K&&!document.hidden&&(Z=requestAnimationFrame(Zn))}function ut(){zt=performance.now()+1e3,nt()}function Nt(){m.left=-G*U/X/2,m.right=-m.left,m.top=G/2,m.bottom=-m.top,m.updateProjectionMatrix()}function $t(){const Pt=s.clientWidth,Gt=s.clientHeight;if(!Pt||!Gt||Pt===U&&Gt===X)return;const Jt=U<660!=Pt<660;U=Pt,X=Gt;const Ht=Math.min(devicePixelRatio||1,U<720?1.25:1.6),fe=Math.min(Ht,Math.sqrt((u?65e4:25e5)/(U*X)));o.setPixelRatio(fe),o.setSize(U,X),v.setPixelRatio(fe),v.setSize(U,X),h.setSize(U,X),g.aspect=U/X,g.updateProjectionMatrix(),Nt(),L&&Jt?Ut():L&&ot(!1)}function ot(Pt=!0){if(!L||!U||!X)return;ut(),Kt.touch(performance.now());const Gt=z===null?g:m;f!==Gt&&(Gt.position.copy(f.position),Gt.quaternion.copy(f.quaternion),Gt.zoom=1,f=Gt,S.camera=f,_.object=f);const Jt=ab(L,{aspect:U/X,variant:t,review:z,focus:[...D.nodes],compact:U<660});Ti();const Ht=f.zoom,Ee=f.position.clone(),fe=_.target.clone(),T=G,O={amount:0};function q(){f.position.lerpVectors(Ee,Jt.position,O.amount),_.target.lerpVectors(fe,Jt.target,O.amount),f.zoom=Ht+(1-Ht)*O.amount,G=T+(Jt.orthoHeight-T)*O.amount,Nt(),_.update(),nt()}Pt&&Q()?it=eo.to(O,{amount:1,duration:.68,ease:"power3.inOut",onUpdate:q,onComplete:nt}):(O.amount=1,q())}function Ut(Pt=!1){var Jt;if(!C)return;const Gt=Xy(C,t,U<660);if(ct.clear(),Pt&&C.expanded&&Q())for(const Ht of Gt.links)Ht.branch&&ct.set(Ht.target,Ht);St==null||St.kill(),Ct={progress:ct.size?0:1},ct.size&&(St=eo.to(Ct,{progress:1,duration:.68,ease:"power2.out",onUpdate:nt})),gt=new Map,tt.clear(),k=new Map,xe=null,Zt=!1,dt.clear(),ye.clear(),Kt.touch(performance.now()),N&&(a.remove(N.root),Fc(N.root)),d.clear(),at=-1/0,L=Gt,N=mb(L,{variant:t,dark:R,textures:p}),a.add(N.root),M.enabled=!u&&L.nodes.size<360,D=wf(L,L.nodes.has(B)?B:C.expanded),s.dataset.planes=L.layers.map(Ht=>Ht.depth).join(","),s.dataset.repositories=String(t==="atlas"?((Jt=L.layers.find(Ht=>Ht.kind==="file"))==null?void 0:Jt.data.length)??0:0),Rt=void 0,qt(),ot(Pt),nt()}function qt(){const Gt=(f.isOrthographicCamera?G/f.zoom:f.position.distanceTo(_.target)*.63)<(Rt?690:620);Rt!==Gt&&(Rt=Gt,N.setEdges(pb(L,D.edges,Rt)),at=-1/0)}function yt(Pt,Gt){const Jt=(q,H,V)=>q.elements.some((lt,Tt)=>Math.abs(lt-H.elements[Tt])>(Tt>=12&&Tt<15?V:.001));if((Gt||Jt(f.matrixWorld,mt,.6)||Jt(f.projectionMatrix,ft,.001))&&(mt.copy(f.matrixWorld),ft.copy(f.projectionMatrix),Kt.touch(Pt)),!W&&Kt.take(Pt)){const q=Df(L.layers,ce,te),H=z===null?$y(L.layers,Af(f,U,X,q)):te,V=L.layers.filter(({index:lt})=>(k.get(lt)||Et).distanceToSquared(H.get(lt)||Et)>.01);xe=V.length?{from:k,target:H,start:Pt,layers:V}:null,xe||(k=H),Zt=!0}if(W||Kt.pending||!xe)return!1;const{from:Ht,target:Ee,start:fe,layers:T}=xe,O=Q()?Math.min(1,(Pt-fe)/280):1;if(O===1)k=new Map(Ee),xe=null;else{k=new Map(Ht);const q=O*O*(3-2*O);for(const{index:H}of T)k.set(H,new I().lerpVectors(Ht.get(H)||Et,Ee.get(H)||Et,q))}return O<1}function de(Pt,Gt,Jt){if(Kt.pending||xe)return{moved:!1,moving:!1};if(Zt)if(Zt=!1,w=Pt+260,Q()&&(Jt=Math.min(Jt,.22)),z===null&&L.nodes.size<96){const fe=Jy(L,Gt,D,t,d.size);dt=fe.offsets,ye=fe.hints}else dt.clear(),ye.clear();Pt>=w&&(Jt=1);let Ht=!1,Ee=!1;for(const fe of new Set([...tt.keys(),...dt.keys()])){const T=dt.get(fe)||Et,O=tt.get(fe)||new I;O.distanceToSquared(T)>.04&&Jt<1?(O.lerp(T,Jt),Ee=!0,Ht=!0):O.equals(T)||(O.copy(T),Ht=!0),O.lengthSq()===0?tt.delete(fe):tt.set(fe,O)}return{moved:Ht,moving:Ee}}function Oe(Pt){return st===Pt?!1:(!Pt&&h.domElement.contains(document.activeElement)&&s.focus({preventScroll:!0}),st=Pt,h.domElement.style.display=Pt?"":"none",at=-1/0,!0)}function Zn(Pt){if(Z=0,!N||!U||!X)return;const Gt=Math.max(1,Pt-Ot);Ot=Pt;const Jt=Q()?1-Math.exp(-Gt/65):1;_.dampingFactor=1-Math.pow(.895,Gt/(1e3/60));const Ht=_.update();f.updateMatrixWorld(),z===null?Dp(Yt,ie.set(0,0,1).applyQuaternion(f.quaternion)):Yt.set(0,0,0,"YXZ");const Ee=sb(Ft,Yt,z===null&&Q()?Gt:1/0);ce.setFromEuler(Ft),qt();const fe=Ee||(it==null?void 0:it.isActive())||Ct.progress<1,T=yt(Pt,fe),O=Df(L.layers,ce,k),q=Af(f,U,X,O,ce),{moved:H,moving:V}=de(Pt,q,Jt),lt=Oe(!Kt.pending&&!xe&&!V);if(gt.clear(),Ct.progress<1){let bt=0;for(const[jt,Le]of ct){const{curve:pe,from:ve,to:Fe}=Le,Dt=Math.min(1,Math.max(0,Ct.progress*1.24-bt++*.034)),Ke=Np(pe.getPoint(Dt),Dt,bo(se,pe.v0,ve,O),bo(oe,pe.v3,Fe,O));gt.set(jt,Ke.applyMatrix4(O.get(Fe.layer).inverse).addScaledVector(oe.copy(Fe.position).sub(pe.v3),Dt))}}else for(const[bt,jt]of tt)gt.set(bt,L.nodes.get(bt).position.clone().add(jt));const Tt=z===null?D:A,ht=Q()&&z===null&&Pt<zt&&L.links.length>0;N.update({positions:gt,repositioned:H,focus:Tt,layer:z,progress:Ct.progress,poses:O,now:Pt,effects:ht});const xt=st&&(lt||H||et!==L||pt!==Ct.progress||vt!==z||!Mt.equals(f.matrixWorld)||!Vt.equals(f.projectionMatrix)||!Lt.equals(ce));xt&&(J=d.bodyBoxes(L,q,gt,z),et=L,pt=Ct.progress,vt=z,Mt.copy(f.matrixWorld),Vt.copy(f.projectionMatrix),Lt.copy(ce));const At=st&&(Pt-at>140||H&&!V),Bt=At&&d.update({layout:L,projection:q,positions:gt,review:z,focus:Tt.nodes,near:Rt,progress:Ct.progress,variant:t,bodies:J,hints:ye});st&&(xt||At||j.moving)&&(j=d.move({projection:q,positions:gt,step:lt?1:Jt,bodies:J})),At&&(Y=d.live,i({nodes:L.nodes.size,edges:C.links.length,groups:j.visible,drawn:N.pickables().filter(bt=>bt.userData.edge).length,near:Rt}),at=Bt?-1/0:Pt),v.render(),st&&h.render(a,f),s.dataset.camera=f.position.toArray().map(bt=>bt.toFixed(2)).join(","),s.dataset.layerShift=L.layers.map(({index:bt})=>(k.get(bt)||Et).toArray().map(jt=>jt.toFixed(2)).join(",")).join(";"),s.dataset.layerAttitude=ce.toArray().map(bt=>bt.toFixed(4)).join(","),s.dataset.reflow=tt.size,s.dataset.layoutState=Kt.pending?"waiting":T||V?"arranging":"ready",s.dataset.ready="true";const Qt=Kt.wait(performance.now());Qt!==null&&!W&&!fe&&P===void 0&&(P=setTimeout(()=>{P=void 0,nt()},Math.max(1,Qt))),(ht||Ht||fe||T||V||st&&j.moving||Bt)&&nt()}function na(Pt,Gt){const Jt=!!(C&&Pt.expanded!==C.expanded);C=Pt,B=Gt||"",Ut(Jt)}function ar(Pt){B=Pt||"",L&&(D=wf(L,L.nodes.has(B)?B:C.expanded),Rt=void 0,Kt.touch(performance.now()),ot())}function Fo(Pt){const Gt=L==null?void 0:L.links.find(Jt=>Jt.id===Pt);if(Gt){D={nodes:new Set([Gt.source,Gt.target]),edges:new Set([Pt])};for(const Jt of L.links)Jt.branch&&D.nodes.has(Jt.target)&&(D.nodes.add(Jt.source),D.edges.add(Jt.id));Rt=void 0,Kt.touch(performance.now()),ot()}}function ia(Pt=null){z=Pt,Kt.touch(performance.now()),_.enableRotate=Pt===null,ot(),at=-1/0}function Ti(){it==null||it.kill(),It=null}function oi(Pt,Gt){if(!L||z!==null)return;ut(),Kt.touch(performance.now());const Jt=f.position.clone().sub(_.target),Ht=new yc().setFromVector3(Jt),Ee=It||Ht,fe=2*Math.PI;Ht.theta+=Math.round((Ee.theta-Ht.theta)/fe)*fe;const T=Ee.theta+Pt*Math.PI/15,O=Math.max(Math.PI/15,Math.min(Math.PI*14/15,Ee.phi-Gt*Math.PI/22.5));Ti();const q=()=>{f.position.copy(_.target).add(Jt.setFromSpherical(Ht)),_.update(),nt()},H=()=>{It=null,at=-1/0,nt()};Q()?(It={theta:T,phi:O},it=eo.to(Ht,{theta:T,phi:O,duration:.31,ease:"power2.out",onUpdate:q,onComplete:H})):(Ht.theta=T,Ht.phi=O,q(),H())}function or(Pt){if(Ti(),f.isOrthographicCamera)f.zoom=Math.max(_.minZoom,Math.min(_.maxZoom,f.zoom*Pt)),f.updateProjectionMatrix();else{const Gt=f.position.clone().sub(_.target);Gt.setLength(Math.max(_.minDistance,Math.min(_.maxDistance,Gt.length()/Pt))),f.position.copy(_.target).add(Gt)}_.update(),at=-1/0,ut()}function sa(Pt){y={x:Pt.clientX,y:Pt.clientY}}function ra(Pt){var Ht;if(!y||Math.hypot(y.x-Pt.clientX,y.y-Pt.clientY)>5)return;y=null;const Gt=s.getBoundingClientRect();x.set((Pt.clientX-Gt.left)/Gt.width*2-1,1-(Pt.clientY-Gt.top)/Gt.height*2),b.setFromCamera(x,f);const Jt=b.intersectObjects((N==null?void 0:N.pickables())||[],!1);for(const{object:Ee,instanceId:fe}of Jt){const T=fe===void 0?null:(Ht=Ee.userData.ids)==null?void 0:Ht[fe];if(T){n(T,!1);return}const O=Ee.userData.edge;if(O){n(O.id,!0);return}}}function li(){R=document.documentElement.dataset.theme==="dark";const Pt=getComputedStyle(s).getPropertyValue("--bg-elevated").trim();a.background=new Xt(Pt||"#152330").multiplyScalar(R?1:1.42),M.strength=R?.29:.14,M.threshold=R?.94:1.51,$.intensity=R?1.8:2.1,Ut()}function aa(){if(!L||!U||!X)return null;const Pt=Math.min(2,4096/Math.max(U,X)),Gt=o.getPixelRatio();o.setPixelRatio(Pt),o.setSize(U,X,!1),v.setPixelRatio(Pt),v.setSize(U,X),v.render();const Jt=document.createElement("canvas");Jt.width=o.domElement.width,Jt.height=o.domElement.height;const Ht=Jt.getContext("2d");Ht.drawImage(o.domElement,0,0),o.setPixelRatio(Gt),o.setSize(U,X),v.setPixelRatio(Gt),v.setSize(U,X);const Ee=s.getBoundingClientRect();Ht.scale(Jt.width/U,Jt.height/X);for(const{target:fe}of Y.values()){const T=fe.firstElementChild;if(!T||fe.style.visibility==="hidden"||!fe.getClientRects().length)continue;const O=T.getBoundingClientRect(),q=getComputedStyle(T);Ht.save(),Ht.globalAlpha=fe.classList.contains("dimmed")?.28:1,Ht.fillStyle=q.backgroundColor,Ht.beginPath(),Ht.roundRect(O.left-Ee.left,O.top-Ee.top,O.width,O.height,7),Ht.fill();for(const H of T.querySelectorAll("span")){const V=H.getBoundingClientRect(),lt=getComputedStyle(H);Ht.fillStyle=lt.color,Ht.font=lt.fontWeight+" "+lt.fontSize+" "+lt.fontFamily;const Tt=document.createRange(),ht=new Map;for(const xt of H.childNodes)if(xt.nodeType===Node.TEXT_NODE)for(let At=0;At<xt.length;At++){Tt.setStart(xt,At),Tt.setEnd(xt,At+1);const Bt=Tt.getBoundingClientRect(),Qt=ht.get(Bt.top)||{left:Bt.left,text:""};Qt.text+=xt.data[At],ht.set(Bt.top,Qt)}Ht.textBaseline="top";for(const[xt,At]of ht)xt<V.bottom&&Ht.fillText(At.text,At.left-Ee.left,xt-Ee.top)}Ht.restore()}return nt(),Jt}const lr=new ResizeObserver($t),wi=new IntersectionObserver(([Pt])=>{K=Pt.isIntersecting,nt()}),oa=new MutationObserver(li);return _.addEventListener("change",nt),_.addEventListener("start",()=>{W=!0,Ti(),ut()}),_.addEventListener("end",()=>{W=!1,Kt.pending&&Kt.touch(performance.now()),nt()}),o.domElement.addEventListener("pointerdown",sa),o.domElement.addEventListener("pointerup",ra),oa.observe(document.documentElement,{attributes:!0,attributeFilter:["data-theme"]}),lr.observe(s),wi.observe(s),document.addEventListener("visibilitychange",nt),F.addEventListener("change",li),$t(),li(),{setData:na,select:ar,selectRelation:Fo,setView:ia,turn:oi,zoom:or,exportPng:aa,dispose(){lr.disconnect(),wi.disconnect(),oa.disconnect(),document.removeEventListener("visibilitychange",nt),F.removeEventListener("change",li),_.dispose(),Ti(),St==null||St.kill(),clearTimeout(P),cancelAnimationFrame(Z),d.clear(),N&&Fc(N.root);for(const{map:Pt,roughnessMap:Gt}of Object.values(p))Pt.dispose(),Gt.dispose();S.dispose(),M.dispose(),E.dispose(),v.dispose(),o.domElement.removeEventListener("webglcontextlost",r),o.dispose(),o.forceContextLoss(),o.domElement.remove(),h.domElement.remove()}}}const Sb=["data-label-count","data-visible-edges","data-lod"],yb={class:"spatial-controls"},bb={class:"spatial-buttons","aria-label":"镜头视角"},Eb=["aria-pressed"],Tb={class:"spatial-buttons spatial-turn",role:"group","aria-label":"视角方向"},wb=["aria-label","aria-keyshortcuts","title","disabled","onClick"],Ab={class:"spatial-buttons","aria-label":"镜头工具"},Rb=["disabled"],Cb={class:"spatial-field"},Pb={class:"spatial-layers","aria-label":"切面"},Db=["aria-pressed","data-layer","onClick"],Lb={key:0,class:"spatial-empty",role:"status"},Nb={class:"spatial-footer"},Ib={key:0,"aria-label":"检出记录数与线宽",class:"spatial-weight"},Ub={key:1},Ob={key:2,class:"spatial-lod"},Fb=["data-node","aria-label","aria-expanded","aria-pressed","title","onClick"],Bb={class:"label-title"},zb={key:0},kb={key:0,class:"label-meta"},Hb={__name:"Stage3DCanvas",props:{graph:{type:Object,required:!0},selected:String,status:String,variant:{type:String,default:"atlas"}},emits:["select","select-edge","stats","unavailable"],setup(s,{expose:t,emit:e}){const n=s,i=e,r=zo(null),a=Hu([]),o=zo(null),l=zo(!1),c=Hu({nodes:0,edges:0,groups:0,drawn:0,near:!1}),u=[{key:"ArrowLeft",glyph:"←",label:"向左旋转",yaw:-1,pitch:0},{key:"ArrowUp",glyph:"↑",label:"抬高视角",yaw:0,pitch:1},{key:"ArrowDown",glyph:"↓",label:"降低视角",yaw:0,pitch:-1},{key:"ArrowRight",glyph:"→",label:"向右旋转",yaw:1,pitch:0}],p=ur(()=>n.variant==="atlas"?["领域分类","仓库矩阵","密码算法"]:n.graph.mode==="calls"?["来源位置","密码操作","返回或关联"]:["文件与证据","密码算法","迁移参考"]),h=ur(()=>n.variant==="atlas"?300:250),d=ur(()=>p.value.map((C,L)=>({name:C,index:L,z:(1-L)*h.value})).filter(C=>n.variant!=="atlas"||C.index!==1||!!n.graph.expanded)),g=ur(()=>n.graph.peak||1),m=ur(()=>[...new Set([1,Math.round(g.value/4)||1,g.value])]);let f;function _(){o.value!==null&&!d.value.some(C=>C.index===o.value)&&v(),f==null||f.setData(kp(n.graph),n.selected)}function v(C=null){o.value=C,f==null||f.setView(C)}function S(C,L=!1){L&&(f==null||f.selectRelation(C)),i(L?"select-edge":"select",C)}function M(C){f==null||f.select(C)}function E(){i("select",""),v()}function b({yaw:C,pitch:L}){o.value===null&&(f==null||f.turn(C,L))}function x(C){var L;C.target.closest("button")||(L=r.value)==null||L.focus({preventScroll:!0})}function y(C){if(C.defaultPrevented||C.ctrlKey||C.metaKey||C.altKey)return;const L=u.find(N=>N.key===C.key);if(L&&o.value===null){C.preventDefault(),b(L);return}["+","=","-","0"].includes(C.key)&&C.preventDefault(),(C.key==="+"||C.key==="=")&&(f==null||f.zoom(1.3)),C.key==="-"&&(f==null||f.zoom(1/1.3)),C.key==="0"&&E(),C.key==="Escape"&&n.selected&&(C.preventDefault(),i("select",""))}function A(C){return C.group?C.group.rows.length+" 仓":n.variant==="atlas"?C.detailLines.join(""):C.line?"第 "+C.line+" 行":C.status?Gp(C.status):C.kindLabel||""}function R(){var C;(C=f==null?void 0:f.exportPng())==null||C.toBlob(L=>{if(!L)return;const N=URL.createObjectURL(L),D=document.createElement("a");D.href=N,D.download=n.variant==="atlas"?"仓库算法全景.png":"证据关系图.png",D.click(),setTimeout(()=>URL.revokeObjectURL(N),1e3)},"image/png")}return Up(()=>{try{f=Mb(r.value,{variant:n.variant,onLabels:C=>{a.value=C},onPick:S,onStats:C=>{c.value=C,l.value=!0,i("stats",C)},onLost:C=>{C.preventDefault(),i("unavailable")}}),_()}catch(C){console.warn("3D 视图切换到兼容模式",C),i("unavailable")}}),Bu(()=>n.graph,_,{flush:"post"}),Bu(()=>n.selected,M),Op(()=>f==null?void 0:f.dispose()),t({locate:M,exportView:R,fit:()=>v()}),(C,L)=>(ke(),Je("section",{class:Gu(["spatial-stage","spatial-"+s.variant]),"data-label-count":c.value.groups,"data-visible-edges":c.value.drawn,"data-lod":c.value.near?"near":"far",onKeydown:y},[Ne("div",yb,[Ne("div",bb,[Ne("button",{class:"button secondary compact","aria-pressed":o.value===null,onClick:L[0]||(L[0]=N=>v())},"空间巡航",8,Eb)]),Ne("div",Tb,[(ke(),Je(Ri,null,cr(u,N=>Ne("button",{key:N.key,type:"button",class:"button secondary compact","aria-label":N.label,"aria-keyshortcuts":N.key,title:o.value===null?N.label:"返回空间巡航后调整视角",disabled:!l.value||o.value!==null,onClick:D=>b(N)},Kn(N.glyph),9,wb)),64))]),Ne("div",Ab,[Ne("button",{class:"button secondary compact","aria-label":"缩小关系图",onClick:L[1]||(L[1]=N=>{var D;return(D=Bo(f))==null?void 0:D.zoom(1/1.3)})},"−"),Ne("button",{class:"button secondary compact","aria-label":"放大关系图",onClick:L[2]||(L[2]=N=>{var D;return(D=Bo(f))==null?void 0:D.zoom(1.3)})},"＋"),Ne("button",{class:"button secondary compact",onClick:E},"复位"),Ne("button",{class:"button secondary compact",disabled:!l.value,onClick:R},"导出 PNG",8,Rb),Fp(C.$slots,"fullscreen")])]),Ne("div",Cb,[Ne("div",{ref_key:"surface",ref:r,class:"spatial-surface",tabindex:"0","aria-label":"三维关系图，方向键或拖动调整视角，滚轮缩放，点节点或管道查看关系","aria-keyshortcuts":"ArrowLeft ArrowUp ArrowDown ArrowRight",onPointerdown:x},null,544),Ne("div",Pb,[(ke(!0),Je(Ri,null,cr(d.value,N=>(ke(),Je("button",{key:N.index,type:"button","aria-pressed":o.value===N.index,class:"spatial-layer","data-layer":N.index,onClick:D=>v(N.index)},[L[3]||(L[3]=Ne("i",{"aria-hidden":"true"},null,-1)),Ne("span",null,Kn(N.name),1),Ne("small",null,"Z "+Kn(N.z>0?"+":"")+Kn(N.z),1)],8,Db))),128))]),!l.value||!s.graph.nodes.length?(ke(),Je("p",Lb,Kn(l.value?"没有匹配的关系":"正在构建空间图…"),1)):ca("",!0)]),Ne("div",Nb,[s.variant==="workbench"?(ke(),zu(Bp,{key:0,mode:s.graph.mode},null,8,["mode"])):(ke(),Je(Ri,{key:1},[L[4]||(L[4]=Ne("span",{class:"spatial-branch-key"},[Ne("i"),ua("类别归属")],-1)),s.status!=="legacy"?(ke(),Je("div",Ib,[(ke(!0),Je(Ri,null,cr(m.value,N=>(ke(),Je("span",{key:N},[Ne("i",{style:ku({height:Bo(If)(N,g.value,s.status)+"px"})},null,4),ua(Kn(N)+" 项",1)]))),128))])):(ke(),Je("span",Ub,"点线表示历史检出"))],64)),c.value.drawn&&c.value.drawn<c.value.edges?(ke(),Je("span",Ob,"当前绘制 "+Kn(c.value.drawn)+" 条主干关系",1)):ca("",!0)]),(ke(!0),Je(Ri,null,cr(a.value,N=>(ke(),zu(zp,{key:N.node.id,to:N.target},[Ne("button",{type:"button",class:Gu(["spatial-label","label-"+N.node.kind]),"data-node":N.node.id,"aria-label":N.node.label,"aria-expanded":N.node.group?!!N.node.expanded:void 0,"aria-pressed":N.node.group?void 0:s.selected===N.node.id,title:N.node.label,style:ku({"--node-tint":N.node.tint}),onClick:D=>S(N.node.id)},[Ne("span",Bb,[s.variant==="atlas"&&N.node.row?(ke(!0),Je(Ri,{key:0},cr(N.node.label.split(new RegExp("(?<=[/-])")),(D,B)=>(ke(),Je(Ri,{key:B},[B?(ke(),Je("wbr",zb)):ca("",!0),ua(Kn(D),1)],64))),128)):(ke(),Je(Ri,{key:1},[ua(Kn(s.variant==="atlas"?N.node.label:N.node.title||N.node.label),1)],64))]),A(N.node)?(ke(),Je("span",kb,Kn(A(N.node)),1)):ca("",!0)],14,Fb)],8,["to"]))),128))],42,Sb))}};export{Hb as default};
