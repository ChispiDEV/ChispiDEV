/*!
* Start Bootstrap - Stylish Portfolio v6.0.6 (https://startbootstrap.com/theme/stylish-portfolio)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-stylish-portfolio/blob/master/LICENSE)
*/
window.addEventListener('DOMContentLoaded', event => {
    let scrollToTopVisible = false;

    // Alternar menú lateral
    const menuToggle = document.querySelector('.menu-toggle');
    const sidebarWrapper = document.getElementById('sidebar-wrapper');
    
    menuToggle.addEventListener('click', event => {
        event.preventDefault();
        sidebarWrapper.classList.toggle('active');
    })

    // Closes responsive menu when a scroll trigger link is clicked
    var scrollTriggerList = [].slice.call(document.querySelectorAll('#sidebar-wrapper .js-scroll-trigger'));
    scrollTriggerList.map(scrollTrigger => {
        scrollTrigger.addEventListener('click', () => {
            sidebarWrapper.classList.remove('active');
            menuToggle.classList.remove('active');
            _toggleMenuIcon();
        })
    });

    function _toggleMenuIcon() {
        const menuToggleBars = document.body.querySelector('.menu-toggle > .fa-bars');
        const menuToggleTimes = document.body.querySelector('.menu-toggle > .fa-xmark');
        if (menuToggleBars) {
            menuToggleBars.classList.remove('fa-bars');
            menuToggleBars.classList.add('fa-xmark');
        }
        if (menuToggleTimes) {
            menuToggleTimes.classList.remove('fa-xmark');
            menuToggleTimes.classList.add('fa-bars');
        }
    }

    function toggleMenu() {
        const sidebar = document.getElementById('sidebar-wrapper');
        sidebar.classList.toggle('open');
    }
    

    // Scroll to top button appear
    const scrollToTop = document.body.querySelector('.scroll-to-top');
    document.addEventListener('scroll', () => {
        if (document.documentElement.scrollTop > 100) {
            if (!scrollToTopVisible) {
                fadeIn(scrollToTop);
                scrollToTopVisible = true;
            }
        } else {
            if (scrollToTopVisible) {
                fadeOut(scrollToTop);
                scrollToTopVisible = false;
            }
        }
    });

    // Evento de clic para el botón de "scroll to top"
    scrollToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // Función de fade in/out
    function fadeOut(el) {
        if (!el) return;
        el.style.opacity = 1;
        (function fade() {
            if ((el.style.opacity -= .1) < 0) {
                el.style.display = "none";
            } else {
                requestAnimationFrame(fade);
            }
        })();
    };

    function fadeIn(el, display) {
        if (!el) return;
        el.style.opacity = 0;
        el.style.display = display || "block";
        (function fade() {
            let val = parseFloat(el.style.opacity);
            if (!((val += .1) > 1)) {
                el.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    };

    // Chatbot toggle
    const chatbotToggle = document.getElementById('chatbot-toggle');
    const chatbotContainer = document.getElementById('chatbot-container');

    chatbotToggle.addEventListener('click', () => {
        const isVisible = chatbotContainer.style.display === 'block';
        chatbotContainer.style.display = isVisible ? 'none' : 'block';
    });

    const navItems = document.getElementById('nav-items');
    const contentDiv = document.getElementById('readme-content');

    // Función para procesar el README.md y generar contenido dinámico
    const processReadme = () => {
        // Leer y procesar el archivo README.md
        fetch('https://raw.githubusercontent.com/ChispiDEV/ChispiDEV/main/README.md')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al cargar el README.md (status ${response.status})');
                }    
                return response.text();
            })
            .then(markdown => {
                console.log("Markdown cargado correctamente:", markdown); // Depuración
                const converter = new showdown.Converter();
                const contentDiv = document.getElementById('readme-content');
                const sidebar = document.getElementById('nav-items');

                // Dividir contenido por secciones principales
                const sections = markdown.split(/^# /m).filter(section => section.trim() !== ""); // Dividir por encabezados de nivel 1
                console.log("Secciones detectadas:", sections); // Depuración

                let language = 'spanish'; // Idioma predeterminado

                // Función para filtrar contenido según idioma
                const renderContent = lang => {
                    // Encontrar la sección correspondiente al idioma
                    const languageSection = sections.find(section =>
                        lang === 'english'
                            ? section.startsWith('English Version')
                            : section.startsWith('Versión en Español')
                    );

                    if (!languageSection) {
                        contentDiv.innerHTML = `<p>No se encontró contenido para el idioma seleccionado (${lang}).</p>`;
                        navItems.innerHTML = '';
                        return;
                    }

                    // Dividir la sección en subtítulos (`##`)
                    const subsections = languageSection
                        .split(/^## /m) // Dividir por subtítulos de nivel 2
                        .filter(subsection => subsection.trim() !== "") // Eliminar partes vacías
                        .map((subsection, index) => ({
                            id: `section-${index}`,
                            content: subsection.trim(),
                            title: subsection.split('\n')[0].trim() // El título es la primera línea
                        }));

                        console.log("Subsecciones detectadas:", subsections); // Depuración

                    // Generar el menú dinámico
                    navItems.innerHTML = '';
                    subsections.forEach(subsection => {
                        const listItem = document.createElement('li');
                        listItem.classList.add('sidebar-nav-item');
                        listItem.innerHTML = `<a href="#${subsection.id}">${subsection.title}</a>`;
                        navItems.appendChild(listItem);
                    });


                    // Renderizar el contenido
                    const colors = [
                        'bg-color-1', 'bg-color-2', 'bg-color-3', 'bg-color-4', 'bg-color-5', 
                        'bg-color-6', 'bg-color-7', 'bg-color-8', 'bg-color-9', 'bg-color-10', 
                        'bg-color-11', 'bg-color-12', 'bg-color-13', 'bg-color-14', 'bg-color-15'
                    ]; // Paleta de colores

                    contentDiv.innerHTML = subsections
                        .map((sub, idx) => `
                            <div id="${sub.id}" class="${colors[idx % colors.length]}" style="padding: 20px; margin-bottom: 20px; border-radius: 10px;">
                                <h2>${sub.title}</h2>
                                ${converter.makeHtml(sub.content.replace(sub.title, '').trim())}
                            </div>
                        `)
                        .join('');
                };

                // Alternar idioma
                window.toggleLanguage = lang => {
                    language = lang;
                    renderContent(language);
                };

                // Renderizar contenido inicial
                renderContent(language);
            })
            .catch(error => {
                console.error('Error procesando el README:', error);
                contentDiv.innerHTML = '<p>Error cargando contenido.</p>';
            });
    };

    // Procesar el README.md al cargar la página
    processReadme();
});
