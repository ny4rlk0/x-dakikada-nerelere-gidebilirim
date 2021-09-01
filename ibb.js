//2021 © Her hakkı gizlidir ve Nyarlko'ya aittir.
var nyaVersion='v65/PUBLIC_MAIN_RELEASE_STABLE'; //sürüm kodu / stabilite
var ny4='rlk0';
const nyaa_desu=null,dds=[];
const tanimsiz=undefined;
let harita,gidis_yontemi='DRIVING';
var cember_alani,geocode,bilgipenceresi,anlik_konum,anlik_konum_obje=new google.maps.LatLng(41.013652686519606,28.955476284027043),a_lat,a_lng,akonum=[],adresObje,adresMarker=[];
var haritada_isaretli_yerler=[],tum_konumlar=[];
var konum_ayarlari={enableHighAccuracy:true,timeout:5000,maximumAge:0};
var sorgulama_modu=1;
var ibb_bina={'lat':41.013556652651154, 'lng':28.95493828412249};
const bilgilendirme_mesaji=`Bilgilendirme Mesajı:
Sistem varsayılan ayarları yüzünden ve yeterince konum olmadığı için test modunda başlatıldı.
Test modunu kapatarak gerçek konumunuz ile hesaplayabilirsiniz.
Lakin veritabani.json içerisinde, belirttiğiniz dakikada size yakın bir konum yoksa.
Konum bulunamadı uyarısı alacaksınız.`;
async function anlik_konumu_bul(){
  adres = $('#adres').val();
  sorgulama_modu = $('#sorgulama_modu').val();
  if (sorgulama_modu==1){sorgulama_modu="otomatik";}
  else if(sorgulama_modu==2){sorgulama_modu="adres";}
  else{sorgulama_modu="otomatik";}
  if (sorgulama_modu==="adres"){
    console.log('SorgulamaModu: '+sorgulama_modu);
    await addr();
  }
  else if(sorgulama_modu==="otomatik"){console.log('SorgulamaModu: '+sorgulama_modu);await loc();}
}
async function loc(){
  //anlik_konum=nyaa_desu;
  //anlik_konum_obje=nyaa_desu;
  //await clearMap();
  //await resetMap();
  async function hata(hat){console.log("loc: "+hat);}
  async function basarili(kon){
    var k=kon.coords;
    const konum={'lat':parseFloat(k.latitude),'lng':parseFloat(k.longitude)}
    anlik_konum=konum;
    const a=JSON.parse(JSON.stringify(konum));
    a_lat=parseFloat(a.lat);
    a_lng=parseFloat(a.lng);
    anlik_konum_obje= await new google.maps.LatLng(a_lat,a_lng);
    console.log(anlik_konum);
    await konumuIsaretle();
    return anlik_konum_obje;
  }
  navigator.geolocation.getCurrentPosition(basarili,hata, konum_ayarlari);
  return anlik_konum_obje;
}
async function addr(){
  //anlik_konum=nyaa_desu;
  //anlik_konum_obje=nyaa_desu;
  //await resetMap();
  var geocoder = new google.maps.Geocoder();
  await geocoder.geocode( { 'address': adres}, async function(sonuc, durum) {
    async function x(){
      var lat= parseFloat(sonuc[0].geometry.location.lat());
      var lng= parseFloat(sonuc[0].geometry.location.lng());
      console.log("lat: "+lat+"lng: "+lng);
      anlik_konum_obje= await new google.maps.LatLng(lat,lng);
      anlik_konum={'lat':lat,' lng':lng}
      console.log("AKO: "+anlik_konum_obje);
      console.log("AK: "+anlik_konum);
      await konumuIsaretle();
      }
    if (durum == google.maps.GeocoderStatus.OK){await x();}
  });}
