// Everything the placement tests can catch, one entry per rule: how it works, a table, and
// sentences to practise. A wrong answer in a test opens its rule in the study section.
// cat: grammar, rules (sounds and spelling) or vocab. Examples use the same p() as the course.
import { p } from '../course.js';

const R = (id, cat, rank, title, explain, table, examples) => ({ id, cat, rank, title, explain, table, examples });

export const RULES = [
  /* ---------- A1 grammar ---------- */
  R('articles', 'grammar', 'A1', 'El, la, un, una', [
    'Two articles, not three: el for masculine, la for feminine, and there is no "lo" or "gli" before vowels. Plurals are los and las. "A" is un, una.',
    'Most words keep their Italian gender, but not all: la leche, la sal, la sangre, el árbol. Words in -ma from Greek are masculine, as in Italian: el problema, el idioma. Words in -ción and -dad are feminine.',
  ], [['el libro', 'the book'], ['la casa', 'the house'], ['los amigos', 'the friends'], ['las llaves', 'the keys'], ['un coche', 'a car'], ['una mesa', 'a table']], [
    p('El problema es grave.', 'The problem is serious.', 'grave=serious'),
    p('La leche está fría.', 'The milk is cold.'),
    p('Tengo un coche y una moto.', 'I have a car and a motorbike.', 'moto=motorbike'),
    p('Los amigos de Ana son simpáticos.', 'Ana\'s friends are nice.'),
    p('La ciudad es muy bonita.', 'The city is very nice.'),
    p('El árbol es muy alto.', 'The tree is very tall.'),
  ]),
  R('plurals', 'grammar', 'A1', 'Plurals: -s and -es', [
    'Italian changes the last vowel. Spanish adds something: -s after a vowel (casa, casas), -es after a consonant (ciudad, ciudades).',
    'A final z becomes c: la luz, las luces. Written accents can drop when the stress no longer needs them: la habitación, las habitaciones. Café keeps its accent: cafés.',
  ], [['la casa, las casas', 'house, houses'], ['el café, los cafés', 'coffee, coffees'], ['la ciudad, las ciudades', 'city, cities'], ['la luz, las luces', 'light, lights']], [
    p('Dos cafés, por favor.', 'Two coffees, please.'),
    p('Las ciudades son grandes.', 'The cities are big.'),
    p('Tengo tres hermanos.', 'I have three brothers and sisters.'),
    p('Las habitaciones son pequeñas.', 'The rooms are small.'),
    p('Hay muchas luces en la calle.', 'There are a lot of lights in the street.'),
  ]),
  R('adjectives', 'grammar', 'A1', 'Adjectives agree', [
    'Adjectives match their noun, as in Italian, but with Spanish endings: alto, alta, altos, altas. Those ending in -e or a consonant have one form for both genders: grande, azul; plural: grandes, azules.',
    'They usually come after the noun: una casa bonita. Bueno and malo shorten before a masculine noun: un buen día, un mal día.',
  ], [['un chico alto', 'a tall boy'], ['una chica alta', 'a tall girl'], ['los chicos altos', 'the tall boys'], ['una casa grande', 'a big house']], [
    p('Mi hermana es muy simpática.', 'My sister is very nice.'),
    p('Es una chica muy alta.', 'She\'s a very tall girl.', 'chica=girl'),
    p('Los zapatos son nuevos.', 'The shoes are new.'),
    p('Tengo una casa grande.', 'I have a big house.'),
    p('Hoy hace un buen día.', 'It\'s a good day today.'),
    p('Las chicas están contentas.', 'The girls are happy.'),
  ]),
  R('ser-estar', 'grammar', 'A1', 'Ser or estar', [
    'Ser says what something is: nationality, job, name, what it\'s like by nature, the time. Soy italiano, es médico, son las tres.',
    'Estar says how or where it is: position and passing states. Estoy en casa, Madrid está en España, estoy cansado. If you could say "stare" in Italian, use estar.',
  ], [['soy, eres, es', 'I am, you are, she is (what)'], ['somos, sois, son', 'we are, you all are, they are'], ['estoy, estás, está', 'I am, you are, she is (how, where)'], ['estamos, estáis, están', 'we are, you all are, they are']], [
    p('Soy italiano.', 'I\'m Italian.'),
    p('Estoy muy cansado.', 'I\'m very tired.'),
    p('Madrid está en España.', 'Madrid is in Spain.'),
    p('Mi hermano es médico.', 'My brother is a doctor.'),
    p('¿Dónde estás?', 'Where are you?'),
    p('Estamos contentos.', 'We\'re happy.'),
  ]),
  R('tener', 'grammar', 'A1', 'Tener: have, and age', [
    'Tener is the "avere" of owning: tengo, tienes, tiene, tenemos, tenéis, tienen. Age, hunger, thirst, cold and fear all take it, as in Italian: tengo veinte años, tengo hambre.',
    'Spanish never uses "soy" for age. "Haber" is a different verb, that only helps others: he comido.',
  ], [['tengo', 'I have'], ['tienes', 'you have'], ['tiene', 'she has'], ['tenemos', 'we have'], ['tienen', 'they have']], [
    p('Tengo veinticinco años.', 'I\'m twenty-five.'),
    p('Tengo hambre.', 'I\'m hungry.'),
    p('¿Tienes frío?', 'Are you cold?'),
    p('Mi hermana tiene dos hijos.', 'My sister has two children.'),
    p('No tenemos tiempo.', 'We don\'t have time.'),
  ]),
  R('hay', 'grammar', 'A1', 'Hay or está', [
    'Hay introduces something new: hay un banco aquí. It never changes for plural: hay dos bancos. No el or la after it.',
    'Estar locates something you already know about: el banco está aquí. So: "there is a bank" with hay, "the bank is" with está.',
  ], [['hay un bar', 'there\'s a bar'], ['hay dos bares', 'there are two bars'], ['el bar está aquí', 'the bar is here'], ['no hay leche', 'there\'s no milk']], [
    p('En la mesa hay dos vasos.', 'There are two glasses on the table.'),
    p('Hay un banco cerca.', 'There\'s a bank nearby.'),
    p('El banco está cerca.', 'The bank is nearby.'),
    p('No hay leche.', 'There\'s no milk.'),
    p('¿Hay muchos restaurantes?', 'Are there many restaurants?'),
  ]),
  R('present-regular', 'grammar', 'A1', 'Present: regular verbs', [
    '-ar: hablo, hablas, habla, hablamos, habláis, hablan. -er: como, comes, come, comemos, coméis, comen. -ir: vivo, vives, vive, vivimos, vivís, viven.',
    'Subject words like yo and tú are usually dropped. "Tú" endings are all in -s, and "they" endings in -n, which helps Italians: Italian "-no" is just -n.',
  ], [['hablo', 'I speak'], ['comes', 'you eat'], ['vive', 'she lives'], ['hablamos', 'we speak'], ['coméis', 'you all eat'], ['viven', 'they live']], [
    p('Hablamos español.', 'We speak Spanish.'),
    p('Comes mucho.', 'You eat a lot.'),
    p('Viven en Madrid.', 'They live in Madrid.'),
    p('Trabajo en una oficina.', 'I work in an office.'),
    p('¿Dónde vivís?', 'Where do you all live?'),
    p('Mi hermana escribe mucho.', 'My sister writes a lot.'),
  ]),
  R('present-irregular', 'grammar', 'A1', 'Present: irregular verbs', [
    'Many verbs change a vowel inside, except for we and you all: quiero, quieres, quiere, queremos. Puedo, puedes, puede, podemos. Duermo, duermes, duerme, dormimos.',
    'Others are odd only in "I": hago, pongo, salgo, vengo, tengo, sé, veo, doy. And ir is its own: voy, vas, va, vamos, vais, van.',
  ], [['quiero', 'I want'], ['puedo', 'I can'], ['duermo', 'I sleep'], ['hago', 'I do'], ['salgo', 'I go out'], ['voy', 'I go']], [
    p('Quiero un café.', 'I want a coffee.'),
    p('Mañana voy a Sevilla.', 'Tomorrow I\'m going to Seville.'),
    p('No puedo venir.', 'I can\'t come.'),
    p('Duermo ocho horas.', 'I sleep eight hours.'),
    p('Hago la cena.', 'I\'m making dinner.'),
    p('Salgo de casa a las ocho.', 'I leave home at eight.'),
    p('¿Qué quieres hacer?', 'What do you want to do?'),
  ]),
  R('gustar', 'grammar', 'A1', 'Gustar', [
    'Gustar is Italian "piacere": what you like is the subject. Me gusta el café, me gustan los perros, as "mi piace", "mi piacciono".',
    'Keep the article: me gusta el vino. For emphasis or to make "le" clear, add a mí, a ti, a ella: a mí me gusta. To agree: a mí también, a mí tampoco.',
  ], [['me gusta el café', 'I like coffee'], ['me gustan los gatos', 'I like cats'], ['te gusta', 'you like'], ['le gusta', 'she likes'], ['nos gusta', 'we like']], [
    p('Me gustan los perros.', 'I like dogs.'),
    p('¿Te gusta el vino?', 'Do you like wine?'),
    p('A ella le gusta bailar.', 'She likes dancing.'),
    p('No me gustan las películas de miedo.', 'I don\'t like horror films.', 'miedo=fear'),
    p('Nos gusta mucho España.', 'We like Spain a lot.'),
    p('A mí también.', 'Me too.'),
  ]),
  R('reflexive', 'grammar', 'A1', 'Me levanto: reflexive verbs', [
    'As in Italian, a small word comes before the verb: me levanto, te levantas, se levanta, nos levantamos, os levantáis, se levantan.',
    'Spanish uses it a little differently: me llamo, me ducho, me acuesto, me voy. After another verb it can stick to the end: tengo que levantarme.',
  ], [['me levanto', 'I get up'], ['te duchas', 'you shower'], ['se acuesta', 'she goes to bed'], ['nos vamos', 'we\'re leaving']], [
    p('Me levanto a las siete.', 'I get up at seven.'),
    p('Se llama Ana.', 'Her name is Ana.'),
    p('¿A qué hora te acuestas?', 'What time do you go to bed?'),
    p('Nos vamos mañana.', 'We\'re leaving tomorrow.'),
    p('Me ducho por la mañana.', 'I shower in the morning.'),
  ]),
  R('questions', 'grammar', 'A1', 'Asking questions', [
    'Question words carry a written accent: qué, quién, dónde, cuándo, cómo, cuánto, cuál, por qué. Spanish opens every question with ¿.',
    'Cuánto agrees with what you count: cuántos años, cuántas personas. "Which" before a noun is usually qué: ¿qué libro?',
  ], [['¿qué?', 'what?'], ['¿dónde?', 'where?'], ['¿cuándo?', 'when?'], ['¿quién?', 'who?'], ['¿cuántos?', 'how many?'], ['¿por qué?', 'why?']], [
    p('¿Dónde vives?', 'Where do you live?'),
    p('¿Cuántos años tienes?', 'How old are you?'),
    p('¿Cuándo llegas?', 'When do you get here?'),
    p('¿Quién es?', 'Who is it?'),
    p('¿Por qué no vienes?', 'Why aren\'t you coming?'),
    p('¿Qué libro quieres?', 'Which book do you want?'),
  ]),
  R('possessives', 'grammar', 'A1', 'Mi, tu, su', [
    'No article in front: mi casa, never "la mi casa". This is the big difference from Italian. Family words the same: mi madre, tus hermanos.',
    'They only change for plural: mi, mis; tu, tus; su, sus. Only nuestro and vuestro change for feminine: nuestra casa.',
  ], [['mi casa', 'my house'], ['tu coche', 'your car'], ['su madre', 'his, her, their mother'], ['nuestra hija', 'our daughter'], ['mis amigos', 'my friends']], [
    p('Esta es mi madre.', 'This is my mother.'),
    p('Mis padres viven en Italia.', 'My parents live in Italy.'),
    p('¿Dónde está tu coche?', 'Where is your car?'),
    p('Nuestra casa es pequeña.', 'Our house is small.'),
    p('Su hermano es médico.', 'Her brother is a doctor.'),
  ]),
  R('demonstratives', 'grammar', 'A1', 'Este, ese, aquel', [
    'Este is near me (questo), ese is near you (codesto, or Italian "quello"), aquel is far from us both. They change like adjectives: este libro, esta casa, estos libros, estas casas.',
    'Esto and eso mean "this thing": ¿qué es esto? They never go with a noun.',
  ], [['este libro', 'this book'], ['esta casa', 'this house'], ['ese coche', 'that car'], ['aquella montaña', 'that mountain'], ['esto', 'this (thing)']], [
    p('¿Cuánto cuesta este libro?', 'How much is this book?'),
    p('Esta es mi casa.', 'This is my house.'),
    p('¿Qué es esto?', 'What\'s this?'),
    p('Ese coche es muy caro.', 'That car is very expensive.'),
    p('Me gustan estos zapatos.', 'I like these shoes.'),
  ]),
  R('prepositions', 'grammar', 'A1', 'A, en, de: al and del', [
    'Movement to a place takes a: voy a Madrid. Being in a place takes en: estoy en Madrid. Italian "a Roma" splits in two.',
    'A plus el is al, de plus el is del. Only those two join; la, los, las don\'t. And a person as object takes a: veo a Ana, as southern Italian "ho visto a Maria".',
  ], [['voy a Madrid', 'I\'m going to Madrid'], ['estoy en Madrid', 'I\'m in Madrid'], ['voy al banco', 'I\'m going to the bank'], ['vengo del banco', 'I\'m coming from the bank'], ['veo a Ana', 'I see Ana']], [
    p('Voy al banco.', 'I\'m going to the bank.'),
    p('Estoy en Madrid.', 'I\'m in Madrid.'),
    p('Vengo del trabajo.', 'I\'m coming from work.'),
    p('Vamos a la playa.', 'We\'re going to the beach.'),
    p('Veo a Ana.', 'I see Ana.'),
    p('Soy de Roma.', 'I\'m from Rome.'),
  ]),
  R('ir-a', 'grammar', 'A1', 'Future: voy a + verb', [
    'Ir plus a plus a verb is the everyday future: voy a comer, vas a venir, va a llover. The a is always there, even though Italian has nothing like it.',
    'Vamos a comer can also be "let\'s eat".',
  ], [['voy a comer', 'I\'m going to eat'], ['vas a venir', 'you\'re going to come'], ['va a llover', 'it\'s going to rain'], ['vamos a ver', 'we\'re going to see']], [
    p('Mañana voy a comer con Ana.', 'Tomorrow I\'m having lunch with Ana.'),
    p('¿Qué vas a hacer?', 'What are you going to do?'),
    p('Va a llover.', 'It\'s going to rain.'),
    p('No voy a salir.', 'I\'m not going out.'),
    p('Vamos a viajar a España.', 'We\'re going to travel to Spain.', 'viajar=to travel'),
  ]),
  R('muy-mucho', 'grammar', 'A1', 'Muy or mucho', [
    'Italian "molto" splits in two. Muy goes before adjectives and adverbs: muy bueno, muy bien. It never changes.',
    'Mucho goes with nouns, and agrees: mucho calor, mucha gente, muchos amigos. Or after a verb, unchanged: trabajo mucho.',
  ], [['muy bueno', 'very good'], ['muy bien', 'very well'], ['mucho calor', 'a lot of heat'], ['mucha gente', 'many people'], ['trabajo mucho', 'I work a lot']], [
    p('Hace mucho calor.', 'It\'s very hot.'),
    p('Estoy muy cansado.', 'I\'m very tired.'),
    p('Hay mucha gente.', 'There are a lot of people.'),
    p('Trabajo mucho.', 'I work a lot.'),
    p('Tengo muchos amigos.', 'I have many friends.'),
    p('La paella está muy buena.', 'The paella is very good.'),
  ]),

  /* ---------- A1 vocabulary ---------- */
  R('numbers', 'vocab', 'A1', 'Numbers', [
    '1 to 15 each have a name: once, doce, trece, catorce, quince. Then dieciséis, diecisiete, and veintiuno, veintidós in one word. From 31, tens and units are joined by y: treinta y uno.',
    'Cien is exactly 100, ciento the rest: ciento uno. Hundreds agree: doscientos euros, doscientas personas. 500 is quinientos.',
  ], [['quince', '15'], ['dieciséis', '16'], ['veintisiete', '27'], ['treinta y cinco', '35'], ['cien', '100'], ['quinientos', '500']], [
    p('quince', 'fifteen'), p('veintisiete', 'twenty-seven'), p('treinta y cinco', 'thirty-five'),
    p('cien', 'a hundred'), p('quinientos', 'five hundred'), p('mil', 'a thousand'),
  ]),
  R('time', 'vocab', 'A1', 'Telling the time', [
    'Ser with la or las: es la una, son las dos. Minutes follow y up to half past, then menos: son las tres y media, son las cuatro menos cuarto.',
    'At a time: a las ocho. Parts of the day: por la mañana, por la tarde, por la noche. With a clock time: a las ocho de la mañana.',
  ], [['es la una', 'it\'s one o\'clock'], ['son las dos', 'it\'s two o\'clock'], ['son las tres y media', 'it\'s half past three'], ['son las cuatro menos cuarto', 'it\'s quarter to four'], ['a las ocho', 'at eight']], [
    p('Son las tres y media.', 'It\'s half past three.'),
    p('Es la una.', 'It\'s one o\'clock.'),
    p('Son las cuatro menos cuarto.', 'It\'s quarter to four.'),
    p('Comemos a las dos.', 'We eat at two.'),
    p('¿Qué hora es?', 'What time is it?'),
  ]),
  R('days-months', 'vocab', 'A1', 'Days, months, seasons', [
    'Lunes, martes, miércoles, jueves, viernes, sábado, domingo. They take el for "on": el lunes (on Monday), los lunes (on Mondays). No capital letter.',
    'Enero, febrero, marzo, abril, mayo, junio, julio, agosto, septiembre, octubre, noviembre, diciembre. Seasons: primavera, verano, otoño, invierno.',
  ], [['lunes', 'Monday'], ['miércoles', 'Wednesday'], ['domingo', 'Sunday'], ['enero', 'January'], ['agosto', 'August'], ['invierno', 'winter']], [
    p('El lunes trabajo.', 'On Monday I\'m working.'),
    p('Los domingos como en casa.', 'On Sundays I eat at home.'),
    p('Mi cumpleaños es en enero.', 'My birthday is in January.'),
    p('En agosto hace calor.', 'It\'s hot in August.'),
    p('el miércoles', 'Wednesday'),
    p('el jueves', 'Thursday'),
    p('el viernes', 'Friday'),
    p('el invierno', 'winter'),
  ]),
  R('vocab-family', 'vocab', 'A1', 'Family and people', [
    'Plurals in the masculine cover everyone: los padres (parents), los hermanos (brothers and sisters), los hijos (children).',
    'Two traps: el marido (husband) sounds right, but la mujer also means "wife". And "los parientes" means relatives, not parents.',
  ], [['la hermana', 'sister'], ['los padres', 'parents'], ['el marido', 'husband'], ['la mujer', 'wife, woman'], ['el niño', 'child']], [
    p('la hermana', 'sister'), p('el hijo', 'son'), p('el marido', 'husband'), p('la mujer', 'wife, woman'), p('el niño', 'child'), p('los padres', 'parents'),
  ]),
  R('vocab-food', 'vocab', 'A1', 'Food and drink', [
    'Mind the differences from Italian. Pan, not "pane". Queso, not "formaggio". Pescado is fish on a plate, pez is alive. Zumo is juice in Spain.',
    'Meals: el desayuno (breakfast), la comida (lunch), la cena (dinner). In Spain "comer" alone means to have lunch.',
  ], [['el pan', 'bread'], ['el queso', 'cheese'], ['el pescado', 'fish'], ['el pollo', 'chicken'], ['la cena', 'dinner']], [
    p('el pan', 'bread'), p('el queso', 'cheese'), p('el pescado', 'fish'), p('la cena', 'dinner'), p('el desayuno', 'breakfast'), p('el zumo', 'juice'),
  ]),
  R('vocab-daily', 'vocab', 'A1', 'Everyday words', [
    'Words you need daily, and that look nothing like Italian: la cuenta (bill), el coche (car), la calle (street), hablar (to speak), trabajar (to work), rojo (red).',
    'Colours agree when they end in -o: rojo, roja. Azul and verde have one form.',
  ], [['rojo', 'red'], ['la calle', 'street'], ['el coche', 'car'], ['barato', 'cheap'], ['hablar', 'to speak']], [
    p('rojo', 'red'), p('el coche', 'car'), p('la calle', 'street'), p('barato', 'cheap'), p('la cuenta', 'the bill'), p('izquierda', 'left'), p('derecha', 'right'),
  ]),
  R('false-friends', 'vocab', 'A1', 'False friends', [
    'Words that look Italian and aren\'t. Salir means to go out, subir to go up. Burro is a donkey; butter is mantequilla. Largo is long; wide is ancho.',
    'Also: guardar (to keep), caldo (broth), rato (a while), aceite (oil), vaso (a glass), copa (a wine glass, or a drink).',
  ], [['salir', 'to go out'], ['subir', 'to go up'], ['el burro', 'donkey'], ['la mantequilla', 'butter'], ['largo', 'long'], ['el aceite', 'oil']], [
    p('Salgo de casa.', 'I\'m leaving home.'),
    p('Subo al quinto piso.', 'I\'m going up to the fifth floor.', 'quinto=fifth'),
    p('El burro come mucho.', 'The donkey eats a lot.'),
    p('Pan con mantequilla.', 'Bread and butter.'),
    p('La calle es muy larga.', 'The street is very long.'),
    p('Necesito aceite.', 'I need oil.'),
  ]),

  /* ---------- A1 sounds and spelling ---------- */
  R('sounds-letters', 'rules', 'A1', 'Letters that fool Italians', [
    'j, and g before e and i, are a rough throat sound. z, and c before e and i, are "th". h is silent. b and v are the same. ll is y, ñ is gn, qu is k.',
    'See Pronounce, Sound guide, to hear each one.',
  ], [['jamón', 'j: rough'], ['gente', 'ge: rough'], ['cena', 'ce: th'], ['zapato', 'z: th'], ['hola', 'h: silent'], ['vino', 'v: b']], [
    p('jamón', 'ham'), p('gente', 'people'), p('cena', 'dinner'), p('zapato', 'shoe'), p('hola', 'hello'), p('vino', 'wine'), p('llave', 'key'), p('queso', 'cheese'),
  ]),
  R('stress', 'rules', 'A1', 'Stress and written accents', [
    'Words ending in a vowel, n or s stress the one but last syllable: casa, hablan, zapatos. Others stress the last: hablar, ciudad, español.',
    'A written accent marks anything that breaks this: café, inglés, también, árbol, teléfono. So a written accent is the only exception you need to learn, and it always tells you where to lean.',
  ], [['casa', 'CA-sa'], ['hablan', 'HA-blan'], ['hablar', 'ha-BLAR'], ['café', 'ca-FÉ'], ['árbol', 'ÁR-bol'], ['teléfono', 'te-LÉ-fo-no']], [
    p('hablan', 'they speak'), p('hablar', 'to speak'), p('ciudad', 'city'), p('teléfono', 'telephone'), p('árbol', 'tree'), p('también', 'also'),
  ]),
  R('spelling', 'rules', 'A1', 'Spelling: one sound, one way', [
    'The k sound is c before a, o, u and qu before e, i: casa, queso. The hard g is g before a, o, u and gu before e, i: gato, guitarra.',
    'The th sound is z before a, o, u and c before e, i: zapato, cena. Almost no double letters: only rr, ll, cc and nn. Italian "mamma", "tutto", "cassa" are mamá, todo, caja.',
  ], [['casa, queso', 'k sound'], ['gato, guitarra', 'hard g'], ['zapato, cena', 'th sound'], ['perro, pero', 'rr or r']], [
    p('queso', 'cheese'), p('guitarra', 'guitar'), p('mamá', 'mum'), p('todo', 'everything'), p('pero', 'but'), p('perro', 'dog'),
  ]),

  /* ---------- A2 grammar ---------- */
  R('perfecto', 'grammar', 'A2', 'Have done: he comido', [
    'Haber plus -ado or -ido: he hablado, has comido, ha vivido, hemos, habéis, han. Always haber, never ser: Ana ha llegado. The ending never agrees.',
    'Spain uses it for anything linked to now: hoy, esta semana, este año, ya, todavía no, nunca. Irregular: hecho, dicho, visto, escrito, puesto, vuelto, roto, abierto.',
  ], [['he comido', 'I\'ve eaten'], ['ha llegado', 'she\'s arrived'], ['he hecho', 'I\'ve done'], ['he dicho', 'I\'ve said'], ['he visto', 'I\'ve seen'], ['he escrito', 'I\'ve written']], [
    p('Hoy he comido en casa.', 'Today I ate at home.'),
    p('Ana ha llegado.', 'Ana has arrived.'),
    p('Todavía no he terminado.', 'I haven\'t finished yet.'),
    p('¿Has visto a Pablo?', 'Have you seen Pablo?'),
    p('Este año hemos viajado mucho.', 'We\'ve travelled a lot this year.'),
    p('He escrito un mensaje.', 'I\'ve written a message.'),
    p('Se ha roto la ventana.', 'The window has broken.'),
  ]),
  R('indefinido', 'grammar', 'A2', 'The finished past: hablé, comí', [
    '-ar: hablé, hablaste, habló, hablamos, hablasteis, hablaron. -er and -ir: comí, comiste, comió, comimos, comisteis, comieron.',
    'Use it for closed time: ayer, el lunes, la semana pasada, en 2020. The written accent is everything: hablo (I speak), habló (she spoke).',
  ], [['hablé', 'I spoke'], ['hablaste', 'you spoke'], ['habló', 'she spoke'], ['comí', 'I ate'], ['comió', 'she ate'], ['comieron', 'they ate']], [
    p('Ayer hablé con Ana.', 'Yesterday I spoke to Ana.'),
    p('¿Comiste bien?', 'Did you eat well?'),
    p('Vivieron en Roma dos años.', 'They lived in Rome for two years.'),
    p('La semana pasada trabajé mucho.', 'Last week I worked a lot.'),
    p('Ella llegó el lunes.', 'She arrived on Monday.'),
    p('Compraron una casa en 2020.', 'They bought a house in 2020.'),
  ]),
  R('indefinido-irregular', 'grammar', 'A2', 'The past: hice, tuve, fui', [
    'New roots, without written accents: hice, tuve, estuve, pude, puse, vine, quise, supe, dije, traje. Endings: -e, -iste, -o, -imos, -isteis, -ieron. Dijeron and trajeron lose the i.',
    'Ser and ir are the same: fui, fuiste, fue, fuimos, fuisteis, fueron. Dar: di, diste, dio. Ver: vi, viste, vio. Hacer has a z in "she": hizo.',
  ], [['hice', 'I did'], ['hizo', 'she did'], ['tuve', 'I had'], ['estuve', 'I was'], ['dije', 'I said'], ['fui', 'I went, I was']], [
    p('Ayer hice la compra.', 'Yesterday I did the shopping.'),
    p('Fui a Madrid en mayo.', 'I went to Madrid in May.'),
    p('Tuve un problema.', 'I had a problem.'),
    p('Ella no pudo venir.', 'She couldn\'t come.'),
    p('¿Qué dijo Ana?', 'What did Ana say?'),
    p('¿Qué hizo Pablo?', 'What did Pablo do?'),
    p('Estuvimos en Sevilla.', 'We were in Seville.'),
  ]),
  R('imperfecto', 'grammar', 'A2', 'Used to: hablaba, comía', [
    '-ar: hablaba, hablabas, hablaba, hablábamos, hablabais, hablaban. -er and -ir: comía, comías, comía, comíamos, comíais, comían.',
    'Three irregular: era, iba, veía. It paints the background and repeated habits, as Italian "parlavo": de pequeño vivía en Roma. Había is "there was, there were".',
  ], [['hablaba', 'I used to speak'], ['comía', 'I used to eat'], ['era', 'I was, it was'], ['iba', 'I used to go'], ['veía', 'I used to see'], ['había', 'there was']], [
    p('De pequeño vivía en Roma.', 'As a child I lived in Rome.'),
    p('Antes iba al gimnasio.', 'I used to go to the gym.'),
    p('Era muy tarde.', 'It was very late.'),
    p('Había mucha gente.', 'There were a lot of people.'),
    p('Siempre comíamos juntos.', 'We always ate together.'),
    p('Veía mucho la tele.', 'I used to watch a lot of TV.', 'tele=TV'),
  ]),
  R('past-choice', 'grammar', 'A2', 'Which past?', [
    'Linked to today, or no time given: he comido. Closed, finished time: ayer comí. Background, or habit: comía.',
    'Together: the imperfect sets the scene, the finished past says what happened: dormía cuando sonó el teléfono. Italian does the same with "dormivo quando ha suonato".',
  ], [['hoy he comido', 'today I ate'], ['ayer comí', 'yesterday I ate'], ['antes comía', 'I used to eat'], ['llovía cuando salí', 'it was raining when I went out']], [
    p('Hoy he trabajado mucho.', 'I\'ve worked a lot today.'),
    p('Ayer trabajé mucho.', 'Yesterday I worked a lot.'),
    p('Antes trabajaba mucho.', 'I used to work a lot.'),
    p('Llovía cuando salí.', 'It was raining when I went out.'),
    p('Dormía cuando sonó el teléfono.', 'I was sleeping when the phone rang.', 'sonó=rang'),
    p('Esta semana he visto a Ana.', 'I\'ve seen Ana this week.'),
  ]),
  R('gerundio', 'grammar', 'A2', 'Estoy hablando', [
    'Estar plus -ando (-ar verbs) or -iendo (-er and -ir verbs): estoy hablando, estoy comiendo. Leyendo, durmiendo, diciendo, oyendo are irregular.',
    'Pronouns go before estar, or on the end: lo estoy haciendo, estoy haciéndolo. Not for plans: salgo mañana, not "estoy saliendo mañana".',
  ], [['estoy hablando', 'I\'m speaking'], ['estás comiendo', 'you\'re eating'], ['está leyendo', 'she\'s reading'], ['están durmiendo', 'they\'re sleeping']], [
    p('Estoy comiendo.', 'I\'m eating.'),
    p('Ella está leyendo.', 'She\'s reading.'),
    p('Los niños están durmiendo.', 'The children are sleeping.'),
    p('¿Qué estás haciendo?', 'What are you doing?'),
    p('Lo estoy escribiendo.', 'I\'m writing it.'),
  ]),
  R('object-pronouns', 'grammar', 'A2', 'Lo, la, le', [
    'Lo, la, los, las replace what the verb acts on: lo veo, las compro. Le, les mean to him, to her, to them: le digo, les escribo.',
    'They go before the verb, or stick to the end of a plain verb, gerund or command: lo quiero ver, quiero verlo; dímelo.',
  ], [['lo veo', 'I see it'], ['la llamo', 'I call her'], ['los compro', 'I buy them'], ['le digo', 'I tell her'], ['quiero verlo', 'I want to see it']], [
    p('Lo veo mañana.', 'I\'ll see him tomorrow.'),
    p('Las compro aquí.', 'I buy them here.'),
    p('Le digo la verdad.', 'I tell him the truth.'),
    p('Quiero comprarlo.', 'I want to buy it.'),
    p('No la conozco.', 'I don\'t know her.'),
    p('Les escribo una carta.', 'I\'m writing them a letter.', 'carta=letter'),
  ]),
  R('double-pronouns', 'grammar', 'A2', 'Se lo doy', [
    '"To someone" comes first, then "what": me lo das, te la compro. As in Italian "me lo dai", without the change to "me".',
    'Le and les become se before lo, la, los, las: se lo doy, never "le lo doy". It can mean to him, to her, to them and to you (polite).',
  ], [['me lo das', 'you give it to me'], ['te lo digo', 'I\'ll tell you'], ['se lo doy', 'I give it to her'], ['se la compro', 'I buy it for him'], ['dámelo', 'give it to me']], [
    p('Se lo doy.', 'I give it to her.'),
    p('Te lo digo mañana.', 'I\'ll tell you tomorrow.'),
    p('¿Me lo compras?', 'Will you buy it for me?'),
    p('Se lo he dicho.', 'I\'ve told him.'),
    p('Dámelo.', 'Give it to me.'),
  ]),
  R('comparisons', 'grammar', 'A2', 'Más que, tan como, el mejor', [
    'Más alto que, menos alto que, tan alto como. Italian "di" and "che" are both que. With a number: más de dos.',
    'Mejor, peor, mayor, menor replace "más bueno", and so on. The most: el más alto de la clase, with de, not "in". Very: altísimo.',
  ], [['más alto que', 'taller than'], ['tan alto como', 'as tall as'], ['mejor que', 'better than'], ['el mejor de', 'the best in'], ['más de dos', 'more than two']], [
    p('Soy más alto que tú.', 'I\'m taller than you.'),
    p('Este vino es mejor que ese.', 'This wine is better than that one.'),
    p('Es tan caro como el otro.', 'It\'s as expensive as the other one.'),
    p('Es el mejor restaurante de Madrid.', 'It\'s the best restaurant in Madrid.'),
    p('Hay más de veinte personas.', 'There are more than twenty people.'),
    p('Mi hermano es mayor que yo.', 'My brother is older than me.'),
  ]),
  R('obligation', 'grammar', 'A2', 'Tener que, hay que, deber', [
    'Tener que is what I must do: tengo que trabajar. Hay que is for everyone, like "bisogna": hay que pagar. Deber is advice: debes dormir.',
    'Never "tengo de" or "tengo a": it\'s always tener que. For "not allowed": no se puede.',
  ], [['tengo que ir', 'I have to go'], ['hay que pagar', 'you have to pay'], ['debes dormir', 'you should sleep'], ['no se puede', 'it isn\'t allowed']], [
    p('Tengo que trabajar.', 'I have to work.'),
    p('Hay que pagar antes.', 'You have to pay first.'),
    p('Debes dormir más.', 'You should sleep more.'),
    p('Aquí no se puede aparcar.', 'You can\'t park here.', 'aparcar=to park'),
    p('Tuve que volver a casa.', 'I had to go back home.'),
  ]),
  R('por-para', 'grammar', 'A2', 'Por or para', [
    'Para: goal and destination. Para ti, para aprender, para mañana, sale para Madrid.',
    'Por: cause, way through, means, price, frequency. Por la lluvia, por el parque, por teléfono, por diez euros, dos veces por semana. And gracias por.',
  ], [['para ti', 'for you'], ['para aprender', 'in order to learn'], ['por la lluvia', 'because of the rain'], ['por el parque', 'through the park'], ['por teléfono', 'by phone'], ['gracias por', 'thanks for']], [
    p('Este regalo es para ti.', 'This present is for you.'),
    p('Estudio para aprender.', 'I study in order to learn.'),
    p('No salimos por la lluvia.', 'We didn\'t go out because of the rain.'),
    p('Paseo por el parque.', 'I walk through the park.'),
    p('Gracias por todo.', 'Thanks for everything.'),
    p('Lo compré por diez euros.', 'I bought it for ten euros.'),
  ]),
  R('conditional', 'grammar', 'A2', 'Would: me gustaría, podría', [
    'Add -ía to the whole verb: hablaría, comería, viviría. Irregular as in the future: podría, querría, tendría, haría, diría.',
    'Use it to be polite and give advice: me gustaría, ¿podría...?, deberías. As Italian "vorrei", "potrei", "dovresti".',
  ], [['me gustaría', 'I\'d like'], ['¿podría?', 'could you?'], ['deberías', 'you should'], ['haría', 'I would do'], ['tendría', 'I would have']], [
    p('Me gustaría un café.', 'I\'d like a coffee.'),
    p('¿Podría ayudarme?', 'Could you help me?'),
    p('Deberías dormir.', 'You should sleep.'),
    p('Yo no diría eso.', 'I wouldn\'t say that.'),
    p('¿Qué harías tú?', 'What would you do?'),
  ]),
  R('imperative', 'grammar', 'A2', 'Commands', [
    'For tú, use the he-or-she form: habla, come, escribe. Eight short ones: di, haz, ve, pon, sal, sé, ten, ven.',
    'Pronouns stick on the end: dámelo, siéntate. Negative commands change vowel: no hables, no comas, no vengas, no digas.',
  ], [['habla', 'speak'], ['come', 'eat'], ['haz', 'do'], ['ven', 'come'], ['dime', 'tell me'], ['no hables', 'don\'t speak']], [
    p('Ven aquí.', 'Come here.'),
    p('Dime la verdad.', 'Tell me the truth.'),
    p('Haz la cena.', 'Make dinner.'),
    p('No hables tan alto.', 'Don\'t speak so loudly.'),
    p('Siéntate aquí.', 'Sit here.'),
    p('No vengas tarde.', 'Don\'t come late.'),
  ]),
  R('indefinites', 'grammar', 'A2', 'Algo, nada, alguien, nadie', [
    'Algo, nada for things. Alguien, nadie for people. Alguno, ninguno for "some", "none": algún amigo, ningún problema, shortened before a masculine noun.',
    'As in Italian, a negative after the verb keeps no in front: no veo nada. Before the verb, no no: nadie viene. Tampoco is the negative of también.',
  ], [['algo', 'something'], ['nada', 'nothing'], ['alguien', 'someone'], ['nadie', 'nobody'], ['nunca', 'never'], ['tampoco', 'neither']], [
    p('No hay nadie.', 'There\'s nobody here.'),
    p('Nadie lo sabe.', 'Nobody knows.'),
    p('¿Quieres algo?', 'Do you want something?'),
    p('No quiero nada.', 'I don\'t want anything.'),
    p('No tengo ningún problema.', 'I don\'t have any problem.'),
    p('Yo tampoco.', 'Me neither.'),
  ]),
  R('ser-estar-2', 'grammar', 'A2', 'Ser and estar change the meaning', [
    'Es aburrido, boring; está aburrido, bored. Es listo, clever; está listo, ready. Es rico, rich; está rico, tasty. Es malo, bad; está malo, ill. Es seguro, safe; está seguro, sure.',
    'Events are ser: la fiesta es aquí. Weather with cold and hot uses hace, not "es": hace frío.',
  ], [['es aburrido', 'boring'], ['está aburrido', 'bored'], ['es listo', 'clever'], ['está listo', 'ready'], ['es rico', 'rich'], ['está rico', 'tasty']], [
    p('La clase es aburrida.', 'The lesson is boring.'),
    p('Estoy aburrido.', 'I\'m bored.'),
    p('La sopa está muy rica.', 'The soup is delicious.', 'sopa=soup'),
    p('Ya estoy listo.', 'I\'m ready now.'),
    p('La fiesta es en mi casa.', 'The party is at my place.'),
    p('Hoy hace frío.', 'It\'s cold today.'),
  ]),
  R('future', 'grammar', 'A2', 'The future: hablaré', [
    'Add -é, -ás, -á, -emos, -éis, -án to the whole verb: hablaré, comerás, vivirá. Irregular roots: tendré, podré, haré, diré, saldré, vendré, querré, pondré.',
    'Everyday Spanish prefers voy a hablar. The future is for predictions and promises, and for guesses: estará en casa, "sarà a casa".',
  ], [['hablaré', 'I will speak'], ['comerás', 'you will eat'], ['tendré', 'I will have'], ['haré', 'I will do'], ['vendrá', 'she will come']], [
    p('Mañana lloverá.', 'It will rain tomorrow.'),
    p('Te llamaré.', 'I\'ll call you.'),
    p('Lo haré mañana.', 'I\'ll do it tomorrow.'),
    p('El año que viene tendré más tiempo.', 'Next year I\'ll have more time.'),
    p('¿Vendrás a la fiesta?', 'Will you come to the party?'),
  ]),
  R('time-expressions', 'grammar', 'A2', 'Desde, hace, llevar, soler', [
    'Hace is "ago" and comes first: hace dos años, "due anni fa". Desde hace is "for" up to now: vivo aquí desde hace dos años, with a present, as Italian does. Desde is "since": desde 2020.',
    'Acabo de comer is "I\'ve just eaten". Suelo comer is "I usually eat", a verb Italian lacks. Volver a is "again": vuelvo a llamar.',
  ], [['hace dos años', 'two years ago'], ['desde hace dos años', 'for two years'], ['desde 2020', 'since 2020'], ['acabo de comer', 'I\'ve just eaten'], ['suelo comer', 'I usually eat']], [
    p('Llegué hace dos horas.', 'I arrived two hours ago.'),
    p('Vivo aquí desde hace tres años.', 'I\'ve lived here for three years.'),
    p('Acabo de llegar.', 'I\'ve just arrived.'),
    p('Suelo cenar a las nueve.', 'I usually have dinner at nine.'),
    p('Estudio español desde enero.', 'I\'ve been studying Spanish since January.'),
    p('Vuelvo a llamar mañana.', 'I\'ll call again tomorrow.'),
  ]),

  /* ---------- A2 vocabulary ---------- */
  R('vocab-travel', 'vocab', 'A2', 'Travel', [
    'Billete for trains and planes, entrada for shows. Maleta is suitcase; "valigia" doesn\'t exist. Equipaje is luggage.',
    'Perder el tren is to miss the train. Reservar is to book, sacar un billete is to buy a ticket.',
  ], [['el billete', 'ticket'], ['la maleta', 'suitcase'], ['el vuelo', 'flight'], ['la salida', 'departure'], ['la llegada', 'arrival']], [
    p('el billete', 'ticket'), p('la maleta', 'suitcase'), p('el vuelo', 'flight'), p('la llegada', 'arrival'), p('la salida', 'departure'),
    p('He perdido el tren.', 'I\'ve missed the train.'),
  ]),
  R('vocab-health', 'vocab', 'A2', 'Health', [
    'Doler works like gustar: me duele la cabeza, me duelen los pies. No "my": the body takes el or la.',
    'El médico, la receta (prescription), la pastilla. Estar resfriado is to have a cold. Estar embarazada is to be pregnant, not embarrassed!',
  ], [['me duele', 'it hurts me'], ['la receta', 'prescription'], ['la pastilla', 'pill'], ['resfriado', 'with a cold'], ['embarazada', 'pregnant']], [
    p('Me duele la cabeza.', 'I have a headache.'),
    p('Me duelen las piernas.', 'My legs hurt.'),
    p('Tengo fiebre.', 'I have a fever.'),
    p('Estoy resfriado.', 'I have a cold.'),
    p('Mi hermana está embarazada.', 'My sister is pregnant.'),
    p('la receta', 'prescription'),
  ]),
  R('vocab-home', 'vocab', 'A2', 'The home and work', [
    'El piso is a flat, or a floor. El alquiler is the rent. La nevera is the fridge, la lavadora the washing machine.',
    'Work: el sueldo (salary), el jefe (boss), trabajar en. The word for job interview is la entrevista.',
  ], [['el piso', 'flat'], ['el alquiler', 'rent'], ['la nevera', 'fridge'], ['el sueldo', 'salary'], ['la entrevista', 'interview']], [
    p('el alquiler', 'rent'), p('la nevera', 'fridge'), p('el sueldo', 'salary'), p('el jefe', 'boss'), p('la entrevista', 'interview'), p('el vecino', 'neighbour'),
  ]),
  R('vocab-clothes-weather', 'vocab', 'A2', 'Clothes and weather', [
    'Llevar is to wear: llevo una camisa. Ponerse is to put on. Weather: hace sol, hace viento, llueve, nieva, está nublado.',
    'La ropa is singular: la ropa está limpia. El abrigo is a coat, el jersey a sweater.',
  ], [['llevar', 'to wear'], ['el abrigo', 'coat'], ['llueve', 'it\'s raining'], ['nieva', 'it\'s snowing'], ['nublado', 'cloudy']], [
    p('Llevo un abrigo.', 'I\'m wearing a coat.'),
    p('Hace sol.', 'It\'s sunny.'),
    p('Llueve mucho.', 'It\'s raining a lot.'),
    p('Está nublado.', 'It\'s cloudy.'),
    p('La ropa está limpia.', 'The clothes are clean.', 'limpia=clean'),
  ]),
  R('false-friends-2', 'vocab', 'A2', 'More false friends', [
    'Embarazada is pregnant. Contestar is to answer, not to protest. Quitar is to take away. Tirar is to throw away (and to pull a door: tira means "pull"; empuja is "push"). Largo is long.',
    'Esposas can be wives, or handcuffs. Rato is a while, not a mouse. Andar is to walk. Llevar is to carry or to wear; traer is to bring.',
  ], [['contestar', 'to answer'], ['tirar', 'to throw away'], ['quitar', 'to take away'], ['el rato', 'a while'], ['andar', 'to walk']], [
    p('¿Puedes contestar?', 'Can you answer?'),
    p('Tiro la basura.', 'I\'m throwing away the rubbish.', 'basura=rubbish'),
    p('Quita eso de aquí.', 'Take that away from here.'),
    p('Espera un rato.', 'Wait a while.'),
    p('Voy andando.', 'I\'m walking there.'),
  ]),

  /* ---------- A2 sounds and spelling ---------- */
  R('diacritics', 'rules', 'A2', 'Accents that change the word', [
    'Short pairs differ only by an accent: tú (you), tu (your); él (he), el (the); mí (me), mi (my); sí (yes), si (if); té (tea), te (you); sé (I know), se (self); más (more), mas (but).',
    'Same in questions: qué, cómo, dónde carry the accent; que, como, donde don\'t: cuando llegues, ¿cuándo llegas?',
  ], [['tú', 'you'], ['tu', 'your'], ['él', 'he'], ['el', 'the'], ['sí', 'yes'], ['si', 'if']], [
    p('Tú y tu hermano.', 'You and your brother.'),
    p('Él tiene el coche.', 'He has the car.'),
    p('Sí, si quieres.', 'Yes, if you want.'),
    p('Para mí, mi casa es la mejor.', 'For me, my house is the best.'),
    p('No sé qué hacer.', 'I don\'t know what to do.'),
  ]),
  R('spelling-changes', 'rules', 'A2', 'Spelling changes in verbs', [
    'To keep a sound, the spelling changes before e: llegar, llegué; buscar, busqué; empezar, empecé. Only in "I" of the finished past.',
    'Between vowels, unstressed i becomes y: leer, leyó, leyeron; oír, oyó; creer, creyó.',
  ], [['llegué', 'I arrived'], ['busqué', 'I looked for'], ['empecé', 'I started'], ['leyó', 'she read'], ['creyó', 'she believed']], [
    p('Llegué tarde.', 'I arrived late.'),
    p('Busqué las llaves.', 'I looked for the keys.'),
    p('Empecé a estudiar.', 'I started to study.'),
    p('Pablo leyó el libro.', 'Pablo read the book.'),
    p('Pagué con tarjeta.', 'I paid by card.'),
  ]),
];

export const ruleById = (id) => RULES.find((r) => r.id === id);
