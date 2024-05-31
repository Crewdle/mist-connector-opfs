!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var r=t();for(var a in r)("object"==typeof exports?exports:e)[a]=r[a]}}(this,(()=>(()=>{"use strict";var e={d:(t,r)=>{for(var a in r)e.o(r,a)&&!e.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:r[a]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r:e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}},t={};e.r(t),e.d(t,{OPFSObjectStoreConnector:()=>i});const r=require("@crewdle/web-sdk-types");function a(e){return e.split("/").filter((e=>e.length>0))}function o(e,t){return"/"===e?e+t:e+"/"+t}function n(e){const t=a(e),r=t.pop()||"",o=t.join("/");return[0===o.length?"/":o,r]}class i{storeKey;root;constructor(e){this.storeKey=e}async get(e){const[t,r]=await this.getFolderHandle(e);for await(const a of t.values())if(a.name===r){if("directory"===a.kind)throw new Error(`Cannot get file: ${e}`);{const e=await t.getFileHandle(r);return await e.getFile()}}throw new Error(`Cannot get file: ${e}`)}async list(e,t=!1){try{const a=[],[o,n,i]=await this.getFolderHandle(e),c="/"===e?o:await o.getDirectoryHandle(n);for await(const e of c.values()){const o="/"+(i.length>0?i.join("/"):""),n=o.length>1?o+"/"+e.name:"/"+e.name;if("directory"===e.kind)a.push({kind:r.ObjectKind.Folder,name:e.name,path:o,pathName:n,entries:t?await this.list(n,t):[]});else{const t=await c.getFileHandle(e.name),i=await t.getFile();a.push({kind:r.ObjectKind.File,name:e.name,type:i.type,size:i.size,path:o,pathName:n})}}return a}catch(t){throw new Error(`Cannot list folder: ${e}`)}}async createFolder(e){try{await this.getOrCreateFolderHandle(e);const[t,a]=n(e);return{kind:r.ObjectKind.Folder,name:a,path:t,pathName:e}}catch(t){throw new Error(`Cannot create folder: ${e}`)}}async writeFile(e,t){try{const a=await this.getOrCreateFolderHandle(t),n=await a.getFileHandle(e.name,{create:!0}),i=await n.createWritable();return await i.write(e),await i.close(),{kind:r.ObjectKind.File,name:e.name,type:e.type,size:e.size,path:t??"/",pathName:o(t??"/",e.name)}}catch(r){throw new Error(`Cannot write file: ${o(t??"/",e.name)}`)}}async deleteObject(e){const[t,a]=await this.getFolderHandle(e);for await(const o of t.values())if(o.name===a)try{return"directory"===o.kind?(await t.removeEntry(a,{recursive:!0}),r.ObjectKind.Folder):(await t.removeEntry(a),r.ObjectKind.File)}catch(t){throw new Error(`Cannot delete file: ${e}`)}throw new Error(`Cannot delete file: ${e}`)}async moveObject(e,t){try{const[a,o]=await this.getFolderHandle(e);for await(const n of a.values())if(n.name===o){if("directory"===n.kind)return await this.moveDirectory(a,e,t),r.ObjectKind.Folder;{const n=await a.getFileHandle(o);return await this.moveFile(n,e,t),r.ObjectKind.File}}throw new Error(`Cannot move object: ${e}`)}catch(t){throw new Error(`Cannot publish move operation: ${e}`)}}async calculateSize(e){const t=await this.list(e);let a=0;for(const e of t)e.kind===r.ObjectKind.File?a+=e.size:a+=await this.calculateSize(e.pathName);return a}async getOrCreateFolderHandle(e){try{let t=await this.getRootFolderHandle();if(e){const r=a(e);for(const e of r)t=await t.getDirectoryHandle(e,{create:!0})}return t}catch(t){throw new Error(`Cannot get or create folder: ${e}`)}}async getRootFolderHandle(){if(this.root)return this.root;const e=await navigator.storage.getDirectory();return this.root=await e.getDirectoryHandle(this.storeKey,{create:!0}),this.root}async getFolderHandle(e){try{let t=await this.getRootFolderHandle();if("/"===e)return[t,"",[]];const r=a(e);for(const[e,a]of r.entries()){if(e===r.length-1)return[t,a,r];t=await t.getDirectoryHandle(a)}}catch(t){throw new Error(`Cannot get folder: ${e}`)}throw new Error(`Cannot get folder: ${e}`)}async moveFile(e,t,r){try{const a=await e.getFile(),o=r.split("/"),n=o.slice(-1),i=o.slice(0,o.length-1).join("/"),c=new File([a],n[0],{type:a.type});await this.writeFile(c,i),await this.deleteObject(t)}catch(e){throw new Error(`Cannot move file: ${t}`)}}async moveDirectory(e,t,r){try{await this.getOrCreateFolderHandle(r);const[a,o]=n(t),i=await e.getDirectoryHandle(o);await this.copyDirectory(i,t,r),await this.deleteObject(t)}catch(e){throw new Error(`Cannot move folder: ${t}`)}}async copyDirectory(e,t,a){const n=await this.list(t,!1);for(const t of n)if(t.kind===r.ObjectKind.Folder)await this.moveDirectory(e,t.pathName,o(a,t.name));else{const r=await e.getFileHandle(t.name);await this.moveFile(r,t.pathName,o(a,t.name))}}}return t})()));