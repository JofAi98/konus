// Talk: short real conversations. Listen to the whole scene, then play your part.
// Each line: [who, turkish, english, words]. "you" lines are the ones you say.

const L = (who, tr, en, w = '') => ({
  who, tr, en,
  words: w ? w.split(';').map((s) => s.trim()).filter(Boolean).map((s) => { const i = s.indexOf('='); return { tr: s.slice(0, i).trim(), en: s.slice(i + 1).trim() }; }) : [],
});

export const WHO = { you: 'You', her: 'Her', mom: 'Her mother', dad: 'Her father', waiter: 'Waiter', man: 'Passer-by', seller: 'Stallholder', friend: 'Her friend' };

export const DIALOGUES = [
  {
    id: 'dl1', level: 1, rank: 'A1', title: 'First video call', scene: 'She calls you in the evening. Answer in Turkish.',
    lines: [
      L('her', 'Merhaba aşkım!', 'Hello, my love!'),
      L('you', 'Merhaba! Nasılsın?', 'Hello! How are you?'),
      L('her', 'İyiyim, sen nasılsın?', 'I\'m fine, how are you?'),
      L('you', 'Ben de iyiyim.', 'I\'m fine too.'),
      L('her', 'Türkçe öğreniyor musun?', 'Are you learning Turkish?'),
      L('you', 'Evet! Biraz.', 'Yes! A little.'),
      L('her', 'Aferin sana!', 'Well done, you!', 'aferin=well done; sana=to you'),
      L('you', 'Teşekkürler, canım.', 'Thanks, my dear.'),
      L('her', 'Görüşürüz!', 'See you!'),
      L('you', 'Görüşürüz, iyi geceler.', 'See you, good night.'),
    ],
  },
  {
    id: 'dl2', level: 2, rank: 'A1', title: 'At the door', scene: 'You arrive at her parents\' home for the first time.',
    lines: [
      L('mom', 'Hoş geldin!', 'Welcome!'),
      L('you', 'Hoş bulduk!', 'Happy to be here!'),
      L('mom', 'Nasılsın?', 'How are you?'),
      L('you', 'İyiyim, teşekkür ederim. Siz nasılsınız?', 'I\'m fine, thank you. How are you?', 'siz=you (polite)'),
      L('mom', 'Çok iyiyim. Gel, otur.', 'Very well. Come, sit down.', 'otur=sit'),
      L('dad', 'Merhaba, hoş geldin.', 'Hello, welcome.'),
      L('you', 'Merhaba, memnun oldum.', 'Hello, nice to meet you.'),
      L('dad', 'Ben de memnun oldum. Türkçe biliyor musun?', 'Nice to meet you too. Do you know Turkish?', 'biliyor=knows'),
      L('you', 'Biraz biliyorum. Yeni başladım.', 'I know a little. I just started.'),
      L('dad', 'Çok güzel!', 'Very nice!'),
    ],
  },
  {
    id: 'dl3', level: 4, rank: 'A1', title: 'Dinner with her family', scene: 'Her mother has cooked for you.',
    lines: [
      L('mom', 'Buyurun, afiyet olsun!', 'Here you are, enjoy!', 'buyurun=here you are, please'),
      L('you', 'Teşekkür ederim. Çok güzel görünüyor.', 'Thank you. It looks great.', 'görünüyor=it looks'),
      L('her', 'Annem çok güzel yemek yapar.', 'My mum is a great cook.', 'yemek yapar=cooks'),
      L('you', 'Çok lezzetli! Ellerinize sağlık.', 'Delicious! Health to your hands.'),
      L('mom', 'Afiyet olsun, oğlum. Biraz daha ister misin?', 'Enjoy it, son. Would you like a bit more?', 'oğlum=my son'),
      L('you', 'Evet, lütfen.', 'Yes, please.'),
      L('mom', 'Çay ister misin?', 'Would you like some tea?'),
      L('you', 'Doydum, teşekkürler. Ama çay isterim!', 'I\'m full, thanks. But I\'d love some tea!', 'ama=but; isterim=I\'d like'),
    ],
  },
  {
    id: 'dl4', level: 5, rank: 'A1', title: 'Help me understand', scene: 'Her father asks you something. You don\'t catch it the first time.',
    lines: [
      L('dad', 'Ne iş yapıyorsun?', 'What do you do for work?'),
      L('you', 'Pardon, anlamadım.', 'Sorry, I didn\'t understand.', 'pardon=sorry, excuse me'),
      L('dad', 'İş. Çalışıyor musun?', 'Work. Do you work?'),
      L('you', 'Yavaş konuşur musunuz, lütfen?', 'Could you speak slowly, please?'),
      L('dad', 'Tabii. Ne... iş... yapıyorsun?', 'Of course. What... work... do you do?', 'tabii=of course'),
      L('you', 'Anladım! Türkçede nasıl denir?', 'I get it! How do you say it in Turkish?', 'anladım=I understood'),
      L('her', 'Ben söylerim.', 'I\'ll say it.', 'söylerim=I\'ll say'),
      L('dad', 'Aferin, çok iyi konuşuyorsun!', 'Well done, you speak very well!'),
      L('you', 'Teşekkür ederim, çok naziksiniz.', 'Thank you, you\'re very kind.', 'nazik=kind, polite'),
    ],
  },
  {
    id: 'dl5', level: 7, rank: 'A1', title: 'At the café', scene: 'You order for both of you, then pay.',
    lines: [
      L('waiter', 'Hoş geldiniz! Ne alırsınız?', 'Welcome! What would you like?', 'alırsınız=you\'ll have'),
      L('you', 'İki çay, lütfen.', 'Two teas, please.'),
      L('waiter', 'Başka bir şey?', 'Anything else?', 'başka=other; şey=thing'),
      L('her', 'Bir de su, lütfen.', 'And a water, please.'),
      L('waiter', 'Tabii, hemen geliyor.', 'Of course, coming right up.', 'hemen=right away'),
      L('you', 'Hesap, lütfen.', 'The bill, please.'),
      L('waiter', 'Yüz lira.', 'A hundred lira.'),
      L('you', 'Kartla ödeyebilir miyim?', 'Can I pay by card?'),
      L('waiter', 'Tabii, buyurun.', 'Of course, here you go.'),
      L('you', 'Teşekkürler, kolay gelsin!', 'Thanks, hope work goes easy!'),
    ],
  },
  {
    id: 'dl6', level: 9, rank: 'A1', title: 'Where are you?', scene: 'She calls you on her way home from work.',
    lines: [
      L('her', 'Alo, neredesin?', 'Hello, where are you?', 'alo=hello (on the phone)'),
      L('you', 'Evdeyim. Sen neredesin?', 'I\'m at home. Where are you?'),
      L('her', 'İşteyim, ama birazdan çıkıyorum.', 'I\'m at work, but I\'m leaving soon.', 'birazdan=soon; çıkıyorum=I\'m leaving'),
      L('you', 'Nereye gidiyorsun?', 'Where are you going?'),
      L('her', 'Markete gidiyorum. Bir şey istiyor musun?', 'I\'m going to the supermarket. Do you want anything?'),
      L('you', 'Evet, ekmek ve süt, lütfen.', 'Yes, bread and milk, please.', 've=and; süt=milk'),
      L('her', 'Tamam. Akşam görüşürüz!', 'Okay. See you this evening!'),
      L('you', 'Görüşürüz aşkım, dikkat et!', 'See you, love. Be careful!', 'dikkat et=be careful'),
    ],
  },
  {
    id: 'dl7', level: 11, rank: 'A1', title: 'Asking the way', scene: 'You\'re in Istanbul, looking for the Galata Tower.',
    lines: [
      L('you', 'Affedersiniz, Galata Kulesi nerede?', 'Excuse me, where is the Galata Tower?', 'affedersiniz=excuse me; kule=tower'),
      L('man', 'Düz gidin, sonra sağa dönün.', 'Go straight on, then turn right.', 'sonra=then, after'),
      L('you', 'Düz, sonra sağa. Uzak mı?', 'Straight, then right. Is it far?'),
      L('man', 'Hayır, yakın. Beş dakika.', 'No, it\'s close. Five minutes.'),
      L('you', 'Çok teşekkür ederim!', 'Thank you very much!'),
      L('man', 'Rica ederim. İyi günler!', 'You\'re welcome. Have a nice day!', 'iyi günler=have a nice day'),
      L('you', 'Size de!', 'You too!', 'size=to you (polite)'),
    ],
  },
  {
    id: 'dl8', level: 13, rank: 'A1', title: 'How was your day?', scene: 'Evening. You both talk about the day.',
    lines: [
      L('her', 'Günün nasıl geçti?', 'How was your day?'),
      L('you', 'İyiydi. Çok çalıştım. Seninki?', 'Good. I worked a lot. Yours?', 'iyiydi=it was good; seninki=yours'),
      L('her', 'Yorucuydu. Annemle alışverişe gittik.', 'Tiring. Mum and I went shopping.', 'yorucu=tiring; alışveriş=shopping'),
      L('you', 'Ne aldınız?', 'What did you buy?'),
      L('her', 'Sana bir hediye aldım!', 'I bought you a present!', 'hediye=present, gift'),
      L('you', 'Gerçekten mi? Ne aldın?', 'Really? What did you buy?', 'gerçekten=really'),
      L('her', 'Söylemem, sürpriz!', 'I won\'t tell you, it\'s a surprise!'),
      L('you', 'Of ya! Çok merak ettim.', 'Oh, come on! Now I\'m really curious.', 'merak ettim=I got curious'),
    ],
  },
  {
    id: 'dl9', level: 15, rank: 'A1', title: 'Weekend plans', scene: 'You\'re deciding what to do on Saturday.',
    lines: [
      L('you', 'Hafta sonu ne yapalım?', 'What shall we do at the weekend?'),
      L('her', 'Bilmiyorum. Sen ne istiyorsun?', 'I don\'t know. What do you want?'),
      L('you', 'Denize gidelim mi?', 'Shall we go to the sea?'),
      L('her', 'Ama hava soğuk!', 'But it\'s cold!', 'hava=weather, air; soğuk=cold'),
      L('you', 'O zaman film izleyelim.', 'Then let\'s watch a film.', 'o zaman=then, in that case'),
      L('her', 'Olur! Hangi film?', 'Okay! Which film?', 'olur=okay, works for me; hangi=which'),
      L('you', 'Sen seç.', 'You choose.', 'seç=choose'),
      L('her', 'Tamam, ama patlamış mısır senden!', 'Okay, but the popcorn\'s on you!', 'patlamış mısır=popcorn; senden=from you'),
      L('you', 'Anlaştık!', 'Deal!', 'anlaştık=we agreed'),
    ],
  },
  {
    id: 'dl10', level: 17, rank: 'A1', title: 'At the market', scene: 'Buying fruit and vegetables. Try to get a better price.',
    lines: [
      L('seller', 'Buyurun, ne istiyorsunuz?', 'Go ahead, what would you like?'),
      L('you', 'Bir kilo domates, lütfen.', 'A kilo of tomatoes, please.', 'domates=tomatoes'),
      L('seller', 'Başka?', 'Anything else?'),
      L('you', 'Elmalar ne kadar?', 'How much are the apples?', 'elma=apple'),
      L('seller', 'Kilosu otuz lira.', 'Thirty lira a kilo.'),
      L('you', 'Çok pahalı! Yirmi olur mu?', 'Too expensive! Could you do twenty?', 'olur mu=is it okay'),
      L('seller', 'Yirmi beş, son fiyat.', 'Twenty-five, final price.', 'son=last; fiyat=price'),
      L('you', 'Tamam, iki kilo alayım.', 'Okay, I\'ll take two kilos.', 'alayım=let me take'),
      L('seller', 'Afiyet olsun!', 'Enjoy!'),
    ],
  },
  {
    id: 'dl11', level: 19, rank: 'A1', title: 'Meeting her friend', scene: 'Her best friend joins you at a café.',
    lines: [
      L('friend', 'Merhaba! Sen {name} misin?', 'Hi! Are you {name}?'),
      L('you', 'Evet, benim. Memnun oldum!', 'Yes, that\'s me. Nice to meet you!', 'benim=it\'s me'),
      L('friend', 'Ben de! Türkçen çok iyi!', 'Me too! Your Turkish is really good!', 'türkçen=your Turkish'),
      L('you', 'Sağ ol, ama daha çok öğrenmem lazım.', 'Thanks, but I still have a lot to learn.', 'lazım=needed'),
      L('friend', 'İtalya\'yı özlüyor musun?', 'Do you miss Italy?', 'özlüyor=misses'),
      L('you', 'Bazen. En çok yemeği özlüyorum!', 'Sometimes. I miss the food most of all!', 'bazen=sometimes; en çok=most'),
      L('her', 'Ama Türk yemeklerini de çok seviyor!', 'But he loves Turkish food too!'),
      L('you', 'Evet, özellikle mantıyı!', 'Yes, especially mantı!', 'özellikle=especially; mantı=Turkish dumplings'),
      L('friend', 'Bravo! Gerçek bir Türk olmuşsun!', 'Bravo! You\'ve turned into a real Turk!', 'gerçek=real'),
    ],
  },
  {
    id: 'dl12', level: 20, rank: 'A1', title: 'Saying goodbye', scene: 'Leaving her parents\' home at the end of the evening.',
    lines: [
      L('you', 'Artık gitmem lazım.', 'I have to go now.', 'artık=now, by now'),
      L('mom', 'Bu kadar erken mi?', 'So early?', 'erken=early'),
      L('you', 'Evet, maalesef. Her şey için teşekkür ederim.', 'Yes, unfortunately. Thank you for everything.', 'maalesef=unfortunately; her şey=everything; için=for'),
      L('dad', 'Biz teşekkür ederiz. Yine bekleriz!', 'Thank you. Come again!', 'yine=again; bekleriz=we\'ll be expecting you'),
      L('you', 'Mutlaka gelirim.', 'I\'ll definitely come.', 'mutlaka=definitely'),
      L('mom', 'Kendine iyi bak, oğlum.', 'Take care of yourself, son.', 'kendine iyi bak=take good care of yourself'),
      L('you', 'Siz de. Hoşça kalın!', 'You too. Goodbye!', 'kalın=stay (polite)'),
      L('mom', 'Güle güle!', 'Bye!'),
    ],
  },
];

export const dialogueById = (id) => DIALOGUES.find((d) => d.id === id);
