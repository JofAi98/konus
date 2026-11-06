// The Spanish course. Each item: p(spanish, english, words, note).
// level: the level that opens a unit (or a single lesson, when the lesson sets its own).
// rank: A1 unless the unit says otherwise. words: "spanish=meaning; spanish=meaning".
// {name} becomes your name. Spanish from Spain: vosotros, móvil, zumo, coche.
import { p } from '../course.js';
import { clean } from './pron.js';

export const UNITS = [
  {
    id: 'u0', level: 1, title: 'Sounds', blurb: 'Spanish is spelled almost as it sounds, and most of it already sounds like Italian. These three lessons cover the rest.',
    lessons: [
      { id: 'u0l1', title: 'J, soft G and H', goal: 'A rough breath, and a letter that says nothing', items: [
        p('jamón', 'ham', '', 'j is a rough breath from the throat, like German "Bach". Italian has nothing like it.'),
        p('trabajo', 'work, job'),
        p('gente', 'people', '', 'Before e and i, g is the same rough sound as j. Never Italian "gente".'),
        p('general', 'general'),
        p('hola', 'hello', '', 'h is always silent, as in Italian "ho".'),
        p('hoy', 'today'),
        p('ahora', 'now', '', 'Silent h, so it sounds like "aora".'),
      ] },
      { id: 'u0l2', title: 'Z, soft C and QU', goal: 'The "th" of Spain, and a silent u', items: [
        p('zapato', 'shoe', '', 'z is the "th" of English "think". Never the "ts" of "pizza".'),
        p('cerveza', 'beer', '', 'Before e and i, c is the same "th". Two of them in one word here.'),
        p('gracias', 'thank you', '', 'Tongue between the teeth: GRA-thyas. Most of Latin America says "s", and they\'re understood everywhere too.'),
        p('cinco', 'five', '', 'Soft c, then hard c: "THIN-ko". The rule is the Italian one, only the soft sound is different.'),
        p('queso', 'cheese', '', 'qu is just "k". The u is silent: KE-so.'),
        p('aquí', 'here'),
        p('guitarra', 'guitar', '', 'gu before e and i works like Italian "gh": the u is silent.'),
      ] },
      { id: 'u0l3', title: 'V, LL, Ñ and RR', goal: 'Lips, a y, your Italian gn, and a long roll', items: [
        p('vino', 'wine', '', 'Spanish has no v sound. b and v are the same soft b: BI-no. Your hardest habit to drop.'),
        p('vivir', 'to live'),
        p('calle', 'street', '', 'll sounds like the "i" of Italian "ieri": KA-ye. Never long, never "gl".'),
        p('España', 'Spain', '', 'ñ is your Italian "gn": "Espagna".'),
        p('perro', 'dog', '', 'rr is rolled long. Pero (but) has one tap, perro (dog) a long roll.'),
        p('casa', 'house', '', 'Never buzz this s. Italian "casa" has a soft s in the north; Spanish never does.'),
        p('mañana', 'tomorrow; morning'),
      ] },
    ],
  },
  {
    id: 'u1', topic: 'Greetings', level: 1, title: 'Hello', blurb: 'The first things you will say to anyone in Spain.',
    lessons: [
      { id: 'u1l1', title: 'Hello, how are you?', goal: 'Start any conversation', items: [
        p('¡Hola!', 'Hello!', 'hola=hello', 'Works any time, with anyone. Spanish opens every question and exclamation with an upside-down mark.'),
        p('¿Qué tal?', 'How are you? How\'s it going?', 'qué=what; tal=such', 'The everyday greeting. Often just: "¡Hola! ¿Qué tal?"'),
        p('¿Cómo estás?', 'How are you?', 'cómo=how; estás=you are', 'Casual, to one person. Note: estás, not "come stai".'),
        p('Muy bien, gracias.', 'Very well, thanks.', 'muy=very; bien=well; gracias=thanks'),
        p('Bien, ¿y tú?', 'Fine, and you?', 'y=and; tú=you'),
        p('Yo también.', 'Me too.', 'yo=I; también=also, too'),
        p('Regular.', 'So-so.', 'regular=so-so', 'A false friend: it doesn\'t mean "fine" but "not great".'),
      ] },
      { id: 'u1l2', title: 'Yes, no, thanks', goal: 'The words you need every minute', items: [
        p('Sí.', 'Yes.', 'sí=yes'),
        p('No.', 'No.', 'no=no'),
        p('Vale.', 'Okay.', 'vale=okay', 'You will hear this fifty times a day in Spain. Not used in Latin America.'),
        p('Muchas gracias.', 'Thank you very much.', 'muchas=many'),
        p('De nada.', 'You\'re welcome.', 'de=of; nada=nothing', 'Literally "of nothing", like Italian "di niente".'),
        p('Por favor.', 'Please.', 'por=for; favor=favour'),
        p('Lo siento.', 'I\'m sorry.', 'lo=it; siento=I feel', 'Literally "I feel it". Use "perdón" for bumping into someone.'),
        p('Perdón.', 'Excuse me. Sorry.', 'perdón=sorry, excuse me'),
      ] },
      { id: 'u1l3', title: 'Good morning, good night', goal: 'Greetings for every time of day', items: [
        p('¡Buenos días!', 'Good morning!', 'buenos=good; días=days', 'Plural, unlike Italian: "good days". Until lunch, around two.'),
        p('Buenas tardes.', 'Good afternoon. Good evening.', 'buenas=good; tardes=afternoons', 'After lunch and until dark, even at eight in the evening.'),
        p('Buenas noches.', 'Good evening. Good night.', 'noches=nights', 'Both hello and goodbye once it\'s dark.'),
        p('¡Hasta luego!', 'See you later!', 'hasta=until; luego=later', 'The normal goodbye, even if you won\'t meet again today.'),
        p('¡Hasta mañana!', 'See you tomorrow!', 'mañana=tomorrow'),
        p('Adiós.', 'Goodbye.', 'adiós=goodbye'),
        p('¡Buen día!', 'Have a good day!', 'buen=good', 'Short "bueno", before a masculine word.'),
      ] },
    ],
  },
  {
    id: 'u2', level: 2, title: 'About me', blurb: 'Your name, where you are from, and how to ask for help when you get lost.',
    lessons: [
      { id: 'u2l1', title: 'My name is...', goal: 'Introduce yourself', items: [
        p('Me llamo {name}.', 'My name is {name}.', 'me=myself; llamo=I call', 'Like Italian "mi chiamo".'),
        p('¿Cómo te llamas?', 'What\'s your name?', 'te=yourself; llamas=you call'),
        p('Mucho gusto.', 'Nice to meet you.', 'mucho=much; gusto=pleasure'),
        p('Encantado.', 'Delighted to meet you.', 'encantado=delighted', 'A woman says encantada.'),
        p('Soy italiano.', 'I\'m Italian.', 'soy=I am; italiano=Italian'),
        p('Soy de Italia.', 'I\'m from Italy.', 'de=from, of'),
      ] },
      { id: 'u2l2', title: 'Where I\'m from', goal: 'Talk about Italy and your Spanish', items: [
        p('¿De dónde eres?', 'Where are you from?', 'dónde=where; eres=you are'),
        p('Vivo en Italia.', 'I live in Italy.', 'vivo=I live; en=in'),
        p('Estudio español.', 'I\'m studying Spanish.', 'estudio=I study; español=Spanish'),
        p('Hablo un poco de español.', 'I speak a little Spanish.', 'hablo=I speak; un poco=a little', 'Don\'t forget "de": "un poco de".'),
        p('Hablo italiano e inglés.', 'I speak Italian and English.', 'e=and; inglés=English', 'y becomes e before a word starting with an i sound, as Italian "e" becomes "ed".'),
        p('Antes hablaba mejor.', 'I used to speak better.', 'antes=before; hablaba=I used to speak; mejor=better'),
      ] },
      { id: 'u2l3', title: 'Help me understand', goal: 'Stay in the conversation when you\'re lost', items: [
        p('No entiendo.', 'I don\'t understand.', 'entiendo=I understand', 'Your most useful sentence. Say it without fear.'),
        p('¿Puedes repetir?', 'Can you repeat that?', 'puedes=you can; repetir=to repeat'),
        p('Más despacio, por favor.', 'More slowly, please.', 'más=more; despacio=slowly', 'Not "piano": in Spanish that\'s only the instrument.'),
        p('Entiendo.', 'I understand.'),
        p('No lo sé.', 'I don\'t know.', 'sé=I know', 'Spanish keeps the "lo": not "non so" but "no lo sé".'),
        p('¿Qué significa esto?', 'What does this mean?', 'significa=it means; esto=this'),
        p('¿Cómo se dice en español?', 'How do you say it in Spanish?', 'se dice=one says'),
      ] },
    ],
  },
  {
    id: 'u3', topic: 'Family', level: 3, title: 'At a Spanish table', blurb: 'Meeting your friend\'s family, eating together, and the small phrases that make a Spanish mother happy.',
    lessons: [
      { id: 'u3l1', title: 'Meeting the family', goal: 'Arrive and say the right thing', items: [
        p('¡Bienvenido!', 'Welcome!', 'bienvenido=welcome', 'To a woman: bienvenida. To several people: bienvenidos.'),
        p('Pasa, pasa.', 'Come in, come in.', 'pasa=come in', 'Spaniards say it twice, always.'),
        p('¿Cómo está usted?', 'How are you? (polite)', 'usted=you (polite)', 'Spanish usted works like Italian "Lei", but the verb is the same as for "she". Spain uses it less than Italy.'),
        p('Esta es mi madre.', 'This is my mother.', 'esta=this (feminine); es=is; mi=my; madre=mother'),
        p('Este es mi padre.', 'This is my father.', 'este=this (masculine); padre=father'),
        p('¿Qué tal la familia?', 'How\'s the family?', 'familia=family'),
      ] },
      { id: 'u3l2', title: 'Eating together', goal: 'Get through a whole Spanish meal', items: [
        p('¡Que aproveche!', 'Enjoy your meal!', 'aproveche=may it do you good', 'Like Italian "buon appetito". Spaniards say it even to strangers eating nearby.'),
        p('¡Qué rico!', 'How delicious!', 'qué=how; rico=delicious', 'For food, rico means tasty, not only "rich".'),
        p('Está muy bueno.', 'It\'s very good.', 'está=it is; bueno=good', 'With food, estar: it tastes good right now.'),
        p('¿Me pasas la sal?', 'Can you pass me the salt?', 'me=to me; pasas=you pass; sal=salt', 'La sal is feminine, unlike "il sale".'),
        p('¿Puedo tomar un poco más?', 'Can I have a bit more?', 'puedo=I can; tomar=to have, to take'),
        p('Estoy lleno, gracias.', 'I\'m full, thanks.', 'estoy=I am; lleno=full'),
        p('¿Quieres un café?', 'Would you like a coffee?', 'quieres=you want; café=coffee'),
      ] },
      { id: 'u3l3', title: 'Small talk', goal: 'Say something kind and true', items: [
        p('Tu casa es muy bonita.', 'Your house is very nice.', 'tu=your; bonita=pretty, nice'),
        p('Me encanta España.', 'I love Spain.', 'me encanta=I love', 'For things and places. "Te quiero" is for people.'),
        p('Tu hija es muy simpática.', 'Your daughter is very nice.', 'hija=daughter; simpática=friendly, nice'),
        p('Mi familia está en Italia.', 'My family is in Italy.'),
        p('Muchas gracias por todo.', 'Thank you for everything.', 'por=for; todo=everything'),
        p('¡Qué bien!', 'How nice! Great!', 'bien=well'),
      ] },
    ],
  },
  {
    id: 'u4', topic: 'Love', level: 4, title: 'People you love', blurb: 'The warm words, for a partner, family and friends.',
    lessons: [
      { id: 'u4l1', title: 'Sweet words', goal: 'Say what you feel', items: [
        p('Te quiero.', 'I love you.', 'te=you; quiero=I love, I want', 'The everyday one, for partner, family and friends. Like Italian "ti voglio bene" and "ti amo" in one.'),
        p('Yo también te quiero.', 'I love you too.'),
        p('Te amo.', 'I love you. (very strong)', 'amo=I love', 'For a great love, rarely said in Spain.'),
        p('Cariño.', 'Darling.', 'cariño=darling, affection'),
        p('Mi amor.', 'My love.', 'amor=love'),
        p('Te echo de menos.', 'I miss you.', 'echo de menos=I miss', 'Spain\'s phrase, word for word "I throw you of less". In Latin America: te extraño.'),
        p('Eres muy guapa.', 'You\'re very beautiful.', 'eres=you are; guapa=good-looking', 'To a man: guapo. "Bello" sounds literary in Spain.'),
      ] },
      { id: 'u4l2', title: 'Every day together', goal: 'Talk through an ordinary day', items: [
        p('¿Qué tal el día?', 'How was your day?', 'día=day'),
        p('¿Qué haces?', 'What are you doing?', 'haces=you do'),
        p('Pienso en ti.', 'I\'m thinking of you.', 'pienso=I think; ti=you'),
        p('¿Dónde estás?', 'Where are you?', 'dónde=where'),
        p('¿Estás cansado?', 'Are you tired?', 'cansado=tired', 'To a woman: cansada. A question has the same words as a statement: only the voice rises.'),
        p('Soy feliz contigo.', 'I\'m happy with you.', 'feliz=happy; contigo=with you', 'Soy feliz, with ser. And "with you" is one word: contigo.'),
        p('Dame un abrazo.', 'Give me a hug.', 'dame=give me; abrazo=hug'),
      ] },
    ],
  },
  {
    id: 'u5', level: 6, title: 'Wants and needs', blurb: 'Hungry, tired, thirsty, lost: say it.',
    lessons: [
      { id: 'u5l1', title: 'I want, I need', goal: 'Ask for what you need', items: [
        p('Quiero un café.', 'I want a coffee.', 'un=a'),
        p('No quiero.', 'I don\'t want to.'),
        p('Tengo hambre.', 'I\'m hungry.', 'tengo=I have; hambre=hunger', 'Same as Italian "ho fame", and hambre is feminine as well.'),
        p('Tengo sed.', 'I\'m thirsty.', 'sed=thirst'),
        p('Estoy cansado.', 'I\'m tired.'),
        p('Tengo sueño.', 'I\'m sleepy.', 'sueño=sleep, dream'),
        p('¿Dónde está el baño?', 'Where\'s the toilet?', 'el=the; baño=bathroom'),
        p('Un momento.', 'One moment.', 'momento=moment'),
      ] },
      { id: 'u5l2', title: 'There is, there isn\'t', goal: 'Hay: one small word that does a lot', items: [
        p('¿Hay agua?', 'Is there any water?', 'hay=there is, there are; agua=water', 'Hay is one word for "c\'è" and "ci sono".'),
        p('No hay.', 'There isn\'t any.'),
        p('No hay problema.', 'No problem.', 'problema=problem'),
        p('No tengo dinero.', 'I have no money.', 'dinero=money'),
        p('Lo sé.', 'I know.'),
        p('No lo sé.', 'I don\'t know.'),
        p('Creo que sí.', 'I think so.', 'creo=I believe; que=that', '"Credo di sì" with que: creo que no is "I don\'t think so".'),
      ] },
    ],
  },
  {
    id: 'u6', level: 8, title: 'Questions', blurb: 'Who, what, where, when, why, how.',
    lessons: [
      { id: 'u6l1', title: 'Question words', goal: 'The seven words that open any question', items: [
        p('¿Qué?', 'What?', '', 'Question words always carry a written accent.'),
        p('¿Quién?', 'Who?', 'quién=who'),
        p('¿Dónde?', 'Where?'),
        p('¿Cuándo?', 'When?', 'cuándo=when'),
        p('¿Por qué?', 'Why?', '', 'Two words to ask. The answer, "because", is one: porque.'),
        p('¿Cómo?', 'How?'),
        p('¿Cuál?', 'Which one?', 'cuál=which'),
      ] },
      { id: 'u6l2', title: 'Useful questions', goal: 'Questions you will ask every day', items: [
        p('¿Qué hora es?', 'What time is it?', 'hora=hour, time'),
        p('¿Cuánto cuesta?', 'How much is it?', 'cuánto=how much; cuesta=it costs'),
        p('¿Qué es esto?', 'What\'s this?'),
        p('¿Estás listo?', 'Are you ready?', 'listo=ready', 'With ser it means clever: "es listo".'),
        p('¿Vamos?', 'Shall we go?', 'vamos=we go, let\'s go'),
        p('¿Qué quieres?', 'What would you like?'),
      ] },
    ],
  },
  {
    id: 'u7', topic: 'Numbers and time', level: 10, title: 'Numbers', blurb: 'Counting, prices and the time.',
    lessons: [
      { id: 'u7l1', title: 'One to five', goal: 'Count to five', items: [
        p('uno', 'one'), p('dos', 'two'), p('tres', 'three'), p('cuatro', 'four'), p('cinco', 'five'),
        p('Dos cafés, por favor.', 'Two coffees, please.', '', 'Plurals end in s. Italian changes the vowel, Spanish adds a letter: café, cafés.'),
      ] },
      { id: 'u7l2', title: 'Six to ten', goal: 'Count to ten', items: [
        p('seis', 'six'), p('siete', 'seven'), p('ocho', 'eight'), p('nueve', 'nine'), p('diez', 'ten'),
        p('Son las diez.', 'It\'s ten o\'clock.', 'son=they are; las=the', 'Hours are "the": son las diez. Only one o\'clock is singular: es la una.'),
      ] },
      { id: 'u7l3', title: 'Big numbers', goal: 'Prices and ages', items: [
        p('veinte', 'twenty'), p('treinta', 'thirty'), p('cincuenta', 'fifty'), p('cien', 'a hundred'), p('mil', 'a thousand'),
        p('Treinta y cinco euros.', 'Thirty-five euros.', 'euros=euros', 'From 31 on, tens and units are joined by y: treinta y cinco.'),
        p('Tengo veinticinco años.', 'I\'m twenty-five.', 'años=years', 'Tener, as with Italian "avere". Careful with the ñ: anos means something else.'),
      ] },
      { id: 'u7l4', title: 'Today, later, the weather', goal: 'Time words and small talk about the weather', items: [
        p('Hoy estoy muy cansado.', 'I\'m very tired today.'),
        p('¿Qué haces mañana?', 'What are you doing tomorrow?'),
        p('Ahora no, luego.', 'Not now, later.', 'ahora=now; luego=later'),
        p('Café por la mañana, té por la tarde.', 'Coffee in the morning, tea in the afternoon.', 'por la mañana=in the morning; té=tea; por la tarde=in the afternoon'),
        p('Hace buen tiempo.', 'The weather is good.', 'hace=it makes; tiempo=weather, time', 'Italian "fa bel tempo", word for word.'),
        p('Hace mucho calor.', 'It\'s very hot.', 'calor=heat', 'El calor is masculine, and mucho, not muy: much heat.'),
        p('Hace frío.', 'It\'s cold.', 'frío=cold'),
        p('Estudio español todos los días.', 'I study Spanish every day.', 'todos los días=every day'),
      ] },
    ],
  },
  {
    id: 'u8', topic: 'City', level: 12, title: 'Out and about', blurb: 'Bars, shops and finding your way.',
    lessons: [
      { id: 'u8l1', title: 'Bar and shops', goal: 'Order, ask the price, pay', items: [
        p('Un café con leche, por favor.', 'A white coffee, please.', 'con=with; leche=milk', 'La leche is feminine, unlike "il latte".'),
        p('La cuenta, por favor.', 'The bill, please.', 'cuenta=bill'),
        p('¿Cuánto es?', 'How much is it?'),
        p('¡Qué caro!', 'How expensive!', 'caro=expensive'),
        p('Barato.', 'Cheap.', 'barato=cheap'),
        p('¿Puedo pagar con tarjeta?', 'Can I pay by card?', 'pagar=to pay; tarjeta=card'),
      ] },
      { id: 'u8l2', title: 'Getting around', goal: 'Ask the way and follow the answer', items: [
        p('¿Está aquí?', 'Is it here?'),
        p('Gira a la derecha.', 'Turn right.', 'gira=turn; derecha=right'),
        p('Gira a la izquierda.', 'Turn left.', 'izquierda=left'),
        p('Sigue todo recto.', 'Go straight on.', 'sigue=carry on; todo recto=straight ahead'),
        p('¿Está lejos?', 'Is it far?', 'lejos=far', 'Estar for where things are, always.'),
        p('Está cerca.', 'It\'s close.', 'cerca=near, close'),
        p('¡Vamos!', 'Let\'s go!'),
      ] },
    ],
  },
  {
    id: 'u9', level: 14, title: 'Yesterday', blurb: 'Talk about what already happened. The past ends in -é, -í, -ó or -ió, with the stress on the end.',
    lessons: [
      { id: 'u9l1', title: 'What did you do?', goal: 'Tell someone about your day', items: [
        p('¿Qué hiciste ayer?', 'What did you do yesterday?', 'hiciste=you did; ayer=yesterday', 'Italian would often say "cosa hai fatto": Spain uses this one for a finished day.'),
        p('Trabajé.', 'I worked.', 'trabajé=I worked', 'The stress on the end matters: trabajo is "I work".'),
        p('Dormí mucho.', 'I slept a lot.', 'dormí=I slept'),
        p('Comí en casa.', 'I ate at home.', 'comí=I ate'),
        p('Te llamé.', 'I called you.', 'llamé=I called'),
        p('¿Lo viste?', 'Did you see it?', 'viste=you saw'),
        p('¡Se me olvidó!', 'I forgot!', 'olvidó=forgot', 'Word for word "it forgot itself on me", the natural way to say it.'),
      ] },
    ],
  },
  {
    id: 'u10', level: 17, title: 'Plans', blurb: 'Tomorrow, tonight and the weekend.',
    lessons: [
      { id: 'u10l1', title: 'What shall we do?', goal: 'Make plans together', items: [
        p('¿Qué vas a hacer mañana?', 'What are you going to do tomorrow?', 'vas a=you\'re going to; hacer=to do', 'Ir a plus a verb is everyday future. Don\'t forget the a.'),
        p('Hasta mañana.', 'See you tomorrow.'),
        p('Te voy a llamar.', 'I\'ll call you.', 'voy a=I\'m going to; llamar=to call'),
        p('¿Qué hacemos esta noche?', 'What shall we do tonight?', 'hacemos=we do; esta noche=tonight'),
        p('¿Vemos una película?', 'Shall we watch a film?', 'vemos=we see; película=film'),
        p('El fin de semana estamos juntos.', 'We\'re together at the weekend.', 'fin=end; semana=week; juntos=together'),
        p('¡Qué ilusión!', 'I can\'t wait!', 'ilusión=excited hope', 'A false friend: not an illusion, but happy anticipation. Very Spanish.'),
      ] },
    ],
  },
  {
    id: 'u11', level: 5, title: 'Sound natural', blurb: 'The little words Spaniards fill every sentence with, and the set phrases for every moment of life.',
    lessons: [
      { id: 'u11l1', level: 5, title: 'Thinking out loud', goal: 'Fill the pauses like a Spaniard', items: [
        p('Bueno...', 'Well... / Okay...', 'bueno=good, well', 'The most common filler. Opens almost any answer.'),
        p('Pues...', 'Well... / So...', 'pues=well, then', 'For when you need a second. Nothing to do with Italian "poi".'),
        p('A ver...', 'Let\'s see...', 'a ver=let\'s see'),
        p('O sea...', 'I mean...', 'o sea=that is', 'Like Italian "cioè".'),
        p('Es que...', 'The thing is...', 'es que=it\'s that', 'The perfect start for any excuse.'),
        p('Un segundo...', 'One second...', 'segundo=second'),
        p('¿Cómo te diría?', 'How can I put it?', 'diría=I would say'),
        p('¿Sabes?', 'You know?', 'sabes=you know'),
      ] },
      { id: 'u11l2', level: 7, title: 'Reactions', goal: 'Answer with feeling', items: [
        p('¡Claro!', 'Of course!', 'claro=clear, of course'),
        p('¿De verdad?', 'Really?', 'verdad=truth'),
        p('¡No me digas!', 'You don\'t say!', 'digas=you say'),
        p('¡Qué fuerte!', 'Wow! That\'s crazy!', 'fuerte=strong'),
        p('¡Genial!', 'Great!', 'genial=great'),
        p('¡Madre mía!', 'Oh my goodness!', 'mía=my', 'Italian "mamma mia", in the Spanish order.'),
        p('¡Qué pena!', 'What a shame!', 'pena=pity, sorrow'),
        p('¡Venga!', 'Come on! Okay!', 'venga=come on', 'Means "let\'s go", "okay" and "bye" on the phone. Very Spain.'),
        p('Da igual.', 'It doesn\'t matter.', 'igual=the same'),
      ] },
      { id: 'u11l3', level: 9, title: 'Words for every moment', goal: 'The set phrases Spaniards expect', items: [
        p('¡Que te mejores!', 'Get well soon!', 'mejores=you get better', 'Que plus a wish, as in Italian "che tu possa".'),
        p('¡Jesús!', 'Bless you!', 'Jesús=Jesus', 'After a sneeze. Or: ¡Salud!'),
        p('¡Salud!', 'Cheers!', 'salud=health', 'For toasts, and after sneezes too.'),
        p('¡Enhorabuena!', 'Congratulations!', 'enhorabuena=congratulations', 'For a new job, a baby, an exam.'),
        p('¡Feliz cumpleaños!', 'Happy birthday!', 'cumpleaños=birthday'),
        p('Lo siento mucho.', 'I\'m so sorry.', '', 'Also for a death. There: mi más sentido pésame, if you want to be formal.'),
        p('¡Buen viaje!', 'Have a good trip!', 'viaje=trip'),
        p('¡Que lo pases bien!', 'Have a good time!', 'pases=you spend'),
        p('Ojalá.', 'Hopefully. If only.', 'ojalá=hopefully', 'From Arabic "may God will". Everyone uses it, religious or not.'),
        p('No pasa nada.', 'It\'s nothing. Don\'t worry.', 'pasa=happens; nada=nothing', 'The kindest thing to say when someone apologises.'),
      ] },
    ],
  },
  // A2. Passing the A1 exam opens all of these at once.
  {
    id: 'u20', topic: 'Opinions', rank: 'A2', level: 31, title: 'What I think', blurb: 'Opinions, feelings and doubts.',
    lessons: [
      { id: 'u20l1', title: 'Feelings and opinions', goal: 'I think, I feel, I\'m not sure', items: [
        p('Creo que tienes razón.', 'I think you\'re right.', 'razón=reason, being right', '"Tener razón", like Italian "avere ragione".'),
        p('Para mí, es un error.', 'In my opinion, it\'s a mistake.', 'para mí=in my opinion; error=mistake', 'Use mí with an accent after a preposition.'),
        p('Me parece bien.', 'That sounds good to me.', 'me parece=it seems to me'),
        p('No estoy seguro.', 'I\'m not sure.', 'seguro=sure', 'To say "sure", estar. With ser, seguro means "safe".'),
        p('Estoy de acuerdo.', 'I agree.', 'de acuerdo=in agreement', 'Always with estar: not "soy de acuerdo".'),
        p('Me da igual.', 'I don\'t mind.', 'igual=the same'),
        p('Estoy harto.', 'I\'m fed up.', 'harto=fed up'),
        p('Me preocupa el trabajo.', 'Work worries me.', 'me preocupa=it worries me'),
      ] },
      { id: 'u20l2', title: 'Home and family words', goal: 'Everyone in your family, and where they live', items: [
        p('Mis abuelos viven en el pueblo.', 'My grandparents live in the village.', 'abuelos=grandparents; pueblo=village, small town'),
        p('Mi tío es el hermano de mi madre.', 'My uncle is my mother\'s brother.', 'tío=uncle; hermano=brother'),
        p('Mi prima se casa en junio.', 'My cousin is getting married in June.', 'prima=cousin (female); se casa=gets married'),
        p('Mi cuñado trabaja en un banco.', 'My brother-in-law works in a bank.', 'cuñado=brother-in-law', 'Close to "cognato", with the Spanish ñ.'),
        p('Mis suegros son muy majos.', 'My in-laws are really nice.', 'suegros=parents-in-law; majos=nice', '"Majo" is pure Spain: friendly, kind.'),
        p('Vivimos en un piso pequeño.', 'We live in a small flat.', 'piso=flat, floor; pequeño=small', 'In Spain a flat is a piso. "Piccolo" is pequeño, not "poco".'),
        p('El piso tiene dos habitaciones.', 'The flat has two bedrooms.', 'habitaciones=rooms, bedrooms'),
      ] },
    ],
  },
  {
    id: 'u21', topic: 'Travel', rank: 'A2', level: 33, title: 'Travelling', blurb: 'Hotels, trains, and what to do when something goes wrong.',
    lessons: [
      { id: 'u21l1', title: 'Train and hotel', goal: 'Book, check in and get there', items: [
        p('Quiero reservar una habitación doble.', 'I\'d like to book a double room.', 'reservar=to book; doble=double'),
        p('Tengo una reserva a nombre de Fazzi.', 'I have a booking under the name Fazzi.', 'reserva=booking; a nombre de=under the name of'),
        p('¿A qué hora sale el tren?', 'What time does the train leave?', 'sale=leaves; tren=train', 'Salir means to go out or leave. "To go up" is subir.'),
        p('Un billete de ida y vuelta.', 'A return ticket.', 'billete=ticket; ida=going; vuelta=return'),
        p('¿De qué andén sale?', 'Which platform does it leave from?', 'andén=platform'),
        p('He perdido el tren.', 'I\'ve missed the train.', 'he perdido=I\'ve lost, missed'),
        p('¿Está incluido el desayuno?', 'Is breakfast included?', 'incluido=included; desayuno=breakfast'),
      ] },
    ],
  },
  {
    id: 'u22', topic: 'Health', rank: 'A2', level: 35, title: 'Health', blurb: 'Say what hurts and understand the answer.',
    lessons: [
      { id: 'u22l1', title: 'At the pharmacy', goal: 'Get help for ordinary problems', items: [
        p('Me duele la cabeza.', 'I have a headache.', 'me duele=it hurts me; cabeza=head', 'It works like gustar: the head hurts me. No "my": "la cabeza".'),
        p('Me duelen los pies.', 'My feet hurt.', 'pies=feet'),
        p('Tengo fiebre.', 'I have a fever.', 'fiebre=fever'),
        p('Estoy resfriado.', 'I have a cold.', 'resfriado=with a cold'),
        p('Necesito algo para la tos.', 'I need something for a cough.', 'necesito=I need; algo=something; tos=cough', 'La tos is feminine, like Italian "la tosse".'),
        p('Tómalo dos veces al día.', 'Take it twice a day.', 'tómalo=take it; veces=times'),
        p('¿Tienes algo para el dolor?', 'Do you have something for pain?', 'dolor=pain'),
      ] },
    ],
  },
];

export const LESSONS = UNITS.flatMap((u) => u.lessons.map((l) => ({ ...l, level: l.level ?? u.level, rank: u.rank || 'A1', unit: u })));
export const lessonById = (id) => LESSONS.find((l) => l.id === id);

// Every word the course teaches, with its meaning, first meaning wins.
export const COURSE_WORDS = (() => {
  const map = new Map();
  for (const l of LESSONS) {
    for (const it of l.items) {
      if (!it.tr.includes(' ') && !it.tr.includes('{')) {
        const k = clean(it.tr);
        if (!map.has(k)) map.set(k, { tr: it.tr.replace(/[.!?¡¿,]/g, ''), en: it.en.replace(/[.!?]$/, '') });
      }
      for (const w of it.words) {
        const k = clean(w.tr);
        if (!map.has(k)) map.set(k, { tr: w.tr, en: w.en });
      }
    }
  }
  return [...map.values()];
})();
