// Themes: ten words at a time around one topic. Hear them from English, then say them in a mini test.
// One right answer out loud and a word goes to your vocab. Finish a theme to open the next one.
// Each word: "spanish=english" with an optional "| note". Nouns come with el or la, because
// their gender often differs from Italian.

const T = (id, title, tr, rank, words) => ({
  id, title, tr, rank,
  words: words.map((w) => {
    const [pair, note = ''] = w.split('|').map((s) => s.trim());
    const i = pair.indexOf('=');
    return { tr: pair.slice(0, i).trim(), en: pair.slice(i + 1).trim(), note };
  }),
});

export const NEED = 1;

export const THEMES = [
  T('greetings', 'Greetings', 'Saludos', 'A1', [
    'hola=hello', 'buenos días=good morning', 'buenas tardes=good afternoon', 'buenas noches=good night', 'bienvenido=welcome',
    'hasta luego=see you later', 'adiós=goodbye', 'gracias=thank you', 'por favor=please', 'perdón=sorry, excuse me',
  ]),
  T('family', 'Family', 'La familia', 'A1', [
    'la madre=mother', 'el padre=father', 'los padres=parents', 'el hermano=brother', 'la hermana=sister',
    'el hijo=son', 'la hija=daughter', 'la abuela=grandmother', 'el abuelo=grandfather', 'el tío=uncle',
  ]),
  T('food', 'Food and drink', 'Comida y bebida', 'A1', [
    'el pan=bread', 'el agua=water | Feminine, but el before a stressed a: el agua fría.', 'el café=coffee', 'la leche=milk | Feminine, unlike "il latte".', 'el queso=cheese',
    'la carne=meat', 'el pollo=chicken', 'el pescado=fish (to eat) | Alive, it\'s pez.', 'la verdura=vegetables', 'la fruta=fruit',
  ]),
  T('home', 'Home', 'La casa', 'A1', [
    'la casa=house', 'la habitación=room', 'la cocina=kitchen', 'el baño=bathroom', 'la cama=bed',
    'la mesa=table', 'la silla=chair', 'la puerta=door', 'la ventana=window', 'la llave=key',
  ]),
  T('love', 'Love', 'El amor', 'A1', [
    'el amor=love', 'el novio=boyfriend', 'la novia=girlfriend', 'querer=to love, to want', 'el beso=kiss',
    'el abrazo=hug', 'el corazón=heart', 'echar de menos=to miss', 'guapo=good-looking', 'juntos=together',
  ]),
  T('time', 'Time', 'El tiempo', 'A1', [
    'hoy=today', 'mañana=tomorrow', 'ayer=yesterday', 'ahora=now', 'luego=later',
    'la mañana=morning', 'la tarde=afternoon', 'la noche=night', 'la semana=week', 'la hora=hour',
  ]),
  T('weather', 'Weather', 'El clima', 'A1', [
    'el tiempo=weather', 'el sol=sun', 'la lluvia=rain', 'la nieve=snow', 'el viento=wind',
    'el calor=heat', 'el frío=cold', 'la nube=cloud', 'el verano=summer', 'el invierno=winter',
  ]),
  T('city', 'City', 'La ciudad', 'A1', [
    'la ciudad=city', 'la calle=street', 'el autobús=bus', 'el taxi=taxi', 'la estación=station',
    'el aeropuerto=airport', 'el hotel=hotel', 'el supermercado=supermarket', 'la farmacia=pharmacy', 'el hospital=hospital',
  ]),
  T('shopping', 'Shopping', 'De compras', 'A1', [
    'el dinero=money', 'el precio=price', 'barato=cheap', 'caro=expensive', 'el descuento=discount',
    'la tarjeta=card', 'en efectivo=in cash', 'el recibo=receipt', 'el bolso=handbag | "Borsa" is the stock exchange: la bolsa is a shopping bag.', 'comprar=to buy',
  ]),
  T('feelings', 'Feelings', 'Los sentimientos', 'A1', [
    'contento=happy', 'triste=sad', 'cansado=tired', 'enfadado=angry', 'nervioso=nervous',
    'asustado=scared', 'enfermo=ill', 'preocupado=worried', 'tranquilo=calm', 'aburrido=bored',
  ]),
  T('body', 'Body and health', 'El cuerpo y la salud', 'A1', [
    'la cabeza=head', 'el ojo=eye', 'la boca=mouth', 'la mano=hand | Ends in -o but feminine, as in Italian.', 'el pie=foot',
    'el brazo=arm', 'la pierna=leg', 'el diente=tooth', 'la barriga=belly', 'el dolor=pain',
  ]),
  T('sports', 'Sports and free time', 'Deporte y tiempo libre', 'A1', [
    'el deporte=sport', 'el fútbol=football', 'el partido=match', 'nadar=to swim', 'correr=to run',
    'el paseo=walk', 'el juego=game', 'la música=music', 'la película=film', 'el libro=book',
  ]),
  T('clothes', 'Clothes and colours', 'Ropa y colores', 'A1', [
    'rojo=red', 'azul=blue', 'verde=green', 'amarillo=yellow', 'negro=black',
    'blanco=white', 'la camisa=shirt', 'los pantalones=trousers', 'el vestido=dress', 'los zapatos=shoes',
  ]),
  T('work', 'Work and study', 'Trabajo y estudios', 'A1', [
    'el trabajo=work, job', 'la oficina=office', 'el jefe=boss', 'la reunión=meeting', 'el colegio=school',
    'el profesor=teacher', 'el estudiante=student', 'la clase=lesson', 'el examen=exam', 'el ordenador=computer | Spain\'s word: Latin America says computadora.',
  ]),
  T('nature', 'Nature and animals', 'Naturaleza y animales', 'A1', [
    'el gato=cat', 'el perro=dog', 'el pájaro=bird', 'el árbol=tree | Masculine, like "albero".', 'la flor=flower | Feminine, unlike "il fiore".',
    'el mar=sea', 'la montaña=mountain', 'el lago=lake', 'el bosque=forest', 'la playa=beach',
  ]),
  // A2 themes open with rank D.
  T('travel', 'Travel', 'Los viajes', 'A2', [
    'el viaje=trip', 'la maleta=suitcase', 'el billete=ticket', 'el vuelo=flight', 'la reserva=booking',
    'el equipaje=luggage', 'el pasaporte=passport', 'el andén=platform', 'la salida=departure, exit', 'la llegada=arrival',
  ]),
  T('health', 'Health', 'La salud', 'A2', [
    'el médico=doctor', 'la receta=prescription, recipe', 'la pastilla=pill', 'la fiebre=fever', 'la tos=cough',
    'el resfriado=a cold', 'la gripe=flu', 'la garganta=throat', 'la espalda=back | "Spalla" is el hombro.', 'el estómago=stomach',
  ]),
  T('housework', 'Home in detail', 'En casa', 'A2', [
    'el piso=flat', 'el salón=living room', 'el dormitorio=bedroom', 'la nevera=fridge', 'la lavadora=washing machine',
    'el armario=wardrobe', 'la calefacción=heating', 'el alquiler=rent', 'el vecino=neighbour', 'barrer=to sweep',
  ]),
  T('opinions', 'Opinions', 'Opiniones', 'A2', [
    'creer=to believe', 'pensar=to think', 'parecer=to seem', 'estar de acuerdo=to agree', 'la razón=reason',
    'la verdad=truth', 'la mentira=lie', 'justo=fair', 'seguro=sure, safe', 'quizás=perhaps',
  ]),
];

export const themeById = (id) => THEMES.find((t) => t.id === id);
export const wordKey = (theme, w) => `${theme.id}:${w.tr}`;
