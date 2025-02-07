import { createRoot } from 'react-dom/client';
import { renderMedia, selectComposition } from '@remotion/renderer';
import App from './App';

const container = document.getElementById('root') as HTMLElement;
const root = createRoot(container);
root.render(<App />);

window.electron.ipcRenderer.sendMessage('ipc-example', ['ping']);
