<?php
header('Content-Type: application/json; charset=utf-8');

function contact_response($status, $ok, $message) {
    http_response_code($status);
    echo json_encode(['ok' => $ok, 'message' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

function contact_value($key, $default = '') {
    $value = $_POST[$key] ?? $default;
    if (!is_string($value)) {
        contact_response(422, false, 'Bitte fülle alle Felder korrekt aus.');
    }
    return trim($value);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    contact_response(405, false, 'Ungültige Anfrage.');
}
if (contact_value('website') !== '') {
    contact_response(200, true, 'Vielen Dank!');
}

$name = contact_value('name');
$email = contact_value('email');
$subject = contact_value('subject', 'Kontaktanfrage');
$message = contact_value('message');
$privacy = contact_value('privacy');

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '' || $privacy !== '1') {
    contact_response(422, false, 'Bitte fülle alle Pflichtfelder aus und bestätige den Datenschutzhinweis.');
}
if (strlen($name) > 480 || strlen($email) > 254 || strlen($subject) > 200 || strlen($message) > 40000) {
    contact_response(422, false, 'Eine deiner Angaben ist zu lang. Bitte kürze den Text.');
}

$to = 'DEINE-EMAIL@BEISPIEL.DE'; // Hier die tatsächliche Empfängeradresse eintragen.
if ($to === 'DEINE-EMAIL@BEISPIEL.DE' || !filter_var($to, FILTER_VALIDATE_EMAIL) || !function_exists('mail')) {
    contact_response(503, false, 'Der E-Mail-Versand ist noch nicht eingerichtet. Bitte kontaktiere uns direkt.');
}

$subject = preg_replace('/[\r\n]+/', ' ', $subject);
$mailSubject = '=?UTF-8?B?' . base64_encode('Voralb Liebe – ' . $subject) . '?=';
$body = "Neue Anfrage über voralbliebe.de\n\nName: $name\nE-Mail: $email\nThema: $subject\n\nNachricht:\n$message\n";
$headers = "From: Voralb Liebe Website <no-reply@voralbliebe.de>\r\n";
$headers .= "Reply-To: " . preg_replace('/[\r\n]+/', '', $email) . "\r\n";
$headers .= "MIME-Version: 1.0\r\nContent-Type: text/plain; charset=UTF-8\r\n";

if (@mail($to, $mailSubject, $body, $headers)) {
    contact_response(200, true, 'Vielen Dank! Deine Nachricht wurde gesendet.');
}
contact_response(500, false, 'Die Nachricht konnte gerade nicht gesendet werden. Bitte versuche es später noch einmal oder kontaktiere uns direkt.');
