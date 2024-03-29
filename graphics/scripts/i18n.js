const staticTranslationMap = {
    EN: {
        mainCastersTitle: 'Commentators',
        breakMainSupportUsTitle: 'Support us!',
        breakMainTimerTitle: 'Stream resumes',
        breakInfoBarWelcome: 'Welcome to<span class="low-ink-small-logo"><img src="img/li-logo-break-no-text.png"></span><span class="lemon-milk">Low Ink!</span>'
    },
    EU_FR: {
        mainCastersTitle: '[FR] Commentators',
        breakMainSupportUsTitle: '[FR] Support us!',
        breakMainTimerTitle: '[FR] Stream resumes',
        breakInfoBarWelcome: '[FR] Welcome to<span class="low-ink-small-logo"><img src="img/li-logo-break-no-text.png"></span><span class="lemon-milk">Low Ink!</span>'
    }
}

NodeCG.waitForReplicants(runtimeConfig).then(() => {
    runtimeConfig.on('change', (newValue, oldValue) => {
        doOnDifference(newValue, oldValue, 'locale', newLocale => {
            setStaticTranslations(document.body, newLocale);
        });
    });
});

function setStaticTranslations(element, locale) {
    const translations = staticTranslationMap[locale] == null ? staticTranslationMap['EN'] : staticTranslationMap[locale];
    const translatableElements = element.querySelectorAll('*[data-tl-key]');
    translatableElements.forEach(elem => {
        if ('tlUseInnerHtml' in elem.dataset) {
            elem.innerHTML = translations[elem.dataset.tlKey] || elem.dataset.tlKey;
        } else {
            elem.innerText = translations[elem.dataset.tlKey] || elem.dataset.tlKey;
        }
    });
}
