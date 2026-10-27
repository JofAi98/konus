// Stories: short listening built from words the course has taught.
// Listen first without text, then answer three questions. Each line: [turkish, english, words].

const S = (tr, en, w = '') => ({
  tr, en,
  words: w ? w.split(';').map((s) => s.trim()).filter(Boolean).map((s) => { const i = s.indexOf('='); return { tr: s.slice(0, i).trim(), en: s.slice(i + 1).trim() }; }) : [],
});
const Q = (q, options, a) => ({ q, options, a });

export const STORIES = [
  {
    id: 's1', level: 10, rank: 'A1', title: 'Bir çay', en: 'A tea',
    lines: [
      S('Bugün hava çok güzel.', 'The weather is lovely today.', 'bugün=today; hava=weather'),
      S('{name} bir kafede.', '{name} is at a café.', 'kafe=café'),
      S('Garson geliyor.', 'The waiter comes over.', 'garson=waiter'),
      S('"Merhaba! Ne istersiniz?"', '"Hello! What would you like?"'),
      S('"Bir çay, lütfen."', '"A tea, please."'),
      S('Çay çok sıcak ve çok lezzetli.', 'The tea is very hot and very tasty.', 'sıcak=hot'),
      S('Telefonda bir mesaj var: "Neredesin, aşkım?"', 'There\'s a message on the phone: "Where are you, love?"', 'telefonda=on the phone; mesaj=message'),
      S('{name} gülüyor ve yazıyor: "Kafedeyim. Gel!"', '{name} smiles and writes: "I\'m at the café. Come!"', 'gülüyor=smiles, laughs; yazıyor=writes'),
      S('On dakika sonra o da geliyor.', 'Ten minutes later she comes too.', 'da=too, also'),
      S('"İki çay, lütfen!"', '"Two teas, please!"'),
    ],
    questions: [
      Q('Where is {name}?', ['At home', 'At a café', 'At work'], 1),
      Q('What does he order first?', ['A coffee', 'A water', 'A tea'], 2),
      Q('Who arrives ten minutes later?', ['The waiter', 'His girlfriend', 'Her mother'], 1),
    ],
  },
  {
    id: 's2', level: 12, rank: 'A1', title: 'Pazar kahvaltısı', en: 'Sunday breakfast',
    lines: [
      S('Bugün pazar.', 'Today is Sunday.', 'pazar=Sunday'),
      S('Ailecek kahvaltı yapıyoruz.', 'We\'re having breakfast as a family.', 'ailecek=as a family; kahvaltı=breakfast'),
      S('Masada peynir, zeytin, domates ve ekmek var.', 'On the table there\'s cheese, olives, tomatoes and bread.', 'masa=table; peynir=cheese; zeytin=olive; domates=tomatoes'),
      S('Annesi çay yapıyor.', 'Her mother is making tea.', 'annesi=her mother'),
      S('Babası gazete okuyor.', 'Her father is reading the paper.', 'babası=her father; gazete=newspaper; okuyor=reads'),
      S('"Afiyet olsun!" diyor annesi.', '"Enjoy!" says her mother.', 'diyor=says'),
      S('Ben her şeyi yiyorum.', 'I eat everything.', 'her şey=everything; yiyorum=I eat'),
      S('"Çok lezzetli, ellerinize sağlık!"', '"Delicious, health to your hands!"'),
      S('Annesi gülüyor: "Biraz daha ister misin?"', 'Her mother laughs: "Would you like a bit more?"'),
      S('"Hayır, teşekkürler. Doydum!"', '"No, thanks. I\'m full!"'),
      S('Ama bir çay daha içiyorum.', 'But I drink one more tea.', 'içiyorum=I drink'),
    ],
    questions: [
      Q('What day is it?', ['Saturday', 'Sunday', 'Monday'], 1),
      Q('What is her father doing?', ['Making tea', 'Reading the paper', 'Sleeping'], 1),
      Q('What does he have one more of?', ['Bread', 'Cheese', 'Tea'], 2),
    ],
  },
  {
    id: 's3', level: 14, rank: 'A1', title: 'Telefon nerede?', en: 'Where\'s the phone?',
    lines: [
      S('Dün sabah telefonumu bulamadım.', 'Yesterday morning I couldn\'t find my phone.', 'bulamadım=I couldn\'t find'),
      S('Mutfağa baktım. Yok.', 'I looked in the kitchen. Not there.', 'baktım=I looked'),
      S('Arabaya baktım. Yok.', 'I looked in the car. Not there.'),
      S('Çok geç oldu. İşe gittim.', 'It got very late. I went to work.', 'geç=late'),
      S('Öğlen onu aradım.', 'At noon I called her.', 'öğlen=noon; onu=her'),
      S('"Telefonun bende!" dedi.', '"I\'ve got your phone!" she said.', 'bende=with me; dedi=said'),
      S('"Dün akşam unuttun."', '"You forgot it last night."'),
      S('Akşam ona gittim.', 'In the evening I went to her place.'),
      S('Telefonum masadaydı. Yanında bir not vardı:', 'My phone was on the table. Next to it there was a note:', 'yanında=next to it; not=note'),
      S('"Seni seviyorum, unutkan!"', '"I love you, forgetful!"', 'unutkan=forgetful'),
    ],
    questions: [
      Q('When did he lose his phone?', ['Yesterday morning', 'Last week', 'This evening'], 0),
      Q('Where was the phone?', ['In the car', 'At her place', 'In the kitchen'], 1),
      Q('What did the note say?', ['Call me', 'I love you, forgetful!', 'See you tomorrow'], 1),
    ],
  },
  {
    id: 's4', level: 16, rank: 'A1', title: 'İstanbul\'da bir gün', en: 'A day in Istanbul',
    lines: [
      S('Cumartesi İstanbul\'a gittik.', 'On Saturday we went to Istanbul.', 'cumartesi=Saturday'),
      S('Önce vapura bindik.', 'First we took the ferry.', 'önce=first; vapur=ferry; bindik=we got on'),
      S('Martılar çok gürültülüydü!', 'The seagulls were so noisy!', 'martı=seagull; gürültülü=noisy'),
      S('Sonra Galata Kulesi\'ne yürüdük.', 'Then we walked to the Galata Tower.', 'yürüdük=we walked'),
      S('Oradan bütün şehri gördük.', 'From there we saw the whole city.', 'oradan=from there; bütün=whole; şehri=the city'),
      S('Öğlen balık ekmek yedik.', 'At noon we ate fish sandwiches.', 'balık=fish'),
      S('Akşam çok yorgunduk ama çok mutluyduk.', 'In the evening we were very tired but very happy.'),
      S('"Yine gelelim mi?" dedi.', '"Shall we come again?" she said.', 'yine=again'),
      S('"Tabii ki!" dedim.', '"Of course!" I said.', 'dedim=I said'),
    ],
    questions: [
      Q('How did they travel first?', ['By ferry', 'By car', 'On foot'], 0),
      Q('What did they eat at noon?', ['Pizza', 'Fish sandwiches', 'Mantı'], 1),
      Q('How did they feel in the evening?', ['Bored', 'Tired but happy', 'Ill'], 1),
    ],
  },
  {
    id: 's5', level: 18, rank: 'A1', title: 'Mantı', en: 'Making mantı',
    lines: [
      S('Bugün annesi bana mantı yapmayı öğretiyor.', 'Today her mother is teaching me to make mantı.', 'mantı=Turkish dumplings; öğretiyor=teaches'),
      S('"Önce hamur yapıyoruz," diyor.', '"First we make the dough," she says.', 'hamur=dough'),
      S('Hamur çok yumuşak.', 'The dough is very soft.', 'yumuşak=soft'),
      S('Sonra küçük küçük kesiyoruz.', 'Then we cut it into tiny pieces.', 'küçük=small; kesiyoruz=we cut'),
      S('Benim mantılarım çok büyük!', 'My mantı are far too big!', 'büyük=big'),
      S('Annesi gülüyor: "Olsun, ilk defa!"', 'Her mother laughs: "Never mind, it\'s your first time!"', 'olsun=never mind; ilk defa=first time'),
      S('Akşam hep birlikte yiyoruz.', 'In the evening we all eat together.', 'hep birlikte=all together'),
      S('"Ellerinize sağlık," diyorum.', '"Health to your hands," I say.'),
      S('"Senin de ellerine sağlık!" diyor annesi.', '"And health to yours!" says her mother.'),
    ],
    questions: [
      Q('What are they making?', ['Baklava', 'Mantı', 'Bread'], 1),
      Q('What\'s wrong with his mantı?', ['Too big', 'Too small', 'Too salty'], 0),
      Q('Why does her mother thank his hands too?', ['He helped cook', 'He washed up', 'He bought the food'], 0),
    ],
  },
  {
    id: 's6', level: 20, rank: 'A1', title: 'Yağmurlu bir akşam', en: 'A rainy evening',
    lines: [
      S('Bu akşam yağmur yağıyor.', 'It\'s raining this evening.', 'yağıyor=is falling'),
      S('Dışarı çıkmayacağız.', 'We won\'t go out.', 'dışarı=outside; çıkmayacağız=we won\'t go out'),
      S('Evde kalacağız ve film izleyeceğiz.', 'We\'ll stay home and watch a film.', 'kalacağız=we\'ll stay'),
      S('Ben patlamış mısır yapacağım.', 'I\'ll make popcorn.'),
      S('O battaniye getirecek.', 'She\'ll bring a blanket.', 'battaniye=blanket; getirecek=will bring'),
      S('Hangi filmi izleyelim?', 'Which film shall we watch?'),
      S('Ben komedi istiyorum, o korku filmi istiyor.', 'I want a comedy, she wants a horror film.', 'komedi=comedy; korku=fear'),
      S('Sonunda bir Türk filmi seçiyoruz.', 'In the end we pick a Turkish film.', 'sonunda=in the end'),
      S('Altyazı yok!', 'No subtitles!', 'altyazı=subtitles'),
      S('Her şeyi anlamıyorum, ama çok şey anlıyorum.', 'I don\'t understand everything, but I understand a lot.'),
      S('Ve bu çok güzel bir his.', 'And that\'s a really nice feeling.', 'his=feeling'),
    ],
    questions: [
      Q('Why are they staying home?', ['It\'s raining', 'They\'re tired', 'They\'re ill'], 0),
      Q('What will he make?', ['Tea', 'Popcorn', 'Dinner'], 1),
      Q('Which film do they pick?', ['A comedy', 'A horror film', 'A Turkish film'], 2),
    ],
  },
];

export const storyById = (id) => STORIES.find((s) => s.id === id);
