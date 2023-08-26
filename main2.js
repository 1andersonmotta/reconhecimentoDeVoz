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









}
