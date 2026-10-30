"""Start the local job search app from source or its packaged Windows executable."""

import getpass
import os
import threading
import time
import urllib.error
import urllib.request
import webbrowser

from openai import APIConnectionError, APIStatusError, AuthenticationError, OpenAI
from werkzeug.serving import make_server

from app import create_app


def prompt_for_api_key():
    while True:
        api_key = getpass.getpass('OpenAI API key (input is hidden): ').strip()
        if not api_key:
            print('The API key cannot be empty.')
            continue

        try:
            OpenAI(api_key=api_key, timeout=15, max_retries=0).models.list()
            return api_key
        except AuthenticationError:
            print('OpenAI rejected that key. Please check it and try again.')
        except APIConnectionError:
            print('Could not reach OpenAI. Check your internet connection, then try again.')
        except APIStatusError as error:
            print(f'OpenAI returned HTTP {error.status_code}. Please try again.')
        except Exception as error:
            print(f'Could not validate the key ({error}). Please try again.')


def wait_until_ready(url, server_thread, timeout=15):
    deadline = time.monotonic() + timeout
    while time.monotonic() < deadline and server_thread.is_alive():
        try:
            with urllib.request.urlopen(f'{url}healthz', timeout=1) as response:
                if response.status == 200:
                    return True
        except (OSError, urllib.error.URLError):
            time.sleep(0.1)
    return False


def main():
    print('This app uses your OpenAI API key to provide AI features.')
    api_key = prompt_for_api_key()
    os.environ['OPENAI_API_KEY'] = api_key

    server = make_server('127.0.0.1', 0, create_app(), threaded=True)
    url = f'http://127.0.0.1:{server.server_port}/'
    server_thread = threading.Thread(target=server.serve_forever, daemon=True)

    try:
        server_thread.start()
        if not wait_until_ready(url, server_thread):
            raise RuntimeError('The local web server did not start successfully.')

        print(f'App is running at {url}')
        print('Keep this window open while using the app. Press Ctrl+C to stop it.')
        webbrowser.open(url)
        while server_thread.is_alive():
            server_thread.join(timeout=1)
    except KeyboardInterrupt:
        print('\nStopping the app...')
    except Exception as error:
        print(f'Could not start the app: {error}')
        input('Press Enter to close this window.')
    finally:
        if server_thread.is_alive():
            server.shutdown()
            server_thread.join(timeout=5)
        server.server_close()


if __name__ == '__main__':
    main()
