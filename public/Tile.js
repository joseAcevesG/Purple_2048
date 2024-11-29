/* Clase Tile para el juego 2048 */
export default class Tile {
	// Propiedades privadas
	#tileElement;
	#x;
	#y;
	#value;

	/* Constructor de la clase Tile */
	constructor(
		tileContainer,
		value = Math.random() > 0.2 ? 2 : 4,
		x = undefined,
		y = undefined,
	) {
		// Crear un nuevo elemento div para el tile
		this.#tileElement = document.createElement('div');
		// Añadir la clase 'tile' al elemento
		this.#tileElement.classList.add('tile');
		// Añadir el elemento tile al contenedor
		tileContainer.append(this.#tileElement);
		// Establecer el valor del tile
		this.value = value;
		// Añadir una clase basada en el valor del tile
		this.#tileElement.classList.add(`t${value}`);
		// Si se proporcionan coordenadas x e y, establecerlas
		if (x !== undefined && y !== undefined) {
			this.#x = x;
			this.#y = y;
		}
	}

	// Getter para la propiedad value
	get value() {
		return this.#value;
	}

	// Getter para la propiedad x
	get x() {
		return this.#x;
	}

	// Getter para la propiedad y
	get y() {
		return this.#y;
	}

	// Setter para la propiedad value
	set value(v) {
		// Establecer el valor privado #value
		this.#value = v;
		// Actualizar el contenido de texto del elemento tile
		this.#tileElement.textContent = v;
		// Obtener la lista de clases del elemento tile
		const classes = this.#tileElement.classList;
		// Eliminar todas las clases excepto 'tile'
		for (let i = classes.length + 1; i >= 0; i--) {
			if (classes[i] !== 'tile') this.#tileElement.classList.remove(classes[i]);
		}
		// Añadir una clase basada en el valor
		this.#tileElement.classList.add(`t${v}`);
	}

	// Setter para la propiedad x
	set x(value) {
		// Establecer la propiedad privada #x
		this.#x = value;
		// Actualizar la variable CSS --x para el elemento tile
		this.#tileElement.style.setProperty('--x', value);
	}

	// Setter para la propiedad y
	set y(value) {
		// Establecer la propiedad privada #y
		this.#y = value;
		// Actualizar la variable CSS --y para el elemento tile
		this.#tileElement.style.setProperty('--y', value);
	}

	// Método para eliminar el elemento tile del DOM
	remove() {
		this.#tileElement.remove();
	}

	// Esperar a que termine la transición o animación
	waitForTransition(animation = false) {
		return new Promise((resolve) => {
			this.#tileElement.addEventListener(
				animation ? 'animationend' : 'transitionend',
				resolve,
				{
					once: true,
				},
			);
		});
	}
}
