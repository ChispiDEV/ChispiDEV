import re
import os
import json
import requests
from bs4 import BeautifulSoup
from kaggle.api.kaggle_api_extended import KaggleApi

# Leer kaggle.json manualmente
kaggle_path = os.path.expanduser("~/.kaggle/kaggle.json")

if not os.path.exists(kaggle_path):
    print("❌ ERROR: El archivo kaggle.json no existe.")
    exit(1)

with open(kaggle_path, "r") as f:
    creds = json.load(f)

# Verificar si el username y key existen
if "username" not in creds or "key" not in creds:
    print("❌ ERROR: El archivo kaggle.json no tiene username o key.")
    exit(1)

os.environ["KAGGLE_USERNAME"] = creds["username"]
os.environ["KAGGLE_KEY"] = creds["key"]

# Autenticar manualmente
api = KaggleApi()
api.authenticate()

print("✅ Autenticación en Kaggle completada correctamente.")


# Web Scraping del perfil de Kaggle
url = f"https://www.kaggle.com/{creds['username']}"
response = requests.get(url)
soup = BeautifulSoup(response.text, "html.parser")

# Extraer datos básicos
name = soup.find("h1", class_="sc-dBMfYx").text.strip() if soup.find("h1") else "N/A"
followers = soup.find("span", text="Followers").find_next_sibling("span").text.strip() if soup.find("span", text="Followers") else "0"
following = soup.find("span", text="Following").find_next_sibling("span").text.strip() if soup.find("span", text="Following") else "0"
datasets = soup.find("span", text="Datasets").find_next_sibling("span").text.strip() if soup.find("span", text="Datasets") else "0"
notebooks = soup.find("span", text="Notebooks").find_next_sibling("span").text.strip() if soup.find("span", text="Notebooks") else "0"
competitions = soup.find("span", text="Competitions").find_next_sibling("span").text.strip() if soup.find("span", text="Competitions") else "0"
medals = soup.find("span", text="Medals").find_next_sibling("span").text.strip() if soup.find("span", text="Medals") else "0"

# Crear estadísticas en inglés
stats_en = f"""
## 📊 Kaggle Statistics
- **Name**: {name}
- **Followers**: {followers}
- **Following**: {following}
- **Datasets**: {datasets}
- **Notebooks**: {notebooks}
- **Competitions**: {competitions}
- **Medals**: {medals}
"""

# Crear estadísticas en español
stats_es = f"""
## 📊 Estadísticas de Kaggle
- **Nombre**: {name}
- **Seguidores**: {followers}
- **Siguiendo**: {following}
- **Datasets**: {datasets}
- **Notebooks**: {notebooks}
- **Competiciones**: {competitions}
- **Medallas**: {medals}
"""

# Escribir resultados en un archivo Markdown
with open("assets/kaggle_stats.md", "w", encoding="utf-8") as file:
    file.write(stats_en)

with open("assets/kaggle_stats_esp.md", "w", encoding="utf-8") as file:
    file.write(stats_es)

print("✅ Kaggle stats actualizadas correctamente.")

# Leer contenido de las estadísticas
with open("assets/kaggle_stats.md", "r", encoding="utf-8") as f:
    stats_content = f.read()

with open("assets/kaggle_stats_esp.md", "r", encoding="utf-8") as f:
    stats_content_esp = f.read()

# Leer el README
with open("README.md", "r", encoding="utf-8") as f:
    readme_content = f.read()

# Reemplazar la sección en el README
updated_readme = re.sub(
    r"<!-- KAGGLE-STATS -->.*?<!-- /KAGGLE-STATS -->",
    f"<!-- KAGGLE-STATS -->\n{stats_content}\n<!-- /KAGGLE-STATS -->",
    readme_content,
    flags=re.DOTALL
) + re.sub(
    r"<!-- ESTADISTICAS-KAGGLE -->.*?<!-- /ESTADISTICAS-KAGGLE -->",
    f"<!-- ESTADISTICAS-KAGGLE -->\n{stats_content_esp}\n<!-- /ESTADISTICAS-KAGGLE -->",
    readme_content,
    flags=re.DOTALL
)

# Guardar cambios en el README
with open("README.md", "w", encoding="utf-8") as f:
    f.write(updated_readme)

print("✅ README actualizado con nuevas estadísticas de Kaggle.")
