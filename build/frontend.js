!function(){class e{constructor(e,t){var i;e&&null!=e&&null!==(i=e.dataset)&&void 0!==i&&i.videoId&&(this.element=e,this.videoId=this.element.dataset.videoId,this.needsYTApi=/Mobi/i.test(window.navigator.userAgent)||/Apple/i.test(navigator.vendor),this.forceIframe=t&&/iPhone/.test(window.navigator.userAgent),this.init())}init(){this.forceIframe&&new IntersectionObserver(((e,t)=>{e.forEach((e=>{e.isIntersecting&&(e.target.classList.contains("is-activated")||(this.createIframe(this.getParams(e.target)),e.target.classList.add("is-activated"),t.unobserve(e.target)))}))}),{rootMargin:"0px"}).observe(this.element),this.element.addEventListener("click",(()=>{if(this.element.classList.contains("is-activated"))return;this.element.classList.add("is-activated");const e=this.getParams(this.element);this.needsYTApi?this.playVideo(Object.fromEntries(e.entries())):this.createIframe(e).focus()}))}getParams(e){var t;const i=new URLSearchParams(null!=e&&null!==(t=e.dataset)&&void 0!==t&&t.params?JSON.parse(e.dataset.params):{});return i.append("autoplay","1"),i.append("playsinline","1"),i}async playVideo(e){this.loadYTAPI(),await this.ytApiPromise;const t=document.createElement("div");this.element.append(t);const i=this.videoId;new YT.Player(t,{width:"100%",videoId:i,playerVars:e,events:{onReady:e=>e.target.playVideo()}})}loadYTAPI(){var e,t;null!==(e=window)&&void 0!==e&&null!==(t=e.YT)&&void 0!==t&&t.Player||(this.ytApiPromise=new Promise(((e,t)=>{var i=document.createElement("script");i.src="https://www.youtube.com/iframe_api",i.async=!0,i.onload=()=>{YT.ready(e)},i.onerror=t,this.element.append(i)})))}createIframe(e){var t,i,a;const n=document.createElement("iframe");return n.width=560,n.height=315,n.title=null!==(t=null===(i=this.element)||void 0===i||null===(a=i.dataset)||void 0===a?void 0:a.title)&&void 0!==t?t:"Play",n.allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",n.allowFullscreen=!0,n.src=`https://www.youtube-nocookie.com/embed/${encodeURIComponent(this.videoId)}?${e.toString()}`,this.element.append(n),n}}window.addEventListener("DOMContentLoaded",(function(){const t=document.querySelectorAll(".wp-block-boldblocks-youtube-block .yb-player");t&&t.length&&t.forEach((t=>new e(t,t.parentNode.classList.contains("force-iframe"))))}))}();