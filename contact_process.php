<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=UTF-8');
header('X-Content-Type-Options: nosniff');

function respond(int $status, bool $success, string $message): never
{
    http_response_code($status);

    echo json_encode(
        [
            'success' => $success,
            'message' => $message,
        ],
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

    exit;
}

function input(string $field): string
{
    $value = $_POST[$field] ?? '';

    return is_string($value) ? trim($value) : '';
}

function textLength(string $value): int
{
    return function_exists('mb_strlen') ? mb_strlen($value, 'UTF-8') : strlen($value);
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, false, 'Método de envio não permitido.');
}

// Campo invisível: bots costumam preenchê-lo, pessoas não.
if (input('website') !== '') {
    respond(200, true, 'Mensagem recebida com sucesso.');
}

$name = input('name');
$email = input('email');
$subject = input('subject');
$message = input('message');

if ($name === '' || $email === '' || $subject === '' || $message === '') {
    respond(422, false, 'Preencha todos os campos obrigatórios.');
}

if (textLength($name) < 2 || textLength($name) > 100) {
    respond(422, false, 'Informe um nome válido.');
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || textLength($email) > 254) {
    respond(422, false, 'Informe um endereço de e-mail válido.');
}

if (textLength($subject) < 3 || textLength($subject) > 150) {
    respond(422, false, 'O assunto deve ter entre 3 e 150 caracteres.');
}

if (textLength($message) < 10 || textLength($message) > 5000) {
    respond(422, false, 'A mensagem deve ter entre 10 e 5000 caracteres.');
}

if (preg_match('/[\r\n]/', $name . $email . $subject)) {
    respond(422, false, 'Os dados informados contêm caracteres inválidos.');
}

$recipient = 'wrconstrucoeseassessoria@gmail.com';
$mailSubject = 'Novo contato pelo site WR: ' . $subject;
$encodedSubject = '=?UTF-8?B?' . base64_encode($mailSubject) . '?=';
$encodedReplyName = '=?UTF-8?B?' . base64_encode($name) . '?=';
$sentAt = date('d/m/Y H:i:s');
$visitorIp = $_SERVER['REMOTE_ADDR'] ?? 'não identificado';

$mailBody = implode("\r\n", [
    'Nova mensagem enviada pelo site da WR Construções e Assessoria',
    '',
    'Nome: ' . $name,
    'E-mail: ' . $email,
    'Assunto: ' . $subject,
    '',
    'Mensagem:',
    $message,
    '',
    'Enviado em: ' . $sentAt,
    'IP: ' . $visitorIp,
]);

$headers = implode("\r\n", [
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'Content-Transfer-Encoding: 8bit',
    'Reply-To: ' . $encodedReplyName . ' <' . $email . '>',
    'X-Mailer: PHP/' . PHP_VERSION,
]);

$serverName = strtolower((string) ($_SERVER['SERVER_NAME'] ?? ''));
$isLocal = PHP_SAPI === 'cli-server'
    || in_array($serverName, ['localhost', '127.0.0.1', '::1'], true);

if ($isLocal) {
    respond(
        200,
        true,
        'Teste local concluído. Os dados foram validados, mas nenhum e-mail foi enviado.'
    );
}

if (!@mail($recipient, $encodedSubject, $mailBody, $headers)) {
    respond(500, false, 'Não foi possível enviar a mensagem agora. Tente novamente mais tarde.');
}

respond(200, true, 'Mensagem enviada com sucesso! Em breve entraremos em contato.');
