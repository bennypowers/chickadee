const t = document.createElement('template');
t.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16 2a14 14 0 1 0 14 14A14.016 14.016 0 0 0 16 2Zm0 26a12 12 0 1 1 12-12 12.014 12.014 0 0 1-12 12Z"/><path d="M16 14a1 1 0 0 0-1 1v7a1 1 0 0 0 2 0v-7a1 1 0 0 0-1-1Z"/><circle cx="16" cy="10.5" r="1.25"/></svg>`;
export default t.content.firstElementChild!;
