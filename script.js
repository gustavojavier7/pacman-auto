 const version = "1.5.0"; // Definir la versión en una variable

        const jugadorHumano = "Jugador Humano";
        const jugadorCPU = "Jugador CPU";

        // Completar el mazo de 40 cartas de la baraja española
        const mazoCompleto = [
            "1 de Espada", "2 de Espada", "3 de Espada", "4 de Espada", "5 de Espada", "6 de Espada", "7 de Espada", "10 de Espada", "11 de Espada", "12 de Espada",
            "1 de Basto", "2 de Basto", "3 de Basto", "4 de Basto", "5 de Basto", "6 de Basto", "7 de Basto", "10 de Basto", "11 de Basto", "12 de Basto",
            "1 de Oro", "2 de Oro", "3 de Oro", "4 de Oro", "5 de Oro", "6 de Oro", "7 de Oro", "10 de Oro", "11 de Oro", "12 de Oro",
            "1 de Copa", "2 de Copa", "3 de Copa", "4 de Copa", "5 de Copa", "6 de Copa", "7 de Copa", "10 de Copa", "11 de Copa", "12 de Copa"
        ];

        const cartas = { // Valores completos de las cartas
            "1 de Espada": 14, "1 de Basto": 13, "7 de Espada": 12, "7 de Oro": 11, "3 de Espada": 10,
            "1 de Oro": 9, "3 de Basto": 8, "3 de Copa": 7, "2 de Espada": 6, "2 de Oro": 5,
            "2 de Copa": 4, "1 de Copa": 3, "12 de Espada": 2, "12 de Basto": 2, "12 de Oro": 1, "12 de Copa": 1,
            "11 de Espada": 2, "11 de Basto": 2, "11 de Oro": 1, "11 de Copa": 1,
            "10 de Espada": 2, "10 de Basto": 2, "10 de Oro": 1, "10 de Copa": 1,
            "7 de Copa": 0, "6 de Espada": 0, "6 de Basto": 0, "6 de Oro": 0, "6 de Copa": 0,
            "5 de Espada": 0, "5 de Basto": 0, "5 de Oro": 0, "5 de Copa": 0,
            "4 de Espada": 0, "4 de Basto": 0, "4 de Oro": 0, "4 de Copa": 0
        };

        const elementos = {
            jugadorHumanoDiv: document.getElementById("jugadorHumano"),
            jugadorHumanoHeader: document.getElementById("jugadorHumanoHeader"),
            jugadorCPUDiv: document.getElementById("jugadorCPU"),
            jugadorCPUHeader: document.getElementById("jugadorCPUHeader"),
            marcadorDiv: document.getElementById("marcador"),
            marcadorHeader: document.getElementById("marcadorHeader"),
            resultadoDiv: document.getElementById("resultado"),
            comenzarJuegoBtn: document.getElementById("comenzarJuego"),
            btnQuiero: document.getElementById("btnQuiero"),
            btnNoQuiero: document.getElementById("btnNoQuiero"),
            btnTruco: document.getElementById("btnTruco"),
            btnRetruco: document.getElementById("btnRetruco"),
            btnValeCuatro: document.getElementById("btnValeCuatro"),
            rondasDiv: document.getElementById("rondas")
        };

        let marcadorJugadorHumano = 0;
        let marcadorCPU = 0;
        let envidoActivo = false;
        let trucoActivo = false;
        let puntosTruco = 1;
        let turnoJugadorHumano = true;
        let manoHumano, manoCPU; // Mantener referencia a las manos
        let cartaJugadaHumano;
        let cartaJugadaCPU;
        let rondasJugadas = 0; // Conteo de rondas jugadas
        let bazaActual = []; // Array para almacenar las cartas jugadas en la baza actual
        let bazasGanadasHumano = 0;
        let bazasGanadasCPU = 0;

        /**
         * Función para calcular los puntos del Envido.
         * @param {Array} mano - Array de cartas de la mano.
         * @returns {number} - Puntos del Envido.
         */
        function calcularPuntosEnvido(mano) {
            let puntos = 0;
            const palos = {};

            mano.forEach(carta => {
                const [numero, palo] = carta.split(" de ");
                const valor = parseInt(numero) <= 7 ? parseInt(numero) : 0;

                if (!palos[palo]) palos[palo] = [];
                palos[palo].push(valor);
            });

            for (const palo in palos) {
                if (palos[palo].length > 1) {
                    palos[palo].sort((a, b) => b - a);
                    puntos = Math.max(puntos, palos[palo][0] + palos[palo][1] + 20);
                }
            }

            return puntos;
        }

        /**
         * Función para mostrar los elementos ocultos.
         * @param {Array} elementosArray - Array de elementos a mostrar.
         */
        function mostrarElementos(elementosArray) {
            elementosArray.forEach(elemento => elemento.classList.remove('hidden'));
        }

        /**
         * Función para ocultar los elementos visibles.
         * @param {Array} elementosArray - Array de elementos a ocultar.
         */
        function ocultarElementos(elementosArray) {
            elementosArray.forEach(elemento => elemento.classList.add('hidden'));
        }

        /**
         * Función para activar los botones de Envido.
         */
        function activarBotonesEnvido() {
            mostrarElementos([elementos.btnQuiero, elementos.btnNoQuiero]);
            envidoActivo = true;
        }

        /**
         * Función para gestionar el Envido.
         * @param {Array} manoHumano - Array de cartas de la mano del jugador humano.
         * @param {Array} manoCPU - Array de cartas de la mano de la CPU.
         */
        function gestionarEnvido(manoHumano, manoCPU) {
            const puntosHumano = calcularPuntosEnvido(manoHumano);
            const puntosCPU = calcularPuntosEnvido(manoCPU);

            elementos.btnQuiero.onclick = () => {
                if (puntosHumano > puntosCPU) {
                    marcadorJugadorHumano += 2;
                    elementos.resultadoDiv.textContent = `${jugadorHumano} gana el Envido con ${puntosHumano} puntos.`;
                } else if (puntosHumano < puntosCPU) {
                    marcadorCPU += 2;
                    elementos.resultadoDiv.textContent = `${jugadorCPU} gana el Envido con ${puntosCPU} puntos.`;
                } else {
                    elementos.resultadoDiv.textContent = `Empate en el Envido (${puntosHumano} puntos).`;
                }
                actualizarMarcador();
                desactivarBotonesEnvido();
            };

            elementos.btnNoQuiero.onclick = () => {
                marcadorJugadorHumano += 1; // Gana 1 punto si la CPU rechaza el Envido
                elementos.resultadoDiv.textContent = `${jugadorHumano} gana 1 punto porque ${jugadorCPU} no quiso el Envido.`;
                actualizarMarcador();
                desactivarBotonesEnvido();
            };
        }

        /**
         * Función para desactivar los botones de Envido.
         */
        function desactivarBotonesEnvido() {
            ocultarElementos([elementos.btnQuiero, elementos.btnNoQuiero]);
            envidoActivo = false;
        }

        /**
         * Función para activar el botón de Truco.
         */
        function activarBotonTruco() {
            mostrarElementos([elementos.btnTruco]);
            elementos.btnTruco.onclick = () => {
                trucoActivo = true;
                elementos.resultadoDiv.textContent = `${jugadorHumano} dice: Truco.`;
                manejarRespuestaCPU("Truco");
                ocultarElementos([elementos.btnTruco]); // Ocultar Truco tras seleccionarlo
            };
        }

        /**
         * Función para manejar la respuesta de la CPU al Truco.
         * @param {string} tipo - Tipo de respuesta ("Truco", "Retruco", "Vale Cuatro").
         */
        function manejarRespuestaCPU(tipo) {
            const acepta = Math.random() > 0.4; // CPU acepta con un 60% de probabilidad
            if (acepta) {
                puntosTruco++;
                elementos.resultadoDiv.textContent += ` ${jugadorCPU} dice: Quiero.`;

                if (tipo === "Truco") {
                    mostrarElementos([elementos.btnRetruco]); // Habilitar Retruco
                } else if (tipo === "Retruco") {
                    mostrarElementos([elementos.btnValeCuatro]); // Habilitar Vale Cuatro
                }
            } else {
                elementos.resultadoDiv.textContent += ` ${jugadorCPU} dice: No quiero.`;
                marcadorJugadorHumano += puntosTruco;
                actualizarMarcador();
                reiniciarTruco();
            }
        }

        /**
         * Evento para manejar el clic en el botón de Retruco.
         */
        elementos.btnRetruco.onclick = () => {
            elementos.resultadoDiv.textContent = `${jugadorHumano} dice: Retruco.`;
            manejarRespuestaCPU("Retruco");
            ocultarElementos([elementos.btnRetruco]);
        };

        /**
         * Evento para manejar el clic en el botón de Vale Cuatro.
         */
        elementos.btnValeCuatro.onclick = () => {
            elementos.resultadoDiv.textContent = `${jugadorHumano} dice: Vale Cuatro.`;
            manejarRespuestaCPU("Vale Cuatro");
            ocultarElementos([elementos.btnValeCuatro]);
        };

        /**
         * Función para reiniciar el estado del Truco.
         */
        function reiniciarTruco() {
            trucoActivo = false;
            puntosTruco = 1;
            ocultarElementos([elementos.btnTruco, elementos.btnRetruco, elementos.btnValeCuatro]);
        }

        /**
         * Función para mostrar las cartas en el div correspondiente.
         * @param {Array} mano - Array de cartas a mostrar.
         * @param {HTMLElement} div - Div donde se mostrarán las cartas.
         */
        function mostrarCartas(mano, div) {
            div.innerHTML = "<h3>Cartas</h3>";
            mano.forEach(carta => {
                const cartaDiv = document.createElement("div");
                cartaDiv.className = "carta";
                cartaDiv.textContent = carta;
                cartaDiv.addEventListener('click', function() {
                    if (!cartaDiv.classList.contains('carta-seleccionada') && turnoJugadorHumano) {
                        document.querySelectorAll('.carta-seleccionada').forEach(carta => {
                            carta.classList.remove('carta-seleccionada');
                        });
                        cartaDiv.classList.add('carta-seleccionada');
                        jugarCarta(carta);
                    }
                });
                div.appendChild(cartaDiv);
            });
        }

        /**
         * Función para jugar una carta.
         * @param {string} carta - Carta jugada por el jugador humano.
         */
        function jugarCarta(carta) {
            cartaJugadaHumano = carta;
            quitarCartaDeMano(manoHumano, carta);
            mostrarCartas(manoHumano, elementos.jugadorHumanoDiv);
            elementos.resultadoDiv.textContent = `${jugadorHumano} jugó ${carta}.`;

            bazaActual.push({ jugador: jugadorHumano, carta: carta }); // Agregar carta a la baza actual

            if (bazaActual.length === 2) { // Si ambos jugadores jugaron una carta
                determinarGanadorBaza();
            } else {
                setTimeout(jugarCartaCPU, 1000); // Si no, juega la CPU
            }
        }

        /**
         * Función para quitar una carta de la mano.
         * @param {Array} mano - Array de cartas de la mano.
         * @param {string} carta - Carta a quitar.
         */
        function quitarCartaDeMano(mano, carta) {
            const index = mano.indexOf(carta);
            if (index > -1) {
                mano.splice(index, 1);
            }
        }

        /**
         * Función para jugar una carta por la CPU.
         */
        function jugarCartaCPU() {
            const cartaIndex = Math.floor(Math.random() * manoCPU.length);
            cartaJugadaCPU = manoCPU[cartaIndex];
            quitarCartaDeMano(manoCPU, cartaJugadaCPU);
            mostrarCartas(manoCPU, elementos.jugadorCPUDiv);
            elementos.resultadoDiv.textContent += ` ${jugadorCPU} jugó ${cartaJugadaCPU}.`;
            bazaActual.push({ jugador: jugadorCPU, carta: cartaJugadaCPU });
        }

        /**
         * Función para determinar el ganador de la baza.
         */
        function determinarGanadorBaza() {
            const cartaHumanoBaza = bazaActual.find(j => j.jugador === jugadorHumano).carta;
            const cartaCPUBaza = bazaActual.find(j => j.jugador === jugadorCPU).carta;
            const valorHumano = cartas[cartaHumanoBaza];
            const valorCPU = cartas[cartaCPUBaza];

            let ganadorBaza = null;

            if (valorHumano > valorCPU) {
                elementos.resultadoDiv.textContent += ` ${jugadorHumano} gana la baza.`;
                ganadorBaza = jugadorHumano;
                bazasGanadasHumano++;
            } else if (valorCPU > valorHumano) {
                elementos.resultadoDiv.textContent += ` ${jugadorCPU} gana la baza.`;
                ganadorBaza = jugadorCPU;
                bazasGanadasCPU++;
            } else {
                elementos.resultadoDiv.textContent += ` Empate en la baza.`;
            }
            rondasJugadas++;
            elementos.rondasDiv.textContent = `Rondas Jugadas: ${rondasJugadas}`;
            bazaActual = []; // Reiniciar la baza actual

            if (manoHumano.length === 0) { // Fin de la mano
                finalizarMano();
            } else if (ganadorBaza != null && ganadorBaza === jugadorHumano) {
                setTimeout(jugarCartaCPU, 1000);
            }
        }

        /**
         * Función para finalizar la mano.
         */
        function finalizarMano() {
            let puntosMano = 0;
            if (bazasGanadasHumano > bazasGanadasCPU) {
                elementos.resultadoDiv.textContent += ` ${jugadorHumano} gana la mano.`;
                puntosMano = puntosTruco;
                marcadorJugadorHumano += puntosMano;
            } else if (bazasGanadasCPU > bazasGanadasHumano) {
                elementos.resultadoDiv.textContent += ` ${jugadorCPU} gana la mano.`;
                puntosMano = puntosTruco;
                marcadorCPU += puntosMano;
            } else {
                elementos.resultadoDiv.textContent += ` Empate en la mano.`;
            }
            actualizarMarcador();
            reiniciarMano();
        }

        /**
         * Función para reiniciar la mano.
         */
        function reiniciarMano() {
            bazasGanadasHumano = 0;
            bazasGanadasCPU = 0;
            rondasJugadas = 0;
            reiniciarTruco();
            elementos.rondasDiv.textContent = `Rondas Jugadas: ${rondasJugadas}`;
            elementos.resultadoDiv.textContent = "";
            inicializarCartas();
        }

        /**
         * Función para barajar las cartas.
         * @param {Array} cartasArray - Array de cartas a barajar.
         * @returns {Array} - Array de cartas barajadas.
         */
        function barajarCartas(cartasArray) {
            for (let i = cartasArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [cartasArray[i], cartasArray[j]] = [cartasArray[j], cartasArray[i]];
            }
            return cartasArray;
        }

        /**
         * Función para inicializar las cartas.
         */
        function inicializarCartas() {
            const cartasBarajadas = barajarCartas([...mazoCompleto]);
            manoHumano = cartasBarajadas.slice(0, 3);
            manoCPU = cartasBarajadas.slice(3, 6);

            mostrarCartas(manoHumano, elementos.jugadorHumanoDiv);
            mostrarCartas(manoCPU, elementos.jugadorCPUDiv);

            activarBotonTruco();
            activarBotonesEnvido();

            elementos.resultadoDiv.textContent = `${jugadorHumano} pide Envido.`;
            gestionarEnvido(manoHumano, manoCPU);
        }

        /**
         * Función para actualizar el marcador.
         */
        function actualizarMarcador() {
            elementos.marcadorDiv.textContent = `${jugadorHumano}: ${marcadorJugadorHumano} - ${jugadorCPU}: ${marcadorCPU}`;
        }

        let credits = 0;

        function insertCoin() {
            credits++;
            updateCredits();
            playSound(); // Añadir sonido si es posible
            if (credits >= 1) {
                startGame();
            }
        }

        function updateCredits() {
            document.getElementById('creditDisplay').textContent = `Créditos: ${credits}`;
        }

        function playSound() {
            // Aquí podrías añadir la lógica para reproducir un sonido de moneda insertada
            // Ejemplo usando Audio API de JavaScript:
            // const coinSound = new Audio('path/to/coin-sound.mp3');
            // coinSound.play();
            console.log("Sonido de moneda insertada"); // Para simular el sonido en este ejemplo
        }

        function startGame() {
            document.querySelector('.arcade-menu').classList.add('hidden');
            document.getElementById('gameBoard').classList.remove('hidden');
            document.getElementById('comenzarJuego').classList.remove('hidden');
        }

        elementos.comenzarJuegoBtn.onclick = () => {
            elementos.comenzarJuegoBtn.classList.add('hidden');
            mostrarElementos([elementos.jugadorHumanoDiv, elementos.jugadorHumanoHeader, elementos.jugadorCPUDiv, elementos.jugadorCPUHeader, elementos.marcadorDiv, elementos.marcadorHeader]);
            reiniciarMano();
        };
