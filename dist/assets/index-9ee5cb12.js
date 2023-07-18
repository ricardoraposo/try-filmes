(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const o of document.querySelectorAll('link[rel="modulepreload"]'))r(o);new MutationObserver(o=>{for(const n of o)if(n.type==="childList")for(const i of n.addedNodes)i.tagName==="LINK"&&i.rel==="modulepreload"&&r(i)}).observe(document,{childList:!0,subtree:!0});function t(o){const n={};return o.integrity&&(n.integrity=o.integrity),o.referrerPolicy&&(n.referrerPolicy=o.referrerPolicy),o.crossOrigin==="use-credentials"?n.credentials="include":o.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function r(o){if(o.ep)return;o.ep=!0;const n=t(o);fetch(o.href,n)}})();let c=localStorage.getItem("favorites")?JSON.parse(localStorage.getItem("favorites")):[];const m=document.getElementById("movie-section"),v=s=>{const e=document.createElement("div"),t=document.createElement("span"),r=document.createElement("img");t.classList.add("heart"),t.classList.add("heart-blue"),r.src=`${s.image.medium}`,e.classList.add("box"),e.setAttribute("id",s.id),e.appendChild(r),e.appendChild(t),m.appendChild(e)},y=()=>{document.querySelectorAll(".heart").forEach(e=>{e.addEventListener("click",t=>{t.target.classList.toggle("heart-red"),t.target.classList.toggle("heart-blue"),t.target.classList.contains("heart-red")?(c.push(e.parentNode.id),localStorage.setItem("favorites",JSON.stringify(c))):(c=c.filter(r=>r!==e.parentNode.id),localStorage.setItem("favorites",JSON.stringify(c)))})})},S=()=>{const s=JSON.parse(localStorage.getItem("favorites"));document.querySelectorAll(".box").forEach(t=>{s.includes(t.id)&&t.lastChild.classList.add("heart-red")})},u=s=>{m.textContent="",s.forEach(e=>{v(e),S()}),y()},E=document.getElementById("sort-button"),a=document.getElementById("search-box"),f=document.getElementById("filter-button"),l=document.getElementById("filter-type"),d=(s,e)=>{const t=JSON.parse(localStorage.getItem("favorites"));switch(e){case"All":return s;case"Favorites":return s.filter(r=>t.includes(r.id.toString()));default:return s.filter(r=>r.genres.includes(e))}},L=()=>{const e=JSON.parse(localStorage.getItem("movies")).sort((t,r)=>t.name.localeCompare(r.name));u(e)},g=async()=>{const t=(await(await fetch("https://api.tvmaze.com/shows")).json()).sort((r,o)=>o.weight-r.weight);return localStorage.setItem("movies",JSON.stringify(t)),t},w=async()=>{const s=a.value.trim().toLowerCase().replace(/ /g,"+");if(s){const n=(await(await fetch(`https://api.tvmaze.com/search/shows?q=${s}`)).json()).map(p=>p.show),i=d(n,l.value);return localStorage.setItem("movies",JSON.stringify(i)),i}const e=await g(),t=d(e,l.value);return localStorage.setItem("movies",JSON.stringify(t)),t},h=async s=>{const e=await s();u(e)};h(g);E.addEventListener("click",L);f.addEventListener("click",()=>{h(w),a.value=""});a.addEventListener("keypress",s=>{s.key==="Enter"&&f.click()});