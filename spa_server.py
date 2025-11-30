#!/usr/bin/env python3
"""
Prosty serwer HTTP dla Single Page Application
Obsługuje routing SPA - wszystkie żądania przekierowuje do index.html
"""
import http.server
import socketserver
import os
from urllib.parse import urlparse

PORT = 5500

class SPARequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        # Parsuj ścieżkę URL
        parsed_path = urlparse(self.path)
        path = parsed_path.path
        
        # Jeśli żądanie dotyczy pliku, który fizycznie istnieje (np. .js, .css, obrazy)
        # obsłuż je standardowo
        if os.path.exists('.' + path) and os.path.isfile('.' + path):
            return http.server.SimpleHTTPRequestHandler.do_GET(self)
        
        # W przeciwnym razie (np. /movie/1, /login, /profile)
        # zwróć index.html, aby SPA mogło obsłużyć routing
        if not path.startswith('/js/') and not path.startswith('/css/') and not path.startswith('/images/'):
            self.path = '/index.html'
        
        return http.server.SimpleHTTPRequestHandler.do_GET(self)

if __name__ == '__main__':
    with socketserver.TCPServer(("", PORT), SPARequestHandler) as httpd:
        print(f"Serwer SPA uruchomiony na porcie {PORT}")
        print(f"Otwórz http://localhost:{PORT} w przeglądarce")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nZamykanie serwera...")
            httpd.shutdown()
