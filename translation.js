async function loadTranslation(text, langTo, langFor) {
    const res = await fetch(`https://api.mymemory.translated.net/get?q=${text}&langpair=${langTo}|${langFor}`
    ).then((res) => res.json())
    return res.responseData.translatedText
}

export default loadTranslation;