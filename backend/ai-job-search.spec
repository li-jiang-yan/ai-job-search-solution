from pathlib import Path

from PyInstaller.utils.hooks import collect_submodules

backend_directory = Path(SPECPATH)
repository_directory = backend_directory.parent
frontend_build = repository_directory / 'vite-project' / 'dist'

a = Analysis(
    [str(backend_directory / 'launcher.py')],
    pathex=[str(backend_directory)],
    binaries=[],
    datas=[(str(frontend_build), 'frontend')],
    hiddenimports=collect_submodules('app'),
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    noarchive=False,
    optimize=0,
)
pyz = PYZ(a.pure)
exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.datas,
    [],
    name='IntelligentJobSearchTool',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    console=True,
    disable_windowed_traceback=False,
    icon=str(backend_directory / 'assets' / 'briefcase-fill.ico'),
)
