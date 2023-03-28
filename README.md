<h1>XADREZ</h1>
<h2>Requirements</h2>
<h3>Language version (backend):</h3>
- [Python](https://www.python.org/)3.10.9

<h4>Recommendations</h4>
<!-- https://docs.python.org/3/library/venv.html -->
<!-- https://www.freecodecamp.org/news/how-to-setup-virtual-environments-in-python/ -->
Install [Pyenv](https://realpython.com/intro-to-pyenv/#installing-pyenv) for managing multiple Python versions.

Install python3.10.9, in the "server" directory use the correct version:

```bash
cd server
pyenv install -v 3.10.9
pyenv local 3.10.9
```

if you already have other versions of python installed (including versions preceding python3.3) it is recommended to use [virtualenv](https://packaging.python.org/en/latest/guides/installing-using-pip-and-virtual-environments/), if you already have other versions (exclusively versions equal or newer than python3.3), use pyenv-virtualenv or venv, which by default does not require installation, follow the steps below to use venv:

Create a virtual environment called "proj_env" in the "server" directory and activate this virtual environment:

Unix/macOS:
```bash
python3.10 -m venv proj_env
source proj_env/bin/activate
pip3 install -r requirements.txt
```

Windows(prompt):
```bash
python -m venv proj_env
proj_env\Scripts\activate.bat
pip install -r requirements.txt
```

<!--
create/update requirementes.txt: 
  pip3 freeze > requirements.txt 
-->

And to leave the virtual environment:
```bash
deactivate
```
<h4>Install/update package dependencies</h4>
Unix/macOS:
```bash
python3 -m pip install requirements
```

Windows:
```bash
python -m pip install requirements
```


<h3>Runtime environment (frontend):</h3>
- [Node](https://nodejs.org/en/download)18.15.0 LTS

<h4>Recommendatios</h4>
if you already have other node version(s) installed, follow the steps below:
Install [Volta](https://docs.volta.sh/guide/getting-started) for managing multiple node versions.

Install node18.15.0 LTS, and in the "web" directory use the correct version:

Linux, MacOS, Windows:
```bash
cd web
volta install node@18.15.0
```

<h4>Install/update package dependencies</h4>
```bash
npm install
```

<h2>Run application</h2>
<h3>Backend server</h3>
in the server directory, type:
```bash
python3.10 app.py
```

<h3>Frontend runtime environment</h3>
in the web directory, type:
```bash
npm run dev
```