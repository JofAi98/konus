// The course. Each item: p(turkish, english, words, note).
// level: the level that opens a unit (or a single lesson, when the lesson sets its own).
// words: "turkish=meaning; turkish=meaning". {name} becomes your name.
import { clean } from './pron.js';

export const p = (tr, en, w = '', note = '') => ({
  tr, en, note,
  words: w ? w.split(';').map((s) => s.trim()).filter(Boolean).map((s) => {
    const i = s.indexOf('=');
    return { tr: s.slice(0, i).trim(), en: s.slice(i + 1).trim() };
  }) : [],
});

export const UNITS = [
  {
    id: 'u0', level: 1, title: 'Sounds', blurb: 'Turkish is spelled exactly as it sounds. Most letters already sound like Italian. These three lessons cover the rest.',
    lessons: [
      { id: 'u0l1', title: 'Ç, C and Ş', goal: 'Italian ci, gi and sci, spelled differently', items: [
        p('çay', 'tea', '', 'ç is the "ci" of "ciao".'),
        p('çok', 'very, a lot'),
        p('can', 'soul; dear', '', 'c is the "gi" of "giorno", so "can" sounds like "jan".'),
        p('cevap', 'answer'),
        p('şeker', 'sugar; also "sweetie"', '', 'ş is the "sc" of "scena".'),
        p('şimdi', 'now'),
        p('teşekkürler', 'thanks', '', 'Hold the double k, like the "cc" in "ecco".'),
      ] },
      { id: 'u0l2', title: 'I, Ö and Ü', goal: 'The three vowels Italian doesn\'t have', items: [
        p('kız', 'girl; daughter', '', 'ı has no dot. Say "i", then pull your tongue back and relax your lips.'),
        p('ışık', 'light'),
        p('göz', 'eye', '', 'ö: say "e" with rounded lips, like French "peu".'),
        p('gül', 'rose', '', 'ü: say "i" with rounded lips, like French "tu".'),
        p('güzel', 'beautiful'),
        p('üç', 'three'),
        p('görüşürüz', 'see you', '', 'One ö and three ü in a row: a good warm-up.'),
      ] },
      { id: 'u0l3', title: 'Ğ, H and double letters', goal: 'A silent letter, a breathed one, and your Italian advantage', items: [
        p('dağ', 'mountain', '', 'ğ is silent and stretches the vowel before it: "daa".'),
        p('değil', 'not', '', 'Between e and i, ğ becomes a light "y": "deyil".'),
        p('sağ ol', 'thanks (casual)', 'sağ=healthy, alive; ol=be', 'Literally "be healthy". It sounds like "saa ol".'),
        p('hayır', 'no', '', 'Always pronounce the h. Breathe it out, as in English "hello".'),
        p('hasta', 'sick, ill'),
        p('anne', 'mom', '', 'Double letters are held longer, like Italian "nonna".'),
        p('dikkat', 'careful!'),
      ] },
    ],
  },
  {
    id: 'u1', level: 1, title: 'Hello', blurb: 'The first things you will say to her, and to everyone she knows.',
    lessons: [
      { id: 'u1l1', title: 'Hello, how are you?', goal: 'Start any conversation', items: [
        p('Merhaba!', 'Hello!', 'merhaba=hello', 'Works any time, with anyone.'),
        p('Selam!', 'Hi!', 'selam=hi', 'Casual, between friends.'),
        p('Nasılsın?', 'How are you?', 'nasılsın=how are you (to one person); nasıl=how', 'Casual. With her parents, use Nasılsınız?'),
        p('İyiyim, sen?', 'I\'m fine, and you?', 'iyiyim=I\'m fine; iyi=good; sen=you'),
        p('Ben de iyiyim.', 'I\'m fine too.', 'ben=I; de=too, also'),
        p('Çok iyiyim!', 'I\'m really good!', 'çok=very'),
        p('Fena değil.', 'Not bad.', 'fena=bad; değil=not'),
      ] },
      { id: 'u1l2', title: 'Yes, no, thanks', goal: 'The words you need every minute', items: [
        p('Evet.', 'Yes.', 'evet=yes'),
        p('Hayır.', 'No.', 'hayır=no'),
        p('Tamam.', 'Okay.', 'tamam=okay, done', 'You will hear this fifty times a day.'),
        p('Teşekkür ederim.', 'Thank you.', 'teşekkür=thanks; ederim=I do, I make', 'The polite thank you. Sağ ol and teşekkürler are more casual.'),
        p('Rica ederim.', 'You\'re welcome.', 'rica=request'),
        p('Lütfen.', 'Please.', 'lütfen=please'),
        p('Özür dilerim.', 'I\'m sorry.', 'özür=apology; dilerim=I ask, I wish'),
      ] },
      { id: 'u1l3', title: 'Good morning, good night', goal: 'Greetings for every time of day', items: [
        p('Günaydın!', 'Good morning!', 'günaydın=good morning; gün=day'),
        p('İyi akşamlar.', 'Good evening.', 'akşam=evening; akşamlar=evenings'),
        p('İyi geceler.', 'Good night.', 'gece=night; geceler=nights'),
        p('Tatlı rüyalar.', 'Sweet dreams.', 'tatlı=sweet; rüya=dream; rüyalar=dreams'),
        p('Görüşürüz!', 'See you!', 'görüşürüz=we\'ll see each other'),
        p('Hoşça kal.', 'Bye. (when you leave)', 'hoşça=nicely; kal=stay', 'Said by the person who is leaving.'),
        p('Güle güle.', 'Bye. (when they leave)', 'güle=smiling', 'Said by the person who stays. Literally "go smiling".'),
      ] },
    ],
  },
  {
    id: 'u2', level: 2, title: 'About me', blurb: 'Your name, where you are from, and how to ask for help when you get lost.',
    lessons: [
      { id: 'u2l1', title: 'My name is...', goal: 'Introduce yourself', items: [
        p('Benim adım {name}.', 'My name is {name}.', 'benim=my; adım=my name; ad=name'),
        p('Senin adın ne?', 'What\'s your name?', 'senin=your; adın=your name; ne=what'),
        p('Memnun oldum.', 'Nice to meet you.', 'memnun=pleased; oldum=I became'),
        p('Ben de memnun oldum.', 'Nice to meet you too.'),
        p('Ben İtalyanım.', 'I\'m Italian.', 'italyanım=I\'m Italian; italyan=Italian'),
        p('Sen Türksün.', 'You\'re Turkish.', 'türksün=you\'re Turkish; türk=Turkish (person)'),
      ] },
      { id: 'u2l2', title: 'Where I\'m from', goal: 'Talk about Italy and your Turkish', items: [
        p('Nerelisin?', 'Where are you from?', 'nerelisin=where are you from'),
        p('İtalyalıyım.', 'I\'m from Italy.', 'italyalıyım=I\'m from Italy; italya=Italy'),
        p('İtalya\'da yaşıyorum.', 'I live in Italy.', 'italya\'da=in Italy; yaşıyorum=I live'),
        p('Türkçe öğreniyorum.', 'I\'m learning Turkish.', 'türkçe=Turkish (language); öğreniyorum=I\'m learning'),
        p('Biraz Türkçe konuşuyorum.', 'I speak a little Turkish.', 'biraz=a little; konuşuyorum=I speak'),
        p('Yeni başladım.', 'I just started.', 'yeni=new, just; başladım=I started'),
      ] },
      { id: 'u2l3', title: 'Help me understand', goal: 'Stay in the conversation when you\'re lost', items: [
        p('Anlamadım.', 'I didn\'t understand.', 'anlamadım=I didn\'t understand', 'Your most useful sentence for months. Say it without fear.'),
        p('Tekrar eder misin?', 'Can you say it again?', 'tekrar=again; eder=does'),
        p('Yavaş konuşur musun?', 'Can you speak slowly?', 'yavaş=slow, slowly; konuşur=speaks'),
        p('Anlıyorum.', 'I understand.', 'anlıyorum=I understand'),
        p('Anlamıyorum.', 'I don\'t understand.', 'anlamıyorum=I don\'t understand'),
        p('Bu ne demek?', 'What does this mean?', 'bu=this; demek=to mean, to say'),
        p('Türkçede nasıl denir?', 'How do you say it in Turkish?', 'türkçede=in Turkish; denir=is said'),
      ] },
    ],
  },
  {
    id: 'u3', level: 3, title: 'At her family\'s table', blurb: 'Meeting her parents, eating together, and the small phrases that make a Turkish mother happy.',
    lessons: [
      { id: 'u3l1', title: 'Meeting her family', goal: 'Arrive and say the right thing', items: [
        p('Hoş geldiniz!', 'Welcome!', 'hoş=nice; geldiniz=you came', 'What the hosts say when you arrive.'),
        p('Hoş bulduk!', 'Happy to be here!', 'bulduk=we found', 'The answer to Hoş geldiniz. Always.'),
        p('Nasılsınız?', 'How are you? (polite)', 'nasılsınız=how are you (polite)', 'Use it with her parents and anyone older.'),
        p('Memnun oldum, teyze.', 'Nice to meet you. (to an older woman)', 'teyze=auntie', 'Turks call older women teyze and older men amca, even strangers.'),
        p('Memnun oldum, amca.', 'Nice to meet you. (to an older man)', 'amca=uncle'),
        p('Ailen nasıl?', 'How\'s your family?', 'ailen=your family; aile=family'),
      ] },
      { id: 'u3l2', title: 'Eating together', goal: 'Get through a whole Turkish meal', items: [
        p('Afiyet olsun!', 'Enjoy your meal!', 'afiyet=good appetite; olsun=may it be'),
        p('Ellerinize sağlık!', 'Health to your hands!', 'ellerinize=to your hands; sağlık=health', 'Say it to whoever cooked. Her mother will love it.'),
        p('Çok lezzetli!', 'It\'s delicious!', 'lezzetli=tasty'),
        p('Biraz daha alabilir miyim?', 'Can I have a bit more?', 'daha=more; alabilir=can take'),
        p('Su alabilir miyim?', 'Can I have some water?', 'su=water'),
        p('Doydum, teşekkürler.', 'I\'m full, thanks.', 'doydum=I\'m full'),
        p('Çay ister misin?', 'Would you like some tea?', 'ister=would like'),
      ] },
      { id: 'u3l3', title: 'Small talk with her parents', goal: 'Say something kind and true', items: [
        p('Burası çok güzel.', 'It\'s really nice here.', 'burası=this place'),
        p('Türkiye\'yi çok seviyorum.', 'I love Turkey.', 'türkiye\'yi=Turkey (as object); seviyorum=I love'),
        p('Kızınız çok tatlı.', 'Your daughter is very sweet.', 'kızınız=your daughter'),
        p('Ailem İtalya\'da.', 'My family is in Italy.', 'ailem=my family'),
        p('İyi ki geldim.', 'I\'m so glad I came.', 'ki=that; geldim=I came'),
        p('Kolay gelsin!', 'Hope the work goes easy!', 'kolay=easy; gelsin=may it come', 'Say it to anyone working: cooking, cleaning, at a shop.'),
      ] },
    ],
  },
  {
    id: 'u4', level: 4, title: 'Love', blurb: 'The words for her.',
    lessons: [
      { id: 'u4l1', title: 'Sweet words', goal: 'Say what you feel', items: [
        p('Seni seviyorum.', 'I love you.', 'seni=you (as object)'),
        p('Ben de seni seviyorum.', 'I love you too.'),
        p('Canım.', 'My dear.', 'canım=my dear (literally "my soul")'),
        p('Aşkım.', 'My love.', 'aşkım=my love; aşk=love'),
        p('Seni özledim.', 'I missed you.', 'özledim=I missed'),
        p('Çok güzelsin.', 'You\'re very beautiful.', 'güzelsin=you\'re beautiful'),
        p('İyi ki varsın.', 'I\'m so glad you\'re in my life.', 'varsın=you exist', 'Literally "good that you exist". Very Turkish, very sweet.'),
      ] },
      { id: 'u4l2', title: 'Every day together', goal: 'Talk through an ordinary day', items: [
        p('Günün nasıl geçti?', 'How was your day?', 'günün=your day; geçti=it passed'),
        p('Ne yapıyorsun?', 'What are you doing?', 'yapıyorsun=you\'re doing'),
        p('Seni düşünüyorum.', 'I\'m thinking of you.', 'düşünüyorum=I\'m thinking'),
        p('Neredesin?', 'Where are you?', 'neredesin=where are you'),
        p('Yoruldun mu?', 'Are you tired?', 'yoruldun=you got tired; mu=question word', 'mi, mı, mu or mü turns any sentence into a yes/no question. Your voice rises on the word just before it.'),
        p('Seninle mutluyum.', 'I\'m happy with you.', 'seninle=with you; mutluyum=I\'m happy'),
        p('Sarıl bana.', 'Hug me.', 'sarıl=hug; bana=me, to me'),
      ] },
    ],
  },
  {
    id: 'u5', level: 6, title: 'Wants and needs', blurb: 'Hungry, tired, thirsty, lost: say it.',
    lessons: [
      { id: 'u5l1', title: 'I want, I need', goal: 'Ask for what you need', items: [
        p('Çay istiyorum.', 'I want tea.', 'istiyorum=I want'),
        p('İstemiyorum.', 'I don\'t want it.', 'istemiyorum=I don\'t want'),
        p('Açım.', 'I\'m hungry.', 'açım=I\'m hungry; aç=hungry'),
        p('Susadım.', 'I\'m thirsty.', 'susadım=I\'m thirsty'),
        p('Yorgunum.', 'I\'m tired.', 'yorgunum=I\'m tired'),
        p('Uykum var.', 'I\'m sleepy.', 'uykum=my sleep; var=there is'),
        p('Tuvalet nerede?', 'Where\'s the toilet?', 'tuvalet=toilet; nerede=where'),
        p('Bir dakika!', 'One minute!', 'bir=one, a; dakika=minute'),
      ] },
      { id: 'u5l2', title: 'There is, there isn\'t', goal: 'Var and yok: two words that do a lot', items: [
        p('Var mı?', 'Is there any?', 'var=there is; mı=question word'),
        p('Yok.', 'There isn\'t. / No.', 'yok=there isn\'t'),
        p('Sorun yok.', 'No problem.', 'sorun=problem'),
        p('Param yok.', 'I have no money.', 'param=my money'),
        p('Biliyorum.', 'I know.', 'biliyorum=I know'),
        p('Bilmiyorum.', 'I don\'t know.', 'bilmiyorum=I don\'t know'),
        p('Bence de.', 'I think so too.', 'bence=in my opinion'),
      ] },
    ],
  },
  {
    id: 'u6', level: 8, title: 'Questions', blurb: 'Who, what, where, when, why, how.',
    lessons: [
      { id: 'u6l1', title: 'Question words', goal: 'The seven words that open any question', items: [
        p('Ne?', 'What?'),
        p('Kim?', 'Who?', 'kim=who'),
        p('Nerede?', 'Where?'),
        p('Ne zaman?', 'When?', 'zaman=time'),
        p('Neden?', 'Why?', 'neden=why'),
        p('Nasıl?', 'How?'),
        p('Hangisi?', 'Which one?', 'hangisi=which one'),
      ] },
      { id: 'u6l2', title: 'Useful questions', goal: 'Questions you will ask every day', items: [
        p('Saat kaç?', 'What time is it?', 'saat=hour, clock; kaç=how many'),
        p('Ne kadar?', 'How much is it?', 'kadar=as much as'),
        p('Bu ne?', 'What\'s this?'),
        p('Hazır mısın?', 'Are you ready?', 'hazır=ready; mısın=are you (question)'),
        p('Gidelim mi?', 'Shall we go?', 'gidelim=let\'s go'),
        p('Ne istersin?', 'What would you like?', 'istersin=you\'d like'),
      ] },
    ],
  },
  {
    id: 'u7', level: 10, title: 'Numbers', blurb: 'Counting, prices and the time.',
    lessons: [
      { id: 'u7l1', title: 'One to five', goal: 'Count to five', items: [
        p('bir', 'one'), p('iki', 'two'), p('üç', 'three'), p('dört', 'four'), p('beş', 'five'),
        p('İki çay, lütfen.', 'Two teas, please.', '', 'After a number the noun stays singular: "two tea".'),
      ] },
      { id: 'u7l2', title: 'Six to ten', goal: 'Count to ten', items: [
        p('altı', 'six'), p('yedi', 'seven'), p('sekiz', 'eight'), p('dokuz', 'nine'), p('on', 'ten'),
        p('Saat on.', 'It\'s ten o\'clock.'),
      ] },
      { id: 'u7l3', title: 'Big numbers', goal: 'Prices and ages', items: [
        p('yirmi', 'twenty'), p('otuz', 'thirty'), p('elli', 'fifty'), p('yüz', 'a hundred'), p('bin', 'a thousand'),
        p('Yüz lira.', 'A hundred lira.', 'lira=lira (Turkish money)'),
      ] },
      { id: 'u7l4', title: 'Today, later, the weather', goal: 'Time words and small talk about the weather', items: [
        p('Bugün çok yorgunum.', 'I\'m very tired today.', 'bugün=today'),
        p('Yarın ne yapıyorsun?', 'What are you doing tomorrow?', 'yarın=tomorrow'),
        p('Şimdi değil, sonra.', 'Not now, later.', 'şimdi=now; sonra=later, then'),
        p('Sabah kahve, akşam çay.', 'Coffee in the morning, tea in the evening.', 'sabah=morning; kahve=coffee'),
        p('Hava çok güzel.', 'The weather is lovely.', 'hava=weather, air', 'Turks talk about the weather as much as Italians do.'),
        p('Hava çok sıcak.', 'It\'s very hot.', 'sıcak=hot'),
        p('Hava soğuk.', 'It\'s cold.', 'soğuk=cold'),
        p('Her gün Türkçe çalışıyorum.', 'I study Turkish every day.', 'her=every; gün=day; çalışıyorum=I work, I study'),
      ] },
    ],
  },
  {
    id: 'u8', level: 12, title: 'Out and about', blurb: 'Cafés, shops and finding your way.',
    lessons: [
      { id: 'u8l1', title: 'Café and shops', goal: 'Order, ask the price, pay', items: [
        p('Bir çay, lütfen.', 'A tea, please.'),
        p('Hesap, lütfen.', 'The bill, please.', 'hesap=bill'),
        p('Bu ne kadar?', 'How much is this?'),
        p('Çok pahalı!', 'Too expensive!', 'pahalı=expensive'),
        p('Ucuz.', 'Cheap.', 'ucuz=cheap'),
        p('Kartla ödeyebilir miyim?', 'Can I pay by card?', 'kartla=by card; ödeyebilir=can pay'),
      ] },
      { id: 'u8l2', title: 'Getting around', goal: 'Ask the way and follow the answer', items: [
        p('Burada mı?', 'Is it here?', 'burada=here'),
        p('Sağa dön.', 'Turn right.', 'sağa=to the right; dön=turn'),
        p('Sola dön.', 'Turn left.', 'sola=to the left'),
        p('Düz git.', 'Go straight.', 'düz=straight; git=go'),
        p('Uzak mı?', 'Is it far?', 'uzak=far'),
        p('Yakın.', 'It\'s close.', 'yakın=close, near'),
        p('Hadi gidelim!', 'Let\'s go!', 'hadi=come on'),
      ] },
    ],
  },
  {
    id: 'u9', level: 14, title: 'Yesterday', blurb: 'Talk about what already happened. The past ends in -dı, -di, -du or -dü.',
    lessons: [
      { id: 'u9l1', title: 'What did you do?', goal: 'Tell her about your day', items: [
        p('Dün ne yaptın?', 'What did you do yesterday?', 'dün=yesterday; yaptın=you did'),
        p('Çalıştım.', 'I worked.', 'çalıştım=I worked'),
        p('Uyudum.', 'I slept.', 'uyudum=I slept'),
        p('Yemek yedim.', 'I ate.', 'yemek=food, meal; yedim=I ate'),
        p('Seni aradım.', 'I called you.', 'aradım=I called'),
        p('Gördün mü?', 'Did you see?', 'gördün=you saw'),
        p('Unuttum!', 'I forgot!', 'unuttum=I forgot'),
      ] },
    ],
  },
  {
    id: 'u10', level: 17, title: 'Plans', blurb: 'Tomorrow, tonight and the weekend.',
    lessons: [
      { id: 'u10l1', title: 'What shall we do?', goal: 'Make plans together', items: [
        p('Yarın ne yapacaksın?', 'What will you do tomorrow?', 'yarın=tomorrow; yapacaksın=you will do'),
        p('Yarın görüşürüz.', 'See you tomorrow.'),
        p('Seni arayacağım.', 'I\'ll call you.', 'arayacağım=I\'ll call'),
        p('Akşam ne yapalım?', 'What shall we do tonight?', 'yapalım=let\'s do'),
        p('Film izleyelim mi?', 'Shall we watch a film?', 'film=film; izleyelim=let\'s watch'),
        p('Hafta sonu birlikteyiz.', 'We\'re together this weekend.', 'hafta=week; sonu=its end; birlikteyiz=we\'re together'),
        p('Çok heyecanlıyım!', 'I\'m so excited!', 'heyecanlıyım=I\'m excited'),
      ] },
    ],
  },
  {
    id: 'u11', level: 5, title: 'Sound natural', blurb: 'The little words Turks fill every sentence with, and the set phrases for every moment of life.',
    lessons: [
      { id: 'u11l1', level: 5, title: 'Thinking out loud', goal: 'Fill the pauses like a Turk', items: [
        p('Yani...', 'I mean... / So...', 'yani=I mean, that is', 'The most common filler. Use it while you think, or to explain something again.'),
        p('Şey...', 'Um... / The thing...', 'şey=thing', 'For when the word won\'t come. It means "thing", like Italian "coso".'),
        p('İşte...', 'Well... / There you go.', 'işte=here it is, well', 'Rounds off a thought: "İşte böyle", that\'s how it is.'),
        p('Hani...', 'You know...', 'hani=you know, remember'),
        p('Neyse.', 'Anyway.', 'neyse=anyway'),
        p('Bir saniye...', 'One second...', 'saniye=second'),
        p('Nasıl desem...', 'How should I put it...', 'desem=should I say'),
        p('Of ya!', 'Ugh!', 'of=ugh (a sigh); ya=oh, really', 'Ya softens or stresses whatever comes before it: "Hadi ya", "Tamam ya".'),
      ] },
      { id: 'u11l2', level: 7, title: 'Reactions', goal: 'Answer with feeling', items: [
        p('Aynen!', 'Exactly!', 'aynen=exactly'),
        p('Valla mı?', 'Really? Honestly?', 'valla=I swear, honestly'),
        p('Hadi ya!', 'No way! / Come on!', 'hadi=come on'),
        p('Yok artık!', 'You\'re kidding!', 'artık=any more'),
        p('Tabii ki.', 'Of course.', 'tabii=of course'),
        p('Harika!', 'Great!', 'harika=wonderful'),
        p('Eyvah!', 'Oh no!', 'eyvah=oh no'),
        p('Aman!', 'Oh dear! / Careful!', 'aman=oh dear, mercy'),
        p('Boş ver.', 'Never mind. / Forget it.', 'boş=empty; ver=give'),
      ] },
      { id: 'u11l3', level: 9, title: 'Words for every moment', goal: 'The set phrases Turks expect', items: [
        p('Geçmiş olsun.', 'Get well soon. / Sorry that happened.', 'geçmiş=past; olsun=may it be', 'Literally "may it be in the past". For illness, a bad day, any bad luck.'),
        p('Çok yaşa!', 'Bless you!', 'yaşa=live', 'After a sneeze. The answer is "Sen de gör!"'),
        p('Sen de gör!', 'You too! (the answer to Çok yaşa)', 'gör=see', 'Literally "may you see it too": may you live long too.'),
        p('Hayırlı olsun!', 'Congratulations!', 'hayırlı=lucky, good', 'For a new job, home or car.'),
        p('İyi ki doğdun!', 'Happy birthday!', 'doğdun=you were born', 'Literally "good that you were born".'),
        p('Başın sağ olsun.', 'I\'m sorry for your loss.', 'baş=head', 'Said after a death.'),
        p('Gözün aydın!', 'What great news for you!', 'göz=eye; aydın=bright', 'When someone\'s loved one arrives or they get good news.'),
        p('Maşallah!', 'How wonderful!', 'maşallah=wonderful (wards off the evil eye)', 'Said when praising a child, a home or someone\'s looks. It protects against the evil eye.'),
        p('İnşallah.', 'Hopefully.', 'inşallah=hopefully, God willing', 'Everyone uses it, religious or not, for any hope about the future.'),
        p('Kusura bakma.', 'Sorry. / Don\'t mind it.', 'kusur=fault; bakma=don\'t look', 'A soft sorry for small things. Polite: Kusura bakmayın.'),
      ] },
    ],
  },
];

export const LESSONS = UNITS.flatMap((u) => u.lessons.map((l) => ({ ...l, level: l.level ?? u.level, rank: 'A1', unit: u })));
export const lessonById = (id) => LESSONS.find((l) => l.id === id);

// Every word the course teaches, with its meaning, first meaning wins.
export const COURSE_WORDS = (() => {
  const map = new Map();
  for (const l of LESSONS) {
    for (const it of l.items) {
      if (!it.tr.includes(' ') && !it.tr.includes('{')) {
        const k = clean(it.tr);
        if (!map.has(k)) map.set(k, { tr: it.tr.replace(/[.!?,]/g, ''), en: it.en.replace(/[.!?]$/, '') });
      }
      for (const w of it.words) {
        const k = clean(w.tr);
        if (!map.has(k)) map.set(k, { tr: w.tr, en: w.en });
      }
    }
  }
  return [...map.values()];
})();
