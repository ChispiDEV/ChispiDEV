/*!
* Start Bootstrap - Stylish Portfolio v6.0.6 (https://startbootstrap.com/theme/stylish-portfolio)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-stylish-portfolio/blob/master/LICENSE)
*/
window.addEventListener('DOMContentLoaded', event => {

    const sidebarWrapper = document.getElementById('sidebar-wrapper');
    let scrollToTopVisible = false;

    // Closes the sidebar menu
    const menuToggle = document.body.querySelector('.menu-toggle');
    menuToggle.addEventListener('click', event => {
        event.preventDefault();
        sidebarWrapper.classList.toggle('active');
        _toggleMenuIcon();
        menuToggle.classList.toggle('active');
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

    // Scroll to top button appear
    document.addEventListener('scroll', () => {
        const scrollToTop = document.body.querySelector('.scroll-to-top');
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

    // Función de fade in/out
    function fadeOut(el) {
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
        el.style.opacity = 0;
        el.style.display = display || "block";
        (function fade() {
            var val = parseFloat(el.style.opacity);
            if (!((val += .1) > 1)) {
                el.style.opacity = val;
                requestAnimationFrame(fade);
            }
        })();
    };

    const navItems = document.getElementById('nav-items');
    const contentDiv = document.getElementById('readme-content');

    // Función para procesar el README.md y generar contenido dinámico
    const processReadme = () => {
        // Leer y procesar el archivo README.md
        fetch('https://raw.githubusercontent.com/ChispiDEV/ChispiDEV/main/README.md')
            .then(response => {
                if (!response.ok) throw new Error('Error al cargar el README.md');
                return response.text();
            })
            .then(markdown => {
                const sections = markdown.split(/^# /m).filter(section => section.trim() !== ""); // Dividir por encabezados de nivel 1
                const converter = new showdown.Converter();
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

                    // Generar el menú dinámico
                    navItems.innerHTML = '';
                    subsections.forEach(subsection => {
                        const listItem = document.createElement('li');
                        listItem.classList.add('sidebar-nav-item');
                        listItem.innerHTML = `<a href="#${subsection.id}">${subsection.title}</a>`;
                        navItems.appendChild(listItem);
                    });


                    // Renderizar el contenido
                    const colors = ["#f8f9fa", "#e9ecef", "#dee2e6", "#ced4da", "#adb5bd"]; // Paleta de colores

                    contentDiv.innerHTML = subsections
                        .map((subsection, index) => `
                            <div id="${subsection.id}" style="background-color: ${colors[index % colors.length]}; padding: 20px; margin-bottom: 20px; border-radius: 10px;">
                                <h2>${subsection.title}</h2>
                                ${converter.makeHtml(subsection.content.replace(subsection.title, '').trim())}
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
