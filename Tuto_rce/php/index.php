<?php
// Vérifie si un fichier a été soumis
$message = '';
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Vérifie si le fichier a été correctement téléchargé
    if (isset($_FILES['file']) && $_FILES['file']['error'] === UPLOAD_ERR_OK) {
        $file = $_FILES['file'];

        // Vérifie la taille du fichier (1 Mo maximum)
        if ($file['size'] <= 1048576) {
            $uploadDir = 'uploads/';
            $uploadFile = $uploadDir . basename($file['name']);

            // Crée le dossier de destination s'il n'existe pas
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            // Déplace le fichier téléchargé vers le dossier cible
            if (move_uploaded_file($file['tmp_name'], $uploadFile)) {
                $message = "Le fichier a été téléchargé avec succès : " . htmlspecialchars($file['name']);
            } else {
                $message = "Erreur lors du téléchargement du fichier.";
            }
        } else {
            $message = "Le fichier dépasse la taille maximale autorisée de 1 Mo.";
        }
    } else {
        $message = "Aucun fichier n'a été téléchargé ou une erreur est survenue.";
    }
}
?>

<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload de fichier</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #f4f4f9;
        }
        .container {
            text-align: center;
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            width: 400px;
        }
        h1 {
            font-size: 24px;
            margin-bottom: 20px;
        }
        form {
            margin-bottom: 20px;
        }
        input[type="file"] {
            margin-bottom: 15px;
        }
        button {
            background-color: #007BFF;
            color: white;
            border: none;
            padding: 10px 20px;
            border-radius: 5px;
            cursor: pointer;
            font-size: 16px;
        }
        button:hover {
            background-color: #0056b3;
        }
        .message {
            margin-top: 15px;
            font-size: 14px;
            color: #333;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Uploader un fichier</h1>
        <form action="" method="post" enctype="multipart/form-data">
            <label for="file">Choisissez un fichier (max 1 Mo) :</label><br>
            <input type="file" name="file" id="file" required><br>
            <button type="submit">Uploader</button>
        </form>
        <?php if ($message): ?>
            <div class="message"><?= htmlspecialchars($message) ?></div>
        <?php endif; ?>
    </div>
</body>
</html>