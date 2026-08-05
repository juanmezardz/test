package com.example.demo.cultura;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.Assert.assertTrue;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

import org.junit.Test;

public class CatalogoCulturalTest {

	private final CatalogoCultural catalogo = new CatalogoCultural();

	@Test
	public void hayContenidoSuficiente() {
		assertTrue("el feed necesita varias tarjetas", catalogo.todas().size() >= 20);
	}

	@Test
	public void losIdentificadoresSonUnicos() {
		Set<String> vistos = new HashSet<String>();
		for (Tarjeta tarjeta : catalogo.todas()) {
			assertTrue("id duplicado: " + tarjeta.getId(), vistos.add(tarjeta.getId()));
		}
	}

	@Test
	public void lasTarjetasEstanCompletas() {
		for (Tarjeta tarjeta : catalogo.todas()) {
			assertNotNull(tarjeta.getTitulo());
			assertFalse(tarjeta.getTitulo().isEmpty());
			assertFalse(tarjeta.getDato().isEmpty());
			assertFalse(tarjeta.getDetalle().isEmpty());
			assertFalse(tarjeta.getFuente().isEmpty());
			assertTrue(tarjeta.getColorInicio().startsWith("#"));
			assertTrue(tarjeta.getColorFin().startsWith("#"));
		}
	}

	@Test
	public void losQuizzesApuntanAUnaOpcionValida() {
		for (Tarjeta tarjeta : catalogo.todas()) {
			Quiz quiz = tarjeta.getQuiz();
			if (quiz == null) {
				continue;
			}
			assertTrue("pocas opciones en " + tarjeta.getId(), quiz.getOpciones().size() >= 2);
			assertTrue("respuesta fuera de rango en " + tarjeta.getId(),
					quiz.getCorrecta() >= 0 && quiz.getCorrecta() < quiz.getOpciones().size());
			assertFalse(quiz.getExplicacion().isEmpty());
		}
	}

	@Test
	public void filtraPorCategoria() {
		List<String> categorias = catalogo.categorias();
		assertFalse(categorias.isEmpty());
		String primera = categorias.get(0);
		List<Tarjeta> filtradas = catalogo.porCategoria(primera);
		assertFalse(filtradas.isEmpty());
		for (Tarjeta tarjeta : filtradas) {
			assertEquals(primera, tarjeta.getCategoria());
		}
		assertEquals(catalogo.todas().size(), catalogo.porCategoria("Todo").size());
		assertEquals(catalogo.todas().size(), catalogo.porCategoria(null).size());
	}

	@Test
	public void buscaPorIdentificador() {
		Tarjeta primera = catalogo.todas().get(0);
		assertEquals(primera.getTitulo(), catalogo.porId(primera.getId()).getTitulo());
		assertNull(catalogo.porId("no-existe"));
	}
}
