<?php
header('Content-Type: application/json; charset=utf-8');

function order_response($status, $ok, $message) {
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function order_value($key) {
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) {
        order_response(422, false, 'Bitte fülle alle Felder korrekt aus.');
    }
    return trim($value);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    order_response(405, false, 'Ungültige Anfrage.');
}
if (order_value('website') !== '') {
    order_response(200, true, 'Vielen Dank!');
}

$name = order_value('name');
$email = order_value('email');
$address = order_value('address');
$note = order_value('note');
$items = order_value('items');
$privacy = order_value('privacy');

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $items === '' || $privacy !== '1') {
    order_response(422, false, 'Bitte fülle alle Pflichtfelder aus und bestätige den Datenschutzhinweis.');
}
if (strlen($name) > 480 || strlen($email) > 254 || strlen($address) > 2000 || strlen($note) > 40000 || strlen($items) > 40000) {
    order_response(422, false, 'Eine deiner Angaben ist zu lang. Bitte kürze den Text.');
}

$to = 'DEINE-EMAIL@BEISPIEL.DE'; // Hier die tatsächliche Empfängeradresse eintragen.
if ($to === 'DEINE-EMAIL@BEISPIEL.DE' || !filter_var($to, FILTER_VALIDATE_EMAIL) || !function_exists('mail')) {
    order_response(503, false, 'Der E-Mail-Versand ist noch nicht eingerichtet. Bitte kontaktiere uns direkt.');
}

$subject = '=?UTF-8?B?' . base64_encode('Voralb Liebe – neue Bestellanfrage') . '?=';
$body = "Neue Bestellanfrage über voralbliebe.de\n\nName: $name\nE-Mail: $email\nAdresse: $address\n\nArtikel:\n$items\n\nHinweis:\n$note\n";
$headers = "From: Voralb Liebe Shop <no-reply@voralbliebe.de>\r\n";
$headers .= "Reply-To: " . preg_replace('/[\r\n]+/', '', $email) . "\r\n";
$headers .= "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n";

if (@mail($to, $subject, $body, $headers)) {
    order_response(200, true, 'Vielen Dank! Deine Bestellanfrage wurde gesendet.');
}
order_response(500, false, 'Die Bestellanfrage konnte gerade nicht gesendet werden. Bitte versuche es später noch einmal oder kontaktiere uns direkt.');
