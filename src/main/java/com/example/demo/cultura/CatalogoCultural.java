package com.example.demo.cultura;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

import org.springframework.stereotype.Component;

@Component
public class CatalogoCultural {

	private final List<Tarjeta> tarjetas = Collections.unmodifiableList(construir());

	public List<Tarjeta> todas() {
		return tarjetas;
	}

	public List<Tarjeta> porCategoria(String categoria) {
		if (categoria == null || categoria.trim().isEmpty() || "Todo".equalsIgnoreCase(categoria)) {
			return tarjetas;
		}
		List<Tarjeta> filtradas = new ArrayList<Tarjeta>();
		for (Tarjeta tarjeta : tarjetas) {
			if (tarjeta.getCategoria().equalsIgnoreCase(categoria)) {
				filtradas.add(tarjeta);
			}
		}
		return filtradas;
	}

	public Tarjeta porId(String id) {
		for (Tarjeta tarjeta : tarjetas) {
			if (tarjeta.getId().equals(id)) {
				return tarjeta;
			}
		}
		return null;
	}

	public List<String> categorias() {
		Set<String> nombres = new LinkedHashSet<String>();
		for (Tarjeta tarjeta : tarjetas) {
			nombres.add(tarjeta.getCategoria());
		}
		return new ArrayList<String>(nombres);
	}

