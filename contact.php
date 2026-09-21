<?php
header('Content-Type: application/json; charset=utf-8');
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { http_response_code(405); echo json_encode(['ok'=>false,'message'=>'Ungültige Anfrage.']); exit; }
if (!empty($_POST['website'] ?? '')) { echo json_encode(['ok'=>true,'message'=>'Vielen Dank!']); exit; }
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$subject = trim($_POST['subject'] ?? 'Kontaktanfrage');
$message = trim($_POST['message'] ?? '');
if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '') { http_response_code(422); echo json_encode(['ok'=>false,'message'=>'Bitte fülle alle Pflichtfelder korrekt aus.']); exit; }
$to = 'DEINE-EMAIL@BEISPIEL.DE'; // TODO: vor Veröffentlichung ersetzen
$mailSubject = 'Voralb Liebe – ' . preg_replace('/[\r\n]+/', ' ', $subject);
$body = "Neue Anfrage über voralbliebe.de\n\nName: $name\nE-Mail: $email\nThema: $subject\n\nNachricht:\n$message\n";
$headers = "From: Voralb Liebe Website <no-reply@voralbliebe.de>\r\n";
$headers .= "Reply-To: " . preg_replace('/[\r\n]+/', '', $email) . "\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$ok = @mail($to, $mailSubject, $body, $headers);
if ($ok) echo json_encode(['ok'=>true,'message'=>'Vielen Dank! Deine Nachricht wurde gesendet.']);
else { http_response_code(500); echo json_encode(['ok'=>false,'message'=>'Der Versand ist noch nicht eingerichtet. Bitte hinterlege zuerst die Empfänger-E-Mail in contact.php.']); }
