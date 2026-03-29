<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>NN Werkbank</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">
</head>
<body class="bg-dark text-white">
    <div id="root">
        <div class="d-flex justify-content-center align-items-center" style="height: 100vh;">
            <div class="spinner-border text-info"></div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        const repo = "https://cdn.jsdelivr.net/gh/MR-cApZ/nn-werkbank@main/";
        
        async function load(file) {
            return new Promise(res => {
                const s = document.createElement('script');
                s.src = repo + file + "?v=" + Date.now();
                s.onload = () => res();
                document.body.appendChild(s);
            });
        }

        async function init() {
            await load('datenbank.js');
            await load('renderer.js');
            if (typeof startApp === 'function') startApp();
        }

        window.onload = init;
    </script>
</body>
</html>
