<?php

if (!isset($_SERVER['HTTPS']) || $_SERVER['HTTPS'] !== 'on') {
    // Se a solicitação não estiver usando HTTPS, redirecione para a versão HTTPS.
    $url = "https://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];
    header("Location: $url");
    exit();
}

$servername = "localhost";
$username = "root";
$password = "";
$dbname = "weather";

// Obtém os valores enviados pela URL
$temperature = $_GET["temp"];
$humidity = $_GET["humid"];

// Cria a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Insere os valores na tabela 'weather'
$sql = "INSERT INTO weather (wea_temp, wea_humid) VALUES ('$temperature', '$humidity')";

if ($conn->query($sql) === TRUE) {
    echo "New record created successfully";
} else {
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>