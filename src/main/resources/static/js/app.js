(function () {
	'use strict';

	var CLAVE = 'culturatok.estado.v1';
	var TODO = 'Todo';
	var GUARDADOS = '🔖 Guardados';

	var feed = document.getElementById('feed');
	var barraCategorias = document.getElementById('categorias');
	var pista = document.getElementById('pista');
	var vacio = document.getElementById('vacio');
	var elRacha = document.getElementById('racha');
	var elAciertos = document.getElementById('aciertos');

	var estado = cargarEstado();
	var catalogo = [];
	var categoriaActiva = TODO;

	function cargarEstado() {
		var base = { likes: [], guardados: [], respondidas: {}, aciertos: 0, total: 0, racha: 0, mejorRacha: 0 };
		try {
			var guardado = JSON.parse(localStorage.getItem(CLAVE));
			if (guardado) {
				for (var clave in base) {
					if (guardado[clave] !== undefined) {
						base[clave] = guardado[clave];
					}
				}
			}
		} catch (e) {
			/* almacenamiento no disponible o corrupto: se empieza de cero */
		}
		return base;
	}

	function guardarEstado() {
		try {
			localStorage.setItem(CLAVE, JSON.stringify(estado));
		} catch (e) {
			/* modo privado: la sesión funciona igual, solo no persiste */
		}
	}

	function alternar(lista, id) {
		var i = lista.indexOf(id);
		if (i === -1) {
			lista.push(id);
			return true;
		}
		lista.splice(i, 1);
		return false;
	}

	function pintarMarcador() {
		elRacha.textContent = '🔥 ' + estado.racha;
		elAciertos.textContent = estado.aciertos + '/' + estado.total;
	}

	function brindis(texto) {
		var nodo = document.createElement('div');
		nodo.className = 'brindis';
		nodo.textContent = texto;
		document.body.appendChild(nodo);
		requestAnimationFrame(function () {
			nodo.classList.add('visible');
		});
		setTimeout(function () {
			nodo.classList.remove('visible');
			setTimeout(function () {
				nodo.remove();
			}, 300);
		}, 1900);
	}

	/* ---------- render ---------- */

	function crearAccion(icono, etiqueta, activa) {
		var boton = document.createElement('button');
		boton.className = 'accion' + (activa ? ' activa' : '');
		boton.innerHTML = '<span class="icono">' + icono + '</span><span class="texto">' + etiqueta + '</span>';
		return boton;
	}

	function crearTarjeta(datos) {
		var seccion = document.createElement('section');
		seccion.className = 'tarjeta' + (datos.quiz ? ' con-quiz' : '');
		seccion.dataset.id = datos.id;
		seccion.style.background = 'linear-gradient(155deg, ' + datos.colorInicio + ', ' + datos.colorFin + ')';

		var fondo = document.createElement('div');
		fondo.className = 'emoji-fondo';
		fondo.textContent = datos.emoji;
		fondo.setAttribute('aria-hidden', 'true');
		seccion.appendChild(fondo);

		var contenido = document.createElement('div');
		contenido.className = 'contenido';
		seccion.appendChild(contenido);

		var categoria = document.createElement('span');
		categoria.className = 'etiqueta-categoria';
		categoria.textContent = datos.emoji + ' ' + datos.categoria;
		contenido.appendChild(categoria);

		var titulo = document.createElement('h2');
		titulo.className = 'titulo';
		titulo.textContent = datos.titulo;
		contenido.appendChild(titulo);

		var dato = document.createElement('p');
		dato.className = 'dato';
		dato.textContent = datos.dato;
		contenido.appendChild(dato);

		var detalle = document.createElement('p');
		detalle.className = 'detalle';
		detalle.textContent = datos.detalle;
		contenido.appendChild(detalle);

		var mas = document.createElement('button');
		mas.className = 'mas';
		mas.textContent = 'Saber más ▾';
		mas.addEventListener('click', function () {
			var abierta = seccion.classList.toggle('expandida');
			mas.textContent = abierta ? 'Cerrar ▴' : 'Saber más ▾';
			if (abierta) {
				setTimeout(function () {
					detalle.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
				}, 340);
			}
		});
		contenido.appendChild(mas);

		var meta = document.createElement('div');
		meta.className = 'meta';
		meta.textContent = '📍 ' + datos.lugar + '  ·  🕰️ ' + datos.epoca;
		contenido.appendChild(meta);

		var etiquetas = document.createElement('div');
		etiquetas.className = 'etiquetas';
		(datos.etiquetas || []).forEach(function (texto) {
			var span = document.createElement('span');
			span.textContent = '#' + texto.replace(/\s+/g, '');
			etiquetas.appendChild(span);
		});
		contenido.appendChild(etiquetas);

		if (datos.quiz) {
			contenido.appendChild(crearQuiz(datos));
		}

		var fuente = document.createElement('div');
		fuente.className = 'fuente';
		fuente.textContent = 'Fuente: ' + datos.fuente;
		contenido.appendChild(fuente);

		seccion.appendChild(crearAcciones(datos, seccion));
		activarDobleToque(seccion, datos);

		return seccion;
	}

	function crearAcciones(datos, seccion) {
		var barra = document.createElement('div');
		barra.className = 'acciones';

		var like = crearAccion('❤️', 'Me gusta', estado.likes.indexOf(datos.id) !== -1);
		like.addEventListener('click', function () {
			var activo = alternar(estado.likes, datos.id);
			like.classList.toggle('activa', activo);
			like.classList.add('pulso');
			setTimeout(function () {
				like.classList.remove('pulso');
			}, 400);
			guardarEstado();
		});
		barra.appendChild(like);
		seccion._botonLike = like;

		var guardar = crearAccion('🔖', 'Guardar', estado.guardados.indexOf(datos.id) !== -1);
		guardar.addEventListener('click', function () {
			var activo = alternar(estado.guardados, datos.id);
			guardar.classList.toggle('activa', activo);
			guardarEstado();
			brindis(activo ? 'Guardada para después' : 'Quitada de guardados');
		});
		barra.appendChild(guardar);

		if (datos.quiz) {
			var quiz = crearAccion('🧠', 'Quiz', false);
			quiz.addEventListener('click', function () {
				var caja = seccion.querySelector('.quiz');
				caja.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
				caja.animate(
					[{ transform: 'scale(1)' }, { transform: 'scale(1.02)' }, { transform: 'scale(1)' }],
					{ duration: 380 }
				);
			});
			barra.appendChild(quiz);
		}

		var compartir = crearAccion('↗️', 'Compartir', false);
		compartir.addEventListener('click', function () {
			var texto = datos.titulo + ' — ' + datos.dato + ' (vía CulturaTok)';
			if (navigator.share) {
				navigator.share({ title: 'CulturaTok', text: texto }).catch(function () { });
			} else if (navigator.clipboard) {
				navigator.clipboard.writeText(texto).then(function () {
					brindis('Copiado al portapapeles');
				});
			} else {
				brindis('Compartir no está disponible aquí');
			}
		});
		barra.appendChild(compartir);

		return barra;
	}

	function crearQuiz(datos) {
		var caja = document.createElement('div');
		caja.className = 'quiz';

		var pregunta = document.createElement('p');
		pregunta.className = 'quiz-pregunta';
		pregunta.textContent = '🧠 ' + datos.quiz.pregunta;
		caja.appendChild(pregunta);

		var explicacion = document.createElement('p');
		explicacion.className = 'explicacion';

		var botones = datos.quiz.opciones.map(function (texto, indice) {
			var boton = document.createElement('button');
			boton.className = 'opcion';
			boton.textContent = String.fromCharCode(65 + indice) + '. ' + texto;
			boton.addEventListener('click', function () {
				responderQuiz(datos, indice, botones, explicacion);
			});
			caja.appendChild(boton);
			return boton;
		});

		caja.appendChild(explicacion);

		if (estado.respondidas[datos.id] !== undefined) {
			marcarRespondida(caja, botones);
		}

		return caja;
	}

	function marcarRespondida(caja, botones) {
		botones.forEach(function (boton) {
			boton.disabled = true;
		});
		caja.querySelector('.explicacion').textContent = 'Ya respondiste esta pregunta.';
	}

	function responderQuiz(datos, indice, botones, explicacion) {
		botones.forEach(function (boton) {
			boton.disabled = true;
		});

		fetch('api/tarjetas/' + encodeURIComponent(datos.id) + '/quiz', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ opcion: indice })
		})
			.then(function (respuesta) {
				if (!respuesta.ok) {
					throw new Error('respuesta ' + respuesta.status);
				}
				return respuesta.json();
			})
			.then(function (resultado) {
				botones[resultado.opcionCorrecta].classList.add('bien');
				if (!resultado.acertada) {
					botones[indice].classList.add('mal');
				}
				explicacion.textContent = (resultado.acertada ? '✅ ' : '❌ ') + resultado.explicacion;

				if (estado.respondidas[datos.id] === undefined) {
					estado.respondidas[datos.id] = resultado.acertada;
					estado.total += 1;
					if (resultado.acertada) {
						estado.aciertos += 1;
						estado.racha += 1;
						estado.mejorRacha = Math.max(estado.mejorRacha, estado.racha);
					} else {
						estado.racha = 0;
					}
					guardarEstado();
					pintarMarcador();
					if (resultado.acertada && estado.racha > 0 && estado.racha % 5 === 0) {
						brindis('¡' + estado.racha + ' seguidas! 🔥');
					}
				}
			})
			.catch(function () {
				botones.forEach(function (boton) {
					boton.disabled = false;
				});
				explicacion.textContent = 'No se pudo comprobar la respuesta. Inténtalo otra vez.';
			});
	}

	function activarDobleToque(seccion, datos) {
		var ultimo = 0;
		seccion.addEventListener('click', function (evento) {
			if (evento.target.closest('button')) {
				return;
			}
			var ahora = Date.now();
			if (ahora - ultimo < 320) {
				if (estado.likes.indexOf(datos.id) === -1) {
					estado.likes.push(datos.id);
					guardarEstado();
					seccion._botonLike.classList.add('activa', 'pulso');
					setTimeout(function () {
						seccion._botonLike.classList.remove('pulso');
					}, 400);
					brindis('❤️');
				}
			}
			ultimo = ahora;
		});
	}

	/* ---------- feed ---------- */

	function pintarFeed() {
		var lista;
		if (categoriaActiva === GUARDADOS) {
			lista = catalogo.filter(function (tarjeta) {
				return estado.guardados.indexOf(tarjeta.id) !== -1;
			});
		} else if (categoriaActiva === TODO) {
			lista = catalogo;
		} else {
			lista = catalogo.filter(function (tarjeta) {
				return tarjeta.categoria === categoriaActiva;
			});
		}

		feed.innerHTML = '';
		lista.forEach(function (datos) {
			feed.appendChild(crearTarjeta(datos));
		});
		feed.scrollTop = 0;
		vacio.classList.toggle('oculto', lista.length > 0);
		pista.classList.toggle('oculto', lista.length === 0);
	}

	function pintarCategorias(categorias) {
		var todas = [TODO].concat(categorias, [GUARDADOS]);
		barraCategorias.innerHTML = '';
		todas.forEach(function (nombre) {
			var chip = document.createElement('button');
			chip.className = 'chip' + (nombre === categoriaActiva ? ' activo' : '');
			chip.textContent = nombre;
			chip.addEventListener('click', function () {
				categoriaActiva = nombre;
				Array.prototype.forEach.call(barraCategorias.children, function (otro) {
					otro.classList.toggle('activo', otro === chip);
				});
				pintarFeed();
			});
			barraCategorias.appendChild(chip);
		});
	}

	feed.addEventListener('scroll', function () {
		if (feed.scrollTop > 40) {
			pista.classList.add('oculto');
		}
	}, { passive: true });

	document.addEventListener('keydown', function (evento) {
		if (evento.key !== 'ArrowDown' && evento.key !== 'ArrowUp') {
			return;
		}
		evento.preventDefault();
		var alto = feed.clientHeight;
		var indice = Math.round(feed.scrollTop / alto) + (evento.key === 'ArrowDown' ? 1 : -1);
		var maximo = feed.children.length - 1;
		feed.scrollTo({ top: Math.min(Math.max(indice, 0), maximo) * alto, behavior: 'smooth' });
	});

	vacio.querySelector('button').addEventListener('click', function () {
		categoriaActiva = TODO;
		pintarCategorias(categoriasCargadas);
		pintarFeed();
	});

	var categoriasCargadas = [];

	Promise.all([
		fetch('api/tarjetas?mezclar=true').then(function (r) { return r.json(); }),
		fetch('api/categorias').then(function (r) { return r.json(); })
	])
		.then(function (respuestas) {
			catalogo = respuestas[0];
			categoriasCargadas = respuestas[1];
			pintarCategorias(categoriasCargadas);
			pintarFeed();
			pintarMarcador();
		})
		.catch(function () {
			feed.innerHTML = '<section class="tarjeta" style="background:linear-gradient(155deg,#434343,#000)">' +
				'<h2 class="titulo">No se pudo cargar el contenido</h2>' +
				'<p class="dato">Arranca el servidor con <code>./gradlew bootRun</code> y recarga la página.</p>' +
				'</section>';
		});
})();
