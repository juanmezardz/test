package com.example.demo.cultura;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class Quiz {

	private final String pregunta;
	private final List<String> opciones;
	private final int correcta;
	private final String explicacion;

	public Quiz(String pregunta, List<String> opciones, int correcta, String explicacion) {
		this.pregunta = pregunta;
		this.opciones = opciones;
		this.correcta = correcta;
		this.explicacion = explicacion;
	}

	public String getPregunta() {
		return pregunta;
	}

	public List<String> getOpciones() {
		return opciones;
	}

	@JsonIgnore
	public int getCorrecta() {
		return correcta;
	}

	@JsonIgnore
	public String getExplicacion() {
		return explicacion;
	}
}
