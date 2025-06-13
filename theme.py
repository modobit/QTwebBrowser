# theme.py

# Example QSS theme for the PDC browser interface
PDC_THEME_QSS = """
QMainWindow {
    background-color: #f5f5f5;
}
QToolBar {
    background: #666;
    spacing: 6px;
    padding: 4px;
}
QPushButton {
    background-color: #555;
    color: #fff;
    border-radius: 4px;
    padding: 4px 10px;
}
QPushButton:hover {
    background-color: #777;
}
QLineEdit {
    background: #fff;
    color: #222;
    border: 1px solid #aaa;
    border-radius: 4px;
    padding: 4px 8px;
}
QTabWidget::pane {
    border: 1px solid #aaa;
    top: -1px;
}
QTabBar::tab {
    background: #ddd;
    color: #222;
    border: 1px solid #aaa;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    padding: 6px 16px;
    margin-right: 2px;
}
QTabBar::tab:selected {
    background: #666;
    color: #000;
    border-bottom: 1px solid #fff;
}
"""

# Dark mode Fusion-like theme for the browser interface
FUSION_THEME_QSS = """
QMainWindow {
    background-color: #2b2b2b;
}
QToolBar {
    background: #1e1e1e;
    spacing: 6px;
    padding: 4px;
}
QPushButton {
    background-color: #3d3d3d;
    color: #ffffff;
    border-radius: 4px;
    padding: 4px 10px;
}
QPushButton:hover {
    background-color: #4d4d4d;
}
QLineEdit {
    background: #3d3d3d;
    color: #ffffff;
    border: 1px solid #555555;
    border-radius: 4px;
    padding: 4px 8px;
}
QTabWidget::pane {
    border: 1px solid #555555;
    top: -1px;
}
QTabBar::tab {
    background: #2b2b2b;
    color: #ffffff;
    border: 1px solid #555555;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    padding: 6px 16px;
    margin-right: 2px;
}
QTabBar::tab:selected {
    background: #3d3d3d;
    color: #ffffff;
    border-bottom: 1px solid #3d3d3d;
}
"""
