"""Editor local para preparar el contenido privado del regalo."""

import json
import shutil
from pathlib import Path
import tkinter as tk
from tkinter import filedialog, messagebox, ttk


ROOT = Path(__file__).resolve().parent
MEDIA = ROOT / 'media'
SETTINGS = ROOT / 'configuracion-privada.json'
DEFAULT_MUSIC = '../Flores amarillas Amistad/sound/ChristianBasso&HaienQiu-Flowers.mp3'


class Editor:
    def __init__(self, window: tk.Tk) -> None:
        self.window = window
        self.window.title('Configurar regalo')
        self.window.geometry('700x720')
        self.window.minsize(620, 600)
        self.media_files: list[dict[str, str]] = []
        self.video_path = ''
        self.music_path = ''

        frame = ttk.Frame(window, padding=22)
        frame.pack(fill='both', expand=True)
        ttk.Label(frame, text='Configurar regalo', font=('Georgia', 23)).pack(anchor='w')
        ttk.Label(frame, text='Editor local: estos datos no se muestran como controles al visitante.').pack(anchor='w', pady=(5, 16))

        words = ttk.LabelFrame(frame, text='Dedicatoria', padding=12)
        words.pack(fill='x')
        self.recipient = self.add_entry(words, 'Para:', 'recipient')
        self.sender = self.add_entry(words, 'De:', 'sender')
        self.intro = self.add_entry(words, 'Texto de entrada:', 'intro')
        ttk.Label(words, text='Mensajes flotantes: uno por linea').pack(anchor='w', pady=(10, 3))
        self.messages = tk.Text(words, height=5, wrap='word')
        self.messages.pack(fill='x')

        media = ttk.LabelFrame(frame, text='Fotos, videos y musica', padding=12)
        media.pack(fill='both', expand=True, pady=(14, 0))
        self.media_list = tk.Listbox(media, height=7)
        self.media_list.pack(fill='x')
        media_buttons = ttk.Frame(media)
        media_buttons.pack(fill='x', pady=7)
        ttk.Button(media_buttons, text='Agregar fotos', command=self.add_photos).pack(side='left')
        ttk.Button(media_buttons, text='Quitar seleccionada', command=self.remove_photo).pack(side='left', padx=7)
        self.video_label = tk.StringVar(value='Ningun video seleccionado')
        ttk.Label(media, textvariable=self.video_label, wraplength=620).pack(anchor='w', pady=(8, 4))
        video_buttons = ttk.Frame(media)
        video_buttons.pack(fill='x')
        ttk.Button(video_buttons, text='Elegir video', command=self.choose_video).pack(side='left')
        ttk.Button(video_buttons, text='Quitar video', command=self.clear_video).pack(side='left', padx=7)
        self.music_label = tk.StringVar(value='Se usara la musica integrada')
        ttk.Label(media, textvariable=self.music_label, wraplength=620).pack(anchor='w', pady=(14, 4))
        music_buttons = ttk.Frame(media)
        music_buttons.pack(fill='x')
        ttk.Button(music_buttons, text='Elegir musica', command=self.choose_music).pack(side='left')
        ttk.Button(music_buttons, text='Usar musica integrada', command=self.clear_music).pack(side='left', padx=7)

        ttk.Button(frame, text='Guardar configuracion', command=self.save).pack(fill='x', pady=(16, 0))
        self.load_settings()

    def add_entry(self, parent: ttk.Frame, label: str, name: str) -> tk.StringVar:
        ttk.Label(parent, text=label).pack(anchor='w', pady=(5, 2))
        value = tk.StringVar()
        setattr(self, name, value)
        ttk.Entry(parent, textvariable=value).pack(fill='x')
        return value

    def load_settings(self) -> None:
        settings = {}
        if SETTINGS.is_file():
            try:
                settings = json.loads(SETTINGS.read_text(encoding='utf-8'))
            except (OSError, ValueError):
                settings = {}
        if not settings:
            settings = self.read_public_config()
        self.recipient.set(settings.get('recipient', ''))
        self.sender.set(settings.get('sender', ''))
        self.intro.set(settings.get('intro', ''))
        messages_text = settings.get('messages_text', '')
        if not messages_text and settings.get('messages'):
            messages_text = '\n'.join(message.get('text', '') for message in settings['messages'])
        self.messages.insert('1.0', messages_text)
        self.media_files = settings.get('media_files', [])
        self.video_path = settings.get('video_path', '')
        self.music_path = settings.get('music_path', '')
        self.video_label.set(Path(self.video_path).name if self.video_path else 'Ningun video seleccionado')
        self.music_label.set(Path(self.music_path).name if self.music_path else 'Se usara la musica integrada')
        self.refresh_media()

    def read_public_config(self) -> dict:
        config_file = ROOT / 'site-config.js'
        if not config_file.is_file():
            return {}
        try:
            content = config_file.read_text(encoding='utf-8')
            payload = content.split('window.FLOWERS_CONFIG = ', 1)[1].rsplit(';', 1)[0].strip()
            return json.loads(payload)
        except (IndexError, OSError, ValueError):
            return {}

    def add_photos(self) -> None:
        paths = filedialog.askopenfilenames(
            title='Seleccionar fotografias',
            filetypes=[('Fotografias', '*.jpg *.jpeg *.png *.webp')],
        )
        for path in paths:
            self.media_files.append({'source': path, 'type': 'image'})
        self.refresh_media()

    def remove_photo(self) -> None:
        selected = self.media_list.curselection()
        if selected:
            self.media_files.pop(selected[0])
            self.refresh_media()

    def refresh_media(self) -> None:
        self.media_list.delete(0, 'end')
        for item in self.media_files:
            self.media_list.insert('end', Path(item['source']).name)

    def choose_video(self) -> None:
        path = filedialog.askopenfilename(title='Seleccionar video', filetypes=[('Videos', '*.mp4 *.webm')])
        if path:
            self.video_path = path
            self.video_label.set(Path(path).name)

    def clear_video(self) -> None:
        self.video_path = ''
        self.video_label.set('Ningun video seleccionado')

    def choose_music(self) -> None:
        path = filedialog.askopenfilename(title='Seleccionar musica', filetypes=[('Audio', '*.mp3 *.m4a *.ogg *.wav')])
        if path:
            self.music_path = path
            self.music_label.set(Path(path).name)

    def clear_music(self) -> None:
        self.music_path = ''
        self.music_label.set('Se usara la musica integrada')

    def copy_media(self, source: str) -> str:
        MEDIA.mkdir(exist_ok=True)
        source_path = Path(source)
        target = MEDIA / source_path.name
        if source_path.resolve() != target.resolve():
            shutil.copy2(source_path, target)
        return f'media/{target.name}'

    def save(self) -> None:
        media = [
            {'type': item['type'], 'src': self.copy_media(item['source']), 'text': Path(item['source']).stem, 'label': 'nuestro momento'}
            for item in self.media_files
        ]
        if self.video_path:
            media.append({'type': 'video', 'src': self.copy_media(self.video_path), 'text': 'Un instante que guardo contigo.', 'label': 'un instante'})
        messages = [
            {'text': line.strip(), 'label': 'para ti'}
            for line in self.messages.get('1.0', 'end').splitlines()
            if line.strip()
        ]
        config = {
            'recipient': self.recipient.get().strip(),
            'sender': self.sender.get().strip(),
            'intro': self.intro.get().strip(),
            'messages': messages,
            'media': media,
            'song': {'src': self.copy_media(self.music_path) if self.music_path else DEFAULT_MUSIC},
        }
        output = 'window.FLOWERS_CONFIG = ' + json.dumps(config, ensure_ascii=True, indent=4) + ';\n'
        (ROOT / 'site-config.js').write_text(output, encoding='utf-8')
        SETTINGS.write_text(json.dumps({
            'recipient': self.recipient.get().strip(),
            'sender': self.sender.get().strip(),
            'intro': self.intro.get().strip(),
            'messages_text': self.messages.get('1.0', 'end').strip(),
            'media_files': self.media_files,
            'video_path': self.video_path,
            'music_path': self.music_path,
        }, ensure_ascii=True, indent=4), encoding='utf-8')
        messagebox.showinfo('Configuracion guardada', 'Listo. Abre index.html para ver el resultado.')


if __name__ == '__main__':
    root = tk.Tk()
    Editor(root)
    root.mainloop()
