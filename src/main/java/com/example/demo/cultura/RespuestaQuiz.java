package com.example.demo.cultura;

public class RespuestaQuiz {

	private final boolean acertada;
	private final int opcionCorrecta;
	private final String explicacion;

	public RespuestaQuiz(boolean acertada, int opcionCorrecta, String explicacion) {
		this.acertada = acertada;
		this.opcionCorrecta = opcionCorrecta;
		this.explicacion = explicacion;
	}

	public boolean isAcertada() {
		return acertada;
	}

	public int getOpcionCorrecta() {
		return opcionCorrecta;
	}

	public String getExplicacion() {
		return explicacion;
	}
}
