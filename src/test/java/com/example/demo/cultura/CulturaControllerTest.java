package com.example.demo.cultura;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertTrue;

import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import org.junit.Test;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class CulturaControllerTest {

	private final CatalogoCultural catalogo = new CatalogoCultural();
	private final CulturaController controlador = new CulturaController(catalogo);

	private Tarjeta primeraConQuiz() {
		for (Tarjeta tarjeta : catalogo.todas()) {
			if (tarjeta.getQuiz() != null) {
				return tarjeta;
			}
		}
		throw new IllegalStateException("no hay ninguna tarjeta con quiz");
	}

	@Test
	public void devuelveTodasLasTarjetas() {
		assertEquals(catalogo.todas().size(), controlador.tarjetas(null, false).size());
		assertEquals(catalogo.todas().size(), controlador.tarjetas(null, true).size());
	}

	@Test
	public void aciertaConLaOpcionCorrecta() {
		Tarjeta tarjeta = primeraConQuiz();
		Map<String, Integer> cuerpo = new HashMap<String, Integer>();
		cuerpo.put("opcion", tarjeta.getQuiz().getCorrecta());

		ResponseEntity<RespuestaQuiz> respuesta = controlador.responder(tarjeta.getId(), cuerpo);

		assertEquals(HttpStatus.OK, respuesta.getStatusCode());
		assertTrue(respuesta.getBody().isAcertada());
		assertEquals(tarjeta.getQuiz().getExplicacion(), respuesta.getBody().getExplicacion());
	}

	@Test
	public void fallaConOtraOpcion() {
		Tarjeta tarjeta = primeraConQuiz();
		int incorrecta = (tarjeta.getQuiz().getCorrecta() + 1) % tarjeta.getQuiz().getOpciones().size();
		Map<String, Integer> cuerpo = new HashMap<String, Integer>();
		cuerpo.put("opcion", incorrecta);

		ResponseEntity<RespuestaQuiz> respuesta = controlador.responder(tarjeta.getId(), cuerpo);

		assertFalse(respuesta.getBody().isAcertada());
		assertEquals(tarjeta.getQuiz().getCorrecta(), respuesta.getBody().getOpcionCorrecta());
	}

	@Test
	public void rechazaTarjetaDesconocidaYCuerpoVacio() {
		Map<String, Integer> cuerpo = new HashMap<String, Integer>();
		cuerpo.put("opcion", 0);
		assertEquals(HttpStatus.NOT_FOUND, controlador.responder("no-existe", cuerpo).getStatusCode());

		Tarjeta tarjeta = primeraConQuiz();
		Map<String, Integer> vacio = Collections.emptyMap();
		assertEquals(HttpStatus.BAD_REQUEST, controlador.responder(tarjeta.getId(), vacio).getStatusCode());
	}

	@Test
	public void devuelveLasCategorias() {
		assertFalse(controlador.categorias().isEmpty());
	}
}