$.ajax({
  'async': true,
  'global': true,
  'url': "https://www.nyarlko.com/veritabani.json",
  'dataType': "json",
  'success': function(data) {
    json = data;
    tum_konumlar=data['veritabani'];
    if (tum_konumlar!=nyaa_desu){ 
      console.log(tum_konumlar);
      console.log('Konumları içeren veri tabanı başarıyla indirildi.');
    }
  }
});
//Mapi örnekle
jQuery(document).ready(async function(){
  await resetMap();
  await anlik_konumu_bul();
});
async function konumuIsaretle(){
          try{yeni_isaretli_hedef.setMap(nyaa_desu);}//Önce marker varsa Markeri sil
          catch(e){console.log("İşaretli yerler temizlendi.");}
          var yeni_isaretli_hedef=new google.maps.Marker({position:anlik_konum_obje,map:harita,icon:'kirmizi_ok_x32.png',title:'Konum'});
          if(bilgipenceresi){
            bilgipenceresi.setMap(nyaa_desu);
            bilgipenceresi=nyaa_desu;
            clearMap();//Mapi temizle
          }
          google.maps.event.addListener(yeni_isaretli_hedef, 'click', function() {
            bilgipenceresi = new google.maps.InfoWindow({
              content: '<div style="color:red">'+'Konumum'+'</div>'+'Mevcut Konumum.',
              size: new google.maps.Size(150,50),
              pixelOffset: new google.maps.Size(0,-30),position:anlik_konum_obje,map:harita
            });
            bilgipenceresi.setPosition(anlik_konum_obje);
            bilgipenceresi.setContent('<div style="color:red">'+'Konumum'+'</div>'+'Mevcut Konumum.');
            harita.setCenter(anlik_konum);
            haritada_isaretli_yerler.push(yeni_isaretli_hedef);
          });
          //bilgipenceresi.open(await harita,await yeni_isaretli_hedef);//konum penceresini aç bir şekilde
          harita.panTo(anlik_konum_obje);       
}
async function konumuAcKapa(){
  var geocoder = new google.maps.Geocoder();
  async function rotalariTemizle(){
    console.log('Rotalar temizleniyor...');
    dds.forEach(dd => {dd.setMap(null);});
    dds.length = 0;
  }
  alert('Rotalar hesaplanıyor.');
  await anlik_konumu_bul();
  var neko;
  adres = $('#adres').val();
  gidis_yontemi = $('#gidis_yontemi').val(); //Neyle gidicek bu insanlar yürüyerek mi arabayla mı bisikletle mi?
  let dakika = $('#dakika').val();
  sorgulama_modu = $('#sorgulama_modu').val();
  if (sorgulama_modu==1){sorgulama_modu="otomatik";}
  else if(sorgulama_modu==2){sorgulama_modu="adres";}
  else{sorgulama_modu="otomatik";}
  if (gidis_yontemi=='1'){gidis_yontemi='DRIVING';}// ARABA
  else if (gidis_yontemi=='2'){gidis_yontemi='WALKING';}//DEAD   //Tabanway                (Yürüyüş)
  else if (gidis_yontemi=='3'){gidis_yontemi='BICYCLING';}// Bisiklet
  else if (gidis_yontemi=='4'){gidis_yontemi='TRANSIT';}// Toplu Seyahat
  else {gidis_yontemi='DRIVING';}//Source code ile oynamışlar biz varsayılan seçeneğimize gidelim.
  for (neko=0;neko < haritada_isaretli_yerler.length; neko++){
    if(haritada_isaretli_yerler[neko]){
      haritada_isaretli_yerler[neko].setMap(nyaa_desu);
      haritada_isaretli_yerler[neko]=nyaa_desu;
    }
  }
  if(geocoder){//      'location':anlik_konum
    console.log(anlik_konum);
    console.log(anlik_konum_obje);
    geocoder.geocode({'location':anlik_konum_obje},function(sonuc,durum){// 
      if(durum==google.maps.GeocoderStatus.OK){
        if(durum!=google.maps.GeocoderStatus.ZERO_RESULTS){
          console.log(sonuc);
          adres_enboy=anlik_konum_obje//sonuc[0].geometry.location;//{lat:a_lat,lng:a_lng}//sonuc[0].geometry.location;
          if (ny4!='rlk0'){return;}// Hah jokes on you.
          console.log('Veritabanındaki konum sayısı: '+tum_konumlar.length);
          rotalariTemizle();//haritadaki rotaları kaldır.
    //if(cember_alani) harita.fitBounds(cember_alani.getBounds());
          for (var miyav=0;miyav<tum_konumlar.length;miyav++){
                  (async function (konum){
                          let dk=parseInt(dakika);//dakikayı integer dönüştürüp dk değişkenine atayalım
                          var hedef_enboy = new google.maps.LatLng(parseFloat(konum.lat),parseFloat(konum.lng));
                          let seyahat_zamani_holder,a,b,c,yolcusaat,yolcudakika,yolcugun,yolcusaatvarmi=false,yolcudakikavarmi=false,yolcugunvarmi=false;
                          console.log('AdresEnBoy: '+adres_enboy);
                          console.log('AnlikKonum: '+anlik_konum);
                          var konumdan_hedefe_uzaklik= google.maps.geometry.spherical.computeDistanceBetween(adres_enboy,hedef_enboy);//Bulunduğun konum ile işaret arasındaki metre cinsinden mesafe
                          konumdan_hedefe_uzaklik=Math.floor(konumdan_hedefe_uzaklik);
                          console.log(konumdan_hedefe_uzaklik);
                          if(konumdan_hedefe_uzaklik<=1000){konumdan_hedefe_uzaklik=konumdan_hedefe_uzaklik+" m"}
                          else if(konumdan_hedefe_uzaklik>=1000){konumdan_hedefe_uzaklik= Math.floor((konumdan_hedefe_uzaklik/1000));konumdan_hedefe_uzaklik=konumdan_hedefe_uzaklik+" km"}
                          try{a= await gidisZamaniHesapla(adres_enboy,hedef_enboy);}//Cevap objemizi alalım
                          catch(e){console.clear;alert('Seçtiğiniz seyahat yöntemi ile gidilebilecek bir yada birden fazla yere rota bulunamadı.');return;} //LOL rota bulmazsa fonksiyonu durduruyor
                          b= await JSON.parse(JSON.stringify(a));//Cevap Objesini stringe dönüştürelim
                          //console.log(a); //konum bilgilerini görmek istiyorsan uncomment yap
                          b= await b.routes[0].legs[0].duration.text;//Cevap objesinden sadece Seyahat zamanını alalım
                          if(b.includes("saat")&&b.includes("dakika")&&!b.includes("gün")){
                            yolcusaatvarmi=true;
                            yolcudakikavarmi=true;
                            yolcugunvarmi=false;
                            console.log(b);
                            b=b.replace("dakika","");
                            b=b.replace("saat","");
                            console.log(b);
                            b=b.replace("  "," ");
                            console.log(b);
                            b=b.split(" ");
                            console.log(b);
                            yolcusaat=parseInt(b[0]);
                            yolcudakika=parseInt(b[1]);
                            console.log("s: "+yolcusaat);
                            console.log("d: "+yolcudakika);
                          }
                          else if(b.includes("saat")&&!b.includes("dakika")&&!b.includes("gün")){
                            yolcusaatvarmi=true;
                            yolcudakikavarmi=false;
                            yolcugunvarmi=false;
                            console.log(b);
                            b=b.replace("saat","");
                            console.log(b);
                            b=b.replace("  "," ");
                            console.log(b);
                            b=b.split(" ");
                            console.log(b);
                            yolcusaat=parseInt(b[0]);
                            yolcudakika=parseInt(b[1]);
                            console.log("s: "+yolcusaat);
                            console.log("d: "+yolcudakika);
                          }
                          else if(b.includes("dakika")&&!b.includes("saat")&&!b.includes("gün")){
                            yolcusaatvarmi=false;
                            yolcudakikavarmi=true;
                            yolcugunvarmi=false;
                            yolcusaat=0;
                            console.log(b);
                            b=b.replace("dakika","");
                            yolcudakika=parseInt(b);
                            console.log(b);
                          }
                          else if(b.includes("saat")&&b.includes("gün")&&!b.includes("dakika")){
                            yolcusaatvarmi=true;
                            yolcugunvarmi=true;
                            yolcudakikavarmi=false;
                            console.log(b);
                            b=b.replace("gün","");
                            b=b.replace("saat","");
                            b=b.replace("  "," ");
                            console.log(b);
                            b=b.split(" ");
                            console.log(b);
                            yolcugun=parseInt(b[0]);
                            yolcusaat=parseInt(b[1]);
                            console.log(b);
                          }
                          if(yolcusaatvarmi===true&&yolcudakikavarmi===true){seyahat_zamani_holder=Math.floor((yolcusaat*60)+yolcudakika);}
                          else if(yolcusaatvarmi===false&&yolcudakikavarmi===true){seyahat_zamani_holder= Math.floor(yolcudakika);}
                          else if(yolcusaatvarmi===true&&yolcudakikavarmi===false){seyahat_zamani_holder= Math.floor(yolcusaat*60);}
                          else if(yolcusaatvarmi===true&&yolcugunvarmi===true&&yolcudakikavarmi===false){seyahat_zamani_holder= Math.floor( (yolcusaat*60)+((yolcugun*24)*60)) ;}
                          else{return;}
                          nekowait(200);//200ms bekleme süresi koyalım rota başına hesaplama için.
                          let local_sure=seyahat_zamani_holder;//seyahat zamani integer dönüştürüp local_sure değişkenine atayalım                     
                          if (local_sure<=dk ){//&& konumdan_hedefe_uzaklik<=dk*1000){//konumdan_hedefe_uzaklik<=alan_km*1000){// Sadece seçilen süreden az zamanda gidilebilecek yerler gösterilsin. (konumdan_hedefe_uzaklik<=alan_km*1000)
                                  const dd= new google.maps.DirectionsRenderer({suppressMarkers:true});//suppressMarkers İşaretleri kaldırıyor A B şeklindeki
                                  let seyahat_zaman_stringi=null;
                                  if (yolcudakikavarmi===true&&yolcusaatvarmi===true&&yolcugunvarmi===false){
                                    seyahat_zaman_stringi=yolcusaat+" saat "+yolcudakika+" dakika";
                                  }
                                  else if (yolcudakikavarmi===false&&yolcusaatvarmi===true&&yolcugunvarmi===false){
                                    seyahat_zaman_stringi=yolcusaat+" saat ";
                                  }
                                  else if (yolcudakikavarmi===true&&yolcusaatvarmi===false&&yolcugunvarmi===false){
                                    seyahat_zaman_stringi=yolcudakika+" dakika";
                                  }
                                  else if (yolcudakikavarmi===false&&yolcusaatvarmi===true&&yolcugunvarmi===true){
                                    seyahat_zaman_stringi=yolcugun+" gün "+yolcusaat+" saat";
                                  }
                                  dd.setMap(harita);
                                  dd.setDirections(a);//Rotayı ekranda göster.
                                  var yeni_isaretli_hedef=new google.maps.Marker({
                                    position:hedef_enboy,
                                    map:harita,
                                    icon:'mavi_ok_x32.png',
                                    title:konum.name});
                                  google.maps.event.addListener(yeni_isaretli_hedef, 'click', function() {
                                    if(bilgipenceresi){
                                      bilgipenceresi.setMap(nyaa_desu);
                                      bilgipenceresi=nyaa_desu;
                                    }
                                    bilgipenceresi = new google.maps.InfoWindow({
                                      content: '<div style="color:red">'+konum.name +'</div>' + "Sizden " + konumdan_hedefe_uzaklik + " uzakta. "+'</br>'+'Seyahat zamani: '+seyahat_zaman_stringi+'.',
                                      size: new google.maps.Size(150,50),
                                      pixelOffset: new google.maps.Size(0,-30),
                                      position:hedef_enboy,
                                      map:harita
                                    });
                                  });
                                  haritada_isaretli_yerler.push(yeni_isaretli_hedef);
                                  dds.push(dd);//Direction renderer(dd) imizi direction renderers listesine ekleyelim(dds)* Sebebi daha sonra çabucak rotaları silmek için
                          }
                  })(tum_konumlar[miyav]);       
          }
        }else {alert('Hiçbir sonuç bulunamadı! Teheee :P');}
      }else {alert('Geocode başarısız: '+durum+'.');}
    });
  }
}
async function gidisZamaniHesapla(bas_enboy,bit_enboy){//Başlangıç bitiş Enlem Boylam
  var ds = new google.maps.DirectionsService;//API'yi örnekleyelim
  console.log('Seyahat Tipi: '+gidis_yontemi);
  var t= await ds.route({origin: bas_enboy,destination: bit_enboy,travelMode: gidis_yontemi},nekoback);
  return t;
  }
