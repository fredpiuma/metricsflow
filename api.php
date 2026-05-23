<?php
header('Content-Type: application/json');

$dataDir = __DIR__ . '/data/';
if (!is_dir($dataDir)) mkdir($dataDir, 0755, true);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    $raw  = $body['raw'] ?? '';
    if (!$raw) {
        http_response_code(400);
        echo json_encode(['error' => 'empty']);
        exit;
    }

    $uuid = sprintf(
        '%04x%04x-%04x-%04x-%04x-%04x%04x%04x',
        mt_rand(0, 0xffff), mt_rand(0, 0xffff),
        mt_rand(0, 0xffff),
        mt_rand(0, 0x0fff) | 0x4000,
        mt_rand(0, 0x3fff) | 0x8000,
        mt_rand(0, 0xffff), mt_rand(0, 0xffff), mt_rand(0, 0xffff)
    );
    $key = date('Y-m-d') . '-' . $uuid;

    file_put_contents(
        $dataDir . $key . '.json',
        json_encode(['raw' => $raw, 'saved_at' => date('c')])
    );

    echo json_encode(['key' => $key]);
    exit;
}

// GET
$key = $_GET['key'] ?? '';
if (!preg_match('/^\d{4}-\d{2}-\d{2}-[a-f0-9-]+$/', $key)) {
    http_response_code(400);
    echo json_encode(['error' => 'invalid key']);
    exit;
}

$file = $dataDir . $key . '.json';
if (!file_exists($file)) {
    http_response_code(404);
    echo json_encode(['error' => 'not found']);
    exit;
}

$data = json_decode(file_get_contents($file), true);
echo json_encode(['raw' => $data['raw']]);
