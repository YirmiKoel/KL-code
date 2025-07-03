// Log om te bevestigen dat het juiste script wordt geladen
console.log('custom-brands-dropdown.js (versie met pre-load fix) wordt GELADEN.');

document.addEventListener('DOMContentLoaded', function() {
    console.log('DOMContentLoaded event afgevuurd, script start nu echt.');

    // Selecteer de trigger (de div die de link en het paneel bevat)
    const brandsDropdownTrigger = document.querySelector('#brands-header-dropdown');
    // Selecteer het daadwerkelijke paneel dat uitklapt
    const brandsDropdownPanel = document.querySelector('#brands-menu-content'); 

    // Controleer of beide cruciale elementen bestaan
    if (!brandsDropdownTrigger || !brandsDropdownPanel) {
        console.error('#brands-header-dropdown of #brands-menu-content element NIET GEVONDEN. Script stopt.');
        return;
    }
    console.log('#brands-header-dropdown en #brands-menu-content elementen GEVONDEN.');

    let brandsAreLoaded = false;        // Houdt bij of de merkdata al is opgehaald en verwerkt
    let brandsFetchInitiated = false;   // Houdt bij of het ophalen van merkdata al is gestart
    let hideDropdownTimer = null;       // Timer voor het vertraagd sluiten van de dropdown

    // Functie om de dropdown te tonen
    const showDropdown = () => {
        // Als er een timer loopt om de dropdown te sluiten, annuleer die
        if (hideDropdownTimer) {
            clearTimeout(hideDropdownTimer);
            hideDropdownTimer = null;
            console.log('Verberg-timer geannuleerd omdat muis weer over trigger/paneel is.');
        }
        // Voeg de 'dropdown-active' class toe aan de trigger om het paneel via CSS te tonen
        brandsDropdownTrigger.classList.add('dropdown-active');
        console.log('Dropdown geactiveerd (class dropdown-active toegevoegd aan trigger).');
        
        // Als de merken nog niet zijn opgehaald (of het ophalen nog niet is gestart), start het nu
        if (!brandsFetchInitiated) {
            loadAllBrands();
        }
    };

    // Functie om de dropdown te verbergen (door de 'dropdown-active' class te verwijderen)
    const hideDropdown = () => {
        brandsDropdownTrigger.classList.remove('dropdown-active');
        console.log('Dropdown gedeactiveerd (class dropdown-active verwijderd van trigger).');
    };

    // Functie om een timer te starten die de dropdown na een korte vertraging verbergt
    const startHideTimer = () => {
        // Maak een eventuele bestaande timer schoon
        if (hideDropdownTimer) {
            clearTimeout(hideDropdownTimer);
        }
        // Start een nieuwe timer
        hideDropdownTimer = setTimeout(() => {
            hideDropdown(); // Roep de functie aan die de dropdown daadwerkelijk sluit
        }, 250); // Wachttijd van 250ms (kwart seconde)
        console.log('Timer gestart om dropdown te verbergen na 250ms.');
    };

    // Functie om alle merken op te halen en de HTML voor de dropdown te genereren
    const loadAllBrands = () => {
        // Voorkom dubbel werk als het ophalen al gestart is
        if (brandsFetchInitiated) {
            if (brandsAreLoaded) {
                console.log('Merken zijn al geladen, ophaalactie overgeslagen.');
            } else {
                console.log('Merken worden al geladen, wacht op voltooiing.');
            }
            return;
        }
        brandsFetchInitiated = true; // Markeer dat het ophalen nu begint
        console.log('Functie loadAllBrands gestart (ophalen van merken van /brands/).');

        const gridContainer = brandsDropdownPanel.querySelector('.all-brands-grid-container'); // Zoek grid in paneel
        if (!gridContainer) {
            console.error('Grid container .all-brands-grid-container niet gevonden in paneel!');
            brandsFetchInitiated = false; // Reset vlag bij kritieke fout
            return;
        }
        console.log('.all-brands-grid-container GEVONDEN in paneel.');
        gridContainer.innerHTML = '<p style="text-align: center; padding: 20px 0; color: #777;">Merken worden geladen...</p>';


        fetch('/brands/') // Haal de HTML van de /brands/ pagina op
            .then(response => {
                console.log('Response ontvangen van /brands/. Status:', response.status);
                if (!response.ok) {
                    throw new Error(`Netwerkfout bij ophalen /brands/: Status ${response.status}`);
                }
                return response.text(); // Converteer de response naar tekst
            })
            .then(html => {
                console.log('HTML van /brands/ succesvol omgezet naar tekst.');
                const parser = new DOMParser();
                const doc = parser.parseFromString(html, 'text/html'); // Parse de HTML string
                
                // Probeer de merkt-links te vinden gebaseerd op de structuur van brands.rain
                const brandLinks = doc.querySelectorAll('.brands .row .col-lg-2 a'); 
                console.log(`Aantal merk-links gevonden met selector '.brands .row .col-lg-2 a': ${brandLinks.length}`);

                let newDropdownHtml = '';
                brandLinks.forEach(link => {
                    const image = link.querySelector('img');
                    // Controleer of er een afbeelding is en of het niet de placeholder is
                    if (image && image.src && !image.src.includes('placeholder-brand.svg')) {
                        const brandUrl = link.href;
                        const brandTitle = image.alt || link.title || 'Onbekend merk'; // Gebruik alt-tekst of titel
                        const imageUrl = image.src;

                        // Bouw de HTML voor elke merk-tegel
                        newDropdownHtml += `
                            <a href="${brandUrl}" title="${brandTitle}" class="brand-logo-link">
                                <img src="${imageUrl}" alt="${brandTitle}">
                            </a>
                        `;
                    }
                });
                
                console.log('HTML voor dropdown-content opgebouwd.');

                if (newDropdownHtml) {
                    gridContainer.innerHTML = newDropdownHtml; // Vul de grid container met de merken
                    console.log('Merken succesvol in de dropdown geplaatst.');
                } else {
                    gridContainer.innerHTML = '<p style="text-align: center; padding: 20px 0; color: #777;">Geen merken met een logo gevonden op de merkenpagina (na filteren).</p>';
                    console.log('Dropdown HTML was leeg (na filteren), melding "geen merken gevonden" geplaatst.');
                }
                brandsAreLoaded = true; // Markeer dat de merken nu geladen en verwerkt zijn
            })
            .catch(error => {
                console.error('!!! FOUT TIJDENS FETCH OF VERWERKING VAN MERKEN !!!:', error);
                if(gridContainer) {
                    gridContainer.innerHTML = '<p style="text-align: center; padding: 20px 0; color: #777;">Oeps, er ging iets mis bij het laden van de merken.</p>';
                }
                brandsFetchInitiated = false; // Reset vlaggen zodat een nieuwe poging mogelijk is
                brandsAreLoaded = false;
            });
    };

    // Event listeners voor de trigger (de div die de knop en het paneel omvat)
    brandsDropdownTrigger.addEventListener('mouseenter', showDropdown);
    brandsDropdownTrigger.addEventListener('mouseleave', startHideTimer);

    // Event listeners voor het paneel zelf (om het open te houden als de muis eroverheen beweegt)
    brandsDropdownPanel.addEventListener('mouseenter', showDropdown); 
    brandsDropdownPanel.addEventListener('mouseleave', startHideTimer);
    
    console.log('Event listeners voor mouseenter/mouseleave TOEGEVOEGD aan trigger en paneel.');

    /*
     * == FIX TOEGEPAST ==
     * Het vooraf laden van de merken is uitgeschakeld om een 'race condition' te voorkomen
     * die ervoor zorgde dat de dropdown direct bij het laden van de pagina opende.
     * De merken worden nu geladen bij de eerste 'mouseenter' (hover) van de gebruiker.
     *
    // Start het laden van de merken op de achtergrond (pre-loading)
    // Dit gebeurt alleen als het nog niet door een eerdere interactie is gestart.
    setTimeout(() => {
        // Alleen daadwerkelijk starten met ophalen als het nog niet is gebeurd
        if (!brandsFetchInitiated) { 
            console.log('Pre-load timer afgegaan: Starten met ophalen van merken via loadAllBrands().');
            loadAllBrands();
        } else {
            console.log('Pre-load timer afgegaan: Ophalen van merken was al gestart/voltooid.');
        }
    }, 1000); // Wachttijd van 1 seconde na het laden van de pagina
    console.log('Pre-loading van merken ingepland over 1 seconde.');
    */
});