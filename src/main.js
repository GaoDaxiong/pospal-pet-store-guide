if(location.search.includes('shot')){document.documentElement.classList.add('noanim');document.querySelectorAll('img[loading]').forEach(i=>{i.loading='eager';i.decoding='sync'})}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{rootMargin:'0px 0px -8% 0px'});
document.querySelectorAll('.fade').forEach(el=>io.observe(el));
const nav=document.querySelector('.nav');addEventListener('scroll',()=>nav.classList.toggle('s',scrollY>10),{passive:true});
const lb=document.querySelector('.lb'),li=lb.querySelector('img');
document.addEventListener('click',e=>{const t=e.target.closest('img[data-full]');if(t){li.src=t.dataset.full;li.alt=t.alt;lb.hidden=false;document.body.style.overflow='hidden'}});
const close=()=>{lb.hidden=true;li.removeAttribute('src');document.body.style.overflow=''};
lb.addEventListener('click',close);addEventListener('keydown',e=>{if(e.key==='Escape')close()});
