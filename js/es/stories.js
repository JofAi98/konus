// Stories: short listening built from words the course has taught.
// Listen first without text, then answer three questions. Each line: [spanish, english, words].

const S = (tr, en, w = '') => ({
  tr, en,
  words: w ? w.split(';').map((s) => s.trim()).filter(Boolean).map((s) => { const i = s.indexOf('='); return { tr: s.slice(0, i).trim(), en: s.slice(i + 1).trim() }; }) : [],
});
const Q = (q, options, a) => ({ q, options, a });

export const STORIES = [
  {
    id: 's1', level: 10, rank: 'A1', title: 'Un café', en: 'A coffee',
    lines: [
      S('Hoy hace muy buen tiempo.', 'The weather is lovely today.', 'hoy=today; tiempo=weather'),
      S('{name} está en un bar.', '{name} is in a bar.', 'bar=bar'),
      S('El camarero llega a la mesa.', 'The waiter comes to the table.', 'camarero=waiter'),
      S('—¡Hola! ¿Qué quieres?', '"Hello! What would you like?"'),
      S('—Un café, por favor.', '"A coffee, please."'),
      S('El café está muy caliente y muy bueno.', 'The coffee is very hot and very good.', 'caliente=hot'),
      S('En el móvil hay un mensaje: «¿Dónde estás?»', 'There\'s a message on the phone: "Where are you?"', 'móvil=mobile phone; mensaje=message'),
      S('{name} escribe: «Estoy en el bar. ¡Ven!»', '{name} writes: "I\'m in the bar. Come!"', 'escribe=writes'),
      S('Diez minutos después llega Lucía.', 'Ten minutes later Lucía arrives.', 'después=later'),
      S('—¡Dos cafés, por favor!', '"Two coffees, please!"'),
    ],
    questions: [
      Q('Where is {name}?', ['At home', 'In a bar', 'At work'], 1),
      Q('What does he order first?', ['A tea', 'A water', 'A coffee'], 2),
      Q('Who arrives ten minutes later?', ['The waiter', 'Lucía', 'His mother'], 1),
    ],
  },
  {
    id: 's2', level: 12, rank: 'A1', title: 'El domingo', en: 'Sunday',
    lines: [
      S('Hoy es domingo.', 'Today is Sunday.', 'domingo=Sunday'),
      S('Toda la familia come en casa.', 'The whole family is eating at home.', 'toda=all'),
      S('En la mesa hay jamón, queso, pan y tomates.', 'On the table there\'s ham, cheese, bread and tomatoes.'),
      S('La madre de Lucía hace una paella.', 'Lucía\'s mother is making a paella.', 'hace=makes'),
      S('Su padre lee el periódico.', 'Her father is reading the paper.', 'lee=reads; periódico=newspaper'),
      S('—¡A comer! —dice la madre.', '"Lunch is ready!" says the mother.', 'dice=says'),
      S('Yo como de todo.', 'I eat everything.', 'de todo=everything'),
      S('—¡Qué rica está la paella!', '"The paella is delicious!"'),
      S('Después tomamos café y hablamos mucho.', 'Afterwards we have coffee and talk a lot.', 'tomamos=we have'),
      S('En España, la comida del domingo dura horas.', 'In Spain, Sunday lunch lasts for hours.', 'dura=lasts'),
    ],
    questions: [
      Q('What day is it?', ['Saturday', 'Sunday', 'Monday'], 1),
      Q('Who makes the paella?', ['Lucía', 'Her father', 'Her mother'], 2),
      Q('What is her father doing?', ['Reading the paper', 'Cooking', 'Sleeping'], 0),
    ],
  },
  {
    id: 's3', level: 14, rank: 'A1', title: '¿Dónde está el móvil?', en: 'Where\'s the phone?',
    lines: [
      S('Son las ocho de la mañana.', 'It\'s eight in the morning.'),
      S('{name} tiene que salir de casa.', '{name} has to leave home.'),
      S('Pero no encuentra el móvil.', 'But he can\'t find his phone.', 'encuentra=finds'),
      S('—¿Dónde está mi móvil?', '"Where\'s my phone?"'),
      S('Mira en la mesa: no está.', 'He looks on the table: it isn\'t there.', 'mira=looks'),
      S('Mira en la cocina: no está.', 'He looks in the kitchen: it isn\'t there.', 'cocina=kitchen'),
      S('Mira en el baño: tampoco.', 'He looks in the bathroom: not there either.', 'tampoco=neither'),
      S('Lucía llama por teléfono.', 'Lucía phones.', 'llama=calls'),
      S('Y el móvil suena en la nevera.', 'And the phone rings in the fridge.', 'suena=rings; nevera=fridge'),
      S('—¡No me lo puedo creer!', '"I can\'t believe it!"'),
    ],
    questions: [
      Q('What time is it?', ['Seven', 'Eight', 'Ten'], 1),
      Q('Where does he look first?', ['In the kitchen', 'On the table', 'In the bathroom'], 1),
      Q('Where was the phone?', ['In the fridge', 'In the bag', 'In the car'], 0),
    ],
  },
  {
    id: 's4', level: 16, rank: 'A1', title: 'Un día en Madrid', en: 'A day in Madrid',
    lines: [
      S('Hoy {name} y Lucía visitan Madrid.', 'Today {name} and Lucía are visiting Madrid.', 'visitan=visit'),
      S('Por la mañana van al Museo del Prado.', 'In the morning they go to the Prado Museum.'),
      S('Hay mucha gente, pero el museo es precioso.', 'There are a lot of people, but the museum is beautiful.', 'gente=people; precioso=beautiful'),
      S('Después pasean por el parque del Retiro.', 'Afterwards they walk around the Retiro park.', 'pasean=they walk; parque=park'),
      S('Tienen hambre y buscan un restaurante.', 'They\'re hungry and look for a restaurant.', 'buscan=they look for; restaurante=restaurant'),
      S('Comen a las tres, como los españoles.', 'They eat at three, like the Spanish.'),
      S('—¿Quieres un helado? —pregunta Lucía.', '"Would you like an ice cream?" asks Lucía.', 'helado=ice cream; pregunta=asks'),
      S('—¡Claro!', '"Of course!"'),
      S('Por la tarde, ven el sol sobre la ciudad.', 'In the evening they watch the sun over the city.', 'sol=sun; sobre=over'),
      S('—Me encanta Madrid —dice {name}.', '"I love Madrid," says {name}.'),
    ],
    questions: [
      Q('Where do they go in the morning?', ['To a museum', 'To the beach', 'To a market'], 0),
      Q('What time do they eat?', ['At one', 'At two', 'At three'], 2),
      Q('What does Lucía offer?', ['A coffee', 'An ice cream', 'A beer'], 1),
    ],
  },
  {
    id: 's5', level: 18, rank: 'A1', title: 'La tortilla', en: 'Making a tortilla',
    lines: [
      S('Carmen enseña a {name} a hacer una tortilla.', 'Carmen is teaching {name} to make a tortilla.', 'enseña=teaches; tortilla=Spanish omelette'),
      S('Primero, cortan las patatas.', 'First, they cut the potatoes.', 'cortan=they cut; patatas=potatoes'),
      S('Después, las fríen con mucho aceite.', 'Then they fry them in a lot of oil.', 'fríen=they fry; aceite=oil'),
      S('{name} también corta una cebolla, y llora.', '{name} cuts an onion too, and cries.', 'cebolla=onion; llora=cries'),
      S('—¿Con cebolla o sin cebolla? —pregunta Carmen.', '"With onion or without onion?" asks Carmen.', 'sin=without'),
      S('—Con cebolla, claro.', '"With onion, of course."'),
      S('Mezclan las patatas con seis huevos.', 'They mix the potatoes with six eggs.', 'mezclan=they mix; huevos=eggs'),
      S('La parte difícil: darle la vuelta.', 'The hard part: turning it over.', 'difícil=difficult; darle la vuelta=to turn it over'),
      S('Pero {name} lo hace muy bien.', 'But {name} does it very well.'),
      S('—Ya eres de la familia —dice Carmen.', '"You\'re part of the family now," says Carmen.'),
    ],
    questions: [
      Q('What does Carmen teach {name}?', ['To make paella', 'To make a tortilla', 'To make bread'], 1),
      Q('Why does {name} cry?', ['The onion', 'He\'s sad', 'The tortilla is bad'], 0),
      Q('How many eggs do they use?', ['Two', 'Four', 'Six'], 2),
    ],
  },
  {
    id: 's6', level: 20, rank: 'A1', title: 'Una tarde de lluvia', en: 'A rainy evening',
    lines: [
      S('Hace frío y llueve mucho.', 'It\'s cold and it\'s raining hard.', 'llueve=it\'s raining'),
      S('{name} sale del trabajo sin paraguas.', '{name} leaves work without an umbrella.', 'paraguas=umbrella'),
      S('Corre al metro, pero no hay metro hoy.', 'He runs to the metro, but there\'s no metro today.', 'corre=runs'),
      S('Llama a Lucía.', 'He calls Lucía.'),
      S('—¿Dónde estás? ¡Estoy mojado!', '"Where are you? I\'m soaked!"', 'mojado=wet'),
      S('—Espera. Voy a buscarte en coche.', '"Wait. I\'ll come and get you by car."', 'buscarte=to pick you up'),
      S('Veinte minutos después, llega Lucía.', 'Twenty minutes later, Lucía arrives.'),
      S('En casa, hacen un chocolate caliente.', 'At home, they make a hot chocolate.', 'chocolate=chocolate'),
      S('Ven una película en el sofá.', 'They watch a film on the sofa.', 'sofá=sofa'),
      S('—Me gusta la lluvia —dice {name}.', '"I like the rain," says {name}.'),
    ],
    questions: [
      Q('What is the weather like?', ['Sunny', 'Cold and rainy', 'Snowy'], 1),
      Q('What doesn\'t {name} have?', ['An umbrella', 'His phone', 'His keys'], 0),
      Q('What do they do at home?', ['Cook paella', 'Go to sleep', 'Watch a film'], 2),
    ],
  },
  // A2. Passing the A1 exam opens all of these at once.
  {
    id: 'a2s1', level: 37, rank: 'A2', title: 'La feria', en: 'The fair in Seville',
    lines: [
      S('El año pasado fuimos a la Feria de Abril de Sevilla.', 'Last year we went to the April Fair in Seville.', 'año pasado=last year; feria=fair'),
      S('Llegamos un viernes por la noche, muy cansados.', 'We arrived on a Friday night, very tired.', 'viernes=Friday'),
      S('Las calles estaban llenas de luces y de música.', 'The streets were full of lights and music.', 'llenas=full; luces=lights'),
      S('Todas las mujeres llevaban vestidos de colores.', 'All the women were wearing colourful dresses.', 'mujeres=women; llevaban=were wearing; vestidos=dresses'),
      S('Un amigo de Lucía nos invitó a su caseta.', 'A friend of Lucía\'s invited us to his tent.', 'invitó=invited; caseta=fair tent'),
      S('Allí comimos jamón y bebimos rebujito.', 'There we ate ham and drank rebujito.', 'bebimos=we drank; rebujito=sherry with lemonade'),
      S('Yo no sabía bailar, pero una señora me enseñó.', 'I didn\'t know how to dance, but a lady taught me.', 'señora=lady'),
      S('Me sentía ridículo, y todos se reían.', 'I felt ridiculous, and everyone was laughing.', 'ridículo=ridiculous; se reían=were laughing'),
      S('Volvimos a casa a las seis de la mañana.', 'We got home at six in the morning.', 'volvimos=we came back'),
      S('Fue el mejor viaje de mi vida.', 'It was the best trip of my life.', 'vida=life'),
    ],
    questions: [
      Q('When did they arrive?', ['On a Friday night', 'On a Sunday morning', 'On a Monday'], 0),
      Q('Who taught him to dance?', ['Lucía', 'A lady', 'A friend'], 1),
      Q('What time did they get home?', ['At midnight', 'At three', 'At six in the morning'], 2),
    ],
  },
  {
    id: 'a2s2', level: 39, rank: 'A2', title: 'El tren a Granada', en: 'The train to Granada',
    lines: [
      S('Esta mañana me he despertado tarde.', 'This morning I woke up late.', 'despertarse=to wake up'),
      S('Mi tren salía a las nueve y eran las ocho y media.', 'My train was leaving at nine and it was half past eight.'),
      S('He cogido un taxi, pero había mucho tráfico.', 'I took a taxi, but there was a lot of traffic.', 'tráfico=traffic'),
      S('Cuando he llegado a la estación, el tren ya se había ido.', 'When I got to the station, the train had already left.', 'estación=station'),
      S('He ido a la taquilla y he preguntado por el siguiente.', 'I went to the ticket office and asked about the next one.', 'taquilla=ticket office; siguiente=next'),
      S('—Sale a las doce, pero tiene que pagar otro billete.', '"It leaves at twelve, but you have to pay for another ticket."'),
      S('Mientras esperaba, he conocido a una chica de Granada.', 'While I was waiting, I met a girl from Granada.', 'mientras=while; chica=girl'),
      S('Me ha dado muchas ideas para mi visita.', 'She gave me lots of ideas for my visit.', 'ideas=ideas; visita=visit'),
      S('Al final, perder el tren no ha sido tan malo.', 'In the end, missing the train wasn\'t so bad.', 'al final=in the end; perder=to miss, to lose'),
    ],
    questions: [
      Q('Why did he miss the train?', ['He woke up late and there was traffic', 'The train left early', 'He lost his ticket'], 0),
      Q('When does the next train leave?', ['At nine', 'At twelve', 'At three'], 1),
      Q('Who did he meet at the station?', ['A friend from Madrid', 'A taxi driver', 'A girl from Granada'], 2),
    ],
  },
];

export const storyById = (id) => STORIES.find((s) => s.id === id);
