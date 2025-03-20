import re
import os
import json
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
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

# Obtener datos de la API de Kaggle
# Cantidad de datasets publicados
datasets = api.dataset_list(user=creds["username"])
datasets_count = len(datasets)
# Cantidad de notebooks publicados
notebooks = api.kernels_list(user=creds["username"])
notebooks_count = len(notebooks)
# Competiciones activas (No muestra participación)
competitions = api.competitions_list()
competitions_count = len(competitions)

# Configurar Selenium (headless mode)
chrome_options = Options()
chrome_options.add_argument("--headless")
chrome_options.add_argument("--disable-gpu")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-dev-shm-usage")

service = Service("/usr/bin/chromedriver")  # Ruta del driver (ajústala según tu sistema)
driver = webdriver.Chrome(service=service, options=chrome_options)

# Acceder al perfil de Kaggle
url = f"https://www.kaggle.com/{creds['username']}"
driver.get(url)
time.sleep(5)  # Esperar a que la página cargue

# Extraer información
try:
    name = driver.find_element(By.TAG_NAME, "h1").text.strip()
except:
    name = "N/A"

try:
    followers = driver.find_element(By.XPATH, "//span[text()='Followers']/following-sibling::span").text.strip()
except:
    followers = "0"

try:
    following = driver.find_element(By.XPATH, "//span[text()='Following']/following-sibling::span").text.strip()
except:
    following = "0"

try:
    medals = driver.find_element(By.XPATH, "//span[text()='Medals']/following-sibling::span").text.strip()
except:
    medals = "0"

# 📌 Cerrar Selenium
driver.quit()

print("📊 Nombre:", name)
print("📊 Seguidores:", followers)
print("📊 Siguiendo:", following)
print("📊 Medallas:", medals)
print("📊 Datasets publicados:", datasets_count)
print("📊 Notebooks publicados:", notebooks_count)
print("📊 Competiciones activas en Kaggle:", competitions_count)

# Crear estadísticas en inglés
stats_en = f"""
<!-- KAGGLE-STATS -->
## 📊 Kaggle Statistics
- **Name**: {name}
- **Followers**: {followers}
- **Following**: {following}
- **Datasets**: {datasets}
- **Notebooks**: {notebooks}
- **Competitions**: {competitions}
- **Medals**: {medals}
<!-- /KAGGLE-STATS -->
"""

# Crear estadísticas en español
stats_es = f"""
<!-- ESTADISTICAS-KAGGLE -->
## 📊 Estadísticas de Kaggle
- **Nombre**: {name}
- **Seguidores**: {followers}
- **Siguiendo**: {following}
- **Datasets**: {datasets}
- **Notebooks**: {notebooks}
- **Competiciones**: {competitions}
- **Medallas**: {medals}
<!-- /ESTADISTICAS-KAGGLE -->
"""

# Leer el README
with open("README.md", "r", encoding="utf-8") as f:
    readme_content = f.read()

# Reemplazar la sección en el README
def replace_stats(match):
    tag = match.group(1)  # Captura el comentario de apertura
    if "KAGGLE-STATS" in tag:
        return stats_en  # Reemplaza con la versión en inglés
    elif "ESTADISTICAS-KAGGLE" in tag:
        return stats_es  # Reemplaza con la versión en español
    return match.group(0)  # En caso de no coincidir, devolver original

updated_readme = re.sub(
    r"(<!-- KAGGLE-STATS -->.*?<!-- /KAGGLE-STATS -->|<!-- ESTADISTICAS-KAGGLE -->.*?<!-- /ESTADISTICAS-KAGGLE -->)",
    replace_stats,
    readme_content,
    flags=re.DOTALL
)

# Guardar cambios en el README
with open("README.md", "w", encoding="utf-8") as f:
    f.write(updated_readme)

print("✅ README actualizado con nuevas estadísticas de Kaggle.")