	private static List<Tarjeta> construir() {
		List<Tarjeta> lista = new ArrayList<Tarjeta>();

		lista.add(new Tarjeta("arte-gioconda", "Arte", "🖼️",
				"La Gioconda se hizo famosa porque la robaron",
				"Antes de 1911, la Mona Lisa era un cuadro más del Louvre. Un empleado italiano se la llevó bajo el abrigo y el mundo entero se enteró de que existía.",
				"Vincenzo Peruggia, que había trabajado en el museo, sacó la tabla el 21 de agosto de 1911 y la guardó dos años en su habitación de París. Los periódicos publicaron la imagen durante semanas y la gente hacía cola para ver el hueco vacío en la pared. Cuando intentó venderla en Florencia en 1913 lo detuvieron, y el cuadro volvió al Louvre convertido en la obra más célebre del planeta.",
				"París, Francia", "1911", "Museo del Louvre",
				Arrays.asList("Leonardo", "robo", "siglo XX"), "#7b2ff7", "#f107a3",
				new Quiz("¿Qué disparó la fama mundial de la Mona Lisa?",
						Arrays.asList("Una exposición en Nueva York", "Su robo en 1911", "Un elogio de Napoleón"), 1,
						"El robo de Peruggia llenó portadas durante dos años y convirtió el cuadro en icono global.")));

		lista.add(new Tarjeta("historia-cleopatra", "Historia", "👑",
				"Cleopatra vivió más cerca del alunizaje que de las pirámides",
				"La Gran Pirámide se terminó hacia el 2560 a.C. Cleopatra murió en el 30 a.C. El Apolo 11 alunizó en 1969.",
				"Entre la Gran Pirámide de Guiza y Cleopatra hay unos 2.500 años. Entre Cleopatra y el primer paso en la Luna, unos 2.000. Egipto no fue una civilización congelada: cuando ella reinaba, las pirámides ya eran antigüedades para los propios egipcios, tan lejanas como para nosotros lo es el imperio romano.",
				"Alejandría, Egipto", "siglo I a.C.", "Cronología del Antiguo Egipto",
				Arrays.asList("Egipto", "cronología", "pirámides"), "#f7971e", "#c0392b",
				new Quiz("¿Qué está más cerca en el tiempo de Cleopatra?",
						Arrays.asList("La Gran Pirámide de Guiza", "El alunizaje del Apolo 11", "Están a la misma distancia"), 1,
						"Unos 2.000 años hasta 1969 frente a unos 2.500 hasta la Gran Pirámide.")));

		lista.add(new Tarjeta("musica-bolero", "Música", "🎻",
				"El Bolero de Ravel es la misma melodía 18 veces",
				"Un solo tema, un solo ritmo de caja repetido sin parar durante 15 minutos. Lo único que cambia son los instrumentos y el volumen.",
				"Ravel lo compuso en 1928 como encargo para un ballet y lo describió como «orquestación sin música». El redoble de la caja no se detiene ni una vez; el crescendo se construye solo sumando timbres, hasta el giro armónico final. Su autor pensaba que era un experimento menor: se convirtió en su obra más tocada.",
				"París, Francia", "1928", "Maurice Ravel, Boléro",
				Arrays.asList("clásica", "orquesta", "ritmo"), "#00b4db", "#0083b0",
				new Quiz("¿Qué mantiene unido todo el Bolero?",
						Arrays.asList("Un cambio de tonalidad constante", "Un ostinato de caja que nunca para", "Un coro repitiendo el tema"), 1,
						"El redoble de la caja no se interrumpe en toda la pieza.")));

		lista.add(new Tarjeta("arte-marmol", "Arte", "🏛️",
				"Las estatuas griegas eran de colores chillones",
				"El mármol blanco que asociamos a Grecia y Roma es una ilusión: el pigmento se perdió con los siglos.",
				"Los análisis con luz ultravioleta y rayos X revelan restos de rojo, azul egipcio, ocre y dorado en templos y esculturas. El Partenón era una explosión de color. La idea del blanco puro se consolidó en el Renacimiento y sobre todo en el siglo XVIII, cuando Winckelmann convirtió esa blancura accidental en ideal estético.",
				"Atenas, Grecia", "siglo V a.C.", "Estudios de policromía antigua",
				Arrays.asList("escultura", "policromía", "Partenón"), "#11998e", "#38ef7d",
				new Quiz("¿Por qué vemos blancas las esculturas antiguas?",
						Arrays.asList("Se pintaban de blanco a propósito", "El pigmento se degradó con el tiempo", "El mármol blanco era el más barato"), 1,
						"Estaban pintadas; el color desapareció por la intemperie y las limpiezas posteriores.")));

		lista.add(new Tarjeta("gastro-cacao", "Gastronomía", "🍫",
				"El chocolate fue moneda antes que postre",
				"En Mesoamérica las semillas de cacao servían para pagar. Y la bebida era amarga, espumosa y con chile.",
				"Los mexicas usaban granos de cacao como unidad de cambio en los mercados: con unos pocos comprabas fruta, con más un guajolote. La bebida ritual, el xocolatl, se batía hasta levantar espuma y se aromatizaba con chile, vainilla o achiote. El azúcar llegó con los europeos, y con él la versión dulce que hoy damos por evidente.",
				"Mesoamérica", "siglos XIV-XVI", "Códices mexicas y crónicas coloniales",
				Arrays.asList("cacao", "mexicas", "comercio"), "#603813", "#b29f94",
				new Quiz("¿Cómo tomaban el cacao los mexicas?",
						Arrays.asList("Dulce y con leche", "Amargo, espumoso y especiado", "Caliente con azúcar de caña"), 1,
						"El xocolatl era amargo y se batía para hacer espuma; el azúcar llegó después.")));

		lista.add(new Tarjeta("mito-anansi", "Mitología", "🕷️",
				"Anansi, la araña que cruzó el Atlántico",
				"Nació en los relatos akan de Ghana y sobrevivió a la trata transatlántica dentro de la memoria de quienes fueron esclavizados.",
				"Anansi es el tramposo que gana por ingenio, no por fuerza: engaña al leopardo, negocia con el dios del cielo y se queda con todas las historias del mundo. Cruzó con la diáspora africana y reapareció en el Caribe como Anancy y en el sur de Estados Unidos como Aunt Nancy. Es uno de los ejemplos más claros de cómo un relato oral resiste a la deportación forzada.",
				"Ghana y el Caribe", "tradición oral", "Tradición oral akan",
				Arrays.asList("África", "diáspora", "tricksters"), "#4b6cb7", "#182848",
				new Quiz("¿Qué tipo de personaje es Anansi?",
						Arrays.asList("Un héroe guerrero", "Un trickster que vence con astucia", "Un dios creador del mundo"), 1,
						"Es un trickster: gana por ingenio y palabra, no por fuerza.")));

		lista.add(new Tarjeta("arqui-sagrada", "Arquitectura", "⛪",
				"Llevan más de 140 años construyendo la Sagrada Família",
				"Se puso la primera piedra en 1882. Sigue en obras, financiada solo con donaciones y entradas.",
				"Gaudí tomó el proyecto en 1883 y le dedicó 43 años; al morir en 1926 apenas estaba terminada una fachada. Diseñó columnas ramificadas como árboles y calculó las catenarias con maquetas de cuerdas y saquitos de arena colgados boca abajo. Los planos originales ardieron en 1936 y el trabajo posterior se ha reconstruido a partir de fotografías, maquetas rotas y modelos digitales.",
				"Barcelona, España", "desde 1882", "Basílica de la Sagrada Família",
				Arrays.asList("Gaudí", "modernismo", "obra inacabada"), "#f46b45", "#eea849",
				new Quiz("¿Cómo calculaba Gaudí las formas de las columnas y arcos?",
						Arrays.asList("Con maquetas colgantes de cuerdas y pesos", "Con las primeras calculadoras eléctricas", "Copiando catedrales góticas francesas"), 0,
						"Sus maquetas funiculares colgaban boca abajo: al invertirlas daban la forma estructural óptima.")));

		lista.add(new Tarjeta("trad-hanami", "Tradiciones", "🌸",
				"Japón lleva mil años haciendo picnic bajo los cerezos",
				"El hanami no es mirar flores: es sentarse debajo a comer y beber con gente, sabiendo que en una semana no quedará ninguna.",
				"La costumbre se documenta ya en la corte del periodo Heian (794-1185), primero con flores de ciruelo y después con las de cerezo. Su atractivo está en la fugacidad: el sakura dura unos días y luego cae entero. Esa belleza breve tiene nombre propio en la estética japonesa, mono no aware, la emoción melancólica ante lo que pasa.",
				"Japón", "desde el periodo Heian", "Tradición japonesa del hanami",
				Arrays.asList("Japón", "sakura", "estética"), "#ff9a9e", "#fad0c4",
				new Quiz("¿Qué idea estética resume el hanami?",
						Arrays.asList("La perfección eterna", "La emoción ante lo efímero", "La abundancia de la cosecha"), 1,
						"Mono no aware: la belleza es intensa justamente porque dura poco.")));

		lista.add(new Tarjeta("lengua-euskera", "Lenguas", "🗣️",
				"El euskera no tiene parientes conocidos",
				"Rodeado de lenguas romances, el euskera es una lengua aislada: no desciende del latín ni del indoeuropeo.",
				"Lleva en el mismo territorio desde antes de la llegada de Roma y sobrevivió a la latinización de toda la península. Ningún intento serio de emparentarlo con el íbero, el bereber o las lenguas caucásicas ha convencido a la lingüística comparada. Hoy tiene un estándar común, el euskara batua, fijado desde 1968 para unificar los dialectos.",
				"País Vasco y Navarra", "origen prerromano", "Lingüística histórica",
				Arrays.asList("euskera", "lengua aislada", "Europa"), "#134e5e", "#71b280",
				new Quiz("¿Qué significa que el euskera sea una lengua aislada?",
						Arrays.asList("Que se habla en zonas de montaña", "Que no se le conoce parentesco con ninguna otra lengua viva", "Que tiene muy pocos hablantes"), 1,
						"Aislada, en lingüística, significa sin familia conocida.")));

		lista.add(new Tarjeta("historia-qarawiyyin", "Historia", "📚",
				"La universidad más antigua en activo la fundó una mujer",
				"Fátima al-Fihri fundó al-Qarawiyyin en Fez en el año 859. Sigue funcionando.",
				"Levantada con la herencia de su padre, empezó como mezquita con escuela y creció hasta ser un centro de derecho, gramática, astronomía y medicina. Por sus aulas pasaron figuras como Ibn Jaldún. El Guinness y la Unesco la reconocen como la institución de enseñanza superior más antigua del mundo que sigue en funcionamiento continuo.",
				"Fez, Marruecos", "859", "Universidad de al-Qarawiyyin",
				Arrays.asList("al-Ándalus", "educación", "mundo islámico"), "#8e2de2", "#4a00e0",
				new Quiz("¿Quién fundó al-Qarawiyyin?",
						Arrays.asList("Ibn Jaldún", "Fátima al-Fihri", "Averroes"), 1,
						"Fátima al-Fihri la fundó en 859 con la herencia de su padre.")));

		lista.add(new Tarjeta("musica-tango", "Música", "💃",
				"El tango nació en los márgenes y acabó en la Unesco",
				"Salió de los conventillos del Río de la Plata, con inmigrantes, y en 2009 fue declarado Patrimonio Cultural Inmaterial de la Humanidad.",
				"Buenos Aires y Montevideo se llenaron a finales del siglo XIX de gente llegada de Italia, España y África, y de ese cruce salieron la milonga, el candombe y la habanera convertidos en tango. Durante décadas fue música de arrabal, mal vista por las clases altas, hasta que triunfó en el París de 1910 y volvió legitimado. El bandoneón, el instrumento que lo define, era alemán y estaba pensado para tocar música religiosa.",
				"Buenos Aires y Montevideo", "desde 1880", "Unesco, Patrimonio Inmaterial 2009",
				Arrays.asList("tango", "Río de la Plata", "Unesco"), "#c31432", "#240b36",
				new Quiz("¿De dónde procede el bandoneón?",
						Arrays.asList("De Alemania", "De Argentina", "De Andalucía"), 0,
						"Se fabricó en Alemania, en origen como sustituto portátil del órgano.")));

		lista.add(new Tarjeta("gastro-capsaicina", "Gastronomía", "🌶️",
				"El picante es un mensaje evolutivo dirigido a los mamíferos",
				"La capsaicina del chile molesta a los mamíferos, pero las aves no la notan.",
				"Los mamíferos trituran las semillas con los molares y las destruyen; las aves se las tragan enteras y las dispersan lejos. La capsaicina activa el receptor TRPV1, el mismo que detecta el calor, así que el cerebro interpreta el picante como quemadura. Los humanos somos la excepción: convertimos la advertencia en placer y domesticamos el chile hace unos 6.000 años en Mesoamérica.",
				"Mesoamérica", "domesticación hace ~6.000 años", "Botánica y etnobotánica del chile",
				Arrays.asList("chile", "evolución", "cocina"), "#e52d27", "#b31217",
				new Quiz("¿Por qué las aves comen chiles sin inmutarse?",
						Arrays.asList("Comen solo los chiles verdes", "Su receptor no responde a la capsaicina", "Tienen la lengua cubierta de queratina"), 1,
						"El receptor TRPV1 de las aves no reacciona a la capsaicina, y ellas dispersan las semillas intactas.")));

		lista.add(new Tarjeta("trad-diamuertos", "Tradiciones", "💀",
				"El Día de Muertos no es una fiesta triste",
				"En México se pone la mesa para los que ya no están: su comida favorita, su foto y flores de cempasúchil marcando el camino.",
				"La celebración mezcla el calendario ritual mesoamericano con la fiesta católica de Todos los Santos. El altar se levanta por niveles, con agua para la sed del viaje, sal, velas, papel picado y pan de muerto. La Unesco lo inscribió en 2008 en la lista de Patrimonio Cultural Inmaterial. La Catrina, hoy su imagen más reconocible, la dibujó José Guadalupe Posada como sátira de quienes renegaban de lo indígena.",
				"México", "1 y 2 de noviembre", "Unesco, Patrimonio Inmaterial 2008",
				Arrays.asList("México", "ofrenda", "Unesco"), "#ff512f", "#dd2476",
				new Quiz("¿Qué era originalmente La Catrina?",
						Arrays.asList("Una sátira social de Posada", "Una diosa mexica de la muerte", "Un personaje de Diego Rivera"), 0,
						"Posada la creó como crítica a quienes imitaban lo europeo y despreciaban sus raíces.")));

		lista.add(new Tarjeta("lit-gilgamesh", "Literatura", "📜",
				"La literatura empieza con un rey que no acepta la muerte",
				"La epopeya de Gilgamesh se escribió en tablillas de arcilla hace unos 4.000 años, en Mesopotamia.",
				"Cuenta la amistad entre el rey de Uruk y Enkidu, el hombre salvaje, y la búsqueda desesperada de la inmortalidad tras la muerte de su amigo. Incluye un relato del diluvio muy anterior al bíblico. El texto se perdió durante milenios y reapareció en el siglo XIX entre las tablillas de la biblioteca de Asurbanipal, en Nínive: seguimos sin tener todas las líneas.",
				"Mesopotamia", "~2100-1200 a.C.", "Tablillas acadias de Nínive",
				Arrays.asList("Mesopotamia", "épica", "escritura"), "#c79081", "#dfa579",
				new Quiz("¿En qué soporte se conservó Gilgamesh?",
						Arrays.asList("Papiro", "Tablillas de arcilla con escritura cuneiforme", "Pergamino medieval"), 1,
						"En arcilla cocida: por eso sobrevivió al incendio de la biblioteca.")));

		lista.add(new Tarjeta("arte-hokusai", "Arte", "🌊",
				"La gran ola era arte barato y en serie",
				"La estampa de Hokusai no es un cuadro único: es una xilografía tirada en miles de copias que costaba lo que un cuenco de fideos.",
				"Pertenece a la serie Treinta y seis vistas del monte Fuji (hacia 1831). El ukiyo-e era arte popular, impreso con planchas de madera y vendido en la calle. Las estampas llegaron a Europa a veces como papel de embalar y sacudieron a Monet, Degas y Van Gogh: de ahí el japonismo. El azul intenso de la ola es azul de Prusia, un pigmento importado y entonces novedoso en Japón.",
				"Japón", "hacia 1831", "Katsushika Hokusai, ukiyo-e",
				Arrays.asList("ukiyo-e", "grabado", "japonismo"), "#2193b0", "#6dd5ed",
				new Quiz("¿Qué técnica usó Hokusai para La gran ola?",
						Arrays.asList("Óleo sobre lienzo", "Xilografía con planchas de madera", "Acuarela sobre seda"), 1,
						"Es una estampa ukiyo-e impresa con planchas de madera, una por color.")));

		lista.add(new Tarjeta("historia-alejandria", "Historia", "🔥",
				"La Biblioteca de Alejandría no ardió en una noche",
				"No hubo un único incendio que borrara el saber antiguo: hubo siglos de recortes, guerras y abandono.",
				"El fuego de César en el 48 a.C. quemó almacenes del puerto, pero la institución siguió funcionando. Lo que la mató fue más aburrido y más eficaz: expulsiones de eruditos, pérdida de financiación real, saqueos y el traslado del centro intelectual a otras ciudades. El mito del incendio único es cómodo porque da un culpable; la realidad es que las bibliotecas mueren cuando alguien deja de pagarlas.",
				"Alejandría, Egipto", "siglos III a.C. - IV d.C.", "Historiografía sobre el Museion",
				Arrays.asList("Antigüedad", "bibliotecas", "mitos"), "#654ea3", "#eaafc8",
				new Quiz("¿Qué acabó realmente con la Biblioteca de Alejandría?",
						Arrays.asList("Un incendio único y total", "Un declive largo por falta de apoyo y sucesivos daños", "Un terremoto en el siglo I"), 1,
						"Fue un deterioro progresivo de siglos, no una sola catástrofe.")));

		lista.add(new Tarjeta("ciencia-cero", "Ciencia y cultura", "0️⃣",
				"Europa tardó siglos en aceptar el cero",
				"El cero como número llegó de la India, pasó por el mundo islámico y en Europa se recibió con desconfianza.",
				"Brahmagupta ya operaba con él en el siglo VII. Al-Juarismi difundió el sistema decimal posicional, y Fibonacci lo presentó en Europa con el Liber Abaci (1202). Varias ciudades italianas llegaron a prohibir las cifras arábigas en la contabilidad porque un cero era fácil de falsificar y los números romanos parecían más seguros. Ganaron los mercaderes: sin cero no hay álgebra ni contabilidad moderna.",
				"India, mundo islámico y Europa", "siglos VII-XIII", "Historia de las matemáticas",
				Arrays.asList("matemáticas", "India", "transmisión del saber"), "#000428", "#004e92",
				new Quiz("¿Quién introdujo el sistema decimal posicional en Europa?",
						Arrays.asList("Fibonacci con el Liber Abaci", "Euclides", "Copérnico"), 0,
						"Fibonacci lo aprendió de comerciantes del norte de África y lo publicó en 1202.")));

		lista.add(new Tarjeta("musica-blues", "Música", "🎸",
				"Casi toda la música pop viene del Delta del Misisipi",
				"Blues, jazz, rock, soul, funk, hip hop: todo arranca de la música que crearon los afroamericanos en el sur de Estados Unidos.",
				"El blues fija un esquema de doce compases y unas notas «dobladas» que no existen en el sistema europeo, las blue notes. La Gran Migración lo llevó a Chicago, donde se electrificó; de ahí salieron el rhythm and blues y el rock and roll. Esa herencia se construyó en condiciones de segregación y con frecuencia sin que sus creadores cobraran por ella.",
				"Delta del Misisipi, EE. UU.", "desde 1900", "Historia del blues",
				Arrays.asList("blues", "afroamericano", "siglo XX"), "#232526", "#414345",
				new Quiz("¿Qué son las blue notes?",
						Arrays.asList("Notas tocadas más fuerte", "Notas alteradas fuera de la afinación europea estándar", "Notas escritas en azul en la partitura"), 1,
						"Se «doblan» ligeramente respecto a la escala temperada y dan al blues su color característico.")));

		lista.add(new Tarjeta("arqui-machu", "Arquitectura", "⛰️",
				"Machu Picchu está construido sin una gota de mortero",
				"Los incas encajaron bloques de granito con tal precisión que no cabe una hoja de papel entre ellos.",
				"La técnica se llama sillería y no es solo estética: los muros ligeramente inclinados hacia dentro y las piedras sin argamasa permiten que el conjunto vibre y se reacomode durante un terremoto sin derrumbarse. La zona es sísmica y las estructuras llevan más de cinco siglos en pie. El sitio nunca fue «descubierto»: los campesinos locales lo conocían cuando Hiram Bingham llegó en 1911.",
				"Cusco, Perú", "siglo XV", "Arquitectura inca",
				Arrays.asList("incas", "Perú", "ingeniería"), "#00c6ff", "#0072ff",
				new Quiz("¿Por qué la sillería inca resiste tan bien los sismos?",
						Arrays.asList("Las piedras están pegadas con un cemento secreto", "Los bloques encajados y sin mortero se reacomodan al vibrar", "Los muros son mucho más gruesos de lo normal"), 1,
						"Sin argamasa, los bloques absorben el movimiento y vuelven a asentarse.")));

		lista.add(new Tarjeta("trad-holi", "Tradiciones", "🎨",
				"En Holi el color borra las jerarquías durante un día",
				"El festival indio de la primavera se celebra lanzando polvos de colores a todo el que pase, sin importar quién sea.",
				"Holi cierra el invierno y celebra la victoria del bien sobre el mal según el mito de Holika y Prahlada; la víspera se encienden hogueras. Al día siguiente, cubiertos de gulal, las distinciones de casta, edad y género se relajan de forma ritual: es una inversión temporal del orden social. Los polvos tradicionales se hacían con flores, cúrcuma y sándalo.",
				"India y Nepal", "luna llena de Phalguna", "Tradición hindú",
				Arrays.asList("India", "primavera", "festival"), "#ff6a00", "#ee0979",
				new Quiz("¿Qué función social cumple Holi?",
						Arrays.asList("Reforzar el orden jerárquico", "Suspender de forma ritual las jerarquías durante la fiesta", "Marcar el inicio del año fiscal"), 1,
						"Es una inversión ritual del orden: por un día todos se manchan por igual.")));

		lista.add(new Tarjeta("cine-bollywood", "Cine", "🎬",
				"India rueda más películas al año que Hollywood",
				"Y no es solo Bollywood: el cine indio se hace en hindi, tamil, telugu, malayalam, bengalí y una docena más de lenguas.",
				"La industria india produce habitualmente más de mil largometrajes anuales, muy por encima de la estadounidense en número de títulos. «Bollywood» designa solo la producción en hindi de Bombay; el cine tamil y el telugu tienen sus propias estrellas, estudios y públicos masivos. Nigeria, con Nollywood, es otro gigante que rara vez aparece en las listas occidentales.",
				"India", "actualidad", "Estadísticas de producción cinematográfica",
				Arrays.asList("cine", "India", "industria"), "#f7b733", "#fc4a1a",
				new Quiz("¿Qué designa exactamente «Bollywood»?",
						Arrays.asList("Todo el cine indio", "El cine en hindi producido en Bombay", "El cine tamil de Chennai"), 1,
						"Es solo la producción en hindi; el cine indio abarca muchas más industrias lingüísticas.")));

		lista.add(new Tarjeta("lengua-alfabeto", "Lenguas", "🔤",
				"Estas letras vienen de dibujos fenicios",
				"La A era la cabeza de un buey. Gírala 180 grados y verás los cuernos.",
				"Los fenicios crearon hacia el 1050 a.C. un sistema de unas 22 signos consonánticos derivados de pictogramas: alef (buey), bet (casa), mem (agua). Los griegos lo tomaron y reutilizaron algunos signos sobrantes para escribir vocales, algo nuevo. De ahí pasó a los etruscos y de estos a los romanos: el alfabeto latino que estás leyendo ahora mismo.",
				"Levante mediterráneo", "desde ~1050 a.C.", "Historia de la escritura",
				Arrays.asList("escritura", "fenicios", "alfabeto"), "#1f4037", "#99f2c8",
				new Quiz("¿Qué aportaron los griegos al alfabeto fenicio?",
						Arrays.asList("Las letras mayúsculas", "Los signos para las vocales", "La escritura de izquierda a derecha únicamente"), 1,
						"Reutilizaron consonantes que no necesitaban para representar vocales.")));

		lista.add(new Tarjeta("arte-frida", "Arte", "🌺",
				"Frida Kahlo se pintó a sí misma 55 veces",
				"«Me pinto a mí misma porque paso mucho tiempo sola y porque soy el motivo que mejor conozco.»",
				"De las alrededor de 143 obras que se le atribuyen, unas 55 son autorretratos. Empezó a pintar convaleciente tras el accidente de autobús que le destrozó la columna a los 18 años, con un espejo colocado sobre la cama. Rechazó la etiqueta surrealista que le puso Breton: decía que no pintaba sueños, sino su propia realidad.",
				"Coyoacán, México", "1907-1954", "Obra de Frida Kahlo",
				Arrays.asList("México", "autorretrato", "siglo XX"), "#f953c6", "#b91d73",
				new Quiz("¿Por qué rechazaba Frida Kahlo la etiqueta surrealista?",
						Arrays.asList("Porque no conocía el movimiento", "Porque decía pintar su realidad, no sueños", "Porque prefería el muralismo"), 1,
						"Afirmaba: «Nunca pinté sueños, pinté mi propia realidad».")));

		lista.add(new Tarjeta("lit-quijote", "Literatura", "📖",
				"El Quijote empieza como una broma y acaba inventando la novela",
				"Cervantes quería reírse de los libros de caballerías. Le salió el primer personaje de la literatura que cambia por lo que le pasa.",
				"La primera parte es de 1605 y la segunda de 1615. En esa segunda parte los personajes saben que existe un libro sobre ellos y discuten con quienes lo han leído, un juego metaliterario extraordinario para la época. Es de las obras más traducidas de la historia y Cervantes murió sin ver un céntimo de su éxito europeo.",
				"España", "1605 y 1615", "Miguel de Cervantes, Don Quijote",
				Arrays.asList("Cervantes", "Siglo de Oro", "novela"), "#3a1c71", "#d76d77",
				new Quiz("¿Qué hace tan moderna la segunda parte del Quijote?",
						Arrays.asList("Los personajes saben que se ha escrito un libro sobre ellos", "Está escrita en verso", "Transcurre fuera de España"), 0,
						"Ese juego metaliterario es rarísimo en 1615 y define buena parte de la novela posterior.")));

		return lista;
	}
}
