// main.ts - TypeScript version of main.js
export function main(): void {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = `
        <h1>Welcome to your Basic TypeScript/JS SPA!</h1>
        <nav>
            <a href="#" id="home-link">Home</a> |
            <a href="#about" id="about-link">About</a>
        </nav>
        <div id="view"></div>
    `;
    
    function render(route: string): void {
        const view = document.getElementById('view');
        if (!view) return;
        if (route === 'about') {
            view.innerHTML = '<p>This is the About page.</p>';
        } else {
            view.innerHTML = '<p>This is the Home page.</p>';
        }
    }

    (document.getElementById('home-link') as HTMLAnchorElement).onclick = (e) => {
        e.preventDefault();
        render('home');
    };
    (document.getElementById('about-link') as HTMLAnchorElement).onclick = (e) => {
        e.preventDefault();
        render('about');
    };

    render('home');
}
