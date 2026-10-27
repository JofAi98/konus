// Themes: ten words at a time around one topic. Hear them from English, then guess them from Turkish.
// Three right guesses and a word goes to your vocab. Finish a theme to open the next one.
// Each word: "turkish=english" with an optional "| note".

const T = (id, title, tr, rank, words) => ({
  id, title, tr, rank,
  words: words.map((w) => {
    const [pair, note = ''] = w.split('|').map((s) => s.trim());
    const i = pair.indexOf('=');
    return { tr: pair.slice(0, i).trim(), en: pair.slice(i + 1).trim(), note };
  }),
});

export const NEED = 3;

export const THEMES = [
  T('greetings', 'Greetings', 'Selamlaşma', 'A1', [
    'merhaba=hello', 'selam=hi', 'günaydın=good morning', 'iyi akşamlar=good evening', 'iyi geceler=good night',
    'hoş geldin=welcome', 'görüşürüz=see you', 'hoşça kal=bye (when you leave) | The one who stays says "güle güle".',
    'teşekkürler=thanks', 'lütfen=please',
  ]),
  T('family', 'Family', 'Aile', 'A1', [
    'anne=mum', 'baba=dad', 'kardeş=brother or sister', 'abla=older sister | Also how you call any young woman a bit older than you.',
    'abi=older brother', 'anneanne=grandma (mum\'s mother)', 'babaanne=grandma (dad\'s mother)',
    'teyze=aunt (mum\'s sister) | Also any older woman, even a stranger.', 'amca=uncle (dad\'s brother) | Also any older man.', 'kuzen=cousin',
  ]),
  T('food', 'Food and drink', 'Yemek ve içecek', 'A1', [
    'ekmek=bread', 'su=water', 'çay=tea', 'kahve=coffee', 'peynir=cheese',
    'et=meat', 'tavuk=chicken', 'balık=fish', 'sebze=vegetables', 'meyve=fruit',
  ]),
  T('home', 'Home', 'Ev', 'A1', [
    'ev=house, home', 'oda=room', 'mutfak=kitchen', 'banyo=bathroom', 'yatak=bed',
    'masa=table', 'sandalye=chair', 'kapı=door', 'pencere=window', 'anahtar=key',
  ]),
  T('love', 'Love', 'Aşk', 'A1', [
    'aşk=love', 'sevgili=boyfriend, girlfriend', 'sevmek=to love', 'öpücük=kiss', 'sarılmak=to hug',
    'kalp=heart', 'özlemek=to miss', 'güzel=beautiful', 'birlikte=together', 'sonsuza dek=forever',
  ]),
  T('time', 'Time', 'Zaman', 'A1', [
    'bugün=today', 'yarın=tomorrow', 'dün=yesterday', 'şimdi=now', 'sonra=later',
    'sabah=morning', 'akşam=evening', 'gece=night', 'hafta=week', 'saat=hour, clock',
  ]),
  T('weather', 'Weather', 'Hava', 'A1', [
    'hava=weather', 'güneş=sun', 'yağmur=rain', 'kar=snow', 'rüzgâr=wind',
    'sıcak=hot', 'soğuk=cold', 'bulut=cloud', 'yaz=summer', 'kış=winter',
  ]),
  T('city', 'City', 'Şehir', 'A1', [
    'şehir=city', 'sokak=street', 'otobüs=bus', 'taksi=taxi', 'istasyon=station',
    'havalimanı=airport', 'otel=hotel', 'market=supermarket', 'eczane=pharmacy', 'hastane=hospital',
  ]),
  T('shopping', 'Shopping', 'Alışveriş', 'A1', [
    'para=money', 'fiyat=price', 'ucuz=cheap', 'pahalı=expensive', 'indirim=discount',
    'kart=card', 'nakit=cash', 'fiş=receipt', 'çanta=bag', 'almak=to buy, to take',
  ]),
  T('feelings', 'Feelings', 'Duygular', 'A1', [
    'mutlu=happy', 'üzgün=sad', 'yorgun=tired', 'kızgın=angry', 'heyecanlı=excited',
    'korkmuş=scared', 'hasta=ill', 'aç=hungry', 'susamış=thirsty', 'sakin=calm',
  ]),
  T('body', 'Body and health', 'Vücut ve sağlık', 'A1', [
    'baş=head', 'göz=eye', 'ağız=mouth', 'el=hand', 'ayak=foot',
    'kol=arm', 'bacak=leg', 'diş=tooth', 'karın=belly', 'ağrı=pain',
  ]),
  T('sports', 'Sports and free time', 'Spor ve boş zaman', 'A1', [
    'spor=sport', 'futbol=football', 'maç=match', 'yüzmek=to swim', 'koşmak=to run',
    'yürüyüş=walk', 'oyun=game', 'müzik=music', 'film=film', 'kitap=book',
  ]),
  T('clothes', 'Clothes and colours', 'Kıyafet ve renkler', 'A1', [
    'kırmızı=red', 'mavi=blue', 'yeşil=green', 'sarı=yellow', 'siyah=black',
    'beyaz=white', 'gömlek=shirt', 'pantolon=trousers', 'elbise=dress', 'ayakkabı=shoes',
  ]),
  T('work', 'Work and study', 'İş ve okul', 'A1', [
    'iş=work, job', 'ofis=office', 'patron=boss', 'toplantı=meeting', 'okul=school',
    'öğretmen=teacher', 'öğrenci=student', 'ders=lesson', 'sınav=exam', 'bilgisayar=computer',
  ]),
  T('nature', 'Nature and animals', 'Doğa ve hayvanlar', 'A1', [
    'kedi=cat', 'köpek=dog', 'kuş=bird', 'ağaç=tree', 'çiçek=flower',
    'deniz=sea', 'dağ=mountain', 'göl=lake', 'orman=forest', 'plaj=beach',
  ]),
];

export const themeById = (id) => THEMES.find((t) => t.id === id);
export const wordKey = (theme, w) => `${theme.id}:${w.tr}`;
