<?php
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false,'message'=>'Ungültige Anfrage.']); exit; }
if (!empty($_POST['website'] ?? '')) { echo json_encode(['ok'=>true,'message'=>'Vielen Dank!']); exit; }
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$address = trim($_POST['address'] ?? '');
$note = trim($_POST['note'] ?? '');
$items = trim($_POST['items'] ?? '');
if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $items === '') { http_response_code(422); echo json_encode(['ok'=>false,'message'=>'Bitte fülle die Pflichtfelder korrekt aus.']); exit; }
$to = 'DEINE-EMAIL@BEISPIEL.DE'; // TODO: vor Veröffentlichung ersetzen
$subject = 'Voralb Liebe – neue Bestellanfrage';
$body = "Neue Bestellanfrage über voralbliebe.de\n\nName: $name\nE-Mail: $email\nAdresse: $address\n\nArtikel:\n$items\n\nHinweis:\n$note\n";
$headers = "From: Voralb Liebe Shop <no-reply@voralbliebe.de>\r\n";
$headers .= "Reply-To: " . preg_replace('/[\r\n]+/', '', $email) . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$ok = @mail($to, $subject, $body, $headers);
if ($ok) echo json_encode(['ok'=>true,'message'=>'Vielen Dank! Deine Bestellanfrage wurde gesendet.']);
else { http_response_code(500); echo json_encode(['ok'=>false,'message'=>'Der Versand ist noch nicht eingerichtet. Bitte hinterlege zuerst die Empfänger-E-Mail in order.php.']); }
