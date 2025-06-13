# PDC Browser

A simple tabbed web browser built with PyQt5 and QtWebEngine.

## Dependencies

- Python 3.9 or higher
- PyQt5
- PyQtWebEngine

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/QTwebBrowser.git
   cd QTwebBrowser
   ```

2. Create a virtual environment (optional but recommended):
   ```bash
   python3 -m venv venv
   source venv/bin/activate  # On macOS/Linux
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

Run the application:
```bash
python mac_browser.py
```

## Building for macOS

To build a standalone executable for macOS, use PyInstaller:
```bash
pip install pyinstaller
pyinstaller --onefile --windowed mac_browser.py
```

The executable will be available in the `dist` directory.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Features

- Multiple tabs support
- Navigation controls (back, forward, reload)
- URL bar with automatic https:// prefix
- Modern UI with Fusion style
- Tab management (add/close tabs)

## Note

This is a basic browser implementation. For security and privacy, it's recommended to use established browsers like Chrome, Firefox, or Safari for regular web browsing. 