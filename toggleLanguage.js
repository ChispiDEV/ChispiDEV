// Toggle between English and Spanish content
function toggleLanguage(language) {
    fetch('https://raw.githubusercontent.com/ChispiDEV/ChispiDEV/main/README.md')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch README.md');
            }
            return response.text();
        })
        .then(markdown => {
            console.log("Fetched Markdown:", markdown); // Debugging: Ver el contenido descargado
            const converter = new showdown.Converter();
            const contentDiv = document.getElementById('readme-content');

            // Divide the content into sections
            const sections = markdown.split(/^# /m); // Splits at each top-level heading
            console.log("Divided Sections:", sections); // Debugging: see divided sections

            let filteredContent = "";

            if (language === 'english') {
                filteredContent = sections.find(section => section.trim().startsWith('English Version'));
                contentDiv.className = "english";
            } else if (language === 'spanish') {
                filteredContent = sections.find(section => section.trim().startsWith('Versión en Español'));
                contentDiv.className = "spanish";
            }

            // Check if content was found
            if (filteredContent) {
                contentDiv.innerHTML = converter.makeHtml(`# ${filteredContent}`); // Re-add the top-level heading
            } else {
                contentDiv.innerHTML = '<p>Content not available for the selected language.</p>';
            }

            // Update navigation highlights
            document.querySelectorAll('nav a').forEach(link => {
                link.classList.remove('active');
                if (link.textContent.toLowerCase().includes(language)) {
                    link.classList.add('active');
                }
            });
        })
        .catch(error => {
            console.error('Error fetching or processing README:', error);
            document.getElementById('readme-content').innerHTML = '<p>Error loading content. Please try again later.</p>';
        });
}

// Detect language from URL or browser settings
function getLanguageFromURLOrBrowser() {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get('lang');

    if (lang === 'es') {
        return 'spanish';
    } else if (lang === 'en') {
        return 'english';
    }

    // Fallback to browser language
    const browserLanguage = navigator.language || navigator.userLanguage;
    if (browserLanguage.startsWith('es')) {
        return 'spanish';
    }

    // Default to English if no parameter is found
    return 'english';
}

// Initialize content based on URL or browser language
document.addEventListener('DOMContentLoaded', () => {
    const language = getLanguageFromURLOrBrowser();
    toggleLanguage(language);
});