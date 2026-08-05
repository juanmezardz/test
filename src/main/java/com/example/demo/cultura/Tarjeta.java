package com.example.demo.cultura;

import java.util.List;

public class Tarjeta {

	private final String id;
	private final String categoria;
	private final String emoji;
	private final String titulo;
	private final String dato;
	private final String detalle;
	private final String lugar;
	private final String epoca;
	private final String fuente;
	private final List<String> etiquetas;
	private final String colorInicio;
	private final String colorFin;
	private final Quiz quiz;

	public Tarjeta(String id, String categoria, String emoji, String titulo, String dato, String detalle,
			String lugar, String epoca, String fuente, List<String> etiquetas, String colorInicio,
			String colorFin, Quiz quiz) {
		this.id = id;
		this.categoria = categoria;
		this.emoji = emoji;
		this.titulo = titulo;
		this.dato = dato;
		this.detalle = detalle;
		this.lugar = lugar;
		this.epoca = epoca;
		this.fuente = fuente;
		this.etiquetas = etiquetas;
		this.colorInicio = colorInicio;
		this.colorFin = colorFin;
		this.quiz = quiz;
	}

	public String getId() {
		return id;
	}

	public String getCategoria() {
		return categoria;
	}

	public String getEmoji() {
		return emoji;
	}

	public String getTitulo() {
		return titulo;
	}

	public String getDato() {
		return dato;
	}

	public String getDetalle() {
		return detalle;
	}

	public String getLugar() {
		return lugar;
	}

	public String getEpoca() {
		return epoca;
	}

	public String getFuente() {
		return fuente;
	}

	public List<String> getEtiquetas() {
		return etiquetas;
	}

	public String getColorInicio() {
		return colorInicio;
	}

	public String getColorFin() {
		return colorFin;
	}

	public Quiz getQuiz() {
		return quiz;
	}
}