async function nekoback(cevap,durum){///Gidiş zamanı hesaplama fonksyonu için Callback 
  var a= await cevap;
  //if (durum=='ZERO_RESULTS'){console.clear();alert('Seçtiğiniz seyahat yöntemi ile gidilebilecek rota bulunamadı.');}
  if (durum=='OK'){console.log(a);return a;}//obje
  else{console.clear();console.log('Hata: Rotaların birini hesaplarken bir sorunla karşılaştım. (?_?)');return;}
  }
function nekowait(ms){//Fonksiyonu askıya alma scripti.
    var d = new Date();
    var d2 = nyaa_desu;
    do { d2 = new Date(); }
    while(d2-d < ms);
}
async function clearMap(){
  console.log('Harita temizleniyor...');
  var dd= new google.maps.DirectionsRenderer({suppressMarkers:true});
  haritada_isaretli_yerler=[];
  // Clear past routes
  if (dd != nyaa_desu) {//Mapi temizle
    dd.setMap(nyaa_desu);
    dd.set('directions', nyaa_desu);
    dd.set('routes', nyaa_desu);
    dd.length = 0;
    dd = nyaa_desu;          
    }
}
async function resetMap(){
  var ekAyarlar={
    zoom:18,
    center:anlik_konum_obje,//enboy,//anlik_konum,
    mapTypeControl:true,
    mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
    navigationControl:true,
    mapTypeId: google.maps.MapTypeId.ROAD_MAP // ROAD_MAP:Renksiz çizim // SATELLITE: Uydu görüntüsü
  };
  harita= new google.maps.Map(document.getElementById('map_arayuzu') ,ekAyarlar);
  geocoder= new google.maps.Geocoder();
  bilgipenceresi = new google.maps.InfoWindow();
  google.maps.event.addListener(harita,'click',function(){
    if(bilgipenceresi){
      bilgipenceresi.setMap(nyaa_desu);
      bilgipenceresi= nyaa_desu;
    }
  });
}
