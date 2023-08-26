const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (typeof SpeechRecognition === "undefined") {
    alert("Este navegador não suporta o reconhecimento de fala. Tente em outro navegador.");
} else {
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'pt-BR';
    //recognition.lang = 'en-US';

    const language = document.getElementById("languageSelect");
    language.addEventListener("change", () => {
        console.log(language.value, typeof (language.value))
        recognition.lang = language.value
    })
    let finalTranscript = "";
    let isListening = false;
    let isFullscreen = false;

    const transcriptionDiv = document.getElementById('output');
    const play = document.getElementById('play');
    const h1 = document.createElement('p');

    function appendTextWithScroll(text) {
        h1.textContent = text;
        transcriptionDiv.insertBefore(h1, play);
        if (!isFullscreen) {
            scrollToBottom();
        } else {
            setTimeout(scrollToBottom, 100);
        }
    }

    function scrollToBottom() {
        transcriptionDiv.scrollTop = transcriptionDiv.scrollHeight;
    }

    let userStoppedSpeaking = false;


    recognition.onresult = (event) => {
        let interimTranscript = "";
        let previousTranscript = finalTranscript;

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const words = transcript.split(" ");
            words.forEach((word) => {
                if (!event.results[i].isFinal) {
                    interimTranscript += word + " ";
                } else {
                    finalTranscript += word + " ";
                    previousTranscript = finalTranscript;
                    interimTranscript = "";
                }
            });
        }
        appendTextWithScroll(previousTranscript + interimTranscript);
    };

    recognition.onspeechstart = () => {
        console.log("speech ok")
    }
    recognition.onresult = (event) => {
        let interimTranscript = "";
        let previousTranscript = finalTranscript;

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            const words = transcript.split(" ");
            words.forEach((word) => {
                if (!event.results[i].isFinal) {
                    interimTranscript += word + " ";
                } else {
                    finalTranscript += word + " ";
                    previousTranscript = finalTranscript;
                    interimTranscript = "";
                }
            });
        }
        appendTextWithScroll(previousTranscript + interimTranscript);
    };



    const icon = document.getElementById("icon");
    const mic = document.getElementById("mic")
    const micFull = document.getElementById("micFull")
    const config = document.getElementById("config")



    document.getElementById("startButton").addEventListener("click", () => {
        console.log(recognition.lang)
        if (!isListening) {
            finalTranscript = "";
            recognition.start();
            isListening = true;
            mic.setAttribute("src", "images/micon.svg")
            micFull.setAttribute("src", "images/micon.svg")
            mic.setAttribute("title", "Ouvindo..")
            micFull.setAttribute("title", "Ouvindo..")
            icon.setAttribute("href", "images/micon.svg")
            console.log("log", typeof (icon.href))
            setInterval(() => {
                if (icon.href == "http://localhost:5501/images/micon.svg") {
                    return icon.setAttribute("href", "images/micon2.svg")
                } else if (icon.href == "http://localhost:5501/images/micon2.svg") {
                    icon.setAttribute("href", "images/micon.svg")
                }
            }, 500)

        } else {
            recognition.stop();
            isListening = false;
            mic.setAttribute("src", "images/micoff.svg")
            micFull.setAttribute("src", "images/micoff.svg")
            icon.setAttribute("href", "images/micoff.svg")
            mic.setAttribute("title", "Parado")
            micFull.setAttribute("title", "Parado")
            if (!userStoppedSpeaking) {
                finalTranscript += interimTranscript | '';
                appendTextWithScroll(finalTranscript);
            }
            // userStoppedSpeaking = false; // Resete a variável para a próxima fala
            interimTranscript = ""; // Limpar o texto intermediário
        }
    });




    document.getElementById("micFull").addEventListener("click", (evt) => {
        if (!isListening) {
            finalTranscript = "";
            recognition.start();
            isListening = true;
            mic.setAttribute("src", "images/micon.svg")
            micFull.setAttribute("src", "images/micon.svg")
            icon.setAttribute("href", "images/micon.svg")
            mic.setAttribute("title", "Ouvindo..")
            micFull.setAttribute("title", "Ouvindo..")

        } else {
            recognition.stop();
            isListening = false;
            mic.setAttribute("src", "images/micoff.svg")
            icon.setAttribute("href", "images/micoff.svg")
            mic.setAttribute("title", "Parado")
            micFull.setAttribute("src", "images/micoff.svg")
            micFull.setAttribute("title", "Parado")
            if (!userStoppedSpeaking) {
                finalTranscript += interimTranscript;
                appendTextWithScroll(finalTranscript);
            }
            interimTranscript = "";
        }
    });
    document.getElementById("mic").addEventListener("click", (evt) => {
        if (!isListening) {
            finalTranscript = "";
            recognition.start();
            isListening = true;
            mic.setAttribute("src", "images/micon.svg")
            micFull.setAttribute("src", "images/micon.svg")
            icon.setAttribute("href", "images/micon.svg")
            mic.setAttribute("title", "Ouvindo..")
            micFull.setAttribute("title", "Ouvindo..")

        } else {
            recognition.stop();
            isListening = false;
            mic.setAttribute("src", "images/micoff.svg")
            icon.setAttribute("href", "images/micoff.svg")
            mic.setAttribute("title", "Parado")
            micFull.setAttribute("src", "images/micoff.svg")
            micFull.setAttribute("title", "Parado")
            if (!userStoppedSpeaking) {
                finalTranscript += interimTranscript;
                appendTextWithScroll(finalTranscript);
            }
            interimTranscript = "";
        }
    });


    document.addEventListener("fullscreenchange", () => {
        if (!document.fullscreenElement) {
            menufull.classList.add("ocultar")
            outputDiv.classList.remove("fullscreen");
            isFullscreen = false;
            scrollToBottom();
        } else {
            outputDiv.classList.add("fullscreen");
            isFullscreen = true;
        }
    });

    function applyTextSettings(fontSize, fontColor, fontFamily, backgroundColor) {
        h1.style.fontSize = `${fontSize}px`;
        h1.style.color = fontColor;
        h1.style.fontFamily = fontFamily;
        const mainDiv = document.querySelector(".main");
        mainDiv.style.backgroundColor = backgroundColor;
    }

    const fontSizeInput = document.getElementById("fontSizeInput");
    const fontColorInput = document.getElementById("fontColorInput");
    const fontFamilySelect = document.getElementById("fontFamilySelect");
    const backgroundColorInput = document.getElementById("backgroundColorInput");

    fontSizeInput.addEventListener("input", () => {
        applyTextSettings(fontSizeInput.value, fontColorInput.value, fontFamilySelect.value);

    });

    fontColorInput.addEventListener("input", () => {
        applyTextSettings(fontSizeInput.value, fontColorInput.value, fontFamilySelect.value);
    });

    fontFamilySelect.addEventListener("change", () => {
        applyTextSettings(fontSizeInput.value, fontColorInput.value, fontFamilySelect.value);
    });

    backgroundColorInput.addEventListener("input", () => {
        applyBackgroundSettings(backgroundColorInput.value);
    });

    function applyBackgroundSettings(backgroundColor) {
        const mainDiv = document.querySelector(".output");
        mainDiv.style.backgroundColor = backgroundColor;
    }

    const fontSizeInputFull = document.getElementById("fontSizeInputFull");
    const fontColorInputFull = document.getElementById("fontColorInputFull");
    const fontFamilySelectFull = document.getElementById("fontFamilySelectFull");
    const backgroundColorInputFull = document.getElementById("backgroundColorInputFull");

    fontSizeInputFull.addEventListener("input", () => {
        applyTextSettings(fontSizeInputFull.value, fontColorInputFull.value, fontFamilySelectFull.value);

    });

    fontColorInputFull.addEventListener("input", () => {
        applyTextSettings(fontSizeInputFull.value, fontColorInputFull.value, fontFamilySelectFull.value);
    });

    fontFamilySelectFull.addEventListener("change", () => {
        applyTextSettings(fontSizeInputFull.value, fontColorInputFull.value, fontFamilySelectFull.value);
    });

    backgroundColorInputFull.addEventListener("input", () => {
        applyBackgroundSettingsFull(backgroundColorInputFull.value);
    });

    function applyBackgroundSettingsFull(backgroundColor) {
        const mainDiv = document.querySelector(".output");
        mainDiv.style.backgroundColor = backgroundColor;
    }

    let timerId;
    const handleMouseMove = (evt) => {
        clearTimeout(timerId);

        if (!outputDiv.classList.contains("fullscreen")) {
            menufull.classList.add("ocultar");
        } else {
            menufull.classList.remove("ocultar");
            menufull.style.cursor = "pointer";
        }

        timerId = setTimeout(() => {
            menufull.classList.add("ocultar");
            menufull.style.cursor = "none";
            outputDiv.addEventListener("mousemove", handleMouseMove);
        }, 5000);
    };

    outputDiv.addEventListener("mousemove", handleMouseMove);

}
