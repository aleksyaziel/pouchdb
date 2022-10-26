//imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v2';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const APP_SHELL = [
    //'/',
    'index.html',
    'style/base.css',
    'style/bg.png',
    'js/app.js',
    'js/base.js'
];

const APP_SHELL_INMUTABLE = [
    'https://cdn.jsdelivr.net/npm/pouchdb@7.3.0/dist/pouchdb.min.js'
    //'https://fonts.googleapis.com/css?family=Lato:400,300',
    //'https://use.fontawesome.com/releases/v5.3.1/css/all.css'
    //'css/animate.css',
    //'js/libs/jquery.js'
];


self.addEventListener('install',e=>{
    //abrir un cache para almacenar cosas ahí
    const cacheStatic = caches.open(STATIC_CACHE).then(cache=>
        cache.addAll(APP_SHELL));
    const cacheInmutable = caches.open(INMUTABLE_CACHE).then(cache=>        
        cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
}); 

self.addEventListener('activate',e=>{
    const respuesta=caches.keys().then(keys=>{
        keys.forEach(key=>{
            if(key!=STATIC_CACHE && key.includes('static')){
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(respuesta);
});

//Estrategia 1. Cache-only
self.addEventListener('fetch',event=>{
    const respuesta = caches.match(event.request).then(resp=>{
         if(resp){
            return resp;
         } else{
            return fetch(event.request).then(newResp=>{
                return actualizaCacheDinamico(DYNAMIC_CACHE, event.request, newResp);
            });
         }
    });
    event.respondWith(respuesta); 
});



/*
function limpiarCache(cacheName,numeroItems){
    caches.open(cacheName)
    .then(cache =>{
        cache.keys()
        .then((keys=>{
            if(keys.length>numeroItems){
                cache.delete(keys[0])
                .then(limpiarCache(cacheName,numeroItems));
            }
        }))
    })
}

self.addEventListener('install',event=>{
    //abrir un cache para almacenar cosas ahí
    const cacheProm = caches.open('estatico-v1')
    
    const cacheProm2 = caches.open('estatico-v2')
    const cacheProm3 = caches.open('estatico-v3')
    const cacheProm4 = caches.open('estatico-v4')
    .then(cache=>{
        return cache.addAll([
            '/',
            '/index.html',
            '/css/style.css',
            '/img/main.jpg',
            'js/app.js',
            '/img/no-img.jpg',
            '/img/offline.jfif',
            '/pages/offline.html'
        ]);
    });

    const cacheInmutable = caches.open('inmutable-v1')
    .then(cache =>{
        return cache.add('https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/css/bootstrap.min.css');
    });
    event.waitUntil(Promise.all([cacheProm, cacheInmutable]));
}); 


self.addEventListener('fetch',event=>{
    const respuesta = caches.match(event.request)
     .then(resp=>{
         if(resp) return resp;

        //si no existe el recurso, tenemos que conectarnos a Internet
        console.log('No existe', event.request.url);
        return fetch(event.request).then(newResp=>{

            caches.open('dinamico-v1')
            .then(cache =>{
                cache.put(event.request,newResp);
                limpiarCache('dinamico-v1',4);
            });
            return newResp.clone();
        })
        .catch(err=>caches.match('pages/offline.html'));
    });
    event.respondWith(respuesta); 
});

//elimina los caches antiguos
self.addEventListener('activate',event=>{
    const respuesta=caches.keys().then(keys=>{
        keys.forEach(key=>{
            if(key!='estatico-v4' && key.includes('estatico')){
                return caches.delete(key);
            }
        });
    });
    event.waitUntil(respuesta);
});

*/