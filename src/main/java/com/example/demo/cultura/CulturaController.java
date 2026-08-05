package com.example.demo.cultura;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class CulturaController {

	private final CatalogoCultural catalogo;

	@Autowired
	public CulturaController(CatalogoCultural catalogo) {
		this.catalogo = catalogo;
	}

	@GetMapping("/tarjetas")
	public List<Tarjeta> tarjetas(@RequestParam(value = "categoria", required = false) String categoria,
			@RequestParam(value = "mezclar", defaultValue = "false") boolean mezclar) {
		List<Tarjeta> resultado = new ArrayList<Tarjeta>(catalogo.porCategoria(categoria));
		if (mezclar) {
			Collections.shuffle(resultado);
		}
		return resultado;
	}

	@GetMapping("/tarjetas/{id}")
	public ResponseEntity<Tarjeta> tarjeta(@PathVariable("id") String id) {
		Tarjeta tarjeta = catalogo.porId(id);
		if (tarjeta == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(tarjeta);
	}

	@GetMapping("/categorias")
	public List<String> categorias() {
		return catalogo.categorias();
	}

	@PostMapping("/tarjetas/{id}/quiz")
	public ResponseEntity<RespuestaQuiz> responder(@PathVariable("id") String id,
			@RequestBody Map<String, Integer> cuerpo) {
		Tarjeta tarjeta = catalogo.porId(id);
		if (tarjeta == null || tarjeta.getQuiz() == null) {
			return ResponseEntity.notFound().build();
		}
		Integer opcion = cuerpo == null ? null : cuerpo.get("opcion");
		if (opcion == null) {
			return ResponseEntity.badRequest().build();
		}
		Quiz quiz = tarjeta.getQuiz();
		boolean acertada = opcion.intValue() == quiz.getCorrecta();
		return ResponseEntity.ok(new RespuestaQuiz(acertada, quiz.getCorrecta(), quiz.getExplicacion()));
	}
}
