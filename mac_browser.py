import sys
from settings import APP_NAME, STYLE
from PyQt5.QtCore import QUrl, Qt
from PyQt5.QtWidgets import (QApplication, QMainWindow, QToolBar, QLineEdit,
                            QTabWidget, QWidget, QVBoxLayout, QPushButton, QAction)
from PyQt5.QtWebEngineWidgets import QWebEngineView
from PyQt5.QtGui import QIcon

class Browser(QMainWindow):
    def __init__(self):
        super().__init__()
        self.setWindowTitle(APP_NAME)
        self.setGeometry(100, 100, 1200, 800)
        
        # Create tab widget
        self.tabs = QTabWidget()
        self.tabs.setTabsClosable(True)
        self.tabs.tabCloseRequested.connect(self.close_tab)
        self.setCentralWidget(self.tabs)
        
        # Create toolbar
        self.toolbar = QToolBar()
        self.addToolBar(self.toolbar)
        
        # Navigation buttons
        self.back_btn = QPushButton("←")
        self.back_btn.clicked.connect(lambda: self.current_tab().back())
        self.toolbar.addWidget(self.back_btn)
        
        self.forward_btn = QPushButton("→")
        self.forward_btn.clicked.connect(lambda: self.current_tab().forward())
        self.toolbar.addWidget(self.forward_btn)
        
        self.reload_btn = QPushButton("↻")
        self.reload_btn.clicked.connect(lambda: self.current_tab().reload())
        self.toolbar.addWidget(self.reload_btn)
        
        # URL bar
        self.url_bar = QLineEdit()
        self.url_bar.returnPressed.connect(self.navigate_to_url)
        self.toolbar.addWidget(self.url_bar)
        
        # New tab button
        self.new_tab_btn = QPushButton("+")
        self.new_tab_btn.clicked.connect(self.add_new_tab)
        self.toolbar.addWidget(self.new_tab_btn)
        
        # Add first tab
        self.add_new_tab()
        
    def add_new_tab(self, url=QUrl("https://www.google.com")):
        browser = QWebEngineView()
        browser.setUrl(url)
        
        # Add tab
        i = self.tabs.addTab(browser, "New Tab")
        self.tabs.setCurrentIndex(i)
        
        # Update URL bar when URL changes
        browser.urlChanged.connect(lambda qurl, browser=browser:
            self.update_url_bar(qurl, browser))
            
    def current_tab(self):
        return self.tabs.currentWidget()
        
    def close_tab(self, i):
        if self.tabs.count() > 1:
            self.tabs.removeTab(i)
        else:
            self.close()
            
    def navigate_to_url(self):
        url = self.url_bar.text()
        if not url.startswith(('http://', 'https://')):
            url = 'https://' + url
        self.current_tab().setUrl(QUrl(url))
        
    def update_url_bar(self, url, browser=None):
        if browser != self.current_tab():
            return
        self.url_bar.setText(url.toString())
        self.url_bar.setCursorPosition(0)

def main():
    app = QApplication(sys.argv)
    app.setStyle(STYLE)  # Use style from settings
    window = Browser()
    window.show()
    sys.exit(app.exec_())

if __name__ == '__main__':
    main() 